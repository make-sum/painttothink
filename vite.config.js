import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      exclude: /\.test\.(js|jsx|ts|tsx)$/,
    }),
    // Copy _redirects to dist for SPA routing
    {
      name: 'copy-redirects',
      closeBundle() {
        try {
          copyFileSync('public/_redirects', 'dist/_redirects')
        } catch (err) {
          console.warn('Could not copy _redirects:', err.message)
        }
      }
    }
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@contexts': resolve(__dirname, './src/contexts'),
    }
  },
  
  build: {
    target: 'es2020',
    minify: false, // Disabled for better error messages
    cssMinify: false, // Disabled for better error messages
    
    chunkSizeWarningLimit: 600,
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Check lucide-react first before react to ensure it gets its own chunk
            if (id.includes('lucide-react')) {
              return 'icons'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            if (id.includes('framer-motion')) {
              return 'animation'
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui'
            }
            return 'vendor'
          }
          
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('/')[0]
            return `page-${pageName.toLowerCase()}`
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    sourcemap: true, // Enabled for debugging
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
  },
  
  server: {
    host: true,
    port: 5173,
    hmr: true
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ],
    exclude: []
  },
  
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
})
