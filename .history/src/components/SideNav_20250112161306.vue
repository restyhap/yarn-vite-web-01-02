<template>
  <div class="w-64 bg-white h-screen shadow-lg flex flex-col">
    <!-- 顶部系统信息 -->
    <div class="p-4 border-b">
      <h1 class="text-xl font-bold text-gray-800">企业表单管理系统</h1>
    </div>

    <!-- 用户信息区 -->
    <div class="p-4 border-b flex items-center gap-3">
      <el-avatar :size="40" :icon="User" />
      <div class="flex flex-col">
        <span class="font-medium text-gray-800">{{ userName }}</span>
        <span class="text-sm text-gray-500">{{ userRole }}</span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      class="border-0 flex-1"
      :default-active="activeMenu"
      @select="handleSelect"
      :router="true"
    >
      <el-sub-menu index="/spec">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>规格表管理</span>
        </template>
        <el-menu-item index="/spec/list">
          <el-icon><View /></el-icon>
          查看规格表
        </el-menu-item>
        <el-menu-item index="/spec/create">
          <el-icon><Plus /></el-icon>
          创建规格表
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/quote">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>报价单管理</span>
        </template>
        <el-menu-item index="/quote/list">
          <el-icon><View /></el-icon>
          查看报价单
        </el-menu-item>
        <el-menu-item index="/quote/create">
          <el-icon><Plus /></el-icon>
          创建报价单
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="/settings">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </template>
        <el-menu-item index="/settings/users">
          <el-icon><User /></el-icon>
          用户管理
        </el-menu-item>
        <el-menu-item index="/settings/permissions">
          <el-icon><Lock /></el-icon>
          权限设置
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 底部操作区 -->
    <div class="p-4 border-t">
      <el-button type="text" class="w-full flex items-center justify-center gap-2" @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Document,
  Setting,
  User,
  Lock,
  View,
  Plus,
  SwitchButton
} from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';

const router = useRouter();
const activeMenu = ref('/spec/list');

// 用户信息
const userName = ref('王经理');
const userRole = ref('系统管理员');

const handleSelect = (index: string) => {
  console.log('导航到:', index);
};

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    router.push('/login');
  }).catch(() => {});
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #f0f9ff;
}
</style> 