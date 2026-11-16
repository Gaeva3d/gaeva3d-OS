/**
 * Vitest config for unit tests only — no Storybook, no browser, pure jsdom.
 *
 * Used by: npm run test:unit (local) and CI (test.yml)
 * The main vitest.config.js includes the Storybook addon which overrides
 * test.include; this config avoids that and targets src/** tests directly.
 */
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'tests'],
  },
})
