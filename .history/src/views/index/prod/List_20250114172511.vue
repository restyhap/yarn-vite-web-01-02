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
          <el-button type="info" :disabled="!selectedRows.length" @click="handleSendEmail">
            <el-icon class="mr-2"><Message /></el-icon>
            发送邮件
          </el-button>
        </div>
      </div>

      <!-- 邮件发送对话框 -->
      <el-dialog v-model="showEmailDialog" title="发送邮件" width="600px">
        <el-form :model="emailForm" label-width="80px">
          <el-form-item label="收件人">
            <el-input v-model="emailForm.to" placeholder="请输入收件人邮箱，多个邮箱用逗号分隔" />
          </el-form-item>
          <el-form-item label="主题">
            <el-input v-model="emailForm.subject" placeholder="请输入邮件主题" />
          </el-form-item>
          <el-form-item label="正文">
            <el-input
              v-model="emailForm.content"
              type="textarea"
              :rows="6"
              placeholder="请输入邮件内容"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex justify-end gap-2">
            <el-button @click="showEmailDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmSendEmail">发送</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 表格区域 -->
      <el-table 
        :data="tableData" 
        border 
        style="width: 100%"
        height="calc(100vh - 280px)"
        v-loading="loading"
        :empty-text="loading ? '加载中...' : '暂无数据'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="tccode" label="产品代码" min-width="100" />
        <el-table-column prop="supplier" label="供应商" min-width="100" />
        <el-table-column prop="supplier_code" label="供应商代码" min-width="100" />
        <el-table-column prop="supplier_name" label="供应商名称" min-width="140" />
        <el-table-column prop="fire_standard" label="防火标准" min-width="100" />
        <el-table-column label="20尺柜FOB价格" min-width="120">
          <template #default="scope">
            ¥{{ scope.row.fob_20_container_price?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
        <el-table-column label="40尺柜FOB价格" min-width="120">
          <template #default="scope">
            ¥{{ scope.row.fob_40_container_price?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
        <el-table-column prop="shipping_port" label="发货港口" min-width="100" />
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="scope">
            <div class="flex items-center justify-center space-x-1">
              <el-button type="primary" link size="small" class="text-xs !px-2" @click="handleView(scope.row)">
                <el-icon class="mr-1"><View /></el-icon>
                查看
              </el-button>
              <el-button type="primary" link size="small" class="text-xs !px-2" @click="handleEdit(scope.row)">
                <el-icon class="mr-1"><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" link size="small" class="text-xs !px-2" @click="handleDelete(scope.row)">
                <el-icon class="mr-1"><Delete /></el-icon>
                删除
              </el-button>
            </div>
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
import { Search, Message, Download, Delete, View, Edit } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<any[]>([])
const loading = ref(false)

// 邮件相关
const showEmailDialog = ref(false)
const emailForm = ref({
  to: '',
  subject: '',
  content: ''
})

// 表格数据
const tableData = ref<any[]>([])

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // 模拟数据加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    tableData.value = [
      {
        id: 1,
        tccode: 'TC001',
        supplier: '供应商A',
        supplier_code: 'SP001',
        supplier_name: '某某贸易有限公司',
        fire_standard: 'BS 5852',
        fob_20_container_price: 5000.00,
        fob_40_container_price: 9000.00,
        shipping_port: '宁波港'
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
        shipping_port: '上海港'
      }
    ]
    total.value = 2
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 初始加载数据
fetchTableData()

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

// 发送邮件
const handleSendEmail = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要发送的数据')
    return
  }

  // 预设邮件内容
  emailForm.value.subject = `产品信息 - ${selectedRows.value.map(row => row.tccode).join(', ')}`
  emailForm.value.content = selectedRows.value.map(row => 
    `产品代码: ${row.tccode}\n供应商: ${row.supplier_name}\n价格: ¥${row.fob_20_container_price}`
  ).join('\n\n')

  showEmailDialog.value = true
}

// 确认发送邮件
const confirmSendEmail = async () => {
  if (!emailForm.value.to) {
    ElMessage.warning('请输入收件人邮箱')
    return
  }

  try {
    // TODO: 调用发送邮件API
    console.log('发送邮件:', {
      to: emailForm.value.to,
      subject: emailForm.value.subject,
      content: emailForm.value.content,
      products: selectedRows.value.map(row => row.id)
    })
    
    ElMessage.success('邮件发送成功')
    showEmailDialog.value = false
    
    // 重置表单
    emailForm.value = {
      to: '',
      subject: '',
      content: ''
    }
  } catch (error) {
    ElMessage.error('邮件发送失败')
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
</script>
