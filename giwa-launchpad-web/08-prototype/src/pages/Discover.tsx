// Discover `[F14]`: Rising (default) / New / Graduating soon / Graduated, search, Season strip, open windows rail.
// Tabs and search live in the URL. Cards are single links with name, state and people in the accessible name.
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Search, X } from 'lucide-react'
import { useAccount, useDataSource, useFeed, useStatus } from '../data/hooks'
import type { FeedName } from '../data/types'
import { useTxRunner } from '../flows/tx'
import { Page } from '../components/layout/Page'
import { TokenCard } from '../components/market/TokenCard'
import { displayName } from '../components/market/TokenBits'
import { Button, IconButton, LinkButton } from '../components/ui/Button'
import { Tabs, TabPanel } from '../components/ui/Controls'
import { Badge, EmptyState, ErrorState, Skeleton } from '../components/ui/Feedback'
import { Icon } from '../components/ui/Icon'
import { track } from '../lib/analytics'
import { formatCountdown, formatDuration, formatSC, shortAddress } from '../lib/format'
import { useNow, usePageTitle } from '../lib/hooks'
import { t, type StringKey } from '../lib/i18n'
import { PARAMS } from '../lib/params'
import { Link, useSearchParam } from '../lib/router'
import { useWallet } from '../wallet/wallet'

const FEEDS: FeedName[] = ['rising', 'new', 'graduating', 'graduated']

export default function Discover() {
  usePageTitle(t('discover.title'))
  const [tabParam, setTab] = useSearchParam('tab')
  const [qParam, setQ] = useSearchParam('q')
  const tab: FeedName = FEEDS.includes(tabParam as FeedName) ? (tabParam as FeedName) : 'rising'
  const [query, setQuery] = useState(qParam ?? '')
  const [debounced, setDebounced] = useState(qParam ?? '')
  const status = useStatus()

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(query.trim())
      if ((qParam ?? '') !== query.trim()) setQ(query.trim() || null)
    }, 300)
    return () => clearTimeout(id)
  }, [query, qParam, setQ])

  const { data, error, mutate } = useFeed(tab, debounced)
  const delayed = status ? status.indexer !== 'ok' : false
  const tabLabel = t(`discover.tabs.${tab}` as StringKey)

  return (
    <Page className="discover">
      <SeasonStrip />
      <div className="discover-head">
        <h1 className="page-title display">{t('discover.title')}</h1>
        <div className="search">
          <label htmlFor="discover-search" className="sr-only">
            {t('discover.search')}
          </label>
          <span className="input search-input">
            <Icon icon={Search} />
            <input id="discover-search" type="search" placeholder={t('discover.searchPlaceholder')} value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
            {query ? <IconButton label={t('discover.clearSearch')} icon={X} size={16} onClick={() => setQuery('')} /> : null}
          </span>
        </div>
      </div>
      <div className="discover-grid">
        <div className="discover-main">
          <div className="feed-bar">
            <Tabs
              label={t('discover.tabsLabel')}
              idBase="feed"
              value={tab}
              onChange={(v) => {
                setTab(v === 'rising' ? null : v)
                track('feed_tab_changed', { tab: v })
              }}
              items={FEEDS.map((f) => ({ value: f, label: t(`discover.tabs.${f}` as StringKey) }))}
            />
            {delayed ? <Badge tone="warn">{t('common.delayed')}</Badge> : null}
          </div>
          <TabPanel idBase="feed" value={tab}>
            <p className="feed-help" aria-live="polite">
              {debounced ? t('discover.searchResults', { query: debounced }) : t(`discover.help.${tab}` as StringKey)}
            </p>
            <FirstTip />
            {error ? (
              <ErrorState error={error} onRetry={() => mutate()} />
            ) : !data ? (
              <ul className="card-grid" role="list" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <li key={i}>
                    <Skeleton className="skel-card" />
                  </li>
                ))}
              </ul>
            ) : data.length === 0 ? (
              <EmptyState
                message={debounced ? t('empty.search', { query: debounced }) : t('empty.feed', { tab: tabLabel })}
                action={
                  <LinkButton href="/discover?tab=new" variant="secondary">
                    {t('empty.feedAction')}
                  </LinkButton>
                }
              />
            ) : (
              <ul className="card-grid" role="list">
                {data.map((s) => (
                  <li key={s.address}>
                    <TokenCard initial={s} />
                  </li>
                ))}
              </ul>
            )}
          </TabPanel>
        </div>
        <WindowsRail />
      </div>
    </Page>
  )
}

function SeasonStrip() {
  const ds = useDataSource()
  const { state, ready } = useWallet()
  const account = useAccount(state.address)
  const run = useTxRunner()
  const now = useNow()
  const { data: season } = useSWR(['season', state.address], () => ds.getSeason(state.address))
  if (!season) return <Skeleton className="skel-strip" />
  const claim = () =>
    account &&
    run({
      request: { kind: 'claimCredit' },
      tone: 'primary',
      rows: [
        { label: t('presign.youReceive'), value: formatSC(account.claimable), strong: true },
        { label: t('presign.destination'), value: t('presign.yourWallet', { address: shortAddress(account.address) }) },
        { label: t('presign.gas'), value: t('presign.gasValue') },
      ],
      receipt: (r) => {
        track('credit_claimed')
        return t('tx.receiptClaim', { amount: formatSC(r.amount ?? account.claimable) })
      },
    })
  return (
    <div className="season-strip">
      <p>
        <strong>{t('discover.seasonStrip', { season: season.season, day: season.day, days: season.days })}</strong>
        {ready && account ? <span className="num">{` ${t('discover.seasonCredit', { amount: formatSC(account.sc, { unit: false }) })}`}</span> : null}
        {ready && account && account.claimable === 0 && account.nextClaimAt && account.tier > 0 ? <span className="muted num">{` ${t('discover.seasonNext', { time: formatDuration(account.nextClaimAt - now) })}`}</span> : null}
      </p>
      {ready && account && account.claimable > 0 ? (
        <Button size="sm" variant="sign" onClick={claim}>
          {t('discover.seasonClaim', { amount: account.claimable })}
        </Button>
      ) : !ready || (account && account.tier === 0) ? (
        <Link href="/verify" className="text-link">
          {t('discover.seasonVerify')}
        </Link>
      ) : null}
    </div>
  )
}

function WindowsRail() {
  const ds = useDataSource()
  const now = useNow()
  const { data, error } = useSWR(['windows'], () => ds.listOpenWindows(), { refreshInterval: 5000 })
  return (
    <aside className="discover-rail" aria-labelledby="windows-title">
      <h2 id="windows-title" className="rail-title">
        {t('discover.windowsTitle')}
      </h2>
      {error ? (
        <ErrorState error={error} />
      ) : !data ? (
        <Skeleton className="skel-block" />
      ) : data.length === 0 ? (
        <p className="hint">{t('discover.windowsEmpty')}</p>
      ) : (
        <ol className="rail-list" role="list">
          {data.map((w) => (
            <li key={w.address}>
              <Link href={`/t/${w.address}`} className="rail-item">
                <span className="rail-name">{displayName(w)}</span>
                <span className="rail-meta num">
                  <span className="counter-box figure">{w.state === 'settling' ? '00:00' : formatCountdown(w.windowEndsAt - now)}</span>
                  <span className="muted">{`${w.participants}/${PARAMS.capByTier.length ? w.participants : 0} ${t('window.participants').toLowerCase()}`.replace(/^(\d+)\/\d+/, '$1')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

function FirstTip() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    try {
      setShow(!localStorage.getItem('bros:tip'))
    } catch {
      setShow(false)
    }
  }, [])
  if (!show) return null
  return (
    <div className="tip">
      <p>{t('discover.firstTip')}</p>
      <IconButton
        label={t('discover.dismissTip')}
        icon={X}
        size={16}
        onClick={() => {
          try {
            localStorage.setItem('bros:tip', '1')
          } catch {
            /* fine */
          }
          setShow(false)
        }}
      />
    </div>
  )
}
