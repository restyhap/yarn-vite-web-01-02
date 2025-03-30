// vite.config.js
import { defineConfig } from "file:///Users/resty-mac/02-workspace/99_project/2025.01/yarn-vite-web-01-02/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/resty-mac/02-workspace/99_project/2025.01/yarn-vite-web-01-02/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import tailwindcss from "file:///Users/resty-mac/02-workspace/99_project/2025.01/yarn-vite-web-01-02/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/resty-mac/02-workspace/99_project/2025.01/yarn-vite-web-01-02/node_modules/autoprefixer/lib/autoprefixer.js";
var __vite_injected_original_dirname = "/Users/resty-mac/02-workspace/99_project/2025.01/yarn-vite-web-01-02";
var resolve = (dir) => path.resolve(__vite_injected_original_dirname, dir);
var vite_config_default = defineConfig({
  base: "/",
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  plugins: [vue()],
  server: {
    open: true,
    proxy: {
      "/img-proxy": {
        target: "https://img.shetu66.com",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/img-proxy/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve("src")
    }
  },
  build: {
    target: "modules",
    outDir: "dist",
    assetsPublicPath: "/",
    sourcemap: false,
    // 不生成 source map
    minify: "terser"
    // 混淆器
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcmVzdHktbWFjLzAyLXdvcmtzcGFjZS85OV9wcm9qZWN0LzIwMjUuMDEveWFybi12aXRlLXdlYi0wMS0wMlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3Jlc3R5LW1hYy8wMi13b3Jrc3BhY2UvOTlfcHJvamVjdC8yMDI1LjAxL3lhcm4tdml0ZS13ZWItMDEtMDIvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3Jlc3R5LW1hYy8wMi13b3Jrc3BhY2UvOTlfcHJvamVjdC8yMDI1LjAxL3lhcm4tdml0ZS13ZWItMDEtMDIvdml0ZS5jb25maWcuanNcIjsvKlxuICogQEF1dGhvcjogcmVzdHkgcmVzdHloYXBAaG90bWFpbC5jb21cbiAqIEBEYXRlOiAyMDI0LTExLTAzIDExOjQ5OjA5XG4gKiBATGFzdEVkaXRvcnM6IHJlc3R5IHJlc3R5aGFwQGhvdG1haWwuY29tXG4gKiBATGFzdEVkaXRUaW1lOiAyMDI1LTAxLTE0IDE0OjE3OjI2XG4gKiBARmlsZVBhdGg6IC95YXJuLXZpdGUtd2ViLTAxLTAyL3ZpdGUuY29uZmlnLmpzXG4gKiBARGVzY3JpcHRpb246IFx1OEZEOVx1NjYyRlx1OUVEOFx1OEJBNFx1OEJCRVx1N0Y2RSxcdThCRjdcdThCQkVcdTdGNkVgY3VzdG9tTWFkZWAsIFx1NjI1M1x1NUYwMGtvcm9GaWxlSGVhZGVyXHU2N0U1XHU3NzBCXHU5MTREXHU3RjZFIFx1OEZEQlx1ODg0Q1x1OEJCRVx1N0Y2RTogaHR0cHM6Ly9naXRodWIuY29tL09CS29ybzEva29ybzFGaWxlSGVhZGVyL3dpa2kvJUU5JTg1JThEJUU3JUJEJUFFXG4gKi9cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcInRhaWx3aW5kY3NzXCI7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbi8vIFx1OTE0RFx1N0Y2RVx1NTIyQlx1NTQwRFxuY29uc3QgcmVzb2x2ZSA9IChkaXIpID0+IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRpcilcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6ICcvJyxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogW3RhaWx3aW5kY3NzLCBhdXRvcHJlZml4ZXJdLFxuICAgIH1cbiAgfSxcbiAgcGx1Z2luczogW3Z1ZSgpXSxcbiAgc2VydmVyOiB7XG4gICAgb3BlbjogdHJ1ZSxcbiAgICBwcm94eToge1xuICAgICAgJy9pbWctcHJveHknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vaW1nLnNoZXR1NjYuY29tJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvaW1nLXByb3h5LywgJycpXG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZSgnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdtb2R1bGVzJyxcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNQdWJsaWNQYXRoOiAnLycsXG4gICAgc291cmNlbWFwOiBmYWxzZSwgLy8gXHU0RTBEXHU3NTFGXHU2MjEwIHNvdXJjZSBtYXBcbiAgICBtaW5pZnk6ICd0ZXJzZXInIC8vIFx1NkRGN1x1NkRDNlx1NTY2OFxuICB9LFxufSlcblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQVFBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFDakIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxrQkFBa0I7QUFaekIsSUFBTSxtQ0FBbUM7QUFjekMsSUFBTSxVQUFVLENBQUMsUUFBUSxLQUFLLFFBQVEsa0NBQVcsR0FBRztBQUlwRCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxTQUFTLENBQUMsYUFBYSxZQUFZO0FBQUEsSUFDckM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTLENBQUMsSUFBSSxDQUFDO0FBQUEsRUFDZixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxnQkFBZ0IsRUFBRTtBQUFBLE1BQ3BEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxLQUFLO0FBQUEsSUFDcEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixrQkFBa0I7QUFBQSxJQUNsQixXQUFXO0FBQUE7QUFBQSxJQUNYLFFBQVE7QUFBQTtBQUFBLEVBQ1Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
