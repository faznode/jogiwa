# Phase 4 — Backend / Indexer / Infra Inference: ponsfamily.com

Method: inference from normal-use observation only (response headers, bundle markers, API shapes, on-chain keeper addresses). No probing beyond public GETs. Confidence is stated per component. Evidence files: `raw/captures/*.headers`, `raw/docs-snapshots/*.headers.txt`, `raw/bundles/js/`, Phase 2 on-chain reads.

## 1. Inferred architecture

```mermaid
flowchart LR
  subgraph Client
    B[Browser / PWA\nNext.js RSC + TanStack Query]
  end
  subgraph Vercel["Vercel (ponsfamily.com)"]
    E[Edge cache\nx-vercel-cache HIT/MISS]
    R[Next.js route handlers /api/*]
    P[/api/rpc proxy]
    IMG[/api/artwork image proxy]
  end
  subgraph Data["Data plane (inferred)"]
    IDX[(Own indexer DB\nlaunches, ticks, swaps, holders, fees)]
    BAL[balancesapi.ponsfamily.com\nCloudflare-fronted balances service]
    ABLY[Ably realtime\ntoken.created / token.updated]
  end
  subgraph Chain["Robinhood Chain (Arbitrum Orbit, chainId 4663)"]
    RPC[(RPC provider\nupstream UNKNOWN)]
    F[PonsV2 factory + curves + v4 hook]
  end
  subgraph Keepers["Off-chain workers (EOA-signed)"]
    K1[feeSweepOperator\n0xa1018c...cA83]
    K2[graduation finisher\npermissionless graduate()]
    K3[holder-fee distributor\nfees.distributor]
  end
  subgraph Third["Third-party"]
    TK[Turnkey\nembedded wallets]
    CF[Cloudflare Turnstile]
    IPFS[(IPFS pinning\nipfs:// artwork)]
    X[X OAuth]
  end
  B -->|GET /api/launches, ticks, profile| E --> R --> IDX
  B -->|JSON-RPC| P --> RPC
  B --> ABLY
  B --> BAL
  R --> IPFS
  IMG --> IPFS
  IDX -->|eth_getLogs / block follow| RPC
  IDX --> ABLY
  K1 -->|sweepFees / buyback| F
  K2 -->|graduate| F
  K3 -->|distribute| F
  B --> TK
  B --> CF
  R --> X
```

| Component | Inference | Confidence | Evidence |
|---|---|---|---|
| Hosting / API | Vercel-hosted Next.js; every `/api/*` is a route handler; edge caching for public lists | High | `x-vercel-id`, `x-vercel-cache`, `x-matched-path`, `dpl_…` [OBSERVED headers] |
| Indexing | **Own indexer** (not a subgraph): `/api/launches/ticks` returns rows keyed `txhash:logIndex` with `block`, `logIndex`, `at`, and mixes curve `CurveBuy/CurveSell` with v4 `Swap` rows — a custom log-decoding pipeline writing to a relational store. No GraphQL, no `api.thegraph.com`, Goldsky, Ponder or Envio markers in bundles. | High | `raw/captures/api_launches_ticks_*.json` shape; absence of markers [OBSERVED] |
| Real-time path | Indexer → Ably publish (`token.created`, `token.updated`) → browser invalidates TanStack queries; REST remains source of truth (8 s staleTime). Trades feed is pull-based (ticks endpoint `max-age=0, must-revalidate`). | High | Ably SDK in 5 chunks; event names in bundle [OBSERVED] |
| Caching / CDN | Public lists cached at Vercel edge (`public`, `s-maxage`-style, MISS→HIT observed); user-scoped endpoints `no-store`; docs site also on Vercel; `balancesapi` behind Cloudflare `DYNAMIC` (no cache) | High | `.headers` files [OBSERVED] |
| Rate limits (normal use) | None hit from the browser; public RPC returned 429 only under our scanner load; Vercel edge returned no 429 for 17 probes | Medium | scan log, captures |
| Metadata / image pipeline | Upload → IPFS pin (CID stored as `artwork: ipfs://…`) → served via `/api/artwork?src=` resizer (same-origin, cacheable). Pinning provider [UNKNOWN] (no Pinata/web3.storage markers) OQ-4.3 | Medium-High | launch schema, route strings [OBSERVED] |
| Moderation pipeline | Allow-list ("Pons Verified", `/api/tokens/verified`), takedown + law-enforcement request pages, geo gating (equity pairs), wallet screening on connect. No user report button → moderation is reactive/off-platform (support tickets) | Medium | routes + copy [OBSERVED] |
| Keeper: fee sweeps & buybacks | EOA `feeSweepOperator` 0xa1018c1D9655292A2dE0F7dEa9a0F848EaA8cA83 must call sweep/buyback on the factory/hook; buybacks execute via the hook into the vault | High (role) / Medium (schedule UNKNOWN OQ-4.4) | Phase 2 reads [ONCHAIN] |
| Keeper: graduation | `graduate()` is permissionless and auto-attempted inside the final buy; a finisher bot likely retries failed auto-graduations (`AutoGraduationFailed` event) within the 7-day rescue window | Medium | code path [ONCHAIN]; bot identity UNKNOWN |
| Keeper: holder fee distribution | `fees.distributor` + `payouts` counters (1,419 rounds on one token) imply a scheduled off-chain distributor | Medium-High | `api_launches_50.json` [OBSERVED] |
| Key management | Owner = Gnosis Safe 2-of-3 (no timelock); operational keys = hot EOAs (sweep operator, protocol fee recipient is a contract) | High | [ONCHAIN] |
| Embedded wallets | Turnkey (iframe `auth.turnkey.com`), delegated public key endpoint → server can co-sign/sponsor flows for embedded users | Medium | CSP + route [OBSERVED] |
| Pricing / USD | `quoteUsd` map returned by profile/launch endpoints → server-side price feed for ETH/USDG/stock tokens (source UNKNOWN OQ-4.5) | Medium | [OBSERVED] |
| Balances service | Separate `balancesapi.ponsfamily.com` (Cloudflare) → wallet positions/holders computed off the main API | Medium | [OBSERVED] |

## 2. Single points of failure (as observed)

1. **Upstream RPC provider** behind `/api/rpc` (identity unknown): all reads, simulations and the indexer depend on it; the public RPC rate-limits aggressively.
2. **Indexer lag = product outage**: UI state (progress, price, feed) comes from the indexer, not the chain; when indexing stops the app shows stale data while the chain trades on.
3. **Hot EOA keepers**: fee sweeps, buybacks and holder payouts stop if one key/host is down; creator revenue visibly stalls (`lastPayoutAt`).
4. **Ably**: realtime dependency; degraded → users fall back to 8 s polling (graceful).
5. **Vercel edge**: single hosting provider for app + API + RPC proxy.
6. **IPFS gateway**: artwork availability depends on pin provider + gateway; proxied via same origin (helps caching, but one gateway).
7. **Governance**: 2-of-3 Safe with no timelock can change fee params instantly (user trust SPOF).

## 3. The infra-provider incident and what it teaches

- **Oct-23-2026**: ponsfamily.com displayed a "backend upgrade / degraded performance" banner during our capture [OBSERVED `raw/docs-snapshots/ponsfamily.com.html`].
- **Sep-4-2026 "outage"**: press first reported a ~13–14-minute Robinhood Chain halt; follow-up analysis found the chain kept producing blocks — a **block explorer stopped indexing** while the chain's **batch poster was outbid for Ethereum blob space**, and successful transaction traffic dropped for ~40 minutes. [DOCS — press, URLs unresolved → OQ-4.1]
- **Launch-week attacks (Jul 2026)**: outages following sniping/bundling attacks that forced the Gen1→Gen2→V2 redeploys [DOCS v1/v2 + Phase 2].

Resilience lessons (carried into Masterplan §5):

| Requirement | Why |
|---|---|
| Indexer reads **raw RPC logs**, never a third-party explorer API, with ≥2 RPC upstreams and automatic failover | explorer-indexing failure masqueraded as a chain halt |
| Expose **chain-health vs indexer-health** separately in the UI ("chain live, feed delayed 40 s") | users could not tell whether trading was possible |
| Keep **core trading usable from chain reads alone** (curve state via multicall) when the indexer lags | UI must not die with the DB |
| Keepers are **idempotent, multi-host, alert on missed cadence**; every keeper action is also **permissionless** (anyone can call) | hot-EOA keepers are SPOFs; Pons made graduation permissionless but not sweeps |
| Monitor L1 **blob-fee pressure / batch-poster lag** and sequencer liveness (OP Stack equivalents on GIWA) | the root cause was L1 data posting, not L2 execution |
| Status page + incident banner wired to real health checks, not manual | banner appeared but gave no actionable info |
| Edge-cache public lists with **stale-while-revalidate** so the app degrades to stale rather than erroring | Vercel edge caching already mitigated read load for Pons |

## 4. Open questions
- OQ-4.1 primary sources for the Sep-4 incident and the Oct-23 degraded-performance banner (status page URL).
- OQ-4.2 RPC provider behind `/api/rpc` (Alchemy / QuickNode / Conduit / self-hosted Nitro node).
- OQ-4.3 IPFS pinning provider.
- OQ-4.4 keeper cadence for sweeps/buybacks/payouts (can be measured by sampling `LaunchSwept` / vault `Locked` event timestamps — follow-up).
- OQ-4.5 USD price source for stock tokens.
