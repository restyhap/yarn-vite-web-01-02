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
    <el-menu class="border-0 flex-1" :default-active="activeMenu" @select="handleSelect" :router="true" :unique-opened="true">
      <el-sub-menu v-for="menu in menuItems" :key="menu.index" :index="menu.index">
        <template #title>
          <el-icon>
            <component :is="menu.icon" />
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <el-menu-item v-for="subMenu in menu.children" :key="subMenu.index" :index="subMenu.index">
          <el-icon>
            <component :is="subMenu.icon" />
          </el-icon>
          <span>{{ subMenu.title }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 底部操作区 -->
    <div class="p-4 border-t">
      <el-button link class="w-full flex items-center justify-center gap-2" @click="handleLogout">
        <el-icon>
          <SwitchButton />
        </el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {Document, Setting, User, Lock, View, Plus, SwitchButton, Money} from '@element-plus/icons-vue'
import {ElMessageBox} from 'element-plus'
import {useUserStore} from '@/pinia/user'
import {storeToRefs} from 'pinia'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const {userInfo} = storeToRefs(userStore)

// 用户信息
const userName = userInfo.value?.username
const userRole = userInfo.value?.roleType === 0 ? '系统管理员' : userInfo.value?.roleType === 1 ? '供应商' : '员工'

// 当前激活的菜单项，使用 route.path
const activeMenu = ref(route.path)

// 监听路由变化
watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath
  }
)

// 菜单配置数据
const menuItems = [
  {
    index: '/prod',
    title: '规格表管理',
    icon: Document,
    children: [
      {
        index: '/prod/list',
        title: '查看规格表',
        icon: View
      },
      {
        index: '/prod/create',
        title: '创建规格表',
        icon: Plus
      }
    ]
  },
  {
    index: '/spec',
    title: '质检表管理',
    icon: Document,
    children: [
      {
        index: '/spec/list',
        title: '查看质检表',
        icon: View
      },
      {
        index: '/spec/create',
        title: '创建质检表',
        icon: Plus
      }
    ]
  },
  {
    index: '/quote',
    title: '报价单管理',
    icon: Document,
    children: [
      {
        index: '/quote/list',
        title: '查看报价单',
        icon: View
      },
      {
        index: '/quote/create',
        title: '创建报价单',
        icon: Plus
      }
    ]
  },
  {
    index: '/settings',
    title: '系统设置',
    icon: Setting,
    children: [
      {
        index: '/settings/users',
        title: '用户管理',
        icon: User
      },
      {
        index: '/settings/permissions',
        title: '权限设置',
        icon: Lock
      }
    ]
  }
]

const handleSelect = (key: string) => {
  router.push(key)
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      router.push('/')
    })
    .catch(() => {})
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #f0f9ff;
}
</style>
