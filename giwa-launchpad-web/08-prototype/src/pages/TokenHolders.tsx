// /t/:token/holders: holders quilt + full virtualised table with team and cluster labels `[F15]`.
import useSWR from 'swr'
import { useDataSource, useLaunch } from '../data/hooks'
import { Page } from '../components/layout/Page'
import { Quilt } from '../components/market/Quilt'
import { HoldersTable } from '../components/market/Tables'
import { SignHeader } from '../components/market/TokenParts'
import { displayName } from '../components/market/TokenBits'
import { LinkButton } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingBlock } from '../components/ui/Feedback'
import { usePageTitle } from '../lib/hooks'
import { t } from '../lib/i18n'
import { Link, useParams } from '../lib/router'

export default function TokenHolders() {
  const { token = '' } = useParams<{ token: string }>()
  const ds = useDataSource()
  const { detail: d, missing, error, retry } = useLaunch(token)
  const holders = useSWR(d ? ['holders', d.address] : null, () => ds.getHolders(d!.address))
  usePageTitle(d ? `${t('token.holdersAll')}: ${displayName(d)}` : t('token.holdersAll'))
  return (
    <Page className="token-sub" >
      {error ? <ErrorState error={error} onRetry={retry} /> : missing ? <EmptyState message={t('token.notFound')} action={<LinkButton href="/discover">{t('notFound.discover')}</LinkButton>} /> : !d ? <LoadingBlock rows={8} /> : (
        <div data-density="compact">
          <nav aria-label={t('a11y.breadcrumb')} className="crumbs">
            <Link href={`/t/${d.address}`}>{displayName(d)}</Link>
          </nav>
          <SignHeader d={d} />
          <h2 className="block-title">{t('token.holdersAll')}</h2>
          {holders.error ? <ErrorState error={holders.error} onRetry={() => holders.mutate()} /> : !holders.data ? <LoadingBlock rows={8} /> : (
            <>
              {holders.data.length ? <Quilt items={holders.data.map((h) => ({ id: h.wallet, value: h.tokens, kind: h.label === 'you' ? 'you' : h.label === 'team' ? 'team' : h.label === 'cluster' ? 'cluster' : 'normal' }))} label={`${holders.data.length} ${t('token.counterHolders')}`} max={120} /> : null}
              <HoldersTable holders={holders.data} ticker={d.ticker} virtual />
            </>
          )}
        </div>
      )}
    </Page>
  )
}
