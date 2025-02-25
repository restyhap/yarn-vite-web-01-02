<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-xl text-gray-600">页面不存在</p>
      <p class="mt-2 text-gray-500">抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" class="mt-8" @click="$router.push('/')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script> 