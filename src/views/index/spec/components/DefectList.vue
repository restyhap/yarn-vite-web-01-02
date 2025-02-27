<template>
  <div class="table-section" :class="{ 'editing': isAnyDefectEditing }">
    <div class="section-header">
      <div class="section-header-content">
        <h3 class="text-lg font-medium">缺陷记录 ({{ defects?.length || 0 }})</h3>
        <el-button 
          type="primary" 
          size="small"
          @click="$emit('add-defect')"
        >
          <el-icon><Plus /></el-icon>
          添加记录
        </el-button>
      </div>
    </div>

    <!-- 缺陷记录列表 -->
    <div v-if="defects && defects.length > 0" class="defects-list">
      <div v-for="(defect, index) in defects" :key="defect.id" class="defect-card">
        <div class="defect-header">
          <div class="defect-title">
            <span class="defect-number">缺陷 #{{ index + 1 }}</span>
            <h4>{{ defect.defectTitle || '缺陷记录' }}</h4>
          </div>
          <div class="defect-actions">
            <template v-if="isDefectEditing(index)">
              <el-button type="success" size="small" @click="$emit('save-defect', index)">
                <el-icon><Check /></el-icon>
                保存
              </el-button>
              <el-button type="danger" size="small" @click="$emit('cancel-defect', index)">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button type="primary" size="small" @click="$emit('edit-defect', index)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" size="small" @click="$emit('delete-defect', index)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </div>
        </div>
        
        <div class="defect-content">
          <div class="defect-info">
            <div class="info-item">
              <div class="info-label">问题描述:</div>
              <div class="info-value">
                <template v-if="isDefectEditing(index)">
                  <el-input 
                    v-model="tempDefects[index].defectDescription" 
                    type="textarea" 
                    :rows="3"
                  />
                </template>
                <template v-else>
                  {{ defect.defectDescription || '无' }}
                </template>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-label">改进建议:</div>
              <div class="info-value">
                <template v-if="isDefectEditing(index)">
                  <el-input 
                    v-model="tempDefects[index].improvementSuggestion" 
                    type="textarea" 
                    :rows="3"
                  />
                </template>
                <template v-else>
                  {{ defect.improvementSuggestion || '无' }}
                </template>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-label">检查员:</div>
              <div class="info-value">
                <template v-if="isDefectEditing(index)">
                  <el-input v-model="tempDefects[index].inspector" />
                </template>
                <template v-else>
                  {{ defect.inspector || '无' }}
                </template>
              </div>
            </div>
          </div>
          
          <div class="defect-images">
            <div class="images-label">缺陷图片:</div>
            <div class="images-container">
              <template v-if="defect.images && defect.images.length > 0">
                <div v-for="(image, imgIndex) in defect.images" :key="image.id" class="defect-image-item">
                  <ImageHandler
                    :model-value="image.imagePath"
                    :editable="isDefectEditing(index)"
                    width="100%"
                    height="150px"
                    @update:model-value="(val) => $emit('update-image', val, index, imgIndex)"
                  />
                </div>
              </template>
              
              <div v-if="isDefectEditing(index) && (!defect.images || defect.images.length < 2)" 
                   class="defect-image-item">
                <ImageHandler
                  :model-value="null"
                  alt="添加图片"
                  :editable="true"
                  width="100%"
                  height="150px"
                  @update:model-value="(val) => $emit('add-image', val, index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-defects">
      <el-empty description="暂无缺陷记录" />
    </div>
    
    <!-- 添加缺陷对话框 -->
    <el-dialog
      :model-value="dialogVisible"
      @update:model-value="$emit('update-dialog', $event)"
      title="添加缺陷记录"
      width="60%"
      :before-close="$emit('close-dialog')"
    >
      <el-form :model="newDefect" label-width="100px">
        <el-form-item label="缺陷标题">
          <el-input v-model="newDefect.defects.defectTitle" />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="newDefect.defects.defectDescription" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="改进建议">
          <el-input v-model="newDefect.defects.improvementSuggestion" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="检查员">
          <el-input v-model="newDefect.defects.inspector" />
        </el-form-item>
        <el-form-item label="缺陷图片">
          <div class="images-container">
            <template v-if="newDefect.defectImages && newDefect.defectImages.length > 0">
              <div v-for="(image, index) in newDefect.defectImages" :key="image.id" class="defect-image-item">
                <ImageHandler
                  :model-value="image.imagePath"
                  :editable="true"
                  width="100%"
                  height="150px"
                  @update:model-value="(val) => $emit('update-new-image', val, image.id)"
                />
              </div>
            </template>
            
            <div v-if="newDefect.defectImages.length < 2" class="defect-image-item">
              <ImageHandler
                :model-value="null"
                alt="添加图片"
                :editable="true"
                width="100%"
                height="150px"
                @update:model-value="(val) => $emit('add-new-image', val)"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="$emit('close-dialog')">取消</el-button>
          <el-button type="primary" @click="$emit('save-new-defect')">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import { Check, Close, Edit, Delete, Plus } from '@element-plus/icons-vue'
import ImageHandler from '@/components/ImageHandler.vue'

const props = defineProps({
  defects: {
    type: Array,
    default: () => []
  },
  tempDefects: {
    type: Array,
    default: () => []
  },
  editingSections: {
    type: Array,
    default: () => []
  },
  dialogVisible: {
    type: Boolean,
    default: false
  },
  newDefect: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'edit-defect',
  'save-defect',
  'cancel-defect',
  'delete-defect',
  'update-image',
  'add-image',
  'add-defect',
  'close-dialog',
  'save-new-defect',
  'add-new-image',
  'update-new-image',
  'update-dialog'
])

// 检查特定缺陷是否处于编辑状态
const isDefectEditing = (index) => {
  return props.editingSections.includes(`defect-${index}`)
}

// 检查是否有任何缺陷处于编辑状态
const isAnyDefectEditing = computed(() => {
  return props.editingSections.some(section => section.startsWith('defect-'))
})
</script>

<style scoped>
/* 确保表格区域高度与视口一致 */
.table-section {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
  margin-bottom: 24px;
  max-height: calc(100vh - 180px); /* 减去顶部导航和页面边距 */
  overflow-y: auto; /* 添加垂直滚动条 */
  position: relative;
}

.defects-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
  /* 确保内容可以滚动 */
  overflow-y: auto;
}

.defect-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.defect-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.defect-number {
  background-color: #409eff;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.defect-title h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.defect-actions {
  display: flex;
  gap: 8px;
}

.defect-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.defect-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-weight: bold;
  color: #606266;
  font-size: 14px;
}

.info-value {
  color: #303133;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.defect-images {
  margin-top: 12px;
}

.images-label {
  font-weight: bold;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.images-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.defect-image-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  height: 150px;
}

.empty-defects {
  padding: 32px;
  display: flex;
  justify-content: center;
}

/* 编辑状态下的表格区域样式 */
.table-section.editing {
  background-color: var(--section-editing-background, #fafcff);
  border: 2px solid #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.1);
}

.table-section.editing .section-header {
  border-bottom-color: #409eff;
  background-color: #ecf5ff;
  margin: -16px -16px 16px -16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: -16px; /* 与上边距对应 */
  z-index: 10; /* 确保在滚动时保持在顶部 */
  background-color: #ecf5ff; /* 确保背景色 */
}

.table-section.editing .section-header h3 {
  color: #409eff;
}

.section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white; /* 确保背景色 */
}

/* 添加滚动条样式 */
.table-section::-webkit-scrollbar {
  width: 8px;
}

.table-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保对话框内容可以滚动 */
:deep(.el-dialog__body) {
  max-height: calc(80vh - 120px); /* 减去对话框标题和底部按钮的高度 */
  overflow-y: auto;
  padding-top: 10px;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

/* 添加更多样式以匹配之前的设计 */
.text-lg {
  font-size: 18px;
}

.font-medium {
  font-weight: 500;
}

/* 缺陷卡片悬停效果 */
.defect-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

/* 编辑状态下的输入框样式 */
:deep(.el-input__inner) {
  border-color: #409eff;
}

:deep(.el-textarea__inner) {
  border-color: #409eff;
}

/* 确保图片容器在编辑模式下有明显的边框 */
.defect-image-item:has(> .editable) {
  border: 2px dashed #409eff;
}
</style> 