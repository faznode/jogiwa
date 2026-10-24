# Component library spec

States key: **D** default · **H** hover · **F** focus-visible · **A** active · **X** disabled · **L** loading · **E** error · **S** success. Every interactive component implements all eight (Hallmark component scope). Live gallery: `/_design` in the prototype.

## Actions
| Component | Variants | States | A11y |
|---|---|---|---|
| `Button` | primary (ink), direction (buy/sell fill), secondary (outline ink), quiet (text), danger | D H F A X L E S | native `<button>`; loading keeps label, adds `aria-busy`; disabled explains why via `aria-describedby` |
| `IconButton` | 32/40 px, 44 px hit | D H F A X | `aria-label` required |
| `TextLink` | inline, standalone | D H F | underline always; external links show the domain `[10 §1.6]` |

## Inputs
| Component | Notes | States | A11y |
|---|---|---|---|
| `AmountInput` | big figure (Archivo 28/700 tnum), unit suffix (SC/ETH from config), balance + Max, quick chips 10/25/50/Max `[06 §2.2]`; rejects non-numeric; K/M/B parsing | D H F X E S | `inputmode="decimal"`, label + balance in `aria-describedby`; errors: "More than your balance", "Above your window cap (50 SC)" |
| `SlippageControl` | presets 0.5 / 1 / 2 / custom; warns above 5%, blocks above 50%; deadline minutes | D F E | radio group semantics |
| `TextField`, `TextArea` | label above, helper below, counter for limits (name 32, ticker 10, description 280) | D H F X E S | IME-safe Enter |
| `ImageDrop` | drag/drop or pick; safety check result inline with reasons `[06 §2.3]`; rejects SVG uploads | D H F L E S | keyboard pick; result announced politely |
| `Slider` (opening order ≤ 3%) | shows "tokens you'd lock" live | D H F X | `aria-valuetext` in words |
| `Checkbox`, `Switch`, `Radio`, `Select` | shadcn/Base UI primitives, restyled | D H F A X E | native semantics |

## Market
| Component | Notes | States |
|---|---|---|
| `TokenCard` | sign plate + shop floor (see graphic-language) | Window / Open / Full / Graduated × loading / flagged / taken-down |
| `StateChip` | Window (countdown), Open, Full 19/25, Graduated; icon + text | — |
| `PeopleCounter` | Archivo width 70% tnum; "19/25 people"; steps on change | live (polite, throttled 10 s) |
| `TwoTrackMeter` | credit + people bars with labels; compact and full | loading skeleton |
| `PriceChart` | SVG line, window zone, crosshair, keyboard stepping, interval tabs 5m/1h/1d/all | loading, empty ("No trades yet"), stale |
| `TradePanel` | Buy/Sell tabs (direction colours), AmountInput, QuoteBreakdown, slippage, Review button, one panel pre/post graduation `[F15]` | disconnected, wrong network, tier-gated, not accepted ToS, loading quote, quote error, ready, submitting |
| `QuoteBreakdown` | you receive, price impact, trade fee 1%, creator tax, max slippage, min received | — |
| `PreSignSummary` | sheet shown before signing: amounts, fees, creator tax, slippage, price impact, graduation progress after this trade, simulation result `[06 §2.2, brief rule 5]` | simulating, simulation failed (glossary message), ready |
| `FairnessCard` | compact (6 rows) and full; "Verified on-chain" with manifest hash; mismatch warning `[F06, AC-A1]` | loading, verified, mismatch |
| `WindowPanel` | countdown, clearing price estimate, participants, your cap, deposit form, limit bucket, cancel `[06 §2.2]` | before open, open, settling, settled, claimable |
| `WindowQuilt` | deposits as patches sized by amount; you highlighted | live, settled |
| `TradesFeed` | virtualized; time, side (+/− with glyph), amount, tokens, wallet label (you / team / cluster) | loading, empty, stale |
| `HoldersTable` / `HoldersQuilt` | share %, labels, cluster flags | loading, empty (0 holders) |
| `GraduateButton` | appears when ready; shows bounty | ready, executing, done |

## Wallet and network
| Component | Notes |
|---|---|
| `WalletButton` | disconnected ("Connect wallet"), connecting, connected (identicon + short address + SC balance), wrong network (danger outline "Switch to GIWA Sepolia") |
| `ConnectSheet` | embedded social wallet, external wallets; explains what a wallet is in one line |
| `NetworkSwitch` | one-tap switch; if the chain is missing: **Add GIWA Sepolia** with the exact values (chain ID 91342, RPC via our endpoint, explorer `sepolia-explorer.giwa.io`) and a **faucet hint** ("Need test ETH for gas? faucet.giwa.io gives 0.005 ETH a day") `[07 env]` |
| `VerifyStepper` | detect attestation → register → claim credit; tier result; expected time `[06 §2.4]` |
| `TierBadge` | tier 0 / 1 / 2 text badge, never a status flex |

## Feedback
| Component | Notes |
|---|---|
| `TxToast` | pending (spinner, "Waiting for confirmation"), preconfirmed (~300 ms), confirmed (check, explorer link), failed (glossary message + retry) `[06 §6]` |
| `Toast`, `Banner` | testnet (persistent), stale data, pending timelock change `[F12]`, maintenance |
| `Modal`, `Sheet` | focus trap, `Esc` closes, return focus to trigger; bottom sheet on mobile |
| `Tooltip` / `Term` | jargon terms are dotted-underlined and open a plain-language definition on hover, focus or tap `[06-copy/glossary]` |
| `Skeleton` | shape-matched, no shimmer under reduced motion |
| `EmptyState`, `ErrorState` | unlit plate + one sentence + one action |
| `ModerationBlur` | blur + reason + "Show anyway" |
| `Badge` | verified creator (by score band, per masterplan F21), team wallet, cluster flag, you |
| `MockBadge` | dev-only "Mock data" chip, fixed bottom-left, hidden in production builds |
