<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
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
          <el-tooltip
            content="请先下载模板，按照模板格式填写数据后再导入"
            placement="top"
          >
            <el-button type="warning" @click="handleDownloadTemplate">
              <el-icon class="mr-2"><Document /></el-icon>
              下载模板
            </el-button>
          </el-tooltip>
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            accept=".xlsx,.xls"
            :before-upload="beforeExcelUpload"
            @change="handleExcelImport"
          >
            <el-button type="success">
              <el-icon class="mr-2"><Upload /></el-icon>
              导入Excel
            </el-button>
          </el-upload>
          <el-button type="primary" @click="handleExcelExport">
            <el-icon class="mr-2"><Download /></el-icon>
            导出Excel
          </el-button>
          <el-button type="primary" @click="$router.push('/prod/create')">
            <el-icon class="mr-2"><Plus /></el-icon>
            新建产品
          </el-button>
        </div>
      </div>

      <!-- Excel导入说明对话框 -->
      <el-dialog v-model="showExcelGuide" title="Excel导入说明" width="600px">
        <div class="p-4 bg-blue-50 rounded-lg">
          <ul class="list-disc list-inside text-blue-600 space-y-2">
            <li>请先下载Excel模板，按照模板格式填写数据</li>
            <li>Excel文件大小不能超过5MB</li>
            <li>支持.xlsx和.xls格式的文件</li>
            <li>必填字段：产品代码、供应商代码、供应商名称、防火标准、价格信息</li>
            <li>日期格式：YYYY-MM-DD</li>
            <li>价格必须为数字，最多支持2位小数</li>
          </ul>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <el-button @click="showExcelGuide = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 表格区域 -->
      <el-table :data="tableData" border style="width: 100%">
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
import { Plus, Search, Upload, Download, Document } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { createRouter, useRouter } from 'vue-router'
import type { UploadFile } from 'element-plus'
import * as XLSX from 'xlsx'

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showExcelGuide = ref(false)
const tableData = ref([])

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

// Excel模板下载
const handleDownloadTemplate = () => {
  const templateData = [{
    tccode: 'TC001',
    supplier: '供应商名称',
    supplier_code: 'SP001',
    supplier_name: '供应商全称',
    fire_standard: 'BS 5852',
    fob_20_container_price: 5000.00,
    fob_40_container_price: 9000.00,
    shipping_port: '宁波港'
  }]

  const wscols = [
    { wch: 15 }, // tccode
    { wch: 20 }, // supplier
    { wch: 15 }, // supplier_code
    { wch: 30 }, // supplier_name
    { wch: 15 }, // fire_standard
    { wch: 20 }, // fob_20_container_price
    { wch: 20 }, // fob_40_container_price
    { wch: 15 }  // shipping_port
  ]

  const ws = XLSX.utils.json_to_sheet(templateData)
  ws['!cols'] = wscols
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '产品信息模板')
  XLSX.writeFile(wb, '产品信息导入模板.xlsx')
}

// Excel上传前验证
const beforeExcelUpload = (file: File) => {
  const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase())
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB!')
    return false
  }
  showExcelGuide.value = true
  return true
}

// Excel导入处理
const handleExcelImport = (file: UploadFile) => {
  if (!file.raw) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      if (jsonData.length > 0) {
        // TODO: 处理导入的数据
        console.log('导入的数据:', jsonData)
        ElMessage.success(`成功导入 ${jsonData.length} 条数据`)
      }
    } catch (error) {
      console.error('Excel导入错误:', error)
      ElMessage.error('Excel导入失败，请检查文件格式是否正确')
    }
  }
  reader.readAsArrayBuffer(file.raw)
}

// Excel导出处理
const handleExcelExport = () => {
  // TODO: 获取要导出的数据
  const exportData = tableData.value
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '产品列表')
  XLSX.writeFile(wb, '产品信息导出.xlsx')
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
