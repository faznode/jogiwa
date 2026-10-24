# Global states and edge cases (inherited by every page)

Copy keys refer to `strings/en.json` in the prototype (`06-copy/`).

## States

| State | Trigger | Treatment | Copy key |
|---|---|---|---|
| **Loading** | data not yet resolved | shape-matched skeletons (plates, bars, rows); never a full-page spinner | — |
| **Empty** | resolved with zero items | unlit plate + one sentence + one action | `empty.*` |
| **Error** | request failed | plate with problem + fix + Retry; keeps the rest of the page usable | `error.*` |
| **Wallet disconnected** | no account | read-only page; actions become "Connect wallet"; nothing hidden | `wallet.connect` |
| **Wrong network** | chain ≠ 91342 (or mainnet config) | wallet button turns danger-outlined "Switch to GIWA Sepolia"; trade/deposit/claim buttons disabled with the same reason | `wallet.wrongNetwork` |
| **Not verified (tier 0)** | no Dojang attestation | window deposits and credit claim disabled with "Verify once to join windows" → `/verify` `[F03]` | `verify.gate` |
| **ToS not accepted** | first trade | `RiskAcceptanceSheet` before the first signature `[F24, AC-A6]` | `risk.accept` |
| **Testnet degraded** | chain RPC slow or failing | yellow strip under the header: "The network is slow. Transactions may take longer." | `status.chainSlow` |
| **Indexer lagging** | indexer behind chain | ink strip: "Lists are N min behind. Trading uses live chain data." Lists show a "delayed" tag; token page trading still works `[F23, AC-A2, AC-O3]` | `status.indexerLag` |
| **Tx pending** | signature sent | toast: Waiting for confirmation (spinner) → Preconfirmed → Confirmed with explorer link `[06 §6]` | `tx.*` |
| **Tx failed** | revert / rejection / timeout | toast + inline message from the error glossary with the next step; never raw revert data `[06 §2.2 M18]` | `errors.glossary.*` |
| **Rate-limited** | API 429 | inline: "Too many requests. Try again in 20 s." with a countdown; no automatic hammering | `error.rateLimited` |
| **Paused (Guardian)** | protocol pause on new activity | banner with reason and expiry; buys/launches disabled; **sells, claims, settle, graduate stay enabled** `[F12, AC-C6]` | `status.paused` |
| **Pending parameter change** | timelock op queued | banner on affected pages: what changes, when, link to /governance `[AC-O2]` | `gov.pending` |
| **Restricted jurisdiction** | geo gate | full page `/restricted`; no app chrome actions `[F24]` | `legal.restricted` |

## Edge cases

| Case | Rule |
|---|---|
| Very long token names | Antonio caps steps down two sizes, then ellipsis; full name in `title` + accessible name; tables use body face with ellipsis |
| Emoji / odd characters in names | rendered as text, never as images; bidi control characters stripped at ingestion; zero-width characters shown as `�` in the details view (phishing defence) |
| Lookalike tickers | reserved-name list (GIWA, Dojang, Upbit, Bros, BROS) blocked at create `[10 §1.7]`; near-duplicates show "Similar name exists" |
| Flagged / under review | image blurred, name replaced by ticker, "Show anyway" toggle; taken down = hidden from feeds and search, token page reachable with a warning, trading allowed `[10 §1]` |
| Zero holders | counters show 0/25; holders tab empty state "No holders yet. The window opens first." |
| Huge numbers | token amounts K/M/B (1 decimal); SC amounts 2 decimals; prices significant-digit (`0.0000488`), never scientific; tooltips carry the exact value |
| Tiny numbers | below display precision show `< 0.0000001` with exact value on hover/focus |
| Negative P&L | `−` sign (U+2212) + down glyph + direction colour |
| Clock skew | countdowns derive from chain timestamps, not the device clock |
| No JavaScript | marketing pages and legal pages fully readable; app pages show content snapshots and "Enable JavaScript to trade" |
