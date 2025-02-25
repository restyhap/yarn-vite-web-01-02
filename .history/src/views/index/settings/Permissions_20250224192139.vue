<template>
  <div class="flex h-full items-center justify-center w-full">  <!-- 添加居中对齐 -->
    <div class="w-full max-w-7xl p-16">  <!-- 添加最大宽度和padding -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">权限设置</h2>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </div>

        <!-- 横向排列的角色列表 -->
        <div class="grid grid-cols-3 gap-6">
          <div v-for="role in roles" :key="role.id" class="border rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <el-tag :type="getRoleType(role.name)" size="large">{{ role.name }}</el-tag>
                <span class="text-gray-500 text-sm">{{ role.description }}</span>
              </div>
            </div>

            <!-- 权限模块 -->
            <div class="space-y-4">
              <div v-for="module in permissionModules" :key="module.id" class="border-t pt-4">
                <div class="flex items-center mb-2">
                  <el-checkbox
                    v-model="role.permissions[module.id]"
                    :indeterminate="isIndeterminate(role.id, module.id)"
                    @change="handleModuleChange($event, role.id, module.id)"
                  >
                    <span class="font-medium">{{ module.name }}</span>
                  </el-checkbox>
                </div>

                <div class=" flex flex-wrap items-center justify-center ">
                  <div v-for="permission in module.permissions" :key="permission.id">
                    <el-checkbox
                      v-model="role.permissions[`${module.id}_${permission.id}`]"
                      @change="handlePermissionChange(role.id, module.id)"
                    >
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Role, Module, Permission } from '@/types/permission'

// 角色列表
const roles = ref<Role[]>([
  {
    id: '1',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: {}
  },
  {
    id: '2',
    name: '供应商',
    description: '供应商用户，可以管理自己的数据',
    permissions: {}
  },
  {
    id: '3',
    name: '员工',
    description: '普通员工，可以查看和编辑数据',
    permissions: {}
  }
]);

// 权限模块
const permissionModules = ref<Module[]>([
  {
    id: 'prod',
    name: '规格表管理',
    permissions: [
      { id: 'view', name: '查看' },
      { id: 'create', name: '创建' },
      { id: 'edit', name: '编辑' },
      { id: 'delete', name: '删除' }
    ]
  },
  {
    id: 'spec',
    name: '质检表管理',
    permissions: [
      { id: 'view', name: '查看' },
      { id: 'create', name: '创建' },
      { id: 'edit', name: '编辑' },
      { id: 'delete', name: '删除' }
    ]
  },
  {
    id: 'quote',
    name: '报价单管理',
    permissions: [
      { id: 'view', name: '查看' },
      { id: 'create', name: '创建' },
      { id: 'edit', name: '编辑' },
      { id: 'delete', name: '删除' }
    ]
  }
]);

// 获取角色标签类型
const getRoleType = (roleName: string): string => {
  switch (roleName) {
    case '管理员':
      return 'danger';
    case '供应商':
      return 'warning';
    default:
      return 'info';
  }
};

// 检查模块权限是否部分选中
const isIndeterminate = (roleId: string, moduleId: string): boolean => {
  const role = roles.value.find((r: Role) => r.id === roleId);
  if (!role) return false;

  const module = permissionModules.value.find((m: Module) => m.id === moduleId);
  if (!module) return false;

  const permissions = module.permissions;
  const selectedCount = permissions.filter((p: Permission) => role.permissions[`${moduleId}_${p.id}`]).length;
  
  return selectedCount > 0 && selectedCount < permissions.length;
};

// 处理模块权限变更
const handleModuleChange = (checked: boolean, roleId: string, moduleId: string): void => {
  const role = roles.value.find((r: Role) => r.id === roleId);
  if (!role) return;

  const module = permissionModules.value.find((m: Module) => m.id === moduleId);
  if (!module) return;

  module.permissions.forEach((permission: Permission) => {
    role.permissions[`${moduleId}_${permission.id}`] = checked;
  });
};

// 处理单个权限变更
const handlePermissionChange = (roleId: string, moduleId: string): void => {
  const role = roles.value.find((r: Role) => r.id === roleId);
  if (!role) return;

  const module = permissionModules.value.find((m: Module) => m.id === moduleId);
  if (!module) return;

  const allChecked = module.permissions.every((p: Permission) => role.permissions[`${moduleId}_${p.id}`]);
  role.permissions[moduleId] = allChecked;
};

// 保存修改
const handleSave = (): void => {
  ElMessage.success('保存成功');
};
</script> 