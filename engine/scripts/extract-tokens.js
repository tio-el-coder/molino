#!/usr/bin/env node
/**
 * extract-tokens.js — Universal Figma token extractor
 * Works for any brand. Run from the brand's folder OR pass --brand flag.
 *
 * Usage:
 *   cd brands/brand-a && node ../../engine/scripts/extract-tokens.js
 *   node engine/scripts/extract-tokens.js --brand brand-a
 *
 * Requires .env in the brand folder with:
 *   FIGMA_TOKEN=your_personal_access_token
 *   FIGMA_FILE_KEY=your_figma_file_key
 *
 * Outputs:
 *   brands/[brand]/tokens/tokens.json
 *   brands/[brand]/tokens/variables.css
 */

const fs   = require('fs');
const path = require('path');

// Resolve brand folder — either cwd or --brand flag
let brandDir = process.cwd();
const brandFlag = process.argv.indexOf('--brand');
if (brandFlag !== -1) {
  const brandName = process.argv[brandFlag + 1];
  brandDir = path.join(__dirname, '../../brands', brandName);
  if (!fs.existsSync(brandDir)) {
    console.error(`❌ Brand folder not found: ${brandDir}`);
    process.exit(1);
  }
}

// Load .env from brand folder
const envPath = path.join(brandDir, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) process.env[key.trim()] = val.join('=').trim();
  });
}

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN)    { console.error('❌ FIGMA_TOKEN missing in .env'); process.exit(1); }
if (!FIGMA_FILE_KEY) { console.error('❌ FIGMA_FILE_KEY missing in .env'); process.exit(1); }

const brandName = path.basename(brandDir);
console.log(`\n🔌 Connecting to Figma for ${brandName}...`);
console.log(`   File key: ${FIGMA_FILE_KEY}\n`);

function rgbaToHex({ r, g, b, a = 1 }) {
  const toHex = v => Math.round(v * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  return a < 1 ? hex + toHex(a) : hex;
}

function toCSSVar(name) {
  return '--' + name.replace(/\//g, '-').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
}

function setNested(obj, parts, value) {
  let ref = obj;
  parts.slice(0, -1).forEach(p => { ref[p] = ref[p] || {}; ref = ref[p]; });
  ref[parts[parts.length - 1]] = value;
}

async function main() {
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ Figma API error ${res.status}: ${text}`);
    process.exit(1);
  }

  const { meta } = await res.json();
  const { variables = {}, variableCollections = {} } = meta;

  const tokens   = { _meta: { brand: brandName, fileKey: FIGMA_FILE_KEY, extractedAt: new Date().toISOString().split('T')[0] } };
  const cssLines = [];
  const summary  = { colors: 0, dimensions: 0, strings: 0 };

  for (const [, variable] of Object.entries(variables)) {
    const { name, resolvedType, valuesByMode } = variable;
    const firstModeId = Object.keys(valuesByMode)[0];
    const value = valuesByMode[firstModeId];
    const parts = name.split('/').map(s => s.trim().toLowerCase().replace(/\s+/g, '-'));
    const cssVar = toCSSVar(name);

    if (resolvedType === 'COLOR' && value && typeof value === 'object' && 'r' in value) {
      const hex = rgbaToHex(value);
      setNested(tokens, parts, { value: hex, type: 'color', figma: name });
      cssLines.push(`  ${cssVar}: ${hex};`);
      summary.colors++;
    } else if (resolvedType === 'FLOAT' && typeof value === 'number') {
      const px = name.toLowerCase().includes('opacity') ? String(value) : `${value}px`;
      setNested(tokens, parts, { value: px, type: 'dimension', figma: name });
      cssLines.push(`  ${cssVar}: ${px};`);
      summary.dimensions++;
    } else if (resolvedType === 'STRING' && typeof value === 'string') {
      setNested(tokens, parts, { value, type: 'string', figma: name });
      if (name.toLowerCase().includes('font') && name.toLowerCase().includes('family')) {
        cssLines.push(`  ${cssVar}: "${value}", sans-serif;`);
      }
      summary.strings++;
    }
  }

  // Ensure output dir exists
  const tokensDir = path.join(brandDir, 'tokens');
  fs.mkdirSync(tokensDir, { recursive: true });

  // Write tokens.json
  fs.writeFileSync(path.join(tokensDir, 'tokens.json'), JSON.stringify(tokens, null, 2));
  console.log(`✅ tokens/tokens.json — ${summary.colors} colors, ${summary.dimensions} dimensions, ${summary.strings} strings`);

  // Write variables.css
  const css = [
    `/*`,
    ` * variables.css — ${brandName}`,
    ` * Auto-generated from Figma file: ${FIGMA_FILE_KEY}`,
    ` * Date: ${new Date().toISOString().split('T')[0]}`,
    ` * DO NOT edit manually — run: node engine/scripts/extract-tokens.js --brand ${brandName}`,
    ` */`,
    ``,
    `:root {`,
    ...cssLines,
    ``,
    `  /* ─── Semantic aliases (edit these to match brand conventions) ─── */`,
    `  --color-bg:           var(--color-primary-charcoal, #191919);`,
    `  --color-bg-dark:      var(--color-primary-charcoal, #191919);`,
    `  --color-text:         var(--color-primary-charcoal, #191919);`,
    `  --color-text-inverse: var(--color-primary-vanilla, #FFFAEE);`,
    `  --color-accent:       var(--color-secondary-orange, #FE5102);`,
    `  --color-accent-hover: var(--color-brand-scale-brand-600, #E64400);`,
    `  --color-border:       var(--color-mono-scale-black-20, #DDDEE2);`,
    `  --color-muted:        var(--color-mono-scale-black-50, #787878);`,
    `  --color-glass:        rgba(255, 250, 238, 0.20);`,
    ``,
    `  /* ─── Font roles (update to match brand's font families) ─── */`,
    `  --font-display:  "Neue Haas Grotesk Display Pro", sans-serif;`,
    `  --font-headings: "Neue Haas Grotesk Display Pro", sans-serif;`,
    `  --font-text:     "Neue Haas Grotesk Text Pro", sans-serif;`,
    `  --font-accent:   "Offbit", monospace;`,
    `}`,
    ``,
    `/* ─── Tablet ─── */`,
    `@media (min-width: 768px) {`,
    `  :root {`,
    `    --container: var(--container-tablet, 704px);`,
    `    --padding:   var(--size-spacing-32, 32px);`,
    `  }`,
    `}`,
    ``,
    `/* ─── Desktop ─── */`,
    `@media (min-width: 1280px) {`,
    `  :root {`,
    `    --container: var(--container-desktop, 1184px);`,
    `    --padding:   var(--size-spacing-48, 48px);`,
    `  }`,
    `}`,
  ].join('\n');

  fs.writeFileSync(path.join(tokensDir, 'variables.css'), css);
  console.log(`✅ tokens/variables.css — ${cssLines.length} CSS custom properties`);
  console.log(`\n🎉 Done! Import brands/${brandName}/tokens/variables.css in every site build.\n`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
