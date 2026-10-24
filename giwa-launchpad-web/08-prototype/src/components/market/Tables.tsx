// Virtualised rows (fixed 36 px, compact density): the feed keeps up to 500 trades but renders ~20 rows.
// Rows never slide in; a new row gets a one-time tint that fades under normal motion only (motion.md).
import { memo, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { Holder, Trade, WalletLabel } from '../../data/types'
import { cx } from '../../lib/cx'
import { formatAge, formatPct, formatSC, formatTokens, shortAddress } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t } from '../../lib/i18n'
import { Link } from '../../lib/router'
import { Badge, EmptyState, Identicon } from '../ui/Feedback'
import { DownGlyph, UpGlyph } from '../ui/Icon'

const ROW = 36

export function WalletCell({ wallet, label }: { wallet: string; label: WalletLabel | null }) {
  return (
    <span className="wallet-cell">
      <Identicon address={wallet} size={16} />
      {wallet.startsWith('0xvault') ? <span className="num">{t('fairness.creatorShare')}</span> : <Link href={`/u/${wallet}`} className="num">{shortAddress(wallet)}</Link>}
      {label ? <Badge tone={label}>{t(`common.${label}`)}</Badge> : null}
    </span>
  )
}

function VirtualRows<T extends { id?: string }>({ rows, height, render, header, label, getKey }: { rows: T[]; height: number; render: (row: T, index: number) => ReactNode; header: ReactNode; label: string; getKey: (row: T) => string }) {
  const [top, setTop] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const firstKey = rows[0] ? getKey(rows[0]) : ''
  const prev = useRef({ firstKey, length: rows.length })
  useLayoutEffect(() => {
    const el = scroller.current
    if (el && el.scrollTop > 0 && prev.current.firstKey !== firstKey) {
      const added = Math.max(0, rows.length - prev.current.length)
      if (added) el.scrollTop += added * ROW
    }
    prev.current = { firstKey, length: rows.length }
  }, [firstKey, rows.length])
  const start = Math.max(0, Math.floor(top / ROW) - 6)
  const end = Math.min(rows.length, start + Math.ceil(height / ROW) + 12)
  return (
    <div className="vtable" role="table" aria-label={label} aria-rowcount={rows.length + 1}>
      <div role="rowgroup" className="vtable-head">
        {header}
      </div>
      <div ref={scroller} className="vtable-scroll" style={{ maxHeight: height }} onScroll={(e) => setTop(e.currentTarget.scrollTop)} tabIndex={0} aria-label={label}>
        <div role="rowgroup" className="vtable-body" style={{ height: rows.length * ROW }}>
          {rows.slice(start, end).map((row, i) => (
            <div key={getKey(row)} role="row" aria-rowindex={start + i + 2} className="vrow" style={{ transform: `translateY(${(start + i) * ROW}px)` }}>
              {render(row, start + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const TradesFeed = memo(function TradesFeed({ trades, ticker, height = 396 }: { trades: Trade[]; ticker: string; height?: number }) {
  const now = useNow()
  if (!trades.length) return <EmptyState message={t('empty.trades')} />
  return (
    <VirtualRows
      rows={trades}
      height={height}
      label={t('token.tabs.trades')}
      getKey={(r) => r.id}
      header={
        <div role="row" className="vrow vrow-head vrow-trades">
          <span role="columnheader">{t('trade.time')}</span>
          <span role="columnheader">{t('trade.sideLabel')}</span>
          <span role="columnheader" className="r">
            {t('trade.amount')}
          </span>
          <span role="columnheader" className="r">
            {ticker}
          </span>
          <span role="columnheader">{t('leaderboard.wallet')}</span>
        </div>
      }
      render={(tr) => (
        <div className={cx('vrow-trades vrow-inner', now - tr.ts < 1500 && 'is-new')}>
          <span role="cell" className="num muted">
            {formatAge(Math.max(0, now - tr.ts))}
          </span>
          <span role="cell" className={cx('side', `side-${tr.side}`)}>
            {tr.side === 'buy' ? <UpGlyph /> : <DownGlyph />}
            {tr.side === 'buy' ? t('trade.buy') : t('trade.sell')}
          </span>
          <span role="cell" className="num r">
            {formatSC(tr.amountSC)}
          </span>
          <span role="cell" className="num r">
            {formatTokens(tr.tokens)}
          </span>
          <span role="cell">
            <WalletCell wallet={tr.wallet} label={tr.label} />
          </span>
        </div>
      )}
    />
  )
})

export const HoldersTable = memo(function HoldersTable({ holders, ticker, virtual = false }: { holders: Holder[]; ticker: string; virtual?: boolean }) {
  if (!holders.length) return <EmptyState message={t('empty.holders')} />
  const header = (
    <div role="row" className="vrow vrow-head vrow-holders">
      <span role="columnheader" className="r">
        {t('leaderboard.rank')}
      </span>
      <span role="columnheader">{t('leaderboard.wallet')}</span>
      <span role="columnheader" className="r">
        %
      </span>
      <span role="columnheader" className="r">
        {ticker}
      </span>
    </div>
  )
  const render = (h: Holder, i: number) => (
    <div className="vrow-holders vrow-inner">
      <span role="cell" className="num r muted">
        {i + 1}
      </span>
      <span role="cell">
        <WalletCell wallet={h.wallet} label={h.label} />
      </span>
      <span role="cell" className="num r">
        {formatPct(h.sharePct, 2)}
      </span>
      <span role="cell" className="num r">
        {formatTokens(h.tokens)}
      </span>
    </div>
  )
  if (virtual) return <VirtualRows rows={holders} height={540} label={t('token.tabs.holders')} getKey={(h) => h.wallet} header={header} render={render} />
  return (
    <div className="vtable" role="table" aria-label={t('token.tabs.holders')}>
      <div role="rowgroup" className="vtable-head">
        {header}
      </div>
      <div role="rowgroup">
        {holders.map((h, i) => (
          <div key={h.wallet} role="row" className="vrow vrow-static">
            {render(h, i)}
          </div>
        ))}
      </div>
    </div>
  )
})
