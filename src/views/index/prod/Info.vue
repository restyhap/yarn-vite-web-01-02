<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-02-27 17:59:01
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="info-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </template>

      <template #default>
        <div class="content-wrapper">
          <!-- 顶部操作栏 -->
          <div class="top-actions">
            <div class="left-actions">
              <h2 class="page-title">产品规格详情</h2>
            </div>
            <div class="right-actions">
              
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

          <div class="tables-container">
            <!-- 基本信息表 -->
            <div class="table-section" :class="{ 'editing': editingSections.includes('basic') }">
              <div class="section-header">
                <h2>基本信息</h2>
                <div class="actions">
                  <template v-if="editingSections.includes('basic')">
                    <el-button type="success" @click="handleSave('basic')">
                      <el-icon><Check /></el-icon>
                      保存
                    </el-button>
                    <el-button type="danger" @click="handleCancel('basic')">
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
                </div>
              </div>

              <el-form :model="formData.products" label-width="120px">
                <div class="form-grid">
                  <el-form-item v-for="(label, key) in basicFields"
                                :key="key"
                                :label="label">
                    <template v-if="editingSections.includes('basic')">
                      <el-input v-model="formData.products[key]" />
                    </template>
                    <template v-else>
                      {{ formData.products[key] || '-' }}
                    </template>
                  </el-form-item>
                </div>
              </el-form>
            </div>

            <!-- 其他表格 -->
            <div v-for="(section, sectionKey) in specSections"
                 :key="sectionKey"
                 class="table-section"
                 :class="{ 'editing': editingSections.includes(String(sectionKey)) }">
              <div class="section-header">
                <h2>{{ formatSectionTitle(String(sectionKey)) }}</h2>
                <div class="actions">
                  <template v-if="editingSections.includes(String(sectionKey))">
                    <el-button type="success" @click="handleSave(String(sectionKey))">
                      <el-icon><Check /></el-icon>
                      保存
                    </el-button>
                    <el-button type="danger" @click="handleCancel(String(sectionKey))">
                      <el-icon><Close /></el-icon>
                      取消
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button type="primary" @click="handleEdit(String(sectionKey))">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-button>
                  </template>
                </div>
              </div>

              <el-form :model="formData[sectionKey]" label-width="120px">
                <div class="form-grid">
                  <el-form-item 
                    v-for="(field, key) in section"
                    :key="key"
                    :label="field"
                    :class="{ 'image-form-item': isImagePath(key) }"
                  >
                    <template v-if="isImagePath(key)">
                      <ImageHandler
                        v-model="formData[sectionKey][key]"
                        :alt="field"
                        :editable="editingSections.includes(String(sectionKey))"
                        @temp-file="handleTempFile"
                      />
                    </template>
                    <template v-else>
                      <template v-if="editingSections.includes(String(sectionKey))">
                        <el-input v-model="formData[sectionKey][key]" />
                      </template>
                      <template v-else>
                        {{ formData[sectionKey]?.[key] || '-' }}
                      </template>
                    </template>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close, Picture, Back, ZoomIn, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportToWord } from '../../../utils/exportToWord'
import { getProductDTOById, saveData } from '@/api/product'
import type { Product, CartonDetail, ProductDimension, ProductionLogistics, SeatInnerComponent, BackInnerComponent, BackOuterComponent, SeatOuterComponent, Arm, FoamDetail, Castor, Base, GasLift, GasLiftCover, Mechanism, Fitting, ProductImage, Upholstery } from '@/api/product.d'
import { ElImageViewer } from 'element-plus'
import ImageHandler from '@/components/ImageHandler.vue'
import http from '@/axios'

interface FormData {
  products: Product;
  packaging: CartonDetail;
  dimensions: ProductDimension;
  logistics: ProductionLogistics;
  seatInner: SeatInnerComponent;
  backInner: BackInnerComponent;
  backOuter: BackOuterComponent;
  seatOuter: SeatOuterComponent;
  arms: Arm;
  foam: FoamDetail;
  castors: Castor;
  base: Base;
  gasLift: GasLift;
  gasLiftCover: GasLiftCover;
  mechanism: Mechanism;
  fittings: Fitting;
  images: ProductImage;
  upholstery: Upholstery;
  [key: string]: any;
}

interface BasicField {
  [key: string]: string;
  tccode: string;
  supplier: string;
  supplierCode: string;
  supplierName: string;
  fireStandard: string;
  fob20ContainerPrice: string;
  fob40ContainerPrice: string;
  shippingPort: string;
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
const exporting = ref(false)
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
    const response = await getProductDTOById(id)
    
    if (response?.data) {
      console.log('获取到的产品数据:', response.data)
      // 重新组织数据结构
      const data = response.data
      formData.value = {
        ...formData.value,
        products: {
          id: data.products?.id || '',
          tccode: data.products?.tccode || '',
          supplier: data.products?.supplier || '',
          supplierCode: data.products?.supplierCode || '',
          supplierName: data.products?.supplierName || '',
          fireStandard: data.products?.fireStandard || '',
          fob20ContainerPrice: Number(data.products?.fob20ContainerPrice) || 0,
          fob40ContainerPrice: Number(data.products?.fob40ContainerPrice) || 0,
          shippingPort: data.products?.shippingPort || ''
        },
        packaging: {
          id: data.cartonDetails?.id || '',
          productId: data.cartonDetails?.productId || '',
          width: Number(data.cartonDetails?.width) || 0,
          depth: Number(data.cartonDetails?.depth) || 0,
          height: Number(data.cartonDetails?.height) || 0,
          boardType: data.cartonDetails?.boardType || '',
          itemsPerCarton: Number(data.cartonDetails?.itemsPerCarton) || 0,
          cartonVolume: Number(data.cartonDetails?.cartonVolume) || 0
        },
        dimensions: {
          id: data.productDimensions?.id || '',
          productId: data.productDimensions?.productId || '',
          seatWidth: data.productDimensions?.seatWidth || 0,
          seatDepth: data.productDimensions?.seatDepth || 0,
          seatHeightMin: data.productDimensions?.seatHeightMin || 0,
          seatHeightMax: data.productDimensions?.seatHeightMax || 0,
          backWidth: data.productDimensions?.backWidth || 0,
          backHeight: data.productDimensions?.backHeight || 0,
          backHeightFromSeat: data.productDimensions?.backHeightFromSeat || 0,
          overallWidth: data.productDimensions?.overallWidth || 0,
          overallDepth: data.productDimensions?.overallDepth || 0,
          overallHeightMin: data.productDimensions?.overallHeightMin || 0,
          overallHeightMax: data.productDimensions?.overallHeightMax || 0
        },
        logistics: {
          id: data.productionLogistics?.id || '',
          productId: data.productionLogistics?.productId || '',
          productionTime: data.productionLogistics?.productionTime || 0,
          effectiveVolume: data.productionLogistics?.effectiveVolume || 0,
          loadingQuantity20gp: data.productionLogistics?.loadingQuantity20gp || 0,
          loadingQuantity40hc: data.productionLogistics?.loadingQuantity40hc || 0,
          netWeight: data.productionLogistics?.netWeight || 0,
          grossWeight: data.productionLogistics?.grossWeight || 0
        },
        seatInner: {
          id: data.seatInnerComponents?.id || '',
          productId: data.seatInnerComponents?.productId || '',
          materialCode: data.seatInnerComponents?.materialCode || '',
          thickness: data.seatInnerComponents?.thickness || 0,
          layersCount: data.seatInnerComponents?.layersCount || 0,
          dimensions: data.seatInnerComponents?.dimensions || ''
        },
        backInner: {
          id: data.backInnerComponents?.id || '',
          productId: data.backInnerComponents?.productId || '',
          materialCode: data.backInnerComponents?.materialCode || '',
          thickness: data.backInnerComponents?.thickness || 0,
          layersCount: data.backInnerComponents?.layersCount || 0,
          dimensions: data.backInnerComponents?.dimensions || ''
        },
        backOuter: {
          id: data.backOuterComponents?.id || '',
          productId: data.backOuterComponents?.productId || '',
          material: data.backOuterComponents?.material || '',
          dimensions: data.backOuterComponents?.dimensions || '',
          manufacturerName: data.backOuterComponents?.manufacturerName || ''
        },
        seatOuter: {
          id: data.seatOuterComponents?.id || '',
          productId: data.seatOuterComponents?.productId || '',
          material: data.seatOuterComponents?.material || '',
          dimensions: data.seatOuterComponents?.dimensions || '',
          manufacturerName: data.seatOuterComponents?.manufacturerName || ''
        },
        arms: {
          id: data.arms?.id || '',
          productId: data.arms?.productId || '',
          material: data.arms?.material || '',
          type: data.arms?.type || '',
          manufacturer: data.arms?.manufacturer || '',
          description: data.arms?.description || '',
          armHeightFromSeat: data.arms?.armHeightFromSeat || 0,
          armHeightFromFloor: data.arms?.armHeightFromFloor || 0
        },
        foam: {
          id: data.foamDetails?.id || '',
          productId: data.foamDetails?.productId || '',
          description: data.foamDetails?.description || '',
          seatDensity: data.foamDetails?.seatDensity || 0,
          backDensity: data.foamDetails?.backDensity || 0,
          seatThickness: data.foamDetails?.seatThickness || 0,
          backThickness: data.foamDetails?.backThickness || 0
        },
        castors: {
          id: data.castors?.id || '',
          productId: data.castors?.productId || '',
          description: data.castors?.description || '',
          pinThickness: data.castors?.pinThickness || 0,
          wheelDiameter: data.castors?.wheelDiameter || 0
        },
        base: {
          id: data.bases?.id || '',
          productId: data.bases?.productId || '',
          description: data.bases?.description || '',
          sizeDiameter: data.bases?.sizeDiameter || 0,
          material: data.bases?.material || '',
          type: data.bases?.type || ''
        },
        gasLift: {
          id: data.gasLift?.id || '',
          productId: data.gasLift?.productId || '',
          description: data.gasLift?.description || '',
          gasLiftClass: data.gasLift?.gasLiftClass || '',
          casingLength: data.gasLift?.casingLength || 0,
          extensionSize: data.gasLift?.extensionSize || 0,
          taper: data.gasLift?.taper || 0
        },
        gasLiftCover: {
          id: data.gasLiftCover?.id || '',
          productId: data.gasLiftCover?.productId || '',
          description: data.gasLiftCover?.description || '',
          material: data.gasLiftCover?.material || '',
          colour: data.gasLiftCover?.colour || ''
        },
        mechanism: {
          id: data.mechanism?.id || '',
          productId: data.mechanism?.productId || '',
          description: data.mechanism?.description || '',
          leversCount: data.mechanism?.leversCount || 0,
          lockingPositions: data.mechanism?.lockingPositions || '',
          modelNo: data.mechanism?.modelNo || '',
          supplierName: data.mechanism?.supplierName || ''
        },
        fittings: {
          id: data.fittings?.id || '',
          productId: data.fittings?.productId || '',
          fittingNumber: data.fittings?.fittingNumber || 0,
          description: data.fittings?.description || '',
          quantity: data.fittings?.quantity || 0,
          material: data.fittings?.material || ''
        },
        images: {
          id: data.productImages?.id || '',
          prodId: data.productImages?.productId || '',
          frontImgPath: data.productImages?.frontImgPath || '',
          sideImgPath: data.productImages?.sideImgPath || '',
          backImgPath: data.productImages?.backImgPath || '',
          angleImgPath: data.productImages?.angleImgPath || ''
        },
        upholstery: {
          id: data.upholstery?.id || '',
          productId: data.upholstery?.productId || '',
          fabricManufacturer: data.upholstery?.fabricManufacturer || '',
          colourCode: data.upholstery?.colourCode || '',
          leatherGrade: data.upholstery?.leatherGrade || '',
          usagePerChair: Number(data.upholstery?.usagePerChair) || 0
        }
      }
      // 创建数据备份
      formDataBackup.value = JSON.parse(JSON.stringify(formData.value))
    } else {
      console.warn('未获取到产品数据')
      ElMessage.warning('未找到产品数据')
      formData.value = {
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
      }
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
    formData.value = {
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
    }
  } finally {
    loading.value = false
  }
}

// 处理编辑按钮点击
const handleEdit = (section: string): void => {
  console.log('编辑按钮被点击:', section)
  // 创建当前部分的数据备份
  if (section === 'basic') {
    formDataBackup.value = {
      ...formDataBackup.value,
      products: JSON.parse(JSON.stringify(formData.value.products || {}))
    }
  } else {
    formDataBackup.value[section] = JSON.parse(JSON.stringify(formData.value[section] || {}))
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
      // 调用 API 的 saveData 函数，使用 'products' 作为 section
      await saveData('products', sectionData)
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
      await saveData(section, sectionData)
    }
    
    return true
  } catch (error) {
    console.error('保存失败:', error)
    throw error
  }
}

// 修改 handleSave 函数
const handleSave = async (section: string): Promise<void> => {
  try {
    // 获取该部分所有图片字段的当前值和备份值
    const currentData = formData.value[section]
    const backupData = formDataBackup.value[section]
    
    // 找出所有需要从服务器删除的图片
    for (const key in backupData) {
      if (isImagePath(key)) {
        const currentPath = currentData[key]
        const backupPath = backupData[key]
        
        // 如果备份中有图片但当前没有，说明是被删除的，需要从服务器删除
        if (backupPath && !currentPath) {
          try {
            await http.get(`/files/remove?filePath=${backupPath}`)
          } catch (error) {
            console.error('删除服务器图片失败:', error)
          }
        }
      }
    }

    // 保存数据
    await handleSaveData(section)
    
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

// 存储临时文件路径
const tempFiles = ref<string[]>([])

// 处理临时文件
const handleTempFile = (filePath: string) => {
  tempFiles.value.push(filePath)
}

// 修改取消编辑函数
const handleCancel = async (section: string) => {
  try {
    if (section === 'images') {
      // 图片部分的处理
      const currentData = formData.value[section]
      const backupData = formDataBackup.value[section]
      
      // 找出所有需要删除的临时上传图片
      for (const key in currentData) {
        if (isImagePath(key)) {
          const currentPath = currentData[key]
          const backupPath = backupData[key]
          
          // 如果当前有图片但与备份不同，说明是临时上传的，需要删除
          if (currentPath && currentPath !== backupPath) {
            await http.get(`/files/remove?filePath=${currentPath}`)
          }
        }
      }
    }
    
    // 恢复原始数据
    if (section === 'basic') {
      formData.value.products = JSON.parse(JSON.stringify(formDataBackup.value.products))
    } else {
      formData.value[section] = JSON.parse(JSON.stringify(formDataBackup.value[section]))
    }
    
    editingSections.value = editingSections.value.filter(s => s !== section)
    ElMessage.success('已取消编辑')
  } catch (error) {
    console.error('取消编辑失败:', error)
    ElMessage.error('取消编辑失败')
  }
}

// 使用页面数据导出Word文档
const handleExport = async () => {
  exporting.value = true
  try {
    // 直接使用页面上的数据
    console.log('导出数据:', formData.value)
    await exportToWord(formData.value)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
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

// 修改 handleImageDelete 函数，移除确认对话框
const handleImageDelete = async (sectionKey: string, imageKey: string) => {
  try {
    // 清空对应的图片路径
    formData.value[sectionKey][imageKey] = ''
    // 自动保存更改
    await handleSaveData(sectionKey)
    ElMessage.success('图片删除成功')
  } catch (error) {
    console.error('删除图片失败:', error)
    ElMessage.error('删除图片失败')
  }
}

// 添加图片上传处理函数
const handleImageUpload = async (sectionKey: string, imageKey: string, file: File) => {
  try {
    // 创建 FormData
    const formData = new FormData()
    formData.append('file', file)

    // 调用上传 API
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('上传失败')
    }

    const result = await response.json()
    if (result.code === 200) {
      // 更新图片路径
      formData.value[sectionKey][imageKey] = result.data
      // 自动保存更改
      await handleSaveData(sectionKey)
      ElMessage.success('上传成功')
    } else {
      throw new Error(result.message || '上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}
</script>

<style scoped>
:root {
  --page-background: #f5f7fa;  /* 页面背景色 */
  --section-background: #ffffff;  /* 表格区域背景色 */
  --section-header-background: #ffffff;  /* 表格头部背景色 */
  --section-editing-background: #fafcff;  /* 编辑状态背景色 */
}

.info-container {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  background: var(--page-background);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 10px;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

/* 基本信息表占据整行 */
.table-section:first-child {
  grid-column: 1 / -1;
}

.table-section {
  background: var(--section-background);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  width: 100%;
  margin-bottom: 24px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.table-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.15s ease;
}

.section-header h2 {
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
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 表单布局样式 */
:deep(.el-form) {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 修改为4列布局，更适合图片展示 */
  gap: 20px;
  width: 100%;
}

/* 修改表单项样式 */
:deep(.el-form-item) {
  margin: 0;
  width: 100%;
  display: flex;
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
  border-right: none;
  border-radius: 4px 0 0 4px;
  width: 38% !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
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

.table-section.editing .section-header h2 {
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

/* 移除之前的flex布局相关样式 */
:deep(.el-row) {
  display: none;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

/* 响应式布局 */
@media screen and (max-width: 1600px) {
  .form-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* 图片预览查看器样式 */
:deep(.el-image-viewer__wrapper) {
  z-index: 2100;
}

/* 针对图片模块的特殊布局 */
.table-section:has(.image-form-item) .form-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

/* 添加图片表单项的特殊样式 */
:deep(.image-form-item) {
  flex: 1;
  min-width: 0;
  flex-direction: column !important;
  align-items: center;
}

:deep(.image-form-item .el-form-item__label) {
  text-align: center;
  width: 100% !important;
  justify-content: center;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  font-size: 13px;
  white-space: nowrap;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
}

:deep(.image-form-item .el-form-item__content) {
  width: 100% !important;
  margin-left: 0 !important;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  height: 200px;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  :deep(.image-form-item .el-form-item__content) {
    aspect-ratio: 4/3; /* 在较小屏幕上调整宽高比 */
  }
}

@media screen and (max-width: 1200px) {
  .table-section:has(.image-form-item) .form-grid {
    flex-wrap: wrap; /* 在更小的屏幕上允许换行 */
  }
  
  :deep(.image-form-item) {
    flex: 0 0 calc(50% - 10px); /* 每行两张图片 */
  }
}

@media screen and (max-width: 768px) {
  :deep(.image-form-item) {
    flex: 0 0 100%; /* 在移动端每行一张图片 */
  }
}
</style>
