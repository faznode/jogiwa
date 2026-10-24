import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `host` + `allowedHosts` let the v0 preview proxy reach the dev server. Dev only: production ships static files (ADR-F1).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 3000, allowedHosts: true },
  preview: { host: true, port: 4173 },
  build: {
    target: 'es2022',
    sourcemap: 'hidden',
    manifest: true,
    modulePreload: { polyfill: false },
    chunkSizeWarningLimit: 1000,
  },
})
