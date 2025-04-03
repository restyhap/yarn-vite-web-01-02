<template>
  <div class="w-64 bg-white h-screen shadow-lg flex flex-col">
    <!-- System Information -->
    <div class="p-4 border-b">
      <h1 class="text-xl font-bold text-gray-800">Enterprise Form Management System</h1>
    </div>

    <!-- User Information -->
    <div class="p-4 border-b flex items-center gap-3">
      <el-avatar :size="40" :icon="User" />
      <div class="flex flex-col">
        <span class="font-medium text-gray-800">{{ userName }}</span>
        <span class="text-sm text-gray-500">{{ userRole }}</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <el-menu class="border-0 flex-1" :default-active="activeMenu" @select="handleSelect" :router="true" :unique-opened="true">
      <!-- Product Specifications -->
      <el-sub-menu v-if="hasPermission(ModuleType.PROD, PermissionAction.VIEW)" index="/prod">
        <template #title>
          <div class="flex items-center">
            <Document class="menu-icon" />
            <span>Specifications</span>
          </div>
        </template>
        <el-menu-item index="/prod/list">
          <div class="flex items-center">
            <View class="menu-icon" />
            <span>View Specifications</span>
          </div>
        </el-menu-item>
        <el-menu-item v-if="hasPermission(ModuleType.PROD, PermissionAction.CREATE)" index="/prod/create">
          <div class="flex items-center">
            <Plus class="menu-icon" />
            <span>Create Specification</span>
          </div>
        </el-menu-item>
      </el-sub-menu>

      <!-- QC Reports -->
      <el-sub-menu v-if="hasPermission(ModuleType.SPEC, PermissionAction.VIEW)" index="/spec">
        <template #title>
          <div class="flex items-center">
            <Document class="menu-icon" />
            <span>QC Reports</span>
          </div>
        </template>
        <el-menu-item index="/spec/list">
          <div class="flex items-center">
            <View class="menu-icon" />
            <span>View QC Reports</span>
          </div>
        </el-menu-item>
        <el-menu-item v-if="hasPermission(ModuleType.SPEC, PermissionAction.CREATE)" index="/spec/create">
          <div class="flex items-center">
            <Plus class="menu-icon" />
            <span>Create QC Report</span>
          </div>
        </el-menu-item>
      </el-sub-menu>

      <!-- Quotations -->
      <el-sub-menu v-if="hasPermission(ModuleType.QUOTE, PermissionAction.VIEW)" index="/quote">
        <template #title>
          <div class="flex items-center">
            <Document class="menu-icon" />
            <span>Quotations</span>
          </div>
        </template>
        <el-menu-item index="/quote/list">
          <div class="flex items-center">
            <View class="menu-icon" />
            <span>View Quotations</span>
          </div>
        </el-menu-item>
        <el-menu-item v-if="hasPermission(ModuleType.QUOTE, PermissionAction.CREATE)" index="/quote/create">
          <div class="flex items-center">
            <Plus class="menu-icon" />
            <span>Create Quotation</span>
          </div>
        </el-menu-item>
      </el-sub-menu>

      <!-- System Settings -->
      <el-sub-menu v-if="hasSettingsPermission" index="/settings">
        <template #title>
          <div class="flex items-center">
            <Tools class="menu-icon" />
            <span>System Settings</span>
          </div>
        </template>
        <el-menu-item v-if="hasPermission(ModuleType.SETTINGS, PermissionAction.USERS)" index="/settings/users">
          <div class="flex items-center">
            <User class="menu-icon" />
            <span>User Management</span>
          </div>
        </el-menu-item>
        <el-menu-item v-if="hasPermission(ModuleType.SETTINGS, PermissionAction.PERMISSIONS)" index="/settings/permissions">
          <div class="flex items-center">
            <Lock class="menu-icon" />
            <span>Permission Settings</span>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- Bottom Action Area -->
    <div class="p-4 border-t">
      <el-button link class="w-full flex items-center justify-center gap-2" @click="handleLogout">
        <SwitchButton class="menu-icon" />
        Logout
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
import {ModuleType, PermissionAction, checkPermission} from '@/utils/permissionUtils'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const {userInfo} = storeToRefs(userStore)

// User information
const userName = computed(() => userInfo.value?.username)
const userRole = computed(() => (userInfo.value?.roleType === 0 ? 'System Admin' : userInfo.value?.roleType === 1 ? 'Supplier' : 'Staff'))

// Currently active menu item, using route.path
const activeMenu = ref(route.path)

// Watch route changes
watch(
  () => route.path,
  newPath => {
    activeMenu.value = newPath
  },
  {immediate: true}
)

// Permission cache
const permissionCache = ref<Record<string, boolean>>({})

// Check if has permission
const hasPermission = (module: ModuleType, action: PermissionAction) => {
  const key = `${module}_${action}`

  // Admin has all permissions by default
  if (userInfo.value?.roleType === 0) {
    return true
  }

  // If no token, means not logged in
  if (!userStore.token) {
    return false
  }

  // If in cache, return directly
  if (permissionCache.value[key] !== undefined) {
    return permissionCache.value[key]
  }

  // Otherwise check permission asynchronously and cache result
  checkPermission(module, action)
    .then(result => {
      permissionCache.value[key] = result
    })
    .catch(error => {
      console.error(`Permission check failed ${module}_${action}:`, error)
      permissionCache.value[key] = false
    })

  // Return false by default, waiting for async check result
  return false
}

// Whether to show system settings menu
const hasSettingsPermission = computed(() => {
  return hasPermission(ModuleType.SETTINGS, PermissionAction.USERS) || hasPermission(ModuleType.SETTINGS, PermissionAction.PERMISSIONS)
})

const handleSelect = (key: string) => {
  router.push(key)
}

const handleLogout = () => {
  ElMessageBox.confirm('Are you sure you want to logout?', 'Confirmation', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      userStore.clearUserInfo()
      router.push('/')
    })
    .catch(() => {})
}

// Ensure recalculating active menu after component mount
onMounted(() => {
  activeMenu.value = route.path

  // Preload permissions
  Object.values(ModuleType).forEach(module => {
    Object.values(PermissionAction).forEach(action => {
      checkPermission(module, action).then(result => {
        permissionCache.value[`${module}_${action}`] = result
      })
    })
  })
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
