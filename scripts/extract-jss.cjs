/*
 * Extracts the style object each makeStyles call produces, by EVALUATING it
 * against the real theme rather than parsing its source.
 *
 * That matters: these objects read theme.color.*, theme.spacing() and
 * theme.breakpoints.down(), and spacing changed units between MUI v4 and v5.
 * Evaluating yields exactly the values JSS produced at runtime, so the generated
 * CSS cannot drift from what the app renders today. A regex translation would
 * have to reimplement all of that, and would be wrong quietly.
 *
 * The capture happens inside a stubbed makeStyles, not by reading each module's
 * default export: in eight of these files the default export is a React
 * component and the makeStyles call is internal, so calling the export would
 * invoke hooks outside a render and throw.
 */
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || 'jss-dump.json';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.jsx?$/.test(e.name) && !/\.test\./.test(e.name)) files.push(f);
  }
})('src');

const styleFiles = files.filter((f) => /makeStyles\s*\(/.test(fs.readFileSync(f, 'utf8')));

// Both import shapes are in use: a named import from '@mui/styles' and a
// default import from '@mui/styles/makeStyles'. The stub therefore exports the
// capturing function as BOTH, and the resolver matches the deep path too.
const stub = `
export const makeStyles = (arg) => { (globalThis.__captured ||= []).push(arg); return () => ({}); };
export const withStyles = (arg) => { (globalThis.__captured ||= []).push(arg); return (c) => c; };
export const useTheme = () => globalThis.__theme || {};
export const ThemeProvider = ({ children }) => children;
export const StyledEngineProvider = ({ children }) => children;
export default makeStyles;`;

const stubPlugin = {
  name: 'stub-mui-styles',
  setup(build) {
    build.onResolve({ filter: /^@mui\/styles(\/.*)?$/ }, () => ({ path: 'stub', namespace: 'muistub' }));
    build.onLoad({ filter: /.*/, namespace: 'muistub' }, () => ({ contents: stub, loader: 'js' }));
  },
};

/*
 * Every relative import becomes an empty module.
 *
 * Eight of these files define their styles inside a component that imports
 * other components, and those imports call makeStyles of their own at module
 * scope. Bundled normally, their classes land in the capture list too and get
 * attributed to the wrong file - Companies/index.js reported six style objects
 * when it has one. Nothing in a style object here reads an imported value, so
 * stubbing the imports leaves the entry's own styles intact and silences
 * everything else.
 */
const isolateEntry = (entryPath) => ({
  name: 'isolate-entry',
  setup(build) {
    build.onResolve({ filter: /^\.\.?\// }, (args) => {
      if (args.kind === 'entry-point') return null;
      return { path: args.path, namespace: 'empty' };
    });
    // CommonJS, not ESM: esbuild statically checks named imports against an
    // ESM stub and errors on every one. A CJS module's exports are opaque to
    // that check, and the Proxy answers to whatever name is asked for.
    build.onLoad({ filter: /.*/, namespace: 'empty' }, () => ({
      contents: 'module.exports = new Proxy(function(){}, { get: () => function(){ return {}; } });',
      loader: 'js',
    }));
  },
});

const common = {
  bundle: true, format: 'cjs', platform: 'node', logLevel: 'error',
  loader: { '.js': 'jsx', '.svg': 'text', '.png': 'text', '.jpg': 'text', '.css': 'text' },
};


/*
 * Last resort for a module that throws before its makeStyles call is reached -
 * a bundled dependency failing during evaluation, which no amount of stubbing
 * the entry's own imports prevents.
 *
 * Only safe when the style object is a literal that never reads the theme, so
 * that is checked rather than assumed: anything mentioning `theme` is refused
 * and reported as an error instead, because guessing at a theme value is
 * exactly the silent drift this whole approach exists to avoid.
 */
function literalFallback(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = [];
  const re = /(?:export\s+default\s+|export\s+const\s+([A-Za-z0-9_$]+)\s*=\s*|const\s+([A-Za-z0-9_$]+)\s*=\s*)makeStyles\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    const name = m[1] || m[2] || 'default';
    // Walk to the matching close paren of the makeStyles call.
    let i = re.lastIndex - 1, depth = 0, end = i;
    for (; end < src.length; end++) {
      if (src[end] === '(') depth++;
      else if (src[end] === ')') { depth--; if (depth === 0) break; }
    }
    let arg = src.slice(i + 1, end).trim();
    const arrow = /^\(\s*\)\s*=>\s*/.exec(arg);        // () => ({...})
    if (arrow) arg = arg.slice(arrow[0].length).trim();
    if (arg.startsWith('(') && arg.endsWith(')')) arg = arg.slice(1, -1).trim();
    if (!arg.startsWith('{') || /\btheme\b/.test(arg)) return null;
    try {
      // eslint-disable-next-line no-new-func
      out.push({ name, styles: new Function(`return (${arg})`)() });
    } catch (_) { return null; }
  }
  return out.length ? out : null;
}

(async () => {
  // The real theme first.
  await esbuild.build({ ...common, plugins: [stubPlugin], entryPoints: ['src/themes/index.js'], outfile: '.theme.cjs' });
  const theme = require(path.resolve('.theme.cjs')).default.default;
  fs.unlinkSync(path.resolve('.theme.cjs'));

  const out = {};
  let errors = 0;
  for (const file of styleFiles) {
    const tmp = '.jss-one.cjs';
    try {
      await esbuild.build({ ...common, plugins: [stubPlugin, isolateEntry(file)], entryPoints: [file], outfile: tmp });
      globalThis.__captured = [];
      globalThis.__theme = theme;
      delete require.cache[path.resolve(tmp)];
      require(path.resolve(tmp));                    // side effect: makeStyles runs
      const captured = globalThis.__captured;
      if (!captured.length) { out[file] = { __error: 'no makeStyles call captured' }; errors++; continue; }

      /*
       * Each makeStyles call is kept separate, not merged. One file declares a
       * second hook (useMatStyles) alongside its default; merging would put
       * both sets of classes behind one name and silently drop the export the
       * component still imports.
       *
       * The binding each call belongs to is read from the source in call order,
       * because the captured values carry no name of their own.
       */
      const src = fs.readFileSync(file, 'utf8');
      const names = [];
      for (const m of src.matchAll(/(?:export\s+default\s+|export\s+const\s+([A-Za-z0-9_$]+)\s*=\s*|const\s+([A-Za-z0-9_$]+)\s*=\s*)makeStyles\s*\(/g)) {
        names.push(m[1] || m[2] || 'default');
      }
      out[file] = {
        __exports: captured.map((c, i) => ({
          name: names[i] || (i === 0 ? 'default' : `styles${i}`),
          styles: typeof c === 'function' ? c(theme) : c,
        })),
      };
    } catch (e) {
      /*
       * A module can still throw after its styles were captured - several call
       * connect() or read PropTypes at module scope, and those packages are
       * stubbed here. makeStyles runs near the top of the file, so the capture
       * has already happened; the throw is noise from code this extraction does
       * not care about. Keep what was captured and only fail if nothing was.
       */
      const captured = globalThis.__captured || [];
      if (captured.length) {
        const src = fs.readFileSync(file, 'utf8');
        const names = [];
        for (const m of src.matchAll(/(?:export\s+default\s+|export\s+const\s+([A-Za-z0-9_$]+)\s*=\s*|const\s+([A-Za-z0-9_$]+)\s*=\s*)makeStyles\s*\(/g)) {
          names.push(m[1] || m[2] || 'default');
        }
        out[file] = {
          __partial: String(e && e.message).split('\n')[0],
          __exports: captured.map((c, i) => ({
            name: names[i] || (i === 0 ? 'default' : `styles${i}`),
            styles: typeof c === 'function' ? c(theme) : c,
          })),
        };
      } else {
        const salvaged = literalFallback(file);
        if (salvaged) {
          out[file] = { __fallback: 'literal source', __exports: salvaged };
        } else {
          out[file] = { __error: String(e && e.message).split('\n')[0] };
          errors++;
        }
      }
    } finally {
      if (fs.existsSync(path.resolve(tmp))) fs.unlinkSync(path.resolve(tmp));
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(`extracted ${Object.keys(out).length} modules, ${errors} errors`);
  for (const [f, v] of Object.entries(out)) if (v && v.__error) console.log('  ERROR', f, '-', v.__error);
})().catch((e) => { console.error(e); process.exit(1); });
