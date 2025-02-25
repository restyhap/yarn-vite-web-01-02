<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 11:01:10
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
              <el-button v-if="!isEditMode" type="primary" @click="enterEditMode">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
            </div>
          </div>

          <div class="tables-container">
            <!-- 基本信息表 -->
            <div class="table-section">
              <div class="section-header">
                <h2>基本信息</h2>
                <div class="actions" v-if="isEditMode">
                  <template v-if="editingSection === 'basic'">
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
                <el-row :gutter="20">
                  <el-col :span="8" v-for="(field, key) in basicFields" :key="key">
                    <el-form-item :label="formatFieldLabel(key)">
                      <template v-if="editingSection === 'basic'">
                        <el-input v-model="formData[key]" />
                      </template>
                      <template v-else>
                        {{ formData[key] || '-' }}
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>

            <!-- 其他表格 -->
            <div v-for="(section, sectionKey) in specSections" 
                 :key="sectionKey" 
                 class="table-section">
              <div class="section-header">
                <h2>{{ formatSectionTitle(sectionKey) }}</h2>
                <div class="actions" v-if="isEditMode">
                  <template v-if="editingSection === sectionKey">
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
              </div>

              <el-form :model="formData[sectionKey]" label-width="120px">
                <el-row :gutter="20">
                  <el-col :span="8" v-for="(field, key) in section" :key="key">
                    <el-form-item :label="field">
                      <template v-if="editingSection === sectionKey">
                        <el-input v-model="formData[sectionKey][key]" />
                      </template>
                      <template v-else>
                        {{ formData[sectionKey]?.[key] || '-' }}
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
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
const editingSection = ref('')
const isEditMode = ref(false)
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

// 在组件挂载时检查mode参数
onMounted(async () => {
  const mode = route.query.mode
  if (mode === 'edit') {
    isEditMode.value = true
  }
  await fetchData()
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const id = route.params.id
    // TODO: 调用API获取数据
    // 模拟数据
    formData.value = {
      // 基本信息
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      
      // 规格信息
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
        back_height: '600'
      }
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 进入编辑模式
const enterEditMode = () => {
  router.push({ query: { ...route.query, mode: 'edit' } })
  isEditMode.value = true
}

// 处理编辑按钮点击
const handleEdit = (section: string | number): void => {
  editingSection.value = String(section)
}

// 处理保存按钮点击
const handleSave = async (section: string | number): Promise<void> => {
  try {
    await saveData(String(section))
    editingSection.value = ''
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
    // TODO: 实现与后端的数据保存逻辑
    console.log('保存数据:', {
      id,
      section,
      data: section === 'basic' ? 
        Object.keys(basicFields).reduce((acc, key) => ({ ...acc, [key]: formData.value[key] }), {}) :
        formData.value[section]
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return true
  } catch (error) {
    console.error('保存失败:', error)
    throw error
  }
}

// 处理取消按钮点击
const handleCancel = (section: string) => {
  editingSection.value = ''
  // TODO: 重新获取数据以重置修改
  fetchData()
}

// 导出Word文档
const exportToWord = async () => {
  try {
    // TODO: 实现导出逻辑
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 格式化字段标签
const formatFieldLabel = (key: string | number): string => {
  const strKey = String(key)
  if (strKey in basicFields) return basicFields[strKey]
  for (const section of Object.values(specSections)) {
    if (strKey in section) return section[strKey]
  }
  return strKey
}

// 格式化部分标题
const formatSectionTitle = (key: string | number): string => {
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
  const strKey = String(key)
  return titles[strKey] || strKey
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 两列布局 */
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
  min-height: 200px;  /* 设置最小高度 */
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
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

/* 表单样式优化 */
:deep(.el-form) {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.el-form-item) {
  margin-bottom: 8px;
  flex: 1 1 calc(33.33% - 8px);  /* 每行显示3个字段 */
  min-width: 200px;  /* 设置最小宽度 */
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0 8px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

:deep(.el-form-item__content) {
  min-height: 28px;
  line-height: 28px;
  padding: 0 8px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
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
  height: 26px;
  line-height: 26px;
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
</style>
