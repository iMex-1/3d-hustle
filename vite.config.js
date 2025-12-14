import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React 19 features
      babel: {
        plugins: [
          // Enable React Compiler if available
          // ['babel-plugin-react-compiler', {}]
        ]
      }
    })
  ],

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    historyApiFallback: true,
    // Enable HMR optimizations
    hmr: {
      overlay: true
    }
  },

  // Preview server configuration
  preview: {
    port: 4173,
    historyApiFallback: true,
  },

  // Build optimizations
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database'],
          xeokit: ['@xeokit/xeokit-sdk'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    // Increase chunk size warning limit for 3D assets
    chunkSizeWarningLimit: 1000
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/database',
      'framer-motion',
      'lucide-react'
    ],
    exclude: ['@xeokit/xeokit-sdk'] // Large 3D library
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}'
      ]
    }
  },

  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
})
