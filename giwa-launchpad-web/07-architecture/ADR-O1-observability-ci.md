# ADR-O1: Observability and CI

**Status:** proposed.

## Signals
| Signal | Decision |
|---|---|
| **Logs** | Structured JSON (`tracing` in Rust) with `requestId`, `route`, `chainHead`, `indexerHead`, `latencyMs`, `status` `[05 §10]`; no PII; 14 days hot, 90 days cold. |
| **Metrics** | RED per endpoint; gateway gauges (sockets, queue depth, dropped frames, resyncs per minute); indexer lag; per-provider RPC health; keeper success and third-party share `[07 §2 Ops]`. |
| **Traces** | OpenTelemetry across API, RPC gateway, gateway and indexer; one trace per user request. |
| **SLOs** | API availability 99.9%; block-to-UI p95 ≤ 1 s `[05 §5]`; indexer lag p95 < 3 s; app error rate < 0.5% `[07 §2]`. Burn-rate alerts at 2% and 5% of the monthly budget. |
| **RUM** | First-party `web-vitals` (attribution build) via `sendBeacon` to `/api/rum`, 10% sample. Dimensions: route template, device class (from `deviceMemory`/`hardwareConcurrency` buckets), effective connection type, build ID. Dashboards: p75 LCP/INP/CLS per route. Alert: p75 INP > 200 ms on `/t/*` for two days, which is also the ADR-F1 revisit trigger. |
| **Errors** | Bundled error SDK (no CDN loader) tunnelled through `/api/telemetry`. `beforeSend` scrubs addresses and query strings. Private source-map upload (never served). Release = git SHA. |
| **Status page** | Reads the same three health indicators the app shows (chain, indexer, app) `[F23, 05 §11]`, so the page and the banners can never disagree. |

## CI pipeline (GitHub Actions, every PR)
1. Install: frozen lockfile, release-age gate, install-script allow-list (S1 §4).
2. `tsc -b`, ESLint (`jsx-a11y`, `react/no-danger`, hooks rules), Stylelint (no literal colours outside `tokens.css`).
3. Unit tests (Vitest): number formatting, curve math against `facts.json` identities (12.25× price at graduation, 71.43% sold), i18n key coverage, `sanitizeDisplayText`.
4. Build + prerender, then **bundle budgets** from the Vite manifest (ADR-F1 table). A failure blocks merge.
5. **Lighthouse CI** (`lhci autorun`, mobile preset, 3 runs, median) on `/`, `/discover`, `/t/<fixture>`, `/create`: `largest-contentful-paint ≤ 2500`, `cumulative-layout-shift ≤ 0.1`, `total-blocking-time ≤ 200`, `categories:accessibility ≥ 0.95`, `categories:best-practices ≥ 0.95`.
6. **Playwright** against the production build served with production headers: axe on every route (zero serious/critical); keyboard flows (connect, buy, create); zero console CSP violations; zero hydration warnings; hostile-UGC fixtures render as text.
7. **Hallmark** `sloplint --render` on prerendered pages and a rendered capture of app routes: zero FAIL outside documented inversions.
8. **Copy audit:** banned-phrase list (`06-copy/copy-system.md`), no Hangul code points (U+1100–11FF, U+3130–318F, U+AC00–D7AF) in `dist/`, no em dashes in UI strings.
9. **Provenance:** SBOM + artifact attestation. Deploy preview, smoke test, promote.

The prototype ships the scripts that CI would call (`09-qa/tools/`): budgets, a11y, CSP smoke, copy audit and screenshots.
