# Critical flows (step by step, with error paths)

## F-A. Connect wallet and set up the network
1. User taps **Connect wallet** → `ConnectSheet`: "Use email or social login (we create a wallet for you)" or "Use a wallet you have". `[F17]`
2. External wallet → provider prompt. **Errors:** user rejects → "Connection cancelled." (no retry loop); provider missing → "No wallet found in this browser" + embedded option.
3. Connected, wrong chain → `NetworkSwitch`: **Switch to GIWA Sepolia**. If the wallet does not know the chain → **Add GIWA Sepolia** (chain ID 91342, name, RPC = our endpoint, explorer `https://sepolia-explorer.giwa.io`). **Errors:** user rejects add → stays read-only with the reason; unsupported method → manual values shown with copy buttons.
4. Zero ETH for gas → **faucet hint**: "You need a little test ETH for gas. faucet.giwa.io gives 0.005 ETH a day." `[07 env]` External link labelled with its domain.
5. Session: sign-in message (SIWE) on first protected action only, plain text explaining it costs nothing. `wallet_connected{kind}`.

## F-B. First-time onboarding on testnet (J1, ≤ 3 minutes)
1. Testnet strip is visible on arrival; first visit shows a one-time sheet: "This is a test network. Nothing here has monetary value." with **Got it**.
2. Connect (F-A) → `/verify` stepper detects a Dojang attestation. Found → **Register** (one tx) → tier shown. Not found → choose path: faucet attestation (tier 1, ~2 min) or Upbit-verified address (tier 2) with numbered steps and deep links. `[06 §2.4]`
3. **Claim today's credit**: 20 SC (tier 1) or 50 SC (tier 2) `[08 §4.1]`; copy: "Season Credit is for this season only and has no monetary value."
4. Exit to Discover with a dismissible tip on the first card: "The lit number is people. A token graduates at 25."
- **Errors:** attestation revoked → tier 0 with reason; register reverts → glossary message + retry; claim already done today → "Already claimed today. Next claim in 7 h 12 min."; 7-day cap reached → explanation.

## F-C. Create a token (J2)
1. Step 1: name, ticker (live availability and reserved-name check), image (upload → safety check → result with reasons; SVG rejected), description, links (domain shown). **Errors:** image rejected ("Faces of real people aren't allowed" etc. `[10 §1]`), reserved name, ticker taken.
2. Step 2: opening order slider (0–3% of supply) with "You'd lock N tokens until graduation, then they unlock over 30 days" `[F07]`; creator tax 0–3% (default 0%) with warning above 1%: "Buyers pay this on every trade. High tax lowers trust."; read-only: window 120 s, humans-first 10 min, 25 people, each with why-tooltip. Live Fairness Card preview: "This is what buyers will see."
3. Step 3: review cost (launch fee 1 SC + opening order), risk/ToS checkbox (signed once), **Launch** → pre-sign summary → wallet → `TxToast`. **Errors:** insufficient SC, simulation failed (glossary), user rejected, timeout (check explorer link).
4. Success: token page in **Window** state with countdown + share sheet (copy link, X, Telegram; Kakao when KO ships). `create_completed`.

## F-D. Buy / sell with full pre-sign disclosure (J4)
1. Trade panel: side (Buy/Sell), amount (chips 10/25/50/Max), quote breakdown updates on input (debounced 150 ms, chain quote) `[06 §2.2]`.
2. First buy on this token → **pre-trade Fairness sheet** (six rows, verified hash) `[S4]`; `fairness_sheet_shown/expanded/dismissed{dwell_ms}`.
3. **Review buy** → `PreSignSummary` **before** the wallet opens, showing: you pay, you receive (min after slippage), price impact, trade fee 1% (and who gets it: 40/30/30), creator tax %, max slippage, graduation progress after this trade (people k → k+1 if you're new), simulation result. `[brief rule 5]`
4. Warnings in the summary (never pre-ticked, never hidden): price impact > 5% (amber plate), creator tax > 1%, cluster-flagged token, stale data.
5. **Confirm in wallet** → `TxToast` pending → preconfirmed (~300 ms) → confirmed with explorer link; receipt line "You're holder #20 of 25 needed" when applicable. `trade_submitted{side,state,slippage}`, `trade_*_ms`.
- **Errors:** slippage exceeded ("The price moved more than your 2% limit. Nothing was spent."); window cap exceeded; tier gate (humans-first); paused (buys only); rejected; RPC failure.

## F-E. Claim creator fees (J6)
1. `/creator` lists claimable fees per token (SC) and lifetime totals; **Claim** per token or **Claim all**.
2. Pre-sign summary: amount, destination (your address), network fee estimate.
3. `TxToast`; row updates to 0 with "Claimed just now". `fees_claimed` (new).
- **Errors:** nothing to claim (button disabled with reason); claim reverted; paused does **not** block claims `[AC-C6]`.
- **Vesting release:** after graduation, vesting bar shows releasable amount; **Release** sends to the beneficiary (anyone may trigger) `[AC-C5]`.
