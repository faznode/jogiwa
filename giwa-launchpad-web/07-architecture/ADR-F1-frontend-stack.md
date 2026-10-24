# ADR-F1: Front-end stack

**Status:** accepted (2026-10-24). The prototype in `08-prototype/` is built on it.
**Deciders:** front-end/perf architect (this run). **Supersedes:** masterplan `[05 §2]` framework choice (Q20).

## Context
- The front-end runs in the user's browser. The framework affects client performance (bytes, main-thread time, input latency), not server capacity. `[brief Phase 7]`
- The token page lives under a live trade stream. The brief's stress target is 50+ events/s. Users are mobile-first on mid-range Android over 4G. `[01-brief personas]`
- Security wants a strict CSP, SRI and zero third-party scripts on a static CDN (S1).
- The ecosystem needs wallet hooks (wagmi + viem `[05 §2]`), one lazy 3D moment (`05-motion-3d-video/3d-spec.md`) and an embedded-wallet SDK. All three are React-first.

## The bake-off (evidence)
`bakeoff/`: one token-page slice (price, people counter, 60-row trades table, amount input with a live quote), built three ways from comparable source:

| Arm | How | JS gzip |
|---|---|---|
| React 19.2.0 | `react-dom/client` | 60.2 KB |
| Preact 10.27.2 | **same source** via `preact/compat` aliases | 8.5 KB |
| Solid 1.9.9 | port of the same component, `vite-plugin-solid` | 4.8 KB |

**Method.** Vite 7.1.12 production builds; headless Chrome 156; 4× CPU throttle; 412×915 viewport. One shared synthetic trade stream at 50, 200 and 500 events/s, flushed **at most once per animation frame**. For 5.4 s per run, 12 keystrokes are typed into the amount field. Measured: main-thread busy %, script %, long tasks, frame-interval p95 and input event duration (Event Timing API). `[DECISION: SvelteKit not measured; Solid stands in for the compile-time, fine-grained class. The decision below does not depend on beating React's numbers.]`

| Framework | Rate | Script % | Long tasks | Frame p95 | Input p95 / max |
|---|---|---|---|---|---|
| React | 50 / 200 / 500 | 20.1 / 21.8 / 23.7 | 0 / 0 / 0 | 16.8 ms | 32 / 40 ms |
| Preact | 50 / 200 / 500 | 2.8 / 4.1 / 7.5 | 0 / 0 / 0 | 16.8 ms | 32 / 40 ms |
| Solid | 50 / 200 / 500 | 8.1 / 10.5 / 15.3 | 0 / 0 / 0 | 16.7 ms | 32 / 40 ms |

Full table: `bakeoff/results.md`. Busy % sits near 100 for every arm because software compositing under a 4× throttle dominates in headless Chrome. **Script % is the framework-sensitive number.**

**Reading.** With per-frame batching, all three hold 60 fps with zero long tasks and input under 40 ms at **10× the brief's stress rate**. INP budget is 200 ms. React costs about 52 KB more and roughly three times the script time of Preact. Neither cost breaks a budget. The batching discipline matters more than the framework.

## Decision
**React 19 + Vite 7 + TypeScript (strict)**, as a static SPA on a CDN, with build-time prerendering of marketing routes.

| Concern | Choice | Note |
|---|---|---|
| Router | `wouter` 3 (MIT, ~2 KB) behind `lib/router.ts` | swap to React Router library mode is a one-file change |
| Snapshot data | SWR over the `DataSource` interface | dedupe, revalidate on focus, stale-while-revalidate |
| Live data | external store + `useSyncExternalStore`; stream deltas applied **once per frame** | the bake-off rule, now binding |
| Styling | plain CSS on `tokens.css` custom properties; no runtime CSS-in-JS, no utility runtime | zero inline `<style>`, CSP-clean |
| Prerender | `react-dom/server` renders marketing routes to static HTML at build time; app routes get the SPA shell | no inline scripts, so `script-src 'self'` holds |
| 3D | `three` + `@react-three/fiber` in a lazy chunk, landing only | never in the shell, never on `/t/*` |
| Wallet (production) | wagmi + viem, lazy chunk loaded on wallet intent or when a session exists | prototype: `MockWallet` behind `WalletPort` |
| i18n | `strings/en.json` keyed `area.item`, typed `t()` | KO/ID later without code changes `[F18, F32]` |

### Rendering rules (from the bake-off)
1. A stream event never calls `setState`. Deltas buffer, flush once per animation frame into the store, and components subscribe to narrow selectors.
2. Long lists are virtualised (fixed row height) and retain at most 500 rows; older rows page in on demand.
3. Prices and numbers swap in place and never animate (anti-slop charter).
4. Local quotes are pure and synchronous; chain quotes are debounced 150 ms `[06 §2.2]`.
5. The chart redraws at most 4 times a second. Hidden tabs stop rendering and resync from a snapshot on return.

## Alternatives
| Option | Why not |
|---|---|
| **Next.js 16 App Router** (masterplan) | Static export inlines RSC flight data as inline `<script>`, so strict `script-src 'self'` needs per-page hashes. Nonces need dynamic rendering, which breaks the static-CDN model. It also adds roughly 40–50 KB of framework runtime over plain React. ISR/RSC benefits are covered by prerendered marketing pages plus API snapshots. |
| **Preact + compat** | Measured best on script time. But `@react-three/fiber` needs `react-reconciler`, which compat does not support, and wagmi/embedded-wallet SDKs are tested on React only. Kept as the fallback (revisit trigger below). |
| **Solid / SvelteKit** | Excellent numbers. No first-party wagmi bindings, younger three.js bindings, smaller hiring pool. The win is not needed to meet budgets. |
| **React Router v7 framework mode** | Prerender + SPA mode out of the box, but it injects inline context scripts, the same CSP problem as Next. |

## Budgets (CI-enforced, RUM-verified)
Target device: Lighthouse mobile preset (mid-range Android emulation, 4× CPU, slow 4G).

| Metric | Budget | Where enforced |
|---|---|---|
| LCP | ≤ 2.5 s | Lighthouse CI on `/`, `/discover`, `/t/:token`; RUM p75 |
| INP | ≤ 200 ms (lab proxy: TBT ≤ 200 ms) | RUM p75 per route; CI TBT |
| CLS | ≤ 0.1 | Lighthouse CI; RUM p75 |
| App-shell JS (entry + shared chunks) | ≤ 150 KB gzip (brief hypothesis 200 KB, tightened after measuring the prototype; see `09-qa/performance.md`) | bundle check on the Vite manifest |
| Any route chunk | ≤ 60 KB gzip | bundle check |
| 3D chunk | lazy, ≤ 260 KB gzip, landing only | bundle check + route test |
| Wallet chunk (production) | lazy, on intent | bundle check |
| Fonts | ≤ 80 KB WOFF2 total (actual 71.6 KB) | asset check |
| CSS | ≤ 30 KB gzip | asset check |

## Consequences and risks
- **We own ~100 lines of prerender code.** A CI check fails the build if a marketing route is missing from the prerender list.
- **Hydration mismatches** on prerendered pages: a CI check boots each prerendered page and fails on hydration warnings.
- **wouter is small and has a small community.** Mitigated by the adapter file.
- **React's main-thread cost on low-end devices.** Revisit trigger: if RUM p75 INP on `/t/*` goes above 200 ms on the low device class for 7 days, or the shell exceeds 150 KB, then (1) move hot widgets to signal-style stores, then (2) trial `preact/compat` on non-3D routes.
