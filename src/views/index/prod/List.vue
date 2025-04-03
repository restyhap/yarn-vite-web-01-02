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
        @clear="handleSearch"
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
import {getProductsPage, PageProducts, Products, getProductsSearch, deleteProductDtoDeleteById} from '@/api'
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

interface ProdData {
  id: number
  tccode?: string
  supplier?: string
  supplier_code?: string
  supplier_name?: string
  fire_standard?: string
  fob_20_container_price?: number
  fob_40_container_price?: number
  shipping_port?: string
  [key: string]: any
}

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
      keyword: searchQuery.value,
      currentPage: pagination.value.pageNumber,
      pageSize: pagination.value.pageSize
    }
    // Only add supplier parameter for non-admin users
    console.log('userStore.userInfo?.roleType : ', userStore.userInfo?.roleType)
    if (userStore.userInfo?.roleType === 1) {
      searchParams.supplier = userStore.userInfo?.username
    }
    const res = (await getProductsSearch({params: searchParams})) as unknown as SearchResponse
    if (res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('Search failed:', error)
    ElMessage.error('Search failed')
  } finally {
    loading.value = false
  }
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

interface ProductData {
  tccode: string
  supplier: string
  supplier_code: string
  supplier_name: string
  fire_standard: string
  fob_20_container_price: number
  fob_40_container_price: number
  shipping_port: string
  upholstery: {
    fabric_manufacturer: string
    colour_code: string
    leather_grade: string
    usage_per_chair: string
  }
  packaging: {
    carton_length: string
    carton_width: string
    carton_height: string
    board_type: string
    items_per_carton: string
    carton_volume: string
  }
  logistics: {
    production_time: string
    effective_volume: string
    loading_quantity_20gp: string
    loading_quantity_40hc: string
    net_weight: string
    gross_weight: string
  }
  dimensions: {
    seat_width: string
    seat_depth: string
    seat_height_min: string
    seat_height_max: string
    back_width: string
    back_height: string
    back_height_from_seat: string
    overall_width: string
    overall_depth: string
    overall_height_min: string
    overall_height_max: string
  }
}

// 批量导出
const handleBatchExport = async () => {
  exporting.value = true
  if (!selectedRows.value.length) {
    ElMessage.warning('Please select records to export')
    return
  }

  try {
    loading.value = true
    const zip = new JSZip()

    // Mock data generator
    const getMockProdData = (item: Products): ProductData => {
      return {
        // Basic Information
        tccode: item.tccode || '',
        supplier: item.supplier || '',
        supplier_code: item.supplierCode || '',
        supplier_name: item.supplierName || '',
        fire_standard: item.fireStandard || '',
        fob_20_container_price: item.fob20ContainerPrice || 0,
        fob_40_container_price: item.fob40ContainerPrice || 0,
        shipping_port: item.shippingPort || '',
        // Upholstery Information
        upholstery: {
          fabric_manufacturer: 'Sample Manufacturer',
          colour_code: 'C001',
          leather_grade: 'Grade A',
          usage_per_chair: '2.5m'
        },
        // Packaging Information
        packaging: {
          carton_length: '120cm',
          carton_width: '80cm',
          carton_height: '100cm',
          board_type: 'Double Wall Corrugated',
          items_per_carton: '1',
          carton_volume: '0.96m³'
        },
        // Logistics Information
        logistics: {
          production_time: '30 days',
          effective_volume: '0.9m³',
          loading_quantity_20gp: '20',
          loading_quantity_40hc: '40',
          net_weight: '15kg',
          gross_weight: '18kg'
        },
        // Dimension Information
        dimensions: {
          seat_width: '50cm',
          seat_depth: '45cm',
          seat_height_min: '45cm',
          seat_height_max: '55cm',
          back_width: '48cm',
          back_height: '60cm',
          back_height_from_seat: '55cm',
          overall_width: '55cm',
          overall_depth: '50cm',
          overall_height_min: '100cm',
          overall_height_max: '110cm'
        }
      }
    }

    const exportTasks = selectedRows.value.map(async (item: Products) => {
      try {
        const formData = getMockProdData(item)
        const doc = await exportToWord(formData as any)
        const fileName = `Product_Spec_${formData.tccode || 'Unknown'}.docx`
        return {fileName, doc}
      } catch (error) {
        console.error(`Export failed: ${item.id}`, error)
        ElMessage.error(`Failed to export ${item.tccode || 'Unknown Product'}`)
        return null
      }
    })

    const results = await Promise.all(exportTasks)
    const successfulResults = results.filter((result): result is {fileName: string; doc: Blob} => result !== null && result.doc instanceof Blob)

    if (successfulResults.length === 0) {
      ElMessage.error('All document exports failed')
      return
    }

    successfulResults.forEach(result => {
      zip.file(result.fileName, result.doc)
    })

    const zipContent = await zip.generateAsync({type: 'blob'})
    const timestamp = new Date().getTime()
    saveAs(zipContent, `Product_Specifications_${timestamp}.zip`)

    if (successfulResults.length < selectedRows.value.length) {
      ElMessage.warning(`Partial export success: ${successfulResults.length}/${selectedRows.value.length} documents exported`)
    } else {
      ElMessage.success('Batch export successful')
    }
  } catch (error) {
    console.error('Batch export failed:', error)
    ElMessage.error('Batch export failed')
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
