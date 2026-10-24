# Audit — Session 3 (2026-10-24)

Scope: (1) reconcile the real checkpoint (GitHub `faznode/jogiwa@a5b567a`) against the agent logs; (2) audit research phases 1–8 for completeness against the brief and for evidence quality; (3) audit masterplan docs 01–12 for internal consistency and traceability; (4) complete the missing deliverables; (5) perform the owner-requested Honeypot/Pot2Pump review. Method: full read of all 12 masterplan docs and the Phase 8 report; targeted reads of Phases 1–7 via `_progress.md`, `facts.json` files and greps; spot-checks against raw artefacts (cohort stats, forge outputs, verified source constants, LFS objects); every finding below names the file and the fix.

## A. Checkpoint reconciliation

| Item | Log says | Repo at `a5b567a` has | Conclusion |
|---|---|---|---|
| Last logged step (S2, 00:15Z) | "Wrote Phase 3 webapp report" | Phases 4–7, Phase 8 (report, 44-idea CSV, 12 specs, facts), masterplan docs 01–12 | The agent continued ~20 min past the log capture and committed at 00:35Z; the repo, not the log, is the checkpoint |
| `_progress.md` | — | Phase 8/9 unchecked, no S3 | Stale by one commit; updated in S3 |
| Missing vs Definition of Done | — | docs 13, 14; `_evidence-index.md`, `_open-questions.md`, `_findings-private.md`; `09-masterplan/facts.json` | All written in S3 (+ doc 15 for the Honeypot request) |
| Raw artefacts | 25 MB (S2) | 34 MB on disk; two dumps are Git LFS pointers | Both LFS objects (32 MB, 86 MB) verified downloadable from GitHub LFS on 2026-10-24 |

## B. Research phases 1–8

| Phase | Brief coverage | Evidence quality | Findings | Verdict |
|---|---|---|---|---|
| 0 REA | playbook, routing table, limits, version pin | strong | REA used in CLI mode only; MCP mode untested (noted in playbook) | Pass |
| 1 Recon | surface map, roles, docs extraction, footprint, infra hints | docs/headers strong; browser observation survives as log text only (screenshots lost) | OQ-1.1 partially resolved in S3 (`@ponsdotfamily` via EH-4); public-footprint URLs still unresolved (OQ-6.1) | Pass with gaps logged |
| 2 Contracts | inventory, identity, roles, ABIs, math, flows, privileges, security, gas | **strongest phase**: verified source, exact replay of 2 real txs, 3/3 live-fork tests, Safe/keeper reads | **R2** `snipeTaxSeconds` source default 15 s vs live read 3 s — tracked (OQ-2.8); **R4** gas profile deferred (OQ-2.6); 4 module contracts' verification status unknown (OQ-2.7) | Pass |
| 3 Web app | stack, wallet/chain layer, data layer (OpenAPI), feature internals, UX teardown | bundles + 17 endpoint captures; token-page chunks not captured (chart lib, trade route) | **C6** OQ numbering drift: report labels the trade-route question 3.4, facts.json uses 3.5 — normalised in `_open-questions.md` | Pass |
| 4 Backend | indexing approach, realtime path, caching, keepers, SPOFs, incident analysis, resilience checklist | inferred with confidence levels; incident sources are press summaries (OQ-4.1) | none new | Pass |
| 5 Economics | fee model, cohorts (full population), growth mechanics, KPI benchmarks, spreadsheet tables | full-population scan (709,489 launches; 0 unmatched graduations); 240-curve stratified sample | **R6** time-to-graduation uses timestamps interpolated from 500k-block anchors (RD-4); the 250 s median is robust in order of magnitude but should be re-measured with exact block timestamps on ~200 graduations before external quotation (~400 RPC calls) — added to the Phase 0 W1 probe list; **R7** the "100% of sampled graduations bundled" statement should always carry its sample size (240-curve sample) | Pass with caveats |
| 6 Competitors | feature matrix ≥ 25 (32 rows), fees, graduation designs, anti-sniper, creator incentives, pains | **R1** competitor fee facts are search summaries without primary URLs (OQ-6.2); Pools.trade Crowd Launch re-confirmed in S3; Honeypot addendum added (§8) | Pass; re-verify URLs before quoting externally |
| 7 GIWA | chain facts, infra inventory, tooling, Dojang, audience/regulatory, gap analysis, testnet strategy | live RPC probes + docs corpus; addresses recorded | none new; four items deferred to roadmap W1 by design | Pass |
| 8 Ideation | classification, pains, ≥ 40 scored ideas, shortlist 8–12 with one-page specs, thesis, names | 44 ideas, 12 specs, thesis, 5 names | M33 (Honeypot) added in S3 | Pass |

Spot-checks performed: `cohort-stats.json` (v2 launches 709,489 / graduations 10,427 / unmatched 0) matches 05 and 01; `test-output-live.txt` shows 3 passed / 0 failed; verified source confirms `MAX_SNIPE_TAX_START_BPS = 9_900`, `MAX_SNIPE_TAX_SECONDS = 60`, `MAX_SNIPE_TAX_EXEMPTIONS = 32`, `snipeTaxSeconds = 15` default; `fee-model.csv`, `daily_launches.csv`, `volume-estimate.json` present and consistent with 05 §1–2; worked examples A–E in 03 §3 re-derived by hand (all correct to the stated rounding).

## C. Masterplan docs 01–12

Consistency matrix (parameters quoted in more than one document): `G/Q0 = 2,500/1,000 SC` (02-prd AC, 03 §3, 08 §4) ✓ · split 40/30/30 (01, 02, 03, 08, 12) ✓ · window 120 s, humans-first 600 s, `N = 25`, fallback 24 h (01, 02, 03, 04, 07-data, 11) ✓ · Safe 3-of-5 + 48 h timelock + Guardian 2-of-3/7 d (03 §4, 04 §8, 12 §1) ✓ · 26-week roadmap phases (01 vs 11) ✓ · personas/journeys ↔ sitemap (02 vs 06) ✓ · KPI targets (07-data vs 09-gtm §8 vs 11 §3) ✓ · cost/audit tiers (04 §4, 05 §12, 11 §5) ✓.

| ID | Severity | Finding | Fix |
|---|---|---|---|
| C1 | High (would block the legal fallback) | 03 §3.6 bounded `holders ≥ 20`, while 12 §5 and 10-legal R1 rely on deploying a mainnet factory with `holdersShareBps = 0` | Bounds changed to `holders ∈ {0} ∪ [20, 40]` with a counsel-memo requirement; recorded as ADR-17 |
| C2 | Medium | 03 §2.4 declared `deposit(amount, maxPriceX96)` and `Deposited(…maxPriceX96…)` while §3.2 specifies 8 fixed limit buckets | Interface, event and state list now use `uint8 limitBucket` / `depositsAtLimit[8]` |
| C3 | Medium (design weakness) | 03 §2.8 derives the holder-reward snapshot block from `prevrandao`; on OP Stack this is the L1 RANDAO of the current origin — constant across many L2 blocks and knowable minutes ahead — so the snapshot is predictable and only the 2% round-trip fee deters farming | ADR-16 **proposed**: time-weighted average balance over the epoch from existing checkpoints; note added to 03 §2.8; needs owner approval before W4 |
| C4 | Low | 11 §1 Gantt: boutique audit bar started 2027-02-22 (W17) and internal review 2027-01-11 (W11) vs. text W16 and W10 | Dates set to 2027-02-15 and 2027-01-04 |
| C5 | Low | 01 (EN+ID) pointed to "13-decision-log §2" and the document did not exist | Doc 13 written; pointers now "§3"; Honeypot pointer added |
| C6 | Low | OQ-3.4/3.5 numbering drift between 03 report and facts | Normalised in `_open-questions.md` with a note |
| C7 | Info | Docs 13 and 14 absent; no Phase 9 `facts.json` | Written (13, 14, 15, `09-masterplan/facts.json`) |
| C8 | Info | `_progress.md` stale; `_evidence-index.md`, `_open-questions.md`, `_findings-private.md` absent | Written/updated |

Traceability check: every P0 feature in 02-prd §4 cites an S-spec, an M-row, or a report section; every ADR in 13 §1 names its evidence; the 17-row Pons-weakness → mitigation table in 03 §8 covers all 16 pains in 08 §2 (P12 trademark is handled in 10-legal rather than contracts, correctly).

## D. Honeypot / Pot2Pump review (owner request)

Delivered as `09-masterplan/15-honeypot-pot2pump-review.md` with captures in `raw/captures/honeypot/`. Outcome: include selectively (graduation-adapter seam as a P0 rule; optional raise-or-refund "Pot mode" as P2 F41; AI image generation folded into F38) and reject the participant-LP/ALM vault, Drip Drive and Cheese Benance; no partnership or licence because the company has pivoted to media/licensing and the clean-room rule applies. Cross-references added in 02-prd, 03, 06, 07-data, 08 and 13 (ADR-15).

## E. Definition of Done — status after session 3

| Requirement | Status |
|---|---|
| All 9 phases delivered with evidence tags and `facts.json` | **Done** (Phase 9 `facts.json` added) |
| Curve + fee + graduation math reproduced on a fork and matched to real txs | **Done** (E2-8/E2-9; 3/3 live-fork tests, two exact Python replays) |
| ≥ 40 ideas scored, Differentiation Thesis, shortlisted feature set specced | **Done** (44 / thesis / 12 specs) |
| Masterplan docs 1–14 complete, consistent, traceable | **Done** (+ doc 15); one proposed ADR awaits approval (ADR-16) |
| `_open-questions.md` and `_findings-private.md` reviewed and surfaced with top insights, risks, MVP scope and decisions | **Done** — see the session-3 closing message and 13 §3 |

## F. What could not be verified in this session

- Primary URLs for press and competitor facts (tool returns summaries only) — flagged, not fixed (OQ-6.1/6.2, OQ-4.1).
- Live re-reads on Robinhood Chain (gas profile, `snipeTaxSeconds`, module verification) — not re-run to avoid rate-limiting the shared RPC for low-value confirmations; listed with exact commands in `_open-questions.md`.
- Honeypot article images (11 blocks) — text captured, images not; the mechanism was taken from the docs instead.
- Git LFS object integrity beyond "download available" (no `git-lfs` in the sandbox).
