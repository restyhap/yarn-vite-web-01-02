<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0">
    <div class="bg-white shadow-md p-6 h-screen">
      <ListHeader
        title="Quotation List"
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
      />

      <!-- 邮件发送对话框 -->
      <el-dialog v-model="showEmailDialog" title="Send Email" width="600px">
        <el-form :model="emailForm" label-width="80px">
          <el-form-item label="Recipients">
            <el-input v-model="emailForm.to" placeholder="Enter recipient email addresses, separate with commas" />
          </el-form-item>
          <el-form-item label="Subject">
            <el-input v-model="emailForm.subject" placeholder="Enter email subject" />
          </el-form-item>
          <el-form-item label="Content">
            <el-input v-model="emailForm.content" type="textarea" :rows="6" placeholder="Enter email content" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="flex justify-end gap-2">
            <el-button @click="showEmailDialog = false">Cancel</el-button>
            <el-button type="primary" @click="handleSendEmail">Send</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 表格区域 -->
      <div class="overflow-auto mt-4">
        <el-table
          :data="tableData"
          border
          class="w-full"
          :style="{height: '600px'}"
          v-loading="loading"
          :empty-text="loading ? 'Loading...' : 'No Data'"
          @selection-change="handleSelectionChange"
          :cell-style="{padding: '8px'}"
          :header-cell-style="{background: '#f5f7fa', color: '#606266', fontWeight: 'bold'}"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column prop="id" label="ID" width="180" fixed="left" />
          <el-table-column prop="supplier" label="Supplier" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierItemCode" label="Supplier Item Code" min-width="150" show-overflow-tooltip />
          <el-table-column prop="specificationDetails" label="Specification Details" min-width="200" show-overflow-tooltip />
          <el-table-column prop="sampleLeadTime" label="Sample Lead Time" min-width="120" show-overflow-tooltip />
          <el-table-column prop="fobPrice" label="Supplier Cost Price" min-width="120" align="right">
            <template #default="scope">{{ scope.row.fobPrice }} {{ getCurrencyLabel(scope.row.currency) }}</template>
          </el-table-column>
          <el-table-column prop="salesContacts" label="Sales" min-width="120" show-overflow-tooltip />
          <el-table-column prop="createTime" label="Create Time" min-width="160" show-overflow-tooltip />
          <el-table-column label="Actions" width="200" fixed="right" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-4">
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleView(scope.row)" v-if="canView">
                  <el-icon>
                    <View />
                  </el-icon>
                  View
                </el-button>
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleEdit(scope.row)" v-if="canEdit">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  Edit
                </el-button>
                <el-button type="danger" link size="small" style="padding: 0; min-width: 35px" @click="handleDelete(scope.row)" v-if="canDelete">
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
import { ref, onMounted, watch, computed } from 'vue'
import { Search, Delete, View, Edit, Download, Message, Document } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { exportQuotation } from '@/utils/exportQuotation'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { deleteQuotationRemoveById, getQuotationSearch , getPdfExportQuotation} from '@/api'
import { useUserStore } from '@/pinia/user'
import { ModuleType, PermissionAction, checkPermission } from '@/utils/permissionUtils'
import ListHeader from '@/components/ListHeader.vue'

interface QuoteData {
  id: string
  supplier: string
  supplierItemCode: string
  specificationDetails: string
  sampleLeadTime: string
  fobPrice: number
  currency: number
  salesContacts: string
  createTime: string
  bifmaTested?: number
  cadBlockAvailable?: number
  productDataAvailable?: number
  productImagesAvailable?: number
  image?: string
  validPeriod?: string
  port?: string
  remark?: string
  overallDimensionsWidth?: number
  overallDimensionsDepth?: number
  overallDimensionsHeight?: number
  boxDimensionsWidth?: number
  boxDimensionsDepth?: number
  boxDimensionsHeight?: number
  boxWeightNetWeighth?: number
  netWeightGrossWeight?: string
  effectiveVol?: string
  loadingQty?: number
  moq?: string
}

interface SearchParams {
  currentPage: number
  pageSize: number
  keyword?: string
  supplier?: string
}

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<QuoteData[]>([])
const loading = ref(false)

// 邮件相关
const showEmailDialog = ref(false)
const emailForm = ref({
  to: '',
  subject: '',
  content: ''
})

// 表格数据
const tableData = ref<QuoteData[]>([])
// 用户存储
const userStore = useUserStore()

// 货币单位映射
const currencyMap = {
  0: 'CNY',
  1: 'USD',
  2: 'EUR'
} as const

const getCurrencyLabel = (currency: number) => {
  return currencyMap[currency as keyof typeof currencyMap] || 'CNY'
}

// 添加导出状态
const exporting = ref(false)

// 权限控制计算属性
const canView = ref(true) // 默认允许查看
const canEdit = ref(false)
const canDelete = ref(false)
const canExport = ref(false)
const canEmail = ref(false)

// 初始化权限
const initPermissions = async () => {
  // 查看权限 - 默认为true，因为能进入列表页面就表示有查看权限
  canView.value = true

  // 编辑权限
  canEdit.value = await checkPermission(ModuleType.QUOTE, PermissionAction.EDIT)

  // 删除权限
  canDelete.value = await checkPermission(ModuleType.QUOTE, PermissionAction.DELETE)

  // 导出和邮件权限 - 如果允许查看，则可以导出和发送邮件
  canExport.value = canView.value
  canEmail.value = canView.value
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    // 当路由发生变化时，重新加载数据
    fetchTableData()
  }
)

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params: SearchParams = {
      currentPage: currentPage.value,
      pageSize: pageSize.value
    }

    if (searchQuery.value) {
      params.keyword = searchQuery.value.trim()
    }

    // 如果是供应商角色，只查询自己的数据
    if (userStore.userInfo.roleType === 1) {
      params.supplier = userStore.userInfo.realName || userStore.userInfo.username
    }

    const response = await getQuotationSearch({
      params
    })

    console.log('API Response:', response)
    if (response.code !== '200') {
      ElMessage.error(response.message || 'Failed to fetch data')
      return
    }
    // 确保每个数据项都符合QuoteData接口定义
    if (response.data?.dataList) {
      tableData.value = response.data.dataList.map((item: any) => ({
        id: item.id,
        supplier: item.supplier || '',
        supplierItemCode: item.supplierItemCode || '',
        specificationDetails: item.specificationDetails || '',
        sampleLeadTime: item.sampleLeadTime || '',
        fobPrice: Number(item.fobPrice) || 0,
        currency: Number(item.currency) || 0,
        salesContacts: item.salesContacts || '',
        createTime: item.createTime || '',
        bifmaTested: Number(item.bifmaTested) || 0,
        cadBlockAvailable: Number(item.cadBlockAvailable) || 0,
        productDataAvailable: Number(item.productDataAvailable) || 0,
        productImagesAvailable: Number(item.productImagesAvailable) || 0,
        image: item.image || '',
        validPeriod: item.validPeriod || '',
        port: item.port || '',
        remark: item.remark || '',
        overallDimensionsWidth: Number(item.overallDimensionsWidth) || 0,
        overallDimensionsDepth: Number(item.overallDimensionsDepth) || 0,
        overallDimensionsHeight: Number(item.overallDimensionsHeight) || 0,
        boxDimensionsWidth: Number(item.boxDimensionsWidth) || 0,
        boxDimensionsDepth: Number(item.boxDimensionsDepth) || 0,
        boxDimensionsHeight: Number(item.boxDimensionsHeight) || 0,
        boxWeightNetWeighth: Number(item.boxWeightNetWeighth) || 0,
        netWeightGrossWeight: item.netWeightGrossWeight || '',
        effectiveVol: item.effectiveVol || '',
        loadingQty: Number(item.loadingQty) || 0,
        moq: item.moq || ''
      }))
      total.value = response.data.totalCount || 0
    } else {
      tableData.value = []
      total.value = 0
    }
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
onMounted(() => {
  initPermissions()
  fetchTableData()
})

// 表格选择处理
const handleSelectionChange = (rows: QuoteData[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  fetchTableData()
}

// 搜索框失焦处理
const handleSearchBlur = () => {
  handleSearch()
}

// 搜索框清空处理
const handleClearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1 // 重置到第一页
  fetchTableData()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 切换每页显示数量时重置到第一页
  fetchTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTableData()
}

// 查看详情
const handleView = (row: QuoteData) => {
  router.push(`/quote/info/${row.id}`)
}

// 编辑
const handleEdit = (row: QuoteData) => {
  router.push(`/quote/info/${row.id}?edit=1`)
}

// 删除
const handleDelete = async (row: QuoteData) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this quotation?', 'Confirmation', {
      type: 'warning'
    })

    // 确保 id 存在且转换为字符串
    if (row.id === undefined || row.id === null) {
      ElMessage.error('Invalid record ID')
      return
    }

    const id = String(row.id)
    const response = await deleteQuotationRemoveById({ id })

    if (response.code !== '200') {
      ElMessage.error(response.message || 'Delete failed')
      return
    }

    ElMessage.success('Delete successful')
    // 删除成功后刷新表格数据
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    if (selectedRows.value.length === 0) {
      ElMessage.warning('Please select data to delete')
      return
    }

    await ElMessageBox.confirm(`Are you sure you want to delete the selected ${selectedRows.value.length} quotations?`, 'Confirmation', {
      type: 'warning'
    })

    // 过滤掉无效的ID
    const validRows = selectedRows.value.filter(row => row.id !== undefined && row.id !== null)
    if (validRows.length === 0) {
      ElMessage.error('No valid IDs in selected records')
      return
    }

    // 并行处理所有删除请求
    const deletePromises = validRows.map(row => {
      const id = String(row.id)
      return deleteQuotationRemoveById({ id })
    })

    const results = await Promise.all(deletePromises)

    ElMessage.success('Batch delete successful')
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Batch delete failed')
    }
  }
}

// 批量导出
const handleBatchExport = async () => {
  try {
    const selectedIds = selectedRows.value.map(row => row.id)
    if (selectedIds.length === 0) {
      ElMessage.warning('Please select at least one item to export')
      return
    }

    const zip = new JSZip()
    const promises = selectedIds.map(async (id, index) => {
      const pdfBlob = await getPdfExportQuotation(id)
      const fileName = `TC_QUOTATION_FORM_${index + 1}.pdf`
      zip.file(fileName, pdfBlob)
    })

    await Promise.all(promises)

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'batch_export.zip')

    ElMessage.success('Batch export successful')
  } catch (error) {
    console.error('Batch export failed:', error)
    ElMessage.error('Batch export failed')
  }
}

// 发送邮件
const handleSendEmail = async () => {
  try {
    // 这里添加发送邮件的逻辑
    ElMessage.success('Email sent successfully')
    showEmailDialog.value = false
    // 重置表单
    emailForm.value = {
      to: '',
      subject: '',
      content: ''
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    ElMessage.error('Failed to send email')
  }
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
</style>
