<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">权限设置</h2>
        <el-button type="primary" @click="handleSave">保存修改</el-button>
      </div>

      <div class="grid grid-cols-1 gap-6">
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
            <div v-for="module in permissionModules" :key="module.id" class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox v-model="role.permissions[module.id]" :indeterminate="isIndeterminate(role.id, module.id)" @change="handleModuleChange($event, role.id, module.id)">
                  <span class="font-medium">{{ module.name }}</span>
                </el-checkbox>
              </div>

              <div class="ml-6 grid grid-cols-4 gap-4">
                <div v-for="permission in module.permissions" :key="permission.id">
                  <el-checkbox v-model="role.permissions[module.id + '_' + permission.id]" @change="handlePermissionChange(role.id, module.id)">
                    {{ permission.name }}
                  </el-checkbox>
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
import {ref} from 'vue'
import {ElMessage} from 'element-plus'

// 用户角色类型枚举
enum UserRoleType {
  ADMIN = 0, // 管理员
  SUPPLIER = 1, // 供应商
  EMPLOYEE = 2 // 员工
}

// 权限模块配置
const permissionModules = [
  {
    id: 'prod',
    name: '产品规格管理',
    permissions: [
      {id: 'view', name: '查看'},
      {id: 'create', name: '创建'},
      {id: 'edit', name: '编辑'},
      {id: 'delete', name: '删除'}
    ]
  },
  {
    id: 'quote',
    name: '产品报价管理',
    permissions: [
      {id: 'view', name: '查看'},
      {id: 'create', name: '创建'},
      {id: 'edit', name: '编辑'},
      {id: 'delete', name: '删除'}
    ]
  },
  {
    id: 'spec',
    name: '质检报告管理',
    permissions: [
      {id: 'view', name: '查看'},
      {id: 'create', name: '创建'},
      {id: 'edit', name: '编辑'},
      {id: 'delete', name: '删除'}
    ]
  }
]

// 角色数据
const roles = ref([
  {
    id: UserRoleType.ADMIN,
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: {
      prod: true,
      prod_view: true,
      prod_create: true,
      prod_edit: true,
      prod_delete: true,
      quote: true,
      quote_view: true,
      quote_create: true,
      quote_edit: true,
      quote_delete: true,
      spec: true,
      spec_view: true,
      spec_create: true,
      spec_edit: true,
      spec_delete: true
    }
  },
  {
    id: UserRoleType.SUPPLIER,
    name: '供应商',
    description: '供应商用户，可以创建和查看自己的数据',
    permissions: {
      prod: true,
      prod_view: true,
      prod_create: true,
      prod_edit: false,
      prod_delete: false,
      quote: true,
      quote_view: true,
      quote_create: true,
      quote_edit: false,
      quote_delete: false,
      spec: false,
      spec_view: false,
      spec_create: false,
      spec_edit: false,
      spec_delete: false
    }
  },
  {
    id: UserRoleType.EMPLOYEE,
    name: '员工',
    description: '员工用户，可以管理所有数据',
    permissions: {
      prod: true,
      prod_view: true,
      prod_create: true,
      prod_edit: true,
      prod_delete: true,
      quote: true,
      quote_view: true,
      quote_create: true,
      quote_edit: true,
      quote_delete: true,
      spec: true,
      spec_view: true,
      spec_create: true,
      spec_edit: true,
      spec_delete: true
    }
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
const isIndeterminate = (roleId: number, moduleId: string) => {
  const role = roles.value.find(r => r.id === roleId)
  if (!role) return false

  const module = permissionModules.find(m => m.id === moduleId)
  if (!module) return false

  const permissions = module.permissions.map(p => role.permissions[moduleId + '_' + p.id])
  return permissions.some(Boolean) && !permissions.every(Boolean)
}

// 处理模块权限变更
const handleModuleChange = (value: boolean, roleId: number, moduleId: string) => {
  const role = roles.value.find(r => r.id === roleId)
  if (!role) return

  const module = permissionModules.find(m => m.id === moduleId)
  if (!module) return

  role.permissions[moduleId] = value
  module.permissions.forEach(permission => {
    role.permissions[moduleId + '_' + permission.id] = value
  })
}

// 处理单个权限变更
const handlePermissionChange = (roleId: number, moduleId: string) => {
  const role = roles.value.find(r => r.id === roleId)
  if (!role) return

  const module = permissionModules.find(m => m.id === moduleId)
  if (!module) return

  const permissions = module.permissions.map(p => role.permissions[moduleId + '_' + p.id])
  role.permissions[moduleId] = permissions.every(Boolean)
}

// 保存修改
const handleSave = () => {
  // 更新 DEFAULT_PERMISSIONS
  const newPermissions = roles.value.reduce((acc, role) => {
    const rolePermissions = []
    for (const module of permissionModules) {
      for (const permission of module.permissions) {
        if (role.permissions[module.id + '_' + permission.id]) {
          rolePermissions.push({
            moduleId: module.id,
            action: permission.id
          })
        }
      }
    }
    acc[role.id] = rolePermissions
    return acc
  }, {} as Record<UserRoleType, any[]>)

  console.log('新的权限配置:', newPermissions)
  ElMessage.success('保存成功')
}
</script>
@/api/bak/user
