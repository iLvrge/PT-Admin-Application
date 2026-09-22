import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // The app reads config through `process.env.REACT_APP_*`, as Create React App
  // provided. Mapping them here keeps the existing .env file and every call
  // site working, rather than rewriting them all to import.meta.env.
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith('REACT_APP_'))
    .reduce(
      (acc, key) => ({ ...acc, [`process.env.${key}`]: JSON.stringify(env[key]) }),
      {
        'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
        'process.env.PUBLIC_URL': JSON.stringify(''),
      }
    )

  return {
    plugins: [
      // JSX lives in .js files throughout src/, not .jsx - the default include
      // would skip every component in the app.
      react({ include: /\.(js|jsx)$/ }),
      svgr(),
      tailwindcss(),
    ],
    define: processEnv,
    envPrefix: [ 'REACT_APP_', 'VITE_' ],
    resolve: {
      /*
       * The array form, because these have to match EXACTLY.
       *
       * An alias written as an object key is a prefix match, so a
       * 'react-virtualized' entry also rewrites 'react-virtualized/styles.css'
       * into '<cjs entry>.js/styles.css' - a path that cannot exist, and the
       * build fails on the stylesheet rather than on anything to do with the
       * problem the alias was added for.
       */
      alias: [
        { find: '~', replacement: '/src' },
        {
          // react-virtualized@9's ES build imports a flow-type placeholder that
          // is never exported (upstream #1632). Bundlers with loose CJS interop
          // never notice; esbuild's strict ESM resolution fails the whole
          // dependency pre-bundle. Pointing the bare specifier at the CommonJS
          // entry keeps esbuild off the broken ES module, while
          // 'react-virtualized/styles.css' still resolves normally.
          find: /^react-virtualized$/,
          replacement: 'react-virtualized/dist/commonjs/index.js',
        },
        {
          /*
           * @material-ui/pickers@3's ESM entry re-exports TypeScript *types* as
           * if they were values (DateTimePickerProps and friends), so esbuild's
           * strict ESM resolution fails with "No matching export" and takes the
           * whole dev server down during dependency pre-bundling. Rollup's
           * looser handling means the production build succeeds either way,
           * which is why this only shows up on `vite dev`.
           *
           * Nothing in src/ imports pickers - it arrives through material-table,
           * which seven components use. Its CommonJS build has no export map to
           * disagree about, so pointing the specifier there fixes the
           * pre-bundle without changing what any component renders.
           */
          find: /^@material-ui\/pickers$/,
          replacement: '@material-ui/pickers/dist/material-ui-pickers.js',
        },
      ],
    },
    // JSX lives in .js files; esbuild must be told to parse them as JSX, both
    // for source and when prebundling dependencies.
    esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
    optimizeDeps: {
      esbuildOptions: { loader: { '.js': 'jsx' } },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [ './src/test/setup.js' ],
      include: [ 'src/**/*.{test,spec}.{js,jsx}' ],
      css: false,
    },
    server: { port: 3002, open: false },
    preview: { port: 3002 },
    build: {
      outDir: 'build',
      sourcemap: false,
      chunkSizeWarningLimit: 900,
      // Deliberately no manualChunks. Naming vendor chunks makes Rollup hoist
      // any library shared by two lazy routes up to the entry, which turns
      // lazily-loaded libraries into eager ones. Measured on PT-App: it took
      // the initial load from 1.12 MB to 3.00 MB. Vite's default chunking
      // keeps a library inside the lazy chunk that actually needs it.
    },
  }
})
