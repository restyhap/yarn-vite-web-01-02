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
      <!-- 顶部操作区 -->
      <div class="mb-6 flex items-center justify-between">
        <el-button @click="handleBack" class="!px-3">
          <el-icon class="mr-1"><Back /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleExportWord">
          <el-icon class="mr-1"><Document /></el-icon>
          导出Word文档
        </el-button>
      </div>

      <!-- 基本信息 -->
      <el-descriptions
        title="基本信息"
        :column="3"
        border
        class="mb-6"
      >
        <el-descriptions-item label="产品代码">{{ productInfo.tccode }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ productInfo.supplier }}</el-descriptions-item>
        <el-descriptions-item label="供应商代码">{{ productInfo.supplier_code }}</el-descriptions-item>
      </el-descriptions>

      <!-- 17张表信息 -->
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 表1：产品信息 -->
        <el-tab-pane label="产品信息" name="table1">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="产品名称">{{ specTables.table1?.product_name }}</el-descriptions-item>
            <el-descriptions-item label="产品型号">{{ specTables.table1?.model }}</el-descriptions-item>
            <el-descriptions-item label="产品规格">{{ specTables.table1?.specification }}</el-descriptions-item>
            <el-descriptions-item label="产品材质">{{ specTables.table1?.material }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 表2：包装信息 -->
        <el-tab-pane label="包装信息" name="table2">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="包装方式">{{ specTables.table2?.packaging_method }}</el-descriptions-item>
            <el-descriptions-item label="包装尺寸">{{ specTables.table2?.package_size }}</el-descriptions-item>
            <el-descriptions-item label="装箱数量">{{ specTables.table2?.quantity_per_box }}</el-descriptions-item>
            <el-descriptions-item label="包装重量">{{ specTables.table2?.package_weight }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 表3：质量标准 -->
        <el-tab-pane label="质量标准" name="table3">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="执行标准">{{ specTables.table3?.quality_standard }}</el-descriptions-item>
            <el-descriptions-item label="检验项目">{{ specTables.table3?.inspection_items }}</el-descriptions-item>
            <el-descriptions-item label="合格标准">{{ specTables.table3?.acceptance_criteria }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 其他表格可以按照类似方式添加... -->
        <el-tab-pane label="更多信息" name="more">
          <div class="text-gray-500 text-center py-4">
            更多表格信息正在开发中...
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productInfo = ref<any>({})
const activeTab = ref('table1')
const specTables = ref<any>({})

// 获取产品信息
const fetchProductInfo = async () => {
  try {
    // TODO: 这里应该调用实际的API获取数据
    // 目前使用模拟数据
    productInfo.value = {
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001'
    }

    // 模拟17张表的数据
    specTables.value = {
      table1: {
        product_name: '样品沙发',
        model: 'SF-001',
        specification: '200*90*85cm',
        material: '皮革/实木'
      },
      table2: {
        packaging_method: '纸箱+气泡膜',
        package_size: '210*100*95cm',
        quantity_per_box: '1件/箱',
        package_weight: '45kg'
      },
      table3: {
        quality_standard: 'GB/T 22793-2008',
        inspection_items: '外观、结构、材质',
        acceptance_criteria: '符合国家标准要求'
      }
      // ... 其他表格数据
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

// 导出Word文档
const handleExportWord = async () => {
  try {
    // TODO: 实现导出Word文档的逻辑
    // 可以使用docx.js或其他库来生成Word文档
    ElMessage.success('文档导出中...')
    
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该调用后端API来生成和下载文档
    ElMessage.success('文档导出成功')
  } catch (error) {
    console.error('导出文档失败:', error)
    ElMessage.error('导出文档失败')
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchProductInfo()
  }
})
</script>

<style scoped>
.el-descriptions {
  margin-bottom: 1rem;
}

.el-tab-pane {
  padding: 20px;
}
</style>
