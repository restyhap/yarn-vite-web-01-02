<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 21:12:16
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
              <el-button type="primary" @click="handleExport">
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
                      <template v-if="isImageField(key)">
                        <div class="image-container">
                          <div class="image-preview">
                            <template v-if="formData[sectionKey]?.[key]">
                              <img :src="formData[sectionKey][key]" :alt="field" />
                            </template>
                            <template v-else>
                              <div class="image-placeholder">
                                <el-icon :size="32"><Picture /></el-icon>
                                <span>暂无图片</span>
                              </div>
                            </template>
                          </div>
                          <div class="image-title">{{ field }}</div>
                        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close, Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportToWord } from '../../../utils/exportToWord'

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
  tccode: 'TCCODE',
  supplier: 'SUPPLIER',
  supplier_code: 'SUPPLIER CODE',
  supplier_name: 'SUPPLIER NAME',
  fire_standard: 'FIRE STANDARD',
  fob_20_container_price: "FOB 20' CONTAINER PRICE",
  fob_40_container_price: "FOB 40'HC CONTAINER PRICE",
  shipping_port: 'SHIPPING PORT'
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
  },
  images: {
    front_img_path: '正视图',
    side_img_path: '侧视图',
    back_view_path: '背视图',
    angle_view_path: '角视图'
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
      product_code: 'TC001',
      product_name: '人体工学办公椅',
      product_description: '高端人体工学办公椅，带头枕',
      product_category: '办公椅',
      product_subcategory: '人体工学椅',
      product_brand: 'COMFORT PLUS',
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
      },
      images: {
        front_img_path: 'https://img.alicdn.com/imgextra/i1/2966343102/O1CN01Cjdf001YoIK2aJY1Z_!!2966343102.jpg',
        side_img_path: 'https://img.alicdn.com/imgextra/i2/2966343102/O1CN01RRmZxA1YoIK5lRLRT_!!2966343102.jpg',
        back_view_path: 'https://img.alicdn.com/imgextra/i3/2966343102/O1CN01tQv7yX1YoIK5lRn5r_!!2966343102.jpg',
        angle_view_path: 'https://img.alicdn.com/imgextra/i4/2966343102/O1CN01jnWXpE1YoIK4fqnQa_!!2966343102.jpg'
      }
    }

    loading.value = false
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
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
const handleExport = async () => {
  try {
    await exportToWord(formData.value)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 创建表格行
const createTableRow = (label: string, value: string | undefined, hasShading = true) => {
  return new TableRow({
    children: [
      new TableCell({
        width: {
          size: 30,
          type: 'pct',
        },
        children: [new Paragraph(label)],
        shading: hasShading ? { fill: 'F0F0F0' } : undefined
      }),
      new TableCell({
        children: [new Paragraph(value || '')]
      }),
    ],
  })
}

// 创建表格标题
const createSectionTitle = (title: string) => {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 }
  })
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
    fittings: '配件信息',
    images: '产品图片'
  }
  return titles[key] || key
}

// 添加图片展示的特殊处理
const isImageField = (key: string) => {
  return key.includes('_path') || key.includes('_img')
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

.image-preview {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 修改图片表单的网格布局 */
.table-section:has(.image-preview) .form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列布局 */
  gap: 24px; /* 增加间距 */
  width: 100%;
  padding: 16px; /* 添加内边距 */
}

/* 调整图片表单项的样式 */
.table-section:has(.image-preview) :deep(.el-form-item) {
  margin: 0;
  width: 100%;
}

/* 非编辑状态下隐藏标签 */
.table-section:not(.editing):has(.image-preview) :deep(.el-form-item__label) {
  display: none;
}

/* 调整图片预览容器的大小 */
.table-section:has(.image-preview) .image-preview {
  width: 100%;
  aspect-ratio: 1; /* 保持正方形 */
  margin: 0 auto; /* 居中显示 */
  border: 2px dashed #dcdfe6; /* 添加虚线边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa; /* 添加背景色 */
}

/* 调整图片容器的内容布局 */
.table-section:has(.image-preview) :deep(.el-form-item__content) {
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  width: 100% !important; /* 覆盖之前的宽度限制 */
}

/* 图片容器样式 */
.image-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 图片占位符样式 */
.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

/* 图片标题样式 */
.image-title {
  text-align: center;
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
}
</style>
