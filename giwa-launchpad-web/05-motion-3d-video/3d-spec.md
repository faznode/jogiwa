# Signature 3D moment: "Level"

## Concept (derived from the core mechanic, not a crypto trope)
The opening window clears every deposit at **one price** `[F02]`. "Level" shows exactly that: a block of columns, one per deposit, rises to different heights while an example window counts down; when it closes, **every column settles to the same height**. One yellow column is "you". The skyline of uneven columns echoes the street of signs; the flat plane is fairness. No coins, rockets, moons or glass.

| Where | What happens | Trigger |
|---|---|---|
| Landing hero (right half) | deposits rise over ~6 s, window closes, columns level, a plate reads "Same price for everyone" | in viewport, after idle |
| Graduation celebration (token page overlay, once per user per token) | the levelled block lifts as one and locks into a frame: the permanent pool `[F08]` | graduation event |
| **Never** | trade panels, tables, Discover, mobile low-tier | — |

**Interaction:** pointer position tilts the camera up to ±6°; keyboard and touch get no 3D interaction (nothing is lost). No scroll-jacking. The text equivalent sits beside the canvas: "Each column is one deposit. When the window closes, all of them clear at the same price." Canvas is `aria-hidden`.

## Assets
Procedural only: one `BoxGeometry` drawn as an `InstancedMesh` (64 instances) plus a ground plane. No textures, no models, so no KTX2/Draco/meshopt needed **today**; if a textured or modelled version is ever added, textures ship as KTX2 (UASTC for UI, ETC1S for large surfaces) and geometry as meshopt-compressed GLB.

## Performance spec

| Budget | Value | How |
|---|---|---|
| Triangles | ≤ 5,000 (actual ~800) | 64 boxes × 12 tris + plane |
| Draw calls | ≤ 5 (actual 2) | instancing |
| Device pixel ratio | cap 1.5; 1.0 on mid tier | `dpr={[1, 1.5]}` |
| Frame loop | `frameloop="demand"`; invalidate only while the timeline runs | no idle GPU |
| Offscreen | pause when out of viewport (IntersectionObserver) or tab hidden (`visibilitychange`) | — |
| Bundle | separate lazy chunk (`three` + `@react-three/fiber`, no drei), never in the app shell | `next/dynamic(..., { ssr: false })` after `requestIdleCallback` |
| Memory | dispose geometry/material on unmount | — |
| Target | 60 fps on mid-tier, ≥ 30 fps on low-tier profile, else fallback | measured in `09-qa/performance.md` |

## Device tiers and fallback
1. `prefers-reduced-motion: reduce` → static poster (`renders/hero-loop-poster.png` style still, rendered in the page as the final levelled state).
2. Save-Data on, no WebGL2, `deviceMemory ≤ 2`, or `hardwareConcurrency ≤ 2` → poster.
3. Mid tier (`deviceMemory ≤ 4`) → pre-rendered HyperFrames loop (`hero-loop.mp4`, muted, `playsinline`, plays only in viewport) instead of WebGL.
4. Capable → WebGL "Level".
The poster is always in the HTML first (LCP-safe); 3D replaces it after load, so failure leaves a finished page.
