# 01 — Executive Summary / Ringkasan Eksekutif

Working name: **Madang** (마당, "the courtyard where the village gathers") — placeholder, see 08-ideation §5. Target: GIWA Sepolia testnet now, GIWA mainnet when live. Date: 2026-10-24.

---

## English

### What we learned from Pons (the evidence)

Pons Family is the dominant launchpad on Robinhood Chain. We verified its source, replayed its math on a live fork, captured its web app, and scanned every launch it ever produced (01–05 reports):

- Scale without substance: **709,489 V2 launches by 419,622 creators in 81 days, 10,427 graduations (1.47%)**; launches fell from 36,449/day at peak to ~1,500/day (−95%) [ONCHAIN, 05 §1].
- Graduation is a bot event: median time-to-graduation **250 seconds**, 31% under 60 s, and **100% of sampled graduations had the first buy inside the launch transaction** [ONCHAIN, 05 §3].
- Volume is churn: the median non-graduated curve collects 0.054 ETH from 3.5 traders, **96% of it is sold back**, and the curve is dead in ~4 minutes; 48% of deployers sell on their own curve [ONCHAIN, 05 §5].
- The mechanics that mattered: a clean constant-product curve with a virtual reserve, price continuity into the pool, one-transaction launches, 70% creator fee share, fast chain UX [SOURCE/ONCHAIN, 02, 05 §8]. The mechanics that failed: a snipe tax with invisible exemptions, volume-ranked discovery, hot-key keepers, a 2-of-3 Safe without timelock, an indexer that was mistaken for the chain during an incident [02, 03 §6, 04].

### What GIWA changes

GIWA Sepolia is an OP Stack chain (op-reth, 1-s blocks, 200 ms Flashblocks, free gas) with something no other launchpad chain has: **Dojang**, an EAS-based attestation layer where Upbit and the GIWA faucet attest wallets, plus UP ID names [ONCHAIN/DOCS, 07 §1–2]. It has no canonical DEX, no stablecoin, and an audience that is Korean, CEX-centric and community-driven. Its testnet is quest-farmed (158M addresses), so sybil resistance is the central design constraint [07 §3–6]. A pump-style incumbent (GIWA.MARKETS) already exists; we are not first, so we must be different [06 §1].

### The product

Madang is the launchpad where **graduation is a community event, not a bot event**:

1. **Opening Batch Window** — every launch opens with a 120-second window where all buys clear at one price, pro-rata, with per-wallet caps. No first-second sniping, no snipe tax, no exemptions.
2. **Humans-First Window** — during the window and the first 10 minutes, only Dojang-attested wallets may buy. Upbit-attested humans get the front of the line.
3. **People-Threshold Graduation** — a token graduates when it has enough credit **and at least 25 distinct attested buyers** (24-hour fallback). A whale cannot graduate a token alone.
4. **Fairness Card** — every enforced parameter is hashed on-chain at launch and shown before the first buy. Nothing hidden.
5. **Creator vesting by default** — the creator's allocation cliffs at graduation and streams over 30 days.
6. **Holder-paid permanent liquidity** — graduation seeds our own locked pool; its 1% fee is split **40% creator / 30% holders / 30% protocol**, claimable with no keeper dependency.
7. **Reputation, squads and a season economy** — Dojang-backed creator scores, squads with treasuries, and a testnet where the only quote asset is a rationed, soulbound Season Credit, with quality-only points and retroactive sybil slashing.

All of it is Korean-first (KO default, EN, later ID), mobile-first, and built on immutable contracts behind a 48-hour timelock with in-app notices.

### Why this wins

Pons' own data shows that the launch-count game produces 1.47% graduations and empty curves. Nobody else on GIWA can gate by humanity at the contract level, and nobody on any chain makes graduation a people threshold. Our north-star metric — **distinct attested humans per graduated token** — is one Pons cannot compete on.

### Plan and ask

26-week roadmap: foundations (wk 1–3) → testnet alpha (wk 4–7) → closed beta / Season 0 (wk 8–11) → public Seasons 1–2 (wk 12–19) → audit and contest (wk 16–22) → mainnet-ready (wk 23–26). Lean variant for 1–3 builders in 11-roadmap §6. No platform token at launch (08-tokenomics). Five decisions are needed from you now (13-decision-log §3): product name, embedded-wallet/KakaoTalk login provider, legal counsel engagement in Korea (and Indonesia), audit budget tier, and whether Season 0 is invite-only — plus approval of ADR-16 (time-weighted holder rewards). The review of Honeypot Finance's Pot2Pump you asked for is in 15-honeypot-pot2pump-review: adopt a graduation-adapter seam and an optional raise-or-refund launch mode; reject the participant-LP vault, per-transaction rewards and "up-only" token mechanics; no partnership.

---

## Bahasa Indonesia

### Apa yang kami pelajari dari Pons (buktinya)

Pons Family adalah launchpad dominan di Robinhood Chain. Kami memverifikasi kode sumbernya, mereplikasi perhitungannya di fork jaringan langsung, merekam aplikasi webnya, dan memindai seluruh peluncuran yang pernah dibuatnya (laporan 01–05):

- Skala tanpa substansi: **709.489 peluncuran V2 oleh 419.622 kreator dalam 81 hari, 10.427 graduasi (1,47%)**; jumlah peluncuran turun dari puncak 36.449/hari menjadi ~1.500/hari (−95%) [ONCHAIN, 05 §1].
- Graduasi adalah peristiwa bot: median waktu menuju graduasi **250 detik**, 31% di bawah 60 detik, dan **100% graduasi dalam sampel memiliki pembelian pertama di dalam transaksi peluncuran itu sendiri** [ONCHAIN, 05 §3].
- Volume hanyalah perputaran semu: kurva median yang tidak graduasi mengumpulkan 0,054 ETH dari 3,5 pedagang, **96% di antaranya dijual kembali**, dan kurva mati dalam ~4 menit; 48% deployer menjual di kurvanya sendiri [ONCHAIN, 05 §5].
- Mekanisme yang berhasil: kurva constant-product dengan cadangan virtual, kontinuitas harga ke pool, peluncuran satu transaksi, bagi hasil biaya 70% untuk kreator, UX rantai yang cepat [SOURCE/ONCHAIN, 02, 05 §8]. Mekanisme yang gagal: pajak sniper dengan pengecualian tersembunyi, peringkat berdasarkan volume, keeper berkunci panas, Safe 2-dari-3 tanpa timelock, dan indexer yang dikira sebagai rantai saat insiden [02, 03 §6, 04].

### Apa yang berbeda di GIWA

GIWA Sepolia adalah rantai OP Stack (op-reth, blok 1 detik, Flashblocks 200 ms, gas gratis) dengan sesuatu yang tidak dimiliki rantai launchpad lain: **Dojang**, lapisan atestasi berbasis EAS di mana Upbit dan faucet GIWA mengatestasi dompet, ditambah nama UP ID [ONCHAIN/DOCS, 07 §1–2]. GIWA belum memiliki DEX kanonik maupun stablecoin, dan audiensnya adalah pengguna Korea yang terbiasa dengan bursa terpusat dan berbasis komunitas. Testnet-nya dipenuhi quest farming (158 juta alamat), sehingga ketahanan terhadap sybil menjadi batasan desain utama [07 §3–6]. Pesaing bergaya pump (GIWA.MARKETS) sudah ada; kami bukan yang pertama, jadi kami harus berbeda [06 §1].

### Produknya

Madang adalah launchpad di mana **graduasi adalah peristiwa komunitas, bukan peristiwa bot**:

1. **Jendela Pembukaan Batch** — setiap peluncuran dibuka dengan jendela 120 detik di mana semua pembelian diselesaikan pada satu harga, pro-rata, dengan batas per dompet. Tanpa sniping di detik pertama, tanpa pajak sniper, tanpa pengecualian.
2. **Jendela Manusia-Dulu** — selama jendela dan 10 menit pertama, hanya dompet yang teratestasi Dojang yang dapat membeli. Manusia yang diverifikasi Upbit berada di barisan depan.
3. **Graduasi Berbasis Jumlah Orang** — token graduasi ketika memiliki cukup kredit **dan minimal 25 pembeli teratestasi yang berbeda** (fallback 24 jam). Satu whale tidak bisa menggraduasi token sendirian.
4. **Kartu Keadilan (Fairness Card)** — setiap parameter yang ditegakkan kontrak di-hash on-chain saat peluncuran dan ditampilkan sebelum pembelian pertama. Tidak ada yang disembunyikan.
5. **Vesting kreator secara bawaan** — alokasi kreator terkunci hingga graduasi lalu dilepas bertahap selama 30 hari.
6. **Likuiditas permanen yang membayar pemegang** — graduasi mengisi pool terkunci milik kami sendiri; biaya 1%-nya dibagi **40% kreator / 30% pemegang / 30% protokol**, dapat diklaim tanpa ketergantungan pada keeper.
7. **Reputasi, squad, dan ekonomi musim** — skor kreator berbasis Dojang, squad dengan kas bersama, dan testnet yang satu-satunya aset kuotasinya adalah Season Credit yang dijatah dan tidak dapat dipindahtangankan, dengan poin berbasis kualitas dan pemotongan retroaktif untuk sybil.

Semuanya mengutamakan bahasa Korea (KO bawaan, EN, kemudian ID), mobile-first, dan dibangun di atas kontrak yang tidak dapat diubah di balik timelock 48 jam dengan pemberitahuan di dalam aplikasi.

### Mengapa ini menang

Data Pons sendiri menunjukkan bahwa permainan jumlah peluncuran menghasilkan 1,47% graduasi dan kurva kosong. Tidak ada pihak lain di GIWA yang dapat menyaring berdasarkan "kemanusiaan" di tingkat kontrak, dan tidak ada launchpad di rantai mana pun yang menjadikan graduasi sebagai ambang jumlah orang. Metrik utama kami — **jumlah manusia teratestasi yang berbeda per token yang graduasi** — adalah metrik yang tidak bisa disaingi Pons.

### Rencana dan permintaan keputusan

Peta jalan 26 minggu: fondasi (mg 1–3) → alpha testnet (mg 4–7) → beta tertutup / Musim 0 (mg 8–11) → Musim publik 1–2 (mg 12–19) → audit dan kontes (mg 16–22) → siap mainnet (mg 23–26). Varian tim ramping untuk 1–3 builder ada di 11-roadmap §6. Tidak ada token platform saat peluncuran (08-tokenomics). Lima keputusan dibutuhkan dari Anda sekarang (13-decision-log §3): nama produk, penyedia dompet tertanam/login KakaoTalk, penunjukan penasihat hukum di Korea (dan Indonesia), tingkat anggaran audit, dan apakah Musim 0 hanya dengan undangan — ditambah persetujuan ADR-16 (imbalan pemegang berbasis rata-rata tertimbang waktu). Tinjauan Pot2Pump dari Honeypot Finance yang Anda minta ada di 15-honeypot-pot2pump-review: adopsi antarmuka adapter graduasi dan mode penggalangan-atau-refund opsional; tolak mekanisme vault LP peserta, imbalan per transaksi, dan token "up-only"; tanpa kemitraan.
