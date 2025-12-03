import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 代理配置：只要请求路径以 /system 开头
      '/dev-api': {
        target: 'http://127.0.0.1:19090/system', // 转发给后端
        changeOrigin: true,
        // 如果后端接口本身就包含 /dev-api，这行就不需要；
        // 如果后端接口是 /sysUser/login 而没有 /dev-api，则需要 rewrite 去掉它
        rewrite: (path) => path.replace(/^\/dev-api/, '') 
      }
    }
  }
})
