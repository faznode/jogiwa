import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CalendarDays, CircleUser, Compass, Plus, TriangleAlert, Wallet as WalletIcon, X } from 'lucide-react'
import { useAccount, useDataSource, useStatus } from '../../data/hooks'
import { track } from '../../lib/analytics'
import { cx } from '../../lib/cx'
import { formatDuration, formatSC, shortAddress } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t, type StringKey } from '../../lib/i18n'
import { NETWORK } from '../../lib/params'
import { Link, useLocation } from '../../lib/router'
import { applySettings, getSettings, openSheet, restoreStrip, setStripHidden, useStripHidden } from '../../state/stores'
import { useWallet } from '../../wallet/wallet'
import { Wordmark } from '../brand/Wordmark'
import { SheetHost } from '../sheets/SheetHost'
import { Button, ExternalLink, IconButton } from '../ui/Button'
import { Identicon, Toaster } from '../ui/Feedback'
import { Icon } from '../ui/Icon'

const NAV: [string, StringKey][] = [
  ['/discover', 'nav.discover'],
  ['/create', 'nav.create'],
  ['/season', 'nav.season'],
  ['/learn', 'nav.learn'],
]

/** Route templates for analytics, so no address ever leaves the browser (ADR-S1 §12). */
const routeTemplate = (path: string) => path.replace(/^\/t\/[^/]+/, '/t/:token').replace(/^\/u\/[^/]+/, '/u/:address').replace(/^\/learn\/[^/]+/, '/learn/:slug').replace(/^\/legal\/[^/]+/, '/legal/:doc')

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation()
  const bare = location === '/restricted' || location === '/maintenance'

  useEffect(() => {
    restoreStrip()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = () => applySettings(getSettings())
    mq.addEventListener('change', follow)
    return () => mq.removeEventListener('change', follow)
  }, [])

  useEffect(() => {
    track('page_view', { route: routeTemplate(location) })
  }, [location])

  return (
    <>
      <a href="#main" className="skip-link">
        {t('a11y.skip')}
      </a>
      <TestnetStrip />
      {bare ? null : <TopBar />}
      {bare ? null : <StatusStrips />}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      {bare ? null : <Footer />}
      {bare ? null : <BottomNav />}
      <SheetHost />
      <Toaster />
      <MockBadge />
      <RouteAnnouncer />
      <FirstVisit />
    </>
  )
}

function TestnetStrip() {
  const hidden = useStripHidden()
  if (hidden) return null
  return (
    <div className="testnet-strip" role="note">
      <p>
        <strong>{t('testnet.strip')}</strong>
        <ExternalLink href={NETWORK.faucet} domain={false}>
          {t('testnet.faucet')}
        </ExternalLink>
      </p>
      <IconButton label={t('testnet.hide')} icon={X} size={16} onClick={() => setStripHidden(true)} />
    </div>
  )
}

function TopBar() {
  const [location] = useLocation()
  const stripHidden = useStripHidden()
  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <Link href="/" className="brand" aria-label={t('common.home')}>
          <Wordmark height={30} />
        </Link>
        <nav aria-label={t('a11y.primaryNav')} className="topnav">
          <ul role="list">
            {NAV.map(([href, key]) => (
              <li key={href}>
                <Link href={href} className="topnav-link" aria-current={location === href || location.startsWith(`${href}/`) ? 'page' : undefined}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="topbar-end">
          {stripHidden ? (
            <button type="button" className="testnet-chip" onClick={() => setStripHidden(false)} aria-label={t('testnet.show')}>
              {t('testnet.chip')}
            </button>
          ) : null}
          <span className="net-chip">
            <span className="sr-only">{t('nav.networkLabel')}: </span>
            {t('nav.network')}
          </span>
          <CreditChip />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}

function CreditChip() {
  const { state, ready } = useWallet()
  const account = useAccount(state.address)
  if (!ready || !account) return null
  return (
    <Link href="/season" className={cx('credit-chip num', account.claimable > 0 && 'has-claim')}>
      {formatSC(account.sc)}
      {account.claimable > 0 ? <span className="credit-claim">{`+${account.claimable}`}</span> : null}
    </Link>
  )
}

export function WalletButton() {
  const { state, connected, wrongNetwork } = useWallet()
  if (state.status === 'connecting')
    return (
      <Button variant="secondary" loading>
        {t('wallet.connecting')}
      </Button>
    )
  if (!connected)
    return (
      <Button variant="secondary" onClick={() => openSheet('connect')}>
        {t('wallet.connect')}
      </Button>
    )
  if (wrongNetwork)
    return (
      <Button variant="danger" onClick={() => openSheet('network')}>
        {t('wallet.wrongNetwork')}
      </Button>
    )
  return (
    <button type="button" className="wallet-btn" onClick={() => openSheet('account')} aria-label={`${t('nav.menu')}: ${shortAddress(state.address ?? '')}`}>
      <Identicon address={state.address ?? ''} size={20} />
      <span className="num">{shortAddress(state.address ?? '')}</span>
    </button>
  )
}

function StatusStrips() {
  const status = useStatus()
  const now = useNow()
  if (!status) return null
  const lagMinutes = Math.max(1, Math.round(status.lagBlocks / 60))
  return (
    <div className="status-strips">
      {status.chain !== 'ok' ? (
        <p className="strip strip-sign" role="status">
          <Icon icon={TriangleAlert} />
          <span>{t('status.chainSlow')}</span>
          <Link href="/status">{t('status.statusLink')}</Link>
        </p>
      ) : null}
      {status.indexer !== 'ok' ? (
        <p className="strip strip-ink" role="status">
          <span>{t('status.indexerLag', { minutes: lagMinutes })}</span>
          <Link href="/status">{t('status.statusLink')}</Link>
        </p>
      ) : null}
      {status.paused ? (
        <p className="strip strip-ink" role="status">
          <Icon icon={TriangleAlert} />
          <span>{t('status.paused', { reason: status.paused.reason })}</span>
          <Link href="/governance">{t('status.pendingLink')}</Link>
        </p>
      ) : null}
      {status.pendingOp ? (
        <p className="strip strip-paper" role="status">
          <span>{t('status.pending', { what: `${status.pendingOp.title}, ${status.pendingOp.from} to ${status.pendingOp.to}`, time: formatDuration(status.pendingOp.eta - now) })}</span>
          <Link href="/governance">{t('status.pendingLink')}</Link>
        </p>
      ) : null}
    </div>
  )
}

function Footer() {
  const legal = ['terms', 'privacy', 'risk', 'restricted', 'takedown', 'law-enforcement'] as const
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Wordmark height={28} />
          <p>{t('footer.nonCustodial')}</p>
          <p>{t('footer.official')}</p>
        </div>
        <nav aria-label={t('a11y.footerNav')} className="footer-cols">
          <div>
            <h2>{t('footer.product')}</h2>
            <ul role="list">
              <li><Link href="/discover">{t('nav.discover')}</Link></li>
              <li><Link href="/create">{t('nav.create')}</Link></li>
              <li><Link href="/season">{t('nav.season')}</Link></li>
              <li><Link href="/leaderboard">{t('nav.leaderboard')}</Link></li>
              <li><Link href="/learn">{t('nav.learn')}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t('footer.trust')}</h2>
            <ul role="list">
              <li><Link href="/fees">{t('nav.fees')}</Link></li>
              <li><Link href="/status">{t('nav.status')}</Link></li>
              <li><Link href="/governance">{t('nav.governance')}</Link></li>
              <li><Link href="/verify">{t('nav.verify')}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t('footer.legal')}</h2>
            <ul role="list">
              {legal.map((doc) => (
                <li key={doc}>
                  <Link href={`/legal/${doc}`}>{t(`legalDocs.${doc}` as StringKey)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t('footer.facts')}</h2>
            <ul role="list">
              <li>{t('footer.chain')}</li>
              <li><ExternalLink href={NETWORK.explorer}>{t('footer.explorer')}</ExternalLink></li>
              <li><ExternalLink href={NETWORK.faucet}>{t('footer.faucet')}</ExternalLink></li>
            </ul>
          </div>
        </nav>
        <p className="footer-mock">{t('footer.mock')}</p>
      </div>
    </footer>
  )
}

function BottomNav() {
  const [location] = useLocation()
  const items: [string, StringKey, typeof Compass][] = [
    ['/discover', 'nav.discover', Compass],
    ['/create', 'nav.create', Plus],
    ['/portfolio', 'nav.portfolio', WalletIcon],
    ['/season', 'nav.season', CalendarDays],
  ]
  return (
    <nav className="bottomnav" aria-label={t('a11y.appNav')}>
      <ul role="list">
        {items.map(([href, key, glyph]) => (
          <li key={href}>
            <Link href={href} className="bottomnav-link" aria-current={location.startsWith(href) ? 'page' : undefined}>
              <Icon icon={glyph} size={20} />
              <span>{t(key)}</span>
            </Link>
          </li>
        ))}
        <li>
          <button type="button" className="bottomnav-link" onClick={() => openSheet('account')}>
            <Icon icon={CircleUser} size={20} />
            <span>{t('nav.me')}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

function MockBadge() {
  const ds = useDataSource()
  if (ds.kind !== 'mock') return null
  return (
    <button type="button" className="mock-badge" onClick={() => openSheet('mock')}>
      {t('mock.badge')}
    </button>
  )
}

/** SPA route changes: scroll to top, announce the new page title, move focus to main (keyboard and screen readers). */
function RouteAnnouncer() {
  const [location] = useLocation()
  const [message, setMessage] = useState('')
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    window.scrollTo(0, 0)
    const id = setTimeout(() => {
      setMessage(document.title)
      document.getElementById('main')?.focus({ preventScroll: true })
    }, 60)
    return () => clearTimeout(id)
  }, [location])
  return (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  )
}

function FirstVisit() {
  useEffect(() => {
    try {
      if (!localStorage.getItem('bros:testnet-ack')) openSheet('testnet')
    } catch {
      /* storage blocked: the strip still shows */
    }
  }, [])
  return null
}
