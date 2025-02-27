<template>
  <div class="image-handler"
    :style="{
      width: width || '100%',
      height: height || '100%'
    }"
  >
    <!-- 标签 -->
    <div v-if="label" class="image-label">{{ label }}</div>
    
    <!-- 图片展示区域 -->
    <div class="image-container">
      <!-- 已上传的图片 -->
      <div v-if="imageUrl" class="image-preview">
        <img 
          :src="imageUrl" 
          :alt="label || '图片'" 
          class="preview-thumbnail" 
          :style="{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }"
        />
        <!-- 编辑状态显示预览和删除按钮，非编辑状态只显示预览按钮 -->
        <div v-if="editable" class="image-actions">
          <button type="button" class="action-btn" @click.prevent="handlePreview">
            <el-icon><ZoomIn /></el-icon>
          </button>
          <button type="button" class="action-btn" @click.prevent="handleDelete">
            <el-icon><Delete /></el-icon>
          </button>
        </div>
        <!-- 非编辑状态只显示预览按钮 -->
        <div v-else class="image-actions preview-only">
          <button type="button" class="action-btn" @click.prevent="handlePreview">
            <el-icon><ZoomIn /></el-icon>
          </button>
        </div>
      </div>

      <!-- 上传按钮 - 只在编辑状态且没有图片时显示 -->
      <div 
        v-if="editable && !imageUrl" 
        class="upload-area"
        @click="triggerUpload"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          class="file-input"
          accept="image/*"
          @change="handleFileChange"
        />
        <el-icon><Plus /></el-icon>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <div v-if="previewVisible" class="preview-modal" @click.self="closePreview">
      <div class="preview-content">
        <img :src="imageUrl" :alt="label || '预览图'" />
        <button type="button" class="close-btn" @click.prevent="closePreview">
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Plus, ZoomIn, Delete, Close } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string
  label?: string
  editable?: boolean
  width?: string
  height?: string
  limit?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewVisible = ref(false)
const imageUrl = computed(() => props.modelValue)

// 触发文件选择
const triggerUpload = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    handleFile(input.files[0])
  }
}

// 处理拖放上传
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files?.length) {
    handleFile(files[0])
  }
}

// 处理文件
const handleFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件')
    return
  }

  if (file.size > 4 * 1024 * 1024) {
    alert('图片大小不能超过4MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      emit('update:modelValue', result)
    }
  }
  reader.readAsDataURL(file)
}

// 处理预览
const handlePreview = () => {
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
}

// 处理删除
const handleDelete = () => {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.image-handler {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.image-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.image-container {
  flex: 1;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: none;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

/* 非编辑状态下的预览按钮样式 */
.preview-only {
  background: rgba(0, 0, 0, 0.3);
}

.image-preview:hover .image-actions {
  display: flex;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: transparent;
  transition: all 0.3s;
}

.action-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.upload-area {
  width: 100%;
  height: 100%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8c939d;
  transition: all 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
  color: #409eff;
}

.file-input {
  display: none;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.preview-content {
  position: relative;
  /* 移除最大尺寸限制，由图片自身控制 */
}

.preview-content img {
  /* 设置合适的最大尺寸，保持原始宽高比 */
  max-width: min(90vw, 1200px);
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Element Plus 图标样式 */
:deep(.el-icon) {
  font-size: 18px;
}

/* 上传图标样式 */
.upload-area :deep(.el-icon) {
  font-size: 28px;
}

/* 预览和删除按钮图标样式 */
.action-btn :deep(.el-icon) {
  font-size: 20px;
}

/* 关闭按钮图标样式 */
.close-btn :deep(.el-icon) {
  font-size: 18px;
  font-weight: bold;
}
</style> 