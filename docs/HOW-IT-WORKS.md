# How molino actually works

A walkthrough of what happens between *"build a landing page for the photobooth product"* and a shipping HTML file in `outputs/glowing-booth/websites/photobooth/index.html`.

We'll use the real worked example from [`examples/glowing-booth/`](../examples/glowing-booth/) — the one whose generated output lives at [`examples/glowing-booth/output/index.html`](../examples/glowing-booth/output/index.html).

---

## The mental model in one line

> **Engine + Brand → Output.** The engine knows how to design. The brand knows what to design. The output is the result of forcing both to be in the same room.

That's it. Everything below is mechanics.

---

## What "engine" means

The engine is universal — same for every brand. It lives in two places:

**`engine/skills/`** — knowledge Claude pulls into every project, regardless of brand:

- `frontend-design.md` — *how* to build interfaces. Mobile-first, semantic HTML5, CSS custom properties only (never hardcoded hex or px), accessibility baked in, no box-shadows, no gradients on brand surfaces, transitions between 0.15s and 0.25s. Opinionated.
- `ui-animation.md` — *how* to move. GSAP + ScrollTrigger patterns for choreographed motion, CSS for hover and focus, reduced-motion gating non-negotiable.

**`engine/agents/`** — task-specific behaviors that combine the skills above with brand context:

- `website-builder.md` — given a brief, builds a complete page.
- `figma-sync.md` — pulls or pushes tokens to Figma.

Agents don't carry brand opinions. They carry process. Skills don't carry brand opinions either — they carry craft. Brand is its own layer.

---

## What "brand" means

A brand is a folder. Three markdown files that act as Claude's local context for one and only one brand:

```
glowing-booth/
  figma-design-system.md   ← every token Claude is allowed to use
  design-taste.md          ← the aesthetic logic — what looks right and why
  design-director.md       ← strategy and voice — what the brand fights for
  tokens/
    tokens.json
    variables.css
```

The three files are deliberately separated:

- **Tokens** are mechanical. Colors, type sizes, spacing, radii. The source of truth.
- **Taste** is aesthetic. *Why* the orange is earned, not decorative. *Why* the type is large and unapologetic. The reasoning that lets Claude make on-brand judgment calls that aren't covered by the tokens.
- **Director** is strategic. The brand truth, the audience tension, the voice. The reasoning that lets Claude make *campaign* decisions — naming, copy, what the page is *for* — not just *what it looks like*.

You can build a website with tokens + taste alone. You need the director for headlines and creative briefs.

For Glowing Booth (the example brand), the DNA is:

- High contrast: charcoal on vanilla. Black on orange. Never muddy.
- Generous scale: display type is large and unapologetic.
- Warm, not cold: vanilla backgrounds, orange accents, analog imagery.
- Precision grotesque + pixel accent: Neue Haas Grotesk for Swiss precision, OffBit for personality. The tension is the brand voice.

That's articulated in [`examples/glowing-booth/design-taste.md`](../examples/glowing-booth/design-taste.md) in plain prose. Claude reads it and uses it.

---

## What "output" means

Vanilla HTML + CSS. No JS frameworks, no build step.

The output is `outputs/[brand]/websites/[project]/index.html`. Brand isolation is enforced at the path level — there's no shared output folder. Glowing Booth never accidentally ends up in someone else's directory.

[`examples/glowing-booth/output/index.html`](../examples/glowing-booth/output/index.html) is the real generated landing page. Open it. Every color is `var(--color-...)`. Every spacing is `var(--space-...)`. Every transition obeys the engine rules.

---

## A real run, step by step

Command:

```bash
./engine/scripts/brand.sh glowing-booth "build a landing page for the photobooth product, mobile-first, with the booking CTA above the fold on every breakpoint"
```

### Step 1 — Context loading order

`brand.sh` reads files in this exact order and concatenates them into Claude's context window:

1. `engine/skills/frontend-design.md` (universal CSS conventions)
2. `engine/skills/ui-animation.md` (universal motion principles)
3. `brands/glowing-booth/figma-design-system.md` (brand tokens)
4. `brands/glowing-booth/design-taste.md` (brand aesthetic logic)
5. `brands/glowing-booth/design-director.md` (brand strategy + voice — optional, included for campaign-flavored briefs)

Order matters. Universal rules first, brand specifics second. The brand can *narrow* the engine's choices (the engine says "use any CSS variable"; the brand says "the only CSS variables that exist are these"), but it can't override the engine's craft rules (no hardcoded hex, no gradients on brand surfaces, etc.).

### Step 2 — Token resolution

Before generation, Claude has access to the actual CSS variables via `brands/glowing-booth/tokens/variables.css`. So when the engine rule says "no hardcoded hex," Claude doesn't have to guess what hex *would* match the brand — it can read `--color-secondary-orange: #FE5102` and just write `color: var(--color-secondary-orange)`.

The token file is generated by `engine/scripts/extract-tokens.js`, which pulls Figma variables via the Figma REST API. So the design system stays in sync — designer changes a token in Figma, runs the extractor, Claude is using the new value on the next build.

### Step 3 — Generation

Claude writes a complete `index.html` with:

- Inline `<style>` block (no external CSS file for a single-page output — easy to copy, easy to hand off)
- First line of `<style>`: `@import '../../../../brands/glowing-booth/tokens/variables.css';`
- Semantic HTML5 (`<section>`, `<article>`, `<header>`, `<footer>`)
- Mobile-first responsive (375 / 768 / 1280 breakpoints)
- Scroll-reveal `data-reveal` attributes on sections, `data-reveal-stagger` on children
- A small GSAP + ScrollTrigger script tag from a CDN
- `prefers-reduced-motion` respected

### Step 4 — Self-review

Before declaring done, the agent runs through its own checklist:

- All colors via `var(--color-*)` (not hex)
- All sizes via `var(--space-*)`, `var(--font-size-*)`, `var(--radius-*)`
- OffBit accent font used only for accent moments, not body
- Orange not used as a background fill (it's an *earned* accent)
- Display type has negative letter-spacing
- Mobile nav hidden below 768px
- Responsive verified at 375 / 768 / 1280px

If any check fails, the agent fixes and re-runs the checklist. The page doesn't ship until it passes.

### Step 5 — Output written

`outputs/glowing-booth/websites/photobooth/index.html` exists. Open it in a browser. It's the same file you see at [`examples/glowing-booth/output/index.html`](../examples/glowing-booth/output/index.html).

---

## What makes this different from "ask an AI to make a webpage"

Two things, mostly:

**1. The brand is a first-class input, not a vibe.**
Generic AI page builders interpret "make it feel like Glowing Booth" through whatever Claude has in training data, which is roughly nothing for any individual brand. molino reads three real markdown files that articulate the brand in detail, plus the real Figma token values, plus the engine's universal craft rules. So the output is constrained, on-token, and consistent — not a hallucination of what a "photobooth landing page" might look like.

**2. The engine has opinions.**
Every page coming out of molino obeys the same craft rules: no hardcoded hex, no box-shadows for depth, no gradients on brand surfaces, transitions in the 150–250ms band, reduced-motion respected. Those rules live in markdown that the engine reads. So a page generated for Glowing Booth and a page generated for a totally different brand still feel like they were built by the same hand — because they were, just with different brand contexts.

---

## What's not in this repo

- The actual `brands/glowing-booth/` working folder (lives in private storage, gitignored)
- The full `outputs/` directory across every brand
- `.env` files containing Figma tokens
- Other brand folders the engine is configured for

What you're reading here is the public layer — the engine, an example brand, and the scaffolding around them. Everything is reproducible if you bring your own brand files and your own Figma token.

---

## Who built this

Arturo Hurtado — Senior UX & Growth Designer based in Chicago. The portfolio at [arturohurtado.com](https://arturohurtado.com) is end-to-end generated by molino. The case study pages, the homepage thumbnails, the off-clock fan-out interactions, the solari split-flap clock in the nav — all of it came out of this engine running against an Arturo-brand folder structurally identical to [`examples/glowing-booth/`](../examples/glowing-booth/).

If you're hiring senior design and want someone who treats AI like a serious tool instead of a parlor trick, talk to me.
