# UI animation spec

Principles and tokens live in `03-design-system/motion.md`. This file lists each transition with its purpose. Implementation: CSS transitions/keyframes (no runtime animation library), `transform`/`opacity` only.

| Transition | Spec | Purpose |
|---|---|---|
| Sheet / modal enter | translateY(16px→0) + opacity, 420 ms ease-out | origin and focus shift |
| Sheet / modal exit | reverse, 280 ms ease-in | get out of the way faster |
| Tab underline | translateX + scaleX, 200 ms | where you are |
| Toast in / out | translateY(100%→0) + opacity 200 ms / 160 ms | transaction feedback |
| Tx status swap | icon + text replace in place, no motion | state change, not decoration |
| Sign switch-on (window opens) | background ink→yellow, `steps(2)` over 240 ms, once | the only "lit" moment |
| People counter step | digit translateY ±100%, 120 ms | someone joined |
| Two-track meter | `scaleX`, 200 ms ease-out | progress changed |
| New trade row | 1 s background tint fade (normal motion only); row is inserted, never slid | new data arrived |
| Button press | translateY(1px), 120 ms | tactile confirmation |
| Chip select | background swap 120 ms | selection |
| Landing reveal | one staggered fade-up of the hero text (60 ms steps, 420 ms), visible by default without JS | first impression, once |

## Must NOT animate
Price tickers, price change, P&L, balances, quote rows, slippage, pre-sign summary, table rows, chart lines (no draw-on), countdown digits (swap only), holders quilt reflow (instant), any number on the token page except the people counter.

## Stress behaviour
At 50+ events/s the trade feed and counters coalesce into one commit per animation frame; the 1 s new-row tint is skipped when more than 10 rows arrive in one frame (it would read as flicker).
