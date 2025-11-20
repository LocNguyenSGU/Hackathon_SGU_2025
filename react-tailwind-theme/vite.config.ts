import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://139.99.103.223:5556',
        changeOrigin: true,
        secure: false,
      },
      '/cf-api': {
        target: 'http://139.99.103.223:5556',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/cf-api/, '/api/v1'),
      },
    },
  },
})
