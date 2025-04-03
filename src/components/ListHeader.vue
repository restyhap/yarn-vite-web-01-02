<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-04-03 17:50:29
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-04-03 21:22:52
 * @FilePath: /yarn-vite-web-01-02/src/components/ListHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex justify-between items-center h-[60px] bg-gray-50 p-4 rounded-lg">
    <div class="flex items-center gap-6 flex-1">
      <h2 class="text-lg font-semibold text-gray-800 whitespace-nowrap min-w-[180px]">{{ title }}</h2>
      <div class="flex-1 max-w-[400px]">
        <el-input v-model="searchValue" :placeholder="searchPlaceholder" clearable @keyup.enter="handleSearch" @clear="handleClear">
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <el-button v-if="showExport" type="primary" :loading="exporting" :disabled="!hasSelected" @click="$emit('batch-export')" class="flex items-center">
        <el-icon class="mr-1"><Document /></el-icon>
        {{ exporting ? 'Exporting...' : 'Batch Export' }}
      </el-button>
      <el-button v-if="showDelete" type="danger" :disabled="!hasSelected" @click="$emit('batch-delete')" class="flex items-center">
        <el-icon class="mr-1"><Delete /></el-icon>
        Batch Delete
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Search, Document, Delete} from '@element-plus/icons-vue'
import {ref, watch} from 'vue'
import {ElMessage} from 'element-plus'

const props = defineProps<{
  title: string
  searchPlaceholder?: string
  showExport?: boolean
  showDelete?: boolean
  exporting?: boolean
  hasSelected?: boolean
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'clear'): void
  (e: 'batch-export'): void
  (e: 'batch-delete'): void
}>()

const searchValue = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  newVal => {
    searchValue.value = newVal || ''
  }
)

watch(searchValue, newVal => {
  emit('update:modelValue', newVal)
})

const handleSearch = () => {
  if (!searchValue.value.trim()) {
    ElMessage.warning('Please enter search content')
    return
  }
  emit('search')
}

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
}
</script>
