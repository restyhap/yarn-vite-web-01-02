<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 11:47:04
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
        <div class="content-wrapper" v-if="formData">
          <!-- 顶部操作栏 -->
          <div class="top-actions">
            <div class="left-actions">
              <h2 class="page-title">产品规格详情</h2>
            </div>
            <div class="right-actions">
              <el-button type="primary" @click="exportToWord">
                <el-icon><Document /></el-icon>
                导出Word文档
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

              <el-form :model="formData" label-width="120px">
                <div class="form-grid">
                  <el-form-item v-for="(field, key) in basicFields" 
                                :key="key" 
                                :label="formatFieldLabel(String(key))">
                    <template v-if="editingSections.includes('basic')">
                      <el-input v-model="formData[key]" />
                    </template>
                    <template v-else>
                      {{ formData[key] || '-' }}
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
                  <el-form-item v-for="(field, key) in section" 
                                :key="key" 
                                :label="field">
                    <template v-if="editingSections.includes(String(sectionKey))">
                      <el-input v-model="formData[sectionKey][key]" />
                    </template>
                    <template v-else>
                      {{ formData[sectionKey]?.[key] || '-' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { saveAs } from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'

interface FormData {
  [key: string]: any
}

interface BasicFields {
  [key: string]: string
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
const formData = ref<FormData>({})

// 基本字段定义
const basicFields: BasicFields = {
  tccode: '产品代码',
  supplier: '供应商',
  supplier_code: '供应商代码',
  supplier_name: '供应商名称',
  fire_standard: '防火标准',
  fob_20_container_price: '20尺柜FOB价格',
  fob_40_container_price: '40尺柜FOB价格',
  shipping_port: '发货港口'
} as const

// 规格部分定义
const specSections: SpecSections = {
  upholstery: {
    fabric_manufacturer: '面料制造商',
    colour_code: '颜色代码',
    leather_grade: '皮革等级',
    usage_per_chair: '每把椅子用料'
  },
  packaging: {
    carton_length: '纸箱长度',
    carton_width: '纸箱宽度',
    carton_height: '纸箱高度',
    board_type: '纸板类型',
    items_per_carton: '每箱数量',
    carton_volume: '箱体体积'
  },
  logistics: {
    production_time: '生产周期',
    effective_volume: '有效体积',
    loading_quantity_20gp: '20尺柜装柜数',
    loading_quantity_40hc: '40尺高柜装柜数',
    net_weight: '净重',
    gross_weight: '毛重'
  },
  dimensions: {
    seat_width: '座宽',
    seat_depth: '座深',
    seat_height_min: '最低座高',
    seat_height_max: '最高座高',
    back_width: '背宽',
    back_height: '背高',
    back_height_from_seat: '靠背离座高度',
    overall_width: '整体宽度',
    overall_depth: '整体深度',
    overall_height_min: '最低整体高度',
    overall_height_max: '最高整体高度'
  },
  seat_inner: {
    material_code: '材料代码',
    thickness: '厚度',
    layers_count: '层数',
    dimensions: '尺寸规格'
  },
  back_inner: {
    material_code: '材料代码',
    thickness: '厚度',
    layers_count: '层数',
    dimensions: '尺寸规格'
  },
  back_outer: {
    material: '材料',
    dimensions: '尺寸',
    manufacturer_name: '制造商名称'
  },
  seat_outer: {
    material: '材料',
    dimensions: '尺寸',
    manufacturer_name: '制造商名称'
  },
  arms: {
    material: '材料',
    type: '类型',
    manufacturer: '制造商',
    description: '描述',
    arm_height_from_seat: '扶手离座高度',
    arm_height_from_floor: '扶手离地高度'
  },
  foam: {
    description: '描述',
    seat_density: '座椅密度',
    back_density: '靠背密度',
    seat_thickness: '座椅厚度',
    back_thickness: '靠背厚度'
  },
  castors: {
    description: '描述',
    pin_thickness: '销轴直径',
    wheel_diameter: '轮子直径'
  },
  base: {
    description: '描述',
    size_diameter: '底盘直径',
    material: '材料',
    type: '类型'
  },
  gas_lift: {
    description: '描述',
    gas_lift_class: '气压等级',
    casing_length: '外管长度',
    extension_size: '行程',
    taper: '锥度'
  },
  gas_lift_cover: {
    description: '描述',
    material: '材料',
    colour: '颜色'
  },
  mechanism: {
    description: '描述',
    levers_count: '手柄数量',
    locking_positions: '锁定位置',
    model_no: '型号',
    supplier_name: '机构供应商'
  },
  fittings: {
    fitting_number: '配件编号',
    description: '描述',
    quantity: '数量',
    material: '材料'
  }
} as const

// 在组件挂载时获取数据
onMounted(async () => {
  await fetchData()
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const id = route.params.id
    // 模拟数据
    formData.value = {
      // 基本信息
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      fob_20_container_price: '1000',
      fob_40_container_price: '1800',
      shipping_port: '宁波港',
      
      // 规格信息
      upholstery: {
        fabric_manufacturer: '面料厂商A',
        colour_code: 'C001',
        leather_grade: 'A级',
        usage_per_chair: '2.5米'
      },
      packaging: {
        carton_length: '800',
        carton_width: '600',
        carton_height: '1200',
        board_type: '五层',
        items_per_carton: '1',
        carton_volume: '0.576'
      },
      logistics: {
        production_time: '15',
        effective_volume: '0.5',
        loading_quantity_20gp: '36',
        loading_quantity_40hc: '76',
        net_weight: '15.5',
        gross_weight: '18.2'
      },
      dimensions: {
        seat_width: '500',
        seat_depth: '480',
        seat_height_min: '420',
        seat_height_max: '520',
        back_width: '460',
        back_height: '600',
        back_height_from_seat: '580',
        overall_width: '680',
        overall_depth: '680',
        overall_height_min: '1150',
        overall_height_max: '1250'
      },
      seat_inner: {
        material_code: 'SI001',
        thickness: '25mm',
        layers_count: '3',
        dimensions: '500x480'
      },
      back_inner: {
        material_code: 'BI001',
        thickness: '20mm',
        layers_count: '2',
        dimensions: '460x600'
      },
      back_outer: {
        material: '高密度网布',
        dimensions: '460x600',
        manufacturer_name: '网布制造商A'
      },
      seat_outer: {
        material: '高密度网布',
        dimensions: '500x480',
        manufacturer_name: '网布制造商A'
      },
      arms: {
        material: '尼龙PA6',
        type: '可调节扶手',
        manufacturer: '扶手制造商B',
        description: '4D调节扶手',
        arm_height_from_seat: '190',
        arm_height_from_floor: '610'
      },
      foam: {
        description: '高密度定型海绵',
        seat_density: '55kg/m³',
        back_density: '50kg/m³',
        seat_thickness: '60mm',
        back_thickness: '50mm'
      },
      castors: {
        description: '双轮万向轮',
        pin_thickness: '11mm',
        wheel_diameter: '60mm'
      },
      base: {
        description: '五星脚',
        size_diameter: '680mm',
        material: '尼龙PA6',
        type: '标准型'
      },
      gas_lift: {
        description: '黑色气压棒',
        gas_lift_class: 'Class 4',
        casing_length: '500mm',
        extension_size: '100mm',
        taper: '1:10'
      },
      gas_lift_cover: {
        description: '标准型气压罩',
        material: 'PP',
        colour: '黑色'
      },
      mechanism: {
        description: '标准底盘',
        levers_count: '3',
        locking_positions: '5',
        model_no: 'M001',
        supplier_name: '底盘供应商C'
      },
      fittings: {
        fitting_number: 'F001',
        description: '标准配件包',
        quantity: '1',
        material: '混合材料'
      }
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
  editingSections.value = [...editingSections.value, section]
}

// 处理保存按钮点击
const handleSave = async (section: string): Promise<void> => {
  try {
    console.log('保存按钮被点击:', section)
    await saveData(section)
    editingSections.value = editingSections.value.filter(s => s !== section)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 保存数据
const saveData = async (section: string) => {
  try {
    const id = route.params.id
    let sectionData
    
    if (section === 'basic') {
      // 处理基本信息表的数据
      sectionData = Object.keys(basicFields).reduce((acc, key) => ({
        ...acc,
        [key]: formData.value[key]
      }), {})
    } else {
      // 处理其他表格的数据
      sectionData = formData.value[section] || {}
    }

    // TODO: 实现与后端的数据保存逻辑
    console.log('保存数据:', {
      id,
      section,
      data: sectionData
    })
    
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  } catch (error) {
    console.error('保存失败:', error)
    throw error
  }
}

// 处理取消按钮点击
const handleCancel = (section: string): void => {
  console.log('取消按钮被点击:', section)
  editingSections.value = editingSections.value.filter(s => s !== section)
  fetchData()
}

// 导出Word文档
const exportToWord = async () => {
  try {
    // 创建HTML内容
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 8px; }
            th { background-color: #f0f0f0; }
            .title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 20px; color: red; }
            .section-title { font-size: 12pt; font-weight: bold; margin-top: 15px; }
            .note { font-size: 10pt; font-weight: bold; margin: 10px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="title">FULL PRODUCT SPECIFICATION SHEET（包装信息表）</div>
          
          <div class="note">ALL MEASUREMENTS ARE TO BE IN MILLIMETRE'S (MM) AND WEIGHTS IN KILOGRAMS (KG)</div>
          <div class="note">All Details to be completed fully</div>
          
          <!-- 基本信息表 -->
          <table>
            <tr>
              <td style="width: 30%; background-color: #f0f0f0;">TCCODE</td>
              <td>${formData.value.tccode || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">SUPPLIER</td>
              <td>${formData.value.supplier || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">SUPPLIER CODE</td>
              <td>${formData.value.supplier_code || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">SUPPLIER NAME</td>
              <td>${formData.value.supplier_name || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">FIRE STANDARD</td>
              <td>${formData.value.fire_standard || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">FOB 20' CONTAINER PRICE</td>
              <td>${formData.value.fob_20_container_price || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">FOB 40'HC CONTAINER PRICE</td>
              <td>${formData.value.fob_40_container_price || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">SHIPPING PORT</td>
              <td>${formData.value.shipping_port || ''}</td>
            </tr>
          </table>

          <!-- 面料信息 -->
          <div class="section-title">UPHOLSTERY</div>
          <table>
            <tr>
              <td style="width: 30%; background-color: #f0f0f0;">FABRIC MANUFACTURER</td>
              <td>${formData.value.upholstery?.fabric_manufacturer || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">COLOUR CODE</td>
              <td>${formData.value.upholstery?.colour_code || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">LEATHER GRADE (WHERE APPLICABLE)</td>
              <td>${formData.value.upholstery?.leather_grade || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">USAGE PER CHAIR（BACK/SEAT）</td>
              <td>${formData.value.upholstery?.usage_per_chair || ''}</td>
            </tr>
          </table>

          <!-- 包装信息 -->
          <div class="section-title">CARTON (MINIMUM TWIN WALLED CARDBOARD WITH DIVIDERS)</div>
          <table>
            <tr>
              <td rowspan="3" style="width: 30%; background-color: #f0f0f0;">DIMENSIONS</td>
              <td style="width: 20%; background-color: #f0f0f0;">WIDTH</td>
              <td>${formData.value.packaging?.carton_width || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">DEPTH</td>
              <td>${formData.value.packaging?.carton_depth || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">HEIGHT</td>
              <td>${formData.value.packaging?.carton_height || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">BOARD TYPE</td>
              <td colspan="2">${formData.value.packaging?.board_type || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">Items per carton</td>
              <td colspan="2">${formData.value.packaging?.items_per_carton || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">CARTON VOLUME (m³)</td>
              <td colspan="2">${formData.value.packaging?.carton_volume || ''}</td>
            </tr>
          </table>

          <!-- 物流信息 -->
          <div class="section-title">PRODUCT</div>
          <table>
            <tr>
              <td style="width: 30%; background-color: #f0f0f0;">PRODUCTION TIME (DAYS)</td>
              <td>${formData.value.logistics?.production_time || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">EFFECTIVE VOLUME (m³)</td>
              <td>${formData.value.logistics?.effective_volume || ''}</td>
            </tr>
            <tr>
              <td rowspan="2" style="background-color: #f0f0f0;">LOADING QUANTITY</td>
              <td>20'GP: ${formData.value.logistics?.loading_quantity_20gp || ''}</td>
            </tr>
            <tr>
              <td>40'HC: ${formData.value.logistics?.loading_quantity_40hc || ''}</td>
            </tr>
            <tr>
              <td rowspan="2" style="background-color: #f0f0f0;">WEIGHT (KG)</td>
              <td>NET: ${formData.value.logistics?.net_weight || ''}</td>
            </tr>
            <tr>
              <td>GROSS: ${formData.value.logistics?.gross_weight || ''}</td>
            </tr>
          </table>

          <!-- 产品尺寸 -->
          <div class="section-title">PRODUCT DIMENSIONS</div>
          <table>
            <tr>
              <td rowspan="2" style="width: 30%; background-color: #f0f0f0;">SEAT</td>
              <td style="width: 20%; background-color: #f0f0f0;">WIDTH</td>
              <td>${formData.value.dimensions?.seat_width || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">DEPTH</td>
              <td>${formData.value.dimensions?.seat_depth || ''}</td>
            </tr>
            <tr>
              <td rowspan="2" style="background-color: #f0f0f0;">BACK</td>
              <td style="background-color: #f0f0f0;">WIDTH</td>
              <td>${formData.value.dimensions?.back_width || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">HEIGHT</td>
              <td>${formData.value.dimensions?.back_height || ''}</td>
            </tr>
            <tr>
              <td rowspan="2" style="background-color: #f0f0f0;">SEAT HEIGHT</td>
              <td style="background-color: #f0f0f0;">MIN</td>
              <td>${formData.value.dimensions?.seat_height_min || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">MAX</td>
              <td>${formData.value.dimensions?.seat_height_max || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">BACK HEIGHT</td>
              <td style="background-color: #f0f0f0;">FROM SEAT</td>
              <td>${formData.value.dimensions?.back_height_from_seat || ''}</td>
            </tr>
            <tr>
              <td rowspan="3" style="background-color: #f0f0f0;">OVERALL</td>
              <td style="background-color: #f0f0f0;">WIDTH</td>
              <td>${formData.value.dimensions?.overall_width || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">DEPTH</td>
              <td>${formData.value.dimensions?.overall_depth || ''}</td>
            </tr>
            <tr>
              <td style="background-color: #f0f0f0;">HEIGHT</td>
              <td>${formData.value.dimensions?.overall_height_min || ''}-${formData.value.dimensions?.overall_height_max || ''}</td>
            </tr>
          </table>

          <!-- 其他表格... -->
          ${generateOtherTables()}
        </body>
      </html>
    `

    // 生成Word文档
    const converted = htmlDocx.asBlob(content)
    saveAs(converted, 'product_specification.docx')
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 生成其他表格的HTML
const generateOtherTables = () => {
  const tables = []
  
  // 座椅内部结构
  tables.push(`
    <div class="section-title">SEAT INNER STRUCTURE</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Material Code</td>
        <td>${formData.value.seat_inner?.material_code || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Thickness</td>
        <td>${formData.value.seat_inner?.thickness || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Layers Count</td>
        <td>${formData.value.seat_inner?.layers_count || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Dimensions</td>
        <td>${formData.value.seat_inner?.dimensions || ''}</td>
      </tr>
    </table>
  `)

  // 背部内部结构
  tables.push(`
    <div class="section-title">BACK INNER STRUCTURE</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Material Code</td>
        <td>${formData.value.back_inner?.material_code || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Thickness</td>
        <td>${formData.value.back_inner?.thickness || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Layers Count</td>
        <td>${formData.value.back_inner?.layers_count || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Dimensions</td>
        <td>${formData.value.back_inner?.dimensions || ''}</td>
      </tr>
    </table>
  `)

  // 背部外部结构
  tables.push(`
    <div class="section-title">BACK OUTER STRUCTURE</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Material</td>
        <td>${formData.value.back_outer?.material || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Dimensions</td>
        <td>${formData.value.back_outer?.dimensions || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Manufacturer Name</td>
        <td>${formData.value.back_outer?.manufacturer_name || ''}</td>
      </tr>
    </table>
  `)

  // 座椅外部结构
  tables.push(`
    <div class="section-title">SEAT OUTER STRUCTURE</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Material</td>
        <td>${formData.value.seat_outer?.material || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Dimensions</td>
        <td>${formData.value.seat_outer?.dimensions || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Manufacturer Name</td>
        <td>${formData.value.seat_outer?.manufacturer_name || ''}</td>
      </tr>
    </table>
  `)

  // 扶手信息
  tables.push(`
    <div class="section-title">ARMS</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Material</td>
        <td>${formData.value.arms?.material || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Type</td>
        <td>${formData.value.arms?.type || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Manufacturer</td>
        <td>${formData.value.arms?.manufacturer || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Description</td>
        <td>${formData.value.arms?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Arm Height from Seat</td>
        <td>${formData.value.arms?.arm_height_from_seat || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Arm Height from Floor</td>
        <td>${formData.value.arms?.arm_height_from_floor || ''}</td>
      </tr>
    </table>
  `)

  // 泡棉信息
  tables.push(`
    <div class="section-title">FOAM</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.foam?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Seat Density</td>
        <td>${formData.value.foam?.seat_density || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Back Density</td>
        <td>${formData.value.foam?.back_density || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Seat Thickness</td>
        <td>${formData.value.foam?.seat_thickness || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Back Thickness</td>
        <td>${formData.value.foam?.back_thickness || ''}</td>
      </tr>
    </table>
  `)

  // 脚轮信息
  tables.push(`
    <div class="section-title">CASTORS</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.castors?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Pin Thickness</td>
        <td>${formData.value.castors?.pin_thickness || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Wheel Diameter</td>
        <td>${formData.value.castors?.wheel_diameter || ''}</td>
      </tr>
    </table>
  `)

  // 底座信息
  tables.push(`
    <div class="section-title">BASE</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.base?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Size Diameter</td>
        <td>${formData.value.base?.size_diameter || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Material</td>
        <td>${formData.value.base?.material || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Type</td>
        <td>${formData.value.base?.type || ''}</td>
      </tr>
    </table>
  `)

  // 气压棒信息
  tables.push(`
    <div class="section-title">GAS LIFT</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.gas_lift?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Gas Lift Class</td>
        <td>${formData.value.gas_lift?.gas_lift_class || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Casing Length</td>
        <td>${formData.value.gas_lift?.casing_length || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Extension Size</td>
        <td>${formData.value.gas_lift?.extension_size || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Taper</td>
        <td>${formData.value.gas_lift?.taper || ''}</td>
      </tr>
    </table>
  `)

  // 气压罩信息
  tables.push(`
    <div class="section-title">GAS LIFT COVER</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.gas_lift_cover?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Material</td>
        <td>${formData.value.gas_lift_cover?.material || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Colour</td>
        <td>${formData.value.gas_lift_cover?.colour || ''}</td>
      </tr>
    </table>
  `)

  // 机构信息
  tables.push(`
    <div class="section-title">MECHANISM</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Description</td>
        <td>${formData.value.mechanism?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Levers Count</td>
        <td>${formData.value.mechanism?.levers_count || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Locking Positions</td>
        <td>${formData.value.mechanism?.locking_positions || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Model No</td>
        <td>${formData.value.mechanism?.model_no || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Supplier Name</td>
        <td>${formData.value.mechanism?.supplier_name || ''}</td>
      </tr>
    </table>
  `)

  // 配件信息
  tables.push(`
    <div class="section-title">FITTINGS</div>
    <table>
      <tr>
        <td style="width: 30%; background-color: #f0f0f0;">Fitting Number</td>
        <td>${formData.value.fittings?.fitting_number || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Description</td>
        <td>${formData.value.fittings?.description || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Quantity</td>
        <td>${formData.value.fittings?.quantity || ''}</td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0;">Material</td>
        <td>${formData.value.fittings?.material || ''}</td>
      </tr>
    </table>
  `)

  return tables.join('\n')
}

// 格式化字段标签
const formatFieldLabel = (key: string): string => {
  if (key in basicFields) return basicFields[key]
  for (const section of Object.values(specSections)) {
    if (key in section) return section[key]
  }
  return key
}

// 格式化部分标题
const formatSectionTitle = (key: string): string => {
  const titles: Record<string, string> = {
    upholstery: '面料信息',
    packaging: '包装信息',
    logistics: '物流信息',
    dimensions: '产品尺寸',
    seat_inner: '座椅内部结构',
    back_inner: '背部内部结构',
    back_outer: '背部外部结构',
    seat_outer: '座椅外部结构',
    arms: '扶手信息',
    foam: '泡棉信息',
    castors: '脚轮信息',
    base: '底座信息',
    gas_lift: '气压棒信息',
    gas_lift_cover: '气压罩信息',
    mechanism: '机构信息',
    fittings: '配件信息'
  }
  return titles[key] || key
}
</script>

<style scoped>
.info-container {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  background: #f5f7fa;
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
  background: white;
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
  grid-template-columns: repeat(3, 1fr); /* 3列布局 */
  gap: 16px;
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
  width: 38.2% !important;
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
  background-color: #fafcff;
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
@media screen and (max-width: 1400px) {
  .tables-container {
    grid-template-columns: 1fr;  /* 在较小屏幕上切换为单列布局 */
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

:deep(.el-input__wrapper:hover) {
  background-color: #f5f7fa;
}

:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-form-item__content:has(.el-input__wrapper:focus-within)) {
  border-color: #409eff;
}

/* 自定义滚动条样式 */
.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f5f7fa;
}

/* 表格间距 */
.table-section {
  margin-bottom: 24px;
}

.table-section:last-child {
  margin-bottom: 0;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr); /* 在较小屏幕上切换为2列布局 */
  }
}

@media screen and (max-width: 1000px) {
  .form-grid {
    grid-template-columns: 1fr; /* 在更小的屏幕上切换为单列布局 */
  }
}
</style>
