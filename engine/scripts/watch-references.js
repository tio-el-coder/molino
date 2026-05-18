#!/usr/bin/env node
// watch-references.js
// Watches all brands/*/references/ folders.
// When a new image is dropped in, auto-creates a companion .md template.
//
// Usage:
//   node engine/scripts/watch-references.js
//   node engine/scripts/watch-references.js --brand brand-b

const fs   = require('fs');
const path = require('path');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);
const ROOT       = path.resolve(__dirname, '../../');
const BRANDS_DIR = path.join(ROOT, 'brands');

// --- helpers ---

function isImage(file) {
  return IMAGE_EXTS.has(path.extname(file).toLowerCase());
}

function companionPath(imagePath) {
  const { dir, name } = path.parse(imagePath);
  return path.join(dir, `${name}.md`);
}

function inferLabel(filePath) {
  // Use grandparent folder as a hint (images / typography / websites / patterns)
  const folder = path.basename(path.dirname(filePath));
  const name   = path.basename(filePath, path.extname(filePath))
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  return { folder, name };
}

function createTemplate(imagePath) {
  const mdPath = companionPath(imagePath);

  if (fs.existsSync(mdPath)) return; // already has a note

  const rel            = path.relative(ROOT, imagePath);
  const { folder, name } = inferLabel(imagePath);

  const template = `# Reference: ${name}

Source: <!-- where did this come from? site, account, publication -->
Category: ${folder}

## What I like about this

<!-- Be specific. Layout? Type scale? Color use? Spacing? Texture? -->
-

## What to take from it

<!-- What should Claude apply to builds? -->
-

## What NOT to copy

<!-- Anything off-brand: wrong palette, wrong font, wrong vibe -->
-

## Tags

<!-- e.g. hero, dark-surface, editorial, typography, grid, motion -->
`;

  fs.writeFileSync(mdPath, template, 'utf8');

  const relMd = path.relative(ROOT, mdPath);
  console.log(`\n📝  Note created → ${relMd}`);
  console.log(`    Open it and fill in what you like about: ${path.basename(imagePath)}\n`);
}

// --- watcher ---

function watchBrand(brand) {
  const refsDir = path.join(BRANDS_DIR, brand, 'references');
  if (!fs.existsSync(refsDir)) return;

  // Use recursive watch (macOS supports this natively in Node 19+; falls back to manual below)
  try {
    fs.watch(refsDir, { recursive: true }, (event, filename) => {
      if (!filename || event !== 'rename') return;
      const full = path.join(refsDir, filename);
      if (!isImage(full)) return;

      // Small delay so the file is fully written before we read it
      setTimeout(() => {
        if (fs.existsSync(full)) {
          createTemplate(full);
        }
      }, 200);
    });

    const relDir = path.relative(ROOT, refsDir);
    console.log(`  Watching  ${relDir}`);
  } catch (err) {
    console.error(`  Could not watch ${refsDir}:`, err.message);
  }
}

// --- main ---

const args  = process.argv.slice(2);
const bFlag = args.indexOf('--brand');
const brands = bFlag !== -1
  ? [args[bFlag + 1]]
  : fs.readdirSync(BRANDS_DIR).filter(d =>
      fs.statSync(path.join(BRANDS_DIR, d)).isDirectory()
    );

console.log('\nDesign OS — Reference Watcher');
console.log('Drop an image into any references/ folder and a note template will appear.\n');

brands.forEach(watchBrand);

console.log('\nWaiting for images… (Ctrl+C to stop)\n');
