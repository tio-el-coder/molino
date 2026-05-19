# molino

> *Mill, in Spanish.* The engine that grinds brand context into shipping work.

**molino** is the public engine of **Design OS** — a multi-brand design system where Claude is the primary builder. One engine, multiple brands. Claude reads the brand context and outputs HTML + CSS that ships.

[**See it shipping →**](https://arturohurtado.com) &nbsp;·&nbsp; [**Worked example →**](./examples/glowing-booth/) &nbsp;·&nbsp; [**How it works →**](./docs/HOW-IT-WORKS.md) &nbsp;·&nbsp; [**Security →**](./SECURITY.md)

---

## Quickstart

```bash
git clone https://github.com/tio-el-coder/molino.git
cd molino
./bin/molino init lumen --figma https://www.figma.com/design/<key>/<name>
```

That scaffolds `brands/lumen/` with starter context files and `outputs/lumen/` for generated work. Add your Figma token to `brands/lumen/.env`, run `./bin/molino extract --brand lumen` to pull live tokens, then ship.

```bash
./bin/molino --help                       # all commands
./bin/molino init                         # interactive
./bin/molino init lumen                   # named, prompts for Figma URL
./bin/molino extract --brand lumen        # pull Figma tokens
```

Zero npm dependencies. Node 18+. Everything runs locally.

---

## The 30-second version

```
engine (this repo)        brand (private, gitignored)         output
─────────────────────────────────────────────────────────────────────────────
skills/                   brands/glowing-booth/                outputs/glowing-booth/
  frontend-design.md       figma-design-system.md   ────►        websites/photobooth/
  ui-animation.md          design-taste.md                        index.html
                           design-director.md                     (vanilla HTML + CSS)
agents/                    tokens/variables.css
  website-builder.md       references/
  figma-sync.md            .env (FIGMA_TOKEN, never committed)
```

One engine. Many brands. Each brand stays isolated — never mixes context, never shares tokens. Claude loads the engine skills, then loads exactly one brand at a time, then writes shipping HTML to that brand's output folder.

---

## What's in this repo

```
bin/
  molino                  ← CLI entry point (init, extract, --help, --version)

engine/
  agents/
    figma-sync.md         ← reads/writes Figma tokens via MCP
    website-builder.md    ← builds complete sites from a brand brief
  skills/
    frontend-design.md    ← CSS patterns, component library, layout rules
    ui-animation.md       ← motion principles, scroll reveal, GSAP usage
  scripts/
    brand.sh              ← shell helper: loads context + invokes Claude
    init.js               ← `molino init` — scaffold a new brand
    extract-tokens.js     ← Node: Figma API → tokens.json + variables.css
    watch-references.js   ← reference folder watcher for moodboarding

examples/
  glowing-booth/          ← a complete worked example you can read end-to-end
    figma-design-system.md
    design-taste.md
    design-director.md
    tokens/
    output/index.html     ← the generated page (open it in a browser)

docs/
  HOW-IT-WORKS.md         ← a case-study walkthrough of a real build

CLAUDE.md                 ← architecture + conventions Claude reads first
SECURITY.md               ← threat model + reporting policy
```

---

## Quick read

**Skills** — universal design knowledge Claude pulls into every project.
- [`frontend-design.md`](./engine/skills/frontend-design.md) — opinionated CSS conventions. CSS variables only, no hardcoded hex or px, mobile-first, semantic HTML5, accessibility baked in.
- [`ui-animation.md`](./engine/skills/ui-animation.md) — motion principles, GSAP + ScrollTrigger patterns, scroll-reveal recipes, reduced-motion gating.

**Agents** — task-specific behaviors that combine skills with brand context.
- [`website-builder.md`](./engine/agents/website-builder.md) — given a brand brief, loads brand context + skills, generates a complete responsive HTML/CSS page, writes it to `outputs/[brand]/websites/[project]/`.
- [`figma-sync.md`](./engine/agents/figma-sync.md) — pulls Figma variables into `tokens.json` and `variables.css`; can push token changes back via MCP.

**Scripts**
- [`brand.sh`](./engine/scripts/brand.sh) — single entry point: `./engine/scripts/brand.sh glowing-booth "build a landing page for the photobooth product"`.
- [`extract-tokens.js`](./engine/scripts/extract-tokens.js) — Node 18+. Reads a Figma file via API, converts variables into CSS custom properties.

---

## Worked example — Glowing Booth

[`examples/glowing-booth/`](./examples/glowing-booth/) contains a complete brand the engine has actually built for. Three context files (Figma tokens, design taste, brand strategy), tokens, and the generated HTML output. Open the example's README first, then `output/index.html` in a browser.

Brand DNA: high-contrast editorial. Charcoal on vanilla. Orange as the earned accent. Generous display type. Analog warmth.

---

## Why this exists

I lead UX & growth design. The bottleneck has never been ideas — it's the time between "we should try this" and "it's live and learning." This engine compresses that gap. Claude has the same context I do (brand tokens, design taste, voice, animation principles), so a single prompt builds a working page that matches the brand instead of a generic AI render. Agents call into the same skills. Brands stay isolated. Outputs are vanilla HTML + CSS — easy to hand off, easy to read, no build step.

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
- **AI:** Claude (Opus or Sonnet) via the Claude Agent SDK / Claude Code

---

## Security

molino runs locally, has zero npm dependencies, and never sends telemetry. Secrets (`.env`) and brand work (`brands/`, `outputs/`) are gitignored by default. `molino init` validates brand names against path traversal, blocks reserved names, and refuses to write through symlinks. Read [SECURITY.md](./SECURITY.md) before pointing it at a real Figma token, and use a read-only scoped token when you can.

---

## License

MIT. See [LICENSE](./LICENSE).

---

## Who built this

[**Arturo Hurtado**](https://arturohurtado.com) — Senior UX & Growth Designer based in Chicago. Seven years in product, growth, and CRO. Bullish on AI inside the design process. **molino** is part of how I actually work, not a side project. The portfolio at the link above is end-to-end generated by this engine.
