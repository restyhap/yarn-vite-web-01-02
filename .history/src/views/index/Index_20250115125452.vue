<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2024-11-03 12:13:16
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-15 12:54:51
 * @FilePath: /yarn-vite-web-01-02/src/views/index/Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 侧边导航栏 -->
    <SideNav />
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import { SideNav } from '@/components/SideNav.vue';
</script>

<style scoped>
.el-button {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
