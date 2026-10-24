# Anti-slop charter (Bros / Signstack)

Applies to all work. A deliberate inversion needs a written rationale in the stamp or in this file.

## Banned (from the brief, made specific)

| Default | Bros rule |
|---|---|
| purple→blue/pink gradients, gradient text, glow orbs, aurora | no gradients at all; signs are flat plates |
| glassmorphism card grids | no blur surfaces; panels are opaque concrete tints |
| hero formula (pill + headline + two buttons + floating screenshot) | hero = headline + one sentence + one primary action + a text link, beside the 3D level diagram; no pill, no screenshot |
| 3 identical icon cards | the "how it works" section is a vertical sign sequence with real numbers from the masterplan |
| Inter/Roboto/Poppins/Space Grotesk | Antonio + Archivo, both OFL, both cleared by `theme.mjs check` |
| neon cyberpunk dark mode | light default; night mode has flat plates, no glow |
| coins, rockets, moons, diamond hands, lambos | none; the only 3D object is the window diagram |
| emoji as icons | Lucide icons (ISC) at 16/20/24, plus custom glyphs for up/down |
| unmodified stock icon sets | Lucide is restyled: 1.75 stroke, square caps, ink colour; custom glyphs for people, window, sign |
| uniform radii and shadows | radii: 2 px plates, 6 px controls, 10 px sheets; no drop shadows on the shop floor |
| fake stats, testimonials, partner walls | none; landing numbers are *rules* from the masterplan (120 s, 25 people, 1%), never usage metrics |
| random AI faces | identicons from addresses |
| lorem ipsum, "Acme" | masterplan copy or `[PLACEHOLDER: needs masterplan decision]` |
| scroll-jacking, autoplay sound, parallax | none |
| everything centred | left-aligned heads; centred only for the testnet strip |

## Bros-specific additions
1. **Colour has a job.** Yellow = signs and "you". Red/blue (or green/red in Global mode) = price direction only. Ink = actions.
2. **The lit number is people.** Sign counters show people (or the window clock), never price or volume.
3. **Prices never animate.** No rolling digits, no flashing cells; a changed value swaps in place.
4. **No urgency theatre.** The only countdown is the real window and the real fallback timer.
5. **Hallmark floor holds in app screens:** no eyebrows, no tracked caps on table heads, no middle-dot meta, sentence-case labels.

## Required tests (recorded in `09-qa/anti-slop-tests.md`)
- **Swap test:** put another launchpad's logo on our landing and token page. Pass = it looks wrong.
- **Thumbnail lineup:** 5 Bros screens vs 5 competitor screens at 240 px wide. Pass = ours are picked out instantly.
- **Grayscale:** hierarchy holds without colour.
- **Squint:** the primary action survives a 6 px blur.
