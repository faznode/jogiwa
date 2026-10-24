import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import solid from 'vite-plugin-solid';
import { resolve } from 'node:path';

const fw = process.env.FW || 'react';
const plugins = fw === 'solid' ? [solid()] : [react()];
const alias = fw === 'preact'
  ? { react: 'preact/compat', 'react-dom/client': 'preact/compat/client', 'react-dom': 'preact/compat', 'react/jsx-runtime': 'preact/jsx-runtime' }
  : {};

export default defineConfig({
  root: resolve(import.meta.dirname, fw),
  base: './',
  plugins,
  resolve: { alias },
  build: { outDir: resolve(import.meta.dirname, 'dist', fw), emptyOutDir: true, target: 'es2022', modulePreload: false },
  logLevel: 'warn',
});
