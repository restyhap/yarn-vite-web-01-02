/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2024-11-03 11:49:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-14 12:35:54
 * @FilePath: /yarn-vite-web-01-02/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

