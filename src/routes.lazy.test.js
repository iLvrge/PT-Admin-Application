// @vitest-environment node
// Reads the files off disk rather than rendering, so it needs node, not jsdom.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

/**
 * The v3 stack, pinned.
 *
 * Each of these is a decision that is invisible in any single component and
 * silently reversible by an ordinary-looking edit - a static import added back
 * at the top of routes.js, a stray `@import "tailwindcss"`. None of them would
 * fail a render test; they would just make the bundle quietly bigger or the
 * styles quietly wrong.
 */
describe('route-level code splitting', () => {
  const routes = read('src/routes.js')

  it('loads every screen through a dynamic import', () => {
    for (const screen of [ 'DashBoard', 'Queries', 'auth' ]) {
      expect(routes).toMatch(new RegExp(`import\\(["']\\./components/[^"']*${screen}`))
    }
  })

  /*
   * A static import of a screen defeats the split entirely: the chunk is merged
   * back into the entry and every visitor downloads it, lazy route or not.
   */
  it('imports no screen statically', () => {
    const staticScreenImport =
      /^import\s+\w+\s+from\s+["']\.\/components\/(DashBoard|Queries|auth)/m
    expect(routes).not.toMatch(staticScreenImport)
  })

  it('wraps each screen in Suspense and an ErrorBoundary', () => {
    // React.lazy caches a rejected import, so a failed chunk needs a boundary
    // that offers a reload - without one the screen is permanently blank.
    expect(routes).toMatch(/<Suspense/)
    expect(routes).toMatch(/ErrorBoundary/)
    expect(routes).toMatch(/lazyWithRetry\(/)
  })

  it('forwards route props onto the page', () => {
    // react-router hands match/location/history to the element it renders,
    // which is the wrapper. /reset/:token reads match.params.
    expect(routes).toMatch(/cloneElement\(children, rest\)/)
  })
})

describe('build configuration', () => {
  const config = read('vite.config.js')

  it('parses JSX inside .js files', () => {
    // Every component in this app is .js containing JSX; the plugin default
    // would skip all of them.
    expect(config).toMatch(/include:\s*\/\\\.\(js\|jsx\)\$\//)
  })

  it('keeps the REACT_APP_ environment contract', () => {
    // The app reads process.env.REACT_APP_* in many places, as CRA provided.
    expect(config).toMatch(/REACT_APP_/)
    expect(config).toMatch(/process\.env\.NODE_ENV/)
  })

  /*
   * Naming vendor chunks makes Rollup hoist any library shared by two lazy
   * routes up to the entry, which turns lazily-loaded libraries into eager
   * ones. Measured on PT-App: initial load went from 1.12 MB to 3.00 MB.
   */
  it('does not hand-roll vendor chunks', () => {
    expect(config).not.toMatch(/manualChunks\s*[(:]/)
  })

  it('matches react-virtualized exactly, not by prefix', () => {
    // An object-key alias also rewrites 'react-virtualized/styles.css' into a
    // path that cannot exist, and the build fails on the stylesheet.
    expect(config).toMatch(/find:\s*\/\^react-virtualized\$\//)
  })
})

describe('Tailwind', () => {
  const css = read('src/styles/tailwind.css')

  it('takes the utilities without preflight', () => {
    // Preflight is a global reset; this app has never had one, and adding it
    // collapses margins the existing pages rely on.
    expect(css).toMatch(/@import "tailwindcss\/utilities\.css"/)
    expect(css).not.toMatch(/@import "tailwindcss"\s*;/)
  })

  it('leaves the utilities unlayered so they can beat MUI', () => {
    // Material-UI v4 injects through JSS with no @layer, and an unlayered rule
    // beats a layered one outright - specificity never enters into it.
    expect(css).not.toMatch(/@import "tailwindcss\/utilities\.css" layer\(/)
  })
})

describe('entry wiring', () => {
  const entry = read('src/index.js')

  it('provides the query client above the app', () => {
    expect(entry).toMatch(/QueryClientProvider/)
    expect(entry).toMatch(/from '\.\/lib\/queryClient'/)
  })

  it('imports the app stylesheet last, so it wins ties', () => {
    // Vite orders CSS by the module graph; CRA bundled it all up front.
    expect(entry.indexOf("'./styles/tailwind.css'"))
      .toBeLessThan(entry.indexOf("'./index.css'"))
  })
})
