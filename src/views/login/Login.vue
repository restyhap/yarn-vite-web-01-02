<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 登录页 -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-3 text-lg font-bold text-gray-900">{{ title }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ subTitle }}</p>
        </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="mt-8 space-y-8">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名" class="!rounded-button" clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" class="!rounded-button" clearable>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="flex items-center justify-between">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          </div>
          <el-button type="primary" class="w-full !rounded-button" @click="handleLogin">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useUserStore} from '@/pinia/user'
import {Lock, User} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {User as IUser, postUserLogin} from '@/api'

const router = useRouter()
const userStore = useUserStore()

const login = async (user_name: string, password: string): Promise<IUser> => {
  try {
    const result = await postUserLogin({username: user_name, password: password})
    console.log('登录响应数据：', result)

    // result 已经是用户列表数据
    if (!Array.isArray(result) || result.length === 0) {
      throw new Error('用户不存在')
    }

    console.log('登录成功，用户数据：', result[0])
    return result[0]
  } catch (error) {
    console.error('登录失败：', error)
    throw error
  }
}

let title = ref('TC China Product Documents System ')
let subTitle = ref('spaces people love')
let minLength = 4
let maxLength = 16

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const validateUsername = (rule: any, value: string, callback: any) => {
  // 用户名规则: 使用变量控制长度，字母、数字或下划线
  const usernameRegex = new RegExp(`^[a-zA-Z0-9_]{${minLength},${maxLength}}$`)
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (!usernameRegex.test(value)) {
    callback(new Error(`用户名必须为${minLength}-${maxLength}位字母、数字或下划线`))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  // 密码规则: 使用变量控制长度，必须包含字母和数字
  // const passwordRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{${minLength},${maxLength}}$`);
  const passwordRegex = new RegExp(`^[a-zA-Z0-9_]{${minLength},${maxLength}}$`)
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (!passwordRegex.test(value)) {
    callback(new Error(`密码必须为${minLength}-${maxLength}位，且包含字母和数字`))
  } else {
    callback()
  }
}

const rules = {
  username: [{validator: validateUsername, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}]
}

const loginFormRef = ref()

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const user = await login(loginForm.value.username, loginForm.value.password)
        if (!user.id || !user.username || user.status !== 1) {
          throw new Error('用户状态异常')
        }
        // 设置用户信息
        userStore.setUserInfo(user)
        // 设置token
        userStore.setToken(user.id)
        // 加载用户权限
        await userStore.loadPermissions()
        // 登录成功后跳转
        router.push('/index')
      } catch (error: any) {
        console.error('登录失败：', error)
        ElMessage.error(error.message || '用户名不存在或密码错误')
      }
    }
  })
}
</script>
<style scoped>
.el-input-number {
  width: 100%;
}
</style>
