import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
// 配置别名
const resolve = (dir) => path.resolve(__dirname, dir)

// https://vite.dev/config/

export default defineConfig({
  base: '/',
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    }
  },
  plugins: [vue()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  build: {
    target: 'modules',
    outDir: 'dist',
    assetsPublicPath: '/',
    sourcemap: false, // 不生成 source map
    minify: 'terser' // 混淆器
  },
})

