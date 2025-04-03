/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2024-11-03 11:49:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-01 18:15:42
 * @FilePath: /yarn-vite-web-01-02/vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import vue from '@vitejs/plugin-vue';
import autoprefixer from "autoprefixer";
import path from 'path';
import tailwindcss from "tailwindcss";
import {defineConfig} from 'vite';

// 配置别名
const resolve = (dir) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  css: {
    postcss: {
      // @ts-ignore
      plugins: [tailwindcss, autoprefixer],
    }
  },
  plugins: [vue()],
  server: {
    host: '0.0.0.0',  // 允许局域网访问
    port: 3000,
    strictPort: true,  // 如果端口被占用则报错
    hmr: {
      overlay: true,  // 当编译出错时，会在浏览器窗口上显示错误
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/img-proxy': {
        target: 'https://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-proxy/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('src'),
    },
  },
  build: {
    target: 'modules',
    outDir: 'dist',
    sourcemap: false,  // 生产环境关闭 sourcemap 以提升构建速度
    minify: 'esbuild',  // 使用 esbuild 进行压缩，比 terser 快
    reportCompressedSize: false,  // 禁用压缩大小报告
    chunkSizeWarningLimit: 1000,  // 调整区块大小警告的限制
    // 优化构建速度
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],  // 第三方库单独打包
        }
      },
      cache: true,  // 启用 rollup 缓存
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router'],  // 预构建这些依赖
    exclude: [],  // 排除不需要预构建的依赖
  },
})

