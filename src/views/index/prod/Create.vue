<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-14 17:03:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-24 09:16:13
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Create.vue
 * @Description: 产品规格创建表单
-->
<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- 固定在顶部的标题和步骤条 -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <!-- 顶部操作栏 -->
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">创建规格表</h2>
        </div>
        <div class="flex gap-2">
          <el-button type="primary" @click="fillTestData">
            <el-icon><DataLine /></el-icon>
            模拟数据
          </el-button>
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </div>

      <!-- 步骤条 -->
      <div class="px-6 py-4 border-t border-gray-200">
        <el-steps :active="activeStep" finish-status="success">
          <template v-for="(step, index) in steps" :key="index">
            <el-step :title="step.title" @click="goToStep(index)" />
          </template>
        </el-steps>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 116px - 64px)">
      <div class="p-6">
        <!-- 基本信息表单 -->
        <el-form v-if="activeStep === 0" :model="basicForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="产品代码">
            <el-input v-model="basicForm.tccode" />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="basicForm.supplier" />
          </el-form-item>
          <el-form-item label="供应商代码">
            <el-input v-model="basicForm.supplierCode" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input v-model="basicForm.supplierName" />
          </el-form-item>
          <el-form-item label="防火标准">
            <el-input v-model="basicForm.fireStandard" />
          </el-form-item>
          <el-form-item label="20尺柜FOB价格">
            <el-input-number v-model="basicForm.fob20ContainerPrice" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="40尺柜FOB价格">
            <el-input-number v-model="basicForm.fob40ContainerPrice" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="发货港口">
            <el-input v-model="basicForm.shippingPort" />
          </el-form-item>
        </el-form>

        <!-- 面料信息表单 -->
        <el-form v-if="activeStep === 1" :model="upholsteryForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="面料制造商">
            <el-input v-model="upholsteryForm.fabricManufacturer" />
          </el-form-item>
          <el-form-item label="颜色代码">
            <el-input v-model="upholsteryForm.colourCode" />
          </el-form-item>
          <el-form-item label="皮革等级">
            <el-input v-model="upholsteryForm.leatherGrade" />
          </el-form-item>
          <el-form-item label="每把椅子用料">
            <el-input-number v-model="upholsteryForm.usagePerChair" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 包装信息表单 -->
        <el-form v-if="activeStep === 2" :model="cartonForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="包装箱宽度">
            <el-input-number v-model="cartonForm.width" class="w-full" />
          </el-form-item>
          <el-form-item label="包装箱深度">
            <el-input-number v-model="cartonForm.depth" class="w-full" />
          </el-form-item>
          <el-form-item label="包装箱高度">
            <el-input-number v-model="cartonForm.height" class="w-full" />
          </el-form-item>
          <el-form-item label="纸板类型">
            <el-input v-model="cartonForm.boardType" />
          </el-form-item>
          <el-form-item label="每箱数量">
            <el-input-number v-model="cartonForm.itemsPerCarton" class="w-full" />
          </el-form-item>
          <el-form-item label="箱体体积">
            <el-input-number v-model="cartonForm.cartonVolume" :precision="3" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 生产物流信息表单 -->
        <el-form v-if="activeStep === 3" :model="logisticsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="生产时间">
            <el-input-number v-model="logisticsForm.productionTime" class="w-full" />
          </el-form-item>
          <el-form-item label="有效体积">
            <el-input-number v-model="logisticsForm.effectiveVolume" :precision="3" class="w-full" />
          </el-form-item>
          <el-form-item label="20尺柜装载数量">
            <el-input-number v-model="logisticsForm.loadingQuantity20gp" class="w-full" />
          </el-form-item>
          <el-form-item label="40尺高柜装载数量">
            <el-input-number v-model="logisticsForm.loadingQuantity40hc" class="w-full" />
          </el-form-item>
          <el-form-item label="净重">
            <el-input-number v-model="logisticsForm.netWeight" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="毛重">
            <el-input-number v-model="logisticsForm.grossWeight" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 产品尺寸表单 -->
        <el-form v-if="activeStep === 4" :model="dimensionsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="座位宽度">
            <el-input-number v-model="dimensionsForm.seatWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="座位深度">
            <el-input-number v-model="dimensionsForm.seatDepth" class="w-full" />
          </el-form-item>
          <el-form-item label="最低座高">
            <el-input-number v-model="dimensionsForm.seatHeightMin" class="w-full" />
          </el-form-item>
          <el-form-item label="最高座高">
            <el-input-number v-model="dimensionsForm.seatHeightMax" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背宽度">
            <el-input-number v-model="dimensionsForm.backWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背高度">
            <el-input-number v-model="dimensionsForm.backHeight" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背离座高度">
            <el-input-number v-model="dimensionsForm.backHeightFromSeat" class="w-full" />
          </el-form-item>
          <el-form-item label="整体宽度">
            <el-input-number v-model="dimensionsForm.overallWidth" class="w-full" />
          </el-form-item>
          <el-form-item label="整体深度">
            <el-input-number v-model="dimensionsForm.overallDepth" class="w-full" />
          </el-form-item>
          <el-form-item label="最低整体高度">
            <el-input-number v-model="dimensionsForm.overallHeightMin" class="w-full" />
          </el-form-item>
          <el-form-item label="最高整体高度">
            <el-input-number v-model="dimensionsForm.overallHeightMax" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 座椅内部结构表单 -->
        <el-form v-if="activeStep === 5" :model="seatInnerForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="材料代码">
            <el-input v-model="seatInnerForm.materialCode" />
          </el-form-item>
          <el-form-item label="厚度">
            <el-input-number v-model="seatInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="层数">
            <el-input-number v-model="seatInnerForm.layersCount" class="w-full" />
          </el-form-item>
          <el-form-item label="尺寸规格">
            <el-input v-model="seatInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- 背部内部结构表单 -->
        <el-form v-if="activeStep === 6" :model="backInnerForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="材料代码">
            <el-input v-model="backInnerForm.materialCode" />
          </el-form-item>
          <el-form-item label="厚度">
            <el-input-number v-model="backInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="层数">
            <el-input-number v-model="backInnerForm.layersCount" class="w-full" />
          </el-form-item>
          <el-form-item label="尺寸规格">
            <el-input v-model="backInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- 座椅外部结构表单 -->
        <el-form v-if="activeStep === 7" :model="seatOuterForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="材料">
            <el-input v-model="seatOuterForm.material" />
          </el-form-item>
          <el-form-item label="尺寸">
            <el-input v-model="seatOuterForm.dimensions" />
          </el-form-item>
          <el-form-item label="制造商名称">
            <el-input v-model="seatOuterForm.manufacturerName" />
          </el-form-item>
        </el-form>

        <!-- 背部外部结构表单 -->
        <el-form v-if="activeStep === 8" :model="backOuterForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="材料">
            <el-input v-model="backOuterForm.material" />
          </el-form-item>
          <el-form-item label="尺寸">
            <el-input v-model="backOuterForm.dimensions" />
          </el-form-item>
          <el-form-item label="制造商名称">
            <el-input v-model="backOuterForm.manufacturerName" />
          </el-form-item>
        </el-form>

        <!-- 扶手信息表单 -->
        <el-form v-if="activeStep === 9" :model="armsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="材料">
            <el-input v-model="armsForm.material" />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="armsForm.type" />
          </el-form-item>
          <el-form-item label="制造商">
            <el-input v-model="armsForm.manufacturer" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="armsForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="扶手离座高度">
            <el-input-number v-model="armsForm.armHeightFromSeat" class="w-full" />
          </el-form-item>
          <el-form-item label="扶手离地高度">
            <el-input-number v-model="armsForm.armHeightFromFloor" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 泡棉信息表单 -->
        <el-form v-if="activeStep === 10" :model="foamForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="foamForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="座椅密度">
            <el-input-number v-model="foamForm.seatDensity" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背密度">
            <el-input-number v-model="foamForm.backDensity" class="w-full" />
          </el-form-item>
          <el-form-item label="座椅厚度">
            <el-input-number v-model="foamForm.seatThickness" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背厚度">
            <el-input-number v-model="foamForm.backThickness" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 脚轮信息表单 -->
        <el-form v-if="activeStep === 11" :model="castorsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="castorsForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="销轴直径">
            <el-input-number v-model="castorsForm.pinThickness" class="w-full" />
          </el-form-item>
          <el-form-item label="轮子直径">
            <el-input-number v-model="castorsForm.wheelDiameter" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 底座信息表单 -->
        <el-form v-if="activeStep === 12" :model="baseForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="baseForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="底盘直径">
            <el-input-number v-model="baseForm.sizeDiameter" class="w-full" />
          </el-form-item>
          <el-form-item label="材料">
            <el-input v-model="baseForm.material" />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="baseForm.type" />
          </el-form-item>
        </el-form>

        <!-- 气压棒信息表单 -->
        <el-form v-if="activeStep === 13" :model="gasLiftForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="gasLiftForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="气压等级">
            <el-input v-model="gasLiftForm.gasLiftClass" />
          </el-form-item>
          <el-form-item label="外管长度">
            <el-input-number v-model="gasLiftForm.casingLength" class="w-full" />
          </el-form-item>
          <el-form-item label="行程">
            <el-input-number v-model="gasLiftForm.extensionSize" class="w-full" />
          </el-form-item>
          <el-form-item label="锥度">
            <el-input-number v-model="gasLiftForm.taper" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 气压罩信息表单 -->
        <el-form v-if="activeStep === 14" :model="gasLiftCoverForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="gasLiftCoverForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="材料">
            <el-input v-model="gasLiftCoverForm.material" />
          </el-form-item>
          <el-form-item label="颜色">
            <el-input v-model="gasLiftCoverForm.colour" />
          </el-form-item>
        </el-form>

        <!-- 机构信息表单 -->
        <el-form v-if="activeStep === 15" :model="mechanismForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="描述">
            <el-input v-model="mechanismForm.description" type="textarea" />
          </el-form-item>
          <el-form-item label="手柄数量">
            <el-input-number v-model="mechanismForm.leversCount" class="w-full" />
          </el-form-item>
          <el-form-item label="锁定位置">
            <el-input v-model="mechanismForm.lockingPositions" />
          </el-form-item>
          <el-form-item label="型号">
            <el-input v-model="mechanismForm.modelNo" />
          </el-form-item>
          <el-form-item label="机构供应商">
            <el-input v-model="mechanismForm.supplierName" />
          </el-form-item>
        </el-form>

        <!-- 配件信息表单 -->
        <el-form v-if="activeStep === 16" :model="fittingsForm" label-width="140px" class="max-w-4xl mx-auto">
          <el-form-item label="配件编号">
            <el-input-number v-model="fittingsForm.fittingNumber" class="w-full" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="fittingsForm.description" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="fittingsForm.quantity" class="w-full" />
          </el-form-item>
          <el-form-item label="材料">
            <el-input v-model="fittingsForm.material" />
          </el-form-item>
        </el-form>

        <!-- 产品图片表单 -->
        <el-form v-if="activeStep === 17" :model="productImagesForm" label-width="140px" class="max-w-6xl mx-auto">
          <div class="grid grid-cols-4 gap-6">
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">正视图</div>
                <ImageHandler v-model="productImagesForm.frontImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">侧视图</div>
                <ImageHandler v-model="productImagesForm.sideImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">背视图</div>
                <ImageHandler v-model="productImagesForm.backImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex flex-col">
                <div class="text-sm text-gray-600 mb-2">角视图</div>
                <ImageHandler v-model="productImagesForm.angleImgPath" class="aspect-square w-full" :limit="1" :editable="true" @preview="handlePreview" />
              </div>
            </div>
          </div>
        </el-form>

        <!-- 步骤控制按钮 -->
        <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0">
          <div class="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
            <div class="flex justify-center items-center gap-4 h-16 px-5 mx-auto max-w-4xl">
              <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
              <el-button type="primary" @click="nextStep" v-if="activeStep < 17">下一步</el-button>
              <el-button type="success" @click="submitForm" v-else>提交</el-button>
            </div>
          </div>
        </div>
        <!-- 添加底部空白区域防止内容被固定按钮遮挡 -->
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

// 表单数据
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

// 座椅内部结构数据
const seatInnerForm = reactive<Partial<SeatInnerComponents>>({
  materialCode: '',
  thickness: 0,
  layersCount: 0,
  dimensions: ''
})

// 背部内部结构数据
const backInnerForm = reactive<Partial<BackInnerComponents>>({
  materialCode: '',
  thickness: 0,
  layersCount: 0,
  dimensions: ''
})

// 座椅外部结构数据
const seatOuterForm = reactive<Partial<SeatOuterComponents>>({
  material: '',
  dimensions: '',
  manufacturerName: ''
})

// 背部外部结构数据
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

// 配件信息数据
const fittingsForm = reactive<Partial<Fittings>>({
  fittingNumber: 0,
  description: '',
  quantity: 0,
  material: ''
})

// 产品图片表单
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

// 修改 ImagePathKey 的类型定义
type ImagePathKey = 'frontImgPath' | 'sideImgPath' | 'backImgPath' | 'angleImgPath'

// 处理图片上传前的验证
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 创建处理函数工厂
const createHandleSuccess = (type: ImagePathKey) => {
  return (response: any, uploadFile: UploadFile) => {
    handleSuccess(response, uploadFile, type)
  }
}

// 处理图片上传成功
const handleSuccess = (response: any, uploadFile: UploadFile, type: ImagePathKey) => {
  if (uploadFile.raw) {
    productImagesForm.value[type].push(URL.createObjectURL(uploadFile.raw))
    ElMessage.success('上传成功')
  }
}

// 处理图片上传失败
const handleError = () => {
  ElMessage.error('上传失败，请重试')
}

// 处理图片移除
const handleRemove = (type: ImagePathKey) => {
  productImagesForm.value[type] = []
}

// 步骤控制
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

// 在 setup 中获取 router 实例
const router = useRouter()

// 修改提交函数
const submitForm = async () => {
  try {
    const productId = getId()

    // 转换图片数组为字符串
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

    // 在发送请求前打印数据，检查数据结构
    console.log('提交的表单数据：', JSON.stringify(formData, null, 2))

    await postProductDtoSave(formData)
    ElMessage.success('提交成功')

    // 提交成功后跳转到列表页面
    router.push('/prod/list')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  }
}

// 修改键盘事件处理函数
const handleKeyDown = (event: KeyboardEvent) => {
  // Alt + F 填充测试数据
  if (event.altKey && event.key.toLowerCase() === 'f') {
    fillTestData()
    return
  }

  // Alt + 左箭头 上一步
  if (event.altKey && event.key === 'ArrowLeft') {
    prevStep()
    return
  }

  // Alt + 右箭头 下一步
  if (event.altKey && event.key === 'ArrowRight') {
    nextStep()
    return
  }

  // 如果当前焦点在输入框或文本框中，不处理回车事件
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  // 处理回车键
  if (event.key === 'Enter') {
    if (activeStep.value < 17) {
      nextStep()
    } else {
      submitForm()
    }
  }
}

// 在组件挂载时添加快捷键支持
onMounted(() => {
  // 添加快捷键监听
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 移除快捷键监听
  document.removeEventListener('keydown', handleKeyDown)
})

// 步骤配置
const steps = [
  {
    title: '基本信息',
    description: '填写产品基本信息',
    content: basicForm
  },
  {
    title: '面料信息',
    description: '填写面料相关信息',
    content: upholsteryForm
  },
  {
    title: '包装信息',
    description: '填写包装相关信息',
    content: cartonForm
  },
  {
    title: '生产物流',
    description: '填写生产和物流信息',
    content: logisticsForm
  },
  {
    title: '产品尺寸',
    description: '填写产品尺寸信息',
    content: dimensionsForm
  },
  {
    title: '座椅内部结构',
    description: '填写座椅内部结构信息',
    content: seatInnerForm
  },
  {
    title: '背部内部结构',
    description: '填写背部内部结构信息',
    content: backInnerForm
  },
  {
    title: '座椅外部结构',
    description: '填写座椅外部结构信息',
    content: seatOuterForm
  },
  {
    title: '背部外部结构',
    description: '填写背部外部结构信息',
    content: backOuterForm
  },
  {
    title: '扶手信息',
    description: '填写扶手相关信息',
    content: armsForm
  },
  {
    title: '泡棉信息',
    description: '填写泡棉相关信息',
    content: foamForm
  },
  {
    title: '脚轮信息',
    description: '填写脚轮相关信息',
    content: castorsForm
  },
  {
    title: '底座信息',
    description: '填写底座相关信息',
    content: baseForm
  },
  {
    title: '气压棒',
    description: '填写气压棒相关信息',
    content: gasLiftForm
  },
  {
    title: '气压罩',
    description: '填写气压罩相关信息',
    content: gasLiftCoverForm
  },
  {
    title: '机构信息',
    description: '填写机构相关信息',
    content: mechanismForm
  },
  {
    title: '配件信息',
    description: '填写配件相关信息',
    content: fittingsForm
  },
  {
    title: '产品图片',
    description: '上传产品各角度图片',
    content: productImagesForm
  }
]

// 在 script setup 部分添加 goToStep 函数
const goToStep = (step: number) => {
  activeStep.value = step
}

// 添加新的 handlePreview 函数
const handlePreview = (imageUrl: string) => {
  // 处理图片预览逻辑
  console.log('预览图片:', imageUrl)
}

// 添加测试数据填充函数
const fillTestData = () => {
  // 填充基本信息
  Object.assign(basicForm, {
    tccode: 'TC-2025001',
    supplier: 'Test Supplier',
    supplierCode: 'SUP001',
    supplierName: '测试供应商',
    fireStandard: 'BS 5852',
    fob20ContainerPrice: 100,
    fob40ContainerPrice: 180,
    shippingPort: '深圳港'
  })

  // 填充面料信息
  Object.assign(upholsteryForm, {
    fabricManufacturer: '测试面料厂商',
    colourCode: 'BLACK-001',
    leatherGrade: 'A级',
    usagePerChair: 2.5
  })

  // 填充包装信息
  Object.assign(cartonForm, {
    width: 60,
    depth: 60,
    height: 120,
    boardType: '五层瓦楞纸',
    itemsPerCarton: 1,
    cartonVolume: 0.432
  })

  // 填充生产物流信息
  Object.assign(logisticsForm, {
    productionTime: 30,
    effectiveVolume: 0.4,
    loadingQuantity20gp: 120,
    loadingQuantity40hc: 280,
    netWeight: 15.5,
    grossWeight: 18.2
  })

  // 填充产品尺寸信息
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

  // 填充座椅内部结构信息
  Object.assign(seatInnerForm, {
    materialCode: 'PP-001',
    thickness: 5,
    layersCount: 1,
    dimensions: '500x500mm'
  })

  // 填充背部内部结构信息
  Object.assign(backInnerForm, {
    materialCode: 'PP-002',
    thickness: 5,
    layersCount: 1,
    dimensions: '450x600mm'
  })

  // 填充座椅外部结构信息
  Object.assign(seatOuterForm, {
    material: 'PP塑料',
    dimensions: '520x520mm',
    manufacturerName: '测试制造商'
  })

  // 填充背部外部结构信息
  Object.assign(backOuterForm, {
    material: 'PP塑料',
    dimensions: '470x620mm',
    manufacturerName: '测试制造商'
  })

  // 填充扶手信息
  Object.assign(armsForm, {
    material: 'PP+钢架',
    type: '可调节扶手',
    manufacturer: '明泰五金',
    description: '3D调节扶手，带软垫',
    armHeightFromSeat: 20,
    armHeightFromFloor: 65
  })

  // 填充泡棉信息
  Object.assign(foamForm, {
    description: '高密度记忆海绵',
    seatDensity: 55,
    backDensity: 45,
    seatThickness: 6,
    backThickness: 4
  })

  // 填充脚轮信息
  Object.assign(castorsForm, {
    description: '静音PU轮',
    pinThickness: 11,
    wheelDiameter: 60
  })

  // 填充底座信息
  Object.assign(baseForm, {
    description: '铝合金五星脚',
    sizeDiameter: 680,
    material: '铝合金',
    type: '五星脚'
  })

  // 填充气压棒信息
  Object.assign(gasLiftForm, {
    description: '4级气压棒',
    gasLiftClass: 'Class 4',
    casingLength: 240,
    extensionSize: 100,
    taper: 28
  })

  // 填充气压罩信息
  Object.assign(gasLiftCoverForm, {
    description: '伸缩防尘罩',
    material: 'PP',
    colour: '黑色'
  })

  // 填充机构信息
  Object.assign(mechanismForm, {
    description: '多功能底盘',
    leversCount: 3,
    lockingPositions: '5档',
    modelNo: 'JG-001',
    supplierName: '金冠机械'
  })

  // 填充配件信息
  Object.assign(fittingsForm, {
    fittingNumber: 1001,
    description: '安装螺丝套件',
    quantity: 12,
    material: '碳钢'
  })

  // 填充产品图片信息（这里只设置空数组，因为实际图片需要用户上传）
  productImagesForm.value = {
    frontImgPath: [],
    sideImgPath: [],
    backImgPath: [],
    angleImgPath: []
  }

  ElMessage.success('所有表单已填充模拟数据')
}

// 导出必要的变量和函数供模板使用
defineExpose({
  steps,
  goToStep,
  handlePreview
})
</script>
