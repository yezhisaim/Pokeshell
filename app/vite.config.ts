import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { relayPlugin } from './relay-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), relayPlugin()],
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
})
