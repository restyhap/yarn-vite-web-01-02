<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <Suspense>
      <template #default>
        <component :is="SideNavComponent" />
      </template>
      <template #fallback>
        <div class="w-64 bg-white h-screen shadow-lg">加载中...</div>
      </template>
    </Suspense>
    <div class="flex-1 overflow-auto">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, markRaw } from 'vue';

const SideNavComponent = markRaw(defineAsyncComponent(() => 
  import('@/components/SideNav.vue')
));
</script>

<style scoped>
.el-button {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
