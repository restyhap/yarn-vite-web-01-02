<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-y h-screen">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="p-5">
          <el-skeleton-item variant="text" class="w-[30%]" />
          <el-skeleton-item variant="text" class="w-[40%]" />
          <el-skeleton-item variant="text" class="w-full" />
        </div>
      </template>

      <template #default>
        <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
          <!-- Top action bar -->
          <div class="flex justify-between items-center py-3 px-6">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800">Quotation Details</h2>
            </div>
            <div class="flex gap-2">
              <template v-if="editingSections.includes('basic')">
                <el-button type="success" @click="handleSave">
                  <el-icon><Check /></el-icon>
                  Save
                </el-button>
                <el-button type="danger" @click="handleCancel">
                  <el-icon><Close /></el-icon>
                  Cancel
                </el-button>
              </template>
              <template v-else>
                <el-button type="primary" @click="handleEdit('basic')" v-if="canEdit">
                  <el-icon><Edit /></el-icon>
                  Edit
                </el-button>
              </template>
              <el-button type="primary" :loading="exporting" @click="handleExport" class="min-w-[120px]">
                <el-icon><Document /></el-icon>
                {{ exporting ? 'Exporting...' : 'Export Document' }}
              </el-button>
              <el-button @click="router.back()">
                <el-icon><Back /></el-icon>
                Back
              </el-button>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
          <div class="p-6">
            <!-- Basic Information -->
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>Basic Information</span>
                </h3>
              </div>

              <el-form :model="formData" label-width="140px" class="[&_.el-form-item__label]:text-gray-600 [&_.el-form-item__label]:font-medium [&_.el-input__wrapper]:shadow-none [&_.el-input__inner]:h-[38px]">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                  <template v-for="(field, key) in basicFields" :key="key">
                    <template v-if="!isImageField(key)">
                      <el-form-item :label="field" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2 " label-position="left">
                        <template v-if="editingSections.includes('basic')">
                          <template v-if="key === 'currency'">
                            <el-select v-model="formData[key]" class="w-full !h-[38px]">
                              <el-option label="CNY" :value="0" />
                              <el-option label="USD" :value="1" />
                            </el-select>
                          </template>
                          <template v-else-if="key === 'bifmaTested' || key === 'cadBlockAvailable' || key === 'productDataAvailable' || key === 'productImagesAvailable'">
                            <el-switch v-model="formData[key]" :active-value="1" :inactive-value="0" />
                          </template>
                          <template v-else-if="key === 'fobPrice'">
                            <el-input-number v-model="formData[key]" :precision="2" :step="0.1" :min="0" class="w-full" />
                          </template>
                          <template v-else-if="key === 'sampleLeadTime' || key === 'createTime'">
                            <el-date-picker v-model="formData[key]" type="datetime" placeholder="Select date and time" class="w-full" />
                          </template>
                          <template v-else-if="key === 'remark'">
                            <el-input v-model="formData[key]" type="textarea" :rows="3" placeholder="Please enter remarks" />
                          </template>
                          <template v-else>
                            <el-input v-model="formData[key]" class="w-full !h-[38px]" />
                          </template>
                        </template>
                        <template v-else>
                          <div class="w-full text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px]">
                            {{ formatFieldValue(key, formData[key]) || '-' }}
                          </div>
                        </template>
                      </el-form-item>
                    </template>
                  </template>
                </div>

                <!-- Image Upload -->
                <div class="mt-4">
                  <div class="bg-gray-100 p-4 rounded">
                    <div class="text-center text-sm text-gray-600 mb-2 font-medium">Product Image</div>
                    <div class="w-full h-[240px] bg-white rounded-lg overflow-hidden">
                      <div class="w-full h-full flex items-center justify-center">
                        <ImageHandler
                          v-model="imageArray"
                          :editable="editingSections.includes('basic')"
                          @temp-file="handleTempFile"
                          class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                          :size="260"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- Image Preview Dialog -->
    <el-dialog v-model="dialogVisible" title="Image Preview" width="800px" align-center>
      <img :src="dialogImageUrl" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, nextTick, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {Check, Back, Plus, Edit, Close, Document, Picture, CircleClose} from '@element-plus/icons-vue'
import type {UploadFile} from 'element-plus'
import {ElMessage} from 'element-plus'
import {getQuotationGetInfoById, putQuotationUpdate, getFilesRemove, postFilesUpload} from '@/api'
import {getPdfExportQuotation} from '@/api/controller/pdf-export-controller/getPdfExportQuotation'
import {saveAs} from 'file-saver'
import ImageHandler from '@/components/ImageHandler.vue'
import request from '@/api/request'
import {ModuleType, PermissionAction, checkPermission} from '@/utils/permissionUtils'

const router = useRouter()
const route = useRoute()
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const editingSections = ref<string[]>([])
const loading = ref(false)
const tempFormData = ref<any>(null) // 添加临时数据存储
const exporting = ref(false)
const tempFiles = ref<string[]>([])
// 存储临时上传的图片路径，用于取消时删除
const tempUploadedImages = ref<{[key: string]: string[]}>({
  newUploads: []
})
// 添加AbortController相关变量
const abortController = ref<AbortController | null>(null)
// 权限控制
const canEdit = ref(false)

interface FormData {
  id?: string
  image?: string
  supplier?: string
  supplierItemCode?: string
  specificationDetails?: string
  sampleLeadTime?: string
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
  fobPrice?: number
  currency?: number
  bifmaTested?: number
  cadBlockAvailable?: number
  productDataAvailable?: number
  productImagesAvailable?: number
  salesContacts?: string
  createTime?: string
  validPeriod?: string
  port?: string
  remark?: string
}

const formData = ref<FormData>({
  currency: 0,
  bifmaTested: 0,
  cadBlockAvailable: 0,
  productDataAvailable: 0,
  productImagesAvailable: 0,
  fobPrice: 0
})

// 图片数组计算属性
const imageArray = computed({
  get: () => {
    // 如果 formData.image 存在且不为空字符串，则将其作为数组的唯一元素返回
    return formData.value.image && formData.value.image !== '' ? [formData.value.image] : []
  },
  set: (newValue: string[]) => {
    // 获取原始值
    const originalValue = formData.value.image

    // 当 ImageHandler 更新值时，取数组的第一个元素作为 formData.image
    const newImageValue = newValue.length > 0 ? newValue[0] : undefined

    // 如果原始值存在且与新值不同，记录原始值用于可能的删除
    if (originalValue && originalValue !== newImageValue) {
      // 初始化临时存储
      if (!tempUploadedImages.value['basic']) {
        tempUploadedImages.value['basic'] = []
      }
      // 记录被替换的图片路径
      tempUploadedImages.value['basic'].push(originalValue)
      console.log('记录被替换的图片路径:', originalValue)
    }

    // 如果新值是http开头的URL，且不在newUploads中，也添加到newUploads
    if (newImageValue && typeof newImageValue === 'string' && newImageValue.startsWith('http')) {
      const newUploads = tempUploadedImages.value['newUploads'] || []
      if (!newUploads.includes(newImageValue)) {
        if (!tempUploadedImages.value['newUploads']) {
          tempUploadedImages.value['newUploads'] = []
        }
        tempUploadedImages.value['newUploads'].push(newImageValue)
        console.log('记录新的图片URL到newUploads:', newImageValue)
      }
    }

    // 更新图片值
    formData.value.image = newImageValue
  }
})

// 基本字段定义
const basicFields = {
  supplier: 'Supplier',
  supplierItemCode: 'Supplier Item Code',
  specificationDetails: 'Specification Details',
  sampleLeadTime: 'Sample Lead Time',
  overallDimensionsWidth: 'Overall Width',
  overallDimensionsDepth: 'Overall Depth',
  overallDimensionsHeight: 'Overall Height',
  boxDimensionsWidth: 'Box Width',
  boxDimensionsDepth: 'Box Depth',
  boxDimensionsHeight: 'Box Height',
  boxWeightNetWeighth: 'Net Weight',
  netWeightGrossWeight: 'Gross Weight',
  effectiveVol: 'Effective Volume',
  loadingQty: 'Loading Quantity',
  moq: 'Minimum Order Quantity',
  fobPrice: 'FOB Price',
  currency: 'Currency',
  bifmaTested: 'BIFMA Tested',
  cadBlockAvailable: 'CAD Block Available',
  productDataAvailable: 'Product Data Available',
  productImagesAvailable: 'Product Images Available',
  salesContacts: 'Sales Contact',
  createTime: 'Creation Time',
  validPeriod: 'Valid Period',
  port: 'Port',
  remark: 'Remarks'
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
  reader.onload = e => {
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
      ;(uploadBtn as HTMLElement).style.display = formData.value.image ? 'none' : 'inline-flex'
    }
  })
}

// 获取详情数据
const fetchQuoteDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id as string
    const response = await getQuotationGetInfoById({id})

    if (response.code !== '200') {
      ElMessage.error(response.message || 'Failed to get details')
      return
    }

    if (response.data) {
      formData.value = {...formData.value, ...response.data}
    } else {
      ElMessage.error('Failed to get details: data is empty')
    }
  } catch (error) {
    console.error('Failed to get details:', error)
    ElMessage.error('Failed to get details')
  } finally {
    loading.value = false
  }
}

// 格式化字段显示值
const formatFieldValue = (key: string, value: any): string => {
  if (value === undefined || value === null) return '-'

  switch (key) {
    case 'currency':
      return value === 0 ? 'CNY' : 'USD'
    case 'bifmaTested':
    case 'cadBlockAvailable':
    case 'productDataAvailable':
    case 'productImagesAvailable':
      return value === 1 ? 'Yes' : 'No'
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

    // 确保在没有图片时，将 image 字段设置为空字符串
    if (!formData.value.image) {
      formData.value.image = ''
    }

    // 如果有需要删除的图片（之前存在图片被删除的情况）
    if (tempFormData.value?.image && !formData.value.image) {
      try {
        await getFilesRemove({filePath: tempFormData.value.image})
        console.log('Old image deleted from server:', tempFormData.value.image)
      } catch (error) {
        console.error('Failed to delete old image:', error)
      }
    }

    // Call update API
    await putQuotationUpdate(formData.value)

    // 清除编辑状态
    editingSections.value = []
    tempFormData.value = null

    // 清除临时上传记录
    tempUploadedImages.value = {
      newUploads: []
    }

    ElMessage.success('Save successful')
  } catch (error) {
    console.error('Save failed:', error)
    ElMessage.error('Save failed')
  } finally {
    loading.value = false
  }
}

// 处理取消
const handleCancel = async () => {
  try {
    // 如果是新上传的图片，需要删除
    const newUploads = tempUploadedImages.value['newUploads'] || []
    console.log('Cancel edit, delete temporary uploads:', newUploads)

    // 删除所有临时上传的图片
    for (const path of newUploads) {
      if (path && path.startsWith('http') && path !== tempFormData.value?.image) {
        try {
          await getFilesRemove({filePath: path})
          console.log('Temporary uploaded image deleted:', path)
        } catch (error) {
          console.error('Failed to delete temporary uploaded image:', error)
        }
      }
    }

    // 清除临时上传列表
    tempUploadedImages.value = {
      newUploads: []
    }

    // 恢复到编辑前的状态
    if (tempFormData.value) {
      formData.value = JSON.parse(JSON.stringify(tempFormData.value))
    }

    editingSections.value = []
    tempFormData.value = null
    ElMessage.success('Edit cancelled')
  } catch (error) {
    console.error('Failed to cancel edit:', error)
    ElMessage.error('Failed to cancel edit')
  }
}

// 处理导出
const handleExport = async () => {
  exporting.value = true
  try {
    // Initialize AbortController
    abortController.value = new AbortController()
    const signal = abortController.value.signal

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    // 获取报价单ID
    const quotationId = formData.value.id
    if (!quotationId) {
      ElMessage.error('Quotation ID not found')
      return
    }

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    // 调用后端PDF导出API
    const pdfBlob = await getPdfExportQuotation(quotationId)

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    // 生成文件名
    const supplier = formData.value.supplier || 'Unknown'
    const createDate = formData.value.createTime 
      ? formData.value.createTime.split('T')[0].replace(/-/g, '') 
      : new Date().toISOString().split('T')[0].replace(/-/g, '')
    const fileName = `TC_QUOTATION_FORM_${supplier}_${createDate}.pdf`
    
    // 下载PDF文件
    saveAs(pdfBlob, fileName)

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    if ((error as Error).message === '用户取消导出') {
      ElMessage.info('导出已取消')
    } else {
      ElMessage.error(`导出失败: ${(error as Error).message}`)
    }
  } finally {
    exporting.value = false
    abortController.value = null
  }
}

// 处理临时文件
const handleTempFile = (filePath: string) => {
  if (!tempUploadedImages.value['newUploads']) {
    tempUploadedImages.value['newUploads'] = []
  }
  tempUploadedImages.value['newUploads'].push(filePath)
  console.log('记录新上传的图片到newUploads:', filePath)
  tempFiles.value.push(filePath)
}

// 初始化权限
const initPermissions = async () => {
  // 检查编辑权限
  canEdit.value = await checkPermission(ModuleType.QUOTE, PermissionAction.EDIT)
}

onMounted(async () => {
  await initPermissions() // 初始化权限
  await fetchQuoteDetail() // 等待数据获取完成
  updateUploadDisplay()
  // 检查 URL 参数，如果有 edit=1，则自动进入编辑状态（需要有编辑权限）
  if (route.query.edit === '1' && canEdit.value) {
    handleEdit('basic')
  }
})
</script>

<style>
/* 移除所有样式，直接在模板中使用 Tailwind 类名 */
:deep(.el-form-item__label) {
  color: rgb(75 85 99);
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
}

:deep(.el-input__inner) {
  height: 38px;
}

:deep(.image-handler) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

:deep(.image-handler img) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  margin: auto;
}

:deep(.el-upload) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border: 2px dashed rgb(209 213 219);
}

:deep(.el-upload-dragger:hover) {
  border-color: rgb(59 130 246);
}

:deep(.el-upload__tip) {
  display: none;
}

@media (min-width: 1024px) {
  .image-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
