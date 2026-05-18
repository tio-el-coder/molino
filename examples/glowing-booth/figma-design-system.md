# figma-design-system

**Figma file:** The Brand Design System
**File key:** `YOUR_FIGMA_FILE_KEY` *(redacted for the public example — set in `.env`)*
**Token file:** `tokens/tokens.json`
**CSS variables:** `tokens/variables.css`
**Last synced:** 2026-03-27

> This skill is the single source of truth. Every color, font, spacing value, radius, and component referenced in all other skills must trace back to this file. Never use arbitrary or generic values when building anything for this system.

---

## File structure

| Page | Purpose |
|---|---|
| Intro | System overview and orientation |
| ◘ Core | Brand, Variables, Creative Assets, File, Icons |
| ◘ Assets | Slides, Social, Instagram, Carousel, Brand Presentations |
| ◘ Guidelines | Usage rules |
| ◘ Design System | System architecture frames |

---

## Color system

### Primary palette — the brand's core identity
| Name | Hex | CSS variable | Role |
|---|---|---|---|
| Charcoal | `#191919` | `--color-primary-charcoal` | Primary text, dark backgrounds, hero sections |
| Vanilla | `#FFFAEE` | `--color-primary-vanilla` | Page background, light surfaces, inverse text |
| Orange | `#FE5102` | `--color-secondary-orange` | CTAs, accent, brand moments, hover states |

### Brand scale — the orange ramp
| Step | Hex | CSS variable |
|---|---|---|
| brand-25 | `#FFF9F5` | `--color-brand-25` |
| brand-50 | `#FFF3EB` | `--color-brand-50` |
| brand-100 | `#FFE4D4` | `--color-brand-100` |
| brand-200 | `#FFC8A8` | `--color-brand-200` |
| brand-300 | `#FFA370` | `--color-brand-300` |
| brand-400 | `#FF7A38` | `--color-brand-400` |
| brand-500 | `#FE5102` | `--color-brand-500` ← primary accent |
| brand-600 | `#E64400` | `--color-brand-600` ← hover |
| brand-700 | `#BF3600` | `--color-brand-700` |
| brand-800 | `#992D05` | `--color-brand-800` |
| brand-900 | `#7A280A` | `--color-brand-900` |
| brand-950 | `#431302` | `--color-brand-950` |

### Mono scale
| Step | Hex | CSS variable |
|---|---|---|
| Black | `#000000` | `--color-black` |
| 90 | `#1E1E1E` | `--color-mono-90` |
| 80 | `#383838` | `--color-mono-80` |
| 70 | `#4A4A4A` | `--color-mono-70` |
| 60 | `#595959` | `--color-mono-60` |
| 50 | `#787878` | `--color-mono-50` |
| 40 | `#A3A3A3` | `--color-mono-40` |
| 30 | `#C7C7C7` | `--color-mono-30` |
| 20 | `#DDDEE2` | `--color-mono-20` |
| 10 | `#F0F0F0` | `--color-mono-10` |
| White | `#FFFFFF` | `--color-white` |

### UX colors
| Name | Hex | CSS variable |
|---|---|---|
| Success | `#07CB9C` | `--color-success` |
| Error | `#FF3737` | `--color-error` |

### Glass fill style
A 20% opacity Vanilla (`#FFFAEE` at 0.2 alpha) — used on glass logo variants and overlay surfaces.
`background: rgba(255, 250, 238, 0.20)` or `--color-glass`.

### Semantic aliases — always use these in code
```css
--color-bg           /* page background → vanilla */
--color-bg-dark      /* dark sections → charcoal */
--color-text         /* body text → charcoal */
--color-text-inverse /* text on dark → vanilla */
--color-accent       /* CTAs, links → orange */
--color-accent-hover /* hover → brand-600 */
--color-border       /* light borders → mono-20 */
--color-muted        /* captions, placeholders → mono-50 */
```

---

## Typography system

### Font families
| Role | Family | Use |
|---|---|---|
| Display / Headings | Neue Haas Grotesk Display Pro | D1, D2, H1–H4, all major headlines |
| Body / Text | Neue Haas Grotesk Text Pro | Body 1, Body 2, Button, Label, Caption |
| Accent | OffBit | H5, H6, Social H2, counters, data callouts, campaign numbers |

**OffBit is a pixel typeface.** Use sparingly and intentionally. It signals data, technology, brand-forward moments. Never use it for body copy.

### Text styles (from Figma — exact values)

**Display**
| Style | Size | Weight | Letter spacing | Line height |
|---|---|---|---|---|
| Display/d1 | 60px | 75 Bold | -2px | 120% |
| Display/d2 | 38px | 55 Roman | -2px | 125% |

**Headings**
| Style | Size | Weight | Letter spacing | Line height | Font |
|---|---|---|---|---|---|
| Headings/h1 | 32px | 75 Bold | -0.5px | 120% | NHG Display Pro |
| Headings/h2 | 28px | 75 Bold | -0.5px | 120% | NHG Display Pro |
| Headings/h3 | 24px | 75 Bold | -0.25px | 120% | NHG Display Pro |
| Headings/h4 | 22px | 65 Medium | -0.25px | 120% | NHG Display Pro |
| Headings/h5 | 20px | 101 Bold | 0px | 150% | **OffBit** |
| Headings/h6 | 18px | 101 Bold | 0px | 150% | **OffBit** |

**Text**
| Style | Size | Weight | Line height |
|---|---|---|---|
| Text/Body 1 | 20px | 55 Roman | 125% |
| Text/Body 2 | 16px | 55 Roman | 125% |
| Text/Button | 16px | 65 Medium | 125% |
| Text/Label | 12px | 65 Medium | 125% |
| Text/Caption | 12px | 55 Roman | 125% |

**Social scale** (for campaign / social creative assets)
| Style | Size | Font |
|---|---|---|
| Social/d1 | 200px | NHG Display Pro Bold |
| Social/d2 | 160px | NHG Display Pro Bold |
| Social/d3 | 120px | NHG Display Pro Bold |
| Social/h1 | 80px | NHG Display Pro Medium |
| Social/h2 | 64px | **OffBit** Bold |
| Social/h3 | 52px | NHG Display Pro Medium |
| Social/Body 1 | 40px | NHG Text Pro Roman |

### Fluid type — responsive breakpoints
All heading sizes scale across three modes:

| Style | Mobile | Tablet | Desktop |
|---|---|---|---|
| Display 1 | 60px | 112px | 160px |
| Display 2 | 38px | 80px | 120px |
| H1 | 32px | 40px | 56px |
| H2 | 28px | 36px | 48px |
| H3 | 24px | 30px | 40px |
| H4 | 22px | 28px | 32px |
| H5 | 20px | 24px | 28px |
| H6 | 18px | 22px | 24px |

---

## Spacing system

All spacing values come from `size/spacing/*` in the Global collection. Always use CSS variables.

`--space-4` (4px) · `--space-8` · `--space-12` · `--space-16` · `--space-20` · `--space-24` · `--space-32` · `--space-40` · `--space-48` · `--space-64` · `--space-80` · `--space-96` · `--space-128`

---

## Border radius

| Token | Value | CSS variable | Use |
|---|---|---|---|
| none | 0px | `--radius-none` | Sharp edges, editorial |
| sm | 2px | `--radius-sm` | Subtle rounding |
| default | 4px | `--radius-default` | Standard inputs |
| md | 6px | `--radius-md` | Cards, panels |
| lg | 8px | `--radius-lg` | Buttons, badges |
| xl | 12px | `--radius-xl` | Large cards |
| 2xl | 16px | `--radius-2xl` | Modal, sheet |
| 3xl | 24px | `--radius-3xl` | Hero elements |
| full | 9999px | `--radius-full` | Pills, avatars |

---

## Breakpoints & containers

| Mode | Breakpoint | Container | Padding |
|---|---|---|---|
| Mobile | 640px | 576px | 16px |
| Tablet | 768px | 704px | 32px |
| Desktop | 1280px | 1184px | 48px |

---

## Components (from ◘ Core page)

### Brand Logo component set
Variants: `Type` × `Glass`
- Types: `Brandmark` · `Combo` · `Stacked Wordmark` · `Horizontal Wordmark`
- Glass: `True` (20% Vanilla overlay) · `False` (solid)

### Brand Symbol component set
Variants: `Property 1` × `Glass`
- Types: `Monogram` · `Icon Filled` · `Icon Outline`
- Glass: `True` · `False`

### Imagery component set
- `Type=Reality on Film` — photographic, analog warmth
- `Type=Analog Details` — close-up texture/detail shots

---

## Assets (from ◘ Assets page)

### Text Slide layouts
`1 column large` · `1 column small` · `2 column pillars` · `2 column list` · `left small` · `right small` · `title rows` · `body copy`

### Section Cover types
`image` · `simple` · `numbered` · `numbered image`

### Table of Contents
`large` · `small`

### Social compositions
Carousel images, Instagram templates, Brand slides — all built on the Social type scale above.

---

## Rules for building with this system

1. **Always import `tokens/variables.css`** as the first stylesheet in any generated website.
2. **Never hardcode a color, size, or font** that exists as a token. Reference CSS variables only.
3. **Use semantic aliases** (`--color-bg`, `--color-text`, `--color-accent`) in component code — never raw hex.
4. **OffBit is accent-only.** H5 and H6 in Figma use OffBit — translate this to accent moments in web: stat callouts, counters, campaign numbers, section labels.
5. **The Glass variant** uses `rgba(255,250,238,0.20)` — use it for overlays on dark/brand-colored sections.
6. **Charcoal + Vanilla is the base pairing.** Orange enters as the activation color — CTAs, underlines, hover states, highlights.
7. **Type is tight at large sizes.** Display sizes use -2px letter spacing. Headlines use -0.25 to -0.5px. Never add positive letter spacing to headlines.
