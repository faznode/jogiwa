import { Flag, Share2, ShieldCheck } from 'lucide-react'
import { useId, useState } from 'react'
import { usePortfolio } from '../../data/hooks'
import type { LaunchDetail } from '../../data/types'
import { useTxRunner } from '../../flows/tx'
import { cx } from '../../lib/cx'
import { formatCountdown, formatDuration, formatInt, formatPct, formatPrice, formatSC, formatTokens, shortAddress, shortHash } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t } from '../../lib/i18n'
import { NETWORK, PARAMS } from '../../lib/params'
import { Link } from '../../lib/router'
import { openSheet } from '../../state/stores'
import { useWallet } from '../../wallet/wallet'
import { Button, ExternalLink } from '../ui/Button'
import { Notice, Term, type GlossaryKey } from '../ui/Feedback'
import { Icon } from '../ui/Icon'
import { displayName, plateFor, ScoreBand, StepNumber, TokenImage, TokenName } from './TokenBits'

/** The token's one sign (decision.md): lit yellow during the window, ink while open/full, paper once graduated. */
export function SignHeader({ d }: { d: LaunchDetail }) {
  const now = useNow() || d.createdAt
  const [revealed, setRevealed] = useState(false)
  const plate = plateFor(d.state)
  const name = displayName(d, revealed)
  const counter =
    d.state === 'window'
      ? { value: formatCountdown(d.windowEndsAt - now), label: t('token.counterWindow') }
      : d.state === 'settling'
        ? { value: '00:00', label: t('token.counterSettling') }
        : d.state === 'graduated'
          ? { value: formatInt(d.holders), label: t('token.counterHolders') }
          : { value: `${d.people}/${PARAMS.peopleNeeded}`, label: t('token.counterPeople') }
  const justOpened = d.state === 'window' && now - d.createdAt < 4000
  return (
    <header className={cx('sign-header', `plate-${plate}`, justOpened && 'is-switching-on')}>
      <TokenImage image={d.image} ticker={d.ticker} size={64} blurred={d.moderation === 'review' && !revealed} />
      <div className="sign-titles">
        <TokenName name={name} as="h1" className="sign-name" />
        <p className="sign-meta">
          <span className="num">{d.ticker}</span>
          <span>
            <span className="sign-meta-label">{t('token.creator')} </span>
            <Link href={`/u/${d.creator}`} className="num">
              {shortAddress(d.creator)}
            </Link>
          </span>
          <ScoreBand score={d.creatorScore} />
        </p>
      </div>
      <div className="sign-counter">
        <StepNumber value={counter.value} className="counter-box figure" />
        <span className="counter-label">{counter.label}</span>
        <span className="sr-only">{`${counter.value} ${counter.label}`}</span>
      </div>
      <div className="sign-actions">
        {d.moderation === 'review' ? (
          <button type="button" className="btn btn-plate btn-sm" aria-pressed={revealed} onClick={() => setRevealed((r) => !r)}>
            {t('card.showAnyway')}
          </button>
        ) : null}
        <button type="button" className="btn btn-plate btn-sm" onClick={() => openSheet('share', { detail: d })}>
          <Icon icon={Share2} />
          <span className="btn-label">{t('token.share')}</span>
        </button>
        <button type="button" className="btn btn-plate btn-sm" onClick={() => openSheet('report', { detail: d })}>
          <Icon icon={Flag} />
          <span className="btn-label">{t('token.report')}</span>
        </button>
      </div>
    </header>
  )
}

/** Six facts read from the chain `[F06]`; compact on the token page, full with "what this means" on its own page. */
export function FairnessCard({ d, variant = 'compact' }: { d: LaunchDetail; variant?: 'compact' | 'full' }) {
  const id = useId()
  const rows: { key: string; term: GlossaryKey; label: string; value: string; why: string }[] = [
    { key: 'share', term: 'vesting', label: t('fairness.creatorShare'), value: d.openingOrderPct ? t('fairness.creatorShareValue', { pct: d.openingOrderPct }) : t('fairness.creatorShareNone'), why: t('fairness.whyCreatorShare') },
    { key: 'tax', term: 'tax', label: t('fairness.tax'), value: d.creatorTaxPct ? t('fairness.taxValue', { pct: d.creatorTaxPct }) : t('fairness.taxNone'), why: t('fairness.whyTax') },
    {
      key: 'window',
      term: 'window',
      label: t('fairness.window'),
      value: d.window.clearing ? t('fairness.windowValue', { price: formatPrice(d.window.clearing.price), participants: d.window.clearing.participants }) : t('fairness.windowOpen'),
      why: t('fairness.whyWindow'),
    },
    { key: 'people', term: 'people', label: t('fairness.people'), value: t('fairness.peopleValue', { count: d.people }), why: t('fairness.whyPeople') },
    { key: 'fees', term: 'fee', label: t('fairness.fees'), value: t('fairness.feesValue'), why: t('fairness.whyFees') },
    { key: 'team', term: 'team', label: t('fairness.team'), value: d.teamWallets.length ? t('fairness.teamValue', { count: d.teamWallets.length }) : t('fairness.teamNone'), why: t('fairness.whyTeam') },
  ]
  return (
    <section className={cx('fairness', `fairness-${variant}`)} aria-labelledby={id}>
      <header className="fairness-head">
        <h2 id={id}>
          <Term k="fairness">{t('fairness.title')}</Term>
        </h2>
        {variant === 'full' ? <p className="muted">{t('fairness.lead')}</p> : null}
      </header>
      {!d.manifestOk ? <Notice tone="danger">{t('fairness.mismatch')}</Notice> : null}
      <dl className="fair-rows">
        {rows.map((r) => (
          <div key={r.key} className="fair-row">
            <dt>{r.label}</dt>
            <dd>
              <span>{r.value}</span>
              {variant === 'full' ? (
                <span className="fair-why">
                  <span className="sr-only">{t('fairness.meaning')}: </span>
                  {r.why}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
      <footer className="fair-foot">
        {d.manifestOk ? (
          <span className="fair-verified">
            <Icon icon={ShieldCheck} />
            {t('fairness.verified')}
          </span>
        ) : null}
        <span className="num muted">{t('fairness.manifest', { hash: shortHash(d.manifestHash) })}</span>
        <ExternalLink href={`${NETWORK.explorer}/address/${d.address}`} domain={false}>
          {t('common.explorer')}
        </ExternalLink>
      </footer>
    </section>
  )
}

/** Full state `[F05, F13]`: waiting for people with the real fallback timer, or the permissionless Graduate button with its bounty. */
export function GraduatePanel({ d }: { d: LaunchDetail }) {
  const now = useNow() || d.createdAt
  const run = useTxRunner()
  const [busy, setBusy] = useState(false)
  const fallbackAt = (d.fullSince ?? now) + PARAMS.fallbackSec * 1000
  const ready = d.people >= PARAMS.peopleNeeded || now >= fallbackAt
  const bounty = (PARAMS.creditGoal * PARAMS.keeperBountyBps) / 10_000
  const graduate = async () => {
    setBusy(true)
    await run({
      request: { kind: 'graduate', token: d.address },
      tone: 'primary',
      rows: [
        { label: t('presign.progress'), value: t('presign.progressSame', { count: d.people }), strong: true },
        { label: t('presign.bounty'), value: t('presign.bountyValue', { amount: formatSC(bounty) }) },
        { label: t('presign.gas'), value: t('presign.gasValue') },
      ],
      receipt: (r) => t('tx.receiptGraduate', { name: displayName(d), amount: formatSC(r.amount ?? bounty) }),
    })
    setBusy(false)
  }
  return (
    <section className={cx('panel grad-panel', ready && 'is-ready')} aria-live="polite">
      {ready ? (
        <>
          <p className="grad-title">{t('token.readyNote')}</p>
          <Button variant="sign" block loading={busy} onClick={graduate}>
            {t('token.graduate', { name: displayName(d) })}
          </Button>
          <p className="hint">
            <Term k="keeper">{t('presign.bounty')}</Term>
            {`: ${t('presign.bountyValue', { amount: formatSC(bounty) })}`}
          </p>
        </>
      ) : (
        <>
          <p className="grad-title">{t('token.fullNote')}</p>
          <p className="hint num">{t('token.fallback', { time: formatDuration(fallbackAt - now) })}</p>
        </>
      )}
    </section>
  )
}

/** Graduated state `[F08, F10]`: permanent liquidity proof and this epoch's holder rewards. */
export function GraduatedFacts({ d }: { d: LaunchDetail }) {
  return (
    <section className="panel grad-facts">
      <h2>{t('token.permanentTitle')}</h2>
      <p>{t('token.permanentBody', { pool: `${PARAMS.poolSharePct}%`, credit: formatInt(PARAMS.creditGoal), burned: `${PARAMS.burnedSharePct}%` })}</p>
      <h2>
        <Term k="rewards">{t('token.rewardsTitle')}</Term>
      </h2>
      <p>{t('token.rewardsBody', { amount: formatSC(d.rewardsEpochSC) })}</p>
    </section>
  )
}

/** After settlement the user's allocation waits as a pull claim `[F02]`. */
export function WindowClaim({ d }: { d: LaunchDetail }) {
  const { state: ws } = useWallet()
  const { data } = usePortfolio(ws.address)
  const run = useTxRunner()
  const claim = data?.claims.find((c) => c.kind === 'window' && c.token.address === d.address)
  if (!claim || !d.window.clearing) return null
  return (
    <section className="panel window-claim">
      <p className="grad-title">{t('window.settledTitle')}</p>
      <p className="hint">{t('window.settledBody', { participants: d.window.clearing.participants, price: formatPrice(d.window.clearing.price) })}</p>
      <p>{t('window.yourAllocation', { tokens: formatTokens(claim.amount) })}</p>
      <Button
        variant="sign"
        block
        onClick={() =>
          run({
            request: { kind: 'claimWindow', token: d.address },
            tone: 'primary',
            rows: [
              { label: t('presign.youReceive'), value: `${formatTokens(claim.amount)} ${d.ticker}`, strong: true },
              { label: t('presign.gas'), value: t('presign.gasValue') },
            ],
            receipt: (r) => t('tx.receiptTokens', { tokens: formatTokens(r.tokens ?? claim.amount) }),
          })
        }
      >
        {t('window.claim', { tokens: formatTokens(claim.amount) })}
      </Button>
    </section>
  )
}

export const pctOfGoal = (q: number) => formatPct((q / PARAMS.creditGoal) * 100, 0)
