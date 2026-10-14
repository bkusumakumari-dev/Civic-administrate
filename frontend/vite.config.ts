import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Local dev serves at the project root; the production build keeps the
  // GitHub Pages base path.
  base: command === 'build' ? '/CivicPulse-Nexus/' : '/',
}))
