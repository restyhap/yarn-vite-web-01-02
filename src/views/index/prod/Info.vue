<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-02 10:00:52
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
              <el-button type="primary" :loading="exporting" @click="handleExport" class="min-w-[120px]">
                <el-icon>
                  <Document />
                </el-icon>
                {{ exporting ? '导出中...' : '导出文档' }}
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
  products: {} as Products,
  packaging: {} as CartonDetails,
  dimensions: {} as ProductDimensions,
  logistics: {} as ProductionLogistics,
  seatInner: {} as SeatInnerComponents,
  backInner: {} as BackInnerComponents,
  backOuter: {} as BackOuterComponents,
  seatOuter: {} as SeatOuterComponents,
  arms: {} as Arms,
  foam: {} as FoamDetails,
  castors: {} as Castors,
  base: {} as Bases,
  gasLift: {} as GasLift,
  gasLiftCover: {} as GasLiftCover,
  mechanism: {} as Mechanism,
  fittings: {} as Fittings,
  images: {} as ProductImages,
  upholstery: {} as Upholstery
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
      const responseData = response as any

      // 使用接口类型优化数据处理
      formData.value = {
        products: {
          ...((responseData.products || {}) as Products)
        },
        packaging: {
          ...((responseData.cartonDetails || {}) as CartonDetails)
        },
        dimensions: {
          ...((responseData.productDimensions || {}) as ProductDimensions)
        },
        logistics: {
          ...((responseData.productionLogistics || {}) as ProductionLogistics)
        },
        seatInner: {
          ...((responseData.seatInnerComponents || {}) as SeatInnerComponents)
        },
        backInner: {
          ...((responseData.backInnerComponents || {}) as BackInnerComponents)
        },
        backOuter: {
          ...((responseData.backOuterComponents || {}) as BackOuterComponents)
        },
        seatOuter: {
          ...((responseData.seatOuterComponents || {}) as SeatOuterComponents)
        },
        arms: {
          ...((responseData.arms || {}) as Arms)
        },
        foam: {
          ...((responseData.foamDetails || {}) as FoamDetails)
        },
        castors: {
          ...((responseData.castors || {}) as Castors)
        },
        base: {
          ...((responseData.bases || {}) as Bases)
        },
        gasLift: {
          ...((responseData.gasLift || {}) as GasLift)
        },
        gasLiftCover: {
          ...((responseData.gasLiftCover || {}) as GasLiftCover)
        },
        mechanism: {
          ...((responseData.mechanism || {}) as Mechanism)
        },
        fittings: {
          ...((responseData.fittings || {}) as Fittings)
        },
        images: {
          ...(responseData.productImages || {}),
          prodId: responseData.productImages?.productId || ''
        } as ProductImages,
        upholstery: {
          ...((responseData.upholstery || {}) as Upholstery)
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

          // 确保所有图片路径都有效
          for (const key in sectionData) {
            if (isImagePath(key) && (!sectionData[key] || sectionData[key] === '')) {
              delete sectionData[key] // 删除空的图片路径，避免覆盖已有的值
            } else if (isImagePath(key)) {
              console.log(`保存图片路径 ${key}: ${sectionData[key]}`)

              // 验证URL是否有效
              if (typeof sectionData[key] === 'string' && !sectionData[key].startsWith('http')) {
                console.warn(`发现无效的图片URL: ${key}=${sectionData[key]}，将删除此字段`)
                delete sectionData[key]
              }
            }
          }

          // 确保至少有一个有效的图片路径
          const hasValidImage = Object.keys(sectionData).some(key => isImagePath(key) && sectionData[key] && typeof sectionData[key] === 'string')

          if (!hasValidImage) {
            console.warn('没有找到有效的图片路径，可能会保存失败')
          }
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
        imageUrl = response as any

        // 确保获取到了图片URL
        if (!imageUrl) {
          console.error('无法从响应中获取图片URL:', response)
          throw new Error('上传成功但无法获取图片地址')
        }

        // 确保URL是字符串并以http开头
        if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
          console.error('返回的不是有效的图片URL:', imageUrl)
          throw new Error('服务器返回的图片地址无效')
        }

        console.log('成功获取到图片URL:', imageUrl)

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
    console.log(`开始保存${section}部分数据`)

    // 如果是images部分，添加特殊处理逻辑
    if (section === 'images') {
      console.log('保存图片数据，当前图片信息:', formData.value.images)
    }

    // 保存数据
    await handleSaveData(section)
    console.log(`${section}部分数据保存成功`)

    // 保存成功后，处理需要删除的图片
    if (tempUploadedImages.value[section] && tempUploadedImages.value[section].length > 0) {
      console.log(`保存成功，开始删除${section}部分记录的需要删除的图片:`, tempUploadedImages.value[section])

      // 删除所有记录的需要删除的图片
      for (const path of tempUploadedImages.value[section]) {
        if (path && path.startsWith('http')) {
          try {
            console.log('准备删除图片:', path)
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
      console.log('保存后使用的图片:', usedImages)

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
    if (section === 'images') {
      console.error('图片保存失败，当前图片数据:', formData.value.images)
    }
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
      const deletePromises = []
      for (const path of imagesToDelete) {
        try {
          // 将删除操作添加到Promise数组，但不等待
          deletePromises.push(
            getFilesRemove({filePath: path})
              .then(() => console.log('已删除编辑过程中上传的图片:', path))
              .catch(error => console.error('删除图片失败:', error))
          )
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
            // 将删除操作添加到Promise数组，但不等待
            deletePromises.push(
              getFilesRemove({filePath: path})
                .then(() => console.log('已删除临时上传的图片:', path))
                .catch(error => console.error('删除临时上传图片失败:', error))
            )
          } catch (error) {
            console.error('删除临时上传图片失败:', error)
          }
        }
      }

      // 等待所有删除操作完成（但不阻塞UI恢复）
      Promise.allSettled(deletePromises).then(results => {
        const successCount = results.filter(r => r.status === 'fulfilled').length
        const failCount = results.filter(r => r.status === 'rejected').length
        console.log(`图片删除操作完成: 成功=${successCount}, 失败=${failCount}`)

        if (failCount > 0) {
          // 如果有删除失败的图片，显示警告
          ElMessage.warning(`有${failCount}张图片可能未能成功从服务器删除`)
        }
      })

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
    const signal = abortController.value?.signal

    // 确保 ID 存在且为字符串类型
    const productId = formData.value.products.id
    if (!productId) {
      throw new Error('产品ID不能为空')
    }

    // 检查是否取消
    if (signal?.aborted) {
      return
    }

    console.log('开始获取产品数据，ID:', productId)
    let response

    try {
      const params = {id: productId}
      const result = await getProductDtoGetById(params)

      response = result
      console.log('处理后的ProductDto数据:', response)
    } catch (error) {
      console.error('获取产品数据出错:', error)
      throw new Error('获取产品数据失败')
    }

    // 检查是否取消
    if (signal?.aborted) {
      return
    }

    // 直接将ProductDto数据传递给exportToWord函数
    console.log('开始生成Word文档...')
    try {
      await exportToWord(response)
      ElMessage.success('导出成功')
    } catch (error) {
      console.error('生成Word文档出错:', error)
      throw new Error('生成Word文档失败')
    }
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
