// Route table (01-brief/information-architecture.md). Every page is its own lazy chunk; marketing and legal routes are
// prerendered to static HTML at build time (ADR-F1), app routes boot from the SPA shell.
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type Loader = () => Promise<{ default: ComponentType<object> }>

export interface RouteDef {
  path: string
  load: Loader
  Page: LazyExoticComponent<ComponentType<object>>
  prerender?: string[]
}

const route = (path: string, load: Loader, prerender?: string[]): RouteDef => ({ path, load, Page: lazy(load), prerender })

export const LEARN_SLUGS = ['window', 'graduation', 'season-credit', 'fees', 'risks'] as const
export const LEGAL_DOCS = ['terms', 'privacy', 'risk', 'restricted', 'takedown', 'law-enforcement'] as const

export const routes: RouteDef[] = [
  route('/', () => import('../pages/Landing'), ['/']),
  route('/discover', () => import('../pages/Discover')),
  route('/t/:token/fairness', () => import('../pages/TokenFairness')),
  route('/t/:token/holders', () => import('../pages/TokenHolders')),
  route('/t/:token', () => import('../pages/Token')),
  route('/create', () => import('../pages/Create')),
  route('/verify', () => import('../pages/Verify')),
  route('/portfolio', () => import('../pages/Portfolio')),
  route('/creator', () => import('../pages/Creator')),
  route('/u/:address', () => import('../pages/Profile')),
  route('/season', () => import('../pages/Season')),
  route('/leaderboard', () => import('../pages/Leaderboard')),
  route('/governance', () => import('../pages/Governance')),
  route('/status', () => import('../pages/Status')),
  route('/learn', () => import('../pages/Learn'), ['/learn']),
  route('/learn/:slug', () => import('../pages/LearnArticle'), LEARN_SLUGS.map((s) => `/learn/${s}`)),
  route('/fees', () => import('../pages/Fees'), ['/fees']),
  route('/legal/:doc', () => import('../pages/Legal'), LEGAL_DOCS.map((d) => `/legal/${d}`)),
  route('/restricted', () => import('../pages/Restricted'), ['/restricted']),
  route('/maintenance', () => import('../pages/Maintenance'), ['/maintenance']),
  route('/_design', () => import('../pages/DesignGallery')),
]

export const notFound = route('*', () => import('../pages/NotFound'), ['/404'])

const toRegex = (path: string) => new RegExp(`^${path.replace(/:[^/]+/g, '[^/]+')}/?$`)
const matchers = routes.map((r) => ({ r, re: toRegex(r.path) }))

export const matchRoute = (pathname: string) => matchers.find((m) => m.re.test(pathname))?.r ?? notFound
export const preloadRoute = (pathname: string) => matchRoute(pathname).load()
export const prerenderPaths = () => [...routes, notFound].flatMap((r) => r.prerender ?? [])
