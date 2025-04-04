<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0">
    <div class="bg-white shadow-md p-6 h-screen">
      <ListHeader
        title="Product Specifications"
        search-placeholder="Search product code/supplier..."
        v-model="searchQuery"
        :show-export="true"
        :show-delete="true"
        :exporting="exporting"
        :has-selected="selectedRows.length > 0"
        @search="handleSearch"
        @clear="handleClear"
        @batch-export="handleBatchExport"
        @batch-delete="handleBatchDelete"
      />

      <!-- Table Area -->
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
          <el-table-column prop="id" label="ID" width="185" fixed="left" />
          <el-table-column prop="tccode" label="Product Code" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplier" label="Supplier" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierCode" label="Supplier Code" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierName" label="Supplier Name" min-width="150" show-overflow-tooltip />
          <el-table-column prop="fireStandard" label="Fire Standard" min-width="120" show-overflow-tooltip />
          <el-table-column label="20ft Container FOB Price" min-width="140" align="right">
            <template #default="scope">¥{{ scope.row.fob20ContainerPrice?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</template>
          </el-table-column>
          <el-table-column label="40ft Container FOB Price" min-width="140" align="right">
            <template #default="scope">¥{{ scope.row.fob40ContainerPrice?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) }}</template>
          </el-table-column>
          <el-table-column prop="shippingPort" label="Shipping Port" min-width="120" show-overflow-tooltip />
          <el-table-column label="Actions" width="200" fixed="right" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-4">
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleView(scope.row)">
                  <el-icon><View /></el-icon>
                  View
                </el-button>
                <el-button v-permission="{module: 'prod', action: 'Edit'}" type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleEdit(scope.row)">
                  <el-icon><Edit /></el-icon>
                  Edit
                </el-button>
                <el-button v-permission="{module: 'prod', action: 'Delete'}" type="danger" link size="small" style="padding: 0; min-width: 35px" @click="handleDelete(scope.row.id)">
                  <el-icon><Delete /></el-icon>
                  Delete
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination Area -->
      <div class="flex justify-center mt-4">
        <el-pagination v-model:current-page="pagination.pageNumber" v-model:page-size="pagination.pageSize" :total="total" layout="prev, pager, next, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getProductsPage, PageProducts, Products, getProductsSearch, deleteProductDtoDeleteById, getProductDtoGetById} from '@/api'
import {exportToWord} from '@/utils/exportToWord'
import {Delete, Document, Edit, Search, View, Plus} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {saveAs} from 'file-saver'
import JSZip from 'jszip'
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useUserStore} from '@/pinia/user'
import ListHeader from '@/components/ListHeader.vue'

const router = useRouter()
const searchQuery = ref('')
const total = ref(0)
const selectedRows = ref<Products[]>([])
const loading = ref(false)

interface IPageProducts extends PageProducts {
  tccode?: string
  supplier?: string
  supplierCode?: string
  startDate?: string
  endDate?: string
}

interface SearchParams {
  page: {
    currentPage: number | undefined
    pageSize: number | undefined
    keyword: string
    supplier?: string
  }
}

interface SearchResponse {
  code: string
  message: string
  data: {
    list: Products[]
    total: number
  }
}

interface PageResponse {
  code: string
  message: string
  data: {
    records: Products[]
    totalRow: number
    pageNumber: number
    pageSize: number
  }
}

// 表格数据
const tableData = ref<Products[]>([])

// 添加导出状态
const exporting = ref(false)

// 分页参数
const pagination = ref<PageProducts>({
  pageNumber: 1,
  pageSize: 10
})

// 查询参数
const queryParams = ref<IPageProducts>({
  tccode: '',
  supplier: '',
  supplierCode: '',
  startDate: '',
  endDate: ''
})

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const userStore = useUserStore()
    const params: SearchParams = {
      page: {
        currentPage: pagination.value.pageNumber,
        pageSize: pagination.value.pageSize,
        keyword: queryParams.value.tccode || ''
      }
    }
    // Only add supplier parameter for non-admin users
    if (userStore.userInfo?.roleType !== 1) {
      params.page.supplier = userStore.userInfo?.username
    }
    const res = (await getProductsPage(params)) as unknown as PageResponse
    if (res.data) {
      tableData.value = res.data.records || []
      total.value = res.data.totalRow || 0
      pagination.value.pageNumber = res.data.pageNumber
      pagination.value.pageSize = res.data.pageSize
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    ElMessage.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

// 表格选择处理
const handleSelectionChange = (rows: Products[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = async () => {
  pagination.value.pageNumber = 1
  loading.value = true
  try {
    const userStore = useUserStore()
    const searchParams: any = {
      currentPage: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize,
      keyword: searchQuery.value
    }
    // 供应商只能查看自己的产品 , 供应商 roleType 是 1
    if (userStore.userInfo?.roleType === 1) {
      searchParams.supplier = userStore.userInfo?.username
    }
    const res = (await getProductsSearch({params: searchParams})) as unknown as SearchResponse
    if (res.data) {
      tableData.value = Array.isArray(res.data) ? res.data : []
      total.value = tableData.value.length
    }
  } catch (error) {
    console.error('Search failed:', error)
    ElMessage.error('Search failed')
  } finally {
    loading.value = false
  }
}

// 清除搜索内容处理
const handleClear = () => {
  searchQuery.value = ''
  fetchTableData()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  pagination.value.pageNumber = 1
  fetchTableData()
}

const handleCurrentChange = (val: number) => {
  pagination.value.pageNumber = val
  fetchTableData()
}

// 批量导出
const handleBatchExport = async () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  try {
    loading.value = true
    exporting.value = true

    // 创建一个新的 JSZip 实例
    const zip = new JSZip()

    // 创建一个数组来存储所有的导出任务
    const exportTasks = selectedRows.value.map(async item => {
      try {
        // 获取完整的产品数据
        const {data: productData} = await getProductDtoGetById({id: item.id || ''})
        if (!productData) {
          throw new Error(`获取产品数据失败: ${item.tccode}`)
        }

        // 生成 Word 文档
        const doc = await exportToWord(productData, {is_batch_export: true})

        // 使用产品编号和ID作为文件名，确保唯一性
        const fileName = `Master_Specification_Sheet---TC-${item.tccode}--ID-${item.id}.docx`

        // 将文档添加到 zip 中
        return {fileName, doc}
      } catch (error) {
        console.error(`导出失败: ${item.tccode}`, error)
        throw error
      }
    })

    // 等待所有导出任务完成
    const results = await Promise.all(exportTasks)

    // 将所有文档添加到 zip 中
    results.forEach(({fileName, doc}) => {
      zip.file(fileName, doc)
    })

    // 生成 zip 文件
    const zipBlob = await zip.generateAsync({type: 'blob'})

    // 下载 zip 文件
    const timestamp = new Date().toISOString().slice(0, 10)
    saveAs(zipBlob, `Product_Specifications_${timestamp}.zip`)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('批量导出失败:', error)
    ElMessage.error('批量导出失败')
  } finally {
    loading.value = false
    exporting.value = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('Please select items to delete')
    return
  }

  try {
    await ElMessageBox.confirm(`Are you sure you want to delete ${selectedRows.value.length} selected items?`, 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    const deletePromises = selectedRows.value.map(row => {
      if (!row.id) {
        return Promise.reject(new Error(`Invalid ID for product ${row.tccode || 'Unknown'}`))
      }
      return deleteProductDtoDeleteById({id: row.id})
    })

    await Promise.all(deletePromises)
    ElMessage.success('Batch delete successful')
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Batch delete failed:', error)
      ElMessage.error('Batch delete failed')
    }
  }
}

// 查看详情
const handleView = (row: any) => {
  router.push({
    name: 'productInfo',
    params: {id: row.id}
  })
}

const handleEdit = (row: any) => {
  router.push({
    name: 'productInfo',
    params: {id: row.id},
    query: {edit: 'true'}
  })
}

const handleDelete = async (id: string | undefined) => {
  if (!id) {
    ElMessage.error('Invalid product ID')
    return
  }

  try {
    await ElMessageBox.confirm('Are you sure you want to delete this product?', 'Confirmation', {
      type: 'warning'
    })
    await deleteProductDtoDeleteById({id})
    ElMessage.success('Delete successful')
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete failed:', error)
      ElMessage.error('Delete failed')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchTableData()
})
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
</style>
