import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
    },
  },
  define: {
    'process.env': {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          stripe: ['@stripe/stripe-js'],
          supabase: ['@supabase/supabase-js'],
          lucide: ['lucide-react'],
          vendor: ['clsx', 'zod', 'fuse.js'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
})
