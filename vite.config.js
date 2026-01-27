import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html',
        dashboard: './dashboard.html'
      }
    }
  },
  preview: {
    port: 3000,
    strictPort: false
  }
})
