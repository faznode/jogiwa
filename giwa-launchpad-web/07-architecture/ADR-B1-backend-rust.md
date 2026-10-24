# ADR-B1: Back-end services in Rust; realtime as snapshot + batched deltas

**Status:** proposed. **Supersedes:** masterplan `[05 §4, §5, §8]` runtime choices (Q19). Contracts, data model `[05 §3 tables]`, RPC failover `[05 §11]` and keeper duties `[05 §8]` are kept.

## Context
- The connection-heavy parts are the public API under launch spikes, thousands of concurrent realtime subscribers on one hot token, keepers that must never miss a settle or graduation, and the RPC relay. `[brief Phase 7]`
- GIWA produces 1 s blocks with Flashblocks preconfirmations. Public RPC is rate-limited. `[07 env, 05 §11]`
- KPIs: UI update within 1 s of a block `[05 §5]`; indexer lag p95 < 3 s; app error rate < 0.5% `[07 §2]`.

## Decision
| Service | Stack | Responsibility |
|---|---|---|
| **API** | Rust: Axum 0.8, Tokio, tower (timeout, concurrency limit, load shed, compression), sqlx (Postgres), serde | REST snapshots for every page in `[05 §4]`; SIWE sessions; ToS acceptance; media intake hand-off |
| **Realtime gateway** | Rust: Axum WebSocket + SSE fallback, Tokio broadcast per topic, NATS JetStream consumer | topics `token:<addr>`, `feed:<name>`, `status`, `me:<session>`; coalescing, backpressure, resync |
| **RPC gateway** | Rust: alloy providers with health scoring, circuit breakers, method allow-list | all chain reads for API/indexer/keepers; tx relay to every healthy provider `[05 §11]` |
| **Keepers** | Rust: alloy + Tokio, KMS-held keys, two regions | `settle`, `graduate`, `finalizeEpoch`, `pushHolders`, `refresh`, `burnExpired` `[05 §8]`; also shipped as the public `keeper-kit` binary |
| **Indexer** | Ponder or Rust (ADR-B2) | events → Postgres; deltas → NATS with sequence numbers |
| Scoring job, media pipeline | keep masterplan workers (batch, not connection-heavy) | `[05 §7, §9]` |

**Event bus: NATS JetStream.** Indexer-to-gateway deltas need replay by sequence number and consumer backpressure. Redis pub/sub is fire-and-forget. Redis stays for rate-limit counters and short caches only.

## Realtime protocol: snapshot + batched deltas (no per-trade fan-out)
1. **Snapshot.** `GET /v1/tokens/:addr/snapshot` returns state, curve, counts, the last 100 trades, holders top 50, `asOfBlock` and `seq`. Edge-cached 1–2 s.
2. **Subscribe.** `wss://stream…/v1?topics=token:<addr>&since=<seq>`.
3. **Coalesce.** The gateway emits at most **one frame per topic per 250 ms** (4 Hz) for token topics and 1 s for feeds/status. Each frame carries `{topic, seqFrom, seqTo, trades[≤50], curve(latest), people, holdersChanged[], stateChange?}`. Trades beyond 50 in one tick are summarised (`droppedTrades: n`), and the client refetches the list if the user is looking at it.
4. **Backpressure.** Each client has a bounded send queue (8 frames or 256 KB). On overflow, intermediate frames are dropped and a `resync` frame tells the client to refetch the snapshot. One slow phone never slows the topic.
5. **Idempotent clients.** Frames with `seqTo ≤ lastSeq` are ignored. A gap (`seqFrom > lastSeq + 1`) triggers a resync.
6. **Reconnect** with exponential backoff (0.5 s → 30 s) plus full jitter. If the gateway refuses admission (503 + `Retry-After`), clients poll the snapshot every 5 s.
7. **Encoding:** JSON at launch, for debuggability. MessagePack if egress becomes the bottleneck.

The prototype's `MockDataSource` implements exactly this contract: `subscribe(topic, onDelta)` with 250 ms coalescing and a `raw` per-frame mode for stress tests (`08-prototype/src/data/`).

## RPC policy
- **Browsers never call the public, rate-limited GIWA RPC.** Every read goes through our API (indexed) or the RPC gateway's allow-listed chain-truth reads (`eth_call` for quotes and `reserves()/state()`, `eth_getBalance`, `eth_blockNumber`, `eth_getTransactionReceipt`, `eth_estimateGas`, `eth_simulateV1`) with per-IP and per-session token buckets. `[05 §2, §11]`
- **Writes.** The "Add GIWA Sepolia" flow gives wallets **our RPC gateway URL** (`[07 env]`), so broadcasts go through our relay, which fans out to every healthy provider. Wallets already configured with the public RPC broadcast directly. That traffic is wallet-side, not our code.
- **Trading never depends on the API** `[05 §2]`. If the indexer or API is degraded, the token page keeps quoting and trading from chain reads via the RPC gateway (`AC-A2`).
- Provider keys live only in the RPC gateway.

## Data
Postgres (masterplan tables `[05 §3]`) with a read replica for the API. Partition `trades` by month above 50 M rows `[05 §13]`. Every snapshot response carries `asOfBlock` and `indexerLagBlocks`, so the UI can tell users honestly how stale a list is.

## Alternatives
| Option | Why not |
|---|---|
| Masterplan: Vercel Route Handlers + SSE from Postgres `NOTIFY` | Simple, but each SSE connection is a long-lived function invocation; fan-out cost and limits arrive early (masterplan already plans an Ably switch at 5k concurrent `[05 §13]`). `NOTIFY` has no replay. |
| Node/TypeScript services everywhere | One language with the front-end, but higher memory per socket and GC pauses under fan-out. Kept for batch jobs. |
| Go | Comparable fit. Rust chosen for alloy (first-class EVM types, OP-stack support via op-alloy) and the brief's direction. |
| Managed pub/sub (Ably/Pusher) | Valid fallback behind the same gateway contract. Third-party connect origin and per-message pricing. |

## Risks
- **Rust velocity and hiring.** Keep the Rust surface small (four services), generate TS types for the `DataSource` from the API's OpenAPI schema, and keep business rules in the contracts and indexer.
- **alloy on OP-stack specifics** (deposit transactions, Flashblocks `pending` tags): verify in the Phase-0 spike.
- **Coalescing hides individual trades during bursts.** The 50-trades-per-frame cap plus `droppedTrades` and an on-demand refetch keep the list complete when someone is reading it.
