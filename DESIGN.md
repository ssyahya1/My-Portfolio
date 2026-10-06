---
name: Impeccable
description: Neo kinpaku system. Two brand anchors, kinpaku gold and verdigris patina, sit on dark warm-black lacquer. Restraint in chrome, brilliance in texture.

colors:
  kinpaku-gold: "oklch(84% 0.19 80.46)"
  verdigris-patina: "oklch(70% 0.12 188)"
  dark-ink: "oklch(14% 0.018 95)"
  lacquer-black: "oklch(7% 0.006 95)"
  lacquer-deep: "oklch(4% 0.004 95)"
  raised-lacquer: "oklch(11% 0.006 95)"
  graphite: "oklch(15% 0.008 95)"
  graphite-2: "oklch(19% 0.008 95)"
  champagne: "oklch(91% 0 0)"
  text-warm: "oklch(88% 0 0)"
  text-muted: "oklch(72% 0 0)"
  text-faint: "oklch(62% 0 0)"
  gold-hairline: "oklch(78% 0 0 / 0.16)"
  gold-hairline-strong: "oklch(84% 0.19 80.46 / 0.45)"
  patina-hairline: "oklch(70% 0.12 188 / 0.4)"

typography:
  display:
    fontFamily: "'Alumni Sans', sans-serif"
    fontSize: "clamp(3.2rem, 6.2vw, 5.2rem)"
    fontWeight: 100
    lineHeight: 1.02
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Alumni Sans', sans-serif"
    fontSize: "clamp(2.4rem, 4vw, 3.2rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "'Albert Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  mono:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.85rem"
    fontWeight: 500

rounded:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
---

# Design System: Impeccable (Neo-Kinpaku)

## Overview

The portfolio is built on Impeccable's neo-kinpaku system. Two brand anchors — kinpaku gold (`oklch(84% 0.19 80.46)`) and verdigris patina (`oklch(70% 0.12 188)`) — anchor a dark, warm-mineral lacquer ground. The interface avoids generic AI-generated templates (no purple gradient fades, no side-tab borders, no bounce easing, no decorative blur halos, no kickoff eyebrows). Instead, depth comes from hairline precision, high typographic contrast, and intentional composition.

## Colors

- **Kinpaku Gold (`oklch(84% 0.19 80.46)`)**: Primary brand accent, primary CTA fill, active link highlight.
- **Verdigris Patina (`oklch(70% 0.12 188)`)**: Secondary accent, live indicators, data science & ML categorization, focus rings.
- **Dark Ink (`oklch(14% 0.018 95)`)**: Foreground text on gold buttons and high-contrast chips.
- **Lacquer Black (`oklch(7% 0.006 95)`)**: Page background. Warm mineral black.
- **Lacquer Deep (`oklch(4% 0.004 95)`)**: Insets, code snippets, modal backdrops.
- **Raised Lacquer (`oklch(11% 0.006 95)`)**: Cards, panels, navigation container.
- **Graphite (`oklch(15% 0.008 95)`)**: Sub-cards, input fills, inactive badge containers.
- **Text Scale**: Champagne near-white (`oklch(91% 0 0)`) for titles; Warm text (`oklch(88% 0 0)`) for body; Muted text (`oklch(72% 0 0)`) for metadata and secondary labels.

## Typography

- **Weight-Inversion Rule**: The hero `h1` uses Alumni Sans at ultra-light weight `100` (`clamp(3.2rem, 6.2vw, 5.2rem)`) to allow the page to breathe with understated elegance. Section `h2` headings use Alumni Sans at weight `300` (`clamp(2.4rem, 4vw, 3.2rem)`) to ground each section firmly.
- **Two-Face Rule**: Alumni Sans is strictly for large display and section headlines. Any size below `1.2rem` uses Albert Sans.
- **Body Measure & Air**: Albert Sans at `1rem` with line-height `1.75` to `1.8` and maximum line length between `65ch` and `75ch` on dark surfaces.
- **Technical Monospace**: JetBrains Mono is used strictly for technical data: GitHub paths, endpoints, status codes, commit hashes, and stack tags. Never used as a costume for generic headings.

## Layout

- Clean container max-width: `1140px` (narrow reading measure `880px`).
- Generous section padding (`clamp(3.5rem, 7vw, 6rem)`).
- Vertical rhythm: more whitespace above headings than below them.
- No identical repetitive 3-card icon grids; varied asymmetric structures that reflect the actual data and code.

## Elevation & Depth

- Hairline-first rule: 1px subtle borders (`oklch(78% 0 0 / 0.16)`) create structure before any shadow is added.
- No multi-directional fuzzy colored glows or glassmorphism.
- Large floating panels use a controlled setback: `0 20px 48px rgba(0, 0, 0, 0.6)`.

## Shapes

- Restrained corner radiuses: `4px` to `8px` for buttons, inputs, and chips; `12px` to `14px` for cards.
- Pills (`999px`) reserved for small status badges and live tags.
- Crisp hairline borders on all cards without side-tab accents.

## Components

- **Buttons**:
  - Primary: Kinpaku gold fill, dark ink text, 1px border, 4px radius, min-height 48px, high tactile feedback.
  - Secondary / Outline: Transparent lacquer, 1px gold hairline border, gold text.
  - Focus state: Verdigris patina outline with 3px offset.
- **Cards**:
  - Clean raised lacquer background, 1px subtle hairline, single clear elevation.
  - No side-tabs or thick borders on one side.
- **Navigation**:
  - Sticky frosted header on lacquer black with subtle gold hairline bottom border.
  - Active section indicated with kinpaku gold pill or marker.
- **Live Status**:
  - Verdigris patina pulse indicator for availability.

## Do's and Don'ts

### Do
- Do use kinpaku gold and verdigris patina as intentional accents.
- Do keep body text airy (1.75 line-height) and readable ($\ge$ 4.5:1 contrast).
- Do let section headings carry their own weight without repetitive eyebrow kickers.
- Do write honest, human copy that reflects real code and verifiable GitHub repositories.

### Don't
- Do not use side-tab borders (`border-left: 3px solid ...`).
- Do not use generic purple or neon gradients.
- Do not use generic AI buzzwords or filler manifestos.
- Do not add fake glowing halos or glassmorphic blur panels.
- Do not plaster eyebrow tags above every single heading.

