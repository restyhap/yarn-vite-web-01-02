<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          企业表单管理系统
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          请登录您的账号
        </p>
      </div>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        class="mt-8 space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="rounded-md shadow-sm -space-y-px">
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名"
              :prefix-icon="User"
              size="large"
            />
          </el-form-item>
          
          <el-form-item prop="password" class="mt-4">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>
        </div>

        <div class="flex items-center justify-between">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-button type="text" @click="handleForgotPassword">忘记密码？</el-button>
        </div>

        <div>
          <el-button
            type="primary"
            class="w-full"
            size="large"
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/user'
import { UserRoleType, UserStatus } from '@/constants/enums'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

// 表单数据
const formData = ref({
  username: '',
  password: ''
})

// 表单验证规则
const rules = ref<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
})

// 处理登录
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      // 模拟登录API响应
      setTimeout(() => {
        loading.value = false
        ElMessage.success('登录成功')
        const userStore = useUserStore()
        
        // 模拟登录返回的用户数据
        const mockUserData = {
          id: '1',
          username: formData.value.username,
          password: '',
          roleType: UserRoleType.EMPLOYEE,
          status: UserStatus.ENABLED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        userStore.setUserInfo(mockUserData)
        userStore.setToken('mock-token')
        router.push('/index')
      }, 1000)
    }
  })
}

// 处理忘记密码
const handleForgotPassword = () => {
  ElMessage.info('请联系系统管理员重置密码')
}
</script> 