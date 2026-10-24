# Graphic language

## Icons
- **Base:** Lucide (ISC licence), heavily restyled: stroke 1.75, `absoluteStrokeWidth`, square line caps and mitred joins, ink colour, 16 / 20 / 24 px only. Icons sit inline with text, never in rounded tiles above headings (Hallmark gate 3).
- **Custom glyphs** (drawn on the 24 px grid, same stroke): `up` and `down` (solid triangles, so direction survives grayscale), `people` (two offset circles over two arcs, deliberately genderless), `window` (a square with a single clock hand), `plate` (a sign plate), `lock` variant for vesting.
- Every icon-only button has an `aria-label`; decorative icons are `aria-hidden`.

## Pattern and illustration
- **No drawn illustrations** (Hallmark gate 80) and no decorative patterns. Personality comes from signs, type and real data.
- **Quilts** (from the Bojagi concept) are data, not decoration: the window quilt (deposits sized by amount) and the holders quilt (holders sized by share). Patch fill: ink at 4 strengths; "you" in yellow with an ink outline; team wallets hatched. Seams are 2 px of `paper`.

## Data visualisation
- **Price chart:** single ink line, 2 px, no area fill, no glow; the opening window segment is shaded `sign` at 25% and labelled "Window: one price" (every Bros chart starts flat, because everyone in the window paid the same). Crosshair + tooltip on hover/focus; keyboard: arrow keys step points. No candles at v1 (masterplan: no heavy charts on first paint `[06 §8]`).
- **Two-track meter** (replaces the masterplan's ring): two bars, credit (ink) and people (yellow with ink outline), each with its own numeric label. Screen-reader text: "Credit 82 percent. People 19 of 25."
- **Fee split bar:** three segments 40/30/30 with labels outside the bar (creator, holders, protocol).
- **Leaderboard:** ordinal numerals are allowed here because the list is a real ranking.
- Axis labels 12–13 px muted; gridlines `rule`; never colour-only series.

## The token card (signature)
The unit users see most. A **sign plate** on top, the **shop floor** below.

```
┌────────────────────────────────────────────┐
│ [img] RAIN FROG                ┌────────┐  │  plate: ink + yellow name (Open/Full)
│       RAIN                     │ 19/25  │  │         yellow + ink name (Window, the only lit sign)
│                                │ people │  │         paper + ink border (Graduated)
├────────────────────────────────┴────────┴──┤
│ by 0x7a3f…f21   Score B           Open     │  shop floor: creator, score band, state
│ credit ████████░░  people ██████░░         │  two-track mini meter
│ 84% still holding        2h                │  masterplan card facts (no volume)
└────────────────────────────────────────────┘
```

- **Plate by state:** Window = yellow (lit) with countdown in the counter; Open = ink; Full = ink + "Full" in the counter label; Graduated = paper with ink border, counter shows holders.
- **Long names:** Antonio caps, steps down 2 sizes, then truncates with an ellipsis; full name in `title` and the accessible name. Emoji and odd characters render as text (never as images), clipped to one line.
- **Moderation blur:** flagged image is blurred 16 px with a "Hidden while under review" label and a "Show anyway" toggle; the name is replaced by the ticker; feeds hide taken-down tokens entirely `[10 §1]`.
- **Zero holders / huge numbers:** counters show `0/25`; large token amounts use K/M/B with one decimal; prices use significant-digit formatting without scientific notation (`0.0000488`).

## Empty, error, loading
- **Empty:** an unlit plate (paper, dashed rule border) with one sentence and one action: "No launches in Graduating soon yet. See what's open."
- **Error:** a plate with the plain problem and the fix: "We can't reach the indexer. Trading still works from the chain." Retry button.
- **Loading:** skeletons in the shape of what is coming (plates, bars, rows) in `paper-3`, no shimmer under reduced motion.
- **Stale data:** a slim ink strip under the header: "Lists are 2 min behind. Trading uses live chain data." `[F23, AC-O3]`
