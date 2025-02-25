<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? '编辑产品' : '创建产品' }}</h2>
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
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>

      <!-- Excel导入说明 -->
      <div class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="text-lg font-bold text-blue-700 mb-2">Excel导入说明：</h3>
        <ul class="list-disc list-inside text-blue-600 space-y-1">
          <li>请先下载Excel模板，按照模板格式填写数据</li>
          <li>Excel文件大小不能超过5MB</li>
          <li>支持.xlsx和.xls格式的文件</li>
          <li>必填字段：产品代码、供应商代码、供应商名称、防火标准、价格信息</li>
          <li>日期格式：YYYY-MM-DD</li>
          <li>价格必须为数字，最多支持2位小数</li>
        </ul>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="max-w-3xl"
      >
        <el-form-item label="产品代码" prop="tccode">
          <el-input v-model="formData.tccode" placeholder="请输入产品代码" />
        </el-form-item>

        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="formData.supplier" placeholder="请输入供应商" />
        </el-form-item>

        <el-form-item label="供应商代码" prop="supplier_code">
          <el-input v-model="formData.supplier_code" placeholder="请输入供应商代码" />
        </el-form-item>

        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="formData.supplier_name" placeholder="请输入供应商名称" />
        </el-form-item>

        <el-form-item label="防火标准" prop="fire_standard">
          <el-select v-model="formData.fire_standard" placeholder="请选择防火标准" class="w-full">
            <el-option label="BS 5852" value="BS 5852" />
            <el-option label="CAL TB 117" value="CAL TB 117" />
            <el-option label="16 CFR 1633" value="16 CFR 1633" />
            <el-option label="16 CFR 1632" value="16 CFR 1632" />
          </el-select>
        </el-form-item>

        <el-form-item label="20尺柜FOB价格" prop="fob_20_container_price">
          <el-input-number
            v-model="formData.fob_20_container_price"
            :precision="2"
            :step="100"
            :min="0"
            class="w-full"
            placeholder="请输入20尺柜FOB价格"
          />
        </el-form-item>

        <el-form-item label="40尺柜FOB价格" prop="fob_40_container_price">
          <el-input-number
            v-model="formData.fob_40_container_price"
            :precision="2"
            :step="100"
            :min="0"
            class="w-full"
            placeholder="请输入40尺柜FOB价格"
          />
        </el-form-item>

        <el-form-item label="发货港口" prop="shipping_port">
          <el-select v-model="formData.shipping_port" placeholder="请选择发货港口" class="w-full">
            <el-option label="宁波港" value="宁波港" />
            <el-option label="上海港" value="上海港" />
            <el-option label="深圳港" value="深圳港" />
            <el-option label="广州港" value="广州港" />
            <el-option label="青岛港" value="青岛港" />
            <el-option label="天津港" value="天津港" />
          </el-select>
        </el-form-item>

        <el-form-item label="产品图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            accept="image/*"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible" title="预览图片">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus, Upload, Download, Document } from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles } from 'element-plus'
import * as XLSX from 'xlsx'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

// 判断是否是编辑模式
const isEdit = ref(route.path.includes('/edit/'))

// 图片上传相关
const fileList = ref<UploadFiles>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 表单数据
const formData = ref({
  tccode: '',
  supplier: '',
  supplier_code: '',
  supplier_name: '',
  fire_standard: '',
  fob_20_container_price: 0,
  fob_40_container_price: 0,
  shipping_port: '',
  images: []
})

// 表单验证规则
const rules = ref<FormRules>({
  tccode: [
    { required: true, message: '请输入产品代码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  supplier: [
    { required: true, message: '请输入供应商', trigger: 'blur' }
  ],
  supplier_code: [
    { required: true, message: '请输入供应商代码', trigger: 'blur' }
  ],
  supplier_name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  fire_standard: [
    { required: true, message: '请选择防火标准', trigger: 'change' }
  ],
  fob_20_container_price: [
    { required: true, message: '请输入20尺柜FOB价格', trigger: 'blur' }
  ],
  fob_40_container_price: [
    { required: true, message: '请输入40尺柜FOB价格', trigger: 'blur' }
  ],
  shipping_port: [
    { required: true, message: '请选择发货港口', trigger: 'change' }
  ]
})

// 图片预览
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

// 移除图片
const handleRemove = (file: UploadFile, fileList: UploadFiles) => {
  console.log(file, fileList)
}

// Excel模板下载
const handleDownloadTemplate = () => {
  // 创建模板数据
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

  // 设置列宽
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

  // 创建工作表
  const ws = XLSX.utils.json_to_sheet(templateData)
  ws['!cols'] = wscols

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '产品信息模板')

  // 下载文件
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
        const firstRow = jsonData[0] as any
        // 验证必填字段
        const requiredFields = ['tccode', 'supplier_code', 'supplier_name', 'fire_standard']
        const missingFields = requiredFields.filter(field => !firstRow[field])
        
        if (missingFields.length > 0) {
          ElMessage.error(`缺少必填字段: ${missingFields.join(', ')}`)
          return
        }

        // 验证价格格式
        if (isNaN(Number(firstRow.fob_20_container_price)) || isNaN(Number(firstRow.fob_40_container_price))) {
          ElMessage.error('价格必须为数字格式')
          return
        }

        formData.value = {
          ...formData.value,
          ...firstRow,
          fob_20_container_price: Number(firstRow.fob_20_container_price),
          fob_40_container_price: Number(firstRow.fob_40_container_price)
        }
        ElMessage.success('Excel导入成功')
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
  const data = [formData.value]
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Products')
  XLSX.writeFile(wb, '产品信息.xlsx')
}

// 获取编辑数据
const getEditData = async (id: string) => {
  try {
    // TODO: 调用获取详情API
    const mockData = {
      id: 1,
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SA001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      fob_20_container_price: 5000.00,
      fob_40_container_price: 9000.00,
      shipping_port: '宁波港',
      images: []
    }
    formData.value = mockData
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 处理图片数据
      const images = fileList.value.map(file => ({
        url: file.url,
        name: file.name
      }))
      
      const submitData = {
        ...formData.value,
        images
      }
      
      console.log('提交的数据:', submitData)
      // TODO: 调用创建/编辑API
      ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
      router.push('/prod/list')
    }
  })
}

// 在编辑模式下获取数据
onMounted(() => {
  if (isEdit.value && route.params.id) {
    getEditData(route.params.id as string)
  }
})
</script>

<style scoped>
:deep(.el-upload--picture-card) {
  width: 150px;
  height: 150px;
  line-height: 150px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 150px;
  height: 150px;
}
</style> 