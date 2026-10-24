# Progress

Resumable log. One block per phase: 10-line summary, decisions, open questions.

## Step 0 + Phase 1: tools, brief, IA, matrix, naming (done)

1. Installed Hallmark 2.0.0, ui-ux-pro-max, HyperFrames 0.8.191 skills (`skills-lock.json`); Chrome 156 + FFmpeg 7 + puppeteer-core in `/vercel/share/bros-tools` (system libs via dnf).
2. Wrote `_design-tools-playbook.md`: tool-per-job table, workflow order, exact commands, known limits.
3. ui-ux-pro-max's design-system preset (gold/purple, Orbitron, dark) rejected on aesthetics; kept its UX rules and density dial.
4. Read the masterplan PRD, UX spec, tokenomics, legal, GTM, analytics in full or by section.
5. `01-brief/design-brief.md`: product paragraph, 5 personas, 6 JTBD, thesis → design implications.
6. `01-brief/brand-brief.md`: Upfront / Together / Playful vs Flashy / Exclusive / Pushy; voice rules; vocabulary from masterplan terms.
7. `01-brief/information-architecture.md`: 20 routes, nav, page inventory.
8. `01-brief/feature-ui-matrix.md`: F01–F32 mapped to screen, component, state, event; no orphans.
9. `01-brief/naming-due-diligence.md`: two micro-cap BROS tokens, SatoshiBro launchpad, RDAP domain signals, counsel questions.
10. `_open-questions.md` started (18 items).

**Decisions:** custom Hallmark route; landing split from feed; positioning line "People graduate tokens, not bots." `[09 §0]` is the landing headline; price colours auto by locale.
**Open:** Q1 (KO deferral), Q6 (reserved names), Q7 (memefab), Q8/Q9 (counsel on GIWA/Dojang/Upbit wording).

## Phase 2: direction (done)

1. 38 references logged (`02-direction/references.md`); 6 studied by capture + DNA (Toss, Linear, Teenage Engineering, WEBTOON, The Pudding, Upbit); 4 sites blocked headless visits.
2. Hallmark `study` verb absent in v2.0.0: manual DNA extraction instead (Q17).
3. Three concepts with hi-fi HTML proofs: Block Grammar (modern-minimal), Signstack (playful), Bojagi (editorial). Screens in `02-direction/screens/`.
4. sloplint on proofs: C1 0 FAIL, C2 0 FAIL, C3 4 FAIL.
5. Weighted scorecard: C2 82, C1 80, C3 79.
6. Decision: **Signstack, refined**: signs only ink/yellow/paper, red/blue reserved for price direction; shop floor on C1's grid; window and holders quilts from C3.
7. Anti-slop charter written with Bros-specific rules (lit number is people; prices never animate).

## Phase 3: brand + design system (done)

1. Wordmark + compact mark drawn by `brand/build-brand.py`: Antonio Bold "ros" + a custom B (one stem, two bowls, hairline gap). Six SVGs + 3 PNG icons.
2. Fonts: Antonio (display) + Archivo (UI, width 62–100, tnum); Latin-only WOFF2 subsets 17.6 KB + 54 KB, zero Hangul glyphs.
3. Rule found: Antonio lacks tabular figures, so all figures (counters included) use Archivo.
4. `tokens.css` (Hallmark stamp, light/dark, direction modes, density) + `tokens.ts` mirror.
5. Contrast verified from the token file (`tools/contrast.mjs` → `contrast-report.md`): all pairs pass in both themes after adding `plate`/`on-plate` tokens.
6. `DESIGN.md`, `brand.md`, `graphic-language.md` (token card spec), `components.md` (8 states each), `motion.md`.

**Decisions:** price direction Auto (Korean for ko/Asia-Seoul, else Global), theme follows OS, light is reference; yellow is a surface never text; Antonio never sets changing numbers.
**Open:** Q10 (masterplan direction superseded), Q13, Q16.

## Phase 4: page specs (done)

1. `04-page-specs/00-global-states-and-edge-cases.md`: 15 global states (loading → restricted) with treatment and copy keys; 10 edge-case rules (long names, bidi/zero-width, lookalikes, flagged, zero holders, huge/tiny numbers, clock skew, no JS).
2. `pages.md`: all 20 routes with purpose, goals, S/M/L layout, blocks with sources, states, analytics, a11y.
3. `flows.md`: five critical flows step by step with error paths: connect + network setup (Add GIWA Sepolia, faucet hint), first-time onboarding, create, buy/sell with pre-sign disclosure, claim creator fees + vesting release.
4. Token page state machine Window → Open → Full → Graduated `[06 §2.2]`; trading works with the indexer down `[AC-A2]`.

**Decisions:** pre-sign summary always before the wallet opens; disabled CTAs explain why in helper text; paused state keeps sells and claims on `[AC-C6]`.

## Phase 5: motion, 3D, video (done)

1. `3d-spec.md`: signature moment "Level" (deposits settle to one height = one clearing price) from F02; landing + graduation overlay only; budgets ≤ 5k tris, ≤ 5 draw calls, DPR ≤ 1.5, demand frameloop, lazy chunk, tiered fallback (poster → video → WebGL).
2. `ui-animation.md`: every transition with purpose; the do-not-animate list (prices, P&L, tables, chart line, countdown digits).
3. `video-plan.md`: hero loop, share card, trailer, explainer, social clips with resolution/fps/codec/budget/poster/captions; per-token graduation clips costed as phase 2.
4. Rendered with HyperFrames 0.8.191: `renders/hero-loop.mp4` (217 KB, budget 1.5 MB) + poster, `renders/share-card.mp4` (124 KB) + still; sources in `hyperframes/`.

## Phase 6: English copy (done)

1. `copy-system.md`: voice rules, banned phrases, CTA conventions, error library (17 keys), empty-state library.
2. `glossary.md`: 16 tooltip definitions at plain reading level with sources.
3. `legal-risk-copy.md`: risk, non-custodial, creator terms, transparency, content policy verbatim from `[10 §3, §1]`; legal bodies are placeholders for counsel (Q11).
4. Externalised strings ship as `08-prototype/src/strings/en.json` (keys `area.item`).

## Phase 7: architecture (done)

1. Bake-off spike (`07-architecture/bakeoff/`): React 60.2 KB / Preact-compat 8.5 KB / Solid 4.8 KB gzip; at 50/200/500 ev/s with per-frame batching all hold 60 fps, zero long tasks, input ≤ 40 ms at 4× CPU throttle; React script share ≈ 3× Preact.
2. ADR-F1: React 19 + Vite 7 static SPA, wouter, SWR, external store per frame, plain CSS on tokens, build-time prerender, lazy R3F and wallet chunks; budgets (shell ≤ 150 KB gzip, LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1).
3. ADR-B1: Rust API/gateway/RPC gateway/keepers; snapshot + 4 Hz batched deltas with sequence numbers, bounded queues, resync; browsers never touch the public RPC.
4. ADR-B2: indexer bake-off plan (Ponder vs alloy) with weighted criteria and a fixed output contract.
5. ADR-E1: CDN/WAF/limits/bot defence/autoscaling/backpressure; honest degradation matrix; six k6 scenarios sized from masterplan KPIs (30k sockets design target).
6. ADR-S1: strict CSP with no inline scripts or styles, SRI + asset-integrity monitor, zero third-party scripts, supply chain, UGC-as-text, image proxy, simulation before signing, account hardening, incident runbook.
7. ADR-O1: logs/metrics/traces/RUM/error tracking; CI with budgets, Lighthouse CI, Playwright + axe, sloplint, copy audit, provenance.

**Decisions:** Next.js (masterplan) replaced by Vite for strict CSP on a static CDN; Turnstile replaced by edge bot defence.
**Open:** Q19–Q24 (runtime changes vs masterplan, embedded-wallet exception, analytics identity, load assumptions).
