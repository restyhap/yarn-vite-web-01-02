<template>
  <div class="flex-1 p-8 min-w-0 overflow-hidden">
    <div class="bg-white rounded-lg shadow p-6 overflow-auto">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div class="flex items-center gap-4">
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
        <div class="flex gap-4 flex-wrap">
          <el-button 
            type="primary" 
            :loading="exporting" 
            :disabled="!selectedRows.length" 
            @click="handleBatchExport"
            style="min-width: 120px"
          >
            <el-icon><Document /></el-icon>
            {{ exporting ? '导出中...' : '批量导出' }}
          </el-button>
          <el-button 
            type="danger" 
            :disabled="!selectedRows.length" 
            @click="handleBatchDelete"
            style="min-width: 120px"
          >
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
      <div class="overflow-auto">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          height="calc(100vh - 340px)"
          v-loading="loading"
          :empty-text="loading ? '加载中...' : '暂无数据'"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column prop="id" label="ID" width="160" fixed="left" />
          <el-table-column prop="tccode" label="产品代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplier" label="供应商" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierCode" label="供应商代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierName" label="供应商名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="fireStandard" label="防火标准" min-width="120" show-overflow-tooltip />
          <el-table-column label="20尺柜FOB价格" min-width="140" align="right">
            <template #default="scope">
              ¥{{ scope.row.fob20ContainerPrice?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </template>
          </el-table-column>
          <el-table-column label="40尺柜FOB价格" min-width="140" align="right">
            <template #default="scope">
              ¥{{ scope.row.fob40ContainerPrice?.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </template>
          </el-table-column>
          <el-table-column prop="shippingPort" label="发货港口" min-width="120" show-overflow-tooltip />
          <el-table-column label="操作" width="170" fixed="right">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-1">
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  class="text-xs !px-1"
                  @click="handleView(scope.row)"
                >
                  <el-icon class="mr-1"><View /></el-icon>
                  查看
                </el-button>
                <el-button 
                  type="primary" 
                  link 
                  size="small" 
                  class="text-xs !px-1"
                  @click="handleEdit(scope.row)"
                >
                  <el-icon class="mr-1"><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  size="small" 
                  class="text-xs !px-1" 
                  @click="handleDelete(scope.row.id)"
                >
                  <el-icon class="mr-1"><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="flex justify-center mt-4">
        <el-pagination
          v-model:current-page="pagination.pageNumber"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="sizes, prev, pager, next, total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Search, Message, Download, Delete, View, Edit, Document } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { exportToWord } from '@/utils/exportToWord'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { Product, ProductParams } from '@/api/product.d'
import { getProductPage, removeProductDto } from '@/api/product'

const router = useRouter()
const searchQuery = ref('')
const total = ref(0)
const selectedRows = ref<ProdData[]>([])
const loading = ref(false)

// 邮件相关
const showEmailDialog = ref(false)
const emailForm = ref({
  to: '',
  subject: '',
  content: ''
})

// 表格数据
const tableData = ref<Product[]>([])

// 添加导出状态
const exporting = ref(false)

// 分页参数
const pagination = ref<ProductParams>({
  pageNumber: 1,
  pageSize: 10
})

// 查询参数
const queryParams = ref<ProductParams>({
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

interface TableRow {
  id: number
  tccode: string
  status: number
  [key: string]: any
}

// 获取表格数据
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      ...pagination.value,
      ...queryParams.value
    }
    const res = await getProductPage(params)
    console.log(res)
    tableData.value = res.data.records
    total.value = res.data.totalRow
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
  pagination.value.pageNumber = 1
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
  exporting.value = true
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要导出的记录')
    return
  }

  try {
    loading.value = true
    const zip = new JSZip()
    
    // 使用模拟数据
    const getMockProdData = (item: ProdData) => {
      return {
        // 基本信息
        tccode: item.tccode,
        supplier: item.supplier,
        supplier_code: item.supplier_code,
        supplier_name: item.supplier_name,
        fire_standard: item.fire_standard,
        fob_20_container_price: item.fob_20_container_price,
        fob_40_container_price: item.fob_40_container_price,
        shipping_port: item.shipping_port,
        // 面料信息
        upholstery: {
          fabric_manufacturer: '示例制造商',
          colour_code: 'C001',
          leather_grade: 'A级',
          usage_per_chair: '2.5米'
        },
        // 包装信息
        packaging: {
          carton_length: '120cm',
          carton_width: '80cm',
          carton_height: '100cm',
          board_type: '双层瓦楞纸',
          items_per_carton: '1',
          carton_volume: '0.96m³'
        },
        // 物流信息
        logistics: {
          production_time: '30天',
          effective_volume: '0.9m³',
          loading_quantity_20gp: '20',
          loading_quantity_40hc: '40',
          net_weight: '15kg',
          gross_weight: '18kg'
        },
        // 尺寸信息
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

    const exportTasks = selectedRows.value.map(async (item: ProdData) => {
      try {
        // 使用模拟数据
        const formData = getMockProdData(item)
        // 创建文档并获取 blob
        const doc = await exportToWord(formData)
        // 将文档添加到 zip
        const fileName = `产品规格书_${formData.tccode || 'Unknown'}.docx`
        return { fileName, doc }
      } catch (error) {
        console.error(`导出失败: ${item.id}`, error)
        ElMessage.error(`导出 ${item.tccode || '未知产品'} 失败`)
        return null
      }
    })

    const results = await Promise.all(exportTasks)
    
    // 过滤掉失败的导出
    const successfulResults = results.filter((result): result is { fileName: string; doc: Blob } => 
      result !== null && result.doc instanceof Blob
    )

    if (successfulResults.length === 0) {
      ElMessage.error('所有文档导出失败')
      return
    }

    // 如果有成功的导出，则创建压缩包
    successfulResults.forEach(result => {
      zip.file(result.fileName, result.doc)
    })

    const zipContent = await zip.generateAsync({ type: 'blob' })
    const timestamp = new Date().getTime()
    saveAs(zipContent, `产品规格书_${timestamp}.zip`)
    
    if (successfulResults.length < selectedRows.value.length) {
      ElMessage.warning(`部分文档导出失败，成功导出 ${successfulResults.length}/${selectedRows.value.length} 个文档`)
    } else {
      ElMessage.success('批量导出成功')
    }
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
    
    // 调用批量删除API
    const deletePromises = selectedRows.value.map(row => removeProductDto(row.id))
    await Promise.all(deletePromises)
    
    ElMessage.success('批量删除成功')
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
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
const handleView = (row: TableRow) => {
  if (!row || !row.id) {
    ElMessage.warning('无效的产品ID')
    return
  }
  router.push(`/prod/info/${row.id}`)
}

const handleEdit = (row: any) => {
  if (!row.id) {
    ElMessage.warning('无效的记录')
    return
  }
  router.push({
    path: `/prod/info/${row.id}`,
    query: { edit: 'true' }  // 添加编辑状态标记
  })
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除该产品吗？', '提示', {
      type: 'warning'
    })
    await removeProductDto(id)
    ElMessage.success('删除成功')
    fetchTableData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped>
.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
