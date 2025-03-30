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
            <el-input v-model="searchQuery" placeholder="搜索型号代码/工厂代码/供应商..." class="w-[350px] h-8 mt-1" clearable @keyup.enter="handleSearch" @clear="handleClearSearch">
              <template #append>
                <el-button @click="handleSearch" class="w-[50px]">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
        <div class="right-actions flex gap-4">
          <el-button type="primary" :loading="exporting" :disabled="!selectedRows.length" @click="handleBatchExport" class="w-24">
            <el-icon><Document /></el-icon>
            {{ exporting ? '导出中...' : '批量导出' }}
          </el-button>
          <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete" class="min-w-[120px]">
            <el-icon class="mr-2"><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="overflow-auto mt-16">
        <el-table
          :data="tableData"
          border
          class="w-full"
          :style="{height: 'calc(100vh - 340px)'}"
          v-loading="loading"
          :empty-text="loading ? '加载中...' : '暂无数据'"
          @selection-change="handleSelectionChange"
          :cell-style="{padding: '8px'}"
          :header-cell-style="{background: '#f5f7fa', color: '#606266', fontWeight: 'bold'}"
        >
          <el-table-column type="selection" width="55" fixed="left" />
          <el-table-column prop="id" label="ID" width="185" fixed="left" />
          <el-table-column prop="modelCode" label="型号代码" min-width="150" show-overflow-tooltip />
          <el-table-column prop="factoryCode" label="工厂代码" min-width="120" show-overflow-tooltip />
          <el-table-column prop="supplier" label="供应商" min-width="120" show-overflow-tooltip />
          <el-table-column prop="client" label="客户" min-width="120" show-overflow-tooltip />
          <el-table-column prop="poNumber" label="PO编号" min-width="120" show-overflow-tooltip />
          <el-table-column prop="inspectionDate" label="检验日期" min-width="120" show-overflow-tooltip>
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
          <el-table-column label="操作" width="170" fixed="right" align="center">
            <template #default="scope">
              <div class="flex items-center justify-center space-x-3">
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleView(scope.row)">
                  <el-icon>
                    <View />
                  </el-icon>
                  查看
                </el-button>
                <el-button type="primary" link size="small" style="padding: 0; min-width: 35px" @click="handleEdit(scope.row)">
                  <el-icon>
                    <Edit />
                  </el-icon>
                  编辑
                </el-button>
                <el-button type="danger" link size="small" style="padding: 0; min-width: 35px" @click="handleDelete(scope.row)">
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
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total" :page-sizes="[10, 20, 50, 100]" layout="sizes, prev, pager, next, total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
import {getQcReportsPage, getQcReportsSearch, deleteQcReportsRemoveById, getQcReportsDtoGetById} from '@/api'
import type {QcReports, DefectsDto, DefectImages} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'

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

// 获取表格数据
const fetchTableData = async (isSearch = false) => {
  loading.value = true
  try {
    // 根据是否搜索选择不同的 API
    let response
    if (isSearch) {
      response = await getQcReportsSearch({
        params: {
          keyword: searchQuery.value,
          currentPage: currentPage.value,
          pageSize: pageSize.value
        }
      })
    } else {
      response = await getQcReportsPage({
        page: {
          pageNumber: currentPage.value,
          pageSize: pageSize.value
        }
      })
    }

    console.log('API Response:', response)
    // 直接使用返回的数据
    tableData.value = response.records || []
    total.value = response.totalRow || 0
    currentPage.value = response.pageNumber || currentPage.value
    pageSize.value = response.pageSize || pageSize.value

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
const handleSelectionChange = (rows: QcReports[]) => {
  selectedRows.value = rows
}

// 搜索处理
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  currentPage.value = 1
  fetchTableData(true) // 传入 true 表示使用搜索 API
}

// 清空搜索
const handleClearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchTableData(false) // 传入 false 表示使用普通列表 API
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
    ElMessage.warning('无效的记录')
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
    ElMessage.warning('无效的记录')
    return
  }
  router.push(`/spec/info/${row.id}`)
}

// 删除
const handleDelete = async (row: QcReports) => {
  if (!row || !row.id) {
    ElMessage.warning('无效的记录ID')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    try {
      // 确保 id 存在
      if (typeof row.id !== 'string') {
        ElMessage.error('无效的记录ID')
        return
      }

      await deleteQcReportsRemoveById({id: row.id})
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
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条数据吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    loading.value = true
    // 过滤掉没有 id 的记录
    const validRows = selectedRows.value.filter(row => row.id && typeof row.id === 'string')

    if (validRows.length === 0) {
      ElMessage.warning('所选记录均无有效ID')
      loading.value = false
      return
    }

    const deletePromises = validRows.map(row => deleteQcReportsRemoveById({id: row.id as string}))

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
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要导出的数据')
    return
  }

  exporting.value = true

  // 添加一个超时计时器
  const timeout = setTimeout(() => {
    if (exporting.value) {
      exporting.value = false
      ElMessage.warning('导出超时，请减少选择的数量后重试')
    }
  }, 120000) // 2分钟超时

  try {
    ElMessage.info(`开始批量导出 ${selectedRows.value.length} 个报告...`)

    // 创建一个新的 ZIP 包
    const zip = new JSZip()

    // 计数成功和失败的报告
    let successCount = 0
    let failedCount = 0

    // 逐个处理选中的行
    for (let i = 0; i < selectedRows.value.length; i++) {
      const row = selectedRows.value[i]

      if (!row.id) {
        failedCount++
        console.error(`报告缺少ID: ${row.modelCode || '未知型号'}`)
        continue
      }

      try {
        ElMessage.info(`处理第 ${i + 1}/${selectedRows.value.length} 个报告: ${row.modelCode || '未知型号'}`)

        // 从数据库获取完整数据
        const res = await getQcReportsDtoGetById({id: row.id as string})

        if (!res.data?.qcReports) {
          failedCount++
          console.error(`无法获取报告数据: ${row.modelCode || '未知型号'}`)
          continue
        }

        const qcReports = res.data.qcReports
        const defects =
          res.data.defectsDTO?.map((dto: DefectsDto) => ({
            defectTitle: dto.defects?.defectTitle || '',
            defectDescription: dto.defects?.defectDescription || '',
            improvementSuggestion: dto.defects?.improvementSuggestion || '',
            inspector: dto.defects?.inspector || '',
            images: dto.defectImages?.map((img: DefectImages) => img.imagePath || '').filter(Boolean) || []
          })) || []

        // 构建导出数据
        const exportData: QCReportData = {
          modelCode: qcReports.modelCode || '',
          factoryCode: qcReports.factoryCode || '',
          supplier: qcReports.supplier || '',
          client: qcReports.client || '',
          poNumber: qcReports.poNumber || '',
          inspectionDate: qcReports.inspectionDate || '',
          orderQty: Number(qcReports.orderQty) || 0,
          reportDate: qcReports.reportDate || new Date().toISOString().split('T')[0],
          inspectQty: Number(qcReports.inspectQty) || 0,
          qcOfficer: qcReports.qcOfficer || '',
          passFail: (qcReports.passFail as 'Pass' | 'Fail') || 'Pass',
          secondQCDate: qcReports.secondQcDate || '',
          comments: qcReports.comments || '',

          // 图片相关字段
          stocksInWarehouse: qcReports.stocksInWarehouse,
          samplingOfProductsQuantity: qcReports.samplingOfProductsQuantity,
          shippingMarks: qcReports.shippingMarks,
          barcode: qcReports.barcode,
          packingOutside: qcReports.packingOutside,
          packingInside: qcReports.packingInside,
          chairComponentsPacked: qcReports.chairComponentsPacked,
          chairComponentsUnpacked: qcReports.chairComponentsUnpacked,
          fittingPackPacked: qcReports.fittingPackPacked,
          fittingPackUnpacked: qcReports.fittingPackUnpacked,
          productionLabel: qcReports.productionLabel,
          assemblyInstructions: qcReports.assemblyInstructions,
          imageOfComponentsSeat: qcReports.imageOfComponentsSeat,
          imageOfComponentsBack: qcReports.imageOfComponentsBack,
          imageOfComponentsBase: qcReports.imageOfComponentsBase,
          imageOfComponentsCastors: qcReports.imageOfComponentsCastors,
          imageOfComponentsGasLiftCover: qcReports.imageOfComponentsGasLiftCover,
          imageOfComponentsGasLiftStamp: qcReports.imageOfComponentsGasLiftStamp,
          imageOfComponentsArmrest: qcReports.imageOfComponentsArmrest,
          imageOfComponentMechanism: qcReports.imageOfComponentMechanism,
          imageOfComponentsHeadrest: qcReports.imageOfComponentsHeadrest,
          imageOfProductBuiltFront: qcReports.imageOfProductBuiltFront,
          imageOfProductBuiltSide: qcReports.imageOfProductBuiltSide,
          imageOfProductBuiltBack: qcReports.imageOfProductBuiltBack,
          imageOfProductBuilt45Degree: qcReports.imageOfProductBuilt45Degree,
          frontImageOfProductBuiltCompare1: qcReports.frontImageOfProductBuiltCompare1,
          frontImageOfProductBuiltCompare2: qcReports.frontImageOfProductBuiltCompare2,
          functionCheckSeatHeightExtension: qcReports.functionCheckSeatHeightExtension,
          functionCheckMechanismAdjustment: qcReports.functionCheckMechanismAdjustment,
          functionCheckArmrestAdjustment: qcReports.functionCheckArmrestAdjustment,
          functionCheckHeadrestAdjustment: qcReports.functionCheckHeadrestAdjustment,
          functionCheckOther1: qcReports.functionCheckOther1,
          functionCheckOther2: qcReports.functionCheckOther2,

          // 缺陷记录
          defects,

          // 其他必需字段
          inspector: qcReports.qcOfficer || '',
          inspectionLocation: '工厂',
          sampleSize: Number(qcReports.inspectQty) || 0,
          defectCount: defects.length
        }

        // 调用导出函数生成工作簿
        const workbook = await exportQCReport(exportData)

        // 生成文件名
        const fileName = `质检报告_${qcReports.modelCode || '未知型号'}_${new Date().toISOString().slice(0, 10)}.xlsx`

        // 将 Excel 文件转换为 buffer
        const buffer = await workbook.xlsx.writeBuffer()

        // 将 buffer 添加到 ZIP 包中
        zip.file(fileName, buffer)

        successCount++
        ElMessage.info(`已完成 ${successCount}/${selectedRows.value.length} 个报告`)
      } catch (error) {
        failedCount++
        console.error(`处理报告失败: ${row.modelCode || '未知型号'}`, error)
      }
    }

    if (successCount > 0) {
      // 生成 ZIP 文件
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const zipContent = await zip.generateAsync({type: 'blob'})

      // 保存 ZIP 文件
      saveAs(zipContent, `质检报告_${timestamp}.zip`)

      ElMessage.success(`成功导出 ${successCount} 个报告，失败 ${failedCount} 个`)
    } else {
      ElMessage.error('没有成功导出任何报告')
    }
  } catch (error) {
    console.error('批量导出失败:', error)
    ElMessage.error(`批量导出失败: ${(error as Error).message}`)
  } finally {
    clearTimeout(timeout)
    exporting.value = false
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
