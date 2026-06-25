import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Raise the warning threshold slightly — chunking handles the real problem
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — downloaded once, cached forever
          'vendor-react': ['react', 'react-dom'],
          // State management
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // UI / form libraries
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Data visualisation
          'vendor-charts': ['recharts'],
          // Date utilities
          'vendor-dates': ['date-fns'],
          // Mapping
          'vendor-map': ['mapbox-gl', 'react-map-gl'],
          // Icon set (large)
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
