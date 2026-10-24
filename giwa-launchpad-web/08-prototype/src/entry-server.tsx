// Build-time prerender (ADR-F1): renders a route to static HTML. `prerenderToNodeStream` waits for lazy route chunks.
import { prerenderToNodeStream } from 'react-dom/static'
import { App } from './app/App'
import { prerenderPaths } from './app/routes'
import { MetaContext } from './lib/hooks'

export { prerenderPaths }

export async function render(url: string): Promise<{ html: string; title?: string }> {
  const meta: { title?: string } = {}
  const { prelude } = await prerenderToNodeStream(
    <MetaContext value={meta}>
      <App ssrPath={url} />
    </MetaContext>,
  )
  let html = ''
  for await (const chunk of prelude) html += typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk as Uint8Array)
  return { html, title: meta.title }
}
