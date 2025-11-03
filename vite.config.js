// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ВАЖНО: для https://bekzhanmost.github.io базовый путь — корень
})
