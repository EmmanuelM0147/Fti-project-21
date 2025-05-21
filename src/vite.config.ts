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
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion'
    ],
    esbuildOptions: {
      target: 'es2020',
      logLevel: 'info',
      sourcemap: true,
      supported: {
        'dynamic-import': true,
        'import-meta': true
      },
      plugins: []
    }
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query', 'framer-motion', 'lucide-react'],
          'program-pages': [
            './src/pages/programs/computer-technology',
            './src/pages/programs/vocational-studies',
            './src/pages/programs/construction-technologies'
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    esbuildOptions: {
      target: 'es2020',
      logLevel: 'info',
      sourcemap: true,
      supported: {
        'dynamic-import': true,
        'import-meta': true
      },
      legalComments: 'none',
      treeShaking: true
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
});