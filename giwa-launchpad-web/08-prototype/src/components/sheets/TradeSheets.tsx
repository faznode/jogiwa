import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Copy } from 'lucide-react'
import { useDataSource } from '../../data/hooks'
import type { LaunchDetail, TxError } from '../../data/types'
import type { TxPlan } from '../../flows/tx'
import { track } from '../../lib/analytics'
import { cx } from '../../lib/cx'
import { walletErrorMessage } from '../../lib/errors'
import { t, type StringKey } from '../../lib/i18n'
import { pushToast } from '../../state/stores'
import { useWallet } from '../../wallet/wallet'
import { FairnessCard } from '../market/TokenParts'
import { displayName } from '../market/TokenBits'
import { Button, ExternalLink } from '../ui/Button'
import { RadioGroup } from '../ui/Controls'
import { Notice } from '../ui/Feedback'
import { Icon } from '../ui/Icon'
import { Sheet, type SheetHandle } from '../ui/Sheet'

type Close = (ok: boolean) => void

/** Shown before the wallet opens, every time: amounts, fees, tax, slippage, impact, graduation progress, simulation. */
export function PresignSheet({ plan, onClose }: { plan: TxPlan; onClose: Close }) {
  const ds = useDataSource()
  const { state } = useWallet()
  const ref = useRef<SheetHandle>(null)
  const [sim, setSim] = useState<'running' | 'ok' | 'fail'>('running')
  const [simError, setSimError] = useState<TxError | undefined>()
  useEffect(() => {
    let live = true
    ds.simulate(plan.request, state.address ?? '')
      .then((r) => {
        if (!live) return
        setSim(r.ok ? 'ok' : 'fail')
        setSimError(r.error)
        if (!r.ok) track('simulation_failed', { error: r.error ?? 'unknown' })
      })
      .catch(() => live && setSim('fail'))
    return () => {
      live = false
    }
  }, [ds, plan.request, state.address])
  const tone = plan.tone === 'buy' ? 'buy' : plan.tone === 'sell' ? 'sell' : 'primary'
  return (
    <Sheet
      sheetRef={ref}
      title={t(`presign.${plan.request.kind}` as StringKey)}
      onClose={onClose}
      footer={
        <div className="foot-row">
          <Button variant="secondary" onClick={() => ref.current?.close(false)}>
            {t('common.back')}
          </Button>
          <Button variant={tone} size="lg" disabled={sim !== 'ok'} onClick={() => ref.current?.close(true)}>
            {t('presign.confirm')}
          </Button>
        </div>
      }
    >
      <dl className="summary">
        {plan.rows.map((row, i) => (
          <div key={i} className={cx('summary-row', row.strong && 'is-strong')}>
            <dt>{row.label}</dt>
            <dd className="num">{row.value}</dd>
          </div>
        ))}
        {plan.progress ? (
          <div className="summary-row">
            <dt>{t('presign.progress')}</dt>
            <dd className="num">{plan.progress}</dd>
          </div>
        ) : null}
      </dl>
      {plan.warnings?.map((w) => (
        <Notice key={w} tone="warn">
          {w}
        </Notice>
      ))}
      <p className={cx('sim', `sim-${sim}`)} role="status">
        {sim === 'running' ? <span className="spinner" aria-hidden="true" /> : <Icon icon={sim === 'ok' ? Check : AlertTriangle} />}
        <span>{sim === 'running' ? t('presign.simulating') : sim === 'ok' ? t('presign.simOk') : `${t('presign.simFail')} ${walletErrorMessage(simError ?? 'reverted')}`}</span>
      </p>
    </Sheet>
  )
}

/** First buy of each token: the six facts first `[S4]`, with dwell time for the masterplan's fairness events. */
export function FairnessSheet({ detail, onClose }: { detail: LaunchDetail; onClose: Close }) {
  const ref = useRef<SheetHandle>(null)
  const opened = useRef(0)
  useEffect(() => {
    opened.current = performance.now()
    track('fairness_sheet_shown')
  }, [])
  const done = (ok: boolean) => {
    track(ok ? 'fairness_sheet_expanded' : 'fairness_sheet_dismissed', { dwell_ms: Math.round(performance.now() - opened.current) })
    onClose(ok)
  }
  return (
    <Sheet
      sheetRef={ref}
      title={t('fairness.sheetTitle', { name: displayName(detail) })}
      description={t('fairness.sheetLead')}
      onClose={done}
      footer={
        <Button block size="lg" variant="buy" disabled={!detail.manifestOk} onClick={() => ref.current?.close(true)}>
          {t('fairness.sheetContinue')}
        </Button>
      }
    >
      <FairnessCard d={detail} variant="full" />
    </Sheet>
  )
}

export function ShareSheet({ detail, onClose }: { detail: LaunchDetail; onClose: Close }) {
  const ref = useRef<SheetHandle>(null)
  const [copied, setCopied] = useState(false)
  const url = typeof window === 'undefined' ? '' : `${window.location.origin}/t/${detail.address}`
  const text = t('share.text', { name: displayName(detail), ticker: detail.ticker })
  return (
    <Sheet sheetRef={ref} title={t('share.title', { name: displayName(detail) })} onClose={onClose} size="sm">
      <div className="option-list">
        <button
          type="button"
          className="option"
          onClick={() => {
            navigator.clipboard?.writeText(url).then(() => setCopied(true))
            track('share_clicked', { channel: 'copy' })
          }}
        >
          <Icon icon={copied ? Check : Copy} size={20} />
          <span className="option-text">
            <strong>{copied ? t('share.copied') : t('share.copy')}</strong>
            <span className="num">{url.replace(/^https?:\/\//, '')}</span>
          </span>
        </button>
      </div>
      <ul className="menu-list" role="list">
        <li onClick={() => track('share_clicked', { channel: 'x' })}>
          <ExternalLink href={`https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}>{t('share.x')}</ExternalLink>
        </li>
        <li onClick={() => track('share_clicked', { channel: 'telegram' })}>
          <ExternalLink href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}>{t('share.telegram')}</ExternalLink>
        </li>
      </ul>
    </Sheet>
  )
}

export function ReportSheet({ detail, onClose }: { detail: LaunchDetail; onClose: Close }) {
  const ref = useRef<SheetHandle>(null)
  const [reason, setReason] = useState<'impersonation' | 'sexual' | 'hate' | 'scam' | 'other'>('impersonation')
  return (
    <Sheet
      sheetRef={ref}
      title={t('report.title')}
      description={t('report.lead')}
      onClose={onClose}
      size="sm"
      footer={
        <Button
          block
          onClick={() => {
            pushToast({ kind: 'info', title: t('report.sent') })
            ref.current?.close(true)
          }}
        >
          {t('report.send')}
        </Button>
      }
    >
      <RadioGroup
        name={`report-${detail.address}`}
        label={displayName(detail)}
        value={reason}
        onChange={setReason}
        options={(['impersonation', 'sexual', 'hate', 'scam', 'other'] as const).map((r) => ({ value: r, label: t(`report.${r}`) }))}
      />
    </Sheet>
  )
}
