// Landing (prerendered). Hero: headline + one sentence + one primary action + a text link beside the Level diagram
// (anti-slop charter: no pill, no screenshot). The street of example signs, the three rules as signs, fees in one line,
// Season Credit, and one closing action. Numbers here are rules from the masterplan, never usage metrics.
import { FEATURED } from '../data/mock/catalogue'
import { LevelStage } from '../components/landing/LevelStage'
import { FeeSplitBar } from '../components/layout/Page'
import { LinkButton } from '../components/ui/Button'
import { cx } from '../lib/cx'
import { usePageTitle } from '../lib/hooks'
import { t, type StringKey } from '../lib/i18n'
import { Link } from '../lib/router'

const STREET: { index: number; tone: 'sign' | 'ink' | 'paper'; counter: string; label: StringKey; width: string }[] = [
  { index: 0, tone: 'sign', counter: '2:00', label: 'state.window', width: 'w-100' },
  { index: 1, tone: 'ink', counter: '19/25', label: 'card.people', width: 'w-92' },
  { index: 2, tone: 'ink', counter: '25/25', label: 'card.full', width: 'w-96' },
  { index: 3, tone: 'paper', counter: '212', label: 'card.holders', width: 'w-86' },
  { index: 4, tone: 'ink', counter: '7/25', label: 'card.people', width: 'w-100' },
]

const RULES: { figure: StringKey; title: StringKey; body: StringKey; tone: 'sign' | 'ink' | 'paper' }[] = [
  { figure: 'landing.rule1Figure', title: 'landing.rule1Title', body: 'landing.rule1Body', tone: 'sign' },
  { figure: 'landing.rule2Figure', title: 'landing.rule2Title', body: 'landing.rule2Body', tone: 'ink' },
  { figure: 'landing.rule3Figure', title: 'landing.rule3Title', body: 'landing.rule3Body', tone: 'paper' },
]

export default function Landing() {
  usePageTitle('')
  return (
    <div className="landing">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title display">
            {t('landing.title')}
          </h1>
          <p className="hero-lede">{t('landing.lede')}</p>
          <div className="hero-actions">
            <LinkButton href="/discover" size="lg">
              {t('landing.primary')}
            </LinkButton>
            <Link href="/learn/window" className="text-link">
              {t('landing.secondary')}
            </Link>
          </div>
        </div>
        <LevelStage />
      </section>

      <section className="street container" aria-labelledby="street-title">
        <div className="street-copy">
          <h2 id="street-title" className="section-title display">
            {t('landing.streetTitle')}
          </h2>
          <p className="section-lead">{t('landing.streetLead')}</p>
          <Link href="/discover" className="text-link">
            {t('landing.streetMore')}
          </Link>
        </div>
        <figure className="facade" aria-labelledby="street-note">
          <ol className="signs" role="list">
            {STREET.map((s) => {
              const launch = FEATURED[s.index]
              return (
                <li key={launch.ticker} className={s.width}>
                  <Link href={`/t/${launch.ticker.toLowerCase()}`} className={cx('sign', `plate-${s.tone}`)}>
                    <span className="sign-word display">{launch.name}</span>
                    <span className="sign-count">
                      <span className="counter-box figure">{s.counter}</span>
                      <span className="counter-label">{t(s.label).toLowerCase()}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
          <figcaption id="street-note" className="facade-note">
            {t('landing.streetNote')}
          </figcaption>
        </figure>
      </section>

      <section className="rules container" aria-labelledby="rules-title">
        <h2 id="rules-title" className="section-title display">
          {t('landing.rulesTitle')}
        </h2>
        <ol className="rule-signs" role="list">
          {RULES.map((r) => (
            <li key={r.figure} className={cx('rule-sign', `plate-${r.tone}`)}>
              <span className="rule-figure display">{t(r.figure)}</span>
              <span className="rule-text">
                <strong>{t(r.title)}</strong>
                <span>{t(r.body)}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="money container" aria-labelledby="fees-title">
        <div className="money-block">
          <h2 id="fees-title" className="block-title">
            {t('landing.feesTitle')}
          </h2>
          <p>{t('landing.feesBody')}</p>
          <FeeSplitBar />
          <Link href="/fees" className="text-link">
            {t('landing.feesLink')}
          </Link>
        </div>
        <div className="money-block">
          <h2 className="block-title">{t('landing.creditTitle')}</h2>
          <p>{t('landing.creditBody')}</p>
          <Link href="/learn/season-credit" className="text-link">
            {t('landing.creditLink')}
          </Link>
        </div>
      </section>

      <section className="closing container" aria-labelledby="close-title">
        <h2 id="close-title" className="section-title display">
          {t('landing.closeTitle')}
        </h2>
        <p className="section-lead">{t('landing.closeBody')}</p>
        <LinkButton href="/verify" size="lg" variant="sign">
          {t('landing.closeAction')}
        </LinkButton>
      </section>
    </div>
  )
}
