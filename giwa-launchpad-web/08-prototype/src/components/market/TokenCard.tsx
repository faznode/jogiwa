// The token card, the unit users see most (graphic-language.md): a sign plate on top, the shop floor below.
// The lit counter is people (or the real window clock), never price or volume `[06 §2.1]`.
import { memo, useState } from 'react'
import { useLiveSummary } from '../../data/hooks'
import type { LaunchSummary } from '../../data/types'
import { cx } from '../../lib/cx'
import { formatAge, formatCountdown, shortAddress } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t, type StringKey } from '../../lib/i18n'
import { PARAMS } from '../../lib/params'
import { Link } from '../../lib/router'
import { hasHiddenCharacters } from '../../lib/text'
import { Badge } from '../ui/Feedback'
import { displayName, MiniMeter, plateFor, ScoreBand, StateChip, StepNumber, TokenImage, TokenName } from './TokenBits'

function counterFor(s: LaunchSummary, now: number): { value: string; label: string; detail: string } {
  if (s.state === 'window') return { value: formatCountdown(s.windowEndsAt - now), label: t('card.left'), detail: `${formatCountdown(s.windowEndsAt - now)} ${t('card.left')}` }
  if (s.state === 'settling') return { value: '00:00', label: t('card.settling'), detail: t('card.settling') }
  if (s.state === 'graduated') return { value: String(s.holders), label: t('card.holders'), detail: `${s.holders} ${t('card.holders')}` }
  const value = `${Math.min(s.people, 99)}/${PARAMS.peopleNeeded}`
  return { value, label: s.state === 'full' ? t('card.full') : t('card.people'), detail: `${s.people} of ${PARAMS.peopleNeeded} ${t('card.people')}` }
}

export const TokenCard = memo(function TokenCard({ initial }: { initial: LaunchSummary }) {
  const s = useLiveSummary(initial)
  const now = useNow() || s.createdAt
  const [revealed, setRevealed] = useState(false)
  const plate = plateFor(s.state)
  const name = displayName(s, revealed)
  const counter = counterFor(s, now)
  const blurred = s.moderation === 'review' && !revealed
  return (
    <article className={cx('tcard', `tcard-${plate}`)}>
      <Link
        href={`/t/${s.address}`}
        className="tcard-link"
        aria-label={t('card.a11y', { name, ticker: s.ticker, state: t(`state.${s.state}` as StringKey), detail: counter.detail })}
      >
        <div className={cx('tcard-plate', `plate-${plate}`)}>
          <TokenImage image={s.image} ticker={s.ticker} size={48} blurred={blurred} />
          <div className="tcard-titles">
            <TokenName name={name} />
            <span className="tcard-ticker num">{s.ticker}</span>
          </div>
          <div className="tcard-counter">
            <StepNumber value={counter.value} className="counter-box figure" />
            <span className="counter-label">{counter.label}</span>
          </div>
        </div>
        <div className="tcard-floor">
          <div className="tcard-row">
            <span className="tcard-creator num">{t('card.by', { creator: shortAddress(s.creator) })}</span>
            <ScoreBand score={s.creatorScore} />
            <StateChip state={s.state} windowEndsAt={s.windowEndsAt} people={s.people} now={now} />
          </div>
          <MiniMeter creditQ={s.creditQ} people={s.state === 'window' ? 0 : s.people} />
          <div className="tcard-row tcard-facts">
            <span>{s.state === 'window' || s.state === 'settling' ? `${s.participants} ${t('window.participants').toLowerCase()}` : t('card.stillHolding', { pct: `${s.stillHoldingPct}%` })}</span>
            <span className="num">{t('card.old', { age: formatAge(now - s.createdAt) })}</span>
          </div>
          {s.flags.length || hasHiddenCharacters(s.name) ? (
            <div className="tcard-flags">
              {s.flags.includes('churn') ? <Badge tone="warn">{t('card.churn')}</Badge> : null}
              {s.flags.includes('cluster') ? <Badge tone="cluster">{t('card.clusterFlag')}</Badge> : null}
              {hasHiddenCharacters(s.name) ? <Badge tone="warn">{t('card.hiddenChars')}</Badge> : null}
            </div>
          ) : null}
        </div>
      </Link>
      {s.moderation === 'review' ? (
        <div className="tcard-review">
          <span>{t('card.hidden')}</span>
          <button type="button" className="btn btn-quiet btn-sm" aria-pressed={revealed} onClick={() => setRevealed((r) => !r)}>
            {t('card.showAnyway')}
          </button>
        </div>
      ) : null}
    </article>
  )
})
