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
          <div class="flex items-center">
            <component :is="menu.icon" class="menu-icon" />
            <span>{{ menu.title }}</span>
          </div>
        </template>
        <el-menu-item v-for="subMenu in menu.children" :key="subMenu.index" :index="subMenu.index">
          <div class="flex items-center">
            <component :is="subMenu.icon" class="menu-icon" />
            <span>{{ subMenu.title }}</span>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 底部操作区 -->
    <div class="p-4 border-t">
      <el-button link class="w-full flex items-center justify-center gap-2" @click="handleLogout">
        <SwitchButton class="menu-icon" />
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {Document, Tools, User, Lock, View, Plus, SwitchButton, Money} from '@element-plus/icons-vue'
import {ElMessageBox} from 'element-plus'
import {useUserStore} from '@/pinia/user'
import {storeToRefs} from 'pinia'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const {userInfo} = storeToRefs(userStore)

// 用户信息
const userName = computed(() => userInfo.value?.username)
const userRole = computed(() => (userInfo.value?.roleType === 0 ? '系统管理员' : userInfo.value?.roleType === 1 ? '供应商' : '员工'))

// 当前激活的菜单项，使用 route.path
const activeMenu = ref(route.path)

// 监听路由变化
watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath
  },
  {immediate: true}
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
    icon: Tools,
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

// 确保在组件挂载后重新计算一次激活菜单
onMounted(() => {
  activeMenu.value = route.path
})
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #f0f9ff;
}

/* 图标样式 */
.menu-icon {
  width: 1em;
  height: 1em;
  margin-right: 8px;
  font-size: 18px;
  color: #606266;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 激活状态下的图标样式 */
.el-menu-item.is-active .menu-icon,
:deep(.el-menu-item.is-active .menu-icon) {
  color: var(--el-menu-active-color, #409eff);
}

/* 确保子菜单项正确对齐 */
:deep(.el-menu-item) {
  display: flex;
  align-items: center;
  padding-left: 20px !important;
}

/* 确保子菜单项内容正确对齐 */
:deep(.el-sub-menu .el-menu-item) {
  padding-left: 40px !important;
}

/* 修复子菜单标题样式 */
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

/* 修复同时具有 is-active 和 is-opened 类时图标消失的问题 */
:deep(.el-sub-menu.is-active.is-opened .el-sub-menu__title .menu-icon) {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* 确保所有状态下图标都可见 */
:deep(.el-sub-menu.is-opened .el-sub-menu__title .menu-icon),
:deep(.el-sub-menu.is-active .el-sub-menu__title .menu-icon) {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: var(--el-menu-active-color, #409eff);
}
</style>
