<template>
  <div class="table-section" :class="{ 'editing': isEditing }">
    <div class="section-header">
      <h3>质检信息</h3>
    </div>
    <div class="form-content">
      <el-form :model="formData" label-width="120px">
        <div class="form-grid">
          <el-form-item v-for="(field, key) in basicFields"
            :key="key"
            :label="field">
            <template v-if="isEditing">
              <el-input 
                v-model="editingData[key]"
              />
            </template>
            <template v-else>
              {{ formData[key] || '-' }}
            </template>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
  
  <!-- 产品图片部分 -->
  <div class="table-section" :class="{ 'editing': isEditing }">
    <div class="section-header">
      <h3>产品图片</h3>
    </div>
    <div class="images-grid">
      <template v-for="(label, key) in productImages" :key="key">
        <div class="image-item">
          <div class="image-label" :class="{ 'editing': isEditing }">
            {{ label }}
          </div>
          <div class="image-container">
            <ImageHandler
              v-model="formData[key]"
              :editable="isEditing"
              width="100%"
              height="200px"
              @temp-file="handleTempFile"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ImageHandler from '@/components/ImageHandler.vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  editingData: {
    type: Object,
    required: true
  },
  basicFields: {
    type: Object,
    required: true
  },
  productImages: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['temp-file'])

const handleTempFile = (file: string) => {
  emit('temp-file', file)
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.image-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-label {
  font-weight: 500;
  color: #606266;
}

.image-label.editing {
  color: #409eff;
}

.image-container {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
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
}

.table-section.editing .section-header h3 {
  color: #409eff;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
}

/* 确保没有其他样式覆盖网格布局 */
.table-section .images-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
}
</style> 