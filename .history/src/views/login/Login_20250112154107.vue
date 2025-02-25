<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 登录页 -->
    <div  class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-lg w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div class="text-center">
          <h2 class="mt-3 text-lg font-bold text-gray-900">{{title}}</h2>
          <p class="mt-2 text-sm text-gray-600">{{subTitle}}</p>
        </div>
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            class="mt-8 space-y-8"
        >
          <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                class="!rounded-button"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                class="!rounded-button"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <div class="flex items-center justify-between">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800">忘记密码？</a>
          </div>
          <el-button type="primary" class="w-full !rounded-button" @click="handleLogin">登录</el-button>
        </el-form>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { ref} from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

let title = ref('TC China Product Documents System ');
let subTitle = ref('spaces people love');

const loginForm = ref({
  username: '',
  password: '',
  remember: false
});

const validateUsername = (rule: any, value: string, callback: any) => {
  // 用户名规则: 6-20位字母、数字或下划线
  const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;
  if (!value) {
    callback(new Error('请输入用户名'));
  } else if (!usernameRegex.test(value)) {
    callback(new Error('用户名必须为6-20位字母、数字或下划线'));
  } else {
    callback();
  }
};

const validatePassword = (rule: any, value: string, callback: any) => {
  // 密码规则: 至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (!passwordRegex.test(value)) {
    callback(new Error('密码必须至少8位，包含字母和数字'));
  } else {
    callback();
  }
};

const rules = {
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
};

const loginFormRef = ref();

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('登录成功');
      // 跳转首页
      setTimeout(() => {
        window.location.href = '/index';
      }, 1000);
    }
  });
};

</script>
<style scoped>
.el-input-number {
  width: 100%;
}
</style>
