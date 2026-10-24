import { useRef, useState } from 'react'
import { Copy, LogOut, Mail, Wallet as WalletIcon } from 'lucide-react'
import { useAccount, useDataSource } from '../../data/hooks'
import { useTxRunner } from '../../flows/tx'
import { track } from '../../lib/analytics'
import { walletErrorMessage } from '../../lib/errors'
import { formatDuration, formatSC, shortAddress } from '../../lib/format'
import { useNow } from '../../lib/hooks'
import { t, tList } from '../../lib/i18n'
import { NETWORK } from '../../lib/params'
import { Link } from '../../lib/router'
import { openSheet, pushToast } from '../../state/stores'
import { useWallet, WalletError, type WalletKind } from '../../wallet/wallet'
import { Button, ExternalLink } from '../ui/Button'
import { Checkbox } from '../ui/Controls'
import { Badge, Identicon, Notice } from '../ui/Feedback'
import { Icon } from '../ui/Icon'
import { Sheet, type SheetHandle } from '../ui/Sheet'

type Close = (ok: boolean) => void

export function ConnectSheet({ onClose }: { onClose: Close }) {
  const { wallet } = useWallet()
  const ref = useRef<SheetHandle>(null)
  const [busy, setBusy] = useState<WalletKind | null>(null)
  const [error, setError] = useState<string | null>(null)
  const connect = async (kind: WalletKind) => {
    setBusy(kind)
    setError(null)
    try {
      await wallet.connect(kind)
      track('wallet_connected', { kind })
      pushToast({ kind: 'info', title: t('wallet.connected') })
      ref.current?.close(true)
    } catch (e) {
      setError(e instanceof WalletError && e.code === 'userRejected' ? t('wallet.cancelled') : t('wallet.noProvider'))
    } finally {
      setBusy(null)
    }
  }
  return (
    <Sheet sheetRef={ref} title={t('wallet.sheetTitle')} description={t('wallet.sheetLead')} onClose={onClose} size="sm">
      <div className="option-list">
        <button type="button" className="option" onClick={() => connect('embedded')} disabled={Boolean(busy)} aria-busy={busy === 'embedded' || undefined}>
          <Icon icon={Mail} size={20} />
          <span className="option-text">
            <strong>{t('wallet.embedded')}</strong>
            <span>{t('wallet.embeddedHelp')}</span>
          </span>
          {busy === 'embedded' ? <span className="spinner" aria-hidden="true" /> : null}
        </button>
        <button type="button" className="option" onClick={() => connect('injected')} disabled={Boolean(busy)} aria-busy={busy === 'injected' || undefined}>
          <Icon icon={WalletIcon} size={20} />
          <span className="option-text">
            <strong>{t('wallet.injected')}</strong>
            <span>{t('wallet.injectedHelp')}</span>
          </span>
          {busy === 'injected' ? <span className="spinner" aria-hidden="true" /> : null}
        </button>
      </div>
      {error ? (
        <p className="field-msg field-error" role="alert">
          {error}
        </p>
      ) : null}
      <p className="hint">{t('wallet.readOnly')}</p>
    </Sheet>
  )
}

function CopyRow({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="copy-row">
      <dt>{label}</dt>
      <dd>
        <span className="num">{value}</span>
        {disabled ? null : (
          <button
            type="button"
            className="icon-btn"
            aria-label={copied ? t('a11y.copied') : t('a11y.copy', { label })}
            onClick={() => {
              navigator.clipboard?.writeText(value).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              })
            }}
          >
            <Icon icon={Copy} />
          </button>
        )}
      </dd>
    </div>
  )
}

export function FaucetHint() {
  return (
    <Notice>
      <p>
        <strong>{t('network.faucetTitle')}</strong>
      </p>
      <p>{t('network.faucetBody', { amount: NETWORK.faucetDaily })}</p>
      <ExternalLink href={NETWORK.faucet}>{t('network.faucetLink')}</ExternalLink>
    </Notice>
  )
}

export function NetworkSheet({ onClose }: { onClose: Close }) {
  const { wallet, state } = useWallet()
  const account = useAccount(state.address)
  const ref = useRef<SheetHandle>(null)
  const [mode, setMode] = useState<'switch' | 'add'>(state.chainKnown ? 'switch' : 'add')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const act = async () => {
    setBusy(true)
    setError(null)
    try {
      if (mode === 'switch') await wallet.switchNetwork()
      else await wallet.addNetwork()
      ref.current?.close(true)
    } catch (e) {
      if (e instanceof WalletError && e.code === 'chainMissing') setMode('add')
      else setError(t('network.rejected'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Sheet
      sheetRef={ref}
      title={mode === 'switch' ? t('network.switchTitle') : t('network.addTitle')}
      description={mode === 'switch' ? t('network.switchBody') : t('network.addBody')}
      onClose={onClose}
      size="sm"
      footer={
        <Button block size="lg" loading={busy} onClick={act}>
          {mode === 'switch' ? t('network.switch') : t('network.add')}
        </Button>
      }
    >
      {mode === 'add' ? (
        <dl className="copy-list">
          <CopyRow label={t('network.name')} value={NETWORK.name} />
          <CopyRow label={t('network.chainId')} value={String(NETWORK.chainId)} />
          <CopyRow label={t('network.rpc')} value={NETWORK.rpcUrl ?? t('network.rpcPending')} disabled={!NETWORK.rpcUrl} />
          <CopyRow label={t('network.symbol')} value={NETWORK.gasSymbol} />
          <CopyRow label={t('network.explorer')} value={NETWORK.explorer} />
        </dl>
      ) : null}
      {error ? (
        <p className="field-msg field-error" role="alert">
          {error}
        </p>
      ) : null}
      {account && account.eth === 0 ? <FaucetHint /> : null}
    </Sheet>
  )
}

export function RiskSheet({ onClose }: { onClose: Close }) {
  const { wallet, state } = useWallet()
  const ds = useDataSource()
  const ref = useRef<SheetHandle>(null)
  const [checked, setChecked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sign = async () => {
    setBusy(true)
    setError(null)
    try {
      await wallet.signMessage('terms')
      if (state.address) await ds.acceptTerms(state.address)
      track('tos_accepted')
      ref.current?.close(true)
    } catch (e) {
      setError(walletErrorMessage(e instanceof WalletError ? e.code : 'reverted'))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Sheet
      sheetRef={ref}
      title={t('risk.title')}
      description={t('risk.lead')}
      onClose={onClose}
      footer={
        <Button block size="lg" disabled={!checked} loading={busy} onClick={sign}>
          {busy ? t('risk.signing') : t('risk.sign')}
        </Button>
      }
    >
      <ul className="risk-list" role="list">
        {tList('risk.items').map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="hint">{t('risk.nonCustodial')}</p>
      <p>
        <a href="/legal/risk" target="_blank" rel="noopener">
          {t('risk.readFull')}
          <span className="sr-only"> ({t('a11y.newTab')})</span>
        </a>
      </p>
      <Checkbox checked={checked} onChange={setChecked}>
        {t('risk.check')}
      </Checkbox>
      {error ? (
        <p className="field-msg field-error" role="alert">
          {error}
        </p>
      ) : null}
    </Sheet>
  )
}

export function AccountSheet({ onClose }: { onClose: Close }) {
  const { wallet, state, connected } = useWallet()
  const account = useAccount(state.address)
  const run = useTxRunner()
  const now = useNow()
  const ref = useRef<SheetHandle>(null)
  const close = () => ref.current?.close(false)
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
  const links = (
    <ul className="menu-list" role="list">
      {connected ? (
        <>
          <li><Link href="/portfolio" onClick={close}>{t('nav.portfolio')}</Link></li>
          <li><Link href="/creator" onClick={close}>{t('nav.creator')}</Link></li>
          <li><Link href={`/u/${state.address}`} onClick={close}>{t('nav.profile')}</Link></li>
          {account?.tier === 0 ? <li><Link href="/verify" onClick={close}>{t('nav.verify')}</Link></li> : null}
        </>
      ) : null}
      <li><Link href="/leaderboard" onClick={close}>{t('nav.leaderboard')}</Link></li>
      <li><Link href="/learn" onClick={close}>{t('nav.learn')}</Link></li>
      <li><Link href="/status" onClick={close}>{t('nav.status')}</Link></li>
      <li>
        <button type="button" className="link-btn" onClick={() => openSheet('settings')}>
          {t('nav.settings')}
        </button>
      </li>
    </ul>
  )
  if (!connected || !state.address)
    return (
      <Sheet sheetRef={ref} title={t('nav.me')} onClose={onClose} size="sm" footer={<Button block onClick={() => openSheet('connect')}>{t('wallet.connect')}</Button>}>
        <p className="hint">{t('wallet.readOnly')}</p>
        {links}
      </Sheet>
    )
  return (
    <Sheet
      sheetRef={ref}
      title={t('nav.me')}
      onClose={onClose}
      size="sm"
      footer={
        <Button
          variant="secondary"
          block
          icon={LogOut}
          onClick={() => {
            wallet.disconnect()
            close()
          }}
        >
          {t('wallet.disconnect')}
        </Button>
      }
    >
      <div className="account-head">
        <Identicon address={state.address} size={40} />
        <div>
          <p className="num account-address">{shortAddress(state.address)}</p>
          <Badge>{account && account.tier > 0 ? t('verify.tier', { tier: account.tier }) : t('verify.tierNone')}</Badge>
        </div>
      </div>
      <dl className="facts">
        <div>
          <dt>{t('wallet.credit')}</dt>
          <dd className="num figure-sm">{formatSC(account?.sc ?? 0)}</dd>
        </div>
        <div>
          <dt>{t('wallet.gas')}</dt>
          <dd className="num">{`${(account?.eth ?? 0).toFixed(4)} ETH`}</dd>
        </div>
      </dl>
      {account && account.claimable > 0 ? (
        <Button variant="sign" block onClick={claim}>
          {t('wallet.claimToday', { amount: account.claimable })}
        </Button>
      ) : account?.nextClaimAt && account.tier > 0 ? (
        <p className="hint">{t('wallet.nextClaim', { time: formatDuration(account.nextClaimAt - now) })}</p>
      ) : null}
      {account && account.eth === 0 ? <FaucetHint /> : null}
      {links}
    </Sheet>
  )
}
