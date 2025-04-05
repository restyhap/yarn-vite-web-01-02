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
        <!-- 顶部导航栏 -->
        <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div class="flex justify-between items-center py-3 px-6">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800">QC Report Details</h2>
            </div>
            <div class="flex gap-2">
              <el-button type="primary" @click="handleEdit('basic')" v-if="!isEditing">
                <el-icon><Edit /></el-icon>
                Edit
              </el-button>
              <el-button type="success" @click="handleSave" v-if="isEditing">
                <el-icon><Check /></el-icon>
                Save
              </el-button>
              <el-button type="danger" @click="handleCancel" v-if="isEditing">
                <el-icon><Close /></el-icon>
                Cancel
              </el-button>
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

        <!-- 主要内容区域 -->
        <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
          <div class="p-6">
            <!-- 基本信息部分 -->
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>Basic Information</span>
                </h3>
              </div>

              <!-- 基本信息表单 -->
              <el-form :model="formData" label-width="140px" class="[&_.el-form-item__label]:text-gray-600 [&_.el-form-item__label]:font-medium [&_.el-input__wrapper]:shadow-none [&_.el-input__inner]:h-[38px]">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                  <template v-for="(label, key) in basicFields" :key="key">
                    <el-form-item v-if="key !== 'comments'" :label="label" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                      <!-- 编辑状态显示输入框 -->
                      <template v-if="editingSections.includes('basic')">
                        <el-input v-model="tempFormData.qcReports[key]" :placeholder="`Please enter ${label}`" class="w-full !h-[38px]" />
                      </template>
                      <!-- 非编辑状态显示文本 -->
                      <template v-else>
                        <div class="w-full text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px]">
                          {{ isEditing ? tempFormData.qcReports?.[key] || '-' : formData.qcReports?.[key] || '-' }}
                        </div>
                      </template>
                    </el-form-item>
                  </template>
                </div>

                <!-- 评价内容单独处理 -->
                <div class="mt-4">
                  <div class="bg-gray-100 p-1 rounded">
                    <div class="flex items-center mb-2">
                      <div class="min-w-[140px] px-2 text-gray-600 font-medium">{{ basicFields.comments }}</div>
                    </div>
                    <div class="w-full px-2">
                      <!-- 编辑状态显示文本域 -->
                      <template v-if="editingSections.includes('basic')">
                        <el-input v-model="tempFormData.qcReports.comments" type="textarea" :rows="3" placeholder="Please enter comments" class="w-full" />
                      </template>
                      <!-- 非编辑状态显示文本 -->
                      <template v-else>
                        <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                          {{ isEditing ? tempFormData.qcReports?.comments || '-' : formData.qcReports?.comments || '-' }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </el-form>
            </div>

            <!-- 图片部分 -->
            <template v-for="(section, index) in imageSections" :key="index">
              <div class="mb-8">
                <div class="flex items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                    <span>{{ section.title }}</span>
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <template v-for="(label, key) in section.fields" :key="key">
                    <div class="bg-gray-100 p-4 rounded">
                      <div class="text-center text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>
                      <div class="w-full h-[240px] bg-white rounded-lg overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center">
                          <ImageHandler
                            :model-value="getImageValue(key)"
                            @update:model-value="val => updateImageValue(key, val)"
                            :editable="isEditing"
                            :size="200"
                            :custom-upload="handleCustomUpload"
                            :multiple="false"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>

            <!-- 缺陷记录部分 -->
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>Defect Records</span>
                  <el-button type="primary" @click="addDefectDialogVisible = true">
                    <el-icon><Plus /></el-icon>
                    Add Defect Record
                  </el-button>
                </h3>
              </div>

              <!-- 添加缺陷记录弹窗 -->
              <DefectDialog v-model:visible="addDefectDialogVisible" title="Add Defect Record" :loading="loading" :custom-upload="handleCustomUpload" @save="handleSaveNewDefect" @close="handleCloseDialog" />

              <div class="mt-4 space-y-6">
                <template v-for="(defectDto, index) in formData.defectsDTO" :key="defectDto.defects?.id">
                  <div :id="`defect-record-${index}`" class="rounded p-4 border border-gray-200">
                    <!-- 标题栏 -->
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                      <!-- 标题内容 -->
                      <div class="w-1/2 mr-4">
                        <div class="bg-gray-100 p-1 rounded">
                          <div class="flex items-center mb-2">
                            <div class="min-w-[140px] px-2 text-gray-600 font-medium">Title</div>
                          </div>
                          <div class="w-full px-2">
                            <template v-if="editingSections.includes(`defect-${index}`)">
                              <el-input v-model="tempFormData.defectsDTO[index].defects.defectTitle" placeholder="Please enter title" class="w-full !h-[38px]" />
                            </template>
                            <template v-else>
                              <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                                {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.defectTitle || '-' : defectDto.defects?.defectTitle || '-' }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>

                      <!-- 操作按钮 -->
                      <div class="flex gap-4">
                        <template v-if="editingSections.includes(`defect-${index}`)">
                          <el-button type="success" @click="handleSaveDefect(index, tempFormData.defectsDTO[index].defects)">
                            <el-icon><Check /></el-icon>
                            Save
                          </el-button>
                          <el-button type="danger" @click="handleCancelDefect(index)">
                            <el-icon><Close /></el-icon>
                            Cancel
                          </el-button>
                        </template>
                        <template v-else>
                          <el-button type="primary" @click="handleEditDefect(index)">
                            <el-icon><Edit /></el-icon>
                            Edit
                          </el-button>
                          <el-button type="danger" @click="handleDeleteDefect(index)">
                            <el-icon><Delete /></el-icon>
                            Delete
                          </el-button>
                        </template>
                      </div>
                    </div>

                    <!-- 问题描述和检验员一行 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <!-- 问题描述 -->
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">Description</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.defectDescription" placeholder="Please enter description" class="w-full !h-[38px]" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.defectDescription || '-' : defectDto.defects?.defectDescription || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>

                      <!-- 质检员 -->
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">Inspector</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.inspector" placeholder="Please enter inspector" class="w-full !h-[38px]" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.inspector || '-' : defectDto.defects?.inspector || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- 改进建议独占一行 -->
                    <div class="mb-4">
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">Improvement Suggestion</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.improvementSuggestion" type="textarea" :rows="3" placeholder="Please enter improvement suggestion" class="w-full" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.improvementSuggestion || '-' : defectDto.defects?.improvementSuggestion || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- 缺陷图片 -->
                    <div class="bg-gray-100 p-4 rounded">
                      <div class="text-center text-sm text-gray-600 mb-2 font-medium">Defect Images</div>
                      <div class="w-full h-[200px] bg-white rounded-lg overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center">
                          <ImageHandler
                            :model-value="editingSections.includes(`defect-${index}`) 
                              ? ([...new Set(tempFormData?.defectsDTO?.[index]?.defectImages?.map((img: any) => img.imagePath).filter(Boolean) || [])]) 
                              : ([...new Set(getDefectImages(defectDto))])"
                            @update:model-value="val => handleDefectImageUpdate(val, defectDto.defects?.id, index)"
                            :editable="editingSections.includes(`defect-${index}`)"
                            :size="200"
                            :custom-upload="params => handleDefectCustomUpload(params, defectDto.defects?.id, index)"
                            :multiple="true"
                            :limit="2"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, nextTick} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Document, Edit, Check, Close, Delete, Plus, Back, CircleClose} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {exportQCReport} from '@/utils/exportQCReport'
import type {QCReportData} from '@/utils/exportQCReport'
import {saveAs} from 'file-saver'
import {QcReports, QcReportsDto, DefectImages, Defects, DefectsDto} from '@/api'
import {putQcReportsUpdate, getQcReportsDtoGetById, getFilesRemove, postFilesUpload, postDefectImagesSave, deleteDefectImagesRemoveById, deleteDefectsRemoveById, putDefectsUpdate, putDefectImagesUpdate, postDefectsSave} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'
import {getId} from '@/utils/idUtils'
import DefectDialog from '@/components/DefectDialog.vue'

// 数据相关
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const editingSections = ref<string[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 添加调试模式开关
const showDebugInfo = ref(false) // 可以根据需要设置为true或false

const formData = ref<QcReportsDto>({} as QcReportsDto)

const tempFormData = ref<any>(null)

const tempFiles = ref<string[]>([])

// 基本字段映射
const basicFields = {
  modelCode: 'Model Code',
  factoryCode: 'Factory Code',
  poNumber: 'PO Number',
  inspectionDate: 'Inspection Date',
  inspectQty: 'Inspection Quantity',
  qcOfficer: 'QC Officer',
  passFail: 'Inspection Result',
  secondQcDate: 'Second Inspection Date',
  comments: 'Comments'
} as const

// 图片部分定义
const imageSections = {
  appearance: {
    title: 'Product Appearance',
    fields: {
      stocksInWarehouse: 'Warehouse Stock',
      samplingOfProductsQuantity: 'Product Sampling Quantity',
      shippingMarks: 'Shipping Marks',
      barcode: 'Barcode',
      packingOutside: 'Outer Packaging',
      packingInside: 'Inner Packaging'
    }
  },
  chairComponents: {
    title: 'Chair Components',
    fields: {
      chairComponentsPacked: 'Packed',
      chairComponentsUnpacked: 'Unpacked'
    }
  },
  fittingPack: {
    title: 'Fitting Pack',
    fields: {
      fittingPackPacked: 'Packed',
      fittingPackUnpacked: 'Unpacked'
    }
  },
  labelsAndInstructions: {
    title: 'Labels and Instructions',
    fields: {
      productionLabel: 'Production Label',
      assemblyInstructions: 'Assembly Instructions'
    }
  },
  components: {
    title: 'Component Images',
    fields: {
      imageOfComponentsSeat: 'Seat',
      imageOfComponentsBack: 'Back',
      imageOfComponentsBase: 'Base',
      imageOfComponentsCastors: 'Castors',
      imageOfComponentsGasLiftCover: 'Gas Lift Cover',
      imageOfComponentsGasLiftStamp: 'Gas Lift Mark',
      imageOfComponentsArmrest: 'Armrest',
      imageOfComponentMechanism: 'Mechanism',
      imageOfComponentsHeadrest: 'Headrest'
    }
  },
  finishedProduct: {
    title: 'Finished Product Images',
    fields: {
      imageOfProductBuiltFront: 'Front View',
      imageOfProductBuiltSide: 'Side View',
      imageOfProductBuiltBack: 'Back View',
      imageOfProductBuilt45Degree: '45 Degree View',
      frontImageOfProductBuiltCompare1: 'Sample Comparison 1',
      frontImageOfProductBuiltCompare2: 'Sample Comparison 2'
    }
  },
  functionCheck: {
    title: 'Function Check',
    fields: {
      functionCheckSeatHeightExtension: 'Seat Height Adjustment',
      functionCheckMechanismAdjustment: 'Mechanism Adjustment',
      functionCheckArmrestAdjustment: 'Armrest Adjustment',
      functionCheckHeadrestAdjustment: 'Headrest Adjustment',
      functionCheckOther1: 'Other 1',
      functionCheckOther2: 'Other 2'
    }
  }
} as const

// 添加导出状态变量和AbortController
const exporting = ref(false)
const abortController = ref<AbortController | null>(null)

const getData = async () => {
  console.log((' route.params.id as string ======== ' + route.params.id) as string)
  const res = await getQcReportsDtoGetById({id: route.params.id as string})

  // Print original data for debugging
  console.log('Original res.data ======== ' + JSON.stringify(res.data))

  // Check defectsDTO data
  if (res.data && Array.isArray(res.data.defectsDTO)) {
    console.log('Number of defect records:', res.data.defectsDTO.length)

    // Print each record's ID to check for duplicates
    res.data.defectsDTO.forEach((dto: DefectsDto, index: number) => {
      console.log(`Defect record #${index + 1}:`, dto.defects?.id, dto.defects?.defectTitle, 'Number of images:', dto.defectImages?.length || 0)
    })

    // Ensure each defectsDTO object is independent (deep copy)
    res.data.defectsDTO = res.data.defectsDTO.map((dto: DefectsDto) => {
      // Use JSON serialization and deserialization for deep copy
      return JSON.parse(JSON.stringify(dto))
    })

    // Use Map for deduplication to ensure no duplicate defectId
    const uniqueMap = new Map()
    const uniqueDefects: DefectsDto[] = []

    for (const defectDto of res.data.defectsDTO) {
      if (defectDto.defects) {
        const defectId = defectDto.defects.id
        // If this ID hasn't been added yet, add it to the result
        if (!uniqueMap.has(defectId)) {
          uniqueMap.set(defectId, true)
          uniqueDefects.push(defectDto)
        } else {
          console.warn(`Duplicate defect record ID found: ${defectId}`)
        }
      }
    }

    // Replace original data with deduplicated data
    res.data.defectsDTO = uniqueDefects

    // Print processed data for verification
    console.log('Number of defect records after processing:', res.data.defectsDTO.length)
    res.data.defectsDTO.forEach((dto: DefectsDto, index: number) => {
      console.log(`Processed defect record #${index + 1}:`, dto.defects?.id, dto.defects?.defectTitle)
    })
  }

  // Use deep copy to ensure formData won't be affected by subsequent operations
  formData.value = JSON.parse(JSON.stringify(res.data))
  loading.value = false
}

// Add initialization
onMounted(() => {
  getData()

  // Check URL query parameters, if edit=true, automatically enter edit mode
  if (route.query.edit === 'true') {
    // Ensure data is loaded
    if (formData.value) {
      handleEdit('basic')
    } else {
      ElMessage.warning('Failed to load data, cannot enter edit mode')
    }
  }
})

// Add missing variables and functions
const addDefectDialogVisible = ref(false)
const isEditing = ref(false)

// Get image value based on edit state
const getImageValue = (key: string) => {
  if (isEditing.value && tempFormData.value?.qcReports) {
    // Get from temporary data in edit mode
    const value = tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]

    // Handle different types of values
    if (typeof value === 'string') {
      // If it's a string and not empty, wrap it in an array
      return value ? [value] : []
    } else if (Array.isArray(value)) {
      // If it's already an array, return directly
      return value
    } else if (value === null || value === undefined) {
      // If it's null or undefined, return empty array
      return []
    } else {
      // For other types (like numbers), convert to string and wrap in array
      return [String(value)]
    }
  } else if (formData.value?.qcReports) {
    // Get from official data in non-edit mode
    const value = formData.value.qcReports[key as keyof typeof formData.value.qcReports]

    // Handle different types of values
    if (typeof value === 'string') {
      // If it's a string and not empty, wrap it in an array
      return value ? [value] : []
    } else if (Array.isArray(value)) {
      // If it's already an array, return directly
      return value
    } else if (value === null || value === undefined) {
      // If it's null or undefined, return empty array
      return []
    } else {
      // For other types (like numbers), convert to string and wrap in array
      return [String(value)]
    }
  }
  return []
}

// Temporarily store uploaded image paths for cancellation
const tempUploadedImages = ref<{[key: string]: string[]}>({})

// Store pending operations (add, delete, update)
const pendingOperations = ref<{
  [key: string]: {
    toDelete: {id?: string; path: string}[]
    toAdd: {defectId?: string; path: string}[]
    toUpdate: {id: string; defectId?: string; path: string}[]
  }
}>({})

// Initialize pending operations
const initPendingOperations = (key: string) => {
  if (!pendingOperations.value[key]) {
    pendingOperations.value[key] = {
      toDelete: [],
      toAdd: [],
      toUpdate: []
    }
  }
}

// Handle image value update
const updateImageValue = async (key: string, val: string | string[]) => {
  console.log(`Update image value - Key: ${key}, Value:`, val)
  console.log('Current edit state:', isEditing.value)

  // Ensure val is valid
  let newValue = ''

  // Handle different types of input values
  if (Array.isArray(val)) {
    // If it's an array (image URL array)
    if (val.length > 0) {
      newValue = val[0]
      console.log('Processing array value, using first element:', newValue)
    }
  } else if (typeof val === 'string') {
    // If it's a string (direct string value)
    newValue = val
    console.log('Processing string value:', newValue)
  }

  // Decide which data object to update based on edit state
  if (isEditing.value && tempFormData.value?.qcReports) {
    // Update temporary data in edit mode
    console.log('Temporary data before update:', JSON.stringify(tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]))

    // Get old value to check if server image needs to be deleted
    const oldValue = tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]

    // Initialize basic operations
    initPendingOperations('basic')

    // Check if it's a delete operation (old value exists but new value is empty)
    if (oldValue && !newValue) {
      console.log(`Delete operation detected - Key: ${key}, Old value:`, oldValue)

      // Record deleted image path
      if (typeof oldValue === 'string' && oldValue.startsWith('http')) {
        pendingOperations.value['basic'].toDelete.push({path: oldValue})
        console.log(`Record image path to delete: ${oldValue} to basic`)
      }
    } else if (newValue && oldValue !== newValue) {
      // If it's a newly uploaded image, record old image path for possible deletion
      if (oldValue && typeof oldValue === 'string' && oldValue.startsWith('http')) {
        // Record replaced image path
        pendingOperations.value['basic'].toDelete.push({path: oldValue})
        console.log(`Record replaced image path: ${oldValue} to basic`)
      }

      // Record newly uploaded image path
      if (newValue.startsWith('http')) {
        // Initialize temporary storage
        if (!tempUploadedImages.value['newUploads']) {
          tempUploadedImages.value['newUploads'] = []
        }
        tempUploadedImages.value['newUploads'].push(newValue)
        console.log(`Record newly uploaded image to newUploads: ${newValue}`)
      }
    }

    tempFormData.value.qcReports = {
      ...tempFormData.value.qcReports,
      [key]: newValue
    }

    console.log('Updated temporary data:', JSON.stringify(tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]))
  } else if (formData.value?.qcReports) {
    // 非编辑状态下更新正式数据
    console.log('Update official data:', JSON.stringify(formData.value.qcReports[key as keyof typeof formData.value.qcReports]))

    // 获取旧值，用于检查是否需要删除服务器上的图片
    const oldValue = formData.value.qcReports[key as keyof typeof formData.value.qcReports]

    // 检查是否是删除操作（旧值存在但新值为空）
    if (oldValue && !newValue) {
      console.log(`Delete operation detected - Key: ${key}, Old value:`, oldValue)

      try {
        // 从服务器删除图片文件
        if (typeof oldValue === 'string' && oldValue.startsWith('http')) {
          await getFilesRemove({filePath: oldValue})
          console.log(`Deleted image file from server: ${oldValue}`)
        }
      } catch (error) {
        console.error(`Failed to delete image file from server: ${oldValue}`, error)
        ElMessage.warning('Image file deletion failed, but removed from record')
      }
    }

    formData.value.qcReports = {
      ...formData.value.qcReports,
      [key]: newValue
    }

    console.log('Updated official data:', JSON.stringify(formData.value.qcReports[key as keyof typeof formData.value.qcReports]))
  }
}

// Custom image upload processing function
const handleCustomUpload = async (params: {file: File}) => {
  try {
    // 直接使用File对象
    const res = await postFilesUpload({file: params.file})
    const imagePath = res.data

    // Initialize temporary storage
    if (!tempUploadedImages.value['newDefect']) {
      tempUploadedImages.value['newDefect'] = []
    }

    // Add to temporary upload image list
    tempUploadedImages.value['newDefect'].push(imagePath)
    console.log(`Added temporary image: ${imagePath} to newDefect`)

    return imagePath
  } catch (error) {
    console.error('Image upload failed', error)
    ElMessage.error('Image upload failed')
    return ''
  }
}

const handleCloseDialog = async () => {
  // If there are temporary uploaded images, delete them
  if (tempUploadedImages.value['newDefect'] && tempUploadedImages.value['newDefect'].length > 0) {
    try {
      // Delete uploaded images
      for (const imagePath of tempUploadedImages.value['newDefect']) {
        if (imagePath && imagePath.startsWith('http')) {
          await getFilesRemove({filePath: imagePath})
          console.log(`Temporary image deleted from server: ${imagePath}`)
        }
      }
      tempUploadedImages.value['newDefect'] = [] // Clear temporary image list
    } catch (error) {
      console.error('Failed to delete temporary images', error)
    }
  }

  addDefectDialogVisible.value = false
}

// Handle edit
const handleEdit = (section: string) => {
  isEditing.value = true
  // Create a deep copy of temporary form data
  tempFormData.value = JSON.parse(JSON.stringify(formData.value))

  // Ensure tempFormData.qcReports exists
  if (!tempFormData.value.qcReports) {
    tempFormData.value.qcReports = {}
  }

  editingSections.value.push(section)
}

// Handle defect record related functions
const handleSaveNewDefect = async (defect: any) => {
  try {
    loading.value = true

    // Set report ID
    defect.reportId = formData.value.qcReports?.id

    // 1. Save defect record
    const saveDefectRes = await postDefectsSave(defect)
    if (!saveDefectRes.data) {
      ElMessage.error('保存缺陷记录失败')
      return
    }

    // 从 defect 对象中获取 ID
    const defectId = defect.id

    // 2. Save defect images
    const defectImages =
      defect.images?.map((img: any) => ({
        id: getId(),
        defectId,
        imagePath: img.imagePath
      })) || []

    if (defectImages.length > 0) {
      console.log('-----------defectImages', defectImages)
      // 一个一个保存图片
      for (const image of defectImages) {
        await postDefectImagesSave(image)
      }
    }

    // 3. Update local data
    if (!formData.value.defectsDTO) {
      formData.value.defectsDTO = []
    }

    // Get latest defect record data
    const updatedDefect = {
      defects: {
        id: defectId,
        reportId: defect.reportId,
        defectTitle: defect.defectTitle,
        defectDescription: defect.defectDescription,
        improvementSuggestion: defect.improvementSuggestion,
        inspector: defect.inspector,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      defectImages:
        defect.images?.map((img: any) => ({
          id: img.id,
          defectId,
          imagePath: img.imagePath,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt
        })) || []
    }

    formData.value.defectsDTO.push(updatedDefect)
    ElMessage.success('Defect record added successfully')
  } catch (error) {
    console.error('Failed to add defect record', error)
    ElMessage.error('Failed to add defect record')
  } finally {
    loading.value = false
    addDefectDialogVisible.value = false
  }
}

const handleEditDefect = (index: number) => {
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }

  // Initialize temporary image storage and operations for this defect record
  const defectKey = `defect-${index}`
  if (!tempUploadedImages.value[defectKey]) {
    tempUploadedImages.value[defectKey] = []
  }

  // Initialize pending operations
  initPendingOperations(defectKey)

  editingSections.value.push(defectKey)
}

const handleSaveDefect = async (index: number, defect: any) => {
  try {
    loading.value = true
    const defectKey = `defect-${index}`

    // 1. Update defect basic information
    await putDefectsUpdate(defect)

    // 2. Get current defect record image data
    const currentDefectDto = formData.value.defectsDTO?.[index]
    const tempDefectDto = tempFormData.value.defectsDTO?.[index]

    if (currentDefectDto && tempDefectDto) {
      // 3. Execute pending operations
      if (pendingOperations.value[defectKey]) {
        const operations = pendingOperations.value[defectKey]

        // 3.1 Execute delete operations
        for (const item of operations.toDelete) {
          try {
            if (item.id) {
              // Delete image record from database
              await deleteDefectImagesRemoveById({id: item.id})
              console.log(`Image record deleted from database: ${item.id}`)
            }

            // 从服务器删除图片文件
            if (item.path) {
              await getFilesRemove({filePath: item.path})
              console.log(`Image file deleted from server: ${item.path}`)
            }
          } catch (error) {
            console.error(`Delete operation failed: ${item.path}`, error)
          }
        }

        // 3.2 Execute add operations
        for (const item of operations.toAdd) {
          try {
            // 添加新图片到数据库
            const imageData: DefectImages = {
              id: getId(), // 使用getId()函数生成新的ID
              defectId: defect.id,
              imagePath: item.path
            }
            await postDefectImagesSave(imageData)
            console.log(`New image added to database: ${item.path}`)
          } catch (error) {
            console.error(`Add operation failed: ${item.path}`, error)
          }
        }

        // 3.3 Execute update operations
        for (const item of operations.toUpdate) {
          try {
            // 更新现有图片
            await putDefectImagesUpdate({
              id: item.id,
              defectId: defect.id,
              imagePath: item.path
            })
            console.log(`Image updated in database: ${item.id}`)
          } catch (error) {
            console.error(`Update operation failed: ${item.id}`, error)
          }
        }

        // 清空待执行操作
        pendingOperations.value[defectKey] = {
          toDelete: [],
          toAdd: [],
          toUpdate: []
        }
      }

      // 4. Clean up temporary uploaded images
      if (tempUploadedImages.value[defectKey] && tempUploadedImages.value[defectKey].length > 0) {
        // Clear this part's temporary image records
        tempUploadedImages.value[defectKey] = []
      }

      // 5. Update local data
      // Use deep copy to ensure data independence
      if (formData.value.defectsDTO) {
        formData.value.defectsDTO[index] = JSON.parse(JSON.stringify(tempDefectDto))
      }
    }

    // 6. Exit edit mode
    editingSections.value = editingSections.value.filter(item => item !== defectKey)
    ElMessage.success('Save successful')
  } catch (error) {
    console.error('Save failed', error)
    ElMessage.error('Save failed')
  } finally {
    loading.value = false
  }
}

const handleCancelDefect = async (index: number) => {
  const defectKey = `defect-${index}`

  // Check for temporary uploaded defect images to delete
  if (tempFormData.value?.defectsDTO?.[index]) {
    const originalDefect = formData.value.defectsDTO?.[index]
    const tempDefect = tempFormData.value.defectsDTO[index]

    // Get original image paths
    const originalImagePaths = originalDefect?.defectImages?.map((img: DefectImages) => img.imagePath).filter(Boolean) || []

    // Get temporary image paths
    const tempImagePaths = tempDefect?.defectImages?.map((img: DefectImages) => img.imagePath).filter(Boolean) || []

    // Find temporary added image paths (in temporary data but not in original data)
    const newImagePaths = tempImagePaths.filter((path: string) => !originalImagePaths.includes(path))

    // Delete temporary image files from server
    if (newImagePaths.length > 0) {
      console.log(`Temporary images to delete when canceling defect record edit:`, newImagePaths)

      for (const imagePath of newImagePaths) {
        try {
          // Delete image file from server
          if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('http')) {
            await getFilesRemove({filePath: imagePath})
            console.log(`Temporary defect image file deleted from server: ${imagePath}`)
          }
        } catch (error) {
          console.error(`Failed to delete temporary defect image file from server: ${imagePath}`, error)
        }
      }
    }

    // Check temporary stored images
    if (tempUploadedImages.value[defectKey] && tempUploadedImages.value[defectKey].length > 0) {
      console.log(`Cancel edit, delete temporary images recorded in ${defectKey}:`, tempUploadedImages.value[defectKey])

      // Delete all recorded temporary images
      for (const path of tempUploadedImages.value[defectKey]) {
        if (path && path.startsWith('http')) {
          try {
            await getFilesRemove({filePath: path})
            console.log('Temporary image deleted from server:', path)
          } catch (error) {
            console.error('Failed to delete temporary image from server:', error)
          }
        }

        // Clear temporary image records for this section
        tempUploadedImages.value[defectKey] = []
      }

      // Clear pending operations
      pendingOperations.value[defectKey] = {
        toDelete: [],
        toAdd: [],
        toUpdate: []
      }
    }
  }

  // Clear pending operations
  if (pendingOperations.value[defectKey]) {
    pendingOperations.value[defectKey] = {
      toDelete: [],
      toAdd: [],
      toUpdate: []
    }
  }

  // Restore original data
  if (formData.value?.defectsDTO?.[index] && tempFormData.value?.defectsDTO?.[index]) {
    tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(formData.value.defectsDTO[index]))
  }

  // Remove edit state
  editingSections.value = editingSections.value.filter(item => item !== defectKey)
}

const handleDeleteDefect = async (index: number) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this defect record?', 'Confirm', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    const defectDto = formData.value.defectsDTO?.[index]
    const defectId = defectDto?.defects?.id

    if (defectId) {
      // 1. Delete all related image files first
      const defectImages = defectDto?.defectImages || []
      if (defectImages.length > 0) {
        console.log(`Deleting ${defectImages.length} images for defect record ${defectId}`)

        // Delete each image
        for (const img of defectImages) {
          if (img.imagePath) {
            try {
              // Delete image file from server
              await getFilesRemove({filePath: img.imagePath})
              console.log(`Image file deleted from server: ${img.imagePath}`)
            } catch (error) {
              console.error(`Failed to delete image file from server: ${img.imagePath}`, error)
            }
          }
        }
      }

      // 2. Delete defect record (database will cascade delete related image records)
      await deleteDefectsRemoveById({id: defectId})

      // 3. Update local data
      formData.value.defectsDTO?.splice(index, 1)
      ElMessage.success('Delete successful')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete failed', error)
      ElMessage.error('Delete failed')
    }
  }
}

const handleDefectImageUpdate = async (val: string | string[], defectId: string | undefined, index: number) => {
  if (!formData.value.defectsDTO?.[index]) return
  const defectKey = `defect-${index}`

  console.log(`Updating defect image - Index: ${index}, Value:`, val)

  // Ensure tempFormData is initialized
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }

  // Ensure tempFormData.defectsDTO[index] exists
  if (!tempFormData.value.defectsDTO) {
    tempFormData.value.defectsDTO = []
  }

  if (!tempFormData.value.defectsDTO[index]) {
    // Use optional chaining to safely access formData.value.defectsDTO
    const originalDefect = formData.value?.defectsDTO?.[index]
    if (originalDefect) {
      tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(originalDefect))
    } else {
      // If original data doesn't exist, create an empty object
      tempFormData.value.defectsDTO[index] = {
        defects: {id: defectId},
        defectImages: []
      }
    }
  }

  // Ensure current defect record is in edit state
  if (!editingSections.value.includes(defectKey)) {
    console.log(`Defect record ${index} is not in edit state, adding to edit state`)
    editingSections.value.push(defectKey)
  }

  // Handle different types of input values
  let imageArray: string[] = []
  if (Array.isArray(val)) {
    // If it's an array, use directly
    imageArray = val
  } else if (typeof val === 'string' && val) {
    // If it's a non-empty string, wrap it in an array
    imageArray = [val]
  }

  // Ensure defectImages is initialized
  if (!tempFormData.value.defectsDTO[index].defectImages) {
    tempFormData.value.defectsDTO[index].defectImages = []
  }

  // Get current defect images, for checking if images are being deleted
  const currentImages = tempFormData.value.defectsDTO[index].defectImages || []
  const currentImagePaths = currentImages.map(img => img.imagePath).filter(Boolean)

  // Initialize pending operations
  initPendingOperations(defectKey)

  // Find deleted image paths
  const deletedImagePaths = currentImagePaths.filter(path => !imageArray.includes(path))

  // Find new image paths
  const addedImagePaths = imageArray.filter(path => !currentImagePaths.includes(path))

  // Handle deleted images
  if (deletedImagePaths.length > 0) {
    console.log(`Detected deleted defect images:`, deletedImagePaths)

    // Initialize temporary storage
    if (!tempUploadedImages.value[defectKey]) {
      tempUploadedImages.value[defectKey] = []
    }

    // Handle each deleted image
    for (const imagePath of deletedImagePaths) {
      if (imagePath && imagePath.startsWith('http')) {
        // Find corresponding image object
        const imageObj = currentImages.find(img => img.imagePath === imagePath)

        if (imageObj && imageObj.id) {
          // Record image to delete
          pendingOperations.value[defectKey].toDelete.push({
            id: imageObj.id,
            path: imagePath
          })
          console.log(`Recording image to delete: ID=${imageObj.id}, Path=${imagePath}`)
        } else {
          // If no ID (possibly new upload but not saved), just record path
          pendingOperations.value[defectKey].toDelete.push({
            path: imagePath
          })
          console.log(`Recording image to delete: Path=${imagePath}`)
        }
      }
    }
  }

  // Handle new images
  if (addedImagePaths.length > 0) {
    console.log(`Detected new defect images:`, addedImagePaths)

    // Initialize temporary storage
    if (!tempUploadedImages.value[defectKey]) {
      tempUploadedImages.value[defectKey] = []
    }

    // Handle each new image
    for (const imagePath of addedImagePaths) {
      if (imagePath && imagePath.startsWith('http')) {
        // Record new image
        pendingOperations.value[defectKey].toAdd.push({
          defectId,
          path: imagePath
        })
        console.log(`Recording new image: DefectID=${defectId}, Path=${imagePath}`)

        // Record to temporary storage
        tempUploadedImages.value[defectKey].push(imagePath)
      }
    }
  }

  // Update temporary data
  tempFormData.value.defectsDTO[index].defectImages = imageArray.map(path => ({
    imagePath: path
  }))
}

const handleDefectCustomUpload = async (params: {file: File}, defectId: string | undefined, index: number) => {
  const defectKey = `defect-${index}`

  try {
    // Ensure current defect record is in edit state
    if (!editingSections.value.includes(defectKey)) {
      console.log(`Defect record ${index} is not in edit state, adding to edit state`)
      editingSections.value.push(defectKey)
    }

    // Ensure tempFormData is initialized
    if (!tempFormData.value) {
      tempFormData.value = JSON.parse(JSON.stringify(formData.value))
    }

    // Use File object directly
    const res = await postFilesUpload({file: params.file})
    const imagePath = res.data

    // Initialize temporary storage
    if (!tempUploadedImages.value[defectKey]) {
      tempUploadedImages.value[defectKey] = []
    }

    // Initialize pending operations
    initPendingOperations(defectKey)

    // Add to temporary upload image list
    tempUploadedImages.value[defectKey].push(imagePath)
    console.log(`Added temporary image: ${imagePath} to ${defectKey}`)

    // Ensure tempFormData.defectsDTO[index] is initialized
    if (!tempFormData.value.defectsDTO) {
      tempFormData.value.defectsDTO = []
    }

    if (!tempFormData.value.defectsDTO[index]) {
      if (formData.value?.defectsDTO?.[index]) {
        tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(formData.value.defectsDTO[index]))
      } else {
        // If original data doesn't exist, create an empty object
        tempFormData.value.defectsDTO[index] = {
          defects: {id: defectId},
          defectImages: []
        }
      }
    }

    // Ensure tempFormData.defectsDTO[index].defectImages is initialized
    if (!tempFormData.value.defectsDTO[index].defectImages) {
      tempFormData.value.defectsDTO[index].defectImages = []
    }

    // Check if image already exists, avoid duplicate addition
    const existingImagePaths = tempFormData.value.defectsDTO[index].defectImages.map(img => img.imagePath)
    if (existingImagePaths.includes(imagePath)) {
      console.log(`Image already exists, not adding again: ${imagePath}`)
      return imagePath
    }

    // Directly add new image to tempFormData
    const newImage = {
      id: getId(),
      defectId,
      imagePath
    }

    // Add new image to tempFormData
    tempFormData.value.defectsDTO[index].defectImages.push(newImage)

    // Record image to add
    pendingOperations.value[defectKey].toAdd.push({
      defectId,
      path: imagePath
    })

    console.log(`Directly adding new image to tempFormData: ${imagePath}`)

    // Force view update
    tempFormData.value = JSON.parse(JSON.stringify(tempFormData.value))
    console.log(`Updated temporary data (complete):`, tempFormData.value.defectsDTO[index])

    return imagePath
  } catch (error) {
    console.error('Image upload failed', error)
    ElMessage.error('Image upload failed')
    return ''
  }
}

// Get defect images
const getDefectImages = (defectDto: DefectsDto): string[] => {
  if (!defectDto?.defectImages) return []

  // Get all image paths and filter out empty ones
  const imagePaths = defectDto.defectImages.map(img => img.imagePath).filter(Boolean)

  // Remove duplicates
  return [...new Set(imagePaths)]
}

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

    // Convert field names to underscore format
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
      port: formData.value.port || 'Ningbo Port',
      remark: formData.value.remark || '',
      image: formData.value.image || ''
    }

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    const buffer = await exportQuotation(exportData)

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const createDate = formData.value.createTime ? formData.value.createTime.split('T')[0].replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '')
    const fileName = `TC QUOTATION FORM ${exportData.supplier} ${createDate}.xlsx`
    saveAs(blob, fileName)

    // Check if cancelled
    if (signal.aborted) {
      return
    }

    ElMessage.success('Export successful')
  } catch (error) {
    console.error('Export failed:', error)
    if ((error as Error).message === 'User cancelled export') {
      ElMessage.info('Export cancelled')
    } else {
      ElMessage.error(`Export failed: ${(error as Error).message}`)
    }
  } finally {
    exporting.value = false
    abortController.value = null
  }
}

// Handle temporary file
const handleTempFile = (filePath: string) => {
  if (!tempUploadedImages.value['newUploads']) {
    tempUploadedImages.value['newUploads'] = []
  }
  tempUploadedImages.value['newUploads'].push(filePath)
  console.log('New image recorded to newUploads:', filePath)
  tempFiles.value.push(filePath)
}

// Initialize permissions
const initPermissions = async () => {
  // Check edit permission
  canEdit.value = await checkPermission(ModuleType.QUOTE, PermissionAction.EDIT)
}

onMounted(async () => {
  await initPermissions() // Initialize permissions
  await fetchQuoteDetail() // Wait for data to be loaded
  updateUploadDisplay()
  // Check URL parameters, if edit=1, automatically enter edit mode (requires edit permission)
  if (route.query.edit === '1' && canEdit.value) {
    handleEdit('basic')
  }
})

defineOptions({
  name: 'SpecInfo'
})
</script>
