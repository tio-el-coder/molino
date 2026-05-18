# CLAUDE.md — Design OS

## What This Project Is

A design operating system that powers multiple brand design systems from a shared engine. One codebase, multiple brands. Claude is the primary builder — it reads brand context and generates HTML/CSS outputs.

**Mental model:** Engine (universal skills) + Brand (isolated context) → Output (generated HTML)

---

## Architecture

```
engine/          ← shared, never edit per-brand
  skills/
    frontend-design.md     ← CSS patterns, component library
    ui-animation.md        ← motion principles, scroll reveal, GSAP
  agents/
    figma-sync.md          ← reads/writes Figma tokens via MCP
    website-builder.md     ← builds complete sites
  scripts/
    brand.sh               ← shell helper: loads context + invokes Claude
    extract-tokens.js      ← Node.js: Figma API → tokens.json + variables.css

brands/[brand]/   ← isolated per brand, never mix
  figma-design-system.md  ← token values, colors, type (SOURCE OF TRUTH)
  design-taste.md         ← aesthetic direction, what looks right
  design-director.md      ← brand strategy, voice, campaign thinking
  tokens/
    tokens.json           ← extracted from Figma
    variables.css         ← auto-generated CSS custom properties
  references/             ← inspiration images, typography, pattern snippets
  .env                    ← FIGMA_TOKEN, FIGMA_FILE_KEY (never commit)

outputs/[brand]/  ← all generated work, separated by brand
  websites/[project]/index.html
  campaigns/[project]/
  moodboards/
```

**Active brand:** `brand-a` (configure `FIGMA_FILE_KEY` in `brands/brand-a/.env`)

---

## Context Loading Order

Always read in this order before building anything:

1. `engine/skills/frontend-design.md`
2. `engine/skills/ui-animation.md`
3. `brands/[brand]/figma-design-system.md`
4. `brands/[brand]/design-taste.md`
5. `brands/[brand]/design-director.md` *(only for campaign/brief work)*

This is what `./engine/scripts/brand.sh [brand] "[prompt]"` does automatically.

---

## Tech Stack

- **Output:** Vanilla HTML + CSS (no JS frameworks, no build step)
- **Tokens:** CSS custom properties (`var(--token-name)`) from `variables.css`
- **Fonts:** Neue Haas Grotesk (display/body) + Offbit (accent labels only)
- **Animation:** GSAP + ScrollTrigger (CDN) for choreographed/scroll motion; CSS transitions for hover/focus. See `engine/skills/ui-animation.md` and the `greensock/gsap-skills` marketplace plugin for full API reference.
- **Breakpoints:** 375px / 768px / 1280px (mobile-first)
- **Token extraction:** Node.js 18+ (`extract-tokens.js`)

---

## Code Standards

### CSS Rules (enforced — no exceptions)
1. **CSS variables only** — never hardcode hex, font names, px values that have tokens
2. **Mobile-first** — base styles for mobile, `min-width` media queries to scale up
3. **No box-shadows** — use borders and background contrast for depth
4. **No gradients on brand surfaces** — flat fills only (exception: image overlays)
5. **Transitions 0.15s–0.25s** — never over-animate
6. **Border-radius from token scale** — never invent values
7. **Responsive images:** `object-fit: cover`
8. Test at 375px, 768px, and 1280px

### HTML Rules
- Semantic HTML5 elements (`<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`)
- First line of `<style>`: `@import '../../../../brands/[brand]/tokens/variables.css';`
- Scroll reveal attributes: `data-reveal` on sections, `data-reveal-stagger` on children
- `prefers-reduced-motion` must be respected

### Typography Rules
- Headlines are the design — never shrink display type
- Offbit accent font (`h5`/`h6`, `.label`) for labels and accent moments only — never for body
- Accent color (`--color-accent`, orange `#FE5102`) is earned — CTAs and accents only, never background fills
- Negative letter-spacing on display type: `-2px` (display), `-0.5px` to `-0.25px` (h1–h3)

---

## Output Conventions

**File path:** `outputs/[brand]/websites/[project-name]/index.html`

**Self-review checklist before finalizing:**
- [ ] All colors via `var(--color-*)`
- [ ] All sizes via `var(--space-*)`, `var(--font-size-*)`, `var(--radius-*)`
- [ ] Accent font used only for accent moments (not body)
- [ ] Accent color not used as background fill
- [ ] Display type has negative letter-spacing
- [ ] Mobile nav hidden below 768px
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375 / 768 / 1280px

---

## Common Workflows

### Build a website
```bash
./engine/scripts/brand.sh brand-a "build a landing page for [brief]"
```
Or read context manually and output to `outputs/brand-a/websites/[project]/index.html`.

### Sync tokens from Figma
```bash
cd brands/brand-a && node ../../engine/scripts/extract-tokens.js
# OR from project root:
node engine/scripts/extract-tokens.js --brand brand-a
```
Requires `FIGMA_TOKEN` and `FIGMA_FILE_KEY` in `brands/brand-a/.env`.

### Add a new brand (30 min)
```bash
mkdir -p brands/new-brand/tokens brands/new-brand/references/{images,typography,websites,patterns}
mkdir -p outputs/new-brand/{websites,campaigns,moodboards}
cp brands/brand-c/{figma-design-system.md,design-taste.md,design-director.md,.env.example} brands/new-brand/
```
Then fill in the three `.md` files and `.env`, and run token extraction.

### Iterate on a generated page
Never start over — iterate from the existing file. Read the file, apply targeted changes section by section.

---

## What NOT To Do

- **Never hardcode** hex colors, font families, or spacing values that exist as tokens
- **Never mix brand contexts** — one brand per session, never blend brand-a tokens with brand-b files
- **Never commit `.env` files** — they contain `FIGMA_TOKEN`
- **Never edit engine files for a single brand** — engine is universal; brand overrides go in `brands/[brand]/`
- **Never use JS frameworks** — vanilla HTML/CSS only for outputs
- **Never use Offbit for body copy** — accent font is for signal moments only
- **Never use orange as a background fill** — accent color is earned, not decorative

---

## Figma MCP Integration

The `mcp__claude_ai_Figma__*` tools are available. Use them to:
- Read design context: `get_design_context` with `fileKey=YOUR_FIGMA_FILE_KEY`
- Get variable definitions: `get_variable_defs`
- Sync tokens: `get_design_context` → update `brands/[brand]/figma-design-system.md`

When a Figma URL is provided, extract `fileKey` and `nodeId` from it and use `get_design_context` as the primary tool.

---

## Brand Registry

| Brand   | Status | Figma Key              |
|---------|--------|------------------------|
| brand-a | Template | add key to `.env` |
| brand-b | Template | add key to `.env` |
| brand-c | Template | add key to `.env` |

---

## Quick Reference — What Lives Where

| What | Where |
|------|-------|
| Colors, type, spacing values | `brands/[brand]/tokens/variables.css` |
| Figma token source of truth | `brands/[brand]/figma-design-system.md` |
| Aesthetic direction | `brands/[brand]/design-taste.md` |
| Brand strategy + voice | `brands/[brand]/design-director.md` |
| CSS component patterns | `engine/skills/frontend-design.md` |
| Animation patterns | `engine/skills/ui-animation.md` |
| Inspiration images | `brands/[brand]/references/images/` |
| Saved pattern snippets | `brands/[brand]/references/patterns/` |
| Generated websites | `outputs/[brand]/websites/[project]/` |
| Generated campaigns | `outputs/[brand]/campaigns/[project]/` |
