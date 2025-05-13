import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  server: {
    host: 'localhost',
    port: 5173,
    // Show meaningful error overlays
    hmr: { overlay: true }
  }
})
