<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-03-18 17:09:36
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
          <!-- 顶部操作栏 -->
          <div class="flex justify-between items-center py-3 px-6">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800">产品规格详情</h2>
            </div>
            <div class="flex gap-2">
              <el-button v-permission="{module: 'prod', action: 'Edit'}" type="primary" :loading="exporting" @click="handleEdit" class="min-w-[120px]">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="primary" :loading="exporting" @click="handleExport" class="min-w-[120px]">
                <el-icon>
                  <Document />
                </el-icon>
                {{ exporting ? '导出中...' : '导出文档' }}
              </el-button>
              <el-button v-if="exporting" type="warning" @click="handleCancelExport" class="min-w-[120px]">
                <el-icon><CircleClose /></el-icon>
                取消导出
              </el-button>
              <el-button @click="router.back()">
                <el-icon>
                  <Back />
                </el-icon>
                返回
              </el-button>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
          <div class="p-6">
            <!-- 统一处理所有表格，包括基本信息 -->
            <div v-for="sectionKey in ['basic', ...Object.keys(specSections)]" :key="sectionKey" class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>{{ sectionKey === 'basic' ? '基本信息' : formatSectionTitle(sectionKey) }}</span>
                  <div class="flex gap-2 ml-auto">
                    <template v-if="editingSections.includes(sectionKey)">
                      <el-button type="success" @click="handleSave(sectionKey)">
                        <el-icon><Check /></el-icon>
                        保存
                      </el-button>
                      <el-button type="danger" @click="handleCancel(sectionKey)">
                        <el-icon><Close /></el-icon>
                        取消
                      </el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" @click="handleEdit(sectionKey)">
                        <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
                    </template>
                  </div>
                </h3>
              </div>

              <el-form :model="sectionKey === 'basic' ? formData.products : formData[sectionKey]" label-width="140px" class="[&_.el-form-item__label]:text-gray-600 [&_.el-form-item__label]:font-medium [&_.el-input__wrapper]:shadow-none [&_.el-input__inner]:h-[38px]">
                <template v-if="sectionKey === 'images'">
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="(label, key) in specSections.images" :key="key" class="bg-gray-100 p-4 rounded">
                      <div class="text-center text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>
                      <div class="w-full h-[240px] bg-white rounded-lg overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center">
                          <ImageHandler
                            :model-value="formData.images[key] ? [formData.images[key]] : []"
                            @update:model-value="val => updateSingleImage('images', String(key), val)"
                            :editable="editingSections.includes('images')"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                            :size="260"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                    <el-form-item v-for="(label, key) in sectionKey === 'basic' ? basicFields : specSections[sectionKey]" :key="key" :label="label" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                      <template v-if="editingSections.includes(sectionKey)">
                        <el-input v-if="sectionKey === 'basic'" v-model="formData.products[key]" :placeholder="`请输入${label}`" class="w-full !h-[38px]" />
                        <el-input v-else v-model="formData[sectionKey][key]" :placeholder="`请输入${label}`" class="w-full !h-[38px]" />
                      </template>
                      <template v-else>
                        <div class="w-full text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px]">
                          {{ sectionKey === 'basic' ? formData.products[key] || '-' : formData[sectionKey][key] || '-' }}
                        </div>
                      </template>
                    </el-form-item>
                  </div>
                </template>
              </el-form>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import {Products, CartonDetails, ProductDimensions, ProductionLogistics, SeatInnerComponents, BackInnerComponents, BackOuterComponents, SeatOuterComponents, Arms, FoamDetails, Castors, Bases, GasLift, GasLiftCover, Mechanism, Fittings, ProductImages, Upholstery} from '@/api'
import {
  getProductDtoGetById,
  putProductsUpdate,
  putCartonDetailsUpdate,
  putProductDimensionsUpdate,
  putProductionLogisticsUpdate,
  putSeatInnerComponentsUpdate,
  putBackInnerComponentsUpdate,
  putSeatOuterComponentsUpdate,
  putBackOuterComponentsUpdate,
  putArmsUpdate,
  putFoamDetailsUpdate,
  putCastorsUpdate,
  putBasesUpdate,
  putGasLiftUpdate,
  putGasLiftCoverUpdate,
  putMechanismUpdate,
  putFittingsUpdate,
  putProductImagesUpdate,
  putUpholsteryUpdate,
  getFilesRemove,
  postFilesUpload
} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'
import {Back, Check, Close, Document, Edit, CircleClose} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {exportToWord} from '../../../utils/exportToWord'

interface FormData {
  products: Products & {[key: string]: any}
  packaging: CartonDetails & {[key: string]: any}
  dimensions: ProductDimensions & {[key: string]: any}
  logistics: ProductionLogistics & {[key: string]: any}
  seatInner: SeatInnerComponents & {[key: string]: any}
  backInner: BackInnerComponents & {[key: string]: any}
  seatOuter: SeatOuterComponents & {[key: string]: any}
  backOuter: BackOuterComponents & {[key: string]: any}
  arms: Arms & {[key: string]: any}
  foam: FoamDetails & {[key: string]: any}
  castors: Castors & {[key: string]: any}
  base: Bases & {[key: string]: any}
  gasLift: GasLift & {[key: string]: any}
  gasLiftCover: GasLiftCover & {[key: string]: any}
  mechanism: Mechanism & {[key: string]: any}
  fittings: Fittings & {[key: string]: any}
  images: ProductImages & {[key: string]: any}
  upholstery: Upholstery & {[key: string]: any}
  [key: string]: any
}

interface BasicField {
  [key: string]: string
  tccode: string
  supplier: string
  supplierCode: string
  supplierName: string
  fireStandard: string
  fob20ContainerPrice: string
  fob40ContainerPrice: string
  shippingPort: string
}

interface SpecSection {
  [key: string]: string
}

interface SpecSections {
  [key: string]: SpecSection
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const editingSections = ref<string[]>([])
const exporting = ref(false)
const abortController = ref<AbortController | null>(null)
const formData = ref<FormData>({
  products: {
    id: '',
    tccode: '',
    supplier: '',
    supplierCode: '',
    supplierName: '',
    fireStandard: '',
    fob20ContainerPrice: 0,
    fob40ContainerPrice: 0,
    shippingPort: ''
  },
  packaging: {
    id: '',
    productId: '',
    width: 0,
    depth: 0,
    height: 0,
    boardType: '',
    itemsPerCarton: 0,
    cartonVolume: 0
  },
  dimensions: {
    id: '',
    productId: '',
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
  },
  logistics: {
    id: '',
    productId: '',
    productionTime: 0,
    effectiveVolume: 0,
    loadingQuantity20gp: 0,
    loadingQuantity40hc: 0,
    netWeight: 0,
    grossWeight: 0
  },
  seatInner: {
    id: '',
    productId: '',
    materialCode: '',
    thickness: 0,
    layersCount: 0,
    dimensions: ''
  },
  backInner: {
    id: '',
    productId: '',
    materialCode: '',
    thickness: 0,
    layersCount: 0,
    dimensions: ''
  },
  backOuter: {
    id: '',
    productId: '',
    material: '',
    dimensions: '',
    manufacturerName: ''
  },
  seatOuter: {
    id: '',
    productId: '',
    material: '',
    dimensions: '',
    manufacturerName: ''
  },
  arms: {
    id: '',
    productId: '',
    material: '',
    type: '',
    manufacturer: '',
    description: '',
    armHeightFromSeat: 0,
    armHeightFromFloor: 0
  },
  foam: {
    id: '',
    productId: '',
    description: '',
    seatDensity: 0,
    backDensity: 0,
    seatThickness: 0,
    backThickness: 0
  },
  castors: {
    id: '',
    productId: '',
    description: '',
    pinThickness: 0,
    wheelDiameter: 0
  },
  base: {
    id: '',
    productId: '',
    description: '',
    sizeDiameter: 0,
    material: '',
    type: ''
  },
  gasLift: {
    id: '',
    productId: '',
    description: '',
    gasLiftClass: '',
    casingLength: 0,
    extensionSize: 0,
    taper: 0
  },
  gasLiftCover: {
    id: '',
    productId: '',
    description: '',
    material: '',
    colour: ''
  },
  mechanism: {
    id: '',
    productId: '',
    description: '',
    leversCount: 0,
    lockingPositions: '',
    modelNo: '',
    supplierName: ''
  },
  fittings: {
    id: '',
    productId: '',
    fittingNumber: 0,
    description: '',
    quantity: 0,
    material: ''
  },
  images: {
    id: '',
    prodId: '',
    frontImgPath: '',
    sideImgPath: '',
    backImgPath: '',
    angleImgPath: ''
  },
  upholstery: {
    id: '',
    productId: '',
    fabricManufacturer: '',
    colourCode: '',
    leatherGrade: '',
    usagePerChair: 0
  }
})
const formDataBackup = ref<FormData>(JSON.parse(JSON.stringify(formData.value)))

// 基本字段定义
const basicFields: BasicField = {
  tccode: '产品代码',
  supplier: '供应商',
  supplierCode: '供应商代码',
  supplierName: '供应商名称',
  fireStandard: '防火标准',
  fob20ContainerPrice: '20尺柜FOB价格',
  fob40ContainerPrice: '40尺柜FOB价格',
  shippingPort: '发货港口'
} as const

// 规格部分定义
const specSections: SpecSections = {
  upholstery: {
    fabricManufacturer: '面料制造商',
    colourCode: '颜色代码',
    leatherGrade: '皮革等级',
    usagePerChair: '每把椅子用料'
  },
  packaging: {
    width: '纸箱长度',
    depth: '纸箱宽度',
    height: '纸箱高度',
    boardType: '纸板类型',
    itemsPerCarton: '每箱数量',
    cartonVolume: '箱体体积'
  },
  logistics: {
    productionTime: '生产周期',
    effectiveVolume: '有效体积',
    loadingQuantity20gp: '20尺柜装柜数',
    loadingQuantity40hc: '40尺高柜装柜数',
    netWeight: '净重',
    grossWeight: '毛重'
  },
  dimensions: {
    seatWidth: '座宽',
    seatDepth: '座深',
    seatHeightMin: '最低座高',
    seatHeightMax: '最高座高',
    backWidth: '背宽',
    backHeight: '背高',
    backHeightFromSeat: '靠背离座高度',
    overallWidth: '整体宽度',
    overallDepth: '整体深度',
    overallHeightMin: '最低整体高度',
    overallHeightMax: '最高整体高度'
  },
  seatInner: {
    materialCode: '材料代码',
    thickness: '厚度',
    layersCount: '层数',
    dimensions: '尺寸规格'
  },
  backInner: {
    materialCode: '材料代码',
    thickness: '厚度',
    layersCount: '层数',
    dimensions: '尺寸规格'
  },
  backOuter: {
    material: '材料',
    dimensions: '尺寸',
    manufacturerName: '制造商名称'
  },
  seatOuter: {
    material: '材料',
    dimensions: '尺寸',
    manufacturerName: '制造商名称'
  },
  arms: {
    material: '材料',
    type: '类型',
    manufacturer: '制造商',
    description: '描述',
    armHeightFromSeat: '扶手离座高度',
    armHeightFromFloor: '扶手离地高度'
  },
  foam: {
    description: '描述',
    seatDensity: '座椅密度',
    backDensity: '靠背密度',
    seatThickness: '座椅厚度',
    backThickness: '靠背厚度'
  },
  castors: {
    description: '描述',
    pinThickness: '销轴直径',
    wheelDiameter: '轮子直径'
  },
  base: {
    description: '描述',
    sizeDiameter: '底盘直径',
    material: '材料',
    type: '类型'
  },
  gasLift: {
    description: '描述',
    gasLiftClass: '气压等级',
    casingLength: '外管长度',
    extensionSize: '行程',
    taper: '锥度'
  },
  gasLiftCover: {
    description: '描述',
    material: '材料',
    colour: '颜色'
  },
  mechanism: {
    description: '描述',
    leversCount: '手柄数量',
    lockingPositions: '锁定位置',
    modelNo: '型号',
    supplierName: '机构供应商'
  },
  fittings: {
    fittingNumber: '配件编号',
    description: '描述',
    quantity: '数量',
    material: '材料'
  },
  images: {
    frontImgPath: '正视图',
    sideImgPath: '侧视图',
    backImgPath: '背视图',
    angleImgPath: '角视图'
  }
} as const

// 在组件挂载时获取数据
onMounted(async () => {
  console.log('组件已挂载，开始获取数据')
  await fetchData()

  // 检查路由参数，如果有edit=true，则自动进入基本信息的编辑状态
  if (route.query.edit === 'true') {
    handleEdit('basic')
  }
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    if (!id) {
      ElMessage.error('产品ID不能为空')
      return
    }

    console.log('正在获取产品数据，ID:', id)
    const response = await getProductDtoGetById({id})
    console.log('获取到的数据:', response)
    if (response) {
      // 使用类型断言处理API返回的数据
      const responseData = response.data as any
      formData.value = {
        ...formData.value,
        products: {
          id: responseData.products?.id || '',
          tccode: responseData.products?.tccode || '',
          supplier: responseData.products?.supplier || '',
          supplierCode: responseData.products?.supplierCode || '',
          supplierName: responseData.products?.supplierName || '',
          fireStandard: responseData.products?.fireStandard || '',
          fob20ContainerPrice: Number(responseData.products?.fob20ContainerPrice) || 0,
          fob40ContainerPrice: Number(responseData.products?.fob40ContainerPrice) || 0,
          shippingPort: responseData.products?.shippingPort || ''
        },
        packaging: {
          id: responseData.cartonDetails?.id || '',
          productId: responseData.cartonDetails?.productId || '',
          width: Number(responseData.cartonDetails?.width) || 0,
          depth: Number(responseData.cartonDetails?.depth) || 0,
          height: Number(responseData.cartonDetails?.height) || 0,
          boardType: responseData.cartonDetails?.boardType || '',
          itemsPerCarton: Number(responseData.cartonDetails?.itemsPerCarton) || 0,
          cartonVolume: Number(responseData.cartonDetails?.cartonVolume) || 0
        },
        dimensions: {
          id: responseData.productDimensions?.id || '',
          productId: responseData.productDimensions?.productId || '',
          seatWidth: responseData.productDimensions?.seatWidth || 0,
          seatDepth: responseData.productDimensions?.seatDepth || 0,
          seatHeightMin: responseData.productDimensions?.seatHeightMin || 0,
          seatHeightMax: responseData.productDimensions?.seatHeightMax || 0,
          backWidth: responseData.productDimensions?.backWidth || 0,
          backHeight: responseData.productDimensions?.backHeight || 0,
          backHeightFromSeat: responseData.productDimensions?.backHeightFromSeat || 0,
          overallWidth: responseData.productDimensions?.overallWidth || 0,
          overallDepth: responseData.productDimensions?.overallDepth || 0,
          overallHeightMin: responseData.productDimensions?.overallHeightMin || 0,
          overallHeightMax: responseData.productDimensions?.overallHeightMax || 0
        },
        logistics: {
          id: responseData.productionLogistics?.id || '',
          productId: responseData.productionLogistics?.productId || '',
          productionTime: responseData.productionLogistics?.productionTime || 0,
          effectiveVolume: responseData.productionLogistics?.effectiveVolume || 0,
          loadingQuantity20gp: responseData.productionLogistics?.loadingQuantity20gp || 0,
          loadingQuantity40hc: responseData.productionLogistics?.loadingQuantity40hc || 0,
          netWeight: responseData.productionLogistics?.netWeight || 0,
          grossWeight: responseData.productionLogistics?.grossWeight || 0
        },
        seatInner: {
          id: responseData.seatInnerComponents?.id || '',
          productId: responseData.seatInnerComponents?.productId || '',
          materialCode: responseData.seatInnerComponents?.materialCode || '',
          thickness: responseData.seatInnerComponents?.thickness || 0,
          layersCount: responseData.seatInnerComponents?.layersCount || 0,
          dimensions: responseData.seatInnerComponents?.dimensions || ''
        },
        backInner: {
          id: responseData.backInnerComponents?.id || '',
          productId: responseData.backInnerComponents?.productId || '',
          materialCode: responseData.backInnerComponents?.materialCode || '',
          thickness: responseData.backInnerComponents?.thickness || 0,
          layersCount: responseData.backInnerComponents?.layersCount || 0,
          dimensions: responseData.backInnerComponents?.dimensions || ''
        },
        backOuter: {
          id: responseData.backOuterComponents?.id || '',
          productId: responseData.backOuterComponents?.productId || '',
          material: responseData.backOuterComponents?.material || '',
          dimensions: responseData.backOuterComponents?.dimensions || '',
          manufacturerName: responseData.backOuterComponents?.manufacturerName || ''
        },
        seatOuter: {
          id: responseData.seatOuterComponents?.id || '',
          productId: responseData.seatOuterComponents?.productId || '',
          material: responseData.seatOuterComponents?.material || '',
          dimensions: responseData.seatOuterComponents?.dimensions || '',
          manufacturerName: responseData.seatOuterComponents?.manufacturerName || ''
        },
        arms: {
          id: responseData.arms?.id || '',
          productId: responseData.arms?.productId || '',
          material: responseData.arms?.material || '',
          type: responseData.arms?.type || '',
          manufacturer: responseData.arms?.manufacturer || '',
          description: responseData.arms?.description || '',
          armHeightFromSeat: responseData.arms?.armHeightFromSeat || 0,
          armHeightFromFloor: responseData.arms?.armHeightFromFloor || 0
        },
        foam: {
          id: responseData.foamDetails?.id || '',
          productId: responseData.foamDetails?.productId || '',
          description: responseData.foamDetails?.description || '',
          seatDensity: responseData.foamDetails?.seatDensity || 0,
          backDensity: responseData.foamDetails?.backDensity || 0,
          seatThickness: responseData.foamDetails?.seatThickness || 0,
          backThickness: responseData.foamDetails?.backThickness || 0
        },
        castors: {
          id: responseData.castors?.id || '',
          productId: responseData.castors?.productId || '',
          description: responseData.castors?.description || '',
          pinThickness: responseData.castors?.pinThickness || 0,
          wheelDiameter: responseData.castors?.wheelDiameter || 0
        },
        base: {
          id: responseData.bases?.id || '',
          productId: responseData.bases?.productId || '',
          description: responseData.bases?.description || '',
          sizeDiameter: responseData.bases?.sizeDiameter || 0,
          material: responseData.bases?.material || '',
          type: responseData.bases?.type || ''
        },
        gasLift: {
          id: responseData.gasLift?.id || '',
          productId: responseData.gasLift?.productId || '',
          description: responseData.gasLift?.description || '',
          gasLiftClass: responseData.gasLift?.gasLiftClass || '',
          casingLength: responseData.gasLift?.casingLength || 0,
          extensionSize: responseData.gasLift?.extensionSize || 0,
          taper: responseData.gasLift?.taper || 0
        },
        gasLiftCover: {
          id: responseData.gasLiftCover?.id || '',
          productId: responseData.gasLiftCover?.productId || '',
          description: responseData.gasLiftCover?.description || '',
          material: responseData.gasLiftCover?.material || '',
          colour: responseData.gasLiftCover?.colour || ''
        },
        mechanism: {
          id: responseData.mechanism?.id || '',
          productId: responseData.mechanism?.productId || '',
          description: responseData.mechanism?.description || '',
          leversCount: responseData.mechanism?.leversCount || 0,
          lockingPositions: responseData.mechanism?.lockingPositions || '',
          modelNo: responseData.mechanism?.modelNo || '',
          supplierName: responseData.mechanism?.supplierName || ''
        },
        fittings: {
          id: responseData.fittings?.id || '',
          productId: responseData.fittings?.productId || '',
          fittingNumber: responseData.fittings?.fittingNumber || 0,
          description: responseData.fittings?.description || '',
          quantity: responseData.fittings?.quantity || 0,
          material: responseData.fittings?.material || ''
        },
        images: {
          id: responseData.productImages?.id || '',
          prodId: responseData.productImages?.productId || '',
          frontImgPath: responseData.productImages?.frontImgPath || '',
          sideImgPath: responseData.productImages?.sideImgPath || '',
          backImgPath: responseData.productImages?.backImgPath || '',
          angleImgPath: responseData.productImages?.angleImgPath || ''
        },
        upholstery: {
          id: responseData.upholstery?.id || '',
          productId: responseData.upholstery?.productId || '',
          fabricManufacturer: responseData.upholstery?.fabricManufacturer || '',
          colourCode: responseData.upholstery?.colourCode || '',
          leatherGrade: responseData.upholstery?.leatherGrade || '',
          usagePerChair: Number(responseData.upholstery?.usagePerChair) || 0
        }
      }

      // 创建数据备份
      formDataBackup.value = JSON.parse(JSON.stringify(formData.value))
    } else {
      console.warn('未获取到产品数据')
      ElMessage.warning('未找到产品数据')
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 处理编辑按钮点击
const handleEdit = (section: string): void => {
  console.log('编辑按钮被点击:', section)
  // 创建完整数据快照
  formDataBackup.value = {
    ...formDataBackup.value,
    ...JSON.parse(JSON.stringify(formData.value))
  }
  editingSections.value = [...editingSections.value, section]
}

// 将组件内的 saveData 函数重命名为 handleSaveData
const handleSaveData = async (section: string) => {
  try {
    const id = route.params.id as string
    if (!id) {
      throw new Error('产品ID不能为空')
    }

    let sectionData: any

    // 根据不同的 section 构建对应的数据结构
    if (section === 'basic') {
      // 基本信息特殊处理，因为它对应的是 products
      sectionData = {
        ...formData.value.products,
        id: formData.value.products.id || '',
        // 转换数值类型的字段
        fob20ContainerPrice: Number(formData.value.products.fob20ContainerPrice),
        fob40ContainerPrice: Number(formData.value.products.fob40ContainerPrice)
      }
      // 调用 products 的更新 API
      await putProductsUpdate(sectionData)
    } else {
      // 其他部分的处理
      sectionData = {
        ...formData.value[section],
        id: formData.value[section].id || '',
        productId: id
      }

      // 根据不同的 section 处理数值类型的字段
      switch (section) {
        case 'packaging':
          sectionData.width = Number(sectionData.width)
          sectionData.depth = Number(sectionData.depth)
          sectionData.height = Number(sectionData.height)
          sectionData.itemsPerCarton = Number(sectionData.itemsPerCarton)
          sectionData.cartonVolume = Number(sectionData.cartonVolume)
          break
        case 'dimensions':
          Object.keys(sectionData).forEach(key => {
            if (key !== 'id' && key !== 'productId') {
              sectionData[key] = Number(sectionData[key])
            }
          })
          break
        case 'logistics':
          sectionData.productionTime = Number(sectionData.productionTime)
          sectionData.effectiveVolume = Number(sectionData.effectiveVolume)
          sectionData.loadingQuantity20gp = Number(sectionData.loadingQuantity20gp)
          sectionData.loadingQuantity40hc = Number(sectionData.loadingQuantity40hc)
          sectionData.netWeight = Number(sectionData.netWeight)
          sectionData.grossWeight = Number(sectionData.grossWeight)
          break
        case 'seatInner':
        case 'backInner':
          sectionData.thickness = Number(sectionData.thickness)
          sectionData.layersCount = Number(sectionData.layersCount)
          break
        case 'arms':
          sectionData.armHeightFromSeat = Number(sectionData.armHeightFromSeat)
          sectionData.armHeightFromFloor = Number(sectionData.armHeightFromFloor)
          break
        case 'foam':
          sectionData.seatDensity = Number(sectionData.seatDensity)
          sectionData.backDensity = Number(sectionData.backDensity)
          sectionData.seatThickness = Number(sectionData.seatThickness)
          sectionData.backThickness = Number(sectionData.backThickness)
          break
        case 'castors':
          sectionData.pinThickness = Number(sectionData.pinThickness)
          sectionData.wheelDiameter = Number(sectionData.wheelDiameter)
          break
        case 'base':
          sectionData.sizeDiameter = Number(sectionData.sizeDiameter)
          break
        case 'gasLift':
          sectionData.casingLength = Number(sectionData.casingLength)
          sectionData.extensionSize = Number(sectionData.extensionSize)
          sectionData.taper = Number(sectionData.taper)
          break
        case 'mechanism':
          sectionData.leversCount = Number(sectionData.leversCount)
          break
        case 'fittings':
          sectionData.fittingNumber = Number(sectionData.fittingNumber)
          sectionData.quantity = Number(sectionData.quantity)
          break
        case 'upholstery':
          sectionData.usagePerChair = Number(sectionData.usagePerChair)
          break
        case 'images':
          // 图片信息特殊处理，使用 prodId 而不是 productId
          sectionData.prodId = id
          delete sectionData.productId
          break
      }

      console.log('准备保存的数据:', section, sectionData)

      // 根据 section 调用对应的 API
      const apiMap: Record<string, (data: any) => Promise<any>> = {
        packaging: putCartonDetailsUpdate,
        dimensions: putProductDimensionsUpdate,
        logistics: putProductionLogisticsUpdate,
        seatInner: putSeatInnerComponentsUpdate,
        backInner: putBackInnerComponentsUpdate,
        seatOuter: putSeatOuterComponentsUpdate,
        backOuter: putBackOuterComponentsUpdate,
        arms: putArmsUpdate,
        foam: putFoamDetailsUpdate,
        castors: putCastorsUpdate,
        base: putBasesUpdate,
        gasLift: putGasLiftUpdate,
        gasLiftCover: putGasLiftCoverUpdate,
        mechanism: putMechanismUpdate,
        fittings: putFittingsUpdate,
        images: putProductImagesUpdate,
        upholstery: putUpholsteryUpdate
      }

      const apiFunction = apiMap[section]
      if (!apiFunction) {
        throw new Error(`未找到对应的 API 函数: ${section}`)
      }

      await apiFunction(sectionData)
    }

    return true
  } catch (error) {
    console.error('保存失败:', error)
    throw error
  }
}

// 存储临时上传的图片路径，用于取消时删除
const tempUploadedImages = ref<{[key: string]: string[]}>({})

// 修复 updateSingleImage 函数
// 已修复类型错误，确保正确处理API响应中的不同类型的code值
const updateSingleImage = async (sectionKey: string, imageKey: string, val: any[]) => {
  try {
    // 如果没有文件，清空图片路径
    if (!val || val.length === 0) {
      if (formData.value && formData.value[sectionKey]) {
        // 记录原始值，用于取消时恢复
        const originalValue = formData.value[sectionKey][imageKey]
        if (originalValue) {
          // 初始化临时存储
          if (!tempUploadedImages.value[sectionKey]) {
            tempUploadedImages.value[sectionKey] = []
          }
          // 记录被删除的图片路径
          tempUploadedImages.value[sectionKey].push(originalValue)
          console.log('记录需要删除的图片路径:', originalValue)
        }

        // 清空当前值
        formData.value[sectionKey][imageKey] = ''
      }
      return
    }

    const file = val[0]
    // 如果是字符串，说明是已有的图片路径，直接赋值
    if (typeof file === 'string') {
      // 获取原始值
      const originalValue = formData.value[sectionKey][imageKey]

      // 如果原始值存在且与新值不同，记录原始值用于可能的删除
      if (originalValue && originalValue !== file) {
        // 初始化临时存储
        if (!tempUploadedImages.value[sectionKey]) {
          tempUploadedImages.value[sectionKey] = []
        }
        // 记录被替换的图片路径
        tempUploadedImages.value[sectionKey].push(originalValue)
        console.log('记录被替换的图片路径:', originalValue)
      }

      // 检查这个字符串是否是新上传的图片（在newUploads中）
      const newUploads = tempUploadedImages.value['newUploads'] || []
      if (file.startsWith('http') && !newUploads.includes(file)) {
        // 如果是新的http链接但不在newUploads中，也添加到newUploads
        if (!tempUploadedImages.value['newUploads']) {
          tempUploadedImages.value['newUploads'] = []
        }
        tempUploadedImages.value['newUploads'].push(file)
        console.log('记录新的图片URL到newUploads:', file)
      }

      formData.value[sectionKey][imageKey] = file
      return
    }

    // 如果是文件对象，需要上传
    if (file.raw) {
      try {
        console.log('开始上传文件:', file.raw.name)
        // 调用API上传文件
        const response = await postFilesUpload({file: file.raw})
        console.log('文件上传响应:', response)

        // 检查响应状态和数据结构
        let imageUrl = ''

        // 使用类型断言处理响应
        const responseData = response as any

        if (responseData && responseData.data) {
          if (typeof responseData.data === 'string') {
            // 直接返回字符串URL
            imageUrl = responseData.data
          } else if (responseData.code === '200' && responseData.data) {
            // 标准成功响应
            imageUrl = responseData.data
          } else if (responseData.data && responseData.data.data) {
            // 嵌套的data字段
            imageUrl = responseData.data.data
          }
        }

        // 确保获取到了图片URL
        if (!imageUrl) {
          console.error('无法从响应中获取图片URL:', response)
          throw new Error('上传成功但无法获取图片地址')
        }

        // 检查URL长度，防止数据库截断错误
        const MAX_URL_LENGTH = 255 // 数据库字段长度为255
        if (imageUrl.length > MAX_URL_LENGTH) {
          console.warn(`图片URL长度(${imageUrl.length})超过数据库限制(${MAX_URL_LENGTH})，进行截断处理`)
          ElMessage.warning('图片URL过长，已进行截断处理，可能影响图片显示')

          // 截断URL，保留最后的文件名部分
          const urlParts = imageUrl.split('/')
          const fileName = urlParts[urlParts.length - 1]
          const baseUrl = urlParts.slice(0, -1).join('/')

          // 计算可用长度
          const availableLength = MAX_URL_LENGTH - fileName.length - 1 // 减1是为了斜杠

          if (availableLength > 0) {
            // 保留文件名，截断中间部分
            imageUrl = baseUrl.substring(0, availableLength) + '/' + fileName
          } else {
            // 如果文件名都超过限制，则只保留文件名的一部分
            imageUrl = fileName.substring(0, MAX_URL_LENGTH)
          }

          console.log('截断后的URL:', imageUrl)
        }

        // 获取原始值
        const originalValue = formData.value[sectionKey][imageKey]

        // 如果有原始值，记录到临时存储中
        if (originalValue) {
          // 初始化临时存储
          if (!tempUploadedImages.value[sectionKey]) {
            tempUploadedImages.value[sectionKey] = []
          }
          // 记录被替换的图片路径
          tempUploadedImages.value[sectionKey].push(originalValue)
          console.log('记录被替换的图片路径:', originalValue)
        }

        // 更新图片路径
        formData.value[sectionKey][imageKey] = imageUrl

        // 记录新上传的图片路径
        if (!tempUploadedImages.value['newUploads']) {
          tempUploadedImages.value['newUploads'] = []
        }
        tempUploadedImages.value['newUploads'].push(imageUrl)
        console.log('记录新上传的图片到newUploads:', imageUrl)

        ElMessage.success('图片上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        ElMessage.error('图片上传失败')
      }
    }
  } catch (error) {
    console.error('处理图片失败:', error)
    ElMessage.error('处理图片失败')
  }
}

// 修改 handleSave 函数
const handleSave = async (section: string): Promise<void> => {
  try {
    // 保存数据
    await handleSaveData(section)

    // 保存成功后，处理需要删除的图片
    if (tempUploadedImages.value[section] && tempUploadedImages.value[section].length > 0) {
      console.log(`保存成功，开始删除${section}部分记录的需要删除的图片:`, tempUploadedImages.value[section])

      // 删除所有记录的需要删除的图片
      for (const path of tempUploadedImages.value[section]) {
        if (path && path.startsWith('http')) {
          try {
            await getFilesRemove({filePath: path})
            console.log('已从服务器删除图片:', path)
          } catch (error) {
            console.error('从服务器删除图片失败:', error)
          }
        }
      }

      // 清空该部分的临时图片记录
      tempUploadedImages.value[section] = []
    }

    // 如果是图片部分，还需要清理newUploads中的相关记录
    if (section === 'images' && tempUploadedImages.value['newUploads']) {
      // 找出该部分使用的图片
      const usedImages = Object.values(formData.value[section]).filter(val => typeof val === 'string' && val.startsWith('http')) as string[]

      // 从newUploads中移除已保存的图片
      tempUploadedImages.value['newUploads'] = tempUploadedImages.value['newUploads'].filter(path => !usedImages.includes(path))

      console.log('保存后清理临时上传记录，剩余:', tempUploadedImages.value['newUploads'])
    }

    // 保存成功后，更新备份数据
    if (section === 'basic') {
      formDataBackup.value.products = JSON.parse(JSON.stringify(formData.value.products))
    } else {
      formDataBackup.value[section] = JSON.parse(JSON.stringify(formData.value[section]))
    }

    editingSections.value = editingSections.value.filter(s => s !== section)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 修改取消编辑函数
const handleCancel = async (section: string) => {
  try {
    console.log(`取消编辑${section}部分`)

    // 如果是图片部分，需要特殊处理
    if (section === 'images') {
      // 获取当前编辑状态下的图片
      const currentImages = formData.value[section]
      // 获取备份的原始图片
      const originalImages = formDataBackup.value[section]

      // 找出所有需要删除的图片（当前值与原始值不同的图片）
      const imagesToDelete = []

      // 检查每个图片字段
      for (const key in currentImages) {
        if (isImagePath(key)) {
          const currentValue = currentImages[key]
          const originalValue = originalImages[key]

          // 如果当前值与原始值不同，且当前值是http开头的URL，则需要删除
          // 这里不再检查是否在newUploads中，因为我们要删除所有编辑过程中上传的图片
          if (currentValue && currentValue !== originalValue && typeof currentValue === 'string' && currentValue.startsWith('http')) {
            imagesToDelete.push(currentValue)
          }
        }
      }

      console.log(`取消编辑时需要删除的图片:`, imagesToDelete)

      // 删除所有需要删除的图片
      for (const path of imagesToDelete) {
        try {
          await getFilesRemove({filePath: path})
          console.log('已删除编辑过程中上传的图片:', path)
        } catch (error) {
          console.error('删除图片失败:', error)
        }
      }

      // 获取临时上传的图片列表
      const newUploads = tempUploadedImages.value['newUploads'] || []

      // 删除所有临时上传的图片，确保没有遗漏
      for (const path of newUploads) {
        if (path && path.startsWith('http') && !imagesToDelete.includes(path)) {
          try {
            await getFilesRemove({filePath: path})
            console.log('已删除临时上传的图片:', path)
          } catch (error) {
            console.error('删除临时上传图片失败:', error)
          }
        }
      }

      // 清空临时上传列表
      tempUploadedImages.value['newUploads'] = []
    }

    // 恢复数据
    if (section === 'basic') {
      formData.value.products = JSON.parse(JSON.stringify(formDataBackup.value.products))
    } else {
      formData.value[section] = JSON.parse(JSON.stringify(formDataBackup.value[section]))
    }

    // 清空该部分的临时图片记录
    if (tempUploadedImages.value[section]) {
      tempUploadedImages.value[section] = []
    }

    // 移除编辑状态
    editingSections.value = editingSections.value.filter(s => s !== section)

    ElMessage.success('已取消编辑')
  } catch (error) {
    console.error('取消编辑失败:', error)
    ElMessage.error('取消编辑失败')
  }
}

// 添加取消导出函数
const handleCancelExport = () => {
  if (exporting.value && abortController.value) {
    abortController.value.abort('用户取消导出')
    exporting.value = false
    ElMessage.info('导出已取消')
  }
}

// 使用页面数据导出Word文档
const handleExport = async () => {
  exporting.value = true
  try {
    // 初始化AbortController
    abortController.value = new AbortController()
    const signal = abortController.value.signal

    // 确保 ID 存在且为字符串类型
    const productId = formData.value.products.id
    if (!productId) {
      throw new Error('产品ID不能为空')
    }

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    const params = {id: productId}
    const response = await getProductDtoGetById(params)

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    if (!response || !response.data) {
      throw new Error('获取产品数据失败')
    }

    const productData = response.data
    console.log('从API获取的数据:', productData)

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    // 创建适配的数据结构，以匹配exportToWord期望的格式
    const adaptedData = {
      // 基本信息和文件名
      products: productData.products || {},
      product_code: productData.products?.tccode || 'Unknown',

      // TC GROUP INTERNAL USE ONLY 表格所需字段
      initialMonthlyForecast: '', // 使用空字符串代替 'N/A'
      productionColours: '', // 使用空字符串代替 'N/A'
      customerProductCode: '', // 使用空字符串代替 'N/A'
      customerBarcode: '', // 使用空字符串代替 'N/A'
      customerProductName: '', // 使用空字符串代替 'N/A'
      factoryProductName: '', // 使用空字符串代替 'N/A'

      // 使用 TC 相关字段代替默认字段
      tc_code: productData.products?.tccode || '',
      tc_barcode: [productData.products?.barcode1 || '', productData.products?.barcode2 || '', productData.products?.barcode3 || ''].filter(Boolean).join(', '),
      tc_product_name: productData.products?.name || '',
      factory_code: productData.products?.factoryCode || '',

      // seat inner 字段 - 确保所有需要的字段都存在
      seatInner: {
        materialCode: productData.seatInnerComponents?.materialCode || '',
        thickness: String(productData.seatInnerComponents?.thickness || ''),
        layersCount: String(productData.seatInnerComponents?.layersCount || ''),
        dimensions: productData.seatInnerComponents?.dimensions || ''
      },

      // back inner 字段 - 确保所有需要的字段都存在
      backInner: {
        materialCode: productData.backInnerComponents?.materialCode || '',
        thickness: String(productData.backInnerComponents?.thickness || ''),
        layersCount: String(productData.backInnerComponents?.layersCount || ''),
        dimensions: productData.backInnerComponents?.dimensions || ''
      },

      // seat outer 字段 - 确保所有需要的字段都存在
      seatOuter: {
        material: productData.seatOuterComponents?.material || '',
        dimensions: productData.seatOuterComponents?.dimensions || '',
        manufacturerName: productData.seatOuterComponents?.manufacturerName || ''
      },

      // back outer 字段 - 确保所有需要的字段都存在
      backOuter: {
        material: productData.backOuterComponents?.material || '',
        dimensions: productData.backOuterComponents?.dimensions || '',
        manufacturerName: productData.backOuterComponents?.manufacturerName || ''
      },

      // arms 字段 - 确保所有需要的字段都存在
      arms: {
        description: productData.arms?.description || '',
        material: productData.arms?.material || '',
        type: productData.arms?.type || '',
        manufacturer: productData.arms?.manufacturer || '',
        arm_height_from_seat: String(productData.arms?.armHeightFromSeat || ''),
        arm_height_from_floor: String(productData.arms?.armHeightFromFloor || '')
      },

      // foam 字段 - 确保所有需要的字段都存在
      foam: {
        description: productData.foamDetails?.description || '',
        seat_density: String(productData.foamDetails?.seatDensity || ''),
        back_density: String(productData.foamDetails?.backDensity || ''),
        seat_thickness: String(productData.foamDetails?.seatThickness || ''),
        back_thickness: String(productData.foamDetails?.backThickness || '')
      },

      // castors 字段 - 确保所有需要的字段都存在
      castors: {
        description: productData.castors?.description || '',
        pin_thickness: String(productData.castors?.pinThickness || ''),
        wheel_diameter: String(productData.castors?.wheelDiameter || '')
      },

      // base 字段 - 确保所有需要的字段都存在
      base: {
        description: productData.bases?.description || '',
        size_diameter: String(productData.bases?.sizeDiameter || ''),
        material: productData.bases?.material || '',
        type: productData.bases?.type || ''
      },

      // gasLift 字段 - 确保所有需要的字段都存在
      gasLift: {
        description: productData.gasLift?.description || '',
        gasLiftClass: productData.gasLift?.gasLiftClass || '',
        casingLength: String(productData.gasLift?.casingLength || ''),
        extensionSize: String(productData.gasLift?.extensionSize || ''),
        taper: String(productData.gasLift?.taper || '')
      },

      // gasLiftCover 字段 - 确保所有需要的字段都存在
      gasLiftCover: {
        description: productData.gasLiftCover?.description || '',
        material: productData.gasLiftCover?.material || '',
        colour: productData.gasLiftCover?.colour || ''
      },

      // mechanism 字段 - 确保所有需要的字段都存在
      mechanism: {
        description: productData.mechanism?.description || '',
        leversCount: String(productData.mechanism?.leversCount || ''),
        lockingPositions: productData.mechanism?.lockingPositions || '',
        modelNo: productData.mechanism?.modelNo || '',
        supplierName: productData.mechanism?.supplierName || ''
      },

      // fittings 字段 - 确保所有需要的字段都存在
      fittings: {
        fittingNumber: String(productData.fittings?.fittingNumber || ''),
        description: productData.fittings?.description || '',
        quantity: String(productData.fittings?.quantity || ''),
        material: productData.fittings?.material || ''
      },

      // packaging 字段 - 确保所有需要的字段都存在
      packaging: {
        width: String(productData.cartonDetails?.width || ''),
        depth: String(productData.cartonDetails?.depth || ''),
        height: String(productData.cartonDetails?.height || ''),
        boardType: productData.cartonDetails?.boardType || '',
        itemsPerCarton: String(productData.cartonDetails?.itemsPerCarton || ''),
        cartonVolume: String(productData.cartonDetails?.cartonVolume || '')
      },

      // logistics 字段 - 确保字段名与 exportToWord 中的一致
      logistics: {
        production_time: String(productData.productionLogistics?.productionTime || ''),
        effective_volume: String(productData.productionLogistics?.effectiveVolume || ''),
        loading_quantity_20gp: String(productData.productionLogistics?.loadingQuantity20gp || ''),
        loading_quantity_40hc: String(productData.productionLogistics?.loadingQuantity40hc || ''),
        net_weight: String(productData.productionLogistics?.netWeight || ''),
        gross_weight: String(productData.productionLogistics?.grossWeight || '')
      },

      // dimensions 字段 - 确保字段名与 exportToWord 中的一致
      dimensions: {
        seat_width: String(productData.productDimensions?.seatWidth || ''),
        seat_depth: String(productData.productDimensions?.seatDepth || ''),
        back_width: String(productData.productDimensions?.backWidth || ''),
        back_height: String(productData.productDimensions?.backHeight || ''),
        seat_height_min: String(productData.productDimensions?.seatHeightMin || ''),
        seat_height_max: String(productData.productDimensions?.seatHeightMax || ''),
        back_height_from_seat: String(productData.productDimensions?.backHeightFromSeat || ''),
        overall_width: String(productData.productDimensions?.overallWidth || ''),
        overall_depth: String(productData.productDimensions?.overallDepth || ''),
        overall_height_min: String(productData.productDimensions?.overallHeightMin || ''),
        overall_height_max: String(productData.productDimensions?.overallHeightMax || '')
      },

      // upholstery 字段 - 确保所有需要的字段都存在
      upholstery: {
        fabricManufacturer: productData.upholstery?.fabricManufacturer || '',
        colourCode: productData.upholstery?.colourCode || '',
        leatherGrade: productData.upholstery?.leatherGrade || '',
        usagePerChair: String(productData.upholstery?.usagePerChair || '')
      },

      // 图片数据特殊处理：将驼峰命名的字段名转换为下划线格式
      images: {
        front_img_path: productData.productImages?.frontImgPath || '',
        side_img_path: productData.productImages?.sideImgPath || '',
        back_view_path: productData.productImages?.backImgPath || '',
        angle_view_path: productData.productImages?.angleImgPath || ''
      },

      // 添加一个标记，表示这不是批量导出
      is_batch_export: false
    }

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    console.log('适配后的导出数据:', adaptedData)
    await exportToWord(adaptedData)

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
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

// 格式化部分标题
const formatSectionTitle = (key: string): string => {
  const titles: Record<string, string> = {
    upholstery: '面料信息',
    packaging: '包装信息',
    logistics: '物流信息',
    dimensions: '产品尺寸',
    seatInner: '座椅内部结构',
    backInner: '背部内部结构',
    backOuter: '背部外部结构',
    seatOuter: '座椅外部结构',
    arms: '扶手信息',
    foam: '泡棉信息',
    castors: '脚轮信息',
    base: '底座信息',
    gasLift: '气压棒信息',
    gasLiftCover: '气压罩信息',
    mechanism: '机构信息',
    fittings: '配件信息',
    images: '产品图片'
  }
  return titles[key] || key
}

// 添加图片展示的特殊处理
const isImagePath = (key: string): boolean => {
  return key.includes('ImgPath') || key.includes('ViewPath')
}

// 添加预览相关的响应式变量
const showImageViewer = ref(false)
const previewImageUrl = ref('')

// 添加图片预览处理函数
const handlePreviewImage = (imageUrl: string) => {
  previewImageUrl.value = imageUrl
  showImageViewer.value = true
}

// 确保组件可以被正确导入
defineOptions({
  name: 'ProdInfo'
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
