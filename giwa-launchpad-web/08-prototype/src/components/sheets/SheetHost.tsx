import { useEffect, useReducer, useRef } from 'react'
import type { LaunchDetail } from '../../data/types'
import { getWorld, type MockControls } from '../../data/mock/world'
import type { TxPlan } from '../../flows/tx'
import { t } from '../../lib/i18n'
import { closeSheet, setSettings, useSettings, useSheet, type DirectionSetting, type ThemeSetting } from '../../state/stores'
import { Button } from '../ui/Button'
import { Checkbox, RadioGroup } from '../ui/Controls'
import { Change } from '../ui/Feedback'
import { Sheet, type SheetHandle } from '../ui/Sheet'
import { AccountSheet, ConnectSheet, NetworkSheet, RiskSheet } from './WalletSheets'
import { FairnessSheet, PresignSheet, ReportSheet, ShareSheet } from './TradeSheets'

export function SheetHost() {
  const sheet = useSheet()
  if (!sheet) return null
  const done = (ok: boolean) => closeSheet(ok)
  const detail = sheet.props.detail as LaunchDetail
  switch (sheet.name) {
    case 'connect':
      return <ConnectSheet key="connect" onClose={done} />
    case 'network':
      return <NetworkSheet key="network" onClose={done} />
    case 'risk':
      return <RiskSheet key="risk" onClose={done} />
    case 'presign':
      return <PresignSheet key="presign" plan={sheet.props.plan as TxPlan} onClose={done} />
    case 'fairness':
      return <FairnessSheet key="fairness" detail={detail} onClose={done} />
    case 'account':
      return <AccountSheet key="account" onClose={done} />
    case 'share':
      return <ShareSheet key="share" detail={detail} onClose={done} />
    case 'report':
      return <ReportSheet key="report" detail={detail} onClose={done} />
    case 'settings':
      return <SettingsSheet key="settings" onClose={done} />
    case 'testnet':
      return <TestnetSheet key="testnet" onClose={done} />
    case 'mock':
      return <MockPanel key="mock" onClose={done} />
    default:
      return null
  }
}

function SettingsSheet({ onClose }: { onClose: (ok: boolean) => void }) {
  const settings = useSettings()
  return (
    <Sheet title={t('settings.title')} onClose={onClose} size="sm">
      <RadioGroup<ThemeSetting>
        name="theme"
        label={t('settings.theme')}
        value={settings.theme}
        onChange={(theme) => setSettings({ theme })}
        options={[
          { value: 'system', label: t('settings.themeSystem') },
          { value: 'light', label: t('settings.themeLight') },
          { value: 'dark', label: t('settings.themeDark') },
        ]}
      />
      <RadioGroup<DirectionSetting>
        name="direction"
        label={t('settings.direction')}
        value={settings.direction}
        onChange={(direction) => setSettings({ direction })}
        options={[
          { value: 'auto', label: t('settings.directionAuto') },
          { value: 'global', label: t('settings.directionGlobal') },
          { value: 'korean', label: t('settings.directionKorean') },
        ]}
      />
      <p className="direction-sample">
        <Change pct={4.2} />
        <Change pct={-1.3} />
      </p>
      <p className="hint">{t('settings.directionHelp')}</p>
      <p className="hint">{t('settings.saved')}</p>
    </Sheet>
  )
}

function TestnetSheet({ onClose }: { onClose: (ok: boolean) => void }) {
  const ref = useRef<SheetHandle>(null)
  const ack = () => {
    try {
      localStorage.setItem('bros:testnet-ack', '1')
    } catch {
      /* fine: shown again next visit */
    }
  }
  return (
    <Sheet
      sheetRef={ref}
      title={t('testnet.sheetTitle')}
      onClose={(ok) => {
        ack()
        onClose(ok)
      }}
      size="sm"
      className="sheet-testnet"
      footer={
        <Button block size="lg" variant="sign" onClick={() => ref.current?.close(true)}>
          {t('testnet.sheetAction')}
        </Button>
      }
    >
      <p>{t('testnet.sheetBody')}</p>
    </Sheet>
  )
}

/** Prototype-only control room: stress the stream and flip every degraded state the specs describe. */
function MockPanel({ onClose }: { onClose: (ok: boolean) => void }) {
  const world = getWorld()
  const [, force] = useReducer((x: number) => x + 1, 0)
  useEffect(() => world.onControls(force) as () => void, [world])
  const c = world.controls
  const set = (patch: Partial<MockControls>) => world.setControls(patch)
  const flag = (key: keyof MockControls, label: string) => (
    <Checkbox key={key} checked={Boolean(c[key])} onChange={(v) => set({ [key]: v } as Partial<MockControls>)}>
      {label}
    </Checkbox>
  )
  return (
    <Sheet title={t('mock.title')} description={t('mock.lead')} onClose={onClose} size="md" className="sheet-mock">
      <RadioGroup
        name="mock-rate"
        layout="row"
        label={t('mock.stream')}
        value={String(c.rate)}
        onChange={(v) => set({ rate: Number(v) })}
        options={['0', '3', '10', '50', '200', '500'].map((r) => ({ value: r, label: r }))}
      />
      <RadioGroup
        name="mock-delivery"
        layout="row"
        label={t('mock.delivery')}
        value={c.delivery}
        onChange={(delivery) => set({ delivery })}
        options={[
          { value: 'gateway', label: t('mock.gateway') },
          { value: 'raw', label: t('mock.raw') },
        ]}
      />
      <p className="hint num" aria-live="off">
        {t('mock.measured', { events: world.meter.eventsPerSec, frame: world.meter.frameP95 })}
      </p>
      <fieldset className="check-group">
        <legend>{t('mock.conditions')}</legend>
        {flag('indexerLag', t('mock.indexerLag'))}
        {flag('chainSlow', t('mock.chainSlow'))}
        {flag('paused', t('mock.paused'))}
        {flag('pendingChange', t('mock.pendingChange'))}
        {flag('rateLimitNext', t('mock.rateLimit'))}
        {flag('apiErrorNext', t('mock.apiError'))}
      </fieldset>
      <fieldset className="check-group">
        <legend>{t('mock.walletTitle')}</legend>
        {flag('wrongNetwork', t('mock.wrongNetwork'))}
        {flag('chainMissing', t('mock.chainMissing'))}
        {flag('rejectNext', t('mock.rejectNext'))}
        {flag('noEth', t('mock.noEth'))}
      </fieldset>
      <RadioGroup
        name="mock-tier"
        layout="row"
        label={t('mock.tier')}
        value={String(c.attestationTier)}
        onChange={(v) => set({ attestationTier: Number(v) as 0 | 1 | 2 })}
        options={['0', '1', '2'].map((v) => ({ value: v, label: v }))}
      />
      <RadioGroup
        name="mock-outcome"
        layout="row"
        label={t('mock.txOutcome')}
        value={c.outcome}
        onChange={(outcome) => set({ outcome })}
        options={[
          { value: 'success', label: t('mock.outcomeSuccess') },
          { value: 'slippage', label: t('mock.outcomeSlippage') },
          { value: 'reverted', label: t('mock.outcomeReverted') },
          { value: 'timeout', label: t('mock.outcomeTimeout') },
        ]}
      />
      <Button variant="secondary" onClick={() => world.resetAsNewUser()}>
        {t('mock.newUser')}
      </Button>
    </Sheet>
  )
}
