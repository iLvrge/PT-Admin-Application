// @vitest-environment node
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const walk = (dir, match) => {
  const out = []
  const go = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) go(full)
      else if (match(full)) out.push(full)
    }
  }
  go(dir)
  return out
}

const srcDir = path.join(root, 'src')
const jsFiles = walk(srcDir, (f) => /\.jsx?$/.test(f) && !/\.test\./.test(f))
const cssFiles = walk(srcDir, (f) => f.endsWith('.css'))
const read = (f) => fs.readFileSync(f, 'utf8')

/** Source with comments removed, so a comment about a rule cannot trip it. */
const withoutComments = (code) =>
  code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => {
      const at = line.search(/(^|[^:\w])\/\//)
      return at === -1 ? line : line.slice(0, at)
    })
    .join('\n')

const GENERATED_JS = /GENERATED from this module's former makeStyles object/
const GENERATED_CSS = /GENERATED from .* by scripts\/jss-to-css/

/**
 * The JSS -> CSS migration, pinned.
 *
 * These all fail silently rather than loudly: a reintroduced makeStyles puts a
 * style engine back in the bundle, and a shared namespace lets one component
 * restyle another. Both look like ordinary CSS bugs from the outside.
 */
describe('no JSS runtime left', () => {
  it('has no makeStyles call in application source', () => {
    const offenders = jsFiles
      .filter((f) => /makeStyles\s*\(/.test(withoutComments(read(f))))
      .map((f) => path.relative(root, f))
    expect(offenders).toEqual([])
  })

  it('imports nothing from @mui/styles', () => {
    const offenders = jsFiles
      .filter((f) => /@mui\/styles/.test(withoutComments(read(f))))
      .map((f) => path.relative(root, f))
    expect(offenders).toEqual([])
  })

  it('does not depend on @mui/styles at all', () => {
    const pkg = JSON.parse(read(path.join(root, 'package.json')))
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    expect(deps['@mui/styles']).toBeUndefined()
  })
})

describe('generated class names stay in their own namespace', () => {
  /*
   * makeStyles guaranteed uniqueness by generating names. Literal names are only
   * unique if the namespace is, so this runs the same check the build does.
   */
  it('has no class defined by two stylesheets', () => {
    let output = ''
    expect(() => {
      output = execFileSync('node', ['scripts/check-css-collisions.cjs'], {
        cwd: root, encoding: 'utf8',
      })
    }).not.toThrow()
    expect(output).toMatch(/^OK - \d+ class names/)
  })

  it('namespaces every generated class under pt-', () => {
    /*
     * Only the stylesheets this migration produced. The app also has
     * hand-written CSS beside components that predates it (.svg_diagram and
     * friends); renaming those would be a separate change with its own risk.
     */
    const sheets = cssFiles.filter((f) => GENERATED_CSS.test(read(f)))
    expect(sheets.length).toBeGreaterThan(25)

    const bad = new Set()
    for (const file of sheets) {
      const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '')
      for (const m of css.matchAll(/([^{}]+)\{/g)) {
        for (const sel of m[1].split(',')) {
          const rooted = sel.trim().match(/^\.([A-Za-z0-9_-]+)/)
          if (rooted && !rooted[1].startsWith('pt-')) bad.add(rooted[1])
        }
      }
    }
    /*
     * A selector rooted at anything but a pt- class is a global rule escaping
     * its component. That is not hypothetical: one nested key read
     *   '& .MuiTableRow-root.Mui-selected, .MuiTableRow-root.Mui-selected:hover'
     * and only the first half carried an `&`. jss-plugin-nested scopes every
     * branch of such a list to the parent; substituting `&` alone left the
     * second half global, which would have restyled every selected table row in
     * the application from one component's stylesheet.
     */
    expect([...bad]).toEqual([])
  })
})

describe('the class-name maps keep their old interface', () => {
  const generated = () => jsFiles.filter((f) => GENERATED_JS.test(read(f)))

  /*
   * Each generated module still exports a function returning { key: className },
   * so every `const classes = useStyles()` call site is untouched. Exporting a
   * plain object would have meant editing 45 components, each an opportunity
   * for a silent visual regression.
   */
  it('exports a callable that returns class-name strings', () => {
    const files = generated()
    expect(files.length).toBeGreaterThan(25)

    for (const file of files) {
      const text = read(file)
      expect(text, path.relative(root, file)).toMatch(/=>\s*\(\{/)
      expect(text, path.relative(root, file)).toMatch(/"pt-[a-z0-9-]+"/)
    }
  })

  it('imports its own stylesheet, so the CSS ships with the map', () => {
    for (const file of generated()) {
      expect(read(file), path.relative(root, file)).toMatch(/import\s+['"]\.\/[\w.-]+\.css['"]/)
    }
  })
})
