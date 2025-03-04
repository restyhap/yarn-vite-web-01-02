<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden">
    <div class="bg-white shadow-md p-6 h-screen overflow-auto">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center min-w-[800px]">
          <div class="left-actions w-[200px]">
            <h2 class="text-2xl font-bold text-gray-800">报价单列表</h2>
          </div>
          <div class="flex items-center ml-8 w-[450px]">
            <el-input
                v-model="searchQuery"
                placeholder="请输入您要检索的内容..."
                class="w-[350px] h-8 mt-1"
                clearable
                @keyup.enter="handleSearch"
                @blur="handleSearchBlur"
                @clear="handleSearchClear"
            >
              <template #append>
                <el-button @click="handleSearch" class="w-[50px]">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
        <div class="right-actions flex gap-4">
          <el-button 
            type="primary" 
            :loading="exporting"
            :disabled="!selectedRows.length" 
            @click="handleBatchExport"
            class="w-24"
          >
            <el-icon><Document /></el-icon>
            {{ exporting ? '导出中...' : '批量导出' }}
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
      <div class="overflow-auto mt-16">
        <el-table
            :data="tableData"
            border
            class="w-full"
            height="calc(100vh - 340px)"
            v-loading="loading"
            :empty-text="loading ? '加载中...' : '暂无数据'"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column prop="id" label="序号" width="150" fixed="left" />
          <el-table-column prop="supplier" label="供应商" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplierItemCode" label="供应商项目代码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="specificationDetails" label="规格详细信息" min-width="200" show-overflow-tooltip />
          <el-table-column prop="sampleLeadTime" label="样品交付周期" min-width="120" show-overflow-tooltip />
          <el-table-column prop="fobPrice" label="供货商成本价" min-width="120" align="right">
            <template #default="scope">
              {{ scope.row.fobPrice }} {{ getCurrencyLabel(scope.row.currency) }}
            </template>
          </el-table-column>
          <el-table-column prop="salesContacts" label="销售" min-width="120" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" min-width="160" show-overflow-tooltip />
          <el-table-column label="操作" width="170" fixed="right">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-3">
                <el-button
                    type="primary"
                    link
                    size="small"
                    style="padding: 0; min-width: 35px;"
                    @click="handleView(scope.row)"
                >
                  <el-icon>
                    <View />
                  </el-icon>
                  查看
                </el-button>
                <el-button
                    type="primary"
                    link
                    size="small"
                    style="padding: 0; min-width: 35px;"
                    @click="handleEdit(scope.row)"
                >
                  <el-icon>
                    <Edit />
                  </el-icon>
                  编辑
                </el-button>
                <el-button
                    type="danger"
                    link
                    size="small"
                    style="padding: 0; min-width: 35px;"
                    @click="handleDelete(scope.row)"
                >
                  <el-icon>
                    <Delete />
                  </el-icon>
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
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 15, 20, 50, 100]"
            layout="sizes, prev, pager, next , total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Delete, View, Edit, Download, Message, Document } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { exportQuotation } from '@/utils/exportQuotation'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getQuotationPage, deleteQuotation, searchQuotation } from '@/api/quotation'

interface QuoteData {
  id: number
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
    const response = await getQuotationPage({
      pageNumber: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value
    })
    
    if (response?.data) {
      tableData.value = response.data.records || []
      total.value = Number(response.data.totalRow) || 0
      currentPage.value = Number(response.data.pageNumber) || currentPage.value
      pageSize.value = Number(response.data.pageSize) || pageSize.value
    } else {
      tableData.value = []
      total.value = 0
    }

    console.log('分页数据:', {
      总条数: total.value,
      当前页: currentPage.value,
      每页条数: pageSize.value,
      总页数: Math.ceil(total.value / pageSize.value)
    })
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 初始加载数据
onMounted(() => {
  fetchTableData()
})

// 表格选择处理
const handleSelectionChange = (rows: QuoteData[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = async () => {
  loading.value = true
  try {
    if (searchQuery.value.trim()) {
      const response = await searchQuotation({ 
        keyword: searchQuery.value.trim(),
        currentPage: currentPage.value,
        pageSize: pageSize.value
      })
      if (response?.data) {
        console.log('搜索结果:', response.data)
        tableData.value = response.data.dataList || []
        total.value = Number(response.data.totalCount) || 0
      } else {
        tableData.value = []
        total.value = 0
      }
    } else {
      await fetchTableData()
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索框失焦处理
const handleSearchBlur = () => {
  handleSearch()
}

// 搜索框清空处理
const handleSearchClear = () => {
  currentPage.value = 1  // 重置到第一页
  fetchTableData()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
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
    await ElMessageBox.confirm('确定要删除该报价单吗？', '提示', {
      type: 'warning'
    })
    await deleteQuotation(row.id)
    ElMessage.success('删除成功')
    fetchTableData()
  } catch (error) {
    if(error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条报价单吗？`, '提示', {
      type: 'warning'
    })
    
    const deletePromises = selectedRows.value.map(row => deleteQuotation(row.id))
    await Promise.all(deletePromises)
    
    ElMessage.success('批量删除成功')
    fetchTableData()
  } catch (error) {
    if(error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 批量导出
const handleBatchExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的数据')
    return
  }

  exporting.value = true
  const zip = new JSZip()
  const usedFileNames = new Set()

  try {
    // 处理重复文件名的函数
    const getUniqueFileName = (baseFileName: string): string => {
      if (!usedFileNames.has(baseFileName)) {
        usedFileNames.add(baseFileName)
        return baseFileName
      }
      let counter = 1
      let newFileName = ''
      do {
        const nameParts = baseFileName.split('.')
        const ext = nameParts.pop()
        newFileName = `${nameParts.join('.')}(${counter}).${ext}`
        counter++
      } while (usedFileNames.has(newFileName))

      usedFileNames.add(newFileName)
      return newFileName
    }

    // 并行处理所有导出任务
    const exportTasks = selectedRows.value.map(async (row: QuoteData) => {
      try {
        // 准备导出数据
        const exportData = {
          supplier: row.supplier || '',
          supplier_item_code: row.supplierItemCode || '',
          specification_details: row.specificationDetails || '',
          sample_lead_time: row.sampleLeadTime || '',
          overall_dimensions_width: row.overallDimensionsWidth || 0,
          overall_dimensions_depth: row.overallDimensionsDepth || 0,
          overall_dimensions_height: row.overallDimensionsHeight || 0,
          box_dimensions_width: row.boxDimensionsWidth || 0,
          box_dimensions_depth: row.boxDimensionsDepth || 0,
          box_dimensions_height: row.boxDimensionsHeight || 0,
          box_weight_net_weighth: row.boxWeightNetWeighth || 0,
          net_weight_gross_weight: row.netWeightGrossWeight || '0/0',
          effective_vol: row.effectiveVol || '0',
          loading_qty: row.loadingQty || 0,
          moq: row.moq || '0',
          fob_price: row.fobPrice || 0,
          currency: row.currency || 0,
          bifma_tested: row.bifmaTested || 0,
          cad_block_available: row.cadBlockAvailable || 0,
          product_data_available: row.productDataAvailable || 0,
          product_images_available: row.productImagesAvailable || 0,
          sales_contacts: row.salesContacts || '',
          quote_date: row.createTime?.split(' ')[0] || new Date().toISOString().split('T')[0],
          valid_period: row.validPeriod || '2024-12-31',
          port: row.port || '宁波港',
          remark: row.remark || '批量导出',
          image: row.image || ''
        }

        // 获取Excel文件buffer
        const buffer = await exportQuotation(exportData)
        
        // 生成文件名并添加到zip
        const createDate = row.createTime 
          ? row.createTime.split('T')[0].replace(/-/g, '')
          : new Date().toISOString().split('T')[0].replace(/-/g, '')
        const baseFileName = `TC QUOTATION FORM ${exportData.supplier} ${createDate}.xlsx`
        const uniqueFileName = getUniqueFileName(baseFileName)
        zip.file(uniqueFileName, buffer)
        return { success: true, fileName: uniqueFileName }

      } catch (error) {
        console.error(`导出记录 ${row.id} 失败:`, error)
        return { success: false, fileName: row.supplierItemCode }
      }
    })

    // 等待所有导出任务完成
    const results = await Promise.all(exportTasks)
    
    // 统计成功和失败的数量
    const successCount = results.filter(result => result.success).length
    const failCount = results.length - successCount

    if (successCount === 0) {
      ElMessage.error('所有报价单导出失败')
      return
    }

    // 生成并下载zip文件
    const zipContent = await zip.generateAsync({ type: 'blob' })
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const zipFileName = `TC QUOTATION ${currentDate}.zip`
    saveAs(zipContent, zipFileName)

    if (failCount > 0) {
      ElMessage.warning(`部分报价单导出失败，成功导出 ${successCount}/${results.length} 个报价单`)
    } else {
      ElMessage.success('批量导出成功')
    }
  } catch (error) {
    console.error('批量导出失败:', error)
    ElMessage.error('批量导出失败')
  } finally {
    exporting.value = false
  }
}
</script>@/api/bak/quotation