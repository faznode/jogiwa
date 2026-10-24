// /t/:token/fairness: the six rows in full with "what this means for you", manifest hash and explorer link `[F06]`.
import { useLaunch } from '../data/hooks'
import { Page } from '../components/layout/Page'
import { FairnessCard, SignHeader } from '../components/market/TokenParts'
import { displayName } from '../components/market/TokenBits'
import { LinkButton } from '../components/ui/Button'
import { EmptyState, ErrorState, LoadingBlock } from '../components/ui/Feedback'
import { usePageTitle } from '../lib/hooks'
import { t } from '../lib/i18n'
import { Link, useParams } from '../lib/router'

export default function TokenFairness() {
  const { token = '' } = useParams<{ token: string }>()
  const { detail: d, missing, error, retry } = useLaunch(token)
  usePageTitle(d ? `${t('fairness.title')}: ${displayName(d)}` : t('fairness.title'))
  return (
    <Page narrow className="token-sub" >
      {error ? <ErrorState error={error} onRetry={retry} /> : missing ? <EmptyState message={t('token.notFound')} action={<LinkButton href="/discover">{t('notFound.discover')}</LinkButton>} /> : !d ? <LoadingBlock rows={6} /> : (
        <>
          <nav aria-label={t('a11y.breadcrumb')} className="crumbs">
            <Link href={`/t/${d.address}`}>{displayName(d)}</Link>
          </nav>
          <SignHeader d={d} />
          <FairnessCard d={d} variant="full" />
        </>
      )}
    </Page>
  )
}
