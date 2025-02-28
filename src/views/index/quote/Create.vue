<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- 固定在顶部的标题栏 -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">创建报价单</h2>
        </div>
        <div class="flex gap-2">
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px;">
      <div class="p-6">
        <el-form
          ref="formRef"
          :model="formData"
          label-width="140px"
          class="max-w-4xl mx-auto"
        >
          <!-- 表单内容 -->
        </el-form>
      </div>
    </div>

    <!-- 固定在底部的提交按钮 -->
    <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0;">
      <div class="bg-white shadow-[0_-2px_3px_rgba(0,0,0,0.1)]">
        <div class="p-4 flex justify-center items-center gap-4 mx-auto max-w-4xl">
          <el-button type="primary" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            提交报价单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible" title="图片预览" width="800px" align-center>
      <img :src="dialogImageUrl" class="w-full" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Back } from '@element-plus/icons-vue'
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