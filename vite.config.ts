import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://api.ff.kireobat.eu',
    },
  },
})
