# molino

> *Mill, in Spanish.* The engine that grinds brand context into shipping work.

**molino** is the public engine of **Design OS** — a multi-brand design system where Claude is the primary builder. One engine, multiple brands. Claude reads the brand context and generates HTML/CSS outputs that ship.

> **Mental model:** Engine (universal skills + agents) + Brand (isolated context) → Output (generated HTML).

This repo is the engine — the agents, skills, and scripts that make the system work. Brand context and generated work live in private folders that are gitignored.

---

## Why this exists

I lead UX & growth design and spend a lot of time turning messy briefs into shipping work. The bottleneck was rarely ideas — it was the time between "we should try this" and "it's live and learning." This engine compresses that gap. Claude has the same context I do (brand tokens, design taste, voice, animation principles), so a single prompt builds a working page that matches the brand instead of a generic AI render.

Agents call into the same skills, brands stay isolated, and outputs are vanilla HTML + CSS — no build step, easy to hand off, easy to read.

---

## What's in here

```
engine/
  agents/
    figma-sync.md       ← reads/writes Figma tokens via MCP
    website-builder.md  ← builds complete sites from a brand brief
  skills/
    frontend-design.md  ← CSS patterns, component library, layout rules
    ui-animation.md     ← motion principles, scroll reveal, GSAP usage
  scripts/
    brand.sh            ← shell helper: loads context + invokes Claude
    extract-tokens.js   ← Node.js: Figma API → tokens.json + variables.css
    watch-references.js ← reference folder watcher for moodboarding
CLAUDE.md               ← architecture + conventions Claude reads first
```

### Skills

- **frontend-design.md** — opinionated CSS conventions. CSS variables only, no hardcoded hex or px, mobile-first, semantic HTML5, accessibility baked in.
- **ui-animation.md** — motion principles, GSAP + ScrollTrigger patterns, scroll-reveal recipes, and reduced-motion handling.

### Agents

- **figma-sync.md** — pulls Figma variables into tokens.json and a generated `variables.css`; can push token changes back to Figma via MCP.
- **website-builder.md** — given a brand brief, loads brand context, builds a complete responsive HTML/CSS page using the skills, and writes it to `outputs/[brand]/websites/[project]/`.

### Scripts

- **brand.sh** — loads engine skills + brand context in the right order, then invokes Claude with a prompt. The single entry point: `./engine/scripts/brand.sh brand-a "build a landing page for [brief]"`.
- **extract-tokens.js** — Node 18+. Reads a Figma file via API, converts variables into a `tokens.json` and CSS custom properties.

---

## How brands plug in (not in this repo)

Each brand has its own folder with everything Claude needs to make on-brand work:

```
brands/[brand]/
  figma-design-system.md  ← token values (source of truth)
  design-taste.md         ← aesthetic direction
  design-director.md      ← brand strategy + voice
  tokens/
    tokens.json
    variables.css
  references/             ← inspiration, typography, pattern snippets
  .env                    ← FIGMA_TOKEN, FIGMA_FILE_KEY (gitignored)
```

Brands are isolated. The engine never edits brand files; brands never overwrite engine files. One brand per session, no cross-pollination.

---

## Context loading order

Before any generation, Claude reads (in this order):

1. `engine/skills/frontend-design.md`
2. `engine/skills/ui-animation.md`
3. `brands/[brand]/figma-design-system.md`
4. `brands/[brand]/design-taste.md`
5. `brands/[brand]/design-director.md` *(only for campaign / brief work)*

`./engine/scripts/brand.sh` automates this.

---

## Tech stack

- **Output:** Vanilla HTML + CSS — no JS frameworks, no build step
- **Tokens:** CSS custom properties (`var(--token-name)`) from `variables.css`
- **Animation:** GSAP + ScrollTrigger via CDN for choreographed motion; CSS transitions for hover/focus
- **Token extraction:** Node 18+

---

## Highlighted output

The system has built a full portfolio site end-to-end. Each case study page is generated HTML following the same engine + brand pattern.

Live site: [arturohurtado.com](https://arturohurtado.com) *(coming soon)*

---

## License

MIT. See [LICENSE](LICENSE).

---

## Who built this

Arturo Hurtado — Senior UX & Growth Designer based in Chicago. Seven years in product, growth, and CRO. Bullish on AI inside the design process. This repo is part of how I work, not a side project.
