// One trade widget before and after graduation `[F15, J4]`. Fees, creator tax, slippage and price impact are visible
// before the review button; the pre-sign summary repeats them before the wallet opens (brief rule 5).
import { useMemo, useState } from 'react'
import { useAccount, usePortfolio, useStatus } from '../../data/hooks'
import type { LaunchDetail, Side } from '../../data/types'
import { useTxRunner, type TxPlan } from '../../flows/tx'
import { formatDuration, formatPct, formatSC, formatTokens } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t } from '../../lib/i18n'
import { minReceived, quote } from '../../lib/market'
import { PARAMS } from '../../lib/params'
import { LinkButton, Button } from '../ui/Button'
import { AmountInput, parseAmount, SlippageControl } from '../ui/AmountInput'
import { Chips, TabPanel, Tabs } from '../ui/Controls'
import { Term } from '../ui/Feedback'
import { openSheet, sessionFlags } from '../../state/stores'
import { useWallet } from '../../wallet/wallet'

const BUY_CHIPS = ['10', '25', '50', 'max'] as const
const SELL_CHIPS = ['25', '50', '75', 'max'] as const

export function TradePanel({ d }: { d: LaunchDetail }) {
  const { state: ws, connected, wrongNetwork } = useWallet()
  const account = useAccount(ws.address)
  const { data: portfolio } = usePortfolio(ws.address)
  const status = useStatus()
  const run = useTxRunner()
  const now = useNow()
  const [side, setSide] = useState<Side>('buy')
  const [raw, setRaw] = useState('')
  const [chip, setChip] = useState<string | null>(null)
  const [slippage, setSlippage] = useState(2)
  const [editSlippage, setEditSlippage] = useState(false)
  const [busy, setBusy] = useState(false)

  const position = portfolio?.positions.find((p) => p.token.address === d.address)
  const held = position?.tokens ?? 0
  const counted = position?.buyerNumber != null
  const amount = parseAmount(raw)
  const q = useMemo(() => quote({ state: d.state, creditQ: d.creditQ, pool: d.pool, creatorTaxPct: d.creatorTaxPct }, side, amount), [d.state, d.creditQ, d.pool, d.creatorTaxPct, side, amount])
  const balance = side === 'buy' ? (account?.sc ?? 0) : held
  const over = connected && amount > balance + 1e-9
  const humansFirstLeft = d.windowEndsAt + PARAMS.humansFirstSec * 1000 - now
  const tier = account?.tier ?? 0

  const blocker =
    side === 'buy' && d.state === 'full'
      ? t('trade.fullBuyDisabled')
      : side === 'buy' && status?.paused
        ? t('trade.pausedBuy')
        : side === 'buy' && connected && humansFirstLeft > 0 && tier === 0
          ? t('errors.tierGate')
          : side === 'sell' && connected && held <= 0
            ? t('trade.noPosition')
            : null

  const pickChip = (value: string) => {
    setChip(value)
    if (side === 'buy') setRaw(value === 'max' ? String(Math.floor((account?.sc ?? 0) * 100) / 100) : value)
    else setRaw(String(Math.floor(held * (value === 'max' ? 1 : Number(value) / 100))))
  }

  const review = async () => {
    if (side === 'buy' && !sessionFlags.fairnessSeen.has(d.address)) {
      const ok = await openSheet('fairness', { detail: d })
      if (!ok) return
      sessionFlags.fairnessSeen.add(d.address)
    }
    const min = minReceived(q, slippage)
    const warnings: string[] = []
    if (q.impactPct > 5) warnings.push(t('presign.warnImpact', { pct: formatPct(q.impactPct) }))
    if (d.creatorTaxPct > 1) warnings.push(t('presign.warnTax', { pct: `${d.creatorTaxPct}%` }))
    if (d.flags.includes('cluster')) warnings.push(t('presign.warnCluster'))
    if (status && status.indexer !== 'ok') warnings.push(t('presign.warnStale'))
    const feeSplit = t('presign.feeSplit', { creator: formatSC(q.fee * 0.4), holders: formatSC(q.fee * 0.3), protocol: formatSC(q.fee * 0.3) })
    const newBuyer = side === 'buy' && !counted && tier > 0 && d.state !== 'graduated'
    const plan: TxPlan = {
      request: { kind: side, token: d.address, amount, minOut: min, slippagePct: slippage },
      tone: side,
      slippagePct: slippage,
      warnings,
      progress: d.state === 'graduated' ? undefined : newBuyer ? t('presign.progressNew', { from: d.people, to: d.people + 1 }) : t('presign.progressSame', { count: d.people }),
      rows:
        side === 'buy'
          ? [
              { label: t('presign.youPay'), value: formatSC(amount - q.refund), strong: true },
              { label: t('presign.youReceive'), value: `${formatTokens(min)} ${d.ticker}`, strong: true },
              { label: t('presign.impact'), value: formatPct(q.impactPct, 2) },
              { label: t('presign.fee'), value: `${formatSC(q.fee)}. ${feeSplit}` },
              { label: t('presign.tax'), value: `${d.creatorTaxPct}%` },
              { label: t('presign.slippage'), value: `${slippage}%` },
              { label: t('presign.gas'), value: t('presign.gasValue') },
            ]
          : [
              { label: t('presign.youSell'), value: `${formatTokens(amount)} ${d.ticker}`, strong: true },
              { label: t('presign.youReceive'), value: formatSC(min), strong: true },
              { label: t('presign.impact'), value: formatPct(q.impactPct, 2) },
              { label: t('presign.fee'), value: `${formatSC(q.fee)}. ${feeSplit}` },
              { label: t('presign.tax'), value: `${d.creatorTaxPct}%` },
              { label: t('presign.slippage'), value: `${slippage}%` },
              { label: t('presign.gas'), value: t('presign.gasValue') },
            ],
      receipt: (r) =>
        side === 'buy'
          ? [t('tx.receiptBuy', { tokens: formatTokens(r.tokens ?? 0), ticker: d.ticker }), r.holderNumber && d.state !== 'graduated' ? t('tx.receiptHolder', { n: r.holderNumber }) : ''].filter(Boolean).join(' ')
          : t('tx.receiptSell', { amount: formatSC(r.amount ?? 0) }),
    }
    setBusy(true)
    const result = await run(plan)
    setBusy(false)
    if (result) {
      setRaw('')
      setChip(null)
    }
  }

  const helper = !connected ? t('trade.connectToTrade') : blocker ?? (amount ? null : t('trade.enterAmount'))
  const chips = side === 'buy' ? BUY_CHIPS : SELL_CHIPS

  return (
    <section className="panel trade-panel" aria-labelledby="trade-title">
      <h2 id="trade-title" className="sr-only">
        {t('trade.title')}
      </h2>
      <Tabs
        label={t('trade.sideLabel')}
        idBase="trade"
        value={side}
        tone
        className="seg"
        onChange={(v) => {
          setSide(v)
          setRaw('')
          setChip(null)
        }}
        items={[
          { value: 'buy', label: t('trade.buy') },
          { value: 'sell', label: t('trade.sell') },
        ]}
      />
      <TabPanel idBase="trade" value={side} className="trade-body">
        {humansFirstLeft > 0 && d.state === 'open' ? (
          <p className="hint">
            <Term k="humansFirst">{t('trade.humansFirst', { time: formatDuration(humansFirstLeft), cap: formatSC(PARAMS.capByTier[Math.max(1, tier) as 1 | 2], { trim: true }) })}</Term>
          </p>
        ) : null}
        <AmountInput
          id="trade-amount"
          label={side === 'buy' ? t('trade.amount') : t('trade.amountSell')}
          value={raw}
          onChange={(v) => {
            setRaw(v)
            setChip(null)
          }}
          unit={side === 'buy' ? 'SC' : d.ticker}
          balance={connected ? t('trade.balance', { amount: side === 'buy' ? formatSC(balance) : `${formatTokens(balance)} ${d.ticker}` }) : undefined}
          error={over ? t('errors.insufficientBalance') : null}
          chips={<Chips label={t('trade.amount')} value={chip} onChange={pickChip} options={chips.map((c) => ({ value: c, label: c === 'max' ? t('trade.max') : side === 'buy' ? c : `${c}%` }))} />}
        />
        <dl className="quote">
          <div>
            <dt>{t('trade.youReceive')}</dt>
            <dd className="num">{amount ? (side === 'buy' ? `${formatTokens(q.output)} ${d.ticker}` : formatSC(q.output)) : '0'}</dd>
          </div>
          <div>
            <dt>
              <Term k="impact">{t('trade.impact')}</Term>
            </dt>
            <dd className="num">{formatPct(q.impactPct, 2)}</dd>
          </div>
          <div>
            <dt>
              <Term k="fee">{t('trade.fee')}</Term>
            </dt>
            <dd className="num">{formatSC(q.fee)}</dd>
          </div>
          <div>
            <dt>
              <Term k="tax">{t('trade.tax')}</Term>
            </dt>
            <dd className="num">{`${d.creatorTaxPct}%`}</dd>
          </div>
          <div>
            <dt>
              <Term k="slippage">{t('trade.slippage')}</Term>
            </dt>
            <dd className="num">
              <button type="button" className="link-btn" aria-expanded={editSlippage} onClick={() => setEditSlippage((o) => !o)}>
                {`${slippage}%`}
                <span className="sr-only">{t('trade.slippageEdit')}</span>
              </button>
            </dd>
          </div>
          <div>
            <dt>{t('trade.minReceived')}</dt>
            <dd className="num">{amount ? (side === 'buy' ? `${formatTokens(minReceived(q, slippage))} ${d.ticker}` : formatSC(minReceived(q, slippage))) : '0'}</dd>
          </div>
        </dl>
        {editSlippage ? <SlippageControl value={slippage} onChange={setSlippage} /> : null}
        {q.refund > 0 ? <p className="hint">{t('trade.refund', { amount: formatSC(q.refund) })}</p> : null}
        {!connected ? (
          <Button block size="lg" onClick={() => openSheet('connect')}>
            {t('wallet.connect')}
          </Button>
        ) : wrongNetwork ? (
          <Button block size="lg" variant="danger" onClick={() => openSheet('network')}>
            {t('wallet.wrongNetwork')}
          </Button>
        ) : (
          <Button block size="lg" variant={side} disabled={!amount || over || Boolean(blocker)} loading={busy} onClick={review} aria-describedby={helper ? 'trade-help' : undefined}>
            {side === 'buy' ? t('trade.reviewBuy') : t('trade.reviewSell')}
          </Button>
        )}
        {helper ? (
          <p id="trade-help" className="field-help">
            {helper}
          </p>
        ) : null}
        {connected && side === 'buy' && blocker === t('errors.tierGate') ? (
          <LinkButton href="/verify" variant="secondary" block>
            {t('verify.gateAction')}
          </LinkButton>
        ) : null}
        {connected && side === 'buy' && !counted && tier > 0 && d.state === 'open' && d.people < PARAMS.peopleNeeded ? <p className="hint">{t('token.youWouldBe', { n: d.people + 1 })}</p> : null}
      </TabPanel>
    </section>
  )
}
