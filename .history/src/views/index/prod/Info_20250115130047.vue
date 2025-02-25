<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-15 13:00:44
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- 顶部返回按钮 -->
      <div class="mb-6 flex items-center">
        <el-button @click="handleBack" class="!px-3">
          <el-icon class="mr-1"><Back /></el-icon>
          返回列表
        </el-button>
      </div>

      <!-- 产品信息展示 -->
      <el-descriptions
        title="产品信息"
        :column="2"
        border
      >
        <el-descriptions-item label="产品代码">{{ productInfo.tccode }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ productInfo.supplier }}</el-descriptions-item>
        <el-descriptions-item label="供应商代码">{{ productInfo.supplier_code }}</el-descriptions-item>
        <el-descriptions-item label="供应商名称">{{ productInfo.supplier_name }}</el-descriptions-item>
        <el-descriptions-item label="防火标准">{{ productInfo.fire_standard }}</el-descriptions-item>
        <el-descriptions-item label="发货港口">{{ productInfo.shipping_port }}</el-descriptions-item>
        <el-descriptions-item label="20尺柜FOB价格">
          ¥{{ productInfo.fob_20_container_price?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </el-descriptions-item>
        <el-descriptions-item label="40尺柜FOB价格">
          ¥{{ productInfo.fob_40_container_price?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productInfo = ref<any>({})

// 获取产品信息
const fetchProductInfo = async () => {
  try {
    // TODO: 这里应该调用实际的API获取数据
    // 目前使用模拟数据
    productInfo.value = {
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      fob_20_container_price: 5000.00,
      fob_40_container_price: 9000.00,
      shipping_port: '宁波港'
    }
  } catch (error) {
    console.error('获取产品信息失败:', error)
    ElMessage.error('获取产品信息失败')
  }
}

// 返回列表页
const handleBack = () => {
  router.push('/prod/list')
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchProductInfo()
  }
})
</script>

<style scoped>

</style>
