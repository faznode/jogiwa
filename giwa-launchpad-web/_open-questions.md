# Open questions

Status: **open** (needs a decision), **assumed** (we proceeded with a default you can overturn), **counsel** (needs a lawyer). Masterplan references as `[file §]`.

| # | Question | Status | Our default / note | Raised in |
|---|---|---|---|---|
| Q1 | Masterplan F18 makes Korean the default locale; this brief ships English only. Confirm KO is deferred, not dropped. | assumed | English only now; all strings in `strings/en.json`; layout tested with 30% longer strings and a CJK fallback stack | Phase 1 |
| Q2 | Split `/` (landing) from `/discover` (masterplan `/` = feed)? | assumed | split, no auto-redirect | Phase 1 IA |
| Q3 | Separate `/leaderboard` route instead of a `/season` tab? | assumed | own route, linked from Season | Phase 1 IA |
| Q4 | Add client events `vesting_released`, `fees_claimed`, `rewards_claimed`, `graduate_clicked`, `feed_tab_changed`, `tos_accepted`, `squad_joined` to `[07 §1.2]`? | open | prototype logs them to the console only | Phase 1 matrix |
| Q5 | Adopt "crew" as a product term? Masterplan only supports "squad". | assumed | not adopted | Phase 1 brand |
| Q6 | Update reserved-name list `[10 §1.7]`: replace "Madang" with "Bros" and reserve the ticker BROS. | open | assumed in specs | Phase 1 naming |
| Q7 | Is **memefab** (seen building on GIWA) a direct competitor? Not in masterplan 06-competitors. | open | research before Season 0 | Phase 1 naming |
| Q8 | Descriptive use of "GIWA" ("Network: GIWA Sepolia") without a licence. Masterplan Q8. | counsel | we never say "Built on GIWA"; only the network name in network chips, wallet setup and footer facts | Phase 1 |
| Q9 | Naming "Dojang" and "Upbit" in verification copy. Masterplan Q5. | counsel | text only, no logos: "Verify with Dojang", "Tier 2: Upbit-verified address" | Phase 1 |
| Q10 | The masterplan's design direction (celadon/persimmon, Pretendard, "Madang ring") is superseded by the Phase 2 decision. Confirm. | assumed | see `02-direction/decision.md` | Phase 2 |
| Q11 | Legal page bodies (terms, privacy, risk, restricted list, takedown, law enforcement) are drafts for counsel (masterplan Q15). | counsel | prototype shows `[PLACEHOLDER: needs masterplan decision]` bodies with the required headings; risk bullets are verbatim from `[10 §3]` | Phase 6 |
| Q12 | Audits list on `/governance`: none exist yet. | assumed | "No audit reports published yet" empty state; never implies an audit | Phase 4 |
| Q13 | Default price-direction colours. | assumed | **Auto**: Korean (red up / blue down) when browser languages include `ko` or time zone is Asia/Seoul; otherwise Global (green up / red down). Always paired with sign and arrow | Phase 3 |
| Q14 | Trademark clearance for "Bros" (KIPRIS/USPTO/EUIPO, classes 9/36/42). | counsel | see `01-brief/naming-due-diligence.md` | Phase 1 |
| Q15 | Launch fee on mainnet is 0.0005 ETH; launch-fee UI label switches with network config `[08 §2]`. Confirm mainnet quote is ETH (not a stablecoin, F37 is P2). | assumed | config-driven label | Phase 4 |
| Q16 | Dark mode default. | assumed | follow `prefers-color-scheme`; light is the reference design | Phase 3 |
| Q17 | Hallmark's `study` verb named in the brief does not exist in v2.0.0. | assumed | manual DNA extraction with Hallmark vocabulary | Step 0 |
| Q18 | Does the team want a Bros perception test (6–8 mixed-gender users, KR + ID) before Season 1? | open | recommended | Phase 1 naming |
| Q19 | Back-end runtime: masterplan `[05 §4, §5, §8]` uses Vercel Route Handlers, SSE from Postgres `NOTIFY` and Node keepers; the brief asks for Rust in the connection-heavy parts. | assumed | brief wins: Rust API, realtime gateway, RPC gateway, keepers (`07-architecture/ADR-B1`); batch jobs stay as in the masterplan | Phase 7 |
| Q20 | Front-end framework: masterplan `[05 §2]` picks Next.js 16 App Router; bake-off + strict-CSP requirement pick React + Vite static. | assumed | React + Vite (`ADR-F1`); prototype built on it | Phase 7 |
| Q21 | Embedded (social-login) wallets run provider code in an iframe, which conflicts with "zero third-party scripts at runtime". | open | allow one provider origin in `frame-src`, loaded only after the user chooses social login; owner to approve when the provider is picked (masterplan owner decision) | Phase 7 |
| Q22 | Bot protection: masterplan lists Cloudflare Turnstile (in-page third-party script). | assumed | edge bot management + rate limits, managed challenge on abuse paths only (`ADR-E1`) | Phase 7 |
| Q23 | Analytics identity: should events carry the wallet address? | open | no; random per-session ID, no cookies, no IP storage (`ADR-S1 §12`) | Phase 7 |
| Q24 | Load-test sizing assumes peak concurrency = 50% of Season 2 verified users + 5× read-only visitors (≈18k; design 30k sockets). | assumed | validate with Season 0 telemetry before Season 1 (`ADR-E1`) | Phase 7 |
