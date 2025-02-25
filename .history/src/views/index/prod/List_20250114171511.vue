<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex-1 flex items-center gap-4">
          <el-input
            v-model="searchQuery"
            placeholder="搜索产品代码/供应商..."
            class="max-w-xs"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" :disabled="!selectedRows.length" @click="handleBatchExport">
            <el-icon class="mr-2"><Download /></el-icon>
            批量导出
          </el-button>
          <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
            <el-icon class="mr-2"><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button type="success" :disabled="!selectedRows.length" @click="handleBatchPublish">
            <el-icon class="mr-2"><Upload /></el-icon>
            批量发布
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tccode" label="产品代码" width="120" />
        <el-table-column prop="supplier" label="供应商" width="120" />
        <el-table-column prop="supplier_code" label="供应商代码" width="120" />
        <el-table-column prop="supplier_name" label="供应商名称" min-width="180" />
        <el-table-column prop="fire_standard" label="防火标准" width="120" />
        <el-table-column prop="fob_20_container_price" label="20尺柜FOB价格" width="150">
          <template #default="scope">
            ¥{{ scope.row.fob_20_container_price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="fob_40_container_price" label="40尺柜FOB价格" width="150">
          <template #default="scope">
            ¥{{ scope.row.fob_40_container_price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="shipping_port" label="发货港口" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search, Upload, Download, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { createRouter, useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<any[]>([])
const tableData = ref([
  {
    id: 1,
    tccode: 'TC001',
    supplier: '供应商A',
    supplier_code: 'SP001',
    supplier_name: '某某贸易有限公司',
    fire_standard: 'BS 5852',
    fob_20_container_price: 5000.00,
    fob_40_container_price: 9000.00,
    shipping_port: '宁波港',
    status: 0 // 草稿状态
  },
  {
    id: 2,
    tccode: 'TC002',
    supplier: '供应商B',
    supplier_code: 'SB001',
    supplier_name: '某某实业有限公司',
    fire_standard: 'CAL TB 117',
    fob_20_container_price: 6000.00,
    fob_40_container_price: 11000.00,
    shipping_port: '上海港',
    status: 1 // 已发布状态
  }
])

// 表格选择处理
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = () => {
  // TODO: 实现搜索逻辑
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

// 批量导出
const handleBatchExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的数据')
    return
  }
  // TODO: 实现批量导出逻辑
  ElMessage.success(`已选择 ${selectedRows.value.length} 条数据进行导出`)
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的数据')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用批量删除API
    console.log('批量删除:', selectedRows.value.map(row => row.id))
    ElMessage.success('批量删除成功')
  } catch {
    // 用户取消删除
  }
}

// 批量发布
const handleBatchPublish = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要发布的数据')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要发布选中的 ${selectedRows.value.length} 条数据吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    // TODO: 调用批量发布API
    console.log('批量发布:', selectedRows.value.map(row => row.id))
    ElMessage.success('批量发布成功')
  } catch {
    // 用户取消发布
  }
}

// 操作处理
const handleView = (row: any) => {
  console.log('查看:', row)
  router.push(`/prod/view/${row.id}`)
}

const handleEdit = (row: any) => {
  console.log('编辑:', row)
  router.push(`/prod/edit/${row.id}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该产品吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除API
    console.log('删除产品:', row.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 添加状态相关的函数
const getStatusType = (status: number) => {
  const statusMap: Record<number, string> = {
    0: 'info',    // 草稿
    1: 'success', // 已发布
    2: 'warning', // 已下架
    3: 'danger'   // 已删除
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '草稿',
    1: '已发布',
    2: '已下架',
    3: '已删除'
  }
  return statusMap[status] || '未知'
}
</script>
