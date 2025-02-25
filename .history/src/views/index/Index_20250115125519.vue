<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 侧边导航栏 -->
    <SideNav />
    <router-view/>
  </div>
</template>

<script lang="ts" setup>
import SideNav from '@/components/SideNav.vue';
</script>

<style scoped>
.el-button {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
