<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-14 17:03:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-24 09:16:13
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Create.vue
 * @Description: Product Specification Creation Form
-->
<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- Fixed header and steps at the top -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <!-- Top action bar -->
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">Create Specification</h2>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fillTestData">
            <el-icon><DataLine /></el-icon>
            Test Data
          </el-button>
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            Back
          </el-button>
        </div>
      </div>

      <!-- Steps -->
      <div class="px-6 py-4 border-t border-gray-200">
        <el-steps :active="activeStep" finish-status="success">
          <template v-for="(step, index) in steps" :key="index">
            <el-step :title="step.title" @click="goToStep(index)" />
          </template>
        </el-steps>
      </div>
    </div>

    <!-- Scrollable content area -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 116px - 64px)">
      <div class="p-6">
        <!-- Basic information form -->
        <el-form v-if="activeStep === 0" :model="basicForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Product Code">
            <el-input v-model="basicForm.tccode" />
          </el-form-item>
          <el-form-item label="Supplier">
            <el-input v-model="basicForm.supplier" />
          </el-form-item>
          <el-form-item label="Supplier Code">
            <el-input v-model="basicForm.supplierCode" />
          </el-form-item>
          <el-form-item label="Supplier Name">
            <el-input v-model="basicForm.supplierName" />
          </el-form-item>
          <el-form-item label="Fire Standard">
            <el-input v-model="basicForm.fireStandard" />
          </el-form-item>
          <el-form-item label="20ft Container FOB Price">
            <el-input-number v-model="basicForm.fob20ContainerPrice" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="40ft Container FOB Price">
            <el-input-number v-model="basicForm.fob40ContainerPrice" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="Shipping Port">
            <el-input v-model="basicForm.shippingPort" />
          </el-form-item>
        </el-form>

        <!-- Upholstery information form -->
        <el-form v-if="activeStep === 1" :model="upholsteryForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Fabric Manufacturer">
            <el-input v-model="upholsteryForm.fabricManufacturer" />
          </el-form-item>
          <el-form-item label="Color Code">
            <el-input v-model="upholsteryForm.colourCode" />
          </el-form-item>
          <el-form-item label="Leather Grade">
            <el-input v-model="upholsteryForm.leatherGrade" />
          </el-form-item>
          <el-form-item label="Usage Per Chair">
            <el-input-number v-model="upholsteryForm.usagePerChair" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Packaging information form -->
        <el-form v-if="activeStep === 2" :model="cartonForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Carton Width">
            <el-input-number v-model="cartonForm.width" class="w-full" />
          </el-form-item>
          <el-form-item label="Carton Depth">
            <el-input-number v-model="cartonForm.depth" class="w-full" />
          </el-form-item>
          <el-form-item label="Carton Height">
            <el-input-number v-model="cartonForm.height" class="w-full" />
          </el-form-item>
          <el-form-item label="Board Type">
            <el-input v-model="cartonForm.boardType" />
          </el-form-item>
          <el-form-item label="Items Per Carton">
            <el-input-number v-model="cartonForm.itemsPerCarton" class="w-full" />
          </el-form-item>
          <el-form-item label="Carton Volume">
            <el-input-number v-model="cartonForm.cartonVolume" :precision="3" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Production and logistics information form -->
        <el-form v-if="activeStep === 3" :model="logisticsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Production Time">
            <el-input-number v-model="logisticsForm.productionTime" class="w-full" />
          </el-form-item>
          <el-form-item label="Effective Volume">
            <el-input-number v-model="logisticsForm.effectiveVolume" :precision="3" class="w-full" />
          </el-form-item>
          <el-form-item label="20ft Container Loading Qty">
            <el-input-number v-model="logisticsForm.loadingQuantity20gp" class="w-full" />
          </el-form-item>
          <el-form-item label="40ft HQ Container Loading Qty">
            <el-input-number v-model="logisticsForm.loadingQuantity40hc" class="w-full" />
          </el-form-item>
          <el-form-item label="Net Weight">
            <el-input-number v-model="logisticsForm.netWeight" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="Gross Weight">
            <el-input-number v-model="logisticsForm.grossWeight" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Product dimensions form -->
        <el-form v-if="activeStep === 4" :model="dimensionsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Seat Width">
            <el-input-number v-model="dimensionsForm.seatWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="Seat Depth">
            <el-input-number v-model="dimensionsForm.seatDepth" class="w-full" />
          </el-form-item>
          <el-form-item label="Min Seat Height">
            <el-input-number v-model="dimensionsForm.seatHeightMin" class="w-full" />
          </el-form-item>
          <el-form-item label="Max Seat Height">
            <el-input-number v-model="dimensionsForm.seatHeightMax" class="w-full" />
          </el-form-item>
          <el-form-item label="Back Width">
            <el-input-number v-model="dimensionsForm.backWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="Back Height">
            <el-input-number v-model="dimensionsForm.backHeight" class="w-full" />
          </el-form-item>
          <el-form-item label="Back Height From Seat">
            <el-input-number v-model="dimensionsForm.backHeightFromSeat" class="w-full" />
          </el-form-item>
          <el-form-item label="Overall Width">
            <el-input-number v-model="dimensionsForm.overallWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="Overall Depth">
            <el-input-number v-model="dimensionsForm.overallDepth" class="w-full" />
          </el-form-item>
          <el-form-item label="Min Overall Height">
            <el-input-number v-model="dimensionsForm.overallHeightMin" class="w-full" />
          </el-form-item>
          <el-form-item label="Max Overall Height">
            <el-input-number v-model="dimensionsForm.overallHeightMax" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Seat inner structure form -->
        <el-form v-if="activeStep === 5" :model="seatInnerForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Material Code">
            <el-input v-model="seatInnerForm.materialCode" />
          </el-form-item>
          <el-form-item label="Thickness">
            <el-input-number v-model="seatInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="Layers Count">
            <el-input-number v-model="seatInnerForm.layersCount" class="w-full" />
          </el-form-item>
          <el-form-item label="Dimensions">
            <el-input v-model="seatInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- Back inner structure form -->
        <el-form v-if="activeStep === 6" :model="backInnerForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Material Code">
            <el-input v-model="backInnerForm.materialCode" />
          </el-form-item>
          <el-form-item label="Thickness">
            <el-input-number v-model="backInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="Layers Count">
            <el-input-number v-model="backInnerForm.layersCount" class="w-full" />
          </el-form-item>
          <el-form-item label="Dimensions">
            <el-input v-model="backInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- Seat outer structure form -->
        <el-form v-if="activeStep === 7" :model="seatOuterForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Material">
            <el-input v-model="seatOuterForm.material" />
          </el-form-item>
          <el-form-item label="Dimensions">
            <el-input v-model="seatOuterForm.dimensions" />
          </el-form-item>
          <el-form-item label="Manufacturer Name">
            <el-input v-model="seatOuterForm.manufacturerName" />
          </el-form-item>
        </el-form>

        <!-- Back outer structure form -->
        <el-form v-if="activeStep === 8" :model="backOuterForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Material">
            <el-input v-model="backOuterForm.material" />
          </el-form-item>
          <el-form-item label="Dimensions">
            <el-input v-model="backOuterForm.dimensions" />
          </el-form-item>
          <el-form-item label="Manufacturer Name">
            <el-input v-model="backOuterForm.manufacturerName" />
          </el-form-item>
        </el-form>

        <!-- Armrest information form -->
        <el-form v-if="activeStep === 9" :model="armsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Material">
            <el-input v-model="armsForm.material" />
          </el-form-item>
          <el-form-item label="Type">
            <el-input v-model="armsForm.type" />
          </el-form-item>
          <el-form-item label="Manufacturer">
            <el-input v-model="armsForm.manufacturer" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="armsForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Arm Height From Seat">
            <el-input-number v-model="armsForm.armHeightFromSeat" class="w-full" />
          </el-form-item>
          <el-form-item label="Arm Height From Floor">
            <el-input-number v-model="armsForm.armHeightFromFloor" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Foam information form -->
        <el-form v-if="activeStep === 10" :model="foamForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="foamForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Seat Density">
            <el-input-number v-model="foamForm.seatDensity" class="w-full" />
          </el-form-item>
          <el-form-item label="Back Density">
            <el-input-number v-model="foamForm.backDensity" class="w-full" />
          </el-form-item>
          <el-form-item label="Seat Thickness">
            <el-input-number v-model="foamForm.seatThickness" class="w-full" />
          </el-form-item>
          <el-form-item label="Back Thickness">
            <el-input-number v-model="foamForm.backThickness" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Footrest information form -->
        <el-form v-if="activeStep === 11" :model="castorsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="castorsForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Pin Thickness">
            <el-input-number v-model="castorsForm.pinThickness" class="w-full" />
          </el-form-item>
          <el-form-item label="Wheel Diameter">
            <el-input-number v-model="castorsForm.wheelDiameter" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Base information form -->
        <el-form v-if="activeStep === 12" :model="baseForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="baseForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Base Diameter">
            <el-input-number v-model="baseForm.sizeDiameter" class="w-full" />
          </el-form-item>
          <el-form-item label="Material">
            <el-input v-model="baseForm.material" />
          </el-form-item>
          <el-form-item label="Type">
            <el-input v-model="baseForm.type" />
          </el-form-item>
        </el-form>

        <!-- Gas lift information form -->
        <el-form v-if="activeStep === 13" :model="gasLiftForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="gasLiftForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Gas Lift Class">
            <el-input v-model="gasLiftForm.gasLiftClass" />
          </el-form-item>
          <el-form-item label="Casing Length">
            <el-input-number v-model="gasLiftForm.casingLength" class="w-full" />
          </el-form-item>
          <el-form-item label="Extension Size">
            <el-input-number v-model="gasLiftForm.extensionSize" class="w-full" />
          </el-form-item>
          <el-form-item label="Taper">
            <el-input-number v-model="gasLiftForm.taper" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- Gas lift cover information form -->
        <el-form v-if="activeStep === 14" :model="gasLiftCoverForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="gasLiftCoverForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Material">
            <el-input v-model="gasLiftCoverForm.material" />
          </el-form-item>
          <el-form-item label="Colour">
            <el-input v-model="gasLiftCoverForm.colour" />
          </el-form-item>
        </el-form>

        <!-- Mechanism information form -->
        <el-form v-if="activeStep === 15" :model="mechanismForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Description">
            <el-input v-model="mechanismForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="Lever Count">
            <el-input-number v-model="mechanismForm.leversCount" class="w-full" />
          </el-form-item>
          <el-form-item label="Locking Positions">
            <el-input v-model="mechanismForm.lockingPositions" />
          </el-form-item>
          <el-form-item label="Model No">
            <el-input v-model="mechanismForm.modelNo" />
          </el-form-item>
          <el-form-item label="Supplier Name">
            <el-input v-model="mechanismForm.supplierName" />
          </el-form-item>
        </el-form>

        <!-- Fitting information form -->
        <el-form v-if="activeStep === 16" :model="fittingsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="Fitting Number">
            <el-input-number v-model="fittingsForm.fittingNumber" class="w-full" />
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="fittingsForm.description" />
          </el-form-item>
          <el-form-item label="Quantity">
            <el-input-number v-model="fittingsForm.quantity" class="w-full" />
          </el-form-item>
          <el-form-item label="Material">
            <el-input v-model="fittingsForm.material" />
          </el-form-item>
        </el-form>

        <!-- Product image form -->
        <el-form v-if="activeStep === 17" :model="productImagesForm" label-width="140px" class="max-w-6xl mx-auto">
          <div class="grid grid-cols-4 gap-6">
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">Front View</div>
                <ImageHandler v-model="productImagesForm.frontImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">Side View</div>
                <ImageHandler v-model="productImagesForm.sideImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">Back View</div>
                <ImageHandler v-model="productImagesForm.backImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">Angle View</div>
                <ImageHandler v-model="productImagesForm.angleImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
          </div>
        </el-form>

        <!-- Step control buttons -->
        <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0">
          <div class="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div class="flex justify-center items-center gap-4 h-16 px-5 mx-auto max-w-4xl">
              <el-button @click="prevStep" :disabled="activeStep === 0">Previous Step</el-button>
              <el-button type="primary" @click="nextStep" v-if="activeStep < 17">Next Step</el-button>
              <el-button type="success" @click="submitForm" v-else>Submit</el-button>
            </div>
          </div>
        </div>
        <!-- Add bottom blank area to prevent content from being fixed button遮挡 -->
        <div class="h-20"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {ElMessage} from 'element-plus'
import type {UploadProps, UploadFile} from 'element-plus'
import {Plus, Back, DataLine} from '@element-plus/icons-vue'
import type {Products, Upholstery, CartonDetails, ProductionLogistics, ProductDimensions, SeatInnerComponents, BackInnerComponents, SeatOuterComponents, BackOuterComponents, Arms, FoamDetails, Castors, Bases, GasLift, GasLiftCover, Mechanism, Fittings, ProductImages, ProductDto} from '@/api'
import {getId} from '@/utils/idUtils'
import {postProductDtoSave} from '@/api'
import {useRouter} from 'vue-router'
import ImageHandler from '@/components/ImageHandler.vue'

const activeStep = ref(0)

// Form data
const basicForm = reactive<Partial<Products>>({
  tccode: '',
  supplier: '',
  supplierCode: '',
  supplierName: '',
  fireStandard: '',
  fob20ContainerPrice: undefined,
  fob40ContainerPrice: undefined,
  shippingPort: ''
})

const upholsteryForm = reactive<Partial<Upholstery>>({
  fabricManufacturer: '',
  colourCode: '',
  leatherGrade: '',
  usagePerChair: undefined
})

const cartonForm = reactive<Partial<CartonDetails>>({
  width: undefined,
  depth: undefined,
  height: undefined,
  boardType: '',
  itemsPerCarton: undefined,
  cartonVolume: undefined
})

const logisticsForm = reactive<Partial<ProductionLogistics>>({
  productionTime: undefined,
  effectiveVolume: undefined,
  loadingQuantity20gp: undefined,
  loadingQuantity40hc: undefined,
  netWeight: undefined,
  grossWeight: undefined
})

const dimensionsForm = reactive<Partial<ProductDimensions>>({
  seatWidth: 0,
  seatDepth: 0,
  seatHeightMin: 0,
  seatHeightMax: 0,
  backWidth: 0,
  backHeight: 0,
  backHeightFromSeat: 0,
  overallWidth: 0,
  overallDepth: 0,
  overallHeightMin: 0,
  overallHeightMax: 0
})

// Seat inner structure data
const seatInnerForm = reactive<Partial<SeatInnerComponents>>({
  materialCode: '',
  thickness: 0,
  layersCount: 0,
  dimensions: ''
})

// Back inner structure data
const backInnerForm = reactive<Partial<BackInnerComponents>>({
  materialCode: '',
  thickness: 0,
  layersCount: 0,
  dimensions: ''
})

// Seat outer structure data
const seatOuterForm = reactive<Partial<SeatOuterComponents>>({
  material: '',
  dimensions: '',
  manufacturerName: ''
})

// Back outer structure data
const backOuterForm = reactive<Partial<BackOuterComponents>>({
  material: '',
  dimensions: '',
  manufacturerName: ''
})

const armsForm = reactive<Partial<Arms>>({
  material: '',
  type: '',
  manufacturer: '',
  description: '',
  armHeightFromSeat: 0,
  armHeightFromFloor: 0
})

const foamForm = reactive<Partial<FoamDetails>>({
  description: '',
  seatDensity: 0,
  backDensity: 0,
  seatThickness: 0,
  backThickness: 0
})

const castorsForm = reactive<Partial<Castors>>({
  description: '',
  pinThickness: 0,
  wheelDiameter: 0
})

const baseForm = reactive<Partial<Bases>>({
  description: '',
  sizeDiameter: 0,
  material: '',
  type: ''
})

const gasLiftForm = reactive<Partial<GasLift>>({
  description: '',
  gasLiftClass: '',
  casingLength: 0,
  extensionSize: 0,
  taper: 0
})

const gasLiftCoverForm = reactive<Partial<GasLiftCover>>({
  description: '',
  material: '',
  colour: ''
})

const mechanismForm = reactive<Partial<Mechanism>>({
  description: '',
  leversCount: 0,
  lockingPositions: '',
  modelNo: '',
  supplierName: ''
})

// Fitting information data
const fittingsForm = reactive<Partial<Fittings>>({
  fittingNumber: 0,
  description: '',
  quantity: 0,
  material: ''
})

// Product image form
const productImagesForm = ref<{
  frontImgPath: string[]
  sideImgPath: string[]
  backImgPath: string[]
  angleImgPath: string[]
}>({
  frontImgPath: [],
  sideImgPath: [],
  backImgPath: [],
  angleImgPath: []
})

// Modify ImagePathKey type definition
type ImagePathKey = 'frontImgPath' | 'sideImgPath' | 'backImgPath' | 'angleImgPath'

// Handle image upload before validation
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('Only image files can be uploaded!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Image size cannot exceed 2MB!')
    return false
  }
  return true
}

// Create handle function factory
const createHandleSuccess = (type: ImagePathKey) => {
  return (response: any, uploadFile: UploadFile) => {
    handleSuccess(response, uploadFile, type)
  }
}

// Handle image upload success
const handleSuccess = (response: any, uploadFile: UploadFile, type: ImagePathKey) => {
  if (uploadFile.raw) {
    productImagesForm.value[type].push(URL.createObjectURL(uploadFile.raw))
    ElMessage.success('Upload successful')
  }
}

// Handle image upload failure
const handleError = () => {
  ElMessage.error('上传失败，请重试')
}

// Handle image removal
const handleRemove = (type: ImagePathKey) => {
  productImagesForm.value[type] = []
}

// Step control
const nextStep = () => {
  if (activeStep.value < 17) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// Get router instance in setup
const router = useRouter()

// Modify submit function
const submitForm = async () => {
  try {
    const productId = getId()

    // Convert image array to string
    const processedImages = {
      id: getId(),
      prodId: productId,
      frontImgPath: productImagesForm.value.frontImgPath[0] || '',
      sideImgPath: productImagesForm.value.sideImgPath[0] || '',
      backImgPath: productImagesForm.value.backImgPath[0] || '',
      angleImgPath: productImagesForm.value.angleImgPath[0] || ''
    }

    const formData: ProductDto = {
      products: {
        id: productId,
        ...basicForm
      },
      upholstery: {
        id: getId(),
        productId,
        ...upholsteryForm
      },
      cartonDetails: {
        id: getId(),
        productId,
        ...cartonForm
      },
      productDimensions: {
        id: getId(),
        productId,
        ...dimensionsForm
      },
      productionLogistics: {
        id: getId(),
        productId,
        ...logisticsForm
      },
      seatInnerComponents: {
        id: getId(),
        productId,
        ...seatInnerForm
      },
      seatOuterComponents: {
        id: getId(),
        productId,
        ...seatOuterForm
      },
      backInnerComponents: {
        id: getId(),
        productId,
        ...backInnerForm
      },
      backOuterComponents: {
        id: getId(),
        productId,
        ...backOuterForm
      },
      arms: {
        id: getId(),
        productId,
        ...armsForm
      },
      foamDetails: {
        id: getId(),
        productId,
        ...foamForm
      },
      castors: {
        id: getId(),
        productId,
        ...castorsForm
      },
      bases: {
        id: getId(),
        productId,
        ...baseForm
      },
      gasLift: {
        id: getId(),
        productId,
        ...gasLiftForm
      },
      gasLiftCover: {
        id: getId(),
        productId,
        ...gasLiftCoverForm
      },
      mechanism: {
        id: getId(),
        productId,
        ...mechanismForm
      },
      fittings: {
        id: getId(),
        productId,
        ...fittingsForm
      },
      productImages: processedImages
    }

    // Print data before sending request to check data structure
    console.log('Submitted form data:', JSON.stringify(formData, null, 2))

    await postProductDtoSave(formData)
    ElMessage.success('Submission successful')

    // Redirect to list page after submission
    router.push('/prod/list')
  } catch (error) {
    console.error('Submission failed:', error)
    ElMessage.error('Submission failed, please try again')
  }
}

// Modify keyboard event handling function
const handleKeyDown = (event: KeyboardEvent) => {
  // Alt + F fill test data
  if (event.altKey && event.key.toLowerCase() === 'f') {
    fillTestData()
    return
  }

  // Alt + Left arrow fill previous step
  if (event.altKey && event.key === 'ArrowLeft') {
    prevStep()
    return
  }

  // Alt + Right arrow fill next step
  if (event.altKey && event.key === 'ArrowRight') {
    nextStep()
    return
  }

  // If current focus is in input or text area, do not handle Enter event
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  // Handle Enter key
  if (event.key === 'Enter') {
    if (activeStep.value < 17) {
      nextStep()
    } else {
      submitForm()
    }
  }
}

// Add shortcut support when component mounts
onMounted(() => {
  // Add shortcut listener
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // Remove shortcut listener
  document.removeEventListener('keydown', handleKeyDown)
})

// Step configuration
const steps = [
  {
    title: 'Basic Information',
    description: 'Fill in product basic information',
    content: basicForm
  },
  {
    title: 'Upholstery Information',
    description: 'Fill in upholstery related information',
    content: upholsteryForm
  },
  {
    title: 'Packaging Information',
    description: 'Fill in packaging related information',
    content: cartonForm
  },
  {
    title: 'Production and Logistics',
    description: 'Fill in production and logistics information',
    content: logisticsForm
  },
  {
    title: 'Product Dimensions',
    description: 'Fill in product dimension information',
    content: dimensionsForm
  },
  {
    title: 'Seat Inner Structure',
    description: 'Fill in seat inner structure information',
    content: seatInnerForm
  },
  {
    title: 'Back Inner Structure',
    description: 'Fill in back inner structure information',
    content: backInnerForm
  },
  {
    title: 'Seat Outer Structure',
    description: 'Fill in seat outer structure information',
    content: seatOuterForm
  },
  {
    title: 'Back Outer Structure',
    description: 'Fill in back outer structure information',
    content: backOuterForm
  },
  {
    title: 'Armrest Information',
    description: 'Fill in armrest related information',
    content: armsForm
  },
  {
    title: 'Foam Information',
    description: 'Fill in foam related information',
    content: foamForm
  },
  {
    title: 'Footrest Information',
    description: 'Fill in footrest related information',
    content: castorsForm
  },
  {
    title: 'Base Information',
    description: 'Fill in base related information',
    content: baseForm
  },
  {
    title: 'Gas Lift',
    description: 'Fill in gas lift related information',
    content: gasLiftForm
  },
  {
    title: 'Gas Lift Cover',
    description: 'Fill in gas lift cover related information',
    content: gasLiftCoverForm
  },
  {
    title: 'Mechanism Information',
    description: 'Fill in mechanism related information',
    content: mechanismForm
  },
  {
    title: 'Fitting Information',
    description: 'Fill in fitting related information',
    content: fittingsForm
  },
  {
    title: 'Product Image',
    description: 'Upload product images from various angles',
    content: productImagesForm
  }
]

// Add goToStep function in script setup
const goToStep = (step: number) => {
  activeStep.value = step
}

// Add new handlePreview function
const handlePreview = (imageUrl: string) => {
  // Handle image preview logic
  console.log('Preview image:', imageUrl)
}

// Add test data fill function
const fillTestData = () => {
  // Fill basic information
  Object.assign(basicForm, {
    tccode: 'TC-2025001',
    supplier: 'Test Supplier',
    supplierCode: 'SUP001',
    supplierName: 'Test Supplier',
    fireStandard: 'BS 5852',
    fob20ContainerPrice: 100,
    fob40ContainerPrice: 180,
    shippingPort: 'Shenzhen Port'
  })

  // Fill upholstery information
  Object.assign(upholsteryForm, {
    fabricManufacturer: 'Test Upholstery Manufacturer',
    colourCode: 'BLACK-001',
    leatherGrade: 'A Grade',
    usagePerChair: 2.5
  })

  // Fill packaging information
  Object.assign(cartonForm, {
    width: 60,
    depth: 60,
    height: 120,
    boardType: '5-layer corrugated board',
    itemsPerCarton: 1,
    cartonVolume: 0.432
  })

  // Fill production and logistics information
  Object.assign(logisticsForm, {
    productionTime: 30,
    effectiveVolume: 0.4,
    loadingQuantity20gp: 120,
    loadingQuantity40hc: 280,
    netWeight: 15.5,
    grossWeight: 18.2
  })

  // Fill product dimension information
  Object.assign(dimensionsForm, {
    seatWidth: 50,
    seatDepth: 50,
    seatHeightMin: 45,
    seatHeightMax: 55,
    backWidth: 45,
    backHeight: 60,
    backHeightFromSeat: 55,
    overallWidth: 65,
    overallDepth: 65,
    overallHeightMin: 115,
    overallHeightMax: 125
  })

  // Fill seat inner structure information
  Object.assign(seatInnerForm, {
    materialCode: 'PP-001',
    thickness: 5,
    layersCount: 1,
    dimensions: '500x500mm'
  })

  // Fill back inner structure information
  Object.assign(backInnerForm, {
    materialCode: 'PP-002',
    thickness: 5,
    layersCount: 1,
    dimensions: '450x600mm'
  })

  // Fill seat outer structure information
  Object.assign(seatOuterForm, {
    material: 'PP Plastic',
    dimensions: '520x520mm',
    manufacturerName: 'Test Manufacturer'
  })

  // Fill back outer structure information
  Object.assign(backOuterForm, {
    material: 'PP Plastic',
    dimensions: '470x620mm',
    manufacturerName: 'Test Manufacturer'
  })

  // Fill armrest information
  Object.assign(armsForm, {
    material: 'PP+Steel Frame',
    type: 'Adjustable Armrest',
    manufacturer: 'Mingtai Hardware',
    description: '3D Adjustable Armrest, with Soft Pad',
    armHeightFromSeat: 20,
    armHeightFromFloor: 65
  })

  // Fill foam information
  Object.assign(foamForm, {
    description: 'High Density Memory Foam',
    seatDensity: 55,
    backDensity: 45,
    seatThickness: 6,
    backThickness: 4
  })

  // Fill footrest information
  Object.assign(castorsForm, {
    description: 'Silent PU Wheel',
    pinThickness: 11,
    wheelDiameter: 60
  })

  // Fill base information
  Object.assign(baseForm, {
    description: 'Aluminum 5-star Foot',
    sizeDiameter: 680,
    material: 'Aluminum',
    type: '5-star Foot'
  })

  // Fill gas lift information
  Object.assign(gasLiftForm, {
    description: '4-level Gas Lift',
    gasLiftClass: 'Class 4',
    casingLength: 240,
    extensionSize: 100,
    taper: 28
  })

  // Fill gas lift cover information
  Object.assign(gasLiftCoverForm, {
    description: 'Adjustable Dust Cover',
    material: 'PP',
    colour: 'Black'
  })

  // Fill mechanism information
  Object.assign(mechanismForm, {
    description: 'Multi-function Base',
    leversCount: 3,
    lockingPositions: '5-speed',
    modelNo: 'JG-001',
    supplierName: 'Jinguan Machinery'
  })

  // Fill fitting information
  Object.assign(fittingsForm, {
    fittingNumber: 1001,
    description: 'Installation Screw Kit',
    quantity: 12,
    material: 'Carbon Steel'
  })

  // Fill product image information (Here only set empty arrays, as actual images need to be uploaded by user)
  productImagesForm.value = {
    frontImgPath: [],
    sideImgPath: [],
    backImgPath: [],
    angleImgPath: []
  }

  ElMessage.success('All forms have been filled with simulated data')
}

// Export necessary variables and functions for template use
defineExpose({
  steps,
  goToStep,
  handlePreview
})
</script>
