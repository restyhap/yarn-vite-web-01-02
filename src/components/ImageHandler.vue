<template>
  <div 
    class="relative flex flex-col"
  >
    <!-- 标签 -->
    <div v-if="label" class="mb-2 text-sm text-gray-600">{{ label }}</div>
    
    <!-- 图片展示区域 -->
    <div class="flex-1 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center w-full h-full">
      <!-- 已上传的图片列表 -->
      <div class="flex gap-2 items-center">
        <div 
          v-for="(url, index) in modelValue" 
          :key="index" 
          class="relative flex items-center justify-center bg-gray-50 rounded-md overflow-hidden group"
          :style="{ width: `${size}px`, height: `${size}px` }"
        >
          <img 
            :src="url" 
            :alt="label || '图片'" 
            class="object-contain w-full h-full cursor-pointer" 
            @click="handlePreview(url)"
          />
          <!-- 编辑状态显示预览和删除按钮 -->
          <div 
            class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-4 transition-opacity"
          >
            <button 
              type="button" 
              class="rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all"
              :style="buttonStyle"
              @click.prevent="() => handlePreview(url)"
            >
              <el-icon :style="iconSize"><ZoomIn /></el-icon>
            </button>
            <button
              v-if="editable"
              type="button"
              class="rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all"
              :style="buttonStyle"
              @click.prevent="() => handleDelete(index)"
            >
              <el-icon :style="iconSize"><Delete /></el-icon>
            </button>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div 
          v-if="showUploadArea"
          class="border border-dashed border-gray-300 rounded-md cursor-pointer flex justify-center items-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
          :style="{ width: `${size}px`, height: `${size}px` }"
          @click="triggerUpload"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          />
          <div class="flex flex-col items-center gap-2">
            <el-icon class="text-4xl"><Plus /></el-icon>
            <span class="text-sm">点击上传</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <div 
      v-if="previewVisible"
      class="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      @click.self="closePreview"
    >
      <div class="relative">
        <img 
          :src="previewUrl" 
          :alt="label || '预览图'" 
          :style="{ maxHeight: `${windowHeight * 0.9}px` }"
          class="max-w-[90vw] w-auto h-auto object-contain"
        />
        <button 
          type="button" 
          class="absolute -top-10 -right-10 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 hover:rotate-90 transition-all"
          @click.prevent="closePreview"
        >
          <el-icon class="text-lg font-bold"><Close /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Plus, ZoomIn, Delete, Close } from '@element-plus/icons-vue'

// 添加组件名称
defineOptions({
  name: 'ImageHandler'
})

const props = defineProps<{
  modelValue: string[]
  label?: string
  editable?: boolean
  size?: number
  limit?: number
  multiple?: boolean
}>()

const emit = defineEmits<{
  'update:model-value': [value: string[]]
  'preview': [url: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewVisible = ref(false)
const previewUrl = ref('')
const windowHeight = ref(0)

// 计算实际的限制数量
const actualLimit = computed(() => {
  const limit = props.limit ?? 1
  console.log('当前限制数量:', limit)
  return limit
})

// 计算是否显示上传区域
const showUploadArea = computed(() => {
  const shouldShow = props.editable && Array.isArray(props.modelValue) && props.modelValue.length < actualLimit.value
  
  return shouldShow
})

// 修改按钮样式计算属性
const buttonStyle = computed(() => ({
  width: `${props.size * 0.143}px`,   // 1:7 的比例
  height: `${props.size * 0.143}px`   // 1:7 的比例
}))

const iconSize = computed(() => ({
  fontSize: `${props.size * 0.143}px`  // 设置为容器尺寸的14.3%,保持1:7的比例
}))

// 添加 watch 来监控 editable 属性
watch(() => props.editable, (newVal) => {
  console.log('ImageHandler editable 属性变化:', {
    editable: newVal,
    modelValue: props.modelValue,
    hasImages: props.modelValue?.length > 0
  });
}, { immediate: true });

// 触发文件选择
const triggerUpload = () => {
  console.log('触发文件选择')
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    handleFile(input.files[0])
    // 重置 input 的值，这样相同的文件也能触发 change 事件
    input.value = ''
  }
}

// 处理拖放上传
const handleDrop = (event: DragEvent) => {
  console.log('处理文件拖放')
  const files = event.dataTransfer?.files
  if (files?.length) {
    handleFile(files[0])
  }
}

// 处理文件
const handleFile = (file: File) => {
  console.log('开始处理文件:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    currentModelValue: props.modelValue
  })

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
      const currentImages = Array.isArray(props.modelValue) ? props.modelValue : []
      console.log('当前图片数组状态:', {
        currentLength: currentImages.length,
        limit: actualLimit.value,
        canAdd: currentImages.length < actualLimit.value,
        currentImages
      })

      if (currentImages.length >= actualLimit.value) {
        alert(`最多只能上传${actualLimit.value}张图片`)
        return
      }

      const newImages = [...currentImages, result]
      console.log('更新后的图片数组:', {
        newLength: newImages.length,
        images: newImages
      })
      emit('update:model-value', newImages)
    }
  }
  reader.readAsDataURL(file)
}

// 处理预览
const handlePreview = (url: string) => {
  previewUrl.value = url
  previewVisible.value = true
}

// 关闭预览
const closePreview = () => {
  previewVisible.value = false
  previewUrl.value = ''
}

// 处理删除
const handleDelete = (index: number) => {
  console.log('删除图片:', {
    index,
    currentImages: props.modelValue,
    isArray: Array.isArray(props.modelValue)
  })

  if (!Array.isArray(props.modelValue)) return
  
  const newImages = [...props.modelValue]
  newImages.splice(index, 1)
  console.log('删除后的图片数组:', {
    newLength: newImages.length,
    images: newImages
  })
  emit('update:model-value', newImages)
}

// 更新窗口高度
const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight
}

// 组件挂载时添加事件监听
onMounted(() => {
  updateWindowHeight()
  window.addEventListener('resize', updateWindowHeight)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowHeight)
})
</script>

<script lang="ts">
// 添加默认导出
export default {
  name: 'ImageHandler'
}
</script> 