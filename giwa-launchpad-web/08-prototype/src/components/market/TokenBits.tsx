import type { CSSProperties } from 'react'
import type { LaunchSummary, TokenState } from '../../data/types'
import { cx } from '../../lib/cx'
import { formatCountdown, formatInt } from '../../lib/format'
import { t, type StringKey } from '../../lib/i18n'
import { PARAMS } from '../../lib/params'
import { nameSize, sanitizeDisplayText } from '../../lib/text'
import { Term } from '../ui/Feedback'
import { PeopleGlyph, PlateGlyph, WindowGlyph } from '../ui/Icon'

export type PlateTone = 'sign' | 'ink' | 'paper'

/** Plate by state (graphic-language): Window is the only lit sign; Open/Full are ink; Graduated keeps a paper sign. */
export const plateFor = (state: TokenState): PlateTone => (state === 'window' || state === 'settling' ? 'sign' : state === 'graduated' ? 'paper' : 'ink')

export type Band = 'new' | 'building' | 'trusted' | 'elite' | 'unscored'
/** Score bands from the reputation spec (New / Building / Trusted / Elite); thresholds assumed, Q26. */
export const bandOf = (score: number | null): Band => (score === null ? 'unscored' : score < 40 ? 'new' : score < 60 ? 'building' : score < 80 ? 'trusted' : 'elite')

export function ScoreBand({ score }: { score: number | null }) {
  const band = bandOf(score)
  return (
    <span className={cx('score-band', `score-${band}`)} title={score === null ? undefined : t('score.raw', { score })}>
      <span className="sr-only">{t('score.label')}: </span>
      {t(`score.${band}` as StringKey)}
    </span>
  )
}

/** Name as text only: bidi stripped, hidden characters shown; flagged names fall back to the ticker until revealed. */
export function displayName(token: Pick<LaunchSummary, 'name' | 'ticker' | 'moderation'>, revealed = false) {
  return token.moderation === 'review' && !revealed ? token.ticker : sanitizeDisplayText(token.name)
}

export function TokenName({ name, as: Tag = 'span', className }: { name: string; as?: 'span' | 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <Tag className={cx('token-name display', `name-${nameSize(name)}`, className)} title={name}>
      {name}
    </Tag>
  )
}

export function TokenImage({ image, ticker, size = 48, blurred }: { image: string | null; ticker: string; size?: 32 | 48 | 64 | 96; blurred?: boolean }) {
  if (!image)
    return (
      <span className={cx('token-img token-mono', `token-img-${size}`)} aria-hidden="true">
        {ticker.slice(0, 2)}
      </span>
    )
  return (
    <span className={cx('token-img', `token-img-${size}`, blurred && 'is-blurred')}>
      <img src={image} alt="" width={size} height={size} loading="lazy" decoding="async" />
    </span>
  )
}

export function StateChip({ state, windowEndsAt, people, now }: { state: TokenState; windowEndsAt: number; people: number; now: number }) {
  const extra = state === 'window' ? formatCountdown(windowEndsAt - now) : state === 'full' ? `${people}/${PARAMS.peopleNeeded}` : null
  return (
    <span className={cx('state-chip', `state-${state}`)}>
      {state === 'window' || state === 'settling' ? <WindowGlyph /> : state === 'graduated' ? <PlateGlyph /> : <PeopleGlyph />}
      <span>{t(`state.${state}` as StringKey)}</span>
      {extra ? <span className="num">{extra}</span> : null}
    </span>
  )
}

const ratio = (v: number) => ({ '--v': Math.max(0, Math.min(1, v)).toFixed(4) }) as CSSProperties

export function MiniMeter({ creditQ, people }: { creditQ: number; people: number }) {
  return (
    <div className="mini-meter" aria-hidden="true">
      <span className="mini-track">
        <span className="mini-fill" style={ratio(creditQ / PARAMS.creditGoal)} />
      </span>
      <span className="mini-track mini-people">
        <span className="mini-fill" style={ratio(people / PARAMS.peopleNeeded)} />
      </span>
    </div>
  )
}

/** The masterplan's dual-track ring, drawn as two bars on the shop floor: credit (ink) and people (yellow, ink outline). */
export function TwoTrackMeter({ creditQ, people }: { creditQ: number; people: number }) {
  const creditPct = Math.min(100, (creditQ / PARAMS.creditGoal) * 100)
  return (
    <div className="meter" role="group" aria-label={t('token.meterA11y', { credit: Math.floor(creditPct), people: Math.min(people, PARAMS.peopleNeeded) })}>
      <div className="track">
        <div className="track-top">
          <Term k="curve">{t('token.credit')}</Term>
          <span className="num">{t('token.creditValue', { value: formatInt(Math.min(creditQ, PARAMS.creditGoal)), goal: formatInt(PARAMS.creditGoal) })}</span>
        </div>
        <span className="bar" aria-hidden="true">
          <span className="bar-fill" style={ratio(creditQ / PARAMS.creditGoal)} />
        </span>
      </div>
      <div className="track track-people">
        <div className="track-top">
          <Term k="people">{t('token.people')}</Term>
          <span className="num">{t('token.peopleValue', { value: people, goal: PARAMS.peopleNeeded })}</span>
        </div>
        <span className="bar" aria-hidden="true">
          <span className="bar-fill" style={ratio(people / PARAMS.peopleNeeded)} />
        </span>
      </div>
    </div>
  )
}

/** A count may step (it is people, not price); remounting on change runs the 120 ms step-in once. */
export function StepNumber({ value, className }: { value: string | number; className?: string }) {
  return (
    <span className={cx('step', className)} aria-hidden="true">
      <span key={String(value)} className="step-in">
        {value}
      </span>
    </span>
  )
}
