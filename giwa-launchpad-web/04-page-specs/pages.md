# Page specs

Breakpoints: **S** 360 · **M** 768 · **L** 1280. Global states and edge cases from `00-global-states-and-edge-cases.md` apply to every page and are not repeated. Sources in brackets.

---

## `/` Landing
- **Purpose:** explain the three mechanics in under a minute and send people to Discover or Verify.
- **Goals:** newcomer understands "same price in the window" and "25 people to graduate"; trader jumps to Discover.
- **Layout:** S: headline, sentence, primary action, then the level diagram (poster image) below. M: same, diagram larger. L: headline left 6 cols, 3D level diagram right 6 cols, both inside 1280×800 (Hallmark 44b).
- **Blocks:** (1) hero: "People graduate tokens, not bots." `[09 §0]` + "Every launch opens with a two-minute window where everyone pays one price." `[F02]` + Explore launches + How a launch works; (2) **the street**: a sign stack of example launches (mock, badged); (3) **three rules as signs**: 120 s window `[F02]`, 25 people `[F05]`, creator tokens locked until graduation then 30 days `[F07]`; (4) fees in one line: 1%, split 40/30/30 `[08 §2]`; (5) Season Credit explained, "no monetary value" `[08 §4.1]`; (6) closing: Verify once and claim today's credit `[J1]`; footer.
- **States:** no data dependencies except the example street (static mock); 3D falls back to poster.
- **Copy:** no metrics, no testimonials, no partner logos.
- **Analytics:** `page_view{route:/}`; CTA clicks as `page_view` of the destination.
- **A11y:** 3D canvas `aria-hidden` with an adjacent text description; diagram has a caption.

## `/discover` Discover
- **Purpose:** find launches worth joining. `[F14]`
- **Layout:** S: season strip, search, feed tabs as a scrollable tab list, single column of sign cards. M: two columns. L: season strip full width; tabs left, search right; **two-column facade** of sign cards (rows) with a narrow right rail: "Windows opening now" list.
- **Blocks:** Season strip "Season 1, day 12 of 28. Your credit 37 SC. Claim today's 20 SC" `[06 §2.1]`; tabs Rising (default) / New / Graduating soon / Graduated `[F14]`; cards per graphic-language spec; churn/cluster labels `[F14]`.
- **States:** delayed (indexer lag) tag on tabs; empty per tab; search no results.
- **Copy:** tab helper "Rising ranks launches by people who stay, not volume." `[S8]`
- **Analytics:** `feed_tab_changed` (new), `page_view`.
- **A11y:** tabs are a real tablist; cards are single links with the full name, state and people count in the accessible name.

## `/t/[token]` Token page
- **Purpose:** decide and act: join the window, buy/sell, or help graduate. `[F15]`
- **Layout:** S: sign header; two-track meter; state panel (window/trade) as a sticky bottom bar opening a sheet; tabs Chart / Trades / Holders / Fairness / About. M: header, chart, sticky panel right from 900 px. L: header full width; left 8 cols chart + tabs; right 4 cols trade/window panel + compact Fairness Card.
- **State machine** `[06 §2.2]`: **Window** (countdown, clearing price estimate, participants, your cap, window quilt, deposit form) → **Open** (two-track meter, buy/sell) → **Full** (credit full; people k/25; fallback timer; sells open; Graduate button when ready with bounty) → **Graduated** (permanent liquidity proof, holder rewards this epoch, same trade panel).
- **Blocks:** sign header (image, name, ticker, creator + score band, share, report); `TwoTrackMeter`; `PriceChart` (window segment shaded); `TradePanel`/`WindowPanel`; `TradesFeed` with wallet labels; `HoldersQuilt` + table; `FairnessCard` compact; creator info.
- **States:** pre-trade Fairness sheet on first buy of each token `[S4]`; mismatch warning `[AC-A1]`; trading works with indexer down `[AC-A2]`.
- **Analytics:** `window_viewed`, `deposit_submitted{bucket}`, `fairness_sheet_*`, `trade_submitted`, `trade_preconfirmed_ms`, `trade_confirmed_ms`, `simulation_failed`, `share_clicked`.
- **A11y:** countdown in a polite live region updated every 10 s `[06 §7]`; meter has text equivalent; trade panel fully keyboard operable (Tab order: side, amount, chips, slippage, review).

## `/t/[token]/fairness` and `/t/[token]/holders`
- Fairness: the six rows in full with plain explanations, manifest hash, explorer link, "what this means for you" per row `[F06]`. Holders: holders quilt + table with team/cluster labels and share caps explanation `[F15]`.

## `/create` Create (3 steps, one transaction) `[F16, J2]`
- **Layout:** S: one step per screen with a progress label "Step 2 of 3"; preview Fairness Card collapses under a "See what buyers will see" disclosure. L: form left 7 cols, live sign card + Fairness Card preview right 5 cols, sticky.
- **Steps:** 1 identity and media (name ≤ 32, ticker ≤ 10, image with safety check, description, links); 2 fairness (opening order slider ≤ 3% with "tokens you'd lock", creator tax 0–3% default 0 with warning above 1%, read-only window/humans-first/N with why-tooltips); 3 review (launch fee 1 SC + opening order, risk/ToS checkbox, one transaction).
- **States:** image rejected (reason), name reserved, ticker taken, tx pending/failed, success → token page in Window state + share sheet.
- **Analytics:** `create_step{n}`, `create_completed`.

## `/verify` Verify + claim credit `[F04, F11, J1]`
- Stepper: connect → find attestation → register (one tx) → claim today's credit. If none: two paths, faucet attestation (tier 1) or Upbit-verified address (tier 2), each with steps and expected time. Exit to Discover.
- **Analytics:** `verify_started{tier}`, `verify_completed{tier}`, `credit_claimed`.

## `/portfolio` `[F19]`
- Positions table (token, state, amount, value in SC, P&L basic), claims list (window allocations, holder rewards per epoch, "Claim all"), "buyer #k of N" badges `[06 §2.5]`. S: positions as rows with expandable details.

## `/creator` `[F20, F21, F07, F09]`
- Claimable fees per token + lifetime; vesting bar with release button; reputation score with five sub-scores and "how to improve"; launch limits by tier/score (P1 copy). Empty: "You haven't launched yet." → Create.

## `/u/[address]` profile `[F21, F22]`
- Identicon, short address, tier, score band, launches (sign cards), season badges. No PII.

## `/season` and `/leaderboard` `[F11, F22]`
- Season: day counter, credit balance and claim history, points by category (counterparties 30, holding 25, creator quality 20, curation 15, squad 10 from Season 2) with the public method link `[08 §4.2]`, settlement state provisional → in review → final with appeal link.
- Leaderboard: ranked table, tier-labelled; ordinal numerals allowed; filters by category; "Points have no monetary value."

## `/governance` `[F12]`
- Pending timelock operations as plain-language diffs with execution time (≥ 48 h); executed/cancelled history; Guardian pauses with reason/expiry; audits list (empty state: "No audit reports published yet.").

## `/status` `[F23]`
- Three indicators with definitions: Chain, Indexer, App; each OK / Degraded / Down with last check time; the Sep-4 case reads "Trading available, lists delayed" `[AC-O3]`.

## `/learn` hub + articles
- Articles: How the opening window works, How graduation works, Season Credit, Fees, Risks `[09 §2]`. Each ≤ 600 words, one diagram, glossary terms linked.

## `/fees` Fees and risks
- One table of every fee from `[08 §2]`; the 40/30/30 split bar; creator tax rules; launch fee; keeper bounties; then the risk list verbatim from `[10 §3]`; link to legal risk disclosure.

## `/legal/[doc]`, `/restricted`, `/maintenance`, 404
- Legal docs: headings required by `[10 §3]` with `[PLACEHOLDER: needs masterplan decision]` bodies until counsel drafts (Q11). Restricted: plain statement, no app actions. Maintenance: what is affected, expected end time, status link. 404: "This page doesn't exist." + links to Discover and Learn.
