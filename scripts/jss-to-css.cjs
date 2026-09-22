/*
 * Turns the extracted JSS objects into plain stylesheets, plus a class-name map
 * per module.
 *
 * The map is the point: each generated styles.js exports a `useStyles()` that
 * returns { key: 'pt-<ns>-<key>' }. Components already do
 *   const classes = useStyles()   ...   className={classes.foo}
 * so not one component has to change - only what useStyles returns. That keeps
 * a 561-class migration out of 45 call sites where a typo would be a silent
 * visual regression.
 */
const fs = require('fs');
const path = require('path');

const DUMP = process.argv[2];
const dump = JSON.parse(fs.readFileSync(DUMP, 'utf8'));

/*
 * Properties CSS accepts as bare numbers. JSS's default-unit plugin appends
 * 'px' to a number for everything else, so this list has to match it or values
 * change meaning: `lineHeight: 1.5` becoming `1.5px` collapses every line of
 * text, and `zIndex: 9` becoming `9px` is dropped entirely.
 */
const UNITLESS = new Set([
  'animationIterationCount', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth',
  'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex',
  'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridArea',
  'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'gridColumn', 'gridColumnEnd',
  'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineHeight', 'opacity', 'order',
  'orphans', 'tabSize', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity',
  'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit',
  'strokeOpacity', 'strokeWidth',
]);

const kebab = (s) =>
  s.startsWith('--') ? s : s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/^Ms/, '-ms').toLowerCase();

const value = (prop, v) => {
  if (typeof v === 'number') {
    if (v === 0 || UNITLESS.has(prop)) return String(v);
    return `${v}px`;
  }
  return String(v);
};

/**
 * A namespace per MODULE, from its path: common/Header/styles.js -> header.
 *
 * `index` is kept as a segment, `styles` is not. Dropping both collapsed
 * Companies/index.js and Companies/styles.js onto the same namespace, and since
 * each defines its own `root` they silently overwrote one another - exactly the
 * shared-namespace problem makeStyles used to prevent by generating unique
 * names. A namespace has to identify the module, not the directory.
 */
const namespaceFor = (file) => {
  let p = file.replace(/^src\//, '').replace(/^components\//, '').replace(/^common\//, '');
  p = p.replace(/\.jsx?$/, '');
  const parts = p.split('/').filter((x) => x !== 'styles' && x !== 'hooks');
  const words = parts.flatMap((part) =>
    part.replace(/([a-z0-9])([A-Z])/g, '$1-$2').split(/[-_]/)
  ).map((w) => w.toLowerCase()).filter(Boolean);
  const seen = [];
  for (const w of words) if (seen[seen.length - 1] !== w) seen.push(w);   // drop repeats
  return seen.join('-') || 'app';
};

/**
 * Emits rules for one style object.
 * `&` is the parent selector, exactly as jss-plugin-nested resolves it; a
 * nested key without `&` is a descendant.
 */
const emit = (selector, obj, out, atRules) => {
  const decls = [];
  const children = [];

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) children.push([key, val]);
    else if (Array.isArray(val)) {
      // A JSS array is a fallback list: every value emitted, last one wins.
      for (const v of val) decls.push(`  ${kebab(key)}: ${value(key, v)};`);
    } else if (val !== null && val !== undefined && val !== '') {
      decls.push(`  ${kebab(key)}: ${value(key, val)};`);
    }
  }

  /*
   * The element's own declarations are emitted BEFORE its nested rules.
   *
   * Ten of these blocks nest a modifier of equal specificity - &:hover,
   * &:before, &.horizontal - and at equal specificity the later rule wins.
   * Emitting the modifier first would make the base rule override the hover
   * state, so a button would simply stop reacting, with nothing in the console.
   */
  if (decls.length) out.push(`${selector} {\n${decls.join('\n')}\n}`);

  for (const [key, val] of children) {
    if (key.startsWith('@media') || key.startsWith('@supports')) {
      const inner = [];
      emit(selector, val, inner, atRules);
      atRules.push(`${key} {\n${inner.join('\n')}\n}`);
    } else {
      /*
       * Every selector in a nested comma list is scoped to the parent, which is
       * what jss-plugin-nested does - not just the ones containing `&`.
       *
       * One key here reads
       *   '& .MuiTableRow-root.Mui-selected, .MuiTableRow-root.Mui-selected:hover'
       * and only the first half carries an `&`. Substituting `&` alone left the
       * second half as a bare global rule, which would have restyled every
       * selected table row in the application from one component's stylesheet.
       */
      const parents = selector.split(',').map((p) => p.trim());
      const child = key
        .split(',')
        .flatMap((part) => {
          const sel = part.trim();
          /*
           * Distributed across EVERY branch of the parent, not appended to the
           * joined string. A parent that is already a list - which the rule
           * above can produce - would otherwise attach its nested rules to the
           * last branch only, so `.a, .b` nesting `.c` gave `.a, .b .c`: the
           * first branch silently loses the nested styles and picks up the
           * parent's instead.
           */
          return parents.map((parent) =>
            sel.includes('&') ? sel.replace(/&/g, parent) : `${parent} ${sel}`
          );
        })
        .join(', ');
      emit(child, val, out, atRules);
    }
  }
};

let files = 0, classes = 0;
const manifest = {};

for (const [file, entry] of Object.entries(dump)) {
  if (entry.__error) { console.log('SKIP (error):', file); continue; }
  const ns = namespaceFor(file);
  const rules = [], atRules = [];
  const maps = {};

  for (const { name, styles } of entry.__exports) {
    const map = {};
    for (const [key, styleObj] of Object.entries(styles)) {
      // One namespace per module keeps two components' `.container` apart -
      // makeStyles used to guarantee that with generated names.
      const cls = `pt-${ns}-${kebab(key)}`;
      map[key] = cls;
      classes++;
      if (styleObj && typeof styleObj === 'object') emit(`.${cls}`, styleObj, rules, atRules);
    }
    maps[name] = map;
  }

  manifest[file] = { ns, maps, css: [...rules, ...atRules].join('\n\n') };
  files++;
}

fs.writeFileSync(process.argv[3], JSON.stringify(manifest, null, 1));
console.log(`generated CSS for ${files} modules, ${classes} classes`);
