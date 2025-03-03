<template>
  <div class="info-container">
    <div class="content-wrapper">
      <!-- 顶部操作栏 -->
      <div class="top-actions">
            <div class="left-actions">
              <h2 class="page-title">质检报告详情</h2>
            </div>
            <div class="right-actions">
              <template v-if="editingSections.includes('basic')">
                <el-button type="success" @click="handleSave">
                  <el-icon><Check /></el-icon>
                  保存
                </el-button>
                <el-button type="danger" @click="handleCancel">
                  <el-icon><Close /></el-icon>
                  取消
                </el-button>
              </template>
              <template v-else>
                <el-button type="primary" @click="handleEdit('basic')">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
              </template>
              <el-button 
                type="primary" 
                :loading="exporting" 
                @click="handleExport"
                style="min-width: 120px"
              >
                <el-icon><Document /></el-icon>
                {{ exporting ? '导出中...' : '导出文档' }}
              </el-button>
              <el-button @click="router.back()">
                <el-icon><Back /></el-icon>
                返回
              </el-button>
            </div>
          </div>

      <!-- 内容区域 -->
      <div class="tables-container">
        <!-- 基本信息 -->
        <div class="table-section" :class="{ 'editing': editingSections.includes('basic') }">
          <div class="section-header">
            <h3 class="text-lg font-medium">基本信息</h3>
          </div>
          
          <el-form :model="formData" label-width="120px">
            

            <!-- 基本信息表格 -->
            <div class="form-grid">
              <template v-for="(field, key) in basicFields" :key="key">
                <template v-if="!isImageField(key)">
                  <el-form-item :label="field">
                    <template v-if="editingSections.includes('basic')">
                      <template v-if="key === 'currency'">
                        <el-select v-model="formData[key]" class="w-full">
                          <el-option label="人民币" :value="0" />
                          <el-option label="美元" :value="1" />
                        </el-select>
                      </template>
                      <template v-else-if="key === 'bifmaTested' || key === 'cadBlockAvailable' || key === 'productDataAvailable' || key === 'productImagesAvailable'">
                        <el-switch
                          v-model="formData[key]"
                          :active-value="1"
                          :inactive-value="0"
                        />
                      </template>
                      <template v-else-if="key === 'fobPrice'">
                        <el-input-number 
                          v-model="formData[key]" 
                          :precision="2" 
                          :step="0.1" 
                          :min="0"
                          class="w-full"
                        />
                      </template>
                      <template v-else-if="key === 'sampleLeadTime' || key === 'createTime'">
                        <el-date-picker
                          v-model="formData[key]"
                          type="datetime"
                          placeholder="选择日期时间"
                          class="w-full"
                        />
                      </template>
                      <template v-else-if="key === 'remark'">
                        <el-input 
                          v-model="formData[key]"
                          type="textarea"
                          :rows="3"
                          placeholder="请输入备注"
                        />
                      </template>
                      <template v-else>
                        <el-input v-model="formData[key]" />
                      </template>
                    </template>
                    <template v-else>
                      <span class="form-text">{{ formatFieldValue(key, formData[key]) }}</span>
                    </template>
                  </el-form-item>
                </template>
              </template>
            </div>
            <br>
            
            <!-- 图片上传 -->
            <div class="image-section">
              <el-form-item label="产品图片">
                <div class="image-container">
                  <ImageHandler
                    v-model="formData.image"
                    alt="产品图片"
                    :editable="editingSections.includes('basic')"
                    @temp-file="handleTempFile"
                  />
                </div>
              </el-form-item>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Check, Back, Plus, Edit, Close, Document, Picture } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import {getQuotationDetail , updateQuotation} from '@/api/quotation'
import { exportQuotation } from '@/utils/exportQuotation'
import { saveAs } from 'file-saver'
import ImageHandler from '@/components/ImageHandler.vue'

const router = useRouter()
const route = useRoute()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const editingSections = ref<string[]>([])
const loading = ref(false)
const tempFormData = ref<any>(null) // 添加临时数据存储
const exporting = ref(false)
const tempFiles = ref<string[]>([])

interface FormData {
  id?: string;
  image?: string;
  supplier?: string;
  supplierItemCode?: string;
  specificationDetails?: string;
  sampleLeadTime?: string;
  overallDimensionsWidth?: number;
  overallDimensionsDepth?: number;
  overallDimensionsHeight?: number;
  boxDimensionsWidth?: number;
  boxDimensionsDepth?: number;
  boxDimensionsHeight?: number;
  boxWeightNetWeighth?: number;
  netWeightGrossWeight?: string;
  effectiveVol?: string;
  loadingQty?: number;
  moq?: string;
  fobPrice?: number;
  currency?: number;
  bifmaTested?: number;
  cadBlockAvailable?: number;
  productDataAvailable?: number;
  productImagesAvailable?: number;
  salesContacts?: string;
  createTime?: string;
  validPeriod?: string;
  port?: string;
  remark?: string;
}

const formData = ref<FormData>({
  currency: 0,
  bifmaTested: 0,
  cadBlockAvailable: 0,
  productDataAvailable: 0,
  productImagesAvailable: 0,
  fobPrice: 0,
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
  productImagesAvailable: '产品图片',
  salesContacts: '销售',
  createTime: '创建时间',
  validPeriod: '有效期',
  port: '港口',
  remark: '备注'
}

// 判断是否为图片字段
const isImageField = (key: string): boolean => {
  return key === 'image'
}

// 处理图片预览
const handlePictureCardPreview = (uploadFile: UploadFile) => {
  if (!uploadFile.url) return
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 处理图片删除
const handleRemove = () => {
  formData.value.image = undefined
  updateUploadDisplay()
}

// 处理图片变化
const handleImageChange = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result && typeof e.target.result === 'string') {
      formData.value.image = e.target.result
      updateUploadDisplay()
    }
  }
  reader.readAsDataURL(uploadFile.raw)
}

// 更新上传组件显示状态
const updateUploadDisplay = () => {
  nextTick(() => {
    // 选择上传按钮
    const uploadBtn = document.querySelector('.el-upload.el-upload--picture-card')
    if (uploadBtn) {
      (uploadBtn as HTMLElement).style.display = formData.value.image ? 'none' : 'inline-flex'
    }
  })
}

// 获取详情数据
const fetchQuoteDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const response = await getQuotationDetail(parseInt(id))
    formData.value = { ...formData.value, ...response.data }
  } catch (error) {
    console.error('获取详情失败:', error)
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化字段显示值
const formatFieldValue = (key: string, value: any): string => {
  if (value === undefined || value === null) return '-'
  
  switch (key) {
    case 'currency':
      return value === 0 ? '人民币' : '美元'
    case 'bifmaTested':
    case 'cadBlockAvailable':
    case 'productDataAvailable':
    case 'productImagesAvailable':
      return value === 1 ? '是' : '否'
    case 'sampleLeadTime':
    case 'createTime':
      return value ? new Date(value).toLocaleString() : '-'
    case 'fobPrice':
      return typeof value === 'number' ? value.toFixed(2) : '-'
    default:
      return String(value)
  }
}

// 处理编辑
const handleEdit = (section: string) => {
  editingSections.value.push(section)
  // 创建数据副本
  tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  // 更新上传按钮显示状态
  nextTick(() => {
    updateUploadDisplay()
  })
}

// 处理保存
const handleSave = async () => {
  try {
    loading.value = true
    
    // 如果有备份数据，且备份中有图片但当前没有，需要删除旧图片
    if (tempFormData.value?.image && !formData.value.image) {
      try {
        await http.get(`/files/remove?filePath=${tempFormData.value.image}`)
      } catch (error) {
        console.error('删除旧图片失败:', error)
      }
    }

    // 调用更新接口
    await updateQuotation(formData.value)
    
    // 更新备份数据
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
    editingSections.value = []
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = async () => {
  try {
    if (tempFormData.value) {
      // 如果当前图片与备份不同，需要删除临时上传的图片
      if (formData.value.image && formData.value.image !== tempFormData.value.image) {
        try {
          await http.get(`/files/remove?filePath=${formData.value.image}`)
        } catch (error) {
          console.error('删除临时图片失败:', error)
        }
      }
      
      // 恢复到编辑前的状态
      formData.value = JSON.parse(JSON.stringify(tempFormData.value))
    }
    editingSections.value = []
    tempFormData.value = null
    ElMessage.success('已取消编辑')
  } catch (error) {
    console.error('取消编辑失败:', error)
    ElMessage.error('取消编辑失败')
  }
}

// 处理导出
const handleExport = async () => {
  exporting.value = true
  try {
    // 转换字段名为下划线格式
    const exportData = {
      supplier: formData.value.supplier || '',
      supplier_item_code: formData.value.supplierItemCode || '',
      specification_details: formData.value.specificationDetails || '',
      sample_lead_time: formData.value.sampleLeadTime || '',
      overall_dimensions_width: formData.value.overallDimensionsWidth || 0,
      overall_dimensions_depth: formData.value.overallDimensionsDepth || 0,
      overall_dimensions_height: formData.value.overallDimensionsHeight || 0,
      box_dimensions_width: formData.value.boxDimensionsWidth || 0,
      box_dimensions_depth: formData.value.boxDimensionsDepth || 0,
      box_dimensions_height: formData.value.boxDimensionsHeight || 0,
      box_weight_net_weighth: formData.value.boxWeightNetWeighth || 0,
      net_weight_gross_weight: formData.value.netWeightGrossWeight || '0/0',
      effective_vol: formData.value.effectiveVol || '0',
      loading_qty: formData.value.loadingQty || 0,
      moq: formData.value.moq || '0',
      fob_price: formData.value.fobPrice || 0,
      currency: formData.value.currency || 0,
      bifma_tested: formData.value.bifmaTested || 0,
      cad_block_available: formData.value.cadBlockAvailable || 0,
      product_data_available: formData.value.productDataAvailable || 0,
      product_images_available: formData.value.productImagesAvailable || 0,
      sales_contacts: formData.value.salesContacts || '',
      quote_date: formData.value.createTime || new Date().toISOString(),
      valid_period: formData.value.validPeriod || '2024-12-31',
      port: formData.value.port || '宁波港',
      remark: formData.value.remark || '',
      image: formData.value.image || ''
    }
    
    const buffer = await exportQuotation(exportData)
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const createDate = formData.value.createTime 
      ? formData.value.createTime.split('T')[0].replace(/-/g, '')
      : new Date().toISOString().split('T')[0].replace(/-/g, '')
    const fileName = `TC QUOTATION FORM ${exportData.supplier} ${createDate}.xlsx`
    saveAs(blob, fileName)
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

// 处理临时文件
const handleTempFile = (filePath: string) => {
  tempFiles.value.push(filePath)
}

onMounted(async () => {
  await fetchQuoteDetail() // 等待数据获取完成
  updateUploadDisplay()
  // 检查 URL 参数，如果有 edit=1，则自动进入编辑状态
  if (route.query.edit === '1') {
    handleEdit('basic')
  }
})
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
  padding: 16px 24px;
  background-color: var(--section-background);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-lighter);
}

.left-actions {
  flex: 1;
}

.right-actions {
  display: flex;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  color: var(--el-text-color-primary);
  font-weight: 600;
  line-height: 28px;
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
  padding: 0 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
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
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  height: 24px;
  line-height: 24px;
  font-size: 13px;
}

.image-section :deep(.el-form-item__content) {
  width: 100% !important;
  border: none;
  padding: 0;
  background: none;
  height: 200px;
}

.image-container {
  width: 100%;
  height: 100%;
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
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 16px;
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

/* 非编辑状态下的文本显示样式 */
.form-text {
  color: var(--el-text-color-regular);
  padding: 0 12px;
}

/* 编辑状态下的输入框样式 */
:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

/* 编辑状态的样式 */
.table-section.editing {
  background-color: var(--section-editing-background);
  border: 2px solid #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.1);
}

.table-section.editing .section-header {
  border-bottom-color: #409eff;
  background-color: #ecf5ff;
  margin: -16px -16px 16px -16px;
  padding: 16px;
}

.table-section.editing .section-header h3 {
  color: #409eff;
}

.table-section.editing :deep(.el-form-item__label) {
  background-color: #f0f7ff;
  border-color: #a3d0ff;
  color: #409eff;
  font-weight: 600;
}

.table-section.editing :deep(.el-form-item__content) {
  border-color: #a3d0ff;
  background-color: #fff;
}

/* 输入框焦点状态 */
:deep(.el-form-item:has(.el-input__wrapper:focus-within)) .el-form-item__content {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

:deep(.el-input__wrapper:hover) {
  background-color: #f5f7fa;
}

:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-form-item__content:has(.el-input__wrapper:focus-within)) {
  border-color: #409eff;
}

/* 自定义滚动条样式 */
.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: var(--page-background);
}

/* 图片预览样式 */
.preview-image {
  width: 148px;
  height: 148px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.preview-image:hover {
  border-color: #409eff;
  transform: scale(1.02);
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.no-image {
  width: 148px;
  height: 148px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  color: #909399;
}

.no-image .el-icon {
  margin-bottom: 8px;
}
</style> 