# ADR-E1: Edge, scale, degradation and the load plan

**Status:** proposed.

## Edge
| Layer | Decision |
|---|---|
| **CDN** | Hashed assets `Cache-Control: public, max-age=31536000, immutable`. HTML `no-cache` + ETag. API list and snapshot GETs `public, max-age=2, stale-while-revalidate=10` `[05 §4]`. Per-user endpoints `private, no-store`. |
| **WAF** | Managed OWASP rules; method and path allow-list for the API; body size caps (media 5 MB `[05 §7]`, JSON 32 KB). |
| **Jurisdiction gate** | At the edge, before the app: restricted countries get `/restricted` (static) `[F24, AC-A6]`. |
| **Bot defence** | Edge bot scoring (TLS/HTTP fingerprints, reputation) plus a managed challenge on abuse paths only (media upload, session creation). **Never on the trade path.** No in-page challenge script (S1, Q22). |
| **Rate limits** (token bucket; honest `429` + `Retry-After`; the UI shows a countdown and never auto-hammers) | anonymous API reads 60 / 10 s per IP; signed-in reads 180 / 10 s per session; RPC gateway reads 20 / s per IP; `eth_sendRawTransaction` 10 / min per IP; media upload 10 / h per wallet; WebSocket connects 5 / min per IP |

## Scale
- **Autoscaling.** API on CPU (target 60%) and p95 latency. Gateway on open connections (target 15k per instance, hard cap 20k) and send-queue depth. Indexer is a single writer with a warm standby `[05 §11]`. Keepers run fixed in two regions, plus public bounties `[05 §8]`.
- **Backpressure.** Gateway per-client bounded queues with drop-to-latest coalescing (B1). Global admission control: above the cap, new sockets get `503` + `Retry-After` and clients fall back to 5 s snapshot polling. API uses tower `ConcurrencyLimit` + `LoadShed`, bounded DB pools and per-provider circuit breakers on RPC.

## Graceful degradation (honest by design)
Every snapshot carries `asOfBlock`, `indexerLagBlocks` and `generatedAt`. The UI derives staleness from data, never from guesswork.

| Condition | Detection | What users see `[00-global-states]` |
|---|---|---|
| Chain RPC slow | head age > 5 s, provider disagreement | yellow strip "The network is slow. Transactions may take longer." |
| Indexer lag | `indexerLagBlocks > 5` `[05 §3]` | ink strip "Lists are N min behind. Trading uses live chain data." plus "delayed" tags on lists; trading stays on `[AC-A2, AC-O3]` |
| API down | failed snapshot, health red | last snapshot stays with its "as of" time; token page quotes from chain reads |
| Gateway down / refused | socket close, 503 | silent switch to 5 s polling, no alarm unless lag grows |
| Guardian pause | `Paused` event | banner with reason and expiry; buys and launches off, sells and claims on `[F12, AC-C6]` |

## Load and soak test plan (k6)
**Targets derived from masterplan KPIs** `[07 §2, 09 §8]`: Season 1 has 3,000 verified users, Season 2 6,000; 100–400 launches per day; indexer lag p95 < 3 s; app error rate < 0.5%; UI update ≤ 1 s after a block `[05 §5]`.
**Planning assumptions** `[DECISION, to validate in Season 0, Q24]`: peak concurrency = 50% of Season 2 verified users (3,000) plus 5× that in read-only visitors during a shared launch (15,000), about 18k sessions. Design target **30k concurrent sockets** (≈1.7× headroom). A hot token sustains 50 trades/s (brief stress rate) and bursts to 500/s for 60 s.

| # | Scenario | Load | Pass criteria |
|---|---|---|---|
| 1 | Baseline mix | 1,500 RPS reads (90% edge hits), 5k sockets | API p95 < 150 ms at origin; error rate < 0.5% |
| 2 | Spike (a share goes viral) | 0 → 10k sockets in 60 s on one topic | admission holds; no 5xx at the API; p95 block-to-client ≤ 1 s once connected |
| 3 | Soak | 30k sockets, 4 h, 20 trades/s spread | memory drift < 5%/h; zero crashed instances; reconnects < 0.1%/min |
| 4 | Hot-token stress | 500 trades/s for 60 s on one token, 10k subscribers | frames stay at 4 Hz; gateway CPU < 70%; indexer lag p95 < 3 s after the burst |
| 5 | Failure injection | kill the indexer, throttle RPC to 1 s, kill one gateway instance | stale strips appear within 10 s; trading quotes keep working; clients reconnect with jitter, no thundering herd (> 2k reconnects/s absorbed) |
| 6 | Rate-limit correctness | scripted abuser per limit above | 429 with `Retry-After`; no collateral blocking of other IPs |

Tools: k6 (`k6/http`, `k6/experimental/websockets`), a chain load generator from ADR-B2, Grafana dashboards from O1. Runs: before Season 0, before Season 1, and after any change to the gateway or indexer.
