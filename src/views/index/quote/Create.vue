<template>
  <div class="info-container">
    <div class="content-wrapper">
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <div class="left-actions">
          <h2 class="page-title">新建报价单</h2>
        </div>
        <div class="right-actions">
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="tables-container">
        <!-- 基本信息 -->
        <div class="table-section">
          <div class="section-header">
            <h3 class="text-lg font-medium">基本信息</h3>
          </div>
          
          <el-form :model="formData" label-width="120px">
            

            <!-- 基本信息表格 -->
            <div class="form-grid">
              <template v-for="(field, key) in basicFields" :key="key">
                <template v-if="!isImageField(key)">
                  <el-form-item :label="field">
                    <template v-if="isSpecialField(key)">
                      <el-select v-model="formData[key]" class="w-full">
                        <el-option label="人民币" :value="0" />
                        <el-option label="美元" :value="1" />
                      </el-select>
                    </template>
                    <template v-else-if="isSwitchField(key)">
                      <el-switch
                        v-model="formData[key]"
                        :active-value="1"
                        :inactive-value="0"
                        active-text="是"
                        inactive-text="否"
                        class="custom-switch"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #C0C4CC;"
                      />
                    </template>
                    <template v-else-if="isDateTimeField(key)">
                      <el-date-picker
                        v-model="formData[key]"
                        type="datetime"
                        placeholder="选择日期时间"
                        class="w-full"
                      />
                    </template>
                    <template v-else-if="isNumberField(key)">
                      <el-input-number 
                        v-model="formData[key]" 
                        :precision="key === 'fobPrice' ? 2 : 0"
                        :step="key === 'fobPrice' ? 0.1 : 1"
                        :min="0"
                        class="w-full"
                      />
                    </template>
                    <template v-else-if="isTextareaField(key)">
                      <el-input 
                        v-model="formData[key]"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                      />
                    </template>
                    <template v-else>
                      <el-input v-model="formData[key]" />
                    </template>
                  </el-form-item>
                </template>
              </template>
            </div>
            <!-- 图片上传 -->
            <div class="image-section">
              <el-form-item label="产品图片">
                <div class="image-container">
                  <ImageHandler
                    v-model="formData.image"
                    :label="'产品图片'"
                    :limit="1"
                    @preview="handlePreview"
                  />
                </div>
              </el-form-item>
            </div>

            <!-- 底部提交按钮 -->
        <div class="bottom-actions">
          
          <el-button type="primary" size="large" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            提交报价单
          </el-button>
        </div>
          </el-form>
        </div>

        
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible" title="图片预览" width="800px" align-center>
      <img :src="dialogImageUrl" style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Back, Plus } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addQuotation } from '@/api'
import { upload } from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'

const router = useRouter()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')

interface FormData {
  id: string;
  image: string;
  supplier: string;
  supplierItemCode: string;
  specificationDetails: string;
  sampleLeadTime: string | null;
  overallDimensionsWidth: number;
  overallDimensionsDepth: number;
  overallDimensionsHeight: number;
  boxDimensionsWidth: number;
  boxDimensionsDepth: number;
  boxDimensionsHeight: number;
  boxWeightNetWeighth: number;
  netWeightGrossWeight: string;
  effectiveVol: string;
  loadingQty: number;
  moq: string;
  fobPrice: number;
  currency: number;
  bifmaTested: number;
  cadBlockAvailable: number;
  productDataAvailable: number;
  salesContacts: string;
  validPeriod: string;
  port: string;
  remark: string;
  createTime: string | null;
}

const formData = ref<FormData>({
  id: '',
  image: '',
  supplier: '',
  supplierItemCode: '',
  specificationDetails: '',
  sampleLeadTime: null,
  overallDimensionsWidth: 0,
  overallDimensionsDepth: 0,
  overallDimensionsHeight: 0,
  boxDimensionsWidth: 0,
  boxDimensionsDepth: 0,
  boxDimensionsHeight: 0,
  boxWeightNetWeighth: 0,
  netWeightGrossWeight: '0',
  effectiveVol: '0',
  loadingQty: 0,
  moq: '0',
  fobPrice: 0,
  currency: 0,
  bifmaTested: 0,
  cadBlockAvailable: 0,
  productDataAvailable: 0,
  salesContacts: '',
  validPeriod: '',
  port: '',
  remark: '',
  createTime: null
})

// 基本字段定义
const basicFields = {
  supplier: '供应商',
  supplierItemCode: '供应商项目代码',
  specificationDetails: '规格详细信息',
  sampleLeadTime: '样品交付周期',
  overallDimensionsWidth: '总体尺寸宽度',
  overallDimensionsDepth: '总体尺寸深度',
  overallDimensionsHeight: '总体尺寸高度',
  boxDimensionsWidth: '箱体尺寸宽度',
  boxDimensionsDepth: '箱体尺寸深度',
  boxDimensionsHeight: '箱体尺寸高度',
  boxWeightNetWeighth: '箱体重量净重',
  netWeightGrossWeight: '箱体重量毛重',
  effectiveVol: '有效体积',
  loadingQty: '装载量',
  moq: '最小订单量',
  fobPrice: '供货商成本价',
  currency: '货币单位',
  bifmaTested: '测试标准',
  cadBlockAvailable: '3D模块',
  productDataAvailable: '产品数据',
  salesContacts: '销售',
  validPeriod: '有效期',
  port: '港口',
  remark: '备注'
}

// 判断是否为特殊字段
const isSpecialField = (key: keyof FormData): boolean => {
  return ['currency'].includes(key)
}

// 判断是否为开关字段
const isSwitchField = (key: keyof FormData): boolean => {
  return ['bifmaTested', 'cadBlockAvailable', 'productDataAvailable'].includes(key)
}

// 判断是否为图片字段
const isImageField = (key: keyof FormData): boolean => {
  return key === 'image'
}

// 判断是否为日期时间字段
const isDateTimeField = (key: keyof FormData): boolean => {
  return ['sampleLeadTime'].includes(key)
}

// 判断是否为数字字段
const isNumberField = (key: keyof FormData): boolean => {
  return [
    'overallDimensionsWidth',
    'overallDimensionsDepth',
    'overallDimensionsHeight',
    'boxDimensionsWidth',
    'boxDimensionsDepth',
    'boxDimensionsHeight',
    'boxWeightNetWeighth',
    'loadingQty',
    'fobPrice',
    'netWeightGrossWeight'
  ].includes(key)
}

// 判断是否为文本域字段
const isTextareaField = (key: keyof FormData): boolean => {
  return ['specificationDetails', 'remark'].includes(key)
}

// 处理文件上传的函数
const handleFileUpload = async (file: File) => {
  try {
    const formDataObj = new FormData()
    formDataObj.append('file', file)
    
    const uploadResult = await upload(formDataObj)
    if (uploadResult?.data) {
      const imageUrl = uploadResult.data
      formData.value.image = imageUrl
      return imageUrl
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('图片上传失败')
    return ''
  }
}

// 处理图片变化
const handleImageChange = async (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return
  
  // 直接上传文件
  const imageUrl = await handleFileUpload(uploadFile.raw)
  if (imageUrl) {
    // 更新文件列表中的URL
    uploadFile.url = imageUrl
    
    // 手动隐藏上传按钮
    const uploadBtn = document.querySelector('.el-upload--picture-card')
    if (uploadBtn) {
      (uploadBtn as HTMLElement).style.display = 'none'
    }
  }
}

// 处理图片预览
const handlePreview = (imageUrl: string) => {
  dialogImageUrl.value = imageUrl
  dialogVisible.value = true
}

// 处理提交
const handleSubmit = async () => {
  try {
    // 设置创建时间为当前时间
    formData.value.createTime = new Date().toISOString()
    console.log(formData.value);
    // 提交表单数据
    const flag = await addQuotation(formData.value)
    if(flag){
      ElMessage.success('提交成功')
      router.back()
    }else{
      ElMessage.error('提交失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}


</script>

<style scoped>
/* 复用 Info.vue 的样式 */
.info-container {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--page-background);
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 10px;
  padding-top: 10px;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.table-section {
  padding: 16px;
  width: 100%;
  margin-bottom: 24px;
  border: none;
  box-shadow: none;
  background: var(--section-background);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.top-actions {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.left-actions {
  flex: 1;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

/* 修改表单布局样式 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2列布局 */
  gap: 16px;
  width: 100%;
}

/* 修改表单项样式 */
:deep(.el-form-item) {
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

/* 非编辑状态的样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  width: 30% !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 0;
}

:deep(.el-form-item__content) {
  flex: none;
  width: 61.8% !important;
  min-height: 32px;
  line-height: 32px;
  display: flex;
  align-items: center;
  
 
}

/* 图片上传样式 */
.image-section {
  margin-bottom: 24px;
  width: 100%;
}

.image-section :deep(.el-form-item) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.image-section :deep(.el-form-item__label) {
  width: 100% !important;
  justify-content: flex-start;
  border-radius: 4px;
  margin-bottom: 8px;
  border-right: 1px solid #dcdfe6;
}

.image-section :deep(.el-form-item__content) {
  width: 100% !important;
  border: none;
  padding: 0;
  background: none;
}

.image-container {
  position: relative;
  display: inline-block;
}

:deep(.el-upload--picture-card) {
  display: inline-flex;
  width: 148px;
  height: 148px;
  margin: 0;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr); /* 保持2列布局 */
  }
}

@media screen and (max-width: 1000px) {
  .form-grid {
    grid-template-columns: 1fr; /* 在更小的屏幕上切换为单列布局 */
  }
}

/* 底部提交按钮样式 */
.bottom-actions {
  display: flex;
  justify-content: center;

}

.bottom-actions :deep(.el-button) {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
}

:root {
  --page-background: #f5f7fa;  /* 页面背景色 */
  --section-background: #ffffff;  /* 表格区域背景色 */
  --section-header-background: #ffffff;  /* 表格头部背景色 */
  --section-editing-background: #fafcff;  /* 编辑状态背景色 */
}

/* 自定义开关样式 */
:deep(.custom-switch) {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #C0C4CC;
}

:deep(.custom-switch .el-switch__label) {
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 500;
}

:deep(.custom-switch .el-switch__label--left) {
  margin-right: 8px;
}

:deep(.custom-switch .el-switch__label--right) {
  margin-left: 8px;
}

:deep(.custom-switch .el-switch__core) {
  min-width: 50px;
}
</style> 