<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden">
    <div class="bg-white shadow-md p-6 h-screen overflow-auto">
      <!-- 搜索和操作区域 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center min-w-[800px]">
          <div class="left-actions w-[200px]">
            <h2 class="text-2xl font-bold text-gray-800">质检报告列表</h2>
          </div>
          <div class="flex items-center ml-8 w-[450px]">
            <el-input
              v-model="searchQuery"
              placeholder="搜索型号代码/工厂代码/供应商..."
              class="w-[350px] h-8 mt-1"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleClearSearch"
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
          <el-button 
            type="danger" 
            :disabled="!selectedRows.length" 
            @click="handleBatchDelete"
            class="min-w-[120px]"
          >
            <el-icon class="mr-2"><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button 
            type="info" 
            :disabled="!selectedRows.length" 
            @click="handleSendEmail"
            class="min-w-[120px]"
          >
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
          <el-table-column prop="id" label="ID" width="170" fixed="left" />
          <el-table-column prop="modelCode" label="型号代码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="factoryCode" label="工厂代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplier" label="供应商" min-width="120" show-overflow-tooltip />
          <el-table-column prop="client" label="客户" min-width="120" show-overflow-tooltip />
          <el-table-column prop="poNumber" label="PO编号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="inspectionDate" label="检验日期" min-width="120" show-overflow-tooltip>
            <template #default="scope">
              {{ new Date(scope.row.inspectionDate).toLocaleDateString('zh-CN', { 
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '-') }}
            </template>
          </el-table-column>
          <el-table-column prop="orderQty" label="订单数量" min-width="100" align="right" />
          <el-table-column prop="inspectQty" label="检验数量" min-width="100" align="right" />
          <el-table-column prop="qcOfficer" label="质检员" min-width="100" show-overflow-tooltip />
          <el-table-column prop="passFail" label="检验结果" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.passFail === 'Pass' ? 'success' : 'danger'">
                {{ scope.row.passFail }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              {{ new Date(scope.row.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\//g, '-') }}
            </template>
          </el-table-column>
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
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { exportQCReport } from '@/utils/exportQCReport'
import type { QCReportData } from '@/utils/exportQCReport'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
//@ts-ignore
import { getSpecificationPage, searchSpecification , deleteSpecification} from '@/api'
import type { IQCReport } from '@/api/specification.d'
import ImageHandler from '@/components/ImageHandler.vue'

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<IQCReport[]>([])
const loading = ref(false)

// 邮件相关
const showEmailDialog = ref(false)
const emailForm = ref({
  to: '',
  subject: '',
  content: ''
})

// 表格数据
const tableData = ref<IQCReport[]>([])

// 导出状态
const exporting = ref(false)

// 获取表格数据
const fetchTableData = async (isSearch = false) => {
  loading.value = true
  try {
    // 根据是否搜索选择不同的 API
    const apiFunc = isSearch ? searchSpecification : getSpecificationPage
    const response = await apiFunc({
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

    console.log(`${isSearch ? '搜索' : '普通'}分页数据:`, {
      总条数: total.value,
      当前页: currentPage.value,
      每页条数: pageSize.value,
      总页数: Math.ceil(total.value / pageSize.value),
      搜索关键词: searchQuery.value
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
fetchTableData()

// 表格选择处理
const handleSelectionChange = (rows: IQCReport[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  currentPage.value = 1
  fetchTableData(true)  // 传入 true 表示使用搜索 API
}

// 清空搜索
const handleClearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchTableData(false)  // 传入 false 表示使用普通列表 API
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1  // 切换每页显示数量时，重置为第一页
  fetchTableData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTableData()
}

// 处理编辑按钮点击
const handleEdit = (row: IQCReport) => {
  if (!row.id) {
    ElMessage.warning('无效的记录')
    return
  }
  router.push({
    path: `/spec/info/${row.id}`,
    query: { edit: 'true' }  // 添加编辑状态查询参数
  })
}

// 处理查看按钮点击
const handleView = (row: IQCReport) => {
  if (!row.id) {
    ElMessage.warning('无效的记录')
    return
  }
  router.push(`/spec/info/${row.id}`)
}

// 删除
const handleDelete = async (row: IQCReport) => {
  if (!row || !row.id) {
    ElMessage.warning('无效的记录ID')
    return
  }
  try {
    await ElMessageBox.confirm(
      '确定要删除该记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    try {
      await deleteSpecification(row.id)
      ElMessage.success('删除成功')
      // 重新加载数据
      fetchTableData()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
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

    loading.value = true
    const deletePromises = selectedRows.value.map(row => deleteSpecification(row.id))
    
    try {
      await Promise.all(deletePromises)
      ElMessage.success('批量删除成功')
      // 重新加载数据
      fetchTableData()
    } catch (error) {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  } catch {
    // 用户取消删除
  } finally {
    loading.value = false
  }
}

// 批量导出
const handleBatchExport = async () => {
  exporting.value = true
  try {
    if (!selectedRows.value.length) {
      ElMessage.warning('请选择要导出的记录')
      return
    }

    // 处理每条记录的导出
    for (const row of selectedRows.value) {
      try {
        // 模拟获取完整数据
        const qcData: QCReportData = {
          // 基本信息
          modelCode: row.modelCode,
          factoryCode: row.factoryCode,
          supplier: row.supplier,
          client: row.client,
          poNumber: row.poNumber,
          inspectionDate: row.inspectionDate,
          orderQty: row.orderQty,
          reportDate: row.reportDate,
          inspectQty: row.inspectQty,
          qcOfficer: row.qcOfficer,
          passFail: row.passFail,
          secondQCDate: row.secondQcDate,
          comments: row.comments,

          // 产品外观图片 (使用示例图片)
          stocksInWarehouse: row.stocksInWarehouse,
          samplingOfProductsQuantity: row.samplingOfProductsQuantity,
          shippingMarks: row.shippingMarks,
          barcode: row.barcode,
          packingOutside: row.packingOutside,
          packingInside: row.packingInside,

          // 椅子组件图片
          chairComponentsPacked: row.chairComponentsPacked,
          chairComponentsUnpacked: row.chairComponentsUnpacked,

          // 配件包图片
          fittingPackPacked: row.fittingPackPacked,
          fittingPackUnpacked: row.fittingPackUnpacked,

          // 标签和说明图片
          productionLabel: row.productionLabel,
          assemblyInstructions: row.assemblyInstructions,

          // 组件图片
          imageOfComponentsSeat: row.imageOfComponentsSeat,
          imageOfComponentsBack: row.imageOfComponentsBack,
          imageOfComponentsBase: row.imageOfComponentsBase,
          imageOfComponentsCastors: row.imageOfComponentsCastors,
          imageOfComponentsGasLiftCover: row.imageOfComponentsGasLiftCover,
          imageOfComponentsGasLiftStamp: row.imageOfComponentsGasLiftStamp,
          imageOfComponentsArmrest: row.imageOfComponentsArmrest,
          imageOfComponentMechanism: row.imageOfComponentMechanism,
          imageOfComponentsHeadrest: row.imageOfComponentsHeadrest,

          // 成品图片
          imageOfProductBuiltFront: row.imageOfProductBuiltFront,
          imageOfProductBuiltSide: row.imageOfProductBuiltSide,
          imageOfProductBuiltBack: row.imageOfProductBuiltBack,
          imageOfProductBuilt45Degree: row.imageOfProductBuilt45Degree,
          frontImageOfProductBuiltCompare1: row.frontImageOfProductBuiltCompare1,
          frontImageOfProductBuiltCompare2: row.frontImageOfProductBuiltCompare2,

          // 功能检查图片
          functionCheckSeatHeightExtension: row.functionCheckSeatHeightExtension,
          functionCheckMechanismAdjustment: row.functionCheckMechanismAdjustment,
          functionCheckArmrestAdjustment: row.functionCheckArmrestAdjustment,
          functionCheckHeadrestAdjustment: row.functionCheckHeadrestAdjustment,
          functionCheckOther1: row.functionCheckOther1,
          functionCheckOther2: row.functionCheckOther2,

          // 其他必需字段
          inspector: row.qcOfficer,
          inspectionLocation: '生产车间',
          sampleSize: row.orderQty,
          defectCount: row.passFail === 'Fail' ? 1 : 0,

          // 缺陷记录
          defects: row.passFail === 'Fail' ? [
            {
              defectTitle: '缺陷记录',
              defectDescription: '外箱角落有轻微破损',
              improvementSuggestion: '建议加强包装材料',
              inspector: row.qcOfficer,
              images: [
                row.stocksInWarehouse,
                row.stocksInWarehouse
              ]
            }
          ] : []
        }
        
        // 生成Excel文件
        const workbook = await exportQCReport(qcData)
        const buffer = await workbook.xlsx.writeBuffer()
        const fileName = `${qcData.modelCode}_${qcData.poNumber}_${new Date().getTime()}.xlsx`
        
        // 添加到zip文件
        const zip = new JSZip()
        zip.file(fileName, buffer)

        // 生成并下载zip文件
        const zipContent = await zip.generateAsync({ type: 'blob' })
        const timestamp = new Date().getTime()
        saveAs(zipContent, `质检报告_${timestamp}.zip`)

        ElMessage.success('批量导出完成')
      } catch (error) {
        console.error(`导出记录 ${row.id} 失败:`, error)
        ElMessage.error(`导出记录 ${row.id} 失败`)
      }
    }
  } catch (error) {
    console.error('批量导出失败:', error)
    ElMessage.error('批量导出失败')
  } finally {
    exporting.value = false
  }
}

// 发送邮件
const handleSendEmail = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请选择要发送的记录')
    return
  }
  showEmailDialog.value = true
  emailForm.value = {
    to: '',
    subject: `质检报告 - ${selectedRows.value.map((row: IQCReport) => row.modelCode).join(', ')}`,
    content: `请查收以下质检报告：\n${selectedRows.value.map((row: IQCReport) => 
      `型号代码：${row.modelCode}\n最小订购量：${row.poNumber}\n样品交期：${row.inspectionDate}\n`
    ).join('\n')}`
  }
}

// 确认发送邮件
const confirmSendEmail = async () => {
  try {
    // TODO: 调用发送邮件API
    await new Promise(resolve => setTimeout(resolve, 1000))
    showEmailDialog.value = false
    ElMessage.success('邮件发送成功')
  } catch (error) {
    console.error('邮件发送失败:', error)
    ElMessage.error('邮件发送失败')
  }
}
</script>
@/api/bak