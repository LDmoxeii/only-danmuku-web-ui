import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({
      // 使用普通 TypeScript 检查，避免 vueTsc 与最新 @vue/language-core 不兼容的问题
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,vue}"'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/video/enc/key': {
        target: 'http://localhost:8081/',
        changeOrigin: true,
      },
    }
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
        chunkFileNames(chunkInfo) {
          const parts = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : []
          const fileName = parts[parts.length - 2] || '[name]'
          return `js/${fileName}/[name].[hash].js`
        }
      }
    }
  }
})
