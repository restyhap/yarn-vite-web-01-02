<template>
  <div class="flex-1 p-8">  <!-- 使用和 List.vue 一样的基础布局 -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">权限设置</h2>
        <el-button type="primary" @click="handleSave">保存修改</el-button>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div v-for="role in roles" :key="role.id" class="border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <el-tag :type="getRoleType(role.roleType)" size="large">{{ getRoleName(role.roleType) }}</el-tag>
              <span class="text-gray-500 text-sm">{{ getRoleDescription(role.roleType) }}</span>
            </div>
          </div>

          <!-- 权限模块 -->
          <div class="space-y-4">
            <div v-for="module in permissionModules" :key="module.id" class="border-t pt-4">
              <div class="flex items-center mb-2">
                <el-checkbox
                  v-model="role[`${module.id}View`]"
                  :indeterminate="isIndeterminate(role, module.id)"
                  @change="handleModuleChange($event, role, module.id)"
                >
                  <span class="font-medium">{{ module.name }}</span>
                </el-checkbox>
              </div>

              <div class="grid grid-cols-4 gap-8">
                <div v-for="action in module.actions" :key="action.id">
                  <el-checkbox
                    v-model="role[`${module.id}${action.id}`]"
                    @change="handlePermissionChange(role, module.id)"
                  >
                    {{ action.name }}
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RoleType, type IPermission } from '@/types/permission'

interface PermissionModule {
  id: string;
  name: string;
  actions: { id: string; name: string; }[];
}

// 权限模块配置
const permissionModules = ref<PermissionModule[]>([
  {
    id: 'prod',
    name: '规格表管理',
    actions: [
      { id: 'View', name: '查看' },
      { id: 'Create', name: '创建' },
      { id: 'Edit', name: '编辑' },
      { id: 'Delete', name: '删除' }
    ]
  },
  {
    id: 'spec',
    name: '质检表管理',
    actions: [
      { id: 'View', name: '查看' },
      { id: 'Create', name: '创建' },
      { id: 'Edit', name: '编辑' },
      { id: 'Delete', name: '删除' }
    ]
  },
  {
    id: 'quote',
    name: '报价单管理',
    actions: [
      { id: 'View', name: '查看' },
      { id: 'Create', name: '创建' },
      { id: 'Edit', name: '编辑' },
      { id: 'Delete', name: '删除' }
    ]
  },
  {
    id: 'settings',
    name: '系统设置',
    actions: [
      { id: 'Users', name: '用户管理' },
      { id: 'Permissions', name: '权限设置' }
    ]
  }
]);

// 模拟后台数据
const roles = ref<IPermission[]>([
  {
    id: '20250224180000001',
    roleType: RoleType.ADMIN,
    prodView: 1,
    prodCreate: 1,
    prodEdit: 1,
    prodDelete: 1,
    specView: 1,
    specCreate: 1,
    specEdit: 1,
    specDelete: 1,
    quoteView: 1,
    quoteCreate: 1,
    quoteEdit: 1,
    quoteDelete: 1,
    settingsUsers: 1,
    settingsPermissions: 1
  },
  {
    id: '20250224180000002',
    roleType: RoleType.SUPPLIER,
    prodView: 1,
    prodCreate: 0,
    prodEdit: 0,
    prodDelete: 0,
    specView: 1,
    specCreate: 1,
    specEdit: 1,
    specDelete: 0,
    quoteView: 1,
    quoteCreate: 1,
    quoteEdit: 1,
    quoteDelete: 0,
    settingsUsers: 0,
    settingsPermissions: 0
  },
  {
    id: '20250224180000003',
    roleType: RoleType.EMPLOYEE,
    prodView: 1,
    prodCreate: 1,
    prodEdit: 1,
    prodDelete: 0,
    specView: 1,
    specCreate: 1,
    specEdit: 1,
    specDelete: 0,
    quoteView: 1,
    quoteCreate: 1,
    quoteEdit: 1,
    quoteDelete: 0,
    settingsUsers: 0,
    settingsPermissions: 0
  }
]);

// 获取角色名称
const getRoleName = (roleType: RoleType): string => {
  switch (roleType) {
    case RoleType.ADMIN:
      return '管理员';
    case RoleType.SUPPLIER:
      return '供应商';
    case RoleType.EMPLOYEE:
      return '员工';
  }
};

// 获取角色描述
const getRoleDescription = (roleType: RoleType): string => {
  switch (roleType) {
    case RoleType.ADMIN:
      return '系统管理员，拥有所有权限';
    case RoleType.SUPPLIER:
      return '供应商用户，可以管理自己的数据';
    case RoleType.EMPLOYEE:
      return '普通员工，可以查看和编辑数据';
  }
};

// 获取角色标签类型
const getRoleType = (roleType: RoleType): string => {
  switch (roleType) {
    case RoleType.ADMIN:
      return 'danger';
    case RoleType.SUPPLIER:
      return 'warning';
    default:
      return 'info';
  }
};

// 检查模块权限是否部分选中
const isIndeterminate = (role: IPermission, moduleId: string): boolean => {
  const module = permissionModules.value.find(m => m.id === moduleId);
  if (!module) return false;

  const permissions = module.actions;
  const selectedCount = permissions.filter(p => role[`${moduleId}${p.id}`] === 1).length;
  
  return selectedCount > 0 && selectedCount < permissions.length;
};

// 处理模块权限变更
const handleModuleChange = (checked: boolean, role: IPermission, moduleId: string): void => {
  const module = permissionModules.value.find(m => m.id === moduleId);
  if (!module) return;

  const value = checked ? 1 : 0;
  module.actions.forEach(action => {
    role[`${moduleId}${action.id}`] = value;
  });
};

// 处理单个权限变更
const handlePermissionChange = (role: IPermission, moduleId: string): void => {
  const module = permissionModules.value.find(m => m.id === moduleId);
  if (!module) return;

  const allChecked = module.actions.every(action => role[`${moduleId}${action.id}`] === 1);
  role[`${moduleId}View`] = allChecked ? 1 : 0;
};

// 保存修改
const handleSave = async () => {
  try {
    // TODO: 调用后台 API 保存权限设置
    ElMessage.success('保存成功');
  } catch (error) {
    ElMessage.error('保存失败');
  }
};
</script> 