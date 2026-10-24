# Phase 2 — Formula Sheet (Pons V2 bonding curve, fees, graduation)

Evidence legend: [ONCHAIN] verified against Robinhood Chain (chainId 4663) data · [DOCS] docs.ponsfamily.com · [OBSERVED] from captured artifacts · [UNKNOWN] unresolved.

Source of truth for every formula below: verified Sourcify sources in `raw/sources/tree_v3_PonsV2LaunchFactory/contracts/src/v2/` (exact_match for the factory at 0x7eD598BcEf8bd9Edd8C97A195C6d13f40801EC7e). Line references are to those files.

---

## 1. Parameters (live values)

| Symbol | Meaning | Live value (native-ETH launch config 0) | Evidence |
|---|---|---|---|
| S | `LaunchConfig.supply` — total token supply, minted entirely to the curve | 1e27 (1,000,000,000 × 1e18) | [ONCHAIN] `getLaunchConfig(0)` |
| Q0 | `phantomQuote` — virtual quote reserve | 1.68 ETH | [ONCHAIN] `getLaunchConfig(0)`; `curve.phantomQuote()` on 0xb9c425ff… |
| G | `graduationThreshold` — real quote that must accumulate | 4.2 ETH | [ONCHAIN] |
| f | `curveFeeBps` — base trade fee | 100 bps (1%) | [ONCHAIN] |
| c | `creatorTaxBps` — per-launch creator tax, chosen by creator | 0–1000 bps (max 10%); sample launch used 200 bps | [ONCHAIN] `maxCreatorTaxBps()=1000`; curve `creatorTaxBps()` |
| s0 | `snipeTaxStartBps` | 9900 bps (99%) | [ONCHAIN] factory `snipeTaxStartBps()` |
| W | `snipeTaxSeconds` | 3 s (code default 15, hard max 60) | [ONCHAIN] factory `snipeTaxSeconds()`; source L65–70 |
| ps | `protocolFeeShareBps` | 3000 (30%) | [ONCHAIN] hook `protocolFeeShareBps()` |
| bb | `buybackBurnBps` — share of the creator bucket diverted to buyback | 5000 (50%) | [ONCHAIN] hook `buybackBurnBps()` |
| hf | `hookFeeBps` — post-graduation fee | 100 (1%) | [ONCHAIN] hook `hookFeeBps()` |
| mpi | `maxInternalPriceImpactBps` — buyback swap guard | 300 (3%) | [ONCHAIN] |
| poolFee / tickSpacing | V4 pool key | 0 / 200 | [ONCHAIN] `getLaunchConfig(0)` |
| launchFee | flat fee per launch | 0.0005 ETH | [ONCHAIN] `launchFee()` (also Gen2) |
| VESTING_DURATION | buyback vault vesting | 5 × 365 days | [ONCHAIN] vault constant, L53 |

Other approved pair tokens (`pairTokenEconomics`): [ONCHAIN]

| Pair token | Address | Q0 | G | G/Q0 |
|---|---|---|---|---|
| native ETH | address(0) | 1.68 ETH | 4.2 ETH | 2.5 |
| USDG | 0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168 | 3,236 | 8,090 | 2.5 |
| TAO | 0xf3081494B87e8D5fb7960f066E931D1D0e6E3d67 | 14.999 | 37.4975 | 2.5 |
| cbBTC | 0xCEC185eB182c47d1bA1EFc84e6959e18cd620Be4 | 0.052739 BTC | 0.13184752 BTC | 2.5 |

The ratio G/Q0 = 2.5 is held constant across quote assets, so every derived fraction below is pair-independent.
WETH (0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73) is **not** an approved V2 pair token; V2 uses native ETH. [ONCHAIN] `approvedPairTokens(WETH)=false`.
Tokenized-stock pairs (NVDA, TSLA, GME, SPY…) are visible in the UI "Stocks" tab [OBSERVED] but their pair-token addresses/economics were not resolved → [UNKNOWN] (open question OQ-2.3).

---

## 2. Curve state and reserves

Curve storage (PonsV2BondingCurve.sol): `trackedQuote`, `trackedTokens`, `quoteFeeBalance`, `creatorTaxBalance`, `buybackQuoteBalance`, `reservedTokens`, `graduated`, `launchedAt`, `snipeTaxExempt[]`.

Effective reserves used for pricing (`getReserves()`, L368):

```
quoteReserve = Q0 + trackedQuote − quoteFeeBalance − creatorTaxBalance
tokenReserve = trackedTokens
```

Invariant at launch: `quoteReserve × tokenReserve = Q0 × S`.

Reserved tokens (set in `initialize`, never sold on the curve):

```
reservedTokens = S × Q0 / (Q0 + G)      = S / 3.5 = 285,714,285,714,285,714,285,714,285   [ONCHAIN: curve.reservedTokens() equals this to the wei]
sellableTokens = trackedTokens − reservedTokens   (L295)
readyToGraduate = !graduated && sellableTokens == 0   (L403)
```

Why S/3.5: when exactly G real quote has entered, constant product gives tokenReserve = Q0·S/(Q0+G). So "reservedTokens" is simply the token reserve at the moment the real-quote target is met, i.e. graduation is defined by **tokens sold**, not by a balance check, which makes it donation-proof.

---

## 3. Buy (PonsV2BondingCurve.buy, L438–520)

```
snipe  = currentSnipeTaxBps(recipient)                    (0 if exempt or elapsed ≥ W)
snipe  = min(snipe, 10000 − f − c − 100)                  (always leaves ≥1% net)
spent  = received
fee    = spent·f / 10000
tax    = spent·c / 10000
snipeT = spent·snipe / 10000
net    = spent − fee − tax − snipeT
tokensOut = net · tokenReserve / (quoteReserve + net)     (getAmountOut with feeBps=0; fee already removed)
```

Partial-fill rule (L443–57): if `tokensOut > sellable`, then `tokensOut = sellable`, the required net input is recomputed with `getAmountIn(sellable, …) (+1 wei rounding)`, grossed back up by `10000/(10000−f−c−snipe)` with ceiling rounding, fee/tax/snipe are recomputed on the smaller `spent`, and `received − spent` is **refunded** (`CurveBuyRefunded`). The last buyer therefore never over-pays and griefing the final fill with a huge buy is impossible.

Slippage check (L500): `spent · minTokensOut > received · tokensOut → revert`. This is a **price-ratio** check (tokens per unit of quote), so partial fills pass as long as the effective price is no worse than quoted.

Fee booking (`_accrueFees`, L706–718): `quoteFeeBalance += fee + snipeT` (the snipe tax is treated as a base fee, so it is split protocol/creator like any fee), `creatorTaxBalance += tax`, and if buyback is enabled, `buybackQuoteBalance += (fee·(1−ps))·bb`.

After the buy, `_tryAutoGraduate()` (L696) calls `factory.graduate(token)` inside try/catch if the curve is complete; failure emits `AutoGraduationFailed` and leaves graduation to anyone.

### Snipe tax decay (L315–323)

```
elapsed = block.timestamp − launchedAt
snipeBps(elapsed) = 0                                     if exempt, or s0 == 0, or elapsed ≥ W
                  = s0 >> floor(elapsed · 14 / W)         otherwise
```

With s0 = 9900, W = 3:

| elapsed (s) | shift | snipe bps | effective buy tax |
|---|---|---|---|
| 0 (same second as launch) | 0 | 9900 | 99% (capped to 10000−f−c−100) |
| 1 | 4 | 618 | 6.18% |
| 2 | 9 | 19 | 0.19% |
| ≥3 | — | 0 | 0 |

Because Robinhood blocks are ~0.1 s and timestamps are whole seconds, **all blocks in the launch second** carry the 99% tax, unless the recipient is exempt. The factory exempts the deployer, the creator fee recipient, and up to 32 declared bundle wallets atomically in the launch tx (L713–721 `launchToken(..., address[] snipeTaxExemptions)`; `MAX_SNIPE_TAX_EXEMPTIONS = 32`).

### Worked example — real tx replay [ONCHAIN]

Launch tx 0x97625bc7aecd155186d2338a9e03f9a07258cbec764cf62304aeab8a4b248acd (block 96,128,863, ts 1792778127) created token 0x65b101d4f151f1091874e2668b7f1f80268e9e8e with curve 0xb9c425ff3706e17b061fda39bb9062999be542f9, c = 200 bps, buyer = launchForwarder (exempt).

Buy #1 (atomic opening buy, in the launch tx): received = 0.01 ETH

```
fee   = 1e16·100/1e4  = 1e14           → on-chain CurveBuy.fee  = 0x5af3107a4000 = 1e14 ✓
tax   = 1e16·200/1e4  = 2e14           → on-chain CurveBuy.tax  = 0xb5e620f48000 = 2e14 ✓
net   = 9.7e15
tokensOut = 9.7e15 · 1e27 / (1.68e18 + 9.7e15) = 5,740,664,023,199,384,506,125,347 (≈5.74M tokens)
          → on-chain 0x4bfa205309e4d775ecc23 ✓ (exact)
```

Buy #2 (block 96,128,869, ts 1792778128, elapsed = 1 s, non-exempt): received = 0.05 ETH

```
state before: trackedQuote=1e16, trackedTokens=994,259,335,976,800,615,493,874,653, quoteFeeBalance=1e14, creatorTaxBalance=2e14
quoteReserve = 1.68e18 + 1e16 − 1e14 − 2e14 = 1.6897e18
snipe = 9900 >> 4 = 618 bps
fee = 5e14, tax = 1e15, snipeT = 3.09e15, net = 4.541e16
tokensOut = 4.541e16 · 994,259,335,976,800,615,493,874,653 / (1.6897e18 + 4.541e16) = 0x158629d59b4fe7a4f05c7f ✓ (exact)
CurveBuy.fee = fee + snipeT = 3.59e15 = 0xcc11602be6000 ✓ ; CurveBuy.tax = 1e15 = 0x38d7ea4c68000 ✓
```

Foundry live-fork differential tests (`verification/forge/test/PonsV2CurveLiveDifferential.t.sol`): 3/3 pass — buy formula vs live `buy()`, sell formula vs live `sell()`, graduation allocation identity. Output in `verification/forge/test-output-live.txt`.

---

## 4. Sell (L541–566)

```
require !graduated && !readyToGraduate()                  (selling closes once the curve is full)
grossQuoteOut = tokensIn · quoteReserve / (tokenReserve + tokensIn)
fee = grossQuoteOut·f/10000 ; tax = grossQuoteOut·c/10000
quoteOut = grossQuoteOut − fee − tax ;  require quoteOut ≥ minQuoteOut
trackedQuote −= quoteOut ; _accrueFees(fee, tax)
```

Fees are always taken on the **quote leg** (input on buys, output on sells); the curve never holds memecoin-denominated fees. No snipe tax on sells.

---

## 5. Fee sweep and buyback (curve `_sweepFees`, L741–800)

```
pending = quoteFeeBalance ; tax = creatorTaxBalance
protocolAmount = pending · ps / 10000                       (30%)
creatorBucket  = pending − protocolAmount                   (70%)
buybackAmount  = executeBuyback ? min(buybackQuoteBalance, creatorBucket) : 0
creatorAmount  = creatorBucket − buybackAmount + tax         (creator tax is 100% creator's; never split)
```

Buyback execution: internal swap on the curve at fee 0, allowed only if `buybackAmount/(quoteReserve+buybackAmount) ≤ mpi (3%)` and `tokensOut ≤ sellableTokens`; otherwise the slice folds back into `creatorAmount`. If executed, tokens are `buybackVault.lock(token, tokensLocked, buybackCreatorRecipient, protocolFeeRecipient, ps)` — **locked for 5 years**, released pro-rata to creator (70%) and protocol (30%) as snapshotted. Sweeps that execute a buyback require the trusted `feeSweepOperator` (`_requiresTrustedOperator`), with `minBuybackTokensOut` slippage protection. Payouts are credited to a pull-payment `FeeEscrow` (0xd3AFEB2a57f70eF218Aa82451c51B2fb0416Ac9e) — nobody is paid by push.

Per 1 ETH of curve volume with buyback on and c = 2%:

| Bucket | Amount | Destination |
|---|---|---|
| base fee (1%) | 0.0100 ETH | split below |
| → protocol | 0.0030 ETH | protocolFeeRecipient 0x31eA5b45… (contract) via FeeEscrow |
| → buyback | 0.0035 ETH | swapped to memecoin, vault-locked 5y (70/30 creator/protocol on release) |
| → creator | 0.0035 ETH | creatorFeeRecipient via FeeEscrow |
| creator tax (2%) | 0.0200 ETH | creatorFeeRecipient via FeeEscrow |
| total take | 3.0% of volume | |

Terminology trap: the **v1** docs' "buyback and burn" refers to a *protocol-treasury* TWAP that buys and burns **PONS** with 80% of protocol fees (off-chain policy, "not immutable yet") [DOCS v1: `raw/docs-snapshots/docs.ponsfamily.com.txt` §Protocol revenue]. The **v2** per-launch buyback above is creator-funded and **locks** the launch token for 5 years; the v2 docs describe exactly this [DOCS v2: `docs.ponsfamily.com.v2.txt` §Buyback and vesting] and add that the five-year clock is **weighted** so later buybacks do not inherit earlier progress (matches `Locked(..., newVestingStart)` resetting the start).

---

## 6. Graduation (factory `graduate` L1084 → `createGraduatedPool` L1193; `PonsV2GraduationMath`)

Phase A — `graduate(token)` (permissionless, nonReentrant; also auto-called by the last buy):
- `curve.graduate(factory)` sweeps pending fees, then transfers `trackedQuote` and `trackedTokens` (= reservedTokens) to the factory. Anything **donated** to the curve beyond tracked balances is stranded by design (donation-attack defence).
- Records `sweptQuote`, `sweptTokens`, `sweptAt`; phase → Swept. Selling is already closed; buying reverts `CurveGraduated`.

Phase B — `createGraduatedPool(token)` (permissionless, retryable):

```
poolTokens   = sweptTokens · G / (G + Q0)   = reserved · 4.2/5.88 = 204,081,632.65 tokens (20.41% of S)
lockedExcess = sweptTokens − poolTokens     =  81,632,653.06 tokens ( 8.16% of S) → PonsV2LaunchLocker (permanent, event GraduationTokensPermanentlyLocked)
poolQuote    = sweptQuote                   = 4.2 ETH (less fees already swept)
sqrtPriceX96 = sqrt(amount1/amount0) in Q64.96 (PonsV2GraduationMath.sqrtPriceX96FromAmounts, with Q192→Q128 fallback for extreme ratios)
```

A full-range V4 position (tickSpacing 200, fee 0, hook = PonsV2MemeHook) is minted via PositionManager 0x58daec31… + Permit2 and the NFT is sent to the locker. Dust is swept/retained by `PonsV2GraduationExecutor` 0xC7819B64…; `PonsV2GraduationGuard` 0xf5695117… validates the pool state (sqrtPrice, hook) before seeding, and a 7-day `GRADUATION_RESCUE_DELAY` lets the owner rescue a stuck graduation.

### Price continuity [ONCHAIN]-verified identity

```
curve terminal price  = (Q0+G)/reserved = 5.88 / 285,714,285.71 = 2.058e-8 ETH/token
pool seed price       = sweptQuote/poolTokens = 4.2 / 204,081,632.65 = 2.058e-8 ETH/token   (identical)
launch price          = Q0/S = 1.68e-9 ETH/token
multiple              = (1 + G/Q0)^2 = 3.5^2 = 12.25x
FDV at launch         = 1.68 ETH ;  FDV at graduation = 20.58 ETH
gross ETH to graduate = G/(1−f−c) = 4.2424 ETH (c=0) ; 4.3299 ETH (c=2%)
```

Why the excess is locked: the curve priced tokens against Q0 + real quote, but only real quote (G) exists to seed the pool. Seeding all `reserved` tokens with only G would drop the price by (Q0+G)/G = 1.4x. Locking 8.16% keeps the pool price equal to the curve's last price.

### Final supply distribution (native config)

| Bucket | Tokens | % of S |
|---|---|---|
| Sold on curve | 714,285,714.29 | 71.43% |
| V4 pool liquidity (LP NFT locked) | 204,081,632.65 | 20.41% |
| Permanently locked excess | 81,632,653.06 | 8.16% |

---

## 7. Post-graduation fees (PonsV2MemeHook `_afterSwap`, L420–470)

```
unspecified = |delta of the non-specified currency|
feeAmount = unspecified · hf / 10000      (1%)
taxAmount = unspecified · creatorTaxBps / 10000
hook takes feeAmount + taxAmount from PoolManager into pending buckets keyed by poolId and currency
```

Because `poolFee = 0`, the V4 LP fee is zero and the **hook captures 100% of trading revenue**. Fees accrue in whichever currency was unspecified; a batched sweep (`feeSweepOperator`) converts memecoin-denominated fees to quote (bounded by `maxInternalPriceImpactBps`, else `PoolConversionSkipped`), then splits exactly as in §5 (30/70, optional 50% buyback of the creator bucket, vault lock), with `PoolBuybackSkipped` when the pool is too thin. Hard caps: `MAX_PROTOCOL_FEE_SHARE_BPS = 5000`, `MAX_HOOK_FEE_BPS = 1000`, `MAX_TOTAL_TRADE_FEE_BPS = 2000`.

---

## 8. Gen1 / Gen2 (Uniswap V3 range-order model) — for comparison

[ONCHAIN] `getLaunchConfig(0)` on Gen2 factory 0xA5aAb3F0…: pairToken WETH, graduationThreshold 4.2 ETH, initialTick −204200, supply 1e27, Uniswap V3 fee tier 10000 (1%), tickSpacing 200.

```
price at tick t = 1.0001^t  (token1 per token0)
initialTick −204200 → ≈1.36e-9 WETH per token (either ordering yields the same value once decimals are matched)
FDV at launch ≈ 1.36 ETH
```

Mechanics: factory CREATE2-deploys `PonsLauncherToken`, mints all 1e27 into a single one-sided V3 position [initialTick, maxTick], transfers the NFT to `PonsLaunchLocker` (no withdraw path; `collectFees` only), optional creator opening buy through SwapRouter02 `exactInputSingle{value}` (hence WETH-only). "Graduation" is `graduationStatus(token)`: paired-principal in the locked position ≥ 4.2 ETH — purely a badge. Fee split on collected LP fees: `protocolFeeShare` = 30 (was 10 at Gen1/launch; docs: 90/10 before block 8,991,118, 70/30 after), cap 50. Token-level launch protections: block-window buy blocking (`restrictionsEndBlock`), max-wallet and cumulative max-buy bps (tx cap = 110% of wallet cap), `_isPairPool` recognizes any fee tier to prevent alt-pool bypass.

Gen1 vs Gen2: identical ABI (24 selectors recovered by REA from unverified Gen1 bytecode, all 4byte-resolve to Gen2 names); bytecode 48,387 vs 48,709 hex chars; the PONS token (deployed via Gen1) differs from Gen2's bundled `PonsLauncherToken.sol` [ONCHAIN diff]. Root cause of the 11-hour redeploy is [UNKNOWN] (OQ-2.1).
