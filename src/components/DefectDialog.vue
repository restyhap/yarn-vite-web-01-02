<!-- 缺陷记录弹窗组件 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    :close-on-click-modal="false"
    class="!fixed"
    :modal-class="'!w-[calc(100%-256px)] !left-[256px]'"
    :style="{
      left: '50%',
      marginLeft: '128px',
      transform: 'translate(-50%, -50%)',
      top: '50%'
    }"
    align-center
  >
    <el-form :model="formData" label-width="100px">
      <div class="grid grid-cols-1 gap-4">
        <el-form-item 
          label="缺陷标题" 
          class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" 
          label-position="left"
        >
          <el-input 
            v-model="formData.defectTitle" 
            placeholder="请输入缺陷标题"
            class="w-full !h-[38px]"
          />
        </el-form-item>

        <el-form-item 
          label="检查人员" 
          class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" 
          label-position="left"
        >
          <el-input 
            v-model="formData.inspector" 
            placeholder="请输入检查人员"
            class="w-full !h-[38px]"
          />
        </el-form-item>

        <el-form-item 
          label="缺陷描述" 
          class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" 
          label-position="left"
        >
          <el-input
            v-model="formData.defectDescription"
            type="textarea"
            :rows="3"
            placeholder="请输入缺陷描述"
            class="w-full"
          />
        </el-form-item>

        <el-form-item 
          label="改进建议" 
          class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" 
          label-position="left"
        >
          <el-input
            v-model="formData.improvementSuggestion"
            type="textarea"
            :rows="3"
            placeholder="请输入改进建议"
            class="w-full"
          />
        </el-form-item>
        
        <!-- 缺陷图片 -->
        <el-form-item 
          label="缺陷图片" 
          class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" 
          label-position="left"
        >
          <div class="w-full">
            <ImageHandler
              v-model="imageUrls"
              :editable="true"
              :size="120"
              :limit="2"
              @preview="handlePreview"
            />
          </div>
        </el-form-item>
      </div>
    </el-form>
    
    <template #footer>
      <div class="flex justify-end gap-4">
        <el-button 
          type="success" 
          class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" 
          @click="handleSave"
          :loading="loading"
        >
          <el-icon><Check /></el-icon>
          确定
        </el-button>
        <el-button 
          class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm" 
          @click="handleClose"
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 图片预览弹窗 -->
  <el-dialog
    v-model="previewVisible"
    title="图片预览"
    width="auto"
    :modal-class="'!w-[calc(100%-256px)] !left-[256px]'"
    class="!fixed preview-dialog"
    :style="{
      left: '50%',
      marginLeft: '128px',
      transform: 'translateX(-50%)'
    }"
    align-center
  >
    <img 
      :src="previewUrl" 
      class="max-h-[300px] w-auto object-contain"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import ImageHandler from '@/components/ImageHandler.vue'
import type { DefectImage } from '@/types/qcReport'
import { getId } from '@/utils/idUtils'

interface DefectFormData {
  id: string
  reportId: string
  defectTitle: string
  defectDescription: string
  improvementSuggestion: string
  inspector: string
  images?: DefectImage[]
  createdAt?: string
  updatedAt?: string
}

const props = defineProps<{
  visible: boolean
  title?: string
  initialData?: DefectFormData
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: DefectFormData): void
  (e: 'close'): void
}>()

// 弹窗显示状态
const dialogVisible = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')

// 表单数据
const formData = ref<DefectFormData>({
  id: getId(),
  reportId: '',
  defectTitle: '',
  defectDescription: '',
  improvementSuggestion: '',
  inspector: '',
  images: []
})

// 图片URL数组
const imageUrls = ref<string[]>([])

// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.initialData) {
    // 如果是编辑模式，填充表单数据
    formData.value = { ...props.initialData }
    imageUrls.value = props.initialData.images?.map(img => img.imagePath) || []
  } else {
    // 如果是新建模式，重置表单
    resetForm()
  }
})

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 处理图片预览
const handlePreview = (url: string) => {
  previewUrl.value = url
  previewVisible.value = true
}

// 处理保存
const handleSave = () => {
  // 验证必填字段
  if (!formData.value.defectTitle) {
    ElMessage.warning('请输入缺陷标题')
    return
  }
  if (!formData.value.defectDescription) {
    ElMessage.warning('请输入缺陷描述')
    return
  }
  if (!formData.value.improvementSuggestion) {
    ElMessage.warning('请输入改进建议')
    return
  }
  if (!formData.value.inspector) {
    ElMessage.warning('请输入检查人员')
    return
  }
  if (imageUrls.value.length === 0) {
    ElMessage.warning('请至少上传一张缺陷图片')
    return
  }

  // 构建保存数据
  const saveData: DefectFormData = {
    ...formData.value,
    images: imageUrls.value.map(url => ({
      id: getId(),
      defectId: formData.value.id,
      imagePath: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }

  // 发送保存事件
  emit('save', saveData)
}

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
}

// 重置表单
const resetForm = () => {
  formData.value = {
    id: getId(),
    reportId: '',
    defectTitle: '',
    defectDescription: '',
    improvementSuggestion: '',
    inspector: '',
    images: []
  }
  imageUrls.value = []
}
</script> 