import { Suspense } from 'react'
import { DataProvider } from '../data/hooks'
import { Route, Router, Switch } from '../lib/router'
import { WalletProvider } from '../wallet/wallet'
import { AppShell } from '../components/layout/Shell'
import { PageFallback } from '../components/layout/Page'
import { notFound, routes } from './routes'

export function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <Router ssrPath={ssrPath}>
      <DataProvider>
        <WalletProvider>
          <AppShell>
            <Suspense fallback={<PageFallback />}>
              <Switch>
                {routes.map((r) => (
                  <Route key={r.path} path={r.path} component={r.Page} />
                ))}
                <Route component={notFound.Page} />
              </Switch>
            </Suspense>
          </AppShell>
        </WalletProvider>
      </DataProvider>
    </Router>
  )
}
