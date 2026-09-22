/*
 * Writes the generated stylesheets and rewrites each makeStyles module to hand
 * back plain class-name strings.
 *
 * The shape of the export is deliberately unchanged: `useStyles()` still
 * returns an object keyed exactly as before, so every
 *     const classes = useStyles()   ...   className={classes.foo}
 * keeps working untouched. 45 call sites stay as they are; only what they
 * receive changes, from JSS-generated names to the literal ones in the CSS.
 */
const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const apply = process.argv.includes('--write');

const header = (src) =>
  `/* GENERATED from ${src} by scripts/jss-to-css.cjs - do not edit by hand.\n` +
  `   Regenerate: node scripts/extract-jss.cjs dump.json && node scripts/jss-to-css.cjs dump.json manifest.json */\n\n`;

/* A JS block comment; the CSS header cannot just have its delimiters swapped,
   because only its first line would end up commented and the rest is a syntax
   error the moment anything imports the module. */
const jsHeader = () =>
  `/*\n * Class names GENERATED from this module's former makeStyles object by\n` +
  ` * scripts/jss-to-css.cjs; the rules live in the stylesheet imported below.\n *\n` +
  ` * useStyles() deliberately stays a function returning { key: className }, so\n` +
  ` * every \`const classes = useStyles()\` call site is unchanged.\n */\n`;

/** Finds the makeStyles(...) call starting at `from`, returns [start, end]. */
const callRange = (src, from) => {
  const open = src.indexOf('(', from);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') { depth--; if (depth === 0) return [open, i]; }
  }
  return null;
};

const literal = (map) =>
  `{\n${Object.entries(map).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')}\n}`;

let wrote = 0;
for (const [file, info] of Object.entries(manifest)) {
  const cssPath = file.replace(/\.jsx?$/, '.css');
  const src = fs.readFileSync(file, 'utf8');
  const names = Object.keys(info.maps);


  /*
   * Only the makeStyles CALL is replaced; the module keeps its own structure.
   *
   * Rewriting styles.js wholesale looked tidier and broke VirtualizedTable,
   * which declares `const styles = makeStyles(...)` and exports it as default
   * further down - the regenerated module exported a name nobody imported. The
   * export shape belongs to the module, so it is left alone.
   */
  let out = src;
  {
    /*
     * makeStyles is declared inside a component file here, so only the call is
     * replaced - the rest of the component is left exactly as it is.
     */
    out = src;
    for (const name of names) {
      const re = new RegExp(
        `((?:export\\s+default\\s+|export\\s+const\\s+${name}\\s*=\\s*|const\\s+${name}\\s*=\\s*))makeStyles\\s*`
      );
      const m = re.exec(out);
      if (!m) { console.log(`  ! ${file}: could not find the ${name} binding`); continue; }
      const range = callRange(out, m.index + m[0].length - 1);
      if (!range) { console.log(`  ! ${file}: unbalanced makeStyles call`); continue; }
      out = out.slice(0, m.index + m[1].length) + `() => (${literal(info.maps[name])})` + out.slice(range[1] + 1);
    }
    // Drop the now-unused makeStyles import and bring in the stylesheet.
    out = out.replace(/^import\s+makeStyles\s+from\s+['"]@mui\/styles\/makeStyles['"];?\n/m, '');
    out = out.replace(/^import\s+\{([^}]*)\}\s+from\s+['"]@mui\/styles['"];?\n/m, (whole, inner) => {
      const kept = inner.split(',').map((x) => x.trim()).filter((x) => x && x !== 'makeStyles');
      return kept.length ? `import { ${kept.join(', ')} } from "@mui/styles";\n` : '';
    });
    if (!out.includes(`./${path.basename(cssPath)}`)) {
      out = `import './${path.basename(cssPath)}'\n` + out;
    }
    // Mark the module as generated, so the next person knows the class names
    // come from a script and edits made here will be overwritten.
    if (!/GENERATED from/.test(out)) out = jsHeader() + out;
  }

  if (apply) {
    fs.writeFileSync(cssPath, header(path.basename(file)) + info.css + '\n');
    fs.writeFileSync(file, out);
  }
  wrote++;
}
console.log(`${apply ? 'wrote' : 'would write'} ${wrote} modules (+${wrote} stylesheets)`);
