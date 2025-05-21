import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ],
    exclude: ['lucide-react']
  },
  build: {
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    commonjsOptions: {
      include: [/firebase/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query', 'framer-motion', 'lucide-react'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});