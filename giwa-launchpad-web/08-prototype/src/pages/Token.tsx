// Token page `[F15]`: Window → Open → Full → Graduated. One sign (the header), the shop floor below: two-track meter,
// chart, tabs, and the state panel on the right (or in a bottom sheet on narrow screens). Trading never depends on lists.
import { useEffect, useRef, useState } from 'react'
import { useLaunch, useStatus } from '../data/hooks'
import type { LaunchDetail } from '../data/types'
import { PriceChart } from '../components/market/PriceChart'
import { Quilt, type QuiltItem } from '../components/market/Quilt'
import { HoldersTable, TradesFeed } from '../components/market/Tables'
import { displayName, TwoTrackMeter } from '../components/market/TokenBits'
import { FairnessCard, GraduatedFacts, GraduatePanel, SignHeader, WindowClaim } from '../components/market/TokenParts'
import { TradePanel } from '../components/market/TradePanel'
import { WindowPanel } from '../components/market/WindowPanel'
import { Page } from '../components/layout/Page'
import { Button, ExternalLink, LinkButton } from '../components/ui/Button'
import { Tabs, TabPanel } from '../components/ui/Controls'
import { Change, EmptyState, ErrorState, Notice, Skeleton } from '../components/ui/Feedback'
import { Sheet } from '../components/ui/Sheet'
import { track } from '../lib/analytics'
import { formatAge, formatPrice, formatSC } from '../lib/format'
import { useMediaQuery, useNow, usePageTitle } from '../lib/hooks'
import { t } from '../lib/i18n'
import { NETWORK } from '../lib/params'
import { Link, useParams, useSearch } from '../lib/router'
import { hasHiddenCharacters, sanitizeDisplayText } from '../lib/text'
import { openSheet, sessionFlags } from '../state/stores'

type TabKey = 'trades' | 'holders' | 'fairness' | 'about'

export default function TokenPage() {
  const { token = '' } = useParams<{ token: string }>()
  const { detail: d, missing, error, retry } = useLaunch(token)
  const status = useStatus()
  const search = useSearch()
  const wide = useMediaQuery('(min-width: 50rem)', true)
  const [tab, setTab] = useState<TabKey>('trades')
  const [tradeOpen, setTradeOpen] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const prevState = useRef<string | undefined>(undefined)
  usePageTitle(d ? `${displayName(d)} (${d.ticker})` : '')

  const isWindow = d?.state === 'window' || d?.state === 'settling'
  useEffect(() => {
    if (d && d.state === 'window') track('window_viewed')
  }, [d?.address, d?.state]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!d) return
    if (prevState.current && prevState.current !== 'graduated' && d.state === 'graduated' && !sessionFlags.celebrated.has(d.address)) {
      sessionFlags.celebrated.add(d.address)
      setCelebrate(true)
    }
    prevState.current = d.state
  }, [d])

  const launchedShare = useRef(false)
  useEffect(() => {
    if (d && !launchedShare.current && new URLSearchParams(search).has('launched')) {
      launchedShare.current = true
      openSheet('share', { detail: d })
    }
  }, [d, search])

  if (error)
    return (
      <Page>
        <ErrorState error={error} onRetry={retry} />
      </Page>
    )
  if (missing)
    return (
      <Page narrow>
        <EmptyState
          message={
            <>
              <strong>{t('token.notFound')}</strong> {t('token.notFoundBody')}
            </>
          }
          action={<LinkButton href="/discover">{t('notFound.discover')}</LinkButton>}
        />
      </Page>
    )
  if (!d) return <TokenSkeleton />

  const stale = status ? status.indexer !== 'ok' : false
  const panel = isWindow ? <WindowPanel d={d} /> : <TradePanel d={d} />
  const side = (
    <>
      {!isWindow ? <WindowClaim d={d} /> : null}
      {d.state === 'full' ? <GraduatePanel d={d} /> : null}
      {panel}
      {d.state === 'graduated' ? <GraduatedFacts d={d} /> : null}
      <FairnessCard d={d} />
    </>
  )

  return (
    <div className="token-page" data-density="compact">
      <div className="container">
        {d.moderation === 'hidden' ? <Notice tone="warn">{t('token.hiddenWarning')}</Notice> : null}
        {hasHiddenCharacters(d.name) ? <Notice tone="warn">{t('token.hiddenCharsWarning')}</Notice> : null}
        <SignHeader d={d} />
        <div className="token-grid">
          <div className="token-main">
            {isWindow ? <WindowQuilt d={d} /> : <TwoTrackMeter creditQ={d.creditQ} people={d.people} />}
            <div className="price-row">
              <span className="price-label">{isWindow ? t('window.estimate') : t('token.price')}</span>
              <span className="price figure num">{`${formatPrice(d.price)} SC`}</span>
              {isWindow ? null : (
                <>
                  <Change pct={d.changePct} />
                  <span className="muted">{t('token.sinceWindow')}</span>
                </>
              )}
            </div>
            <PriceChart points={d.chart} windowStart={d.createdAt} windowEnd={d.windowEndsAt} name={displayName(d)} stale={stale} />
            <Tabs
              label={t('token.tabsLabel')}
              idBase="token"
              value={tab}
              onChange={setTab}
              items={[
                { value: 'trades', label: t('token.tabs.trades') },
                { value: 'holders', label: t('token.tabs.holders') },
                { value: 'fairness', label: t('token.tabs.fairness') },
                { value: 'about', label: t('token.tabs.about') },
              ]}
            />
            <TabPanel idBase="token" value={tab} className="token-tab">
              {tab === 'trades' ? <TradesFeed trades={d.trades} ticker={d.ticker} /> : null}
              {tab === 'holders' ? <HoldersTab d={d} /> : null}
              {tab === 'fairness' ? (
                <>
                  <FairnessCard d={d} variant="full" />
                  <Link href={`/t/${d.address}/fairness`} className="text-link">
                    {t('token.fairnessAll')}
                  </Link>
                </>
              ) : null}
              {tab === 'about' ? <About d={d} /> : null}
            </TabPanel>
          </div>
          {wide ? (
            <aside className="token-side" aria-label={t('trade.title')}>
              {side}
            </aside>
          ) : null}
        </div>
      </div>

      {!wide ? (
        <div className="trade-bar">
          <span className="num">
            <span className="trade-bar-price figure">{formatPrice(d.price)}</span> SC
          </span>
          <Button variant={isWindow ? 'sign' : 'buy'} onClick={() => setTradeOpen(true)}>
            {isWindow ? t('token.mobileJoin') : t('token.mobileTrade')}
          </Button>
        </div>
      ) : null}
      {!wide && tradeOpen ? (
        <Sheet title={displayName(d)} onClose={() => setTradeOpen(false)} className="sheet-trade">
          <div className="token-side">{side}</div>
        </Sheet>
      ) : null}
      {celebrate ? <Celebration d={d} onClose={() => setCelebrate(false)} /> : null}
    </div>
  )
}

function WindowQuilt({ d }: { d: LaunchDetail }) {
  const items: QuiltItem[] = d.window.entries.map((e) => ({ id: e.owner, value: e.amount, kind: e.label === 'you' ? 'you' : e.label === 'team' ? 'team' : 'normal' }))
  return (
    <section className="quilt-block" aria-labelledby="quilt-title">
      <div className="section-head">
        <h2 id="quilt-title">{t('window.quiltTitle')}</h2>
      </div>
      {items.length ? <Quilt items={items} label={t('window.quiltA11y', { count: items.length, total: formatSC(d.window.total) })} /> : <EmptyState message={t('empty.holders')} />}
      <p className="hint">{t('window.quiltHelp')}</p>
    </section>
  )
}

function HoldersTab({ d }: { d: LaunchDetail }) {
  const items: QuiltItem[] = d.holdersTop.map((h) => ({ id: h.wallet, value: h.tokens, kind: h.label === 'you' ? 'you' : h.label === 'team' ? 'team' : h.label === 'cluster' ? 'cluster' : 'normal' }))
  return (
    <>
      {items.length ? <Quilt items={items} label={`${d.holders} ${t('token.counterHolders')}`} /> : null}
      <HoldersTable holders={d.holdersTop} ticker={d.ticker} />
      <Link href={`/t/${d.address}/holders`} className="text-link">
        {t('token.holdersAll')}
      </Link>
    </>
  )
}

function About({ d }: { d: LaunchDetail }) {
  const now = useNow() || d.createdAt
  return (
    <div className="about">
      <p className="about-desc">{sanitizeDisplayText(d.description)}</p>
      {d.links.length ? (
        <>
          <h3>{t('token.links')}</h3>
          <ul role="list" className="menu-list">
            {d.links.map((href) => (
              <li key={href}>
                <ExternalLink href={href}>{href.replace(/^https:\/\//, '')}</ExternalLink>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <dl className="facts">
        <div>
          <dt>{t('token.address')}</dt>
          <dd className="num break">{d.address}</dd>
        </div>
        <div>
          <dt>{t('token.manifest')}</dt>
          <dd className="num break">{d.manifestHash}</dd>
        </div>
        <div>
          <dt>{t('token.creator')}</dt>
          <dd>
            <Link href={`/u/${d.creator}`} className="num">
              {d.creator}
            </Link>
          </dd>
        </div>
        <div>
          <dt>{t('token.launched', { age: formatAge(now - d.createdAt) })}</dt>
          <dd>
            <ExternalLink href={`${NETWORK.explorer}/address/${d.address}`} domain={false}>
              {t('common.explorer')}
            </ExternalLink>
          </dd>
        </div>
      </dl>
    </div>
  )
}

function Celebration({ d, onClose }: { d: LaunchDetail; onClose: () => void }) {
  return (
    <Sheet title={t('token.celebrateTitle', { name: displayName(d) })} onClose={onClose} size="sm" className="sheet-celebrate">
      <div className="celebrate-sign plate-paper">
        <span className="display">{displayName(d)}</span>
        <span className="celebrate-strip">{t('state.graduated')}</span>
      </div>
      <p>{t('token.celebrateBody', { people: d.people })}</p>
      <div className="foot-row">
        <Button variant="secondary" onClick={() => openSheet('share', { detail: d })}>
          {t('token.share')}
        </Button>
        <Button onClick={onClose}>{t('token.celebrateClose')}</Button>
      </div>
    </Sheet>
  )
}

function TokenSkeleton() {
  return (
    <div className="token-page container" role="status" aria-label={t('a11y.loading')}>
      <Skeleton className="skel-sign" />
      <div className="token-grid">
        <div className="token-main">
          <Skeleton className="skel-row" />
          <Skeleton className="skel-chart" />
          <Skeleton className="skel-block" />
        </div>
        <div className="token-side">
          <Skeleton className="skel-panel" />
        </div>
      </div>
    </div>
  )
}
