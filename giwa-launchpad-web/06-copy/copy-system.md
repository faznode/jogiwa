# English copy system

All UI strings live in `strings/en.json` (prototype root), keyed `area.item` for future localization (KO first, ID later `[F18, F32]`). Components never hard-code copy.

## Voice (from `01-brief/brand-brief.md`)
Upfront, Together, Playful. Not Flashy, Exclusive, Pushy.
1. Rule first, then the number: "Everyone in this window pays the same price. 01:12 left."
2. Short sentences, everyday words, grade 7 for tooltips and errors.
3. No urgency: no "hurry", "last chance", "don't miss", no exclamation marks in system copy.
4. No promises: never "safe", "guaranteed", "profit", "moon", "100x", "airdrop", "free money".
5. No bro-talk in chrome: no "ser", "gm", "wagmi", "degen", "ape in".
6. Sentence case everywhere. No em or en dashes in UI copy (Hallmark gate 19); use a full stop or a comma.
7. Numbers: digits, thousands separators, `−` for negatives, units after the number ("25 SC", "19 of 25 people").

**Banned:** revolutionize, unlock, seamless, supercharge, to the moon, next-gen, empower, elevate, effortless, unleash, world-class, best-in-class, game-changing, robust, cutting-edge, Learn more, Get started, Book a demo.

## CTA conventions
- A CTA is a **verb + object** that says what happens: "Join the window", "Review buy", "Claim 12.40 SC", "Launch token", "Switch to GIWA Sepolia".
- Primary CTAs never say "Continue" when a specific verb exists. "Next" is allowed only between create steps.
- Destructive or irreversible: say the consequence ("Cancel deposit and refund 25 SC").
- Secondary links name their destination ("How a launch works", "See the Fairness Card").
- Disabled CTAs explain why in helper text, not in a tooltip only: "Verify once to join windows."

## Error library (glossary keys `errors.*`)
Pattern: **what happened. What to do.** Never raw revert data; the technical detail sits behind "Details".

| Key | Message |
|---|---|
| `errors.userRejected` | You cancelled in your wallet. Nothing was sent. |
| `errors.wrongNetwork` | Your wallet is on another network. Switch to GIWA Sepolia to continue. |
| `errors.insufficientBalance` | That's more than your balance. Lower the amount or claim today's credit. |
| `errors.slippage` | The price moved more than your {slippage} limit. Nothing was spent. Try again or raise the limit. |
| `errors.windowCap` | Above your window cap of {cap}. Lower the amount. |
| `errors.tierGate` | This window is open to verified people first. Verify once to join. |
| `errors.windowClosed` | The window just closed. Your deposit wasn't sent. Trading opens when it settles. |
| `errors.paused` | New buys and launches are paused: {reason}. Sells and claims still work. |
| `errors.simulationFailed` | This trade would fail if sent. {reason} |
| `errors.rateLimited` | Too many requests. Try again in {seconds} s. |
| `errors.indexerDown` | Lists are delayed. Trading still uses live chain data. |
| `errors.rpc` | We can't reach the network right now. Try again in a moment. |
| `errors.imageRejected` | We can't use this image: {reason}. |
| `errors.nameReserved` | That name is reserved. Pick another. |
| `errors.tickerTaken` | That ticker is in use. Pick another. |
| `errors.alreadyClaimed` | Already claimed today. Next claim in {time}. |
| `errors.unknown` | Something went wrong. Try again. If it keeps happening, check Status. |

## Empty states (`empty.*`)
Pattern: what belongs here + one action.
- Feed tab: "No launches in {tab} yet." → "See what's open"
- Trades: "No trades yet. The window opens first."
- Holders: "No holders yet."
- Portfolio: "You don't hold anything yet." → "Explore launches"
- Claims: "Nothing to claim right now."
- Creator: "You haven't launched a token yet." → "Launch a token"
- Governance audits: "No audit reports published yet."
- Search: "No launches match \"{query}\"."

## Tooltip rules
Defined terms get a dotted underline and a 1–2 sentence plain definition (`06-copy/glossary.md`). Max 35 words. No jargon inside a definition.
