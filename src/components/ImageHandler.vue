<template>
  <div class="relative flex flex-col">
    <!-- 标签 -->
    <div v-if="label" class="mb-2 text-sm text-gray-600">{{ label }}</div>

    <!-- 图片展示区域 -->
    <div class="flex-1 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center w-full h-full">
      <!-- 已上传的图片列表 -->
      <div class="flex gap-2 items-center">
        <div v-for="(url, index) in normalizedModelValue" :key="index" class="relative flex items-center justify-center bg-gray-50 rounded-md overflow-hidden group" :style="{width: `${size}px`, height: `${size}px`}">
          <img :src="url" :alt="label || '图片'" class="object-contain w-full h-full cursor-pointer" @click="handlePreview(url)" />
          <!-- 编辑状态显示预览和删除按钮 -->
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-4 transition-opacity">
            <button type="button" class="rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all" :style="buttonStyle" @click.prevent="() => handlePreview(url)">
              <el-icon :style="iconSize"><ZoomIn /></el-icon>
            </button>
            <button v-if="editable" type="button" class="rounded-full flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all" :style="buttonStyle" @click.prevent="() => handleDelete(index)">
              <el-icon :style="iconSize"><Delete /></el-icon>
            </button>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div
          v-if="showUploadArea"
          class="border border-dashed border-gray-300 rounded-md cursor-pointer flex justify-center items-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
          :style="{width: `${size}px`, height: `${size}px`}"
          @click="
            () => {
              fileInput?.click()
            }
          "
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileChange" />
          <div class="flex flex-col items-center gap-2">
            <el-icon class="text-4xl"><Plus /></el-icon>
            <span class="text-sm">点击上传, 文件不能超过4M。</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <div v-if="previewVisible" class="fixed inset-0 bg-black/70 flex justify-center items-center z-50" @click.self="closePreview">
      <div class="relative">
        <img :src="previewUrl" :alt="label || '预览图'" :style="{maxHeight: `${windowHeight * 0.9}px`}" class="max-w-[90vw] w-auto h-auto object-contain" />
        <button type="button" class="absolute -top-10 -right-10 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 hover:rotate-90 transition-all" @click.prevent="closePreview">
          <el-icon class="text-lg font-bold"><Close /></el-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {Plus, ZoomIn, Delete, Close} from '@element-plus/icons-vue'
import {postFilesUpload, getFilesRemove} from '@/api'
import {ElMessage} from 'element-plus'

// 添加组件名称
defineOptions({
  name: 'ImageHandler'
})

interface ImageHandlerProps {
  modelValue: string | string[]
  label?: string
  editable?: boolean
  size?: number
  limit?: number
  multiple?: boolean
  customUpload?: (params: {file: File}) => Promise<string>
}

const props = withDefaults(defineProps<ImageHandlerProps>(), {
  size: 200,
  limit: 1,
  editable: false,
  multiple: false
})

const emit = defineEmits(['update:model-value', 'preview'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewVisible = ref(false)
const previewUrl = ref('')
const windowHeight = ref(0)

// 防抖函数
const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 处理上传按钮点击
const handleUploadClick = () => {
  if (fileInput.value) {
    fileInput.value.click()
  } else {
    console.error('文件输入元素不存在')
    ElMessage.error('无法打开文件选择框')
  }
}

// 计算实际的限制数量
const actualLimit = computed(() => {
  return props.limit
})

// 计算是否显示上传区域
const showUploadArea = computed(() => {
  const shouldShow = props.editable && normalizedModelValue.value.length < actualLimit.value
  return shouldShow
})

// 规范化modelValue，确保它始终是一个数组
const normalizedModelValue = computed<string[]>(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.filter(url => url && typeof url === 'string')
  } else if (props.modelValue && typeof props.modelValue === 'string') {
    return [props.modelValue]
  }
  return []
})

// 修改按钮样式计算属性
const buttonStyle = computed(() => ({
  width: `${props.size * 0.143}px`, // 1:7 的比例
  height: `${props.size * 0.143}px` // 1:7 的比例
}))

const iconSize = computed(() => ({
  fontSize: `${props.size * 0.143}px` // 设置为容器尺寸的14.3%,保持1:7的比例
}))

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
  const files = event.dataTransfer?.files
  if (files?.length) {
    handleFile(files[0])
  }
}

// 处理文件
const handleFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请上传图片文件')
    return
  }

  if (file.size > 4 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过4MB')
    return
  }

  try {
    let imageUrl = ''

    // 使用自定义上传函数或默认上传函数
    if (props.customUpload) {
      imageUrl = await props.customUpload({file})
      console.log('自定义上传返回的图片URL:', imageUrl)
    } else {
      // 调用API上传文件
      const response = await postFilesUpload({file})
      console.log('默认上传返回的响应:', response)

      // 从API返回中获取URL
      // 根据规则，忽略linter错误，直接使用response作为URL
      // 处理新的响应格式
      const result = response as {code: string; message: string; data: string}
      if (result.code === '200' && result.data) {
        // 移除可能存在的前导 '@' 符号
        imageUrl = result.data.replace(/^@/, '')
      } else {
        throw new Error('上传失败：' + result.message)
      }
    }

    // 确保获取到了图片URL
    if (!imageUrl) {
      console.error('无法获取图片URL')
      throw new Error('上传成功但无法获取图片地址')
    }

    console.log('最终使用的图片URL:', imageUrl)

    // 检查URL长度，防止数据库截断错误
    const MAX_URL_LENGTH = 255 // 数据库字段长度为255
    if (imageUrl.length > MAX_URL_LENGTH) {
      console.warn(`图片URL长度(${imageUrl.length})超过数据库限制(${MAX_URL_LENGTH})，进行截断处理`)
      ElMessage.warning('图片URL过长，已进行截断处理，可能影响图片显示')

      // 截断URL，保留最后的文件名部分
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const baseUrl = urlParts.slice(0, -1).join('/')

      // 计算可用长度
      const availableLength = MAX_URL_LENGTH - fileName.length - 1 // 减1是为了斜杠

      if (availableLength > 0) {
        // 保留文件名，截断中间部分
        imageUrl = baseUrl.substring(0, availableLength) + '/' + fileName
      } else {
        // 如果文件名都超过限制，则只保留文件名的一部分
        imageUrl = fileName.substring(0, MAX_URL_LENGTH)
      }
    }

    // 更新图片数组
    const currentImages = normalizedModelValue.value

    if (currentImages.length >= actualLimit.value) {
      ElMessage.warning(`最多只能上传${actualLimit.value}张图片`)
      return
    }

    const newImages = [...currentImages, imageUrl]
    console.log('更新后的图片数组:', newImages)

    // 发送更新事件
    if (props.multiple) {
      emit('update:model-value', newImages)
    } else {
      // 单图模式下，直接使用新上传的图片URL
      emit('update:model-value', [imageUrl])
      console.log('单图模式，发送的值:', [imageUrl])
    }

    ElMessage.success('图片上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('图片上传失败')

    // 如果上传失败，仍然可以使用base64作为备选方案（可选）
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result
      if (typeof result === 'string') {
        const currentImages = normalizedModelValue.value

        if (currentImages.length >= actualLimit.value) {
          ElMessage.warning(`最多只能上传${actualLimit.value}张图片`)
          return
        }

        const newImages = [...currentImages, result]
        console.log('使用本地预览的图片数组:', newImages)

        // 发送更新事件
        if (props.multiple) {
          emit('update:model-value', newImages)
        } else {
          // 单图模式下，直接使用新上传的图片
          emit('update:model-value', [result])
          console.log('单图模式(本地预览)，发送的值:', [result])
        }

        ElMessage.info('已使用本地预览图片，但未能上传到服务器')
      }
    }
    reader.readAsDataURL(file)
  }
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
const handleDelete = async (index: number) => {
  if (index < 0 || index >= normalizedModelValue.value.length) {
    return
  }

  const imageUrl = normalizedModelValue.value[index]

  // 从数组中移除图片
  const newImages = [...normalizedModelValue.value]
  newImages.splice(index, 1)

  // 根据multiple属性决定返回数组还是单个字符串
  emit('update:model-value', props.multiple ? newImages : newImages.length > 0 ? newImages[0] : '')

  // 在编辑状态下，只从界面移除图片，不从服务器删除
  // 实际的删除操作会在父组件的保存或取消函数中处理
  ElMessage.success('图片已从列表中移除')
}

// 更新窗口高度
const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight
}

// 组件挂载时添加事件监听
onMounted(() => {
  updateWindowHeight()
  window.addEventListener('resize', updateWindowHeight)

  // 检查fileInput引用是否正确
  setTimeout(() => {
    if (!fileInput.value) {
      console.warn('文件输入元素引用未找到，可能会影响上传功能')
    }
  }, 100)
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
