# Scorecard

Scores 1–5, judged by eye from the proofs (`screens/*-fold.png`, `*-full.png`) plus sloplint evidence. Weighted score = Σ weight × score / 5.

| Criterion | Weight | C1 Block Grammar | C2 Signstack | C3 Bojagi |
|---|---|---|---|---|
| Distinctiveness (thumbnail lineup test) | 20 | 3: clean but category-generic at thumbnail size | **5**: unmistakable at 160 px wide | 4: the quilt is novel; serif reads "culture site" |
| Fit with Bros personality (Upfront, Together, Playful) | 15 | 3: upfront yes, playful low | **5**: playful, "lit number is people" is upfront | 3: together yes, playful low |
| Modern-Korean feel (principle-based) | 15 | 3: Hangul logic is invisible to most | 4: signage density, flat panels, no Hangul needed | **5**: patchwork and natural dyes, abstracted |
| Usability for dense data | 15 | **5** | 3: signs cost space; fine when confined to headers | 3: seams compete with rules |
| Performance cost | 10 | 5 | 5 | 5 |
| Accessibility | 10 | **5** | 3: coloured panels, small light text | 4: accent contrast 4.11:1 (sloplint WARN 41) |
| Feasibility | 5 | 5 | 4 | 4: treemap packing |
| Brand safety | 10 | **5** | 3: multi-primary panels + caps BROS edge toward an arcade-game palette; street kitsch risk | 4: heritage motif can tip into tradition kitsch |
| **Weighted total** | **100** | **80** | **82** | **79** |

## Evidence

| | C1 | C2 | C3 |
|---|---|---|---|
| sloplint static | 0 FAIL, 1 REFLEX, 3 WARN | 0 FAIL, 2 REFLEX, 5 WARN | 4 FAIL (raw 2 px gaps), 2 REFLEX, 4 WARN |
| Swap test (another launchpad's logo) | partly fits: **fail risk** | does not fit: pass | does not fit: pass |
| Grayscale | pass | pass (sign tones hold) | pass |
| Squint | pass | pass (CTA + facade) | pass |

## Reading the result

C2 wins on the scorecard by two points, carried by distinctiveness and personality. Its losses (colour semantics, accessibility, brand safety) are **fixable by subtraction**: take red and blue off the signs, keep signs to ink/yellow/paper plates, confine signs to headers and cards, and run the shop floor on C1's quiet modular grid. C3's window quilt is the best *data* idea of the three and is borrowed for the window and holders views. Decision in `decision.md`.
