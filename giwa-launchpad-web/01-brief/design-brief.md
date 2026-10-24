# Design brief: Bros

Source of truth: `giwa-launchpad-research/09-masterplan/` (cited as `[MASTERPLAN 02 §4]` = file 02, section 4). The masterplan was written under the placeholder name *Madang*; this brief renames it **Bros** per the user's instruction and changes nothing else about the product.

## 1. The product in one paragraph

Bros is a meme-token launchpad on GIWA (OP Stack L2, Sepolia testnet now, chain 91342) where launching a token means gathering people, not beating bots `[MASTERPLAN 02 §1]`. Every launch opens with a 120-second window in which all deposits clear at **one price** `[02 F02]`; the first minutes are reserved for wallets verified through Dojang attestations `[02 F03, F04]`; a token graduates to a permanently locked pool only when it has both enough credit **and 25 distinct verified people** holding it `[02 F05, F08]`; creators' allocations are locked and vest after graduation `[02 F07]`; 1% trade fees split 40% creator, 30% holders, 30% protocol `[08 §2]`; and every rule of a launch is printed on a **Fairness Card** that buyers see before their first trade `[02 F06]`. On testnet, trades use **Season Credit**, a rationed, non-transferable practice currency with no monetary value `[08 §4.1]`.

## 2. Personas (masterplan personas re-read for the web design)

| Persona (brief) | Masterplan anchor | What they need from the design | Design implication |
|---|---|---|---|
| **Trader** | Min-ho, verified trader `[02 §2]` | a one-glance risk read, a fair shot at opens, fast buy/sell | Fairness Card summary on every token; one trade panel for all states; price, change and people count readable at arm's length |
| **Creator** | Soo-jin, community creator | a launch her community can actually get into, proof she cannot dump, simple fees, share cards | 3-step create with a live Fairness Card preview; vesting shown as a timeline; share card as a designed artifact |
| **Newcomer** | Dewi, explorer; J1 ≤ 3 min | to understand window / people / credit without jargon; testnet setup help | a verify stepper, plain-language tooltips, testnet banner with faucet hint, no assumed knowledge |
| **Power user** | Jae, squad leader; operator | density, keyboard, quick switching between tokens | compact density mode, keyboard shortcuts on trade panel, tables over cards in dashboards |
| **Mobile-first user** | all; masterplan designs at 360 px first `[06 §6]` | thumb reach, one task per screen | sticky trade bar above bottom nav, bottom sheets for trade and slippage, 44 px targets |

Non-persona: snipers and launch farms. The interface should give them nothing to optimise against (no volume leaderboards, no "fastest buyer" signals) `[02 §2]`.

## 3. Jobs to be done

1. *When a token I care about opens, I want a fair shot at the same price as everyone, so I don't lose to bots.* → window countdown, cap by tier, clearing-price estimate, one deposit action `[02 J3]`.
2. *Before I put anything in, I want to know who can dump on me and what I pay, so I can decide in seconds.* → Fairness Card, pre-sign summary with fees, creator tax, slippage, price impact `[02 F06; brief rule 5]`.
3. *When I launch for my community, I want proof I'm not running away with it, so they trust me.* → vesting vault visual, manifest proof, share card `[02 J2, F07]`.
4. *When a token is close to graduating, I want to know what's missing, so I can help it over the line.* → two-track progress: credit and people `[02 J5]`.
5. *When I come back, I want to see what I can claim, so I don't leave rewards behind.* → claims list in portfolio and creator dashboard `[02 F19, F20]`.
6. *When something is broken or delayed, I want to know honestly, so I don't trade on stale data.* → status page, stale-data indicators `[02 F23]`.

## 4. Differentiation thesis → design implications

The masterplan's thesis `[01 §2; 02 §1]`: graduation is a community event, not a bot event. Its five mechanics, and what each asks of the design:

| Mechanic | Design implication | Signature potential |
|---|---|---|
| One-price opening window `[F02]` | show the *window* as a shared container that fills and then clears at one level; never a race | high: "same price for the whole window" is visual |
| Humans-first minutes `[F03]` | tier is a quiet badge, never a status flex; explain why you're gated | low |
| People threshold, N = 25 `[F05]` | the **people count** is the hero metric on cards, above volume (volume is not on the default card `[06 §2.1]`) | high: people-first numbers are unusual in the category |
| Fairness Card `[F06]` | a printed, fixed-format card with six rows; the same anatomy everywhere | high: a card users learn to read |
| Locked pool, holder rewards `[F08, F10]` | "permanent liquidity" proof and "rewards this epoch" on graduated tokens | medium |

What we **don't** show (by design, from the masterplan): volume on default cards, "fastest buyer" or sniper signals, comments/chat `[02 §5]`, airdrop or platform-token language `[08 §1]`.

## 5. Constraints from this brief

- English only; zero Korean text shipped; strings externalized, layout ready for KO later (masterplan F18 KO-default is **deferred**, logged in `_open-questions.md`).
- Korean influence is design-only and principle-level.
- Testnet → mainnet without redesign: the quote asset label (`SC` → `ETH`), network name and explorer links are config, never baked into layouts `[12-migration]`.
- No GIWA/Upbit/Dunamu logos; descriptive network naming only (`GIWA Sepolia`), pending counsel Q8 `[10 §2]`.
- Mock data is visibly flagged.
