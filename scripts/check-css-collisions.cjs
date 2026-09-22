/**
 * Flags a generated class name that two component stylesheets both define.
 *
 * makeStyles gave every component uniquely generated names
 * (makeStyles-root-123), so two components could both call a class `root` and
 * never meet. The migration to plain CSS replaced those with literal names, and
 * a literal name is only unique if the namespace is. Get that wrong and one
 * component silently restyles another, with import order deciding the winner
 * and nothing at all in the console.
 *
 * It is not hypothetical: deriving the namespace from the directory rather than
 * the module put Companies/index.js and Companies/styles.js in one namespace,
 * where each defined its own `root`.
 */
const fs = require('fs');
const path = require('path');

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.css')) files.push(full);
  }
})('src');

const defs = new Map();   // class -> Set(stylesheet)
for (const file of files) {
  const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    for (const sel of m[1].split(',')) {
      // Key each selector on the class it is ROOTED at: `.x .y` and `.x:hover`
      // both claim `.x`'s namespace just as surely as a bare `.x` does.
      const rooted = sel.trim().match(/^\.([A-Za-z0-9_-]+)/);
      if (!rooted) continue;
      if (!defs.has(rooted[1])) defs.set(rooted[1], new Set());
      defs.get(rooted[1]).add(file);
    }
  }
}

const clashes = [...defs.entries()].filter(([, sheets]) => sheets.size > 1);
if (clashes.length) {
  console.error(`FAIL - ${clashes.length} class name(s) defined by more than one stylesheet:\n`);
  for (const [name, sheets] of clashes) {
    console.error(`  .${name}`);
    for (const s of sheets) console.error(`      ${s}`);
  }
  process.exit(1);
}
console.log(`OK - ${defs.size} class names, each defined by one stylesheet`);
