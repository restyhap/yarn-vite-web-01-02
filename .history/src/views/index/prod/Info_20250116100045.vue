<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 10:00:45
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
        <div class="content-wrapper" v-if="formData">
          <!-- 顶部操作栏 -->
          <div class="top-actions">
            <div class="left-actions">
              <el-button type="primary" @click="exportToWord">
                <el-icon><Document /></el-icon>
                导出Word文档
              </el-button>
            </div>
            <div class="right-actions" v-if="!isEditMode">
              <el-button type="primary" @click="enterEditMode">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="section">
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

          <!-- 规格信息 -->
          <template v-for="(section, sectionKey) in specSections" :key="sectionKey">
            <div v-if="formData[sectionKey]" class="section">
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
                        {{ formData[sectionKey][key] || '-' }}
                      </template>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  fire_standard: '防火标准'
}

// 规格部分定义
const specSections: SpecSections = {
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
    back_height: '背高'
  }
}

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
const handleEdit = (section: string) => {
  editingSection.value = section
}

// 处理保存按钮点击
const handleSave = async (section: string) => {
  try {
    // TODO: 实现保存逻辑
    await saveData(section)
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
    packaging: '包装信息',
    logistics: '物流信息',
    dimensions: '尺寸信息'
    // ... 其他标题映射
  }
  return titles[key] || key
}
</script>

<style scoped>
.info-container {
  height: calc(100vh - 60px);
  overflow: hidden;
  padding: 20px;
  background: #f5f7fa;
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
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
</style>
