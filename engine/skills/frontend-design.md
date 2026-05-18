# frontend-design (engine skill)

> Universal component patterns and CSS architecture. This skill is brand-agnostic.
> It MUST be used alongside the active brand's `figma-design-system.md` which
> supplies all token values. Never hardcode colors, fonts, or sizes here.

---

## Setup — every website starts with this

```html
<!-- Always import the active brand's variables first -->
<link rel="stylesheet" href="/tokens/variables.css">
```

All CSS below uses `var(--token-name)` — values come from the brand's `variables.css`.

---

## Base reset

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-text);
  font-size: var(--font-size-body2);
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { font-family: var(--font-headings); line-height: 1.2; }
h5, h6          { font-family: var(--font-accent);   line-height: 1.5; }
```

---

## Typography classes

```css
.display-1 { font-family: var(--font-display); font-size: var(--font-size-display1); font-weight: 700; line-height: 1.2; }
.display-2 { font-family: var(--font-display); font-size: var(--font-size-display2); font-weight: 400; line-height: 1.25; }
.h1 { font-size: var(--font-size-h1); font-weight: 700; }
.h2 { font-size: var(--font-size-h2); font-weight: 700; }
.h3 { font-size: var(--font-size-h3); font-weight: 700; }
.h4 { font-size: var(--font-size-h4); font-weight: 500; }
.h5 { font-family: var(--font-accent); font-size: var(--font-size-h5); font-weight: 700; }
.h6 { font-family: var(--font-accent); font-size: var(--font-size-h6); font-weight: 700; }
.body-1  { font-size: var(--font-size-body1); line-height: 1.5; }
.body-2  { font-size: var(--font-size-body2); line-height: 1.5; }
.caption { font-size: var(--font-size-caption); color: var(--color-muted); }
.label   { font-size: var(--font-size-label); font-weight: 500; }
```

---

## Container + section

```css
.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--padding);
}
.section { padding-block: var(--space-96); }
@media (max-width: 768px) { .section { padding-block: var(--space-64); } }
@media (max-width: 640px) { .section { padding-block: var(--space-48); } }
```

---

## Surface variants

```css
.surface-light  { background: var(--color-bg);      color: var(--color-text); }
.surface-dark   { background: var(--color-bg-dark);  color: var(--color-text-inverse); }
.surface-brand  { background: var(--color-accent);   color: var(--color-white); }
.surface-glass  {
  background: var(--color-glass, rgba(255,255,255,0.15));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
}
```

---

## Buttons

```css
.btn {
  display: inline-flex; align-items: center; gap: var(--space-8);
  padding: var(--space-14) var(--space-24);
  font-family: var(--font-text); font-size: var(--font-size-button); font-weight: 500;
  border-radius: var(--radius-lg); cursor: pointer; border: none; text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease;
}
.btn-primary { background: var(--color-accent); color: var(--color-white); }
.btn-primary:hover { background: var(--color-accent-hover); transform: translateY(-1px); }
.btn-secondary { background: transparent; color: var(--color-text); border: 1.5px solid var(--color-border); }
.btn-secondary:hover { border-color: var(--color-accent); color: var(--color-accent); }
.btn-ghost { background: transparent; color: var(--color-text-inverse); border: 1.5px solid rgba(255,255,255,0.25); }
.btn-ghost:hover { background: rgba(255,255,255,0.08); }
.btn:active { transform: translateY(0); }
```

---

## Navigation

```css
.nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-20) var(--padding);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}
.nav-logo { height: 32px; }
.nav-links { display: flex; gap: var(--space-32); list-style: none; }
.nav-link { font-size: var(--font-size-body2); font-weight: 500; color: var(--color-text); text-decoration: none; transition: color 0.15s; }
.nav-link:hover { color: var(--color-accent); }
@media (max-width: 768px) { .nav-links, .nav-cta { display: none; } }
```

---

## Hero patterns

```css
.hero { padding-block: var(--space-128); }
.hero-actions { display: flex; gap: var(--space-16); margin-top: var(--space-40); flex-wrap: wrap; }

/* Split 50/50 */
.hero-split { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-64); align-items: end; }
@media (max-width: 768px) { .hero-split { grid-template-columns: 1fr; } }

/* Full-width centered */
.hero-centered { text-align: center; max-width: 800px; margin-inline: auto; }
.hero-centered .hero-actions { justify-content: center; }
```

---

## Cards

```css
.card {
  background: var(--color-bg); border: 1px solid var(--color-border);
  border-radius: var(--radius-xl); padding: var(--space-32);
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover { border-color: var(--color-accent); transform: translateY(-2px); }
.card-dark { background: var(--color-bg-dark); border-color: var(--color-border-dark, rgba(255,255,255,0.1)); color: var(--color-text-inverse); }
```

---

## Grid systems

```css
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-32); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-24); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-20); }
.grid-editorial { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-64); align-items: start; }
@media (max-width: 1024px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .grid-2, .grid-3, .grid-4, .grid-editorial { grid-template-columns: 1fr; } }
```

---

## Accent underline

```css
.underline-accent { position: relative; text-decoration: none; }
.underline-accent::after {
  content: ''; position: absolute; bottom: -2px; left: 0;
  width: 0; height: 2px; background: var(--color-accent);
  transition: width 0.25s ease;
}
.underline-accent:hover::after { width: 100%; }
```

---

## Universal coding rules

1. Mobile-first CSS — base styles for mobile, `min-width` media queries to scale up
2. CSS variables only — never hardcode hex, px values, or font names that have tokens
3. No box-shadows — use borders and background contrast for depth
4. No gradients on brand surfaces — flat fills only (exception: image overlays)
5. Transitions 0.15s–0.25s — never over-animate
6. Border-radius from the token scale — never invent values
7. Responsive images: `object-fit: cover`
8. Always test at 375px, 768px, and 1280px widths
