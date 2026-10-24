# Design: Bros

Locked system (Hallmark `design.md` format). Portable: any tool or person building a Bros surface reads this first. Values live in `tokens.css` (source of truth) and `tokens.ts` (mirror).

## System

- **Idea:** every launch hangs its own sign on one street; the lit number on the sign is **people**, not price. `[02-direction/decision.md]`
- **Direction:** Signstack, refined. Light daytime street by default; night street for dark mode. Signs on Landing, Discover cards, token headers and share cards only. Everything else is the **shop floor**: quiet concrete panels, ink rules, compact data.
- **Korean lenses (principle level):** Seoul signage density (stacked flat plates, condensed lettering, lit counters); five-direction colour logic (each colour carries one meaning); bojagi patchwork for the window and holders quilts; Korean fintech clarity (one task per screen). No Hangul ships.
- **Genre:** playful marketing surfaces; app screens follow Hallmark's App screens rules (`--scope app`).

## Tokens

| Role | Light | Dark | Use |
|---|---|---|---|
| `paper` | concrete 94.6% | night 17% | page ground ("the street") |
| `paper-2` | 98.3% | 21.5% | panels, inputs ("the shop floor") |
| `paper-3` | 90.6% | 26.5% | recessed: hover, tracks, skeletons |
| `ink` / `ink-2` / `muted` | 19% / 34% / 46% | 95.5% / 83% / 70% | text tiers |
| `rule` / `rule-strong` | ink 14% / 85% | — | hairlines / control borders |
| `sign` + `on-sign` | yellow 86.5% / ink | same | lit plates, "you" markers, testnet strip |
| `plate` + `on-plate` | ink / yellow | 11% / yellow | sign plates, wordmark |
| `action` + `on-action` | ink / paper-2 | light / dark | primary buttons |
| `up` / `down` | Global: green / red · Korean: red / blue | lighter variants | price direction only |
| `danger` | red | red | errors (always with icon + text) |

**Five colours:** concrete (with its tints), ink, yellow, red, blue. Green exists only because Global price direction is a user-requested setting (brief).
**Price direction default:** Auto. Korean convention when `navigator.languages` includes `ko*` or the time zone is `Asia/Seoul`; otherwise Global. Users override in Settings. Colour is never alone: `+`/`−` sign, an up/down glyph, and screen-reader text ("up 18.4 percent").
**Theme default:** follows `prefers-color-scheme`; light is the reference design.

**Type:** Antonio (display, 500–700, OFL) for names, heads, sign lettering. **Antonio has no tabular figures, so it never sets numbers that change.** Archivo (400–800, width 62–100, OFL) for everything else; figures always `tabular-nums`; counters use Archivo at width 70%, weight 700. Self-hosted Latin-only WOFF2 subsets (`fonts/web/`, 17.6 KB + 54 KB), `font-display: swap` with metric-matched fallbacks. Scale: 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 px fixed for app screens (ratio ≈ 1.2), fluid `section` and `display` clamps for marketing. Body 16 px, line-height 1.5; labels 13–14 px, sentence case, never tracked caps.

**Space:** 2, 4, 8, 12, 16, 24, 40, 64, 96, 144 px. **Radius:** plate 2, control 6, sheet 10, pill 999. **Elevation:** none on the shop floor; `shadow-pop` for popovers, `shadow-sheet` for sheets and modals only.
**Density:** comfortable (controls 40, rows 44) for marketing and forms; compact (`data-density="compact"`: controls 32, rows 36) for trade, tables and dashboards. Hit targets stay 44 px via padding.
**Layout:** container 1440, gutters 16 / 24 / 64; 4-col mobile, 8-col tablet, 12-col desktop; breakpoints 640, 768, 1024, 1280, 1536; designed at 360 first.

## Controls

- One filled primary per view (ink). On the token page the primary is **Review buy / Review sell**, filled with the direction colour.
- Eight states on every control: default, hover, focus-visible (2 px focus ring, offset 2, instant), active (1 px press), disabled (40% ink, `cursor: not-allowed`, reason in a tooltip), loading (label stays, spinner replaces icon, `aria-busy`), error (danger border + message below, `aria-invalid`, `aria-describedby`), success (check icon + text, never colour only).
- Inputs: visible label above, helper below, units inside the field (SC), numeric keyboard on mobile, `Enter` submits only when not composing (IME guard).
- Full spec: `components.md`.

## Motion

Purpose only: enter/exit of sheets, toasts and tabs; a sign switching on when a window opens; the people counter stepping; the landing "level" moment; graduation. Prices, P&L, quotes, tables and the chart line never animate. Durations 120 / 200 / 420 ms, ease-out in, ease-in out (exits ~30% faster). `prefers-reduced-motion`: everything instant, 3D replaced by a poster. Full spec: `motion.md`.

## Exports

- `tokens.css` → Tailwind v4 `@theme inline` in `app/globals.css` (utilities `bg-paper`, `text-ink`, `bg-sign`, `font-display`...).
- `tokens.ts` → canvas, three.js, OG image rendering.
- `brand/*.svg` → wordmark and mark; `brand/icon-*.png` → app icons.
- Hallmark stamp is the first line of `tokens.css` and of the prototype's `globals.css`.

## Rules that are easy to break
1. No literal colours outside `tokens.css`.
2. Yellow is a **surface** (signs, you, testnet), never text on light paper.
3. Red/blue/green are **only** for price direction and errors.
4. No eyebrows, no tracked caps, no middle-dot meta strings, no em dashes in UI copy.
5. Sign plates: ink, yellow or paper only. Never red or blue plates.
