<template>
  <div class="info-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </template>
      
      <template #default>
        <div class="content-wrapper" v-if="formData">
          <!-- 顶部操作栏 -->
          <div class="top-actions">
            <div class="left-actions">
              <h2 class="page-title">产品规格详情</h2>
            </div>
            <div class="right-actions">
              <el-button type="primary" @click="handleExport">
                <el-icon><Document /></el-icon>
                导出Word文档
              </el-button>
            </div>
          </div>

          <!-- 其他内容保持不变 -->
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportToWord } from '../../../utils/exportToWord'

// ... 其他代码保持不变 ...

// 导出Word文档
const handleExport = async () => {
  try {
    await exportToWord(formData.value)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// ... 其他代码保持不变 ...
</script>

<style scoped>
/* ... 样式保持不变 ... */
</style> 