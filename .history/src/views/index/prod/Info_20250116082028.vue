<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 08:19:42
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="info-container">
        <el-skeleton :loading="loading" animated>
          <template #template>
        <!-- 骨架屏模板 -->
        <div style="padding: 20px">
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
            </div>
          </template>
          
          <template #default>
        <!-- 基本信息 -->
        <div class="section">
          <div class="section-header">
            <h2>基本信息</h2>
            <div class="actions">
              <el-button v-if="editingSection !== 'basic'" type="primary" @click="handleEdit('basic')">
                <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
              <template v-else>
                <el-button type="success" @click="handleSave('basic')">
                  <el-icon><Check /></el-icon>
                          保存
                        </el-button>
                <el-button type="danger" @click="handleCancel('basic')">
                  <el-icon><Close /></el-icon>
                          取消
                        </el-button>
                      </template>
                  </div>
                </div>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="TC Code">
              {{ formatProductValue('tccode') }}
                      </el-descriptions-item>
            <el-descriptions-item label="Supplier">
              {{ formatProductValue('supplier') }}
                      </el-descriptions-item>
            <el-descriptions-item label="Supplier Code">
              {{ formatProductValue('supplier_code') }}
                      </el-descriptions-item>
            <el-descriptions-item label="Supplier Name">
              {{ formatProductValue('supplier_name') }}
                      </el-descriptions-item>
            <el-descriptions-item label="Fire Standard">
              {{ formatProductValue('fire_standard') }}
                      </el-descriptions-item>
            <el-descriptions-item label="Shipping Port">
              {{ formatProductValue('shipping_port') }}
                      </el-descriptions-item>
            <el-descriptions-item label="FOB 20' Container Price">
              {{ formatProductValue('fob_20_container_price', true) }}
                      </el-descriptions-item>
            <el-descriptions-item label="FOB 40'HC Container Price">
              {{ formatProductValue('fob_40_container_price', true) }}
                      </el-descriptions-item>
                    </el-descriptions>
                </div>

        <!-- 规格表信息 -->
        <div v-for="(section, sectionKey) in specTables" :key="sectionKey" class="section">
          <div class="section-header">
            <h2>{{ sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1) }}</h2>
            <div class="actions">
              <el-button v-if="editingSection !== sectionKey" type="primary" @click="handleEdit(sectionKey)">
                <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
              <template v-else>
                <el-button type="success" @click="handleSave(sectionKey)">
                  <el-icon><Check /></el-icon>
                          保存
                        </el-button>
                <el-button type="danger" @click="handleCancel(sectionKey)">
                  <el-icon><Close /></el-icon>
                          取消
                        </el-button>
                      </template>
                  </div>
                </div>

          <el-descriptions :column="2" border>
            <template v-for="field in Object.keys(section)" :key="field">
              <el-descriptions-item :label="field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')">
                {{ formatSpecValue(sectionKey, field) }}
                      </el-descriptions-item>
                      </template>
                    </el-descriptions>
                </div>

        <!-- 导出按钮 -->
        <div class="actions">
          <el-button type="primary" @click="exportToWord">
            <el-icon><Document /></el-icon>
            导出Word文档
                      </el-button>
            </div>
          </template>
        </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, reactive, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Back, Document, Edit, Check, Close} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  VerticalAlign
} from 'docx'
import {saveAs} from 'file-saver'

const route = useRoute()
const router = useRouter()

// 添加加载状态
const loading = ref(true)

interface ProductInfo {
  id?: string
  tccode: string
  supplier: string
  supplier_code: string
  supplier_name: string
  fire_standard: string
  shipping_port: string
  fob_20_container_price: string
  fob_40_container_price: string
  [key: string]: string | undefined
}

interface SpecTableItem {
  [key: string]: string | undefined
}

interface UpholsterySpec extends SpecTableItem {
  fabric_manufacturer?: string
  colour_code?: string
  leather_grade?: string
  usage_per_chair?: string
}

interface CartonSpec extends SpecTableItem {
  width?: string
  depth?: string
  height?: string
  board_type?: string
  items_per_carton?: string
  carton_volume?: string
}

interface LogisticsSpec extends SpecTableItem {
  production_time?: string
  effective_volume?: string
  loading_quantity_20gp?: string
  loading_quantity_40hc?: string
  net_weight?: string
  gross_weight?: string
}

interface DimensionsSpec extends SpecTableItem {
  seat_width?: string
  seat_depth?: string
  seat_height_min?: string
  seat_height_max?: string
  back_width?: string
  back_height?: string
  back_height_from_seat?: string
  overall_width?: string
  overall_depth?: string
  overall_height_min?: string
  overall_height_max?: string
}

interface SeatInnerSpec extends SpecTableItem {
  material_code?: string
  thickness?: string
  layers_count?: string
  dimensions?: string
}

interface BackInnerSpec extends SpecTableItem {
  material_code?: string
  thickness?: string
  layers_count?: string
  dimensions?: string
}

interface BackOuterSpec extends SpecTableItem {
  material?: string
  dimensions?: string
  manufacturer_name?: string
}

interface SeatOuterSpec extends SpecTableItem {
  material?: string
  dimensions?: string
  manufacturer_name?: string
}

interface ArmsSpec extends SpecTableItem {
  material?: string
  type?: string
  manufacturer?: string
  description?: string
  arm_height_from_seat?: string
  arm_height_from_floor?: string
}

interface FoamSpec extends SpecTableItem {
  description?: string
  seat_density?: string
  back_density?: string
  seat_thickness?: string
  back_thickness?: string
}

interface CastorsSpec extends SpecTableItem {
  description?: string
  pin_thickness?: string
  wheel_diameter?: string
}

interface BaseSpec extends SpecTableItem {
  description?: string
  size_diameter?: string
  material?: string
  type?: string
}

interface GasLiftSpec extends SpecTableItem {
  description?: string
  gas_lift_class?: string
  casing_length?: string
  extension_size?: string
  taper?: string
}

interface GasLiftCoverSpec extends SpecTableItem {
  description?: string
  material?: string
  colour?: string
}

interface MechanismSpec extends SpecTableItem {
  description?: string
  levers_count?: string
  locking_positions?: string
  model_no?: string
  supplier_name?: string
}

interface FittingsSpec extends SpecTableItem {
  fitting_number?: string
  description?: string
  quantity?: string
  material?: string
}

interface SpecTables {
  upholstery: UpholsterySpec
  carton: CartonSpec
  logistics: LogisticsSpec
  dimensions: DimensionsSpec
  seatInner: SeatInnerSpec
  backInner: BackInnerSpec
  backOuter: BackOuterSpec
  seatOuter: SeatOuterSpec
  arms: ArmsSpec
  foam: FoamSpec
  castors: CastorsSpec
  base: BaseSpec
  gasLift: GasLiftSpec
  gasLiftCover: GasLiftCoverSpec
  mechanism: MechanismSpec
  fittings: FittingsSpec
}

const productInfo = reactive<ProductInfo>({
  tccode: '',
  supplier: '',
  supplier_code: '',
  supplier_name: '',
  fire_standard: '',
  shipping_port: '',
  fob_20_container_price: '',
  fob_40_container_price: ''
})

const specTables = reactive<SpecTables>({
  upholstery: {},
  carton: {},
  logistics: {},
  dimensions: {},
  seatInner: {},
  backInner: {},
  backOuter: {},
  seatOuter: {},
  arms: {},
  foam: {},
  castors: {},
  base: {},
  gasLift: {},
  gasLiftCover: {},
  mechanism: {},
  fittings: {}
})

const editingSection = ref('')
const editForm = reactive<Record<string, any>>({})

// 辅助函数
const getSpecValue = (section: keyof SpecTables, field: string): string | undefined => {
  const table = specTables[section]
  return table[field.toLowerCase().replace(/\s/g, '_')]
}

const getProductValue = (field: string): string | undefined => {
  const key = field.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')
  return productInfo[key]
}

const formatSpecValue = (section: keyof SpecTables, field: string, unit?: string): string => {
  const value = getSpecValue(section, field)
  return value ? (unit ? `${value}${unit}` : value) : 'N/A'
}

const formatProductValue = (field: string, isPrice = false): string => {
  const value = getProductValue(field)
  return value ? (isPrice ? `¥${value}` : value) : 'N/A'
}

// 计算属性用于模板中的动态访问
const getProductInfoField = computed(() => {
  return (field: string) => {
    const key = field.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')
    return productInfo[key]
  }
})

// 定义所有表格的配置
const sections = [
  {
    key: 'upholstery',
    title: '面料信息',
    fields: [
      {key: 'fabric_manufacturer', label: '面料制造商'},
      {key: 'colour_code', label: '颜色代码'},
      {key: 'leather_grade', label: '皮革等级'},
      {key: 'usage_per_chair', label: '每把椅子用料', unit: 'm²'}
    ]
  },
  // ... 其他表格配置
]

// 开始编辑
const handleEdit = (section: keyof SpecTables | 'basic') => {
  editingSection.value = section
  const sourceData = section === 'basic' ? productInfo : specTables[section]
  editForm[section] = JSON.parse(JSON.stringify(sourceData))
}

// 保存编辑
const handleSave = async (section: keyof SpecTables | 'basic') => {
  try {
    const formData = editForm[section]
    console.log('保存的数据:', formData)

    if (section === 'basic') {
      Object.assign(productInfo, formData)
    } else {
      Object.assign(specTables[section], formData)
    }

    editingSection.value = ''
    delete editForm[section]
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 取消编辑
const handleCancel = (section: keyof SpecTables | 'basic') => {
  editingSection.value = ''
  delete editForm[section]
}

// 获取产品信息
const fetchProductInfo = async () => {
  try {
    loading.value = true
    // TODO: 这里应该调用实际的API获取数据
    // 目前使用模拟数据
    const mockData = {
      id: route.params.id,
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      shipping_port: '宁波港',
      fob_20_container_price: '5000.00',
      fob_40_container_price: '9000.00'
    }

    // 使用setTimeout模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    productInfo.tccode = mockData.tccode
    productInfo.supplier = mockData.supplier
    productInfo.supplier_code = mockData.supplier_code
    productInfo.supplier_name = mockData.supplier_name
    productInfo.fire_standard = mockData.fire_standard
    productInfo.shipping_port = mockData.shipping_port
    productInfo.fob_20_container_price = mockData.fob_20_container_price
    productInfo.fob_40_container_price = mockData.fob_40_container_price

    // 模拟规格表数据
    specTables.upholstery = {
      fabric_manufacturer: '布艺制造商A',
      colour_code: 'C001',
      leather_grade: 'A级',
      usage_per_chair: '2.5'
    }
    specTables.carton = {
      width: '800',
      depth: '600',
      height: '1200',
      board_type: '五层瓦楞纸',
      items_per_carton: '1',
      carton_volume: '0.576'
    }
    specTables.logistics = {
      production_time: '15',
      effective_volume: '0.5',
      loading_quantity_20gp: '36',
      loading_quantity_40hc: '76',
      net_weight: '25.5',
      gross_weight: '28.0'
    }
    specTables.dimensions = {
      seat_width: '500',
      seat_depth: '480',
      seat_height_min: '420',
      seat_height_max: '520',
      back_width: '460',
      back_height: '560',
      back_height_from_seat: '580',
      overall_width: '660',
      overall_depth: '660',
      overall_height_min: '1150',
      overall_height_max: '1250'
    }
    specTables.seatInner = {
      material_code: 'SI001',
      thickness: '50',
      layers_count: '3',
      dimensions: '500x480mm'
    }
    specTables.backInner = {
      material_code: 'BI001',
      thickness: '40',
      layers_count: '2',
      dimensions: '460x560mm'
    }
    specTables.backOuter = {
      material: '尼龙网布',
      dimensions: '460x560mm',
      manufacturer_name: '网布制造商A'
    }
    specTables.seatOuter = {
      material: '尼龙网布',
      dimensions: '500x480mm',
      manufacturer_name: '网布制造商A'
    }
    specTables.arms = {
      material: '尼龙PA6',
      type: '可调节扶手',
      manufacturer: '扶手制造商A',
      description: '3D调节扶手',
      arm_height_from_seat: '180',
      arm_height_from_floor: '600'
    }
    specTables.foam = {
      description: '高密度定型海绵',
      seat_density: '55',
      back_density: '45',
      seat_thickness: '60',
      back_thickness: '50'
    }
    specTables.castors = {
      description: '尼龙万向轮',
      pin_thickness: '11',
      wheel_diameter: '60'
    }
    specTables.base = {
      description: '尼龙五星脚',
      size_diameter: '680',
      material: '尼龙PA6+GF',
      type: '五星脚'
    }
    specTables.gasLift = {
      description: '黑色气压棒',
      gas_lift_class: '4级',
      casing_length: '500',
      extension_size: '100',
      taper: '28'
    }
    specTables.gasLiftCover = {
      description: '伸缩套管',
      material: 'PP',
      colour: '黑色'
    }
    specTables.mechanism = {
      description: '底盘机构',
      levers_count: '3',
      locking_positions: '多档位',
      model_no: 'M001',
      supplier_name: '机构制造商A'
    }
    specTables.fittings = {
      fitting_number: 'F001',
      description: '螺丝套件',
      quantity: '12',
      material: '碳钢'
    }

    // 如果是从编辑按钮跳转来的，自动进入基本信息的编辑状态
    if (route.query.edit === 'true') {
      handleEdit('basic')
    }

    console.log('加载的产品信息:', productInfo)
    console.log('加载的规格表信息:', specTables)
  } catch (error) {
    console.error('获取产品信息失败:', error)
    ElMessage.error('获取产品信息失败')
  } finally {
    loading.value = false
  }
}

// 返回列表页
const handleBack = () => {
  router.push('/prod/list')
}

// 导出Word文档
const handleExportWord = async () => {
  try {
    ElMessage.success('文档导出中...')

    // 创建文档
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: [
          // 标题
          new Paragraph({
            text: 'FULL PRODUCT SPECIFICATION SHEET ( 包装信息表 )',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {after: 400}
          }),

          // 度量单位说明
          new Paragraph({
            text: 'ALL MEASUREMENTS ARE TO BE IN MILLIMETRE\'S (MM) AND WEIGHTS IN KILOGRAMS (KG)',
            alignment: AlignmentType.CENTER,
            spacing: {before: 200, after: 200}
          }),

          // 提示信息
          new Paragraph({
            text: 'All Details to be completed fully',
            alignment: AlignmentType.CENTER,
            spacing: {before: 200, after: 200}
          }),

          // 基本信息表格
          new Table({
            width: {size: 100, type: 'pct'},
            borders: {
              top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('TCCODE')],
                  }),
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph(productInfo.tccode || 'N/A')],
                  }),
                ],
              }),
              ...['SUPPLIER', 'SUPPLIER CODE', 'SUPPLIER NAME', 'FIRE STANDARD', 'FOB 20\' CONTAINER PRICE', 'FOB 40\'HC CONTAINER PRICE', 'SHIPPING PORT'].map(label =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {size: 50, type: 'pct'},
                        children: [new Paragraph(label)],
                      }),
                      new TableCell({
                        width: {size: 50, type: 'pct'},
                        children: [new Paragraph(
                            label.includes('PRICE')
                                ? (productInfo[label.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')] ? `¥${productInfo[label.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')]}` : 'N/A')
                                : (productInfo[label.toLowerCase().replace(/\s/g, '_')] || 'N/A')
                        )],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // 面料信息表格（保持原样）
          new Table({
            width: {size: 100, type: 'pct'},
            borders: {
              top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 20, type: 'pct'},
                    rowSpan: 4,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                      text: 'UPHOLSTERY',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: {fill: "FFFFFF"},
                  }),
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('FABRIC MANUFACTURER')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(specTables.upholstery?.fabric_manufacturer || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('COLOUR CODE')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(specTables.upholstery?.colour_code || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('LEATHER GRADE (WHERE APPLICABLE)')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(specTables.upholstery?.leather_grade || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('USAGE PER CHAIR (BACK/SEAT)')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(`${specTables.upholstery?.usage_per_chair || 'N/A'}m²`)],
                  }),
                ],
              }),
            ],
          }),

          // 包装信息表格
          new Table({
            width: {size: 100, type: 'pct'},
            borders: {
              top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 20, type: 'pct'},
                    rowSpan: 6,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                      text: 'CARTON',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: {fill: "FFFFFF"},
                  }),
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('WIDTH')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(`${specTables.carton?.width || 'N/A'}mm`)],
                  }),
                ],
              }),
              ...['DEPTH', 'HEIGHT', 'BOARD TYPE', 'ITEMS PER CARTON', 'CARTON VOLUME'].map(label =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {size: 50, type: 'pct'},
                        children: [new Paragraph(label)],
                      }),
                      new TableCell({
                        width: {size: 30, type: 'pct'},
                        children: [new Paragraph(
                            label === 'CARTON VOLUME'
                                ? `${specTables.carton?.carton_volume || 'N/A'}m³`
                                : label === 'ITEMS PER CARTON'
                                    ? `${specTables.carton?.items_per_carton || 'N/A'}pc`
                                    : label.includes('WIDTH') || label.includes('DEPTH') || label.includes('HEIGHT')
                                        ? `${specTables.carton?.[label.toLowerCase()] || 'N/A'}mm`
                                        : (specTables.carton?.[label.toLowerCase().replace(/\s/g, '_')] || 'N/A')
                        )],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // 产品信息表格
          new Table({
            width: {size: 100, type: 'pct'},
            borders: {
              top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 20, type: 'pct'},
                    rowSpan: 6,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                      text: 'PRODUCT',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: {fill: "FFFFFF"},
                  }),
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('PRODUCTION TIME (DAYS)')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(`${specTables.logistics?.production_time || 'N/A'}days`)],
                  }),
                ],
              }),
              ...['EFFECTIVE VOLUME', 'LOADING QUANTITY 20\'GP', 'LOADING QUANTITY 40\'HC', 'NET WEIGHT', 'GROSS WEIGHT'].map(label =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {size: 50, type: 'pct'},
                        children: [new Paragraph(label)],
                      }),
                      new TableCell({
                        width: {size: 30, type: 'pct'},
                        children: [new Paragraph(
                            label === 'EFFECTIVE VOLUME'
                                ? `${specTables.logistics?.effective_volume || 'N/A'}m³`
                                : label.includes('WEIGHT')
                                    ? `${specTables.logistics?.[label.toLowerCase().replace(/\s/g, '_')] || 'N/A'}kg`
                                    : (specTables.logistics?.[label.toLowerCase().replace(/['\s]/g, '_')] || 'N/A')
                        )],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // 产品尺寸表格
          new Table({
            width: {size: 100, type: 'pct'},
            borders: {
              top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
              insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: {size: 20, type: 'pct'},
                    rowSpan: 5,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({
                      text: 'DIMENSIONS',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: {fill: "FFFFFF"},
                  }),
                  new TableCell({
                    width: {size: 50, type: 'pct'},
                    children: [new Paragraph('SEAT')],
                  }),
                  new TableCell({
                    width: {size: 30, type: 'pct'},
                    children: [new Paragraph(`WIDTH: ${specTables.dimensions?.seat_width || 'N/A'}mm DEPTH: ${specTables.dimensions?.seat_depth || 'N/A'}mm`)],
                  }),
                ],
              }),
              ...['BACK', 'SEAT HEIGHT', 'BACK HEIGHT FROM SEAT', 'OVERALL'].map(label =>
                  new TableRow({
                    children: [
                      new TableCell({
                        width: {size: 50, type: 'pct'},
                        children: [new Paragraph(label)],
                      }),
                      new TableCell({
                        width: {size: 30, type: 'pct'},
                        children: [new Paragraph(
                            label === 'BACK'
                                ? `WIDTH: ${specTables.dimensions?.back_width || 'N/A'}mm HEIGHT: ${specTables.dimensions?.back_height || 'N/A'}mm`
                                : label === 'SEAT HEIGHT'
                                    ? `MIN: ${specTables.dimensions?.seat_height_min || 'N/A'}mm MAX: ${specTables.dimensions?.seat_height_max || 'N/A'}mm`
                                    : label === 'BACK HEIGHT FROM SEAT'
                                        ? `${specTables.dimensions?.back_height_from_seat || 'N/A'}mm`
                                        : label === 'OVERALL'
                                            ? `WIDTH: ${specTables.dimensions?.overall_width || 'N/A'}mm DEPTH: ${specTables.dimensions?.overall_depth || 'N/A'}mm HEIGHT: ${specTables.dimensions?.overall_height_min || 'N/A'}-${specTables.dimensions?.overall_height_max || 'N/A'}mm`
                                            : 'N/A'
                        )],
                      }),
                    ],
                  })
              ),
            ],
          }),
        ]
      }]
    })

    // 生成文档并下载
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, `PRODUCT_SPECIFICATION_${productInfo.tccode}_${new Date().toISOString().split('T')[0]}.docx`)

    ElMessage.success('文档导出成功')
  } catch (error) {
    console.error('导出文档失败:', error)
    ElMessage.error('导出文档失败')
  }
}

// 创建表格的辅助函数
const createTable = (data: string[][]) => {
  return new Table({
    width: {
      size: 100,
      type: 'pct',
    },
    borders: {
      top: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
      bottom: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
      left: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
      right: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
      insideHorizontal: {style: BorderStyle.SINGLE, size: 1, color: '000000'},
      insideVertical: {style: BorderStyle.SINGLE, size: 1, color: '000000'}
    },
    rows: data.map(row =>
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 40,
                type: 'pct',
              },
              children: [new Paragraph(row[0])],
              shading: {
                fill: "FFFFFF",
              },
            }),
            new TableCell({
              width: {
                size: 60,
                type: 'pct',
              },
              children: [new Paragraph(row[1])],
            }),
          ],
        })
    ),
  })
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchProductInfo()
  }
})
</script>

<style scoped>
.info-container {
  position: relative;
  width: 100%;
  background-color: #f5f7fa;
}

.info-content {
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #909399 #f4f4f5;
}

.info-content::-webkit-scrollbar {
  width: 6px;
}

.info-content::-webkit-scrollbar-track {
  background: #f4f4f5;
}

.info-content::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.table-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
}

.table-section:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.table-section h3 {
  color: #303133;
  margin-bottom: 1.5rem;
}

.el-descriptions {
  margin-bottom: 0;
}

/* 统一表单样式 */
.el-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.el-form-item {
  margin-bottom: 0;
}

/* 统一描述列表样式 */
:deep(.el-descriptions__body) {
  background-color: #ffffff;
}

:deep(.el-descriptions__cell) {
  width: calc(100% / 3);
  min-width: 0;
}

:deep(.el-descriptions__label) {
  width: 160px;
  min-width: 160px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
  background-color: #f5f7fa !important;
  border-right: 1px solid #ebeef5;
}

:deep(.el-descriptions__content) {
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1rem;
  width: calc(100% - 160px);
  background-color: #ffffff !important;
  font-weight: 500;
}

:deep(.el-descriptions__table) {
  table-layout: fixed;
  width: 100%;
  border: 1px solid #ebeef5;
}

:deep(.el-descriptions__cell.is-bordered-content) {
  min-width: 0;
  background-color: #ffffff !important;
}

:deep(.el-descriptions__cell.is-bordered-label) {
  width: 160px;
  min-width: 160px;
  background-color: #f5f7fa !important;
}

/* 鼠标悬停效果 */
:deep(.el-descriptions__cell.is-bordered-content:hover) {
  background-color: #fafafa !important;
}

/* 顶部操作区样式 */
.mb-6 {
  margin-bottom: 2rem;
}

/* 编辑按钮组样式 */
.flex.gap-2 {
  gap: 0.5rem;
}

/* 表单输入框样式 */
:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-descriptions__table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.el-descriptions__cell.is-bordered-content) {
  min-width: 0;
}
</style>
