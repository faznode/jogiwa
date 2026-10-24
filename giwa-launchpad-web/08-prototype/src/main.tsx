import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './app/App'
import { preloadRoute } from './app/routes'
import './styles/index.css'

const root = document.getElementById('root') as HTMLElement
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered marketing pages hydrate once their route chunk is in; app routes render from the empty shell.
if (root.firstElementChild) preloadRoute(window.location.pathname).finally(() => hydrateRoot(root, app))
else createRoot(root).render(app)
