<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0">
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-2 px-6">
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-800">权限设置</h2>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 数据内容 -->
      <div v-else class="grid grid-cols-1 gap-6">
        <!-- 角色列表 -->
        <div v-for="role in roles" :key="role.id" class="border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <el-tag :type="getRoleType(role.name)" size="large">{{ role.name }}</el-tag>
              <span class="text-gray-500 text-sm">{{ role.description }}</span>
            </div>
          </div>

          <!-- 权限模块 -->
          <div class="space-y-6">
            <!-- 产品规格管理权限 -->
            <div class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox v-model="role.allProdPermissions" :indeterminate="isIndeterminate(role, 'prod')" @change="val => handleModuleChange(val, role, 'prod')">
                  <span class="font-medium">产品规格管理</span>
                </el-checkbox>
              </div>

              <div class="ml-6 grid grid-cols-4 gap-4">
                <div>
                  <el-checkbox v-model="role.permissions.prodView" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'prod', 'prodView')">查看</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.prodCreate" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'prod', 'prodCreate')">创建</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.prodEdit" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'prod', 'prodEdit')">编辑</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.prodDelete" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'prod', 'prodDelete')">删除</el-checkbox>
                </div>
              </div>
            </div>

            <!-- 质检报告管理权限 -->
            <div class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox v-model="role.allSpecPermissions" :indeterminate="isIndeterminate(role, 'spec')" @change="val => handleModuleChange(val, role, 'spec')">
                  <span class="font-medium">质检报告管理</span>
                </el-checkbox>
              </div>

              <div class="ml-6 grid grid-cols-4 gap-4">
                <div>
                  <el-checkbox v-model="role.permissions.specView" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'spec', 'specView')">查看</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.specCreate" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'spec', 'specCreate')">创建</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.specEdit" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'spec', 'specEdit')">编辑</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.specDelete" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'spec', 'specDelete')">删除</el-checkbox>
                </div>
              </div>
            </div>

            <!-- 产品报价管理权限 -->
            <div class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox v-model="role.allQuotePermissions" :indeterminate="isIndeterminate(role, 'quote')" @change="val => handleModuleChange(val, role, 'quote')">
                  <span class="font-medium">产品报价管理</span>
                </el-checkbox>
              </div>

              <div class="ml-6 grid grid-cols-4 gap-4">
                <div>
                  <el-checkbox v-model="role.permissions.quoteView" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'quote', 'quoteView')">查看</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.quoteCreate" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'quote', 'quoteCreate')">创建</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.quoteEdit" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'quote', 'quoteEdit')">编辑</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.quoteDelete" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'quote', 'quoteDelete')">删除</el-checkbox>
                </div>
              </div>
            </div>

            <!-- 系统设置权限 -->
            <div class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox v-model="role.allSettingsPermissions" :indeterminate="isIndeterminate(role, 'settings')" @change="val => handleModuleChange(val, role, 'settings')">
                  <span class="font-medium">系统设置</span>
                </el-checkbox>
              </div>

              <div class="ml-6 grid grid-cols-4 gap-4">
                <div>
                  <el-checkbox v-model="role.permissions.settingsUsers" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'settings', 'settingsUsers')">用户管理</el-checkbox>
                </div>
                <div>
                  <el-checkbox v-model="role.permissions.settingsPermissions" :true-label="1" :false-label="0" @change="() => handlePermissionChange(role, 'settings', 'settingsPermissions')">权限设置</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, computed} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Check} from '@element-plus/icons-vue'
import {getId} from '@/utils/idUtils'
import {getPermissionsSearch, postPermissionsSave, putPermissionsUpdate} from '@/api'
import type {Permissions} from '@/api'

// 加载状态
const loading = ref(true)

// 用户角色类型枚举
enum UserRoleType {
  ADMIN = 0, // 管理员
  SUPPLIER = 1, // 供应商
  EMPLOYEE = 2 // 员工
}

// 角色数据结构
interface RoleWithPermissions {
  id: UserRoleType
  name: string
  description: string
  permissions: Permissions
  allProdPermissions: boolean
  allSpecPermissions: boolean
  allQuotePermissions: boolean
  allSettingsPermissions: boolean
}

// 创建默认权限对象
const createDefaultPermissions = (roleType: UserRoleType): Permissions => {
  return {
    id: '',
    roleType,
    prodView: 0,
    prodCreate: 0,
    prodEdit: 0,
    prodDelete: 0,
    specView: 0,
    specCreate: 0,
    specEdit: 0,
    specDelete: 0,
    quoteView: 0,
    quoteCreate: 0,
    quoteEdit: 0,
    quoteDelete: 0,
    settingsUsers: 0,
    settingsPermissions: 0
  }
}

// 角色数据
const roles = ref<RoleWithPermissions[]>([
  {
    id: UserRoleType.ADMIN,
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: createDefaultPermissions(UserRoleType.ADMIN),
    allProdPermissions: false,
    allSpecPermissions: false,
    allQuotePermissions: false,
    allSettingsPermissions: false
  },
  {
    id: UserRoleType.SUPPLIER,
    name: '供应商',
    description: '供应商用户，可以创建和查看自己的数据',
    permissions: createDefaultPermissions(UserRoleType.SUPPLIER),
    allProdPermissions: false,
    allSpecPermissions: false,
    allQuotePermissions: false,
    allSettingsPermissions: false
  },
  {
    id: UserRoleType.EMPLOYEE,
    name: '员工',
    description: '员工用户，可以管理所有数据',
    permissions: createDefaultPermissions(UserRoleType.EMPLOYEE),
    allProdPermissions: false,
    allSpecPermissions: false,
    allQuotePermissions: false,
    allSettingsPermissions: false
  }
])

// 获取角色标签类型
const getRoleType = (role: string) => {
  const map: Record<string, string> = {
    管理员: 'danger',
    供应商: 'warning',
    员工: 'info'
  }
  return map[role] || 'info'
}

// 检查模块权限是否部分选中
const isIndeterminate = (role: RoleWithPermissions, moduleId: string) => {
  if (moduleId === 'prod') {
    const permissions = [Number(role.permissions.prodView) === 1, Number(role.permissions.prodCreate) === 1, Number(role.permissions.prodEdit) === 1, Number(role.permissions.prodDelete) === 1]
    return permissions.some(Boolean) && !permissions.every(Boolean)
  } else if (moduleId === 'spec') {
    const permissions = [Number(role.permissions.specView) === 1, Number(role.permissions.specCreate) === 1, Number(role.permissions.specEdit) === 1, Number(role.permissions.specDelete) === 1]
    return permissions.some(Boolean) && !permissions.every(Boolean)
  } else if (moduleId === 'quote') {
    const permissions = [Number(role.permissions.quoteView) === 1, Number(role.permissions.quoteCreate) === 1, Number(role.permissions.quoteEdit) === 1, Number(role.permissions.quoteDelete) === 1]
    return permissions.some(Boolean) && !permissions.every(Boolean)
  } else if (moduleId === 'settings') {
    const permissions = [Number(role.permissions.settingsUsers) === 1, Number(role.permissions.settingsPermissions) === 1]
    return permissions.some(Boolean) && !permissions.every(Boolean)
  }
  return false
}

// 更新权限到服务器
const updatePermission = async (role: RoleWithPermissions) => {
  try {
    const permissionData = {
      ...role.permissions,
      roleType: role.id
    }

    if (permissionData.id) {
      // 更新已有权限
      await putPermissionsUpdate(permissionData)
    } else {
      // 创建新权限
      permissionData.id = getId()
      await postPermissionsSave(permissionData)
      // 保存ID以便后续更新
      role.permissions.id = permissionData.id
    }

    // 显示轻量级提示
    ElMessage({
      message: '权限已更新',
      type: 'success',
      duration: 1000
    })
  } catch (error) {
    console.error('更新权限失败:', error)
    ElMessage.error('更新权限失败')
  }
}

// 处理模块权限变更
const handleModuleChange = (value: boolean, role: RoleWithPermissions, moduleId: string) => {
  const numValue = value ? 1 : 0

  if (moduleId === 'prod') {
    role.allProdPermissions = value
    role.permissions.prodView = numValue
    role.permissions.prodCreate = numValue
    role.permissions.prodEdit = numValue
    role.permissions.prodDelete = numValue
  } else if (moduleId === 'spec') {
    role.allSpecPermissions = value
    role.permissions.specView = numValue
    role.permissions.specCreate = numValue
    role.permissions.specEdit = numValue
    role.permissions.specDelete = numValue
  } else if (moduleId === 'quote') {
    role.allQuotePermissions = value
    role.permissions.quoteView = numValue
    role.permissions.quoteCreate = numValue
    role.permissions.quoteEdit = numValue
    role.permissions.quoteDelete = numValue
  } else if (moduleId === 'settings') {
    role.allSettingsPermissions = value
    role.permissions.settingsUsers = numValue
    role.permissions.settingsPermissions = numValue
  }

  // 即时更新到服务器
  updatePermission(role)
}

// 处理单个权限变更
const handlePermissionChange = (role: RoleWithPermissions, moduleId: string, permissionKey?: string) => {
  if (moduleId === 'prod') {
    const permissions = [Number(role.permissions.prodView) === 1, Number(role.permissions.prodCreate) === 1, Number(role.permissions.prodEdit) === 1, Number(role.permissions.prodDelete) === 1]
    role.allProdPermissions = permissions.every(Boolean)
  } else if (moduleId === 'spec') {
    const permissions = [Number(role.permissions.specView) === 1, Number(role.permissions.specCreate) === 1, Number(role.permissions.specEdit) === 1, Number(role.permissions.specDelete) === 1]
    role.allSpecPermissions = permissions.every(Boolean)
  } else if (moduleId === 'quote') {
    const permissions = [Number(role.permissions.quoteView) === 1, Number(role.permissions.quoteCreate) === 1, Number(role.permissions.quoteEdit) === 1, Number(role.permissions.quoteDelete) === 1]
    role.allQuotePermissions = permissions.every(Boolean)
  } else if (moduleId === 'settings') {
    const permissions = [Number(role.permissions.settingsUsers) === 1, Number(role.permissions.settingsPermissions) === 1]
    role.allSettingsPermissions = permissions.every(Boolean)
  }

  // 即时更新到服务器
  updatePermission(role)
}

// 更新全选状态
const updateAllPermissionsState = (role: RoleWithPermissions) => {
  // 产品规格管理
  const prodPermissions = [Number(role.permissions.prodView) === 1, Number(role.permissions.prodCreate) === 1, Number(role.permissions.prodEdit) === 1, Number(role.permissions.prodDelete) === 1]
  role.allProdPermissions = prodPermissions.every(Boolean)

  // 质检报告管理
  const specPermissions = [Number(role.permissions.specView) === 1, Number(role.permissions.specCreate) === 1, Number(role.permissions.specEdit) === 1, Number(role.permissions.specDelete) === 1]
  role.allSpecPermissions = specPermissions.every(Boolean)

  // 产品报价管理
  const quotePermissions = [Number(role.permissions.quoteView) === 1, Number(role.permissions.quoteCreate) === 1, Number(role.permissions.quoteEdit) === 1, Number(role.permissions.quoteDelete) === 1]
  role.allQuotePermissions = quotePermissions.every(Boolean)

  // 系统设置
  const settingsPermissions = [Number(role.permissions.settingsUsers) === 1, Number(role.permissions.settingsPermissions) === 1]
  role.allSettingsPermissions = settingsPermissions.every(Boolean)
}

// 初始化默认权限
const initializeDefaultPermissions = async () => {
  // 管理员默认拥有所有权限
  const adminRole = roles.value.find(r => r.id === UserRoleType.ADMIN)
  if (adminRole) {
    Object.keys(adminRole.permissions).forEach(key => {
      if (key !== 'id' && key !== 'roleType') {
        ;(adminRole.permissions as any)[key] = 1
      }
    })
    updateAllPermissionsState(adminRole)
    await updatePermission(adminRole)
  }

  // 供应商默认权限
  const supplierRole = roles.value.find(r => r.id === UserRoleType.SUPPLIER)
  if (supplierRole) {
    supplierRole.permissions.prodView = 1
    supplierRole.permissions.prodCreate = 1
    supplierRole.permissions.quoteView = 1
    supplierRole.permissions.quoteCreate = 1
    updateAllPermissionsState(supplierRole)
    await updatePermission(supplierRole)
  }

  // 员工默认权限
  const employeeRole = roles.value.find(r => r.id === UserRoleType.EMPLOYEE)
  if (employeeRole) {
    // 产品和质检报告的所有权限
    employeeRole.permissions.prodView = 1
    employeeRole.permissions.prodCreate = 1
    employeeRole.permissions.prodEdit = 1
    employeeRole.permissions.prodDelete = 1
    employeeRole.permissions.specView = 1
    employeeRole.permissions.specCreate = 1
    employeeRole.permissions.specEdit = 1
    employeeRole.permissions.specDelete = 1
    employeeRole.permissions.quoteView = 1
    employeeRole.permissions.quoteCreate = 1
    employeeRole.permissions.quoteEdit = 1
    employeeRole.permissions.quoteDelete = 1
    updateAllPermissionsState(employeeRole)
    await updatePermission(employeeRole)
  }
}

// 加载权限数据
const loadPermissions = async () => {
  loading.value = true
  try {
    const res = await getPermissionsSearch()
    if (res.code === '200') {
      if (res.data && res.data.length > 0) {
        // 将后端数据映射到前端角色
        res.data.forEach((permission: Permissions) => {
          const roleIndex = roles.value.findIndex(r => r.id === permission.roleType)
          if (roleIndex !== -1) {
            // 更新权限数据
            roles.value[roleIndex].permissions = permission

            // 更新全选状态
            updateAllPermissionsState(roles.value[roleIndex])
          }
        })
      } else {
        // 如果后端没有数据，初始化默认权限
        initializeDefaultPermissions()
      }
    } else {
      ElMessage.error(res.message || '获取权限数据失败')
    }
  } catch (error) {
    console.error('获取权限数据失败:', error)
    ElMessage.error('获取权限数据失败')
    // 如果获取失败，初始化默认权限
    initializeDefaultPermissions()
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(() => {
  loadPermissions()
})
</script>
