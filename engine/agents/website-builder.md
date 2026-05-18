# website-builder (agent)

> Builds complete websites for any brand. Always reads engine skills + active brand skills first.

## Invocation
```bash
./engine/scripts/brand.sh brand-a "build a landing page for the summer campaign"
./engine/scripts/brand.sh brand-b "build a portfolio site for [client]"
```

## Workflow

### 1. Load context
Read in this order:
1. `engine/skills/frontend-design.md`
2. `engine/skills/ui-animation.md`
3. `brands/[active-brand]/figma-design-system.md`
4. `brands/[active-brand]/design-taste.md`
5. `brands/[active-brand]/design-director.md` (if campaign/brief work involved)

### 2. Plan sections before writing code
```
Page: [name]
Brand: [active brand]
Sections:
  1. Nav — surface-light / surface-dark
  2. Hero — pattern: full-bleed / split / centered
  3. [section] — layout + surface
  4. [section] — layout + surface
  5. Footer
```

### 3. Build
Output: `outputs/[brand]/websites/[project-name]/index.html`
- First line of `<style>`: `@import '../../../../brands/[brand]/tokens/variables.css';`
- All values via CSS variables — zero hardcoded colors/sizes
- **Animation stack:** GSAP + ScrollTrigger via CDN (see `engine/skills/ui-animation.md`).
  Only load extra plugins (SplitText, DrawSVG, MotionPath, etc.) when the page actually uses them.
- Scroll reveals on all major sections (`data-reveal`, `data-reveal-stagger`) wired via GSAP
- Choreographed/scroll-driven motion → GSAP; hover/focus/press → CSS transitions
- Responsive at 375px / 768px / 1280px
- Semantic HTML5

### 4. Self-review checklist
- [ ] All colors via `var(--color-*)`
- [ ] All sizes via `var(--space-*)`, `var(--font-size-*)`, `var(--radius-*)`
- [ ] Accent font (h5/h6) used only for accent moments, not body
- [ ] Accent color not used as a background fill
- [ ] Display type has negative letter-spacing applied
- [ ] Mobile nav hidden below 768px
- [ ] GSAP + ScrollTrigger loaded; only used plugins included (no dead CDN scripts)
- [ ] All GSAP inits wrapped in `gsap.matchMedia({ reduced, normal })` — `prefers-reduced-motion` respected
- [ ] At most one pinned ScrollTrigger section on the page; no parallax on mobile
- [ ] No GSAP used for hover/focus states (CSS only); no infinite loops outside marquees

### 5. Output summary
```
✅ Built: [page name] for [brand]
📁 File: outputs/[brand]/websites/[project]/index.html
🎨 Brand: [brand] tokens loaded
📐 Sections: [list]
🌐 Preview: open in Live Server
```
