// @vitest-environment node
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

const sourceFiles = (() => {
  const out = []
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) walk(full)
      else if (/\.jsx?$/.test(e.name) && !/\.test\./.test(e.name)) out.push(full)
    }
  }
  walk(path.join(root, 'src'))
  return out.map((f) => ({ file: path.relative(root, f), text: fs.readFileSync(f, 'utf8') }))
})()

/**
 * Source with comments removed.
 *
 * Without this, a comment explaining one of these rules trips the rule it
 * explains - the note above the svg import in Header says "not require()", and
 * that alone failed the no-CommonJS check.
 */
const withoutComments = (code) =>
  code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((line) => {
      // Not a real parse: enough to drop `// ...` while leaving `://` in URLs.
      const at = line.search(/(^|[^:\w])\/\//)
      return at === -1 ? line : line.slice(0, at)
    })
    .join('\n')

const codeOnly = sourceFiles.map(({ file, text }) => ({ file, text: withoutComments(text) }))

/**
 * The v4 -> v5 migration, pinned.
 *
 * Every one of these is a silent failure: nothing throws, the app builds, and
 * the damage is either a second copy of MUI in the bundle or a screen quietly
 * rendering against the wrong theme.
 */
describe('no Material-UI v4 left behind', () => {
  it('imports nothing from @material-ui/*', () => {
    const offenders = codeOnly
      .filter(({ text }) => /@material-ui\//.test(text))
      .map(({ file }) => file)
    expect(offenders).toEqual([])
  })

  /*
   * material-table@1 is built against v4 and imports @material-ui/core itself.
   * Left in place it drags a whole second copy of MUI into the bundle, and its
   * tables render against a v4 theme context the app no longer provides.
   */
  it('uses the v5-compatible table fork', () => {
    const offenders = codeOnly
      .filter(({ text }) => /from\s+['"]material-table['"]/.test(text))
      .map(({ file }) => file)
    expect(offenders).toEqual([])

    const usesFork = codeOnly.some(({ text }) => /@material-table\/core/.test(text))
    expect(usesFork).toBe(true)
  })

  it('declares no dependency on the v4 packages', () => {
    const pkg = JSON.parse(read('package.json'))
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    expect(deps.filter((d) => d.startsWith('@material-ui/'))).toEqual([])
    expect(deps).not.toContain('material-table')
  })
})

describe('the theme reaches both style engines', () => {
  const entry = read('src/index.js')

  /*
   * @mui/styles' ThemeProvider only fills the legacy private-theming context
   * that makeStyles reads. It does NOT fill emotion's, so every v5 component
   * would fall back to MUI's DEFAULT theme - losing this app's palette while
   * makeStyles blocks kept working, which makes it look like a styling bug
   * rather than a missing provider. The one from @mui/material/styles fills
   * both.
   */
  it('takes ThemeProvider from @mui/material/styles, not @mui/styles', () => {
    expect(entry).toMatch(/ThemeProvider[^}]*}\s*from\s+["']@mui\/material\/styles["']/)
    expect(entry).not.toMatch(/ThemeProvider[^}]*}\s*from\s+["']@mui\/styles["']/)
  })

  it('puts emotion first so the app CSS can still win ties', () => {
    // injectFirst places emotion's <style> ahead of the app's own sheets.
    expect(entry).toMatch(/StyledEngineProvider\s+injectFirst/)
  })

  it('only takes makeStyles from the legacy package', () => {
    const wrong = codeOnly
      .filter(({ text }) => /\{[^}]*\b(ThemeProvider|createTheme)\b[^}]*\}\s*from\s+["']@mui\/styles["']/.test(text))
      .map(({ file }) => file)
    expect(wrong).toEqual([])
  })
})

describe('v4 component defaults are preserved', () => {
  const theme = read('src/themes/index.js')

  /*
   * v4 defaulted these to `standard` (an underline), v5 to `outlined` (a box).
   * No call site in this app passes `variant`, so without these every input
   * changes shape - including the sign-in form.
   */
  it.each([ 'MuiTextField', 'MuiSelect', 'MuiFormControl' ])(
    '%s still defaults to the standard variant',
    (component) => {
      expect(theme).toMatch(
        new RegExp(`${component}:\\s*\\{\\s*defaultProps:\\s*\\{\\s*variant:\\s*['"]standard['"]`)
      )
    }
  )

  it('adapts the v4 theme shape rather than silently dropping it', () => {
    expect(theme).toMatch(/adaptV4Theme\(/)
  })
})

describe('no CommonJS left for Vite to trip over', () => {
  /*
   * CRA's webpack resolved `require('./x.svg')` to the asset URL. Vite serves
   * ES modules and has no `require` at runtime, so one of these threw
   * "require is not defined" and took the whole dashboard down.
   */
  it('has no require() calls in application source', () => {
    const offenders = codeOnly
      .filter(({ text }) => /(?<![\w.])require\s*\(/.test(text))
      .map(({ file }) => file)
    expect(offenders).toEqual([])
  })
})

describe('hand-written svgs do not lean on MUI internals', () => {
  /*
   * In v4, `.MuiSvgIcon-root` was a real JSS class carrying
   * `width: 1em; height: 1em; fill: currentColor`, so a hand-pasted <svg> that
   * borrowed the class name was sized by it. In v5 that class is only a stable
   * hook - the styles live in an emotion-generated `css-*` class - so the same
   * svg gets no dimensions and renders as nothing.
   *
   * Six svgs in this app were pasted straight out of the DOM inspector,
   * className and all, including a literal `css-uqopch` hash. They rendered
   * under v4 and disappeared under v5: the Psychology icon in the Clients
   * header vanished, which is how this was found.
   */
  it('has no hardcoded emotion class hashes', () => {
    const offenders = codeOnly
      .filter(({ text }) => /\bcss-[a-z0-9]{6,8}\b/.test(text))
      .map(({ file }) => file)
    expect(offenders).toEqual([])
  })

  it('does not size a raw <svg> with MuiSvgIcon-root', () => {
    const offenders = codeOnly
      .filter(({ text }) => /<svg[^>]*className=[^>]*MuiSvgIcon-root/.test(text))
      .map(({ file }) => file)
    expect(offenders).toEqual([])
  })
})
