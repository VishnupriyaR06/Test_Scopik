import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // this will proxy all requests starting with /api
      '/api': {
        target: 'https://lms.scopik.in',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
