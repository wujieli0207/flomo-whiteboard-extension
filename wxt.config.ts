import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  manifest: {
    permissions: ['tabs', 'storage'],
    name: 'Flomo 白板',
    description: 'Flomo 白板工具',
  },
})
