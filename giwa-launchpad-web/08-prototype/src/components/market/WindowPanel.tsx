// Opening window `[F02, F03, J3]`: countdown, one-price rule, clearing estimate, participants, cap by tier, deposit with an
// optional limit bucket, cancel with refund. The countdown is announced every 10 s, never every second `[06 §7]`.
import { useId, useState } from 'react'
import { useAccount, useStatus } from '../../data/hooks'
import type { LaunchDetail } from '../../data/types'
import { useTxRunner } from '../../flows/tx'
import { formatCountdown, formatPrice, formatSC } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t } from '../../lib/i18n'
import { LIMIT_BUCKETS, PARAMS, type LimitBucket } from '../../lib/params'
import { openSheet } from '../../state/stores'
import { useWallet } from '../../wallet/wallet'
import { AmountInput, parseAmount } from '../ui/AmountInput'
import { Button, LinkButton } from '../ui/Button'
import { Chips } from '../ui/Controls'
import { Notice, Term } from '../ui/Feedback'

export function WindowPanel({ d }: { d: LaunchDetail }) {
  const { state: ws, connected, wrongNetwork } = useWallet()
  const account = useAccount(ws.address)
  const status = useStatus()
  const run = useTxRunner()
  const now = useNow() || d.createdAt
  const limitId = useId()
  const [raw, setRaw] = useState('')
  const [chip, setChip] = useState<string | null>(null)
  const [bucket, setBucket] = useState<LimitBucket>(null)
  const [busy, setBusy] = useState(false)

  const left = Math.max(0, d.windowEndsAt - now)
  const settling = d.state === 'settling' || left === 0
  const mine = ws.address ? d.window.entries.find((e) => e.owner === ws.address) : undefined
  const tier = account?.tier ?? 0
  const cap = PARAMS.capByTier[tier]
  const room = Math.max(0, cap - (mine?.amount ?? 0))
  const amount = parseAmount(raw)
  const overCap = amount > room + 1e-9
  const overBalance = connected && amount > (account?.sc ?? 0) + 1e-9
  const error = overCap && tier > 0 ? t('errors.windowCap', { cap: formatSC(cap, { trim: true }) }) : overBalance ? t('errors.insufficientBalance') : null
  const announce = Math.ceil(left / 10_000) * 10

  const join = async () => {
    setBusy(true)
    const result = await run({
      request: { kind: 'deposit', token: d.address, amount, bucket },
      tone: 'primary',
      rows: [
        { label: t('presign.amount'), value: formatSC(amount), strong: true },
        { label: t('presign.limit'), value: bucket === null ? t('window.limitNone') : t('window.limitOption', { x: bucket }) },
        { label: t('window.estimate'), value: `${formatPrice(d.window.estimatePrice)} SC` },
        { label: t('presign.fee'), value: formatSC(amount * 0.01) },
        { label: t('presign.tax'), value: `${d.creatorTaxPct}%` },
        { label: t('presign.gas'), value: t('presign.gasValue') },
      ],
      warnings: d.creatorTaxPct > 1 ? [t('presign.warnTax', { pct: `${d.creatorTaxPct}%` })] : [],
      receipt: () => t('tx.receiptDeposit', { amount: formatSC(amount) }),
    })
    setBusy(false)
    if (result) {
      setRaw('')
      setChip(null)
    }
  }

  const cancel = () =>
    mine &&
    run({
      request: { kind: 'cancelDeposit', token: d.address },
      tone: 'primary',
      rows: [
        { label: t('presign.youReceive'), value: formatSC(mine.amount), strong: true },
        { label: t('presign.gas'), value: t('presign.gasValue') },
      ],
      receipt: (r) => t('tx.receiptCancel', { amount: formatSC(r.amount ?? mine.amount) }),
    })

  return (
    <section className="panel window-panel" aria-labelledby="window-title">
      <div className="window-head">
        <h2 id="window-title">{t('window.title')}</h2>
        <span className="window-clock figure" aria-hidden="true">
          {formatCountdown(left)}
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {settling ? t('window.settling') : `${formatCountdown(announce * 1000)} ${t('window.left')}`}
      </p>
      <p className="window-rule">
        <Term k="window">{t('window.rule')}</Term>
      </p>
      <dl className="facts">
        <div>
          <dt>{t('window.participants')}</dt>
          <dd className="num">{d.window.participants}</dd>
        </div>
        <div>
          <dt>{t('window.deposits')}</dt>
          <dd className="num">{formatSC(d.window.total)}</dd>
        </div>
        <div>
          <dt>
            <Term k="clearing">{t('window.estimate')}</Term>
          </dt>
          <dd className="num">{`${formatPrice(d.window.estimatePrice)} SC`}</dd>
        </div>
        <div>
          <dt>{t('window.yourCap')}</dt>
          <dd className="num">{tier > 0 ? t('window.capValue', { amount: formatSC(cap, { trim: true }), tier }) : t('verify.tierNone')}</dd>
        </div>
      </dl>

      {settling ? (
        <Notice>{t('window.settling')}</Notice>
      ) : (
        <>
          <p className="hint">
            <Term k="humansFirst">{t('window.humansFirst')}</Term>
          </p>
          {mine ? (
            <div className="my-deposit">
              <span>{t('window.yourDeposit')}</span>
              <strong className="num">{formatSC(mine.amount)}</strong>
              <Button variant="quiet" size="sm" onClick={cancel}>
                {t('window.cancel', { amount: formatSC(mine.amount) })}
              </Button>
            </div>
          ) : null}
          {connected && tier === 0 ? (
            <Notice tone="warn">
              <p>{t('verify.gate')}</p>
              <LinkButton href="/verify" variant="secondary" size="sm">
                {t('verify.gateAction')}
              </LinkButton>
            </Notice>
          ) : (
            <>
              <AmountInput
                id="window-amount"
                label={t('window.amount')}
                value={raw}
                onChange={(v) => {
                  setRaw(v)
                  setChip(null)
                }}
                unit="SC"
                balance={connected ? t('trade.balance', { amount: formatSC(account?.sc ?? 0) }) : undefined}
                error={error}
                chips={
                  <Chips
                    label={t('window.amount')}
                    value={chip}
                    onChange={(v) => {
                      setChip(v)
                      setRaw(v === 'max' ? String(Math.min(room, Math.floor((account?.sc ?? room) * 100) / 100)) : v)
                    }}
                    options={[
                      { value: '10', label: '10' },
                      { value: '25', label: '25' },
                      { value: '50', label: '50' },
                      { value: 'max', label: t('trade.max') },
                    ]}
                  />
                }
              />
              <div className="field">
                <div className="field-top">
                  <label htmlFor={limitId}>{t('window.limit')}</label>
                </div>
                <div className="input input-select">
                  <select id={limitId} value={bucket === null ? '' : String(bucket)} onChange={(e) => setBucket(e.target.value ? (Number(e.target.value) as LimitBucket) : null)} aria-describedby={`${limitId}-help`}>
                    {LIMIT_BUCKETS.map((b) => (
                      <option key={String(b)} value={b === null ? '' : String(b)}>
                        {b === null ? t('window.limitNone') : t('window.limitOption', { x: b })}
                      </option>
                    ))}
                  </select>
                </div>
                <p id={`${limitId}-help`} className="field-msg field-help">
                  {t('window.limitHelp')}
                </p>
              </div>
              {!connected ? (
                <Button block size="lg" onClick={() => openSheet('connect')}>
                  {t('wallet.connect')}
                </Button>
              ) : wrongNetwork ? (
                <Button block size="lg" variant="danger" onClick={() => openSheet('network')}>
                  {t('wallet.wrongNetwork')}
                </Button>
              ) : (
                <Button block size="lg" variant="sign" disabled={!amount || Boolean(error) || Boolean(status?.paused)} loading={busy} onClick={join}>
                  {mine ? t('window.add') : t('window.join')}
                </Button>
              )}
              {status?.paused ? <p className="field-help">{t('errors.paused')}</p> : null}
            </>
          )}
        </>
      )}
    </section>
  )
}
