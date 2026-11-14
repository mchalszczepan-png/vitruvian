import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app reads docs/build/mock-patients.json directly, so the dev server may read one level up.
export default defineConfig({
  plugins: [react()],
  server: { fs: { allow: ['..'] }, host: true },
})
