<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0">
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-2 px-6">
        <div class="flex-1">
          <h2 class="text-xl font-bold text-gray-800">User Management</h2>
        </div>
        <div class="flex gap-2">
          <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="handleAdd">
            <el-icon class="mr-2"><Plus /></el-icon>
            Add User
          </el-button>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg shadow p-4">
      <el-table :data="tableData" border style="width: 100%" :max-height="450">
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="realName" label="Real Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="roleType" label="Role" width="120">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.roleType)">
              {{ getRoleLabel(scope.row.roleType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="120">
          <template #default="scope">
            <div class="flex items-center">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" @change="() => handleStatusChange(scope.row)" />
              <span class="ml-2" :class="scope.row.status === 1 ? 'text-green-600' : 'text-red-600'">
                {{ scope.row.status === 1 ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created At" width="180">
          <template #default="scope">
            {{ formatDateTime(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="scope">
            <div class="flex items-center justify-center space-x-3">
              <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
                Edit
              </el-button>
              <el-button type="danger" link size="small" style="padding: 0; min-width: 35px" @click="handleDelete(scope.row)">
                <el-icon><Delete /></el-icon>
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="flex justify-center mt-4">
        <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize" :total="total" :page-sizes="[10, 15, 20, 50, 100]" layout="sizes, prev, pager, next, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? 'Add User' : 'Edit User'" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" label-position="left" class="mx-auto">
        <div class="grid grid-cols-1 gap-2">
          <el-form-item label="Username" prop="username" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-input v-model="formData.username" placeholder="Please enter username" class="w-full !h-[38px]" />
          </el-form-item>

          <el-form-item label="Real Name" prop="realName" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-input v-model="formData.realName" placeholder="Please enter real name" class="w-full !h-[38px]" />
          </el-form-item>

          <el-form-item label="Password" prop="password" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-input v-model="formData.password" type="password" :placeholder="dialogType === 'edit' ? 'Leave blank to keep current password' : 'Please enter password'" class="w-full !h-[38px]" />
          </el-form-item>

          <el-form-item label="Email" prop="email" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-input v-model="formData.email" placeholder="Please enter email" class="w-full !h-[38px]" />
          </el-form-item>

          <el-form-item label="Phone" prop="phone" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-input v-model="formData.phone" placeholder="Please enter phone number" class="w-full !h-[38px]" />
          </el-form-item>

          <el-form-item label="Role" prop="roleType" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-1">
            <el-select v-model="formData.roleType" placeholder="Please select role" class="w-full" style="height: 38px" popper-class="!mt-1">
              <el-option :label="getRoleLabel(UserRoleType.ADMIN)" :value="UserRoleType.ADMIN" />
              <el-option :label="getRoleLabel(UserRoleType.SUPPLIER)" :value="UserRoleType.SUPPLIER" />
              <el-option :label="getRoleLabel(UserRoleType.EMPLOYEE)" :value="UserRoleType.EMPLOYEE" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer flex justify-end gap-4">
          <el-button @click="dialogVisible = false" class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm">Cancel</el-button>
          <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {Plus, Edit, Delete, Check} from '@element-plus/icons-vue'
import {ElMessageBox, ElMessage} from 'element-plus'
import type {FormInstance, FormRules} from 'element-plus'
import {getId} from '@/utils/idUtils'
import {getUserSearch, postUserSave, putUserUpdate, deleteUserRemoveById} from '@/api'
import type {User} from '@/api'
import type {DeleteUserRemoveByIdParams} from '@/api/controller/user-controller/deleteUserRemoveById'

// 用户角色类型枚举
enum UserRoleType {
  ADMIN = 0, // Administrator
  SUPPLIER = 1, // Supplier
  EMPLOYEE = 2 // Employee
}

// 用户状态枚举
enum UserStatus {
  DISABLED = 0, // Disabled
  ENABLED = 1 // Enabled
}

// 查询参数
const queryParams = ref({
  pageNum: 1,
  pageSize: 10
})

// 表格数据
const tableData = ref<User[]>([])
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()
const formData = ref<User>({
  username: '',
  password: '',
  realName: '',
  email: '',
  phone: '',
  roleType: UserRoleType.EMPLOYEE
})

// 表单验证规则
const rules = ref<FormRules>({
  username: [
    {required: true, message: 'Please enter username', trigger: 'blur'},
    {min: 3, max: 20, message: 'Length should be 3 to 20 characters', trigger: 'blur'}
  ],
  password: [
    {required: form => dialogType.value === 'add', message: 'Please enter password', trigger: 'blur'},
    {min: 3, message: 'Password must be at least 6 characters', trigger: 'blur'}
  ],
  roleType: [{required: true, message: 'Please select role', trigger: 'change'}]
})

// 获取角色标签类型
const getRoleType = (roleType?: number) => {
  const map: Record<number, string> = {
    [UserRoleType.ADMIN]: 'danger',
    [UserRoleType.SUPPLIER]: 'warning',
    [UserRoleType.EMPLOYEE]: 'info'
  }
  return map[roleType || 0] || 'info'
}

// 获取角色标签文本
const getRoleLabel = (roleType?: number) => {
  const map: Record<number, string> = {
    [UserRoleType.ADMIN]: 'Administrator',
    [UserRoleType.SUPPLIER]: 'Supplier',
    [UserRoleType.EMPLOYEE]: 'Employee'
  }
  return map[roleType || 0] || 'Unknown'
}

// 日期时间格式化函数
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await getUserSearch({
      params: {
        pageNum: queryParams.value.pageNum,
        pageSize: queryParams.value.pageSize
      }
    })
    if (res.code === '200') {
      tableData.value = res.data
      total.value = res.data.length // 或者从后端返回的total字段
    }
  } catch (error: unknown) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  }
}

// 处理分页
const handleSizeChange = (val: number) => {
  queryParams.value.pageSize = val
  loadUserList()
}

const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val
  loadUserList()
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    username: '',
    password: '',
    realName: '',
    email: '',
    phone: '',
    roleType: UserRoleType.EMPLOYEE
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: User) => {
  dialogType.value = 'edit'
  formData.value = {
    ...row,
    password: '' // 编辑时密码字段置空
  }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        if (row.id) {
          await deleteUserRemoveById({id: row.id})
          ElMessage.success('删除成功')
          loadUserList()
        }
      } catch (error) {
        console.error('删除用户失败:', error)
        ElMessage.error('删除用户失败')
      }
    })
    .catch(() => {})
}

// 修改用户状态
const handleStatusChange = async (row: User) => {
  try {
    await putUserUpdate({id: row.id, status: row.status})
    ElMessage.success('状态修改成功')
  } catch (error) {
    console.error('修改状态失败:', error)
    ElMessage.error('修改状态失败')
    // 恢复原状态
    row.status = row.status === UserStatus.ENABLED ? UserStatus.DISABLED : UserStatus.ENABLED
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          formData.value.id = getId()
          const res = await postUserSave(formData.value)
          if (res.code === '200') {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            loadUserList()
          } else {
            if (res.data.includes('Duplicate entry')) {
              ElMessage.error('用户名已存在,请重新定义用户名。')
            } else {
              ElMessage.error(res.message || '创建失败')
            }
          }
        } else {
          await putUserUpdate({
            id: formData.value.id,
            username: formData.value.username,
            realName: formData.value.realName,
            email: formData.value.email,
            phone: formData.value.phone,
            roleType: formData.value.roleType,
            password: formData.value.password || undefined // 只有当密码不为空时才发送
          })
          ElMessage.success('编辑成功')
        }
        dialogVisible.value = false
        loadUserList()
      } catch (error: unknown) {
        console.error('保存用户失败:', error)
        ElMessage.error('保存失败')
      }
    }
  })
}

// 初始化
onMounted(() => {
  loadUserList()
})
</script>
