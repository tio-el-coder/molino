#!/usr/bin/env node
/**
 * init.js — Scaffold a new brand for the molino engine.
 *
 * Usage:
 *   ./bin/molino init                   (interactive)
 *   ./bin/molino init <brand-name>      (skip the name prompt)
 *   node engine/scripts/init.js
 *
 * Creates:
 *   brands/<brand>/
 *     figma-design-system.md     — token source-of-truth template
 *     design-taste.md            — aesthetic direction template
 *     design-director.md         — strategy/voice template
 *     tokens/variables.css       — starter CSS custom properties
 *     references/{images,patterns,typography,websites}/
 *     .env.example               — Figma token slots
 *   outputs/<brand>/
 *     websites/  campaigns/  moodboards/
 */

const fs       = require('fs');
const path     = require('path');
const readline = require('readline');

// ── tiny ANSI helpers (no deps) ───────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  gray:   '\x1b[90m',
};
const ok  = (msg) => console.log(`${C.green}✓${C.reset} ${msg}`);
const err = (msg) => console.error(`${C.red}✗${C.reset} ${msg}`);
const dim = (msg) => console.log(`${C.gray}${msg}${C.reset}`);

// ── resolve repo root (the directory containing engine/) ──────────────────────
function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'engine', 'skills'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}
const REPO_ROOT = findRepoRoot(__dirname);

// ── prompts ───────────────────────────────────────────────────────────────────
function ask(rl, question, fallback) {
  const tag = fallback ? `${C.gray}(${fallback})${C.reset} ` : '';
  return new Promise((resolve) => {
    rl.question(`${C.cyan}?${C.reset} ${question} ${tag}`, (input) => {
      resolve(input.trim() || fallback || '');
    });
  });
}

// Brand slug must be filesystem-safe: lowercase alphanumeric + single hyphens.
// Prevents path traversal (.., /, \), reserved names, and accidental absolute paths.
function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function isSafeBrand(b) {
  if (!b || typeof b !== 'string') return false;
  if (b.length === 0 || b.length > 64) return false;
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(b)) return false;
  // Block reserved / surprising names
  const reserved = ['engine', 'outputs', 'brands', 'docs', 'examples', 'node_modules', 'bin', '.git'];
  if (reserved.includes(b)) return false;
  return true;
}

function titleCase(s) {
  return s.split(/[-_\s]+/).filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

// ── templates ─────────────────────────────────────────────────────────────────
function tplFigmaDesignSystem(brand, brandTitle, figmaUrl) {
  const fileKey = (figmaUrl.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/) || [])[1] || '';
  return `# figma-design-system — ${brandTitle}

**Status:** Scaffolded by \`molino init\` — populate after running extract-tokens.js
**Figma file:** ${figmaUrl || '[paste Figma URL here]'}
**File key:** ${fileKey || '[extracted from URL]'}
**Last synced:** —

> This file is the single source of truth for ${brandTitle}.
> To populate it: share the Figma file URL with Claude, or run
> \`node engine/scripts/extract-tokens.js --brand ${brand}\`.

---

## How to set up this brand

1. Add the Figma file key to \`brands/${brand}/.env\`:
   \`\`\`
   FIGMA_TOKEN=your_personal_access_token
   FIGMA_FILE_KEY=${fileKey || 'your_figma_file_key'}
   \`\`\`

2. Extract tokens:
   \`\`\`bash
   node engine/scripts/extract-tokens.js --brand ${brand}
   \`\`\`

3. Share the Figma URL with Claude and say:
   > "Read the Figma file and fill in brands/${brand}/figma-design-system.md"

4. Fill in design-taste.md and design-director.md based on the brand brief.

---

## Color system
[To be filled after Figma extraction]

## Typography
[To be filled after Figma extraction]

## Spacing
[To be filled after Figma extraction]

## Components
[To be filled after Figma extraction]
`;
}

function tplDesignTaste(brandTitle) {
  return `# design-taste — ${brandTitle}

> The aesthetic direction. What looks right, what doesn't.
> Claude reads this AFTER figma-design-system.md to make taste calls
> the tokens alone can't dictate.

---

## One-sentence soul
[e.g. "Editorial calm. Monumental headlines, restrained color, room to breathe."]

## What "right" looks like
- [e.g. Negative space is a choice, not a bug]
- [e.g. Display type never shrinks below the breakpoint scale]
- [e.g. Accent color is earned — used for CTAs and accents, never a background fill]

## What "wrong" looks like
- [e.g. Drop shadows, gradients on brand surfaces]
- [e.g. Italic outside of quotes]
- [e.g. Mixed weights inside a single headline]

## Reference work
- [drop image paths or URLs here]
- [3-5 examples is plenty]

## Anti-references
- [things this brand should NEVER look like]
`;
}

function tplDesignDirector(brandTitle) {
  return `# design-director — ${brandTitle}

> The strategic layer: voice, audience, campaign thinking.
> Claude reads this for brief work, campaigns, and copy.
> For pure UI/component work, figma-design-system.md + design-taste.md is enough.

---

## Audience
[Who is this for? One sentence on the primary reader/viewer.]

## Voice
- **Sounds like:** [e.g. confident, dry, editorial; never marketing-speak]
- **Doesn't sound like:** [e.g. enterprise SaaS, startup hype, AI-generated]
- **Tics to avoid:** [e.g. em-dashes in body copy, exclamation points, "just"]

## Positioning
[One paragraph on what this brand stands for and against.]

## Campaign principles
- [e.g. Show, don't tell — work first, claims second]
- [e.g. Every headline earns its weight]

## Verbatim quotes / non-negotiables
> [exact phrases the brand owns, or hills to die on]
`;
}

function tplVariablesCss(brand) {
  return `/* ==========================================================================
   ${brand} — Design Tokens
   Source of truth: ../figma-design-system.md
   When values change here, update figma-design-system.md too.
   ========================================================================== */

:root {
  /* --- Color ----------------------------------------------------------- */
  --color-paper:        #FFFFFF;
  --color-bone:         #F4F2EE;
  --color-ink:          #111111;
  --color-night:        #000000;
  --color-ash:          #6B6B6B;
  --color-accent:       #FF4A1C;
  --color-accent-soft:  #FFB29A;

  /* --- Typography ------------------------------------------------------ */
  --font-display: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body:    system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    ui-monospace, 'SF Mono', Menlo, monospace;

  --font-size-display-xl: 64px;
  --font-size-display-lg: 48px;
  --font-size-display-md: 36px;
  --font-size-h1:         32px;
  --font-size-h2:         24px;
  --font-size-h3:         20px;
  --font-size-body-lg:    17px;
  --font-size-body:       15px;
  --font-size-small:      13px;
  --font-size-eyebrow:    12px;

  /* --- Spacing (8px base) --------------------------------------------- */
  --space-1:   8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-5:  48px;
  --space-6:  64px;
  --space-7:  96px;
  --space-8: 128px;

  /* --- Radius --------------------------------------------------------- */
  --radius-1: 2px;
  --radius-2: 4px;

  /* --- Motion --------------------------------------------------------- */
  --ease-out:        cubic-bezier(0.22, 1, 0.36, 1);
  --duration-quick:  150ms;
  --duration-base:   250ms;
  --duration-reveal: 400ms;
}

@media (min-width: 1280px) {
  :root {
    --font-size-display-xl: 144px;
    --font-size-display-lg:  96px;
    --font-size-display-md:  72px;
    --font-size-h1:          56px;
    --font-size-h2:          36px;
    --font-size-body-lg:     19px;
  }
}
`;
}

function tplEnvExample() {
  return `# Figma access (used by engine/scripts/extract-tokens.js)
# Get a token: https://www.figma.com/developers/api#access-tokens
# Keep this file out of git — only commit .env.example

FIGMA_TOKEN=
FIGMA_FILE_KEY=
`;
}

// ── filesystem helpers ────────────────────────────────────────────────────────
function mkdirp(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeIfMissing(p, content) {
  if (fs.existsSync(p)) {
    dim(`  · skipped (exists) ${path.relative(REPO_ROOT, p)}`);
    return false;
  }
  fs.writeFileSync(p, content);
  ok(`  wrote ${path.relative(REPO_ROOT, p)}`);
  return true;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log(`${C.bold}molino init${C.reset} ${C.gray}— scaffold a new brand${C.reset}`);
  console.log(`${C.gray}repo root: ${REPO_ROOT}${C.reset}`);
  console.log('');

  // CLI positional override
  const positional = process.argv[2];
  const flagName = process.argv.indexOf('--name');
  const flagFigma = process.argv.indexOf('--figma');
  const presetName = positional || (flagName !== -1 ? process.argv[flagName + 1] : '');
  const presetFigma = flagFigma !== -1 ? process.argv[flagFigma + 1] : '';

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const rawName = presetName || await ask(rl, 'Brand name (e.g. lumen, fieldnotes):');
  if (!rawName) { err('Brand name required.'); rl.close(); process.exit(1); }
  const brand = slugify(rawName);
  if (!isSafeBrand(brand)) {
    err(`Unsafe or reserved brand name after normalization: "${brand}".`);
    dim('  use lowercase letters, digits, and hyphens (3–64 chars).');
    rl.close(); process.exit(1);
  }
  const brandTitle = titleCase(brand);

  // Resolve target paths and verify they stay under REPO_ROOT (defense-in-depth)
  const brandDir  = path.resolve(REPO_ROOT, 'brands', brand);
  const outputDir = path.resolve(REPO_ROOT, 'outputs', brand);
  const insideRoot = (p) => p.startsWith(path.resolve(REPO_ROOT) + path.sep);
  if (!insideRoot(brandDir) || !insideRoot(outputDir)) {
    err('Refusing to write outside the repo root.');
    rl.close(); process.exit(1);
  }

  // Refuse to follow symlinks at the brand dir (defense against symlink swap)
  try {
    const lst = fs.lstatSync(brandDir);
    if (lst.isSymbolicLink()) {
      err(`brands/${brand} is a symlink — refusing to write through it.`);
      rl.close(); process.exit(1);
    }
  } catch (_) { /* doesn't exist yet — fine */ }

  if (fs.existsSync(brandDir)) {
    const overwrite = await ask(rl, `${C.yellow}!${C.reset} brands/${brand} already exists. Add missing files only? (y/n)`, 'y');
    if (!/^y/i.test(overwrite)) { dim('aborted.'); rl.close(); process.exit(0); }
  }

  const figmaUrlRaw = presetFigma || await ask(rl, 'Figma file URL (optional, press enter to skip):', '');
  // Only accept https://www.figma.com / figma.com URLs. Anything else, drop silently.
  const figmaUrl = /^https?:\/\/(?:www\.)?figma\.com\/[\w\/?=&#.\-]+$/i.test(figmaUrlRaw) ? figmaUrlRaw : '';
  if (figmaUrlRaw && !figmaUrl) {
    dim(`  ignoring non-Figma URL: ${figmaUrlRaw.slice(0, 60)}`);
  }

  rl.close();

  console.log('');
  dim(`Scaffolding brands/${brand} ...`);

  // brand tree
  mkdirp(brandDir);
  mkdirp(path.join(brandDir, 'tokens'));
  ['images','patterns','typography','websites'].forEach(sub => {
    mkdirp(path.join(brandDir, 'references', sub));
  });

  writeIfMissing(
    path.join(brandDir, 'figma-design-system.md'),
    tplFigmaDesignSystem(brand, brandTitle, figmaUrl)
  );
  writeIfMissing(
    path.join(brandDir, 'design-taste.md'),
    tplDesignTaste(brandTitle)
  );
  writeIfMissing(
    path.join(brandDir, 'design-director.md'),
    tplDesignDirector(brandTitle)
  );
  writeIfMissing(
    path.join(brandDir, 'tokens', 'variables.css'),
    tplVariablesCss(brand)
  );
  writeIfMissing(
    path.join(brandDir, '.env.example'),
    tplEnvExample()
  );

  // output tree
  dim('');
  dim(`Scaffolding outputs/${brand} ...`);
  ['websites','campaigns','moodboards'].forEach(sub => {
    mkdirp(path.join(outputDir, sub));
    const keep = path.join(outputDir, sub, '.gitkeep');
    writeIfMissing(keep, '');
  });

  // closing summary
  console.log('');
  console.log(`${C.green}${C.bold}done.${C.reset} ${brandTitle} is scaffolded.`);
  console.log('');
  console.log(`${C.bold}next steps:${C.reset}`);
  console.log(`  1. ${C.cyan}cp brands/${brand}/.env.example brands/${brand}/.env${C.reset}`);
  console.log(`     then fill in your FIGMA_TOKEN and FIGMA_FILE_KEY`);
  console.log(`  2. ${C.cyan}node engine/scripts/extract-tokens.js --brand ${brand}${C.reset}`);
  console.log(`     pulls live tokens from Figma into tokens/variables.css`);
  console.log(`  3. Edit ${C.cyan}brands/${brand}/design-taste.md${C.reset} and ${C.cyan}design-director.md${C.reset}`);
  console.log(`  4. ${C.cyan}./engine/scripts/brand.sh ${brand} "build a landing page"${C.reset}`);
  console.log('');
  console.log(`${C.bold}security:${C.reset}`);
  console.log(`  · ${C.gray}brands/ and outputs/ are gitignored — your tokens never leave your machine${C.reset}`);
  console.log(`  · ${C.gray}never commit .env (only .env.example) — it holds your FIGMA_TOKEN${C.reset}`);
  console.log(`  · ${C.gray}use a Figma token scoped to read-only when possible${C.reset}`);
  console.log('');
}

main().catch((e) => { err(e.message || String(e)); process.exit(1); });
