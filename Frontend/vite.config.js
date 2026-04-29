import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/response': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
      '/api': {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }
    },
  },
})
