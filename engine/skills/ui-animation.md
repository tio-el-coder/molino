# ui-animation (engine skill)

> **GSAP-first.** Universal motion patterns for Design OS websites. Brand-agnostic.
> Aesthetic tone (fast/slow, playful/editorial) is set by the active brand's `design-taste.md`.
> For deep API reference (timeline, plugins, performance) see the GSAP skills marketplace
> plugin: `/plugin marketplace add greensock/gsap-skills`. This file is the **opinionated
> Design OS layer** on top — what to use, what to avoid, and how it ties to brand tokens.

---

## When to use what

| Need                                    | Tool                                                |
| --------------------------------------- | --------------------------------------------------- |
| Hover/focus state, button press         | CSS `transition` (do not reach for GSAP)            |
| Scroll reveal, stagger, pin, scrub      | **GSAP + ScrollTrigger**                            |
| Timeline / choreographed sequence       | **GSAP `gsap.timeline()`**                          |
| Headline split (word/char)              | **GSAP + SplitText** (free since Webflow acq.)      |
| SVG draw, morph, motion path            | **GSAP + DrawSVG / MorphSVG / MotionPath**          |
| Marquee / infinite ticker               | **GSAP `repeat: -1` on x**                          |
| Counter on view                         | **GSAP `gsap.to({ value }, { snap: 1 })`**          |
| Page transition                         | GSAP timeline on `body` enter/leave                 |

Rule of thumb: **if it's interactive and momentary, use CSS. If it's choreographed or scroll-driven, use GSAP.**

---

## Setup — every site

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<!-- Add only the plugins the page actually uses: -->
<!-- <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script> -->
<!-- <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/DrawSVGPlugin.min.js"></script> -->
```

```javascript
gsap.registerPlugin(ScrollTrigger /*, SplitText, DrawSVGPlugin */);

// Project-wide defaults — match the brand's editorial feel.
// Override per-tween if a section needs a different rhythm.
gsap.defaults({ ease: 'power3.out', duration: 0.8 });
```

GSAP is fully free (Webflow acquired GreenSock — every plugin is unlocked, no auth token).

---

## Brand-aware timing — pull from `variables.css`

Read durations and easings from the brand's tokens instead of hardcoding seconds:

```javascript
const css = getComputedStyle(document.documentElement);
const ms = (name) => parseFloat(css.getPropertyValue(name)) / 1000;

const T = {
  fast:      ms('--duration-fast')      || 0.15,
  normal:    ms('--duration-normal')    || 0.25,
  slow:      ms('--duration-slow')      || 0.4,
  cinematic: ms('--duration-cinematic') || 0.9,
};

gsap.from('.hero-headline', { y: 40, opacity: 0, duration: T.cinematic });
```

If the brand's tokens use ms strings (`250ms`), strip the suffix; if they're CSS `cubic-bezier(...)` values, pass them to GSAP via `CustomEase` (see gsap-plugins skill).

---

## Reduced motion — always use `matchMedia`

```javascript
gsap.matchMedia().add({
  reduced: '(prefers-reduced-motion: reduce)',
  normal:  '(prefers-reduced-motion: no-preference)',
}, (ctx) => {
  const { reduced } = ctx.conditions;

  if (reduced) {
    // Snap reveals to final state — no motion, no fade-up
    gsap.set('[data-reveal], [data-reveal-stagger] > *', { opacity: 1, y: 0 });
    return;
  }

  // All normal animations live inside this block so GSAP auto-cleans them
  // when the media query no longer matches.
  initReveals();
  initHeroTimeline();
});
```

This is non-negotiable. Every site must pass the reduced-motion check.

---

## Scroll reveal — the default pattern

```javascript
function initReveals() {
  // Single elements
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      y: 32, opacity: 0, duration: T.slow, ease: 'power3.out',
    });
  });

  // Staggered children
  gsap.utils.toArray('[data-reveal-stagger]').forEach((group) => {
    gsap.from(group.children, {
      scrollTrigger: { trigger: group, start: 'top 80%', once: true },
      y: 24, opacity: 0, duration: T.slow, stagger: 0.08, ease: 'power3.out',
    });
  });
}
```

```html
<section data-reveal>...</section>
<ul data-reveal-stagger>
  <li>One</li><li>Two</li><li>Three</li>
</ul>
```

Use `once: true` for content reveals — they shouldn't replay on scroll-back.

---

## Headline split reveal — SplitText

```javascript
gsap.utils.toArray('[data-split-reveal]').forEach((el) => {
  const split = new SplitText(el, { type: 'words,lines' });
  gsap.from(split.words, {
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    y: 24, opacity: 0, duration: T.slow, stagger: 0.04, ease: 'power3.out',
  });
});
```

Always set the parent to `overflow: hidden` if you want a true "rise from below the line."

---

## Section pin + scrub — editorial moments only

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: '#case-study-hero',
    start: 'top top',
    end: '+=80%',
    pin: true,
    scrub: 0.6,        // smooth follow; 0 = locked to scroll
  },
})
  .to('.hero-title', { y: -80, opacity: 0 })
  .from('.hero-detail', { y: 60, opacity: 0 }, 0.2);
```

Use sparingly: at most **one pinned section per page**, and never on mobile (`gsap.matchMedia` to guard).

---

## Counter on view

```javascript
gsap.utils.toArray('[data-counter]').forEach((el) => {
  const end = +el.dataset.counter;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: end,
    duration: 1.2,
    ease: 'power2.out',
    snap: { v: 1 },
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    onUpdate: () => { el.textContent = obj.v.toLocaleString(); },
  });
});
```

```html
<h5 class="h5" data-counter="2400">0</h5>
```

---

## Marquee / ticker

```javascript
function marquee(selector, duration = 40) {
  const track = document.querySelector(selector);
  if (!track) return;
  track.innerHTML += track.innerHTML;     // duplicate for seamless loop
  gsap.to(track, {
    xPercent: -50,
    duration, ease: 'none', repeat: -1,
  });
}
marquee('.ticker__track', 35);
```

---

## Page transition

```javascript
// Enter
gsap.from('body', { autoAlpha: 0, duration: T.slow, ease: 'power2.out' });

// Leave — intercept internal links
document.querySelectorAll('a[href]').forEach((a) => {
  if (a.hostname !== location.hostname || a.target === '_blank') return;
  a.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to('body', {
      autoAlpha: 0, duration: T.normal, ease: 'power2.in',
      onComplete: () => { location.href = a.href; },
    });
  });
});
```

`autoAlpha` (GSAP) animates both `opacity` and `visibility` — preferred over plain opacity.

---

## Cleanup — only matters for SPAs

For vanilla multi-page sites (the Design OS default), GSAP cleans up on unload automatically.
For SPAs / single-file portfolios with route changes, wrap inits in `gsap.context()`:

```javascript
const ctx = gsap.context(() => {
  initReveals();
  initHeroTimeline();
}, document.querySelector('main'));

// Before swapping content:
// ctx.revert();
```

---

## Micro-interactions — stay in CSS

GSAP is overkill for hover/focus. Keep these in CSS using the brand's timing tokens:

```css
.btn {
  transition:
    background var(--duration-fast) var(--ease-out),
    transform  var(--duration-fast) var(--ease-out);
}
.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0); transition-duration: var(--duration-instant); }

.card {
  transition:
    transform    var(--duration-normal) var(--ease-spring),
    border-color var(--duration-normal) var(--ease-out);
}
.card:hover { transform: translateY(-3px); }

.link::after {
  content: ''; position: absolute; left: 0; bottom: -1px;
  width: 0; height: 1.5px; background: var(--color-accent);
  transition: width var(--duration-normal) var(--ease-out);
}
.link:hover::after { width: 100%; }
```

Mix freely with GSAP — they don't fight each other.

---

## Rules (enforced)

1. **GSAP for choreography, CSS for state changes.** Never use GSAP for a hover lift.
2. **One pinned section per page.** Pinning compounds — second pin almost always feels wrong.
3. **No infinite loops on content.** Marquees and tickers only — never on hero text, badges, etc.
4. **No parallax on mobile.** Guard with `gsap.matchMedia({ desktop: '(min-width: 768px)' })`.
5. **No bounce/elastic.** Reserved for explicitly playful brands — check `design-taste.md`.
6. **Never animate `color`.** Use `opacity` or instant swaps; color tweens look muddy on warm/cool palettes.
7. **`autoAlpha` over `opacity`** when fading in/out — handles `visibility` for assistive tech.
8. **Pull durations from brand tokens** when possible (see brand-aware timing above).
9. **Always use `gsap.matchMedia` for `prefers-reduced-motion`** — never just `@media` CSS for JS-driven animation.
10. **`once: true` on content reveals.** Don't replay on scroll-back unless it's a decorative loop.

---

## When to load which plugin

| Plugin           | Load when…                                                 |
| ---------------- | ---------------------------------------------------------- |
| ScrollTrigger    | Any scroll-driven animation (always load if the page scrolls) |
| SplitText        | Headline word/line/char reveals                            |
| DrawSVGPlugin    | Animating SVG stroke draw-in (case study trails, hero marks) |
| MorphSVGPlugin   | Shape A → shape B SVG morphs                               |
| MotionPathPlugin | Element follows an SVG path (e.g. paper airplane around stats) |
| Flip             | Layout transitions (FLIP technique) — gallery → detail expansions |
| CustomEase       | Importing a brand's custom `cubic-bezier(...)` token as a GSAP ease |
| ScrollToPlugin   | Smooth-scroll to anchors / TOC navigation                  |

Don't ship plugins the page doesn't use — page weight matters more than convenience.

---

## Defer to the marketplace plugin for…

…full API tables, edge cases, framework integration. The GSAP skills plugin
(`greensock/gsap-skills`) auto-loads `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`,
`gsap-plugins`, `gsap-utils`, `gsap-react`, `gsap-performance`, and `gsap-frameworks`
on demand. This file is the **Design OS opinion** on top of it.
