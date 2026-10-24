# 10 — Legal, Compliance & Risk Register

This document is not legal advice. It lists the policies we can implement ourselves and the questions that must go to licensed counsel in Korea and Indonesia (and a US adviser for geo-blocking). Pons' own compliance surface (terms, privacy, takedown, law-enforcement and restricted pages; wallet screening; geo-gating of equity pairs — 01 recon, 03 §5) is the minimum we match.

## 1. Content moderation policy (v1)

Prohibited at creation (automated + human review) and removable after publication:
1. Impersonation of real persons, companies, exchanges (incl. Upbit, GIWA, Dunamu) or projects; use of their logos.
2. **Likeness or names of K-pop idols, actors, athletes and other public figures** (Korean right-of-publicity and portrait rights are actively enforced; 06 §4 pains show idol-coin spam).
3. Listed-stock tickers or company names presented as tokenised equity (no RWA pairs exist; confusion with securities).
4. Political candidates and parties (Korean election-law sensitivity), hate, harassment, sexual content, minors, violence.
5. Gambling framing ("lottery", "jackpot") and guaranteed-return language; "dividend"/"profit-share" wording in token metadata.
6. Malware/phishing links; external links must be labelled with their domain.
7. Reserved names: "GIWA", "Dojang", "Upbit", "Madang" and variants (namespace confusion, 06 pain #12).

Process: pre-publish checks (perceptual hash list, vision classifier, OCR, name/ticker block list, link scanner) → publish or review queue (target < 30 min, KO/EN reviewers) → post-publish reports → takedown (hidden from feeds and search; chain state untouched; trade path still accessible with a warning, since we cannot and do not censor the chain) → appeal within 7 days → monthly transparency report (counts by reason). Repeat offenders lose tier perks via reputation; we never seize funds.

## 2. Questions for counsel

Korea
- Q1 Does operating a **non-custodial** launchpad frontend that earns protocol fees constitute a VASP activity under the Act on Reporting and Using Specified Financial Transaction Information (FIU registration), given no fiat, no custody, and testnet-only operation initially? What changes at mainnet with real ETH fees?
- Q2 How does the **Virtual Asset User Protection Act (VAUPA)** apply to (a) tokens created by users on our contracts, (b) our role as a venue, (c) the market-manipulation provisions when users trade memecoins? What disclosures/warnings are required?
- Q3 Do **holder fee shares** (30% of fees distributed pro-rata to token holders) risk characterisation as an investment contract/security under the Capital Markets Act? Alternatives if yes: "liquidity rebates", holder rewards in non-financial form, or removing the holder share on mainnet. Same question for soulbound season badges and any future token (08 §1).
- Q4 ICO ban (2017 guidance) and current enforcement practice: does a launchpad that lets *users* create tokens fall within it? Does our launch fee/opening order model matter?
- Q5 Advertising and marketing: rules for KOL disclosure, "graduation" terminology, and prohibition on promising returns; use of exchange names (Upbit) when describing Dojang tiers.
- Q6 **PIPA** (Personal Information Protection Act): we store wallet addresses, optional display names, hashed IPs; reading public EAS attestations about wallets — does any of this constitute personal information processing requiring notices/consents? Cross-border transfer if hosted outside Korea?
- Q7 Terminology: is "vesting"/"lock" or "creator allocation" language problematic? Preferred wording in Korean consumer context.
- Q8 Trademark: clearance for the final product name (08 §5 shortlist) and use of "GIWA" in descriptive text.
- Q9 Game Industry Promotion Act / gambling statutes: could batch windows, season points or squad battles be viewed as gambling or prize competitions (경품) with limits on prizes?
- Q10 Content liability: safe-harbour for user-generated token metadata; takedown obligations; cooperation requests from law enforcement (template page).

Indonesia (team/entity location may be Indonesia)
- Q11 Under **POJK 27/2024** (OJK supervision of crypto assets from Jan 2025) and related regulations, does building/operating this venue require a licence or registration if users include Indonesians? Does testnet-only status matter? Does operating via a foreign entity change the analysis?
- Q12 Tax treatment of protocol fees received in crypto by an Indonesian entity; VAT/income tax on crypto transactions.
- Q13 Entity structuring: where should the operating company and the Safe signers sit; director liability for user content.

General
- Q14 Restricted-jurisdictions list (US persons, sanctioned countries, others) and the standard of geo-blocking + attestation expected; wallet screening provider obligations.
- Q15 Terms of Service, Risk Disclosure, Privacy Policy, Cookie/analytics consent, Bug-bounty safe harbour, Takedown and Law-Enforcement pages — review drafts.
- Q16 Open-source licence for contracts (MIT vs BUSL) and liability disclaimers for third-party keepers/forks.

## 3. Disclaimers / ToS needs
- Risk disclosure before first trade (signed acceptance via wallet, stored hash): memecoins can go to zero; graduation is not an endorsement; windows clear at a price unknown in advance; Season Credit and badges have no monetary value and imply no future token or airdrop.
- Statement that Madang is non-custodial and cannot reverse transactions, freeze tokens, or recover keys.
- Creator terms: responsibility for content, no impersonation, acceptance of vesting and manifest immutability.
- Restricted-jurisdiction notice and screening disclosure; data policy (addresses, hashed IPs, analytics opt-out).
- Transparency commitments: 48 h notice of parameter changes, published methods for scores/points, published audits.

## 4. Risk register

Scale: probability P (1–5), impact I (1–5), score = P×I. Owner roles: PM (product), SC (smart contracts), INF (infra), CM (community), LG (legal).

| # | Risk | P | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R1 | Korean regulator views the venue or holder fee share as securities/VASP activity | 3 | 5 | 15 | counsel Q1–Q4 before mainnet; design option to disable holder share on mainnet via factory version; testnet first | LG/PM |
| R2 | Dojang attester volume too low (few Upbit-attested wallets on Sepolia) → humans-first too restrictive | 3 | 4 | 12 | measure in Phase 0; tier-1 (faucet) as fallback gate; `humansFirst` configurable per season | PM |
| R3 | Sybil farms defeat tier-1 gating and rations at scale | 4 | 3 | 12 | caps, clustering, retro slashing, Upbit tier weighting; publish results | PM/CM |
| R4 | Contract bug in window/curve/pool with funds at risk | 2 | 5 | 10 | tests/invariants, two audit stages + contest, Guardian pause on new activity, small `G` at mainnet start | SC |
| R5 | Low creator interest because windows feel slow vs pump-style instant | 3 | 3 | 9 | E1 experiment (90–180 s), countdown UX, curated prime-time launches | PM/CM |
| R6 | GIWA.MARKETS or another incumbent copies features | 4 | 2 | 8 | identity + season economy + data moat; speed; reputation attestations consumed by other apps | PM |
| R7 | Indexer/RPC outage during a launch wave | 3 | 3 | 9 | failover providers, chain-first trading, status page, 2 indexer instances | INF |
| R8 | Content incident (idol likeness, impersonation) draws takedown or press | 3 | 4 | 12 | pre-publish checks, fast queue, transparency report, counsel Q10 | CM/LG |
| R9 | Keepers unprofitable → windows/graduations delayed | 2 | 3 | 6 | bounties tuned (E8), our redundant bots, SLA monitors | INF |
| R10 | Team bandwidth (1–3 builders) → scope creep | 4 | 3 | 12 | P0 discipline (02-prd), lean-team roadmap (11 §6), P1/P2 deferred | PM |
| R11 | Trademark conflict on the product name | 2 | 3 | 6 | Q8 clearance before public season; placeholder until then | LG |
| R12 | Mainnet timing unknown (GIWA mainnet date) | 3 | 3 | 9 | config-driven migration (12); keep testnet seasons valuable in themselves | PM |
| R13 | Perception that badges imply an airdrop → farming and later backlash | 3 | 3 | 9 | explicit language everywhere, ToS, no "airdrop" word, counsel Q3 | CM/LG |
| R14 | Flashblocks/sequencer behaviour differs from documentation (ordering, preconf reliability) | 3 | 2 | 6 | treat preconfs as UX only; keepers act on confirmed blocks; window price-uniformity removes ordering value | SC/INF |
| R15 | Key compromise (Scorer or Safe signer) | 1 | 4 | 4 | KMS, hardware wallets, timelock, revocation paths, drills | INF |
| R16 | Data-protection complaint (PIPA/GDPR-like) over analytics or hashed IPs | 2 | 3 | 6 | minimal data, consent, retention policy, counsel Q6 | LG |
| R17 | Indonesian licensing requirement blocks ID-market activity | 2 | 3 | 6 | counsel Q11; ID locale after opinion; geo-fence if needed | LG |
| R18 | Fee split (40/30/30) too low for creators vs competitors' 50–70% → creators leave | 2 | 3 | 6 | track creator earnings; timelock can raise creator share for future launches; grants | PM |

Review cadence: monthly in the first six months; any score ≥ 12 requires a named action with a date in `_open-questions.md`.
