/*
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-12 14:17:17
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-30 20:33:39
 * @FilePath: /yarn-vite-web-01-02/tailwind.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
}
