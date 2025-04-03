<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- Fixed header at the top -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">Create QC Report</h2>
        </div>
        <div class="flex gap-2">
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            Back
          </el-button>
        </div>
      </div>
    </div>

    <!-- Scrollable content area -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
      <div class="p-6">
        <el-form :model="formData" label-width="140px" class="w-full mx-auto px-4">
          <!-- QC Information -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">QC Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
              <el-form-item label="Model Code" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.modelCode" placeholder="Enter model code" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Factory Code" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.factoryCode" placeholder="Enter factory code" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Supplier" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.supplier" placeholder="Enter supplier" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Client" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.client" placeholder="Enter client" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="PO Number" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.poNumber" placeholder="Enter PO number" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Inspection Date" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.inspectionDate" type="date" placeholder="Select date" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Order Quantity" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input-number v-model="formData.qcReports.orderQty" :min="0" class="w-full !h-[38px]" placeholder="Enter order quantity" />
              </el-form-item>
              <el-form-item label="Report Date" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.reportDate" type="date" placeholder="Select date" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Inspection Qty" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input-number v-model="formData.qcReports.inspectQty" :min="0" class="w-full !h-[38px]" placeholder="Enter inspection quantity" />
              </el-form-item>
              <el-form-item label="QC Officer" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.qcOfficer" placeholder="Enter QC officer" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Result" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-radio-group v-model="formData.qcReports.passFail">
                  <el-radio label="Pass">Pass</el-radio>
                  <el-radio label="Fail">Fail</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Second QC Date" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.secondQcDate" type="date" placeholder="Select date" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="Comments" class="col-span-3 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.comments" placeholder="Enter comments" class="w-full !h-[38px]" />
              </el-form-item>
            </div>
          </div>
          <!-- Image Information -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Image Information</h3>
            <div class="grid gap-4 lg:gap-6" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))">
              <!-- Iterate through all image fields -->
              <template v-for="(label, key) in basicFields" :key="key">
                <!-- Only display image fields -->
                <div v-if="isImageField(key)" class="bg-gray-100 p-2 rounded flex flex-col h-full">
                  <div class="text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>

                  <ImageHandler :model-value="formData.qcReports[key] ? [formData.qcReports[key]] : []" @update:model-value="updateImageField(key, $event)" :size="200" :limit="1" :editable="true" @preview="handlePreview" class="mt-2" />
                </div>
              </template>
            </div>
          </div>
          <!-- Defect Records -->
          <div class="mb-8" v-if="formData.defectsDTO.length > 0">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Defect Records</h3>

            <!-- Defect Records List -->
            <div class="space-y-4">
              <div v-for="(defect, index) in formData.defectsDTO" :key="defect.defects.id" class="bg-gray-50 rounded-lg p-4 shadow-sm">
                <!-- Defect Record Title Bar -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-base font-medium text-gray-700">Defect Record #{{ index + 1 }}</h4>
                  <div class="flex gap-2">
                    <template v-if="defect.isEditing">
                      <el-button type="success" size="small" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm !h-8" @click="saveDefectEdit(index)">
                        <el-icon><Check /></el-icon>
                        Save
                      </el-button>
                      <el-button size="small" class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm !h-8" @click="cancelDefectEdit(index)">Cancel</el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" size="small" @click="startDefectEdit(index)" class="!h-8">
                        <el-icon><Edit /></el-icon>
                        Edit
                      </el-button>
                    </template>
                    <el-button type="danger" size="small" @click="removeDefect(index)" class="!h-8">
                      <el-icon><Delete /></el-icon>
                      Delete
                    </el-button>
                  </div>
                </div>

                <!-- Defect Record Content -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <el-form-item label="Defect Title" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.defectTitle" placeholder="Enter defect title" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.defectTitle }}
                    </div>
                  </el-form-item>

                  <el-form-item label="Inspector" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.inspector" placeholder="Enter inspector name" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.inspector }}
                    </div>
                  </el-form-item>

                  <el-form-item label="Description" class="col-span-2 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.defectDescription" placeholder="Enter defect description" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.defectDescription }}
                    </div>
                  </el-form-item>

                  <el-form-item label="Improvement" class="col-span-2 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.improvementSuggestion" placeholder="Enter improvement suggestion" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.improvementSuggestion }}
                    </div>
                  </el-form-item>

                  <!-- Defect Image Display -->
                  <el-form-item label="Defect Images" class="col-span-2 bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <div class="w-full">
                      <template v-if="defect.isEditing">
                        <ImageHandler v-model="defect.editData.defectImages" :limit="2" :size="120" :editable="true" @preview="handlePreview" />
                      </template>
                      <template v-else>
                        <ImageHandler :model-value="defect.defectImages.map(img => img.imagePath)" :size="120" :editable="false" @preview="handlePreview" />
                      </template>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <!-- Defect Record Dialog -->
          <el-dialog
            v-model="defectDialogVisible"
            title="Add Defect Record"
            width="800px"
            :close-on-click-modal="false"
            class="!fixed"
            :modal-class="'!w-[calc(100%-256px)] !left-[256px]'"
            :style="{
              left: '50%',
              marginLeft: '128px',
              transform: 'translate(-50%, -50%)',
              top: '50%'
            }"
            align-center
          >
            <el-form :model="currentDefect" label-width="100px">
              <div class="grid grid-cols-1 gap-4">
                <el-form-item label="Defect Title" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.defectTitle" placeholder="Enter defect title" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Inspector" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.inspector" placeholder="Enter inspector name" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="Description" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.defectDescription" type="textarea" :rows="3" placeholder="Enter defect description" class="w-full" />
                </el-form-item>

                <el-form-item label="Improvement" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.improvementSuggestion" type="textarea" :rows="3" placeholder="Enter improvement suggestion" class="w-full" />
                </el-form-item>

                <!-- Defect Image -->
                <el-form-item label="Defect Images" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <div class="w-full">
                    <ImageHandler v-model="defectImageUrls" :editable="true" :size="120" :limit="2" :multiple="true" />
                  </div>
                </el-form-item>
              </div>
            </el-form>

            <template #footer>
              <div class="flex justify-end gap-4">
                <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="saveDefect">
                  <el-icon><Check /></el-icon>
                  Confirm
                </el-button>
                <el-button class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm" @click="defectDialogVisible = false">Cancel</el-button>
              </div>
            </template>
          </el-dialog>

          <!-- Image Preview Dialog -->
          <el-dialog
            v-model="dialogVisible"
            :title="'Image Preview'"
            width="auto"
            :modal-class="'!w-[calc(100%-256px)] !left-[256px]'"
            class="!fixed preview-dialog"
            :style="{
              left: '50%',
              marginLeft: '128px',
              transform: 'translateX(-50%)'
            }"
            align-center
          >
            <img :src="dialogImageUrl" class="max-h-[300px] w-auto object-contain" />
          </el-dialog>
        </el-form>
      </div>
    </div>

    <!-- Fixed bottom submit button -->
    <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0">
      <div class="bg-white shadow-[0_-2px_3px_rgba(0,0,0,0.1)]">
        <div class="p-4 flex justify-center items-center gap-4 mx-auto">
          <el-button type="primary" plain @click="addDefect">
            <el-icon><Plus /></el-icon>
            Add Defect Record
          </el-button>
          <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="submitForm">
            <el-icon><Check /></el-icon>
            Submit QC Report
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Check, Back, Delete, Plus, Edit, DataLine} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import type {QcReportsDto, Defects, DefectImages, DefectsDto} from '@/api/interface'
import ImageHandler from '@/components/ImageHandler.vue'
import {getId} from '@/utils/idUtils'
import {postQcReportsDtoSave} from '@/api/controller'

// Add edit-related types
interface DefectEditData {
  defects: {
    defectTitle: string
    defectDescription: string
    improvementSuggestion: string
    inspector: string
  }
  defectImages: string[]
}

// Extend DefectsDto interface, add UI-related properties
interface ExtendedDefectsDto extends DefectsDto {
  isEditing?: boolean
  editData?: DefectEditData
}

// Extend QcReportsDto interface, use ExtendedDefectsDto
interface ExtendedQcReportsDto extends Omit<QcReportsDto, 'defectsDTO'> {
  defectsDTO?: ExtendedDefectsDto[]
}

const router = useRouter()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const defectDialogVisible = ref(false)
const currentDefect = ref<ExtendedDefectsDto>({
  defects: {
    id: getId(),
    defectTitle: '',
    defectDescription: '',
    improvementSuggestion: '',
    inspector: ''
  },
  defectImages: []
})

const formData = ref<ExtendedQcReportsDto>({
  qcReports: {
    id: getId(),
    modelCode: '',
    factoryCode: '',
    supplier: '',
    client: '',
    poNumber: '',
    inspectionDate: '',
    orderQty: 0,
    reportDate: '',
    inspectQty: 0,
    qcOfficer: '',
    passFail: 'Pass',
    secondQcDate: '',
    comments: '',
    stocksInWarehouse: '',
    samplingOfProductsQuantity: '',
    shippingMarks: '',
    barcode: '',
    packingOutside: '',
    packingInside: '',
    chairComponentsPacked: '',
    chairComponentsUnpacked: '',
    fittingPackPacked: '',
    fittingPackUnpacked: '',
    productionLabel: '',
    assemblyInstructions: '',
    imageOfComponentsSeat: '',
    imageOfComponentsBack: '',
    imageOfComponentsBase: '',
    imageOfComponentsCastors: '',
    imageOfComponentsGasLiftCover: '',
    imageOfComponentsGasLiftStamp: '',
    imageOfComponentsArmrest: '',
    imageOfComponentMechanism: '',
    imageOfComponentsHeadrest: '',
    imageOfProductBuiltFront: '',
    imageOfProductBuiltSide: '',
    imageOfProductBuiltBack: '',
    imageOfProductBuilt45Degree: '',
    frontImageOfProductBuiltCompare1: '',
    frontImageOfProductBuiltCompare2: '',
    functionCheckSeatHeightExtension: '',
    functionCheckMechanismAdjustment: '',
    functionCheckArmrestAdjustment: '',
    functionCheckHeadrestAdjustment: '',
    functionCheckOther1: '',
    functionCheckOther2: ''
  },
  defectsDTO: []
})

// Modify defectImageUrls definition, ensure it's reactive
const defectImageUrls = ref<string[]>([])

// Basic field definition
const basicFields = {
  // Basic Information Fields
  id: 'Serial Number',
  modelCode: 'Model Code',
  factoryCode: 'Factory Code',
  supplier: 'Supplier',
  client: 'Client',
  poNumber: 'PO Number',
  inspectionDate: 'Inspection Date',
  orderQty: 'Order Quantity',
  reportDate: 'Report Date',
  inspectQty: 'Inspection Quantity',
  qcOfficer: 'QC Officer',
  passFail: 'Inspection Result',
  secondQcDate: 'Second QC Date',
  comments: 'Comments',

  // Product Appearance Images
  stocksInWarehouse: 'Warehouse Stock Image',
  samplingOfProductsQuantity: 'Product Sampling Quantity Image',
  shippingMarks: 'Shipping Marks Image',
  barcode: 'Barcode Image',
  packingOutside: 'Outer Packing Image',
  packingInside: 'Inner Packing Image',

  // Chair Components Images
  chairComponentsPacked: 'Chair Components - Packed',
  chairComponentsUnpacked: 'Chair Components - Unpacked',

  // Fitting Pack Images
  fittingPackPacked: 'Fitting Pack - Packed',
  fittingPackUnpacked: 'Fitting Pack - Unpacked',
  productionLabel: 'Production Label',
  assemblyInstructions: 'Assembly Instructions',

  // Component Images
  imageOfComponentsSeat: 'Component Image - Seat',
  imageOfComponentsBack: 'Component Image - Back',
  imageOfComponentsBase: 'Component Image - Base',
  imageOfComponentsCastors: 'Component Image - Castors',
  imageOfComponentsGasLiftCover: 'Component Image - Gas Lift Cover',
  imageOfComponentsGasLiftStamp: 'Component Image - Gas Lift Stamp',
  imageOfComponentsArmrest: 'Component Image - Armrest',
  imageOfComponentMechanism: 'Component Image - Mechanism',
  imageOfComponentsHeadrest: 'Component Image - Headrest',

  // Finished Product Images
  imageOfProductBuiltFront: 'Product Image - Front View',
  imageOfProductBuiltSide: 'Product Image - Side View',
  imageOfProductBuiltBack: 'Product Image - Back View',
  imageOfProductBuilt45Degree: 'Product Image - 45 Degree View',
  frontImageOfProductBuiltCompare1: 'Product Image - Sample Comparison 1',
  frontImageOfProductBuiltCompare2: 'Product Image - Sample Comparison 2',

  // Function Check Images
  functionCheckSeatHeightExtension: 'Function Check - Seat Height Adjustment',
  functionCheckMechanismAdjustment: 'Function Check - Mechanism Adjustment',
  functionCheckArmrestAdjustment: 'Function Check - Armrest Adjustment',
  functionCheckHeadrestAdjustment: 'Function Check - Headrest Adjustment',
  functionCheckOther1: 'Function Check - Other 1',
  functionCheckOther2: 'Function Check - Other 2'
}

// Modify isImageField function implementation
const isImageField = (key: string): boolean => {
  // Exclude basic fields
  const basicFieldKeys = ['id', 'modelCode', 'factoryCode', 'supplier', 'client', 'poNumber', 'inspectionDate', 'orderQty', 'reportDate', 'inspectQty', 'qcOfficer', 'passFail', 'secondQcDate', 'comments']
  return !basicFieldKeys.includes(key)
}

// Check if it's a date field
const isDateField = (key: keyof QcReportsDto['qcReports']): boolean => {
  const dateFields = ['inspectionDate', 'reportDate', 'secondQcDate']
  return dateFields.includes(key)
}

// Add function to remove defect record
const removeDefect = (index: number) => {
  if (formData.value.defectsDTO) {
    formData.value.defectsDTO.splice(index, 1)
    ElMessage.success('Defect record deleted')
  }
}

// Modify saveDefect function, add edit status
const saveDefect = () => {
  // Validate required fields
  if (!currentDefect.value.defects?.defectTitle) {
    ElMessage.warning('Please enter defect title')
    return
  }
  if (!currentDefect.value.defects?.defectDescription) {
    ElMessage.warning('Please enter defect description')
    return
  }
  if (!currentDefect.value.defects?.improvementSuggestion) {
    ElMessage.warning('Please enter improvement suggestion')
    return
  }
  if (!currentDefect.value.defects?.inspector) {
    ElMessage.warning('Please enter inspector')
    return
  }

  // Validate if there are images
  if (defectImageUrls.value.length === 0) {
    ElMessage.warning('Please upload at least one defect image')
    return
  }

  // Create new defect record object
  const newDefect: ExtendedDefectsDto = {
    defects: {
      ...currentDefect.value.defects,
      id: getId(),
      reportId: formData.value.qcReports?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    defectImages: defectImageUrls.value.map(url => ({
      id: getId(),
      defectId: currentDefect.value.defects?.id || '',
      imagePath: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    isEditing: false
  }

  // Add to form data
  if (formData.value.defectsDTO) {
    formData.value.defectsDTO.push(newDefect)
  } else {
    formData.value.defectsDTO = [newDefect]
  }

  // Reset form and image array
  currentDefect.value = {
    defects: {
      id: getId(),
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: ''
    },
    defectImages: []
  }
  defectImageUrls.value = []

  defectDialogVisible.value = false
  ElMessage.success('Defect record added successfully')
}

// Start edit
const startDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  if (!defect.defects || !defect.defectImages) return

  defect.isEditing = true
  defect.editData = {
    defects: {...defect.defects},
    defectImages: defect.defectImages.map(img => img.imagePath || '')
  }
}

// Save edit
const saveDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  if (!defect.editData || !defect.defects) return

  // Validate required fields
  if (!defect.editData.defects.defectTitle) {
    ElMessage.warning('Please enter defect title')
    return
  }
  if (!defect.editData.defects.defectDescription) {
    ElMessage.warning('Please enter defect description')
    return
  }
  if (!defect.editData.defects.improvementSuggestion) {
    ElMessage.warning('Please enter improvement suggestion')
    return
  }
  if (!defect.editData.defects.inspector) {
    ElMessage.warning('Please enter inspector')
    return
  }
  if (defect.editData.defectImages.length === 0) {
    ElMessage.warning('Please upload at least one defect image')
    return
  }

  // Update data
  if (defect.defects) {
    Object.assign(defect.defects, defect.editData.defects)
  }

  defect.defectImages = defect.editData.defectImages.map(url => ({
    id: getId(),
    defectId: defect.defects?.id || '',
    imagePath: url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  defect.isEditing = false
  defect.editData = undefined
  ElMessage.success('Modification successful')
}

// Cancel edit
const cancelDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  defect.isEditing = false
  defect.editData = undefined
}

// Reset all data when adding a defect record
const addDefect = () => {
  currentDefect.value = {
    defects: {
      id: getId(),
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: ''
    },
    defectImages: []
  }
  defectImageUrls.value = [] // Ensure reset image array
  defectDialogVisible.value = true
}

// Handle image preview
const handlePreview = (url: string) => {
  dialogImageUrl.value = url
  dialogVisible.value = true
}

// Add submit form function
const submitForm = async () => {
  try {
    // Ensure formData is initialized
    initializeFormData()

    // Form validation
    if (!formData.value.qcReports?.modelCode) {
      ElMessage.warning('Please enter model code')
      return
    }
    if (!formData.value.qcReports?.factoryCode) {
      ElMessage.warning('Please enter factory code')
      return
    }
    if (!formData.value.qcReports?.supplier) {
      ElMessage.warning('Please enter supplier')
      return
    }
    if (!formData.value.qcReports?.client) {
      ElMessage.warning('Please enter client')
      return
    }
    if (!formData.value.qcReports?.poNumber) {
      ElMessage.warning('Please enter PO number')
      return
    }
    if (!formData.value.qcReports?.inspectionDate) {
      ElMessage.warning('Please select inspection date')
      return
    }
    if (!formData.value.qcReports?.qcOfficer) {
      ElMessage.warning('Please enter QC officer')
      return
    }

    // Ensure all necessary related IDs are set
    if (formData.value.defectsDTO) {
      formData.value.defectsDTO.forEach(dto => {
        if (formData.value.qcReports?.id && dto.defects) {
          dto.defects.reportId = formData.value.qcReports.id
          if (dto.defectImages) {
            dto.defectImages.forEach(img => {
              if (dto.defects) {
                img.defectId = dto.defects.id
              }
            })
          }
        }
      })
    }

    // Print formData content, for debugging
    console.log('Submitted formData:', JSON.stringify(formData.value))

    // Convert to API needed format
    const apiData: QcReportsDto = {
      qcReports: formData.value.qcReports,
      defectsDTO: formData.value.defectsDTO
    }

    // Call save API
    const response = await postQcReportsDtoSave(apiData)
    console.log('API response:', response)
    if (response?.data) {
      ElMessage.success('QC report submitted successfully')
      // Redirect to list page
      router.push({
        name: 'specList'
      })
    } else {
      ElMessage.error('Submission failed')
    }
  } catch (error: any) {
    console.error('Submission failed:', error)
    ElMessage.error(`Submission failed: ${error.message || 'Unknown error'}`)
  }
}

// Modify initializeImageFields function
const initializeImageFields = () => {
  if (!formData.value.qcReports) return

  const allFields = Object.keys(formData.value.qcReports)

  allFields.forEach(field => {
    if (isImageField(field) && formData.value.qcReports && formData.value.qcReports[field] === undefined) {
      formData.value.qcReports[field] = ''
    }
  })
}

// Modify updateImageField function
const updateImageField = (key: string, value: string[]) => {
  if (isImageField(key) && formData.value.qcReports) {
    formData.value.qcReports[key] = value[0] || '' // Only take the first image
  }
}

// Initialize component
onMounted(() => {
  initializeFormData()
})

// Initialize form data
const initializeFormData = () => {
  // Ensure qcReports object exists
  if (!formData.value.qcReports) {
    formData.value.qcReports = {
      id: getId(),
      modelCode: '',
      factoryCode: '',
      supplier: '',
      client: '',
      poNumber: '',
      inspectionDate: '',
      orderQty: 0,
      reportDate: '',
      inspectQty: 0,
      qcOfficer: '',
      passFail: 'Pass',
      secondQcDate: '',
      comments: ''
    }
  }

  // Ensure defectsDTO array exists
  if (!formData.value.defectsDTO) {
    formData.value.defectsDTO = []
  }

  // Initialize image fields
  initializeImageFields()
}
</script>
