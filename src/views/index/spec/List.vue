<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0">
    <div class="bg-white shadow-md p-6 h-screen">
      <ListHeader
        title="QC Reports"
        search-placeholder="Search model code/factory code/supplier..."
        v-model="searchQuery"
        :show-export="true"
        :show-delete="true"
        :exporting="exporting"
        :has-selected="selectedRows.length > 0"
        @search="handleSearch"
        @clear="handleClearSearch"
        @batch-export="handleBatchExport"
        @batch-delete="handleBatchDelete"
      >
        <!-- 添加创建按钮 -->
        <template #actions>
          <el-button type="primary" @click="handleCreate">
            <el-icon class="mr-1"><Plus /></el-icon>
            Create
          </el-button>
        </template>
      </ListHeader>

      <!-- Table Area -->
      <div class="overflow-auto mt-4">
        <el-table
          :data="tableData"
          border
          class="w-full"
          :style="{height: 'calc(100vh - 200px)'}"
          v-loading="loading"
          :empty-text="loading ? 'Loading...' : 'No Data'"
          @selection-change="handleSelectionChange"
          :cell-style="{padding: '8px'}"
          :header-cell-style="{background: '#f5f7fa', color: '#606266', fontWeight: 'bold'}"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column prop="id" label="ID" width="185" fixed="left" />
          <el-table-column prop="modelCode" label="Model Code" min-width="150" show-overflow-tooltip />
          <el-table-column prop="factoryCode" label="Factory Code" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplier" label="Supplier" min-width="120" show-overflow-tooltip />
          <el-table-column prop="client" label="Client" min-width="120" show-overflow-tooltip />
          <el-table-column prop="poNumber" label="PO Number" min-width="120" show-overflow-tooltip />
          <el-table-column prop="inspectionDate" label="Inspection Date" min-width="120" show-overflow-tooltip>
            <template #default="scope">
              {{
                new Date(scope.row.inspectionDate)
                  .toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })
                  .replace(/\//g, '-')
              }}
            </template>
          </el-table-column>
          <el-table-column prop="orderQty" label="Order Qty" min-width="100" align="right" />
          <el-table-column prop="inspectQty" label="Inspect Qty" min-width="100" align="right" />
          <el-table-column prop="qcOfficer" label="QC Officer" min-width="100" show-overflow-tooltip />
          <el-table-column prop="passFail" label="Inspection Result" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.passFail === 'Pass' ? 'success' : 'danger'">
                {{ scope.row.passFail }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="Create Time" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              {{
                new Date(scope.row.createdAt)
                  .toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  .replace(/\//g, '-')
              }}
            </template>
          </el-table-column>
          <el-table-column label="Actions" width="200" fixed="right" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-4">
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleView(scope.row)">
                  <el-icon>
                    <View />
                  </el-icon>
                  View
                </el-button>
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleEdit(scope.row)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  Edit
                </el-button>
                <el-button type="danger" link size="small" style="padding: 0; min-width: 35px" @click="handleDelete(scope.row)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                  Delete
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="flex justify-center mt-4">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total" layout=" prev, pager, next, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {ElMessageBox, ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {exportQCReport} from '@/utils/exportQCReport'
import type {QCReportData} from '@/utils/exportQCReport'
import JSZip from 'jszip'
import {saveAs} from 'file-saver'
import {getQcReportsPage, getQcReportsSearch, deleteQcReportsRemoveById, getQcReportsDtoGetById , getPdfExportQcReport} from '@/api'
import type {QcReports, DefectsDto, DefectImages} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'
import ListHeader from '@/components/ListHeader.vue'
import {Plus, View, Edit, Delete} from '@element-plus/icons-vue'
import {useUserStore} from '@/pinia/user'

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<QcReports[]>([])
const loading = ref(false)

// 邮件相关
const showEmailDialog = ref(false)
const emailForm = ref({
  to: '',
  subject: '',
  content: ''
})

// 表格数据
const tableData = ref<QcReports[]>([])

// 导出状态
const exporting = ref(false)

interface PageResponse {
  code: string
  message: string
  data: {
    records: QcReports[]
    totalRow: number
    pageNumber: number
    pageSize: number
  }
}

interface SearchResponse {
  code: string
  message: string
  data: {
    data: QcReports[]
    total: number
  }
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const userStore = useUserStore()
    const params: {
      keyword?: string
      currentPage: number
      pageSize: number
      supplier?: string
    } = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }

    // 如果有搜索关键词，添加到参数中
    if (searchQuery.value.trim()) {
      params.keyword = searchQuery.value
    }

    let res: PageResponse | SearchResponse
    // 供应商用户始终使用 search 接口
    if (userStore.userInfo?.roleType === 1) {
      params.supplier = userStore.userInfo?.username
      res = (await getQcReportsSearch({params})) as SearchResponse
      if (res.data) {
        tableData.value = res.data.data || []
        total.value = res.data.total || 0
      } else {
        tableData.value = []
        total.value = 0
      }
    } else {
      // 非供应商用户使用 page 接口
      res = (await getQcReportsPage({
        page: {
          pageNumber: currentPage.value,
          pageSize: pageSize.value
        }
      })) as PageResponse
      if (res.data) {
        tableData.value = res.data.records || []
        total.value = res.data.totalRow || 0
        currentPage.value = res.data.pageNumber
        pageSize.value = res.data.pageSize
      }
    }

    console.log('API Response:', res)
    console.log('Data:', {
      'Total Records': total.value,
      'Current Page': currentPage.value,
      'Page Size': pageSize.value,
      'Total Pages': Math.ceil(total.value / pageSize.value),
      'Search Keyword': searchQuery.value
    })
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('Failed to fetch data')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 初始加载数据
fetchTableData()

// 表格选择处理
const handleSelectionChange = (rows: QcReports[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('Please enter search keyword')
    return
  }
  currentPage.value = 1
  fetchTableData()
}

// 清空搜索
const handleClearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchTableData()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 切换每页显示数量时，重置为第一页
  fetchTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTableData()
}

// 处理编辑按钮点击
const handleEdit = (row: QcReports) => {
  if (!row.id) {
    ElMessage.warning('Invalid record')
    return
  }
  router.push({
    path: `/spec/info/${row.id}`,
    query: {edit: 'true'} // 添加编辑状态查询参数
  })
}

// 处理查看按钮点击
const handleView = (row: QcReports) => {
  if (!row.id) {
    ElMessage.warning('Invalid record')
    return
  }
  router.push(`/spec/info/${row.id}`)
}

// 删除
const handleDelete = async (row: QcReports) => {
  if (!row || !row.id) {
    ElMessage.warning('Invalid record ID')
    return
  }
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this record?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    loading.value = true
    try {
      // 确保 id 存在
      if (typeof row.id !== 'string') {
        ElMessage.error('Invalid record ID')
        return
      }

      await deleteQcReportsRemoveById({id: row.id})
      ElMessage.success('Deleted successfully')
      // 重新加载数据
      fetchTableData()
    } catch (error) {
      console.error('Delete failed:', error)
      ElMessage.error('Delete failed')
    }
  } catch {
    // 用户取消删除
  } finally {
    loading.value = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select data to delete')
    return
  }

  try {
    await ElMessageBox.confirm(`Are you sure you want to delete the selected ${selectedRows.value.length} records?`, 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    loading.value = true
    // 过滤掉没有 id 的记录
    const validRows = selectedRows.value.filter(row => row.id && typeof row.id === 'string')

    if (validRows.length === 0) {
      ElMessage.warning('No valid IDs in selected records')
      loading.value = false
      return
    }

    const deletePromises = validRows.map(row => deleteQcReportsRemoveById({id: row.id as string}))

    try {
      await Promise.all(deletePromises)
      ElMessage.success('Batch delete successful')
      // 重新加载数据
      fetchTableData()
    } catch (error) {
      console.error('Batch delete failed:', error)
      ElMessage.error('Batch delete failed')
    }
  } catch {
    // 用户取消删除
  } finally {
    loading.value = false
  }
}

// 批量导出
const handleBatchExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select data to export')
    return
  }

  exporting.value = true

  // 添加一个超时计时器
  const timeout = setTimeout(() => {
    if (exporting.value) {
      exporting.value = false
      ElMessage.warning('Export timeout, please reduce the selection and try again')
    }
  }, 120000) // 2分钟超时

  try {
    // 创建一个新的 ZIP 包
    const zip = new JSZip()

    // 计数成功和失败的报告
    let successCount = 0
    let failedCount = 0

    // 逐个处理选中的行
    for (let i = 0; i < selectedRows.value.length; i++) {
      const row = selectedRows.value[i]

      // 确保 row.id 存在且为有效值
      if (!row.id || typeof row.id !== 'string') {
        failedCount++
        console.error(`Invalid or missing ID for row: ${JSON.stringify(row)}`)
        continue
      }

      try {
        // 从数据库获取完整数据
        // const res = await getQcReportsDtoGetById({ id: row.id as string })


        // 调用导出 PDF 函数
        const pdfBlob = await getPdfExportQcReport(row.id) // 假设有一个 exportToPDF 函数

        // 生成文件名
        const fileName = `QC_Report_${row.modelCode || 'Unknown'}_${new Date().toISOString().slice(0, 10)}.pdf`

        // 将 PDF 文件添加到 ZIP 包中
        zip.file(fileName, pdfBlob)

        successCount++
      } catch (error) {
        failedCount++
        console.error(`Failed to process report for ID: ${row.id}`, error)
      }
    }

    if (successCount > 0) {
      // 生成 ZIP 文件
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const zipContent = await zip.generateAsync({ type: 'blob' })

      // 保存 ZIP 文件
      saveAs(zipContent, `QC_Reports_${timestamp}.zip`)
    } else {
      ElMessage.error('No reports were successfully exported')
    }
  } catch (error) {
    console.error('Batch export failed:', error)
    ElMessage.error(`Batch export failed: ${(error as Error).message}`)
  } finally {
    clearTimeout(timeout)
    exporting.value = false
  }
}

// 处理创建按钮点击
const handleCreate = () => {
  router.push('/spec/info/new')
}
</script>

<style scoped>
/* 确保表格边框正确显示 */
:deep(.el-table) {
  border: 1px solid #ebeef5;
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.12);
}

:deep(.el-table__fixed-right-patch) {
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__cell) {
  border-right: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5 !important;
}

:deep(.el-button.is-link) {
  border: none;
}

/* 修复固定列边框问题 */
:deep(.el-table__fixed-right .el-table__fixed-body-wrapper) {
  height: auto !important;
}

:deep(.el-table__fixed-right .el-table__cell) {
  border-bottom: 1px solid #ebeef5 !important;
}

/* 确保表格行高一致 */
:deep(.el-table__row) {
  height: 50px;
}

/* 修复表格底部边框 */
:deep(.el-table::before) {
  height: 0;
}

/* Button icon alignment */
.el-button :deep(.el-icon) {
  margin-right: 4px;
}

/* Search button style */
.el-input :deep(.el-input-group__append) {
  padding: 0;
}

.el-input :deep(.el-input__wrapper) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.el-input :deep(.el-input-group__append .el-button) {
  border: none;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Header background transition */
.bg-gray-50 {
  transition: background-color 0.2s ease;
}

.bg-gray-50:hover {
  background-color: #f8fafc;
}
</style>
