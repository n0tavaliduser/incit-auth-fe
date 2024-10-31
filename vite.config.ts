import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://incit-auth-be-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
}) 