<!-- Code includes CSS: Using TailwindCSS, layout styles will be visible after installing TailwindCSS -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login Page -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-3 text-lg font-bold text-gray-900">{{ title }}</h2>
          <p class="mt-2 text-sm text-gray-600">{{ subTitle }}</p>
        </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="mt-8 space-y-8">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="Username" class="!rounded-button" clearable>
              <template #prefix>
                <el-icon><UserIcon /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="Password" class="!rounded-button" clearable>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="flex items-center justify-between">
            <el-checkbox v-model="loginForm.remember">Remember Password</el-checkbox>
          </div>
          <el-button type="primary" class="w-full !rounded-button" @click="handleLogin">Login</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useUserStore} from '@/pinia/user'
import {Lock, User as UserIcon} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {postUserLogin, User, ResultVo} from '@/api'

const router = useRouter()
const userStore = useUserStore()

const login = async (user_name: string, password: string): Promise<User> => {
  try {
    const result = await postUserLogin({username: user_name, password: password})
    // result is already user list data
    console.log('Login successful, user data:', result)
    if (!Array.isArray(result.data) || result.data.length === 0) {
      throw new Error('User does not exist')
    }
    const userData = result.data[0] as User
    console.log('Login successful, user data:', userData)
    return userData
  } catch (error) {
    console.error('Login failed:', error)
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
  // Username rules: length controlled by variables, letters, numbers or underscores
  const usernameRegex = new RegExp(`^[a-zA-Z0-9_]{${minLength},${maxLength}}$`)
  if (!value) {
    callback(new Error('Please enter username'))
  } else if (!usernameRegex.test(value)) {
    callback(new Error(`Username must be ${minLength}-${maxLength} characters long and can only contain letters, numbers or underscores`))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  // Password rules: length controlled by variables, must contain letters and numbers
  const passwordRegex = new RegExp(`^[a-zA-Z0-9_]{${minLength},${maxLength}}$`)
  if (!value) {
    callback(new Error('Please enter password'))
  } else if (!passwordRegex.test(value)) {
    callback(new Error(`Password must be ${minLength}-${maxLength} characters long and contain both letters and numbers`))
  } else {
    callback()
  }
}

const rules = {
  username: [{validator: validateUsername, trigger: 'blur'}],
  password: [{validator: validatePassword, trigger: 'blur'}]
}

const loginFormRef = ref()

// 保存登录信息到本地存储
const saveLoginInfo = (username: string, password: string, remember: boolean) => {
  if (remember) {
    localStorage.setItem(
      'loginInfo',
      JSON.stringify({
        username,
        password,
        remember
      })
    )
  } else {
    localStorage.removeItem('loginInfo')
  }
}

// 从本地存储读取登录信息
const loadLoginInfo = () => {
  const loginInfo = localStorage.getItem('loginInfo')
  if (loginInfo) {
    const {username, password, remember} = JSON.parse(loginInfo)
    loginForm.value.username = username
    loginForm.value.password = password
    loginForm.value.remember = remember
  }
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const user = await login(loginForm.value.username, loginForm.value.password)
        if (!user.id || !user.username || user.status !== 1) {
          throw new Error('User status is abnormal')
        }
        // 保存登录信息
        saveLoginInfo(loginForm.value.username, loginForm.value.password, loginForm.value.remember)
        // Set user information
        userStore.setUserInfo(user)
        // Set token
        userStore.setToken(user.id)
        // Load user permissions
        await userStore.loadPermissions()
        // Redirect after successful login
        router.push('/index')
      } catch (error: any) {
        console.error('Login failed:', error)
        ElMessage.error(error.message || 'Username does not exist or password is incorrect')
      }
    }
  })
}

// 组件挂载时加载保存的登录信息
onMounted(() => {
  loadLoginInfo()
})
</script>
<style scoped>
.el-input-number {
  width: 100%;
}
</style>
