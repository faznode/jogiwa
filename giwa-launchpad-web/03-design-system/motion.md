# Motion principles

Motion is state, never decoration. CSS transitions and keyframes; `transform` and `opacity` only (Hallmark floor 2); no GSAP at runtime.

| Token | Value | Used for |
|---|---|---|
| `--dur-micro` | 120 ms | hover, press, chip toggles, counter step |
| `--dur-short` | 200 ms | tabs, tooltips, popovers, sheet exit, toast |
| `--dur-long` | 420 ms | sheet/modal enter, sign switch-on, graduation card |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | everything entering |
| `--ease-in` | cubic-bezier(0.7, 0, 0.84, 0) | everything leaving (exits ~30% shorter) |

## What moves, and why

| Element | Motion | Purpose |
|---|---|---|
| Bottom sheet / modal | translateY 16 px → 0 + fade, 420 ms in / 280 ms out | where it came from, where it goes |
| Toast (tx pending → confirmed) | slide from bottom edge + fade; status swaps text and icon in place | the transaction is alive |
| Sign switch-on (window opens) | plate steps from ink to yellow with a 2-frame flicker (`steps(2)`), once | a launch just went live; the only "lit" moment |
| People counter | old digits translateY −100% / new from +100%, 120 ms | someone joined; it is a count, not a price |
| Progress bars | `transform: scaleX()` from the left, 200 ms | graduation progress changed |
| Tabs | underline moves with `transform` | spatial continuity |
| Landing 3D "level" | blocks settle to one height when the demo window closes | the core mechanic, shown once |
| Graduation | the token's plate drops a "Graduated" strip; one 420 ms move; optional 3D overlay | celebration, once per user per token |

## What must NOT animate
Prices, price change, P&L, balances, quote rows, slippage numbers, table rows, trade feed rows (new rows are inserted without slide-in; a 1-frame background tint marks "new" and fades in 1 s under normal motion only), the chart line (no draw-on), the countdown (digits swap, no roll), anything on the pre-sign summary.

## Reduced motion
`prefers-reduced-motion: reduce` → all durations 0.01 ms; sign switch-on becomes an instant colour change; counters swap; the 3D scene is replaced by its poster image; the graduation overlay becomes a static card. Content is never hidden behind motion: everything is visible with scripting off.

## Performance rules
- Animate only composited properties; no layout-triggering transitions; never `transition: all`.
- Rapid stream updates (50+ events/s) batch into one paint per animation frame; counters coalesce to the latest value.
