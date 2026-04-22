# Andrew's Training Plan — Design System

## Product Overview

**Andrew's Training Plan** is a personal web app for displaying and navigating a multi-week structured running training plan. The product is data-forward and athlete-facing — it exists to help Andrew (and potentially other runners) stay on track day-by-day through a training cycle.

### Three Core Views
1. **Today's Workout** — The single most important screen. Surfaces today's run: type, distance, pace targets, and any notes. Motivational and focused.
2. **Weekly View** — A calendar-style breakdown of the current week, showing all 7 days, run types per day, and weekly mileage totals.
3. **Full Training Plan + Progress** — The complete plan laid out week by week, with the user's current position clearly marked and completed weeks shown as done.

### Source Materials
- `uploads/IMG_1690.jpeg` — An uploaded photo of a WMATA Metro recruitment poster ("keep the community moving"). This appears to have been attached by accident and is not used as brand reference.
- No codebase, Figma file, or other design assets were provided.

This design system was built from scratch, informed by athletic/running product conventions and a desire for a clean, motivating personal tool.

---

## Content Fundamentals

**Voice & Tone**
- First-person singular ("Your run today", "Your weekly total", "You're on track")
- Direct and motivating — no fluff, no corporate speak
- Conversational but precise: "Easy 6 miles at 9:30/mi" not "Complete a 6-mile aerobic base run at a conversational pace of approximately 9:30 per mile"
- Short sentences. Data speaks for itself.
- Week labels like "Week 3 of 18 · Building" — structure + context together
- Run types are always capitalized as proper nouns: Easy, Tempo, Long Run, Recovery, Rest

**Casing**
- Sentence case for UI labels and headings ("Today's workout", "This week")
- ALL CAPS for run type badges: EASY, TEMPO, LONG, RACE, REST
- Title case for named workouts: "Progression Run", "Track Tuesday"

**Numbers & Data**
- Distances in miles (e.g. "8 mi"), paces as mm:ss/mi (e.g. "8:30/mi")
- Completion shown as percentages and filled bars, not raw fractions
- Week numbers always written as digits, never spelled out

**No emoji.** Data and typography carry the weight.

---

## Visual Foundations

### Color Vibe
Warm, grounded, energetic. Near-black backgrounds for the app shell; warm off-white surfaces for cards and content. A single bold **orange** accent that carries all primary actions and highlights. Secondary semantic colors for run types (blue for easy, amber for tempo, red for hard, green for completed).

### Colors
- **Brand Orange** `#E8471A` — primary CTA, progress fill, active state
- **Near-black** `#111110` — app background, primary text
- **Warm off-white** `#F6F4F0` — card backgrounds, page surfaces
- **Mid-gray** `#8A8680` — secondary text, muted labels
- **Border** `#E2DED8` — card edges, dividers
- **Easy Blue** `#3B7DD8` — easy/recovery run badge
- **Tempo Amber** `#D97B2A` — tempo/workout badge
- **Long Purple** `#7B5EA7` — long run badge
- **Hard Red** `#C93B3B` — race/hard effort badge
- **Complete Green** `#2A9D5C` — completed workout, progress

### Typography
- **Display: Barlow Condensed** — Bold, condensed, athletic. Used for big numbers, distances, week headers, motivational copy. Heavy weight (700–900).
- **Body: Barlow** — Clean, readable, versatile. Labels, descriptions, nav items. Regular (400) and Medium (600).
- **Mono: DM Mono** — Paces, timestamps, data values. Tabular figures. Used wherever numeric precision matters.

Google Fonts substitution (no proprietary font files provided). See `fonts/` for any locally cached files.

### Spacing System
Base unit: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Backgrounds
Flat colors only — no gradients, no textures, no illustrations. The data IS the visual. Photography not used in the app UI.

### Cards
Cards use `border-radius: 12px`, `1px solid var(--border)`, and a subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.06)`. No heavy drop shadows. Content padding: 20–24px.

### Animation
Minimal. Progress bars animate in on load (300ms ease-out). No page transitions. Hover states use `opacity: 0.8` on interactive elements and a 100ms transition.

### Hover / Press States
- Buttons: slightly darker background on hover, slight scale-down (0.97) on press
- Cards: subtle border color change on hover
- Links: opacity 0.7

### Corner Radii
- Cards, modals: 12px
- Badges/chips: 4px (rectangular, tight)
- Buttons: 8px
- Progress bars: 9999px (pill)

### Borders & Shadows
- Borders: 1px, `var(--border)` color
- Card shadow: `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- No inner shadows. No elevation layers.

### Iconography
See ICONOGRAPHY section below.

### Layout Rules
- Max content width: 800px (single-column, centered)
- Mobile-first, designed for 390px wide (iPhone 14 Pro)
- Sticky header for current week/day context

---

## Iconography

No icon font or SVG sprite provided. The design system uses **Lucide Icons** from CDN (`https://unpkg.com/lucide@latest`) for all UI icons. Lucide is a clean, consistent stroke-based (1.5px stroke, 24×24) open-source icon set.

Key icons used:
- `calendar` — weekly view nav
- `zap` — today's workout
- `list` — full plan view
- `check-circle` — completed workout
- `clock` — pace/time
- `map-pin` — distance
- `trending-up` — progress
- `chevron-left`, `chevron-right` — week navigation
- `flame` — streak / intensity indicator

**No custom SVGs drawn.** No emoji. No PNG icons.

---

## File Index

```
README.md                       ← This file
SKILL.md                        ← Agent skill definition
colors_and_type.css             ← CSS custom properties (colors + type)
assets/                         ← Logos and visual assets
  logo.svg                      ← Andrew's Training Plan wordmark
preview/                        ← Design System tab cards
  colors-brand.html
  colors-semantic.html
  type-scale.html
  type-specimens.html
  spacing-tokens.html
  components-badges.html
  components-buttons.html
  components-workout-card.html
  components-week-row.html
  components-progress-bar.html
ui_kits/
  web/
    README.md
    index.html                  ← Full interactive prototype
    WorkoutCard.jsx
    WeekView.jsx
    FullPlan.jsx
    Nav.jsx
    Shared.jsx
```
