<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- 固定在顶部的标题栏 -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">Create Quotation</h2>
        </div>
        <div class="flex gap-2">
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            Back
          </el-button>
        </div>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
      <div class="p-6">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" class="w-full mx-auto px-4">
          <!-- 基本信息 -->
          <div class="mb-8 bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <el-form-item label="Supplier" prop="supplier" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.supplier" placeholder="Enter supplier name" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Supplier Item Code" prop="supplierItemCode" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.supplierItemCode" placeholder="Enter supplier item code" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Specification Details" prop="specificationDetails" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.specificationDetails" placeholder="Enter specification details" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Sample Lead Time" prop="sampleLeadTime" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-date-picker v-model="formData.sampleLeadTime" type="datetime" placeholder="Select date and time" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Create Time" prop="createTime" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-date-picker v-model="formData.createTime" type="datetime" placeholder="Select date and time" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Valid Period" prop="validPeriod" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.validPeriod" placeholder="e.g. 2024-12-31" class="w-full !h-[38px]" />
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 尺寸信息 -->
          <div class="mb-8 bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Dimensions</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <el-form-item label="Overall Width" prop="overallDimensionsWidth" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.overallDimensionsWidth" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Overall Depth" prop="overallDimensionsDepth" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.overallDimensionsDepth" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Overall Height" prop="overallDimensionsHeight" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.overallDimensionsHeight" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Box Width" prop="boxDimensionsWidth" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.boxDimensionsWidth" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Box Depth" prop="boxDimensionsDepth" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.boxDimensionsDepth" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Box Height" prop="boxDimensionsHeight" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.boxDimensionsHeight" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Net Weight" prop="boxWeightNetWeighth" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.boxWeightNetWeighth" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Net/Gross Weight" prop="netWeightGrossWeight" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.netWeightGrossWeight" placeholder="e.g. 10/12" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Effective Volume" prop="effectiveVol" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.effectiveVol" placeholder="Enter effective volume" class="w-full !h-[38px]" />
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 价格与订单信息 -->
          <div class="mb-8 bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Price & Order Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <el-form-item label="Loading Qty" prop="loadingQty" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.loadingQty" :precision="0" :step="1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="MOQ" prop="moq" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.moq" placeholder="Enter minimum order quantity" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Port" prop="port" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.port" placeholder="Enter port" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="FOB Price" prop="fobPrice" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input-number v-model="formData.fobPrice" :precision="2" :step="0.1" :min="0" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Currency" prop="currency" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-select v-model="formData.currency" class="w-full !h-[38px]">
                    <el-option label="CNY" :value="0" />
                    <el-option label="USD" :value="1" />
                  </el-select>
                </el-form-item>

                <el-form-item label="Sales Contact" prop="salesContacts" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-input v-model="formData.salesContacts" placeholder="Enter sales contact" class="w-full !h-[38px]" />
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 产品特性 -->
          <div class="mb-8 bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Product Features</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <el-form-item label="BIFMA Tested" prop="bifmaTested" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-switch v-model="formData.bifmaTested" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="CAD Block" prop="cadBlockAvailable" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-switch v-model="formData.cadBlockAvailable" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="Product Data" prop="productDataAvailable" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-switch v-model="formData.productDataAvailable" :active-value="1" :inactive-value="0" />
                </el-form-item>

                <el-form-item label="Product Images" prop="productImagesAvailable" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                  <el-switch v-model="formData.productImagesAvailable" :active-value="1" :inactive-value="0" />
                </el-form-item>
              </div>

              <el-form-item label="Remarks" prop="remark" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="Enter remarks" class="w-full" />
              </el-form-item>

              <el-form-item label="Product Image" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2">
                <div class="w-full h-[200px] border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
                  <div class="w-[200px] h-[200px] flex justify-center items-center">
                    <ImageHandler :model-value="formData.image ? [formData.image] : []" @update:model-value="val => (formData.image = val[0] || '')" alt="Product Image" :editable="true" :size="200" :limit="1" @temp-file="handleTempFile" class="!flex !justify-center !items-center" />
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 固定在底部的提交按钮 -->
    <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0">
      <div class="bg-white shadow-[0_-2px_3px_rgba(0,0,0,0.1)]">
        <div class="p-4 flex justify-center items-center">
          <el-button type="primary" size="large" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon>
            Submit
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, FormInstance} from 'element-plus'
import {Back, Check} from '@element-plus/icons-vue'
import {postQuotationSave} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const tempFiles = ref<string[]>([])

// 表单数据
const formData = reactive({
  supplier: '',
  supplierItemCode: '',
  specificationDetails: '',
  sampleLeadTime: '',
  overallDimensionsWidth: 0,
  overallDimensionsDepth: 0,
  overallDimensionsHeight: 0,
  boxDimensionsWidth: 0,
  boxDimensionsDepth: 0,
  boxDimensionsHeight: 0,
  boxWeightNetWeighth: 0,
  netWeightGrossWeight: '',
  effectiveVol: '',
  loadingQty: 0,
  moq: '',
  fobPrice: 0,
  currency: 0,
  bifmaTested: 0,
  cadBlockAvailable: 0,
  productDataAvailable: 0,
  productImagesAvailable: 0,
  salesContacts: '',
  createTime: new Date(),
  validPeriod: '2024-12-31',
  port: '宁波港',
  remark: '',
  image: ''
})

// 表单验证规则
const rules = {
  supplier: [{required: true, message: 'Please enter supplier name', trigger: 'blur'}],
  supplierItemCode: [{required: true, message: 'Please enter supplier item code', trigger: 'blur'}],
  fobPrice: [{required: true, message: 'Please enter FOB price', trigger: 'blur'}]
}

// 处理临时文件
const handleTempFile = (filePath: string) => {
  tempFiles.value.push(filePath)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async valid => {
    if (!valid) {
      ElMessage.error('Please complete the form')
      return
    }

    try {
      submitting.value = true
      await postQuotationSave(formData)
      ElMessage.success('创建成功')
      router.push('/quote/list')
    } catch (error) {
      console.error('创建失败:', error)
      ElMessage.error('创建失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
  position: relative;
}

.page-header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  padding-bottom: 80px; /* 为底部按钮留出空间 */
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 10px;
}

.feature-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.image-upload-container {
  width: 100%;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: #fff;
  box-shadow: 0 -1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .form-row,
  .feature-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .form-row,
  .feature-row {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }

  .header-actions {
    margin-top: 10px;
  }
}

/* 自定义滚动条 */
.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input-number) {
  width: 100%;
}

/* 图片上传区域样式 */
:deep(.image-handler) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

:deep(.image-handler .el-upload) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

:deep(.image-handler .el-upload-dragger) {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
</style>
