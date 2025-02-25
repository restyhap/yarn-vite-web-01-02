<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 08:24:51
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
        <div class="content-wrapper">
          <!-- 导出按钮 -->
          <div class="actions export-actions">
            <el-button type="primary" @click="exportToWord">
              <el-icon><Document /></el-icon>
              导出Word文档
            </el-button>
          </div>

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
          <div class="sections-list">
            <div v-for="(section, sectionKey) in specTables" :key="sectionKey" class="section">
              <div class="section-header">
                <h2>{{ formatSectionTitle(String(sectionKey)) }}</h2>
                <div class="actions">
                  <el-button v-if="editingSection !== sectionKey" type="primary" @click="handleEdit(String(sectionKey))">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-button>
                  <template v-else>
                    <el-button type="success" @click="handleSave(String(sectionKey))">
                      <el-icon><Check /></el-icon>
                      保存
                    </el-button>
                    <el-button type="danger" @click="handleCancel(String(sectionKey))">
                      <el-icon><Close /></el-icon>
                      取消
                    </el-button>
                  </template>
                </div>
              </div>

              <el-descriptions :column="2" border>
                <template v-for="field in Object.keys(section)" :key="field">
                  <el-descriptions-item :label="formatFieldLabel(String(field))">
                    {{ formatSpecValue(String(sectionKey), String(field)) }}
                  </el-descriptions-item>
                </template>
              </el-descriptions>
            </div>
          </div>
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
import type { Ref } from 'vue'

const route = useRoute()
const router = useRouter()

// 添加加载状态
const loading = ref(true)

interface ProductInfo {
  tccode: string
  supplier: string
  supplier_code: string
  supplier_name: string
  fire_standard: string
  shipping_port: string
  fob_20_container_price: string
  fob_40_container_price: string
}

interface SpecTableSection {
  [key: string]: string
}

interface SpecTables {
  [key: string]: SpecTableSection
}

const productInfo = ref<ProductInfo>({} as ProductInfo)
const specTables = ref<SpecTables>({})
const editingSection = ref<string | null>(null)

// 格式化产品信息字段
const formatProductValue = (field: keyof ProductInfo, isPrice = false) => {
  const value = productInfo.value[field]
  if (!value) return '-'
  if (isPrice) {
    return `$${value}`
  }
  return value
}

// 格式化规格表字段
const formatSpecValue = (section: string, field: string): string => {
  const value = specTables.value[section]?.[field]
  if (!value) return '-'
  
  // 根据字段名添加单位
  if (field.includes('density')) return `${value} kg/m³`
  if (field.includes('thickness') || field.includes('height') || field.includes('width') || field.includes('depth')) return `${value} mm`
  if (field.includes('volume')) return `${value} m³`
  if (field.includes('weight')) return `${value} kg`
  if (field.includes('count') || field.includes('quantity')) return `${value} 件`
  
  return value
}

// 格式化章节标题
const formatSectionTitle = (section: string): string => {
  return section.charAt(0).toUpperCase() + section.slice(1)
}

// 格式化字段标签
const formatFieldLabel = (field: string): string => {
  return field.split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 编辑功能
const handleEdit = (section: string) => {
  editingSection.value = section
}

// 保存功能
const handleSave = (section: string) => {
  editingSection.value = null
  // TODO: 实现保存逻辑
}

// 取消功能
const handleCancel = (section: string) => {
  editingSection.value = null
}

// 导出Word文档
const exportToWord = () => {
  // TODO: 实现导出Word文档功能
}

// 模拟获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    productInfo.value = {
      tccode: 'TC001',
      supplier: 'Supplier A',
      supplier_code: 'SA001',
      supplier_name: 'Supplier A Ltd',
      fire_standard: 'BS 5852',
      shipping_port: 'Shanghai',
      fob_20_container_price: '1000',
      fob_40_container_price: '1800'
    }
    
    specTables.value = {
      upholstery: {
        fabric_manufacturer: 'Manufacturer A',
        colour_code: 'C001',
        leather_grade: 'Grade A',
        usage_per_chair: '2.5'
      },
      carton: {
        width: '800',
        depth: '600',
        height: '1200',
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
        overall_width: '660',
        overall_depth: '660',
        overall_height_min: '1000',
        overall_height_max: '1100'
      },
      seatInner: {
        material_code: 'PP001',
        thickness: '3',
        layers_count: '1',
        dimensions: '480x460'
      },
      backInner: {
        material_code: 'PP002',
        thickness: '3',
        layers_count: '1',
        dimensions: '460x580'
      },
      backOuter: {
        material: '尼龙网布',
        dimensions: '460x580',
        manufacturer_name: 'Manufacturer B'
      },
      seatOuter: {
        material: '尼龙网布',
        dimensions: '480x460',
        manufacturer_name: 'Manufacturer B'
      },
      arms: {
        material: 'PP',
        type: '可调节',
        manufacturer: 'Manufacturer C',
        description: '3D调节扶手',
        arm_height_from_seat: '180',
        arm_height_from_floor: '600'
      },
      foam: {
        description: '高密度海绵',
        seat_density: '45',
        back_density: '35',
        seat_thickness: '50',
        back_thickness: '30'
      },
      castors: {
        description: '万向轮',
        pin_thickness: '11',
        wheel_diameter: '60'
      },
      base: {
        description: '铝合金底座',
        size_diameter: '660',
        material: '铝合金',
        type: '五星脚'
      },
      gasLift: {
        description: '气压棒',
        gas_lift_class: '4级',
        casing_length: '200',
        extension_size: '100',
        taper: '28'
      },
      gasLiftCover: {
        description: '气压罩',
        material: 'PP',
        colour: '黑色'
      },
      mechanism: {
        description: '多功能底盘',
        levers_count: '3',
        locking_positions: '5档',
        model_no: 'M001',
        supplier_name: 'Supplier B'
      },
      fittings: {
        fitting_number: '1001',
        description: '螺丝套件',
        quantity: '1',
        material: '碳钢'
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
fetchData()
</script>

<style scoped>
.info-container {
  height: calc(100vh - 60px);
  overflow: hidden;
  padding: 20px;
  background: #f5f7fa;
  width: 100%;
  flex: 1;
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
  width: 100%;
}

.sections-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  width: 100%;
}

.section :deep(.el-descriptions) {
  width: 100%;
}

.section :deep(.el-descriptions__body) {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.actions {
  display: flex;
  gap: 8px;
}

.export-actions {
  margin-bottom: 20px;
  justify-content: flex-end;
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
</style>
