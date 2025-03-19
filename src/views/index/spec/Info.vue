<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-y h-screen">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="p-5">
          <el-skeleton-item variant="text" class="w-[30%]" />
          <el-skeleton-item variant="text" class="w-[40%]" />
          <el-skeleton-item variant="text" class="w-full" />
        </div>
      </template>

      <template #default>
        <!-- 顶部导航栏 -->
        <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
          <div class="flex justify-between items-center py-3 px-6">
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-gray-800">质检报告详情</h2>
            </div>
            <div class="flex gap-2">
              <el-button type="primary" @click="handleEdit('basic')" v-if="!isEditing">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="success" @click="handleSave" v-if="isEditing">
                <el-icon><Check /></el-icon>
                保存
              </el-button>
              <el-button type="danger" @click="handleCancel" v-if="isEditing">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
              <el-button type="primary" :loading="exporting" @click="handleExport" class="min-w-[120px]">
                <el-icon><Document /></el-icon>
                {{ exporting ? '导出中...' : '导出文档' }}
              </el-button>
              <el-button @click="router.back()">
                <el-icon><Back /></el-icon>
                返回
              </el-button>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
          <div class="p-6">
            <!-- 基本信息部分 -->
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>基本信息</span>
                </h3>
              </div>

              <!-- 基本信息表单 -->
              <el-form :model="formData" label-width="140px" class="[&_.el-form-item__label]:text-gray-600 [&_.el-form-item__label]:font-medium [&_.el-input__wrapper]:shadow-none [&_.el-input__inner]:h-[38px]">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
                  <template v-for="(label, key) in basicFields" :key="key">
                    <el-form-item v-if="key !== 'comments'" :label="label" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                      <!-- 编辑状态显示输入框 -->
                      <template v-if="editingSections.includes('basic')">
                        <el-input v-model="tempFormData.qcReports[key]" :placeholder="`请输入${label}`" class="w-full !h-[38px]" />
                      </template>
                      <!-- 非编辑状态显示文本 -->
                      <template v-else>
                        <div class="w-full text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px]">
                          {{ isEditing ? tempFormData.qcReports?.[key] || '-' : formData.qcReports?.[key] || '-' }}
                        </div>
                      </template>
                    </el-form-item>
                  </template>
                </div>

                <!-- 评价内容单独处理 -->
                <div class="mt-4">
                  <div class="bg-gray-100 p-1 rounded">
                    <div class="flex items-center mb-2">
                      <div class="min-w-[140px] px-2 text-gray-600 font-medium">{{ basicFields.comments }}</div>
                    </div>
                    <div class="w-full px-2">
                      <!-- 编辑状态显示文本域 -->
                      <template v-if="editingSections.includes('basic')">
                        <el-input v-model="tempFormData.qcReports.comments" type="textarea" :rows="3" placeholder="请输入评价内容" class="w-full" />
                      </template>
                      <!-- 非编辑状态显示文本 -->
                      <template v-else>
                        <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                          {{ isEditing ? tempFormData.qcReports?.comments || '-' : formData.qcReports?.comments || '-' }}
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </el-form>
            </div>

            <!-- 图片部分 -->
            <template v-for="(section, index) in imageSections" :key="index">
              <div class="mb-8">
                <div class="flex items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                    <span>{{ section.title }}</span>
                  </h3>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <template v-for="(label, key) in section.fields" :key="key">
                    <div class="bg-gray-100 p-4 rounded">
                      <div class="text-center text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>
                      <div class="w-full h-[240px] bg-white rounded-lg overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center">
                          <ImageHandler
                            :model-value="getImageValue(key)"
                            @update:model-value="val => updateImageValue(key, val)"
                            :editable="isEditing"
                            :size="200"
                            :custom-upload="handleCustomUpload"
                            :multiple="false"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </template>

            <!-- 缺陷记录部分 -->
            <div class="mb-8">
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                  <span>缺陷记录</span>
                  <el-button type="primary" @click="addDefectDialogVisible = true">
                    <el-icon><Plus /></el-icon>
                    添加缺陷记录
                  </el-button>
                </h3>
              </div>

              <!-- 添加缺陷记录弹窗 -->
              <DefectDialog v-model:visible="addDefectDialogVisible" title="添加缺陷记录" :loading="loading" :custom-upload="handleCustomUpload" @save="handleSaveNewDefect" @close="handleCloseDialog" />

              <div class="mt-4 space-y-6">
                <template v-for="(defectDto, index) in formData.defectsDTO" :key="defectDto.defects?.id">
                  <div :id="`defect-record-${index}`" class="rounded p-4 border border-gray-200">
                    <!-- 标题栏 -->
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                      <!-- 标题内容 -->
                      <div class="w-1/2 mr-4">
                        <div class="bg-gray-100 p-1 rounded">
                          <div class="flex items-center mb-2">
                            <div class="min-w-[140px] px-2 text-gray-600 font-medium">标题内容</div>
                          </div>
                          <div class="w-full px-2">
                            <template v-if="editingSections.includes(`defect-${index}`)">
                              <el-input v-model="tempFormData.defectsDTO[index].defects.defectTitle" placeholder="请输入标题内容" class="w-full !h-[38px]" />
                            </template>
                            <template v-else>
                              <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                                {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.defectTitle || '-' : defectDto.defects?.defectTitle || '-' }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>

                      <!-- 操作按钮 -->
                      <div class="flex gap-4">
                        <template v-if="editingSections.includes(`defect-${index}`)">
                          <el-button type="success" @click="handleSaveDefect(index, tempFormData.defectsDTO[index].defects)">
                            <el-icon><Check /></el-icon>
                            保存
                          </el-button>
                          <el-button type="danger" @click="handleCancelDefect(index)">
                            <el-icon><Close /></el-icon>
                            取消
                          </el-button>
                        </template>
                        <template v-else>
                          <el-button type="primary" @click="handleEditDefect(index)">
                            <el-icon><Edit /></el-icon>
                            编辑
                          </el-button>
                          <el-button type="danger" @click="handleDeleteDefect(index)">
                            <el-icon><Delete /></el-icon>
                            删除
                          </el-button>
                        </template>
                      </div>
                    </div>

                    <!-- 问题描述和检验员一行 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <!-- 问题描述 -->
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">问题描述</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.defectDescription" placeholder="请输入问题描述" class="w-full !h-[38px]" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.defectDescription || '-' : defectDto.defects?.defectDescription || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>

                      <!-- 质检员 -->
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">质检员</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.inspector" placeholder="请输入质检员" class="w-full !h-[38px]" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.inspector || '-' : defectDto.defects?.inspector || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- 改进建议独占一行 -->
                    <div class="mb-4">
                      <div class="bg-gray-100 p-1 rounded">
                        <div class="flex items-center mb-2">
                          <div class="min-w-[140px] px-2 text-gray-600 font-medium">改进建议</div>
                        </div>
                        <div class="w-full px-2">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input v-model="tempFormData.defectsDTO[index].defects.improvementSuggestion" type="textarea" :rows="3" placeholder="请输入改进建议" class="w-full" />
                          </template>
                          <template v-else>
                            <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                              {{ editingSections.includes(`defect-${index}`) && tempFormData.defectsDTO?.[index]?.defects ? tempFormData.defectsDTO[index].defects.improvementSuggestion || '-' : defectDto.defects?.improvementSuggestion || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- 缺陷图片 -->
                    <div class="bg-gray-100 p-4 rounded">
                      <div class="text-center text-sm text-gray-600 mb-2 font-medium">缺陷图片</div>
                      <div class="w-full h-[200px] bg-white rounded-lg overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center">
                          <ImageHandler
                            :model-value="editingSections.includes(`defect-${index}`) 
                              ? ([...new Set(tempFormData?.defectsDTO?.[index]?.defectImages?.map((img: any) => img.imagePath).filter(Boolean) || [])]) 
                              : ([...new Set(getDefectImages(defectDto))])"
                            @update:model-value="val => handleDefectImageUpdate(val, defectDto.defects?.id, index)"
                            :editable="editingSections.includes(`defect-${index}`)"
                            :size="200"
                            :custom-upload="params => handleDefectCustomUpload(params, defectDto.defects?.id, index)"
                            :multiple="true"
                            :limit="2"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto [&_.el-upload]:w-full [&_.el-upload]:h-full [&_.el-upload]:flex [&_.el-upload]:items-center [&_.el-upload]:justify-center [&_.el-upload-dragger]:w-full [&_.el-upload-dragger]:h-full [&_.el-upload-dragger]:flex [&_.el-upload-dragger]:items-center [&_.el-upload-dragger]:justify-center [&_.el-upload-dragger]:border-2 [&_.el-upload-dragger]:border-dashed [&_.el-upload-dragger]:border-gray-300 hover:[&_.el-upload-dragger]:border-blue-500 [&_.el-upload__tip]:hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, nextTick} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Document, Edit, Check, Close, Delete, Plus, Back, CircleClose} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {exportQCReport} from '@/utils/exportQCReport'
import type {QCReportData} from '@/utils/exportQCReport'
import {QcReports, QcReportsDto, DefectImages, Defects, DefectsDto} from '@/api'
import {putQcReportsUpdate, getQcReportsDtoGetById, getFilesRemove, postFilesUpload, postDefectImagesSave, deleteDefectImagesRemoveById, deleteDefectsRemoveById, putDefectsUpdate, putDefectImagesUpdate, postDefectsSave} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'
import {getId} from '@/utils/idUtils'
import DefectDialog from '@/components/DefectDialog.vue'

// 数据相关
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const editingSections = ref<string[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 添加调试模式开关
const showDebugInfo = ref(false) // 可以根据需要设置为true或false

const formData = ref<QcReportsDto>({} as QcReportsDto)

const tempFormData = ref<any>(null)

const tempFiles = ref<string[]>([])

// 基本字段映射
const basicFields = {
  modelCode: '型号',
  factoryCode: '工厂代码',
  poNumber: '订单号',
  inspectionDate: '检验日期',
  inspectQty: '检验数量',
  qcOfficer: '质检员',
  passFail: '检验结果',
  secondQcDate: '二次检验日期',
  comments: '评价内容'
} as const

// 图片部分定义
const imageSections = {
  appearance: {
    title: '产品外观',
    fields: {
      stocksInWarehouse: '仓库库存',
      samplingOfProductsQuantity: '产品抽样数量',
      shippingMarks: '运输标记',
      barcode: '条形码',
      packingOutside: '外包装',
      packingInside: '内包装'
    }
  },
  chairComponents: {
    title: '椅子组件',
    fields: {
      chairComponentsPacked: '已包装',
      chairComponentsUnpacked: '未包装'
    }
  },
  fittingPack: {
    title: '配件包',
    fields: {
      fittingPackPacked: '已包装',
      fittingPackUnpacked: '未包装'
    }
  },
  labelsAndInstructions: {
    title: '标签和说明',
    fields: {
      productionLabel: '生产标签',
      assemblyInstructions: '组装说明'
    }
  },
  components: {
    title: '组件图片',
    fields: {
      imageOfComponentsSeat: '座椅',
      imageOfComponentsBack: '靠背',
      imageOfComponentsBase: '底座',
      imageOfComponentsCastors: '脚轮',
      imageOfComponentsGasLiftCover: '气压棒外罩',
      imageOfComponentsGasLiftStamp: '气压棒标记',
      imageOfComponentsArmrest: '扶手',
      imageOfComponentMechanism: '机构',
      imageOfComponentsHeadrest: '头枕'
    }
  },
  finishedProduct: {
    title: '成品图片',
    fields: {
      imageOfProductBuiltFront: '正视图',
      imageOfProductBuiltSide: '侧视图',
      imageOfProductBuiltBack: '背视图',
      imageOfProductBuilt45Degree: '45度视图',
      frontImageOfProductBuiltCompare1: '样品对比图1',
      frontImageOfProductBuiltCompare2: '样品对比图2'
    }
  },
  functionCheck: {
    title: '功能检查',
    fields: {
      functionCheckSeatHeightExtension: '座椅高度调节',
      functionCheckMechanismAdjustment: '机构调节',
      functionCheckArmrestAdjustment: '扶手调节',
      functionCheckHeadrestAdjustment: '头枕调节',
      functionCheckOther1: '其他1',
      functionCheckOther2: '其他2'
    }
  }
} as const

// 添加导出状态变量和AbortController
const exporting = ref(false)
const abortController = ref<AbortController | null>(null)

const getData = async () => {
  console.log((' route.params.id as string ======== ' + route.params.id) as string)
  const res = await getQcReportsDtoGetById({id: route.params.id as string})

  // 打印原始数据，用于调试
  console.log('原始res.data ======== ' + JSON.stringify(res.data))

  // 检查defectsDTO数据
  if (res.data && Array.isArray(res.data.defectsDTO)) {
    console.log('缺陷记录数量:', res.data.defectsDTO.length)

    // 打印每条记录的ID，用于检查是否有重复
    res.data.defectsDTO.forEach((dto: DefectsDto, index: number) => {
      console.log(`缺陷记录 #${index + 1}:`, dto.defects?.id, dto.defects?.defectTitle, '图片数量:', dto.defectImages?.length || 0)
    })

    // 确保每个defectsDTO对象都是独立的（深拷贝）
    res.data.defectsDTO = res.data.defectsDTO.map((dto: DefectsDto) => {
      // 使用JSON序列化和反序列化进行深拷贝
      return JSON.parse(JSON.stringify(dto))
    })

    // 使用Map去重，确保没有重复的defectId
    const uniqueMap = new Map()
    const uniqueDefects: DefectsDto[] = []

    for (const defectDto of res.data.defectsDTO) {
      if (defectDto.defects) {
        const defectId = defectDto.defects.id
        // 如果这个ID还没有被添加过，则添加到结果中
        if (!uniqueMap.has(defectId)) {
          uniqueMap.set(defectId, true)
          uniqueDefects.push(defectDto)
        } else {
          console.warn(`发现重复的缺陷记录ID: ${defectId}`)
        }
      }
    }

    // 用去重后的数据替换原数据
    res.data.defectsDTO = uniqueDefects

    // 打印处理后的数据，用于验证
    console.log('处理后的缺陷记录数量:', res.data.defectsDTO.length)
    res.data.defectsDTO.forEach((dto: DefectsDto, index: number) => {
      console.log(`处理后缺陷记录 #${index + 1}:`, dto.defects?.id, dto.defects?.defectTitle)
    })
  }

  // 使用深拷贝确保formData不会受到后续操作的影响
  formData.value = JSON.parse(JSON.stringify(res.data))
  loading.value = false
}

// 添加初始化
onMounted(() => {
  getData()

  // 检查 URL 查询参数，如果有 edit=true，则自动进入编辑状态
  if (route.query.edit === 'true') {
    // 确保数据已加载
    if (formData.value) {
      handleEdit('basic')
    } else {
      ElMessage.warning('数据加载失败，无法进入编辑模式')
    }
  }
})

// 添加缺失的变量和函数
const addDefectDialogVisible = ref(false)
const isEditing = ref(false)

// 根据编辑状态获取图片值
const getImageValue = (key: string) => {
  if (isEditing.value && tempFormData.value?.qcReports) {
    // 编辑状态下从临时数据获取
    const value = tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]

    // 处理不同类型的值
    if (typeof value === 'string') {
      // 如果是字符串，且不为空，则包装为数组返回
      return value ? [value] : []
    } else if (Array.isArray(value)) {
      // 如果已经是数组，则直接返回
      return value
    } else if (value === null || value === undefined) {
      // 如果是null或undefined，返回空数组
      return []
    } else {
      // 其他类型（如数字等），转为字符串后包装为数组
      return [String(value)]
    }
  } else if (formData.value?.qcReports) {
    // 非编辑状态下从正式数据获取
    const value = formData.value.qcReports[key as keyof typeof formData.value.qcReports]

    // 处理不同类型的值
    if (typeof value === 'string') {
      // 如果是字符串，且不为空，则包装为数组返回
      return value ? [value] : []
    } else if (Array.isArray(value)) {
      // 如果已经是数组，则直接返回
      return value
    } else if (value === null || value === undefined) {
      // 如果是null或undefined，返回空数组
      return []
    } else {
      // 其他类型（如数字等），转为字符串后包装为数组
      return [String(value)]
    }
  }
  return []
}

// 临时存储上传的图片路径，用于取消时删除
const tempUploadedImages = ref<{[key: string]: string[]}>({})

// 存储待执行的操作（添加、删除、更新）
const pendingOperations = ref<{
  [key: string]: {
    toDelete: {id?: string; path: string}[]
    toAdd: {defectId?: string; path: string}[]
    toUpdate: {id: string; defectId?: string; path: string}[]
  }
}>({})

// 初始化待执行操作
const initPendingOperations = (key: string) => {
  if (!pendingOperations.value[key]) {
    pendingOperations.value[key] = {
      toDelete: [],
      toAdd: [],
      toUpdate: []
    }
  }
}

// 处理图片值更新
const updateImageValue = async (key: string, val: string | string[]) => {
  console.log(`更新图片值 - 键: ${key}, 值:`, val)
  console.log('当前编辑状态:', isEditing.value)

  // 确保val是有效值
  let newValue = ''

  // 处理不同类型的输入值
  if (Array.isArray(val)) {
    // 如果是数组（图片URL数组）
    if (val.length > 0) {
      newValue = val[0]
      console.log('处理数组值，使用第一个元素:', newValue)
    }
  } else if (typeof val === 'string') {
    // 如果是字符串（直接是字符串值）
    newValue = val
    console.log('处理字符串值:', newValue)
  }

  // 根据编辑状态决定更新哪个数据对象
  if (isEditing.value && tempFormData.value?.qcReports) {
    // 编辑状态下更新临时数据
    console.log('更新前的临时数据:', JSON.stringify(tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]))

    // 获取旧值，用于检查是否需要删除服务器上的图片
    const oldValue = tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]

    // 初始化basic操作
    initPendingOperations('basic')

    // 检查是否是删除操作（旧值存在但新值为空）
    if (oldValue && !newValue) {
      console.log(`检测到删除操作 - 键: ${key}, 旧值:`, oldValue)

      // 记录被删除的图片路径
      if (typeof oldValue === 'string' && oldValue.startsWith('http')) {
        pendingOperations.value['basic'].toDelete.push({path: oldValue})
        console.log(`记录需要删除的图片路径: ${oldValue} 到 basic`)
      }
    } else if (newValue && oldValue !== newValue) {
      // 如果是新上传的图片，记录旧图片路径用于可能的删除
      if (oldValue && typeof oldValue === 'string' && oldValue.startsWith('http')) {
        // 记录被替换的图片路径
        pendingOperations.value['basic'].toDelete.push({path: oldValue})
        console.log(`记录被替换的图片路径: ${oldValue} 到 basic`)
      }

      // 记录新上传的图片路径
      if (newValue.startsWith('http')) {
        // 初始化临时存储
        if (!tempUploadedImages.value['newUploads']) {
          tempUploadedImages.value['newUploads'] = []
        }
        tempUploadedImages.value['newUploads'].push(newValue)
        console.log(`记录新上传的图片到 newUploads: ${newValue}`)
      }
    }

    tempFormData.value.qcReports = {
      ...tempFormData.value.qcReports,
      [key]: newValue
    }

    console.log('更新后的临时数据:', JSON.stringify(tempFormData.value.qcReports[key as keyof typeof tempFormData.value.qcReports]))
  } else if (formData.value?.qcReports) {
    // 非编辑状态下更新正式数据
    console.log('更新前的正式数据:', JSON.stringify(formData.value.qcReports[key as keyof typeof formData.value.qcReports]))

    // 获取旧值，用于检查是否需要删除服务器上的图片
    const oldValue = formData.value.qcReports[key as keyof typeof formData.value.qcReports]

    // 检查是否是删除操作（旧值存在但新值为空）
    if (oldValue && !newValue) {
      console.log(`检测到删除操作 - 键: ${key}, 旧值:`, oldValue)

      try {
        // 从服务器删除图片文件
        if (typeof oldValue === 'string' && oldValue.startsWith('http')) {
          await getFilesRemove({filePath: oldValue})
          console.log(`已从服务器删除图片文件: ${oldValue}`)
        }
      } catch (error) {
        console.error(`删除服务器图片文件失败: ${oldValue}`, error)
        ElMessage.warning('图片文件删除失败，但已从记录中移除')
      }
    }

    formData.value.qcReports = {
      ...formData.value.qcReports,
      [key]: newValue
    }

    console.log('更新后的正式数据:', JSON.stringify(formData.value.qcReports[key as keyof typeof formData.value.qcReports]))
  }
}

// 自定义上传图片处理函数
const handleCustomUpload = async (params: {file: File}) => {
  try {
    // 直接使用File对象
    const res = await postFilesUpload({file: params.file})
    const imagePath = res.data

    // 初始化临时存储
    if (!tempUploadedImages.value['newDefect']) {
      tempUploadedImages.value['newDefect'] = []
    }

    // 添加到临时上传图片列表
    tempUploadedImages.value['newDefect'].push(imagePath)
    console.log(`已添加临时图片: ${imagePath} 到 newDefect`)

    return imagePath
  } catch (error) {
    console.error('上传图片失败', error)
    ElMessage.error('上传图片失败')
    return ''
  }
}

const handleCloseDialog = async () => {
  // 如果有临时上传的图片，需要删除
  if (tempUploadedImages.value['newDefect'] && tempUploadedImages.value['newDefect'].length > 0) {
    try {
      // 删除已上传的图片
      for (const imagePath of tempUploadedImages.value['newDefect']) {
        if (imagePath && imagePath.startsWith('http')) {
          await getFilesRemove({filePath: imagePath})
          console.log(`已从服务器删除临时图片: ${imagePath}`)
        }
      }
      tempUploadedImages.value['newDefect'] = [] // 清空临时图片列表
    } catch (error) {
      console.error('删除临时图片失败', error)
    }
  }

  addDefectDialogVisible.value = false
}

// 处理编辑
const handleEdit = (section: string) => {
  isEditing.value = true
  // 创建临时表单数据的深拷贝
  tempFormData.value = JSON.parse(JSON.stringify(formData.value))

  // 确保tempFormData.qcReports存在
  if (!tempFormData.value.qcReports) {
    tempFormData.value.qcReports = {}
  }

  editingSections.value.push(section)
}

// 处理缺陷记录相关函数
const handleSaveNewDefect = async (defect: any) => {
  try {
    loading.value = true

    // 设置报告ID
    defect.reportId = formData.value.qcReports?.id

    // 1. 先保存缺陷记录
    const saveDefectRes = await postDefectsSave(defect)
    const defectId = saveDefectRes.data.id

    if (!defectId) {
      ElMessage.error('保存缺陷记录失败')
      return
    }

    // 2. 保存缺陷图片
    const defectImages =
      defect.images?.map((img: any) => ({
        defectId,
        imagePath: img.imagePath
      })) || []

    if (defectImages.length > 0) {
      await postDefectImagesSave(defectImages)
    }

    // 3. 更新本地数据
    if (!formData.value.defectsDTO) {
      formData.value.defectsDTO = []
    }

    // 获取最新的缺陷记录数据
    const updatedDefect = {
      defects: {
        id: defectId,
        reportId: defect.reportId,
        defectTitle: defect.defectTitle,
        defectDescription: defect.defectDescription,
        improvementSuggestion: defect.improvementSuggestion,
        inspector: defect.inspector,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      defectImages:
        defect.images?.map((img: any) => ({
          id: img.id,
          defectId,
          imagePath: img.imagePath,
          createdAt: img.createdAt,
          updatedAt: img.updatedAt
        })) || []
    }

    formData.value.defectsDTO.push(updatedDefect)
    ElMessage.success('添加缺陷记录成功')
  } catch (error) {
    console.error('添加缺陷记录失败', error)
    ElMessage.error('添加缺陷记录失败')
  } finally {
    loading.value = false
    addDefectDialogVisible.value = false
  }
}

const handleEditDefect = (index: number) => {
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }

  // 初始化该缺陷记录的临时图片存储和操作
  const defectKey = `defect-${index}`
  if (!tempUploadedImages.value[defectKey]) {
    tempUploadedImages.value[defectKey] = []
  }

  // 初始化待执行操作
  initPendingOperations(defectKey)

  editingSections.value.push(defectKey)
}

const handleSaveDefect = async (index: number, defect: any) => {
  try {
    loading.value = true
    const defectKey = `defect-${index}`

    // 1. 更新缺陷基本信息
    await putDefectsUpdate(defect)

    // 2. 获取当前缺陷记录的图片数据
    const currentDefectDto = formData.value.defectsDTO?.[index]
    const tempDefectDto = tempFormData.value.defectsDTO?.[index]

    if (currentDefectDto && tempDefectDto) {
      // 3. 执行待执行的操作
      if (pendingOperations.value[defectKey]) {
        const operations = pendingOperations.value[defectKey]

        // 3.1 执行删除操作
        for (const item of operations.toDelete) {
          try {
            if (item.id) {
              // 从数据库中删除图片记录
              await deleteDefectImagesRemoveById({id: item.id})
              console.log(`已从数据库删除图片记录: ${item.id}`)
            }

            // 从服务器删除图片文件
            if (item.path) {
              await getFilesRemove({filePath: item.path})
              console.log(`已从服务器删除图片文件: ${item.path}`)
            }
          } catch (error) {
            console.error(`删除图片失败: ${item.path}`, error)
          }
        }

        // 3.2 执行添加操作
        for (const item of operations.toAdd) {
          try {
            // 添加新图片到数据库
            const imageData: DefectImages = {
              id: getId(), // 使用getId()函数生成新的ID
              defectId: defect.id,
              imagePath: item.path
            }
            await postDefectImagesSave(imageData)
            console.log(`已添加新图片: ${item.path}`)
          } catch (error) {
            console.error(`添加新图片失败: ${item.path}`, error)
          }
        }

        // 3.3 执行更新操作
        for (const item of operations.toUpdate) {
          try {
            // 更新现有图片
            await putDefectImagesUpdate({
              id: item.id,
              defectId: defect.id,
              imagePath: item.path
            })
            console.log(`已更新图片: ${item.id}`)
          } catch (error) {
            console.error(`更新图片失败: ${item.id}`, error)
          }
        }

        // 清空待执行操作
        pendingOperations.value[defectKey] = {
          toDelete: [],
          toAdd: [],
          toUpdate: []
        }
      }

      // 4. 清理临时上传的图片
      if (tempUploadedImages.value[defectKey] && tempUploadedImages.value[defectKey].length > 0) {
        // 清空该部分的临时图片记录
        tempUploadedImages.value[defectKey] = []
      }

      // 5. 更新本地数据
      // 使用深拷贝确保数据独立
      if (formData.value.defectsDTO) {
        formData.value.defectsDTO[index] = JSON.parse(JSON.stringify(tempDefectDto))
      }
    }

    // 6. 退出编辑模式
    editingSections.value = editingSections.value.filter(item => item !== defectKey)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleCancelDefect = async (index: number) => {
  const defectKey = `defect-${index}`

  // 检查是否有临时上传的缺陷图片需要删除
  if (tempFormData.value?.defectsDTO?.[index]) {
    const originalDefect = formData.value.defectsDTO?.[index]
    const tempDefect = tempFormData.value.defectsDTO[index]

    // 获取原始图片路径
    const originalImagePaths = originalDefect?.defectImages?.map((img: DefectImages) => img.imagePath).filter(Boolean) || []

    // 获取临时图片路径
    const tempImagePaths = tempDefect?.defectImages?.map((img: DefectImages) => img.imagePath).filter(Boolean) || []

    // 找出临时添加的图片路径（在临时数据中存在但在原始数据中不存在）
    const newImagePaths = tempImagePaths.filter((path: string) => !originalImagePaths.includes(path))

    // 删除服务器上的临时图片文件
    if (newImagePaths.length > 0) {
      console.log(`检测到取消编辑缺陷记录时需要删除的临时图片:`, newImagePaths)

      for (const imagePath of newImagePaths) {
        try {
          // 从服务器删除图片文件
          if (imagePath && typeof imagePath === 'string' && imagePath.startsWith('http')) {
            await getFilesRemove({filePath: imagePath})
            console.log(`已从服务器删除临时缺陷图片文件: ${imagePath}`)
          }
        } catch (error) {
          console.error(`删除服务器临时缺陷图片文件失败: ${imagePath}`, error)
        }
      }
    }

    // 检查临时存储的图片
    if (tempUploadedImages.value[defectKey] && tempUploadedImages.value[defectKey].length > 0) {
      console.log(`取消编辑，删除${defectKey}部分记录的临时图片:`, tempUploadedImages.value[defectKey])

      // 删除所有记录的临时图片
      for (const path of tempUploadedImages.value[defectKey]) {
        if (path && path.startsWith('http')) {
          try {
            await getFilesRemove({filePath: path})
            console.log('已从服务器删除临时图片:', path)
          } catch (error) {
            console.error('从服务器删除临时图片失败:', error)
          }
        }

        // 清空该部分的临时图片记录
        tempUploadedImages.value[defectKey] = []
      }

      // 清空待执行操作
      pendingOperations.value[defectKey] = {
        toDelete: [],
        toAdd: [],
        toUpdate: []
      }
    }
  }

  // 清空待执行操作
  if (pendingOperations.value[defectKey]) {
    pendingOperations.value[defectKey] = {
      toDelete: [],
      toAdd: [],
      toUpdate: []
    }
  }

  // 恢复原始数据
  if (formData.value?.defectsDTO?.[index] && tempFormData.value?.defectsDTO?.[index]) {
    tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(formData.value.defectsDTO[index]))
  }

  // 移除编辑状态
  editingSections.value = editingSections.value.filter(item => item !== defectKey)
}

const handleDeleteDefect = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条缺陷记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const defectDto = formData.value.defectsDTO?.[index]
    const defectId = defectDto?.defects?.id

    if (defectId) {
      // 1. 先删除所有相关的图片文件
      const defectImages = defectDto?.defectImages || []
      if (defectImages.length > 0) {
        console.log(`删除缺陷记录 ${defectId} 的 ${defectImages.length} 张图片`)

        // 删除每张图片
        for (const img of defectImages) {
          if (img.imagePath) {
            try {
              // 从服务器删除图片文件
              await getFilesRemove({filePath: img.imagePath})
              console.log(`已从服务器删除图片文件: ${img.imagePath}`)
            } catch (error) {
              console.error(`删除服务器图片文件失败: ${img.imagePath}`, error)
            }
          }
        }
      }

      // 2. 删除缺陷记录（数据库会级联删除相关的图片记录）
      await deleteDefectsRemoveById({id: defectId})

      // 3. 更新本地数据
      formData.value.defectsDTO?.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleDefectImageUpdate = async (val: string | string[], defectId: string | undefined, index: number) => {
  if (!formData.value.defectsDTO?.[index]) return
  const defectKey = `defect-${index}`

  console.log(`更新缺陷图片 - 索引: ${index}, 值:`, val)

  // 确保tempFormData已初始化
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }

  // 确保tempFormData.defectsDTO[index]存在
  if (!tempFormData.value.defectsDTO) {
    tempFormData.value.defectsDTO = []
  }

  if (!tempFormData.value.defectsDTO[index]) {
    // 使用可选链操作符安全地访问 formData.value.defectsDTO
    const originalDefect = formData.value?.defectsDTO?.[index]
    if (originalDefect) {
      tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(originalDefect))
    } else {
      // 如果原始数据不存在，创建一个空对象
      tempFormData.value.defectsDTO[index] = {
        defects: {id: defectId},
        defectImages: []
      }
    }
  }

  // 确保当前缺陷记录在编辑状态
  if (!editingSections.value.includes(defectKey)) {
    console.log(`缺陷记录 ${index} 不在编辑状态，添加到编辑状态`)
    editingSections.value.push(defectKey)
  }

  // 处理不同类型的输入值
  let imageArray: string[] = []
  if (Array.isArray(val)) {
    // 如果是数组，直接使用
    imageArray = val
  } else if (typeof val === 'string' && val) {
    // 如果是非空字符串，包装为数组
    imageArray = [val]
  }

  // 确保defectImages已初始化
  if (!tempFormData.value.defectsDTO[index].defectImages) {
    tempFormData.value.defectsDTO[index].defectImages = []
  }

  // 获取当前缺陷图片，用于检查是否有图片被删除
  const currentImages = tempFormData.value.defectsDTO[index].defectImages || []
  const currentImagePaths = currentImages.map(img => img.imagePath).filter(Boolean)

  // 初始化待执行操作
  initPendingOperations(defectKey)

  // 找出被删除的图片路径
  const deletedImagePaths = currentImagePaths.filter(path => !imageArray.includes(path))

  // 找出新增的图片路径
  const addedImagePaths = imageArray.filter(path => !currentImagePaths.includes(path))

  // 处理被删除的图片
  if (deletedImagePaths.length > 0) {
    console.log(`检测到删除的缺陷图片:`, deletedImagePaths)

    // 初始化临时存储
    if (!tempUploadedImages.value[defectKey]) {
      tempUploadedImages.value[defectKey] = []
    }

    // 处理每个被删除的图片
    for (const imagePath of deletedImagePaths) {
      if (imagePath && imagePath.startsWith('http')) {
        // 找到对应的图片对象
        const imageObj = currentImages.find(img => img.imagePath === imagePath)

        if (imageObj && imageObj.id) {
          // 记录需要删除的图片
          pendingOperations.value[defectKey].toDelete.push({
            id: imageObj.id,
            path: imagePath
          })
          console.log(`记录需要删除的图片: ID=${imageObj.id}, 路径=${imagePath}`)
        } else {
          // 如果没有ID（可能是新上传但未保存的图片），只记录路径
          pendingOperations.value[defectKey].toDelete.push({
            path: imagePath
          })
          console.log(`记录需要删除的图片: 路径=${imagePath}`)
        }
      }
    }
  }

  // 处理新增的图片
  if (addedImagePaths.length > 0) {
    console.log(`检测到新增的缺陷图片:`, addedImagePaths)

    for (const imagePath of addedImagePaths) {
      if (imagePath && imagePath.startsWith('http')) {
        // 记录需要添加的图片
        pendingOperations.value[defectKey].toAdd.push({
          defectId,
          path: imagePath
        })
        console.log(`记录需要添加的图片: 路径=${imagePath}`)
      }
    }
  }

  // 更新临时数据中的图片路径
  const images = imageArray.map(path => ({
    id: getId(), // 使用getId()函数生成新的ID
    defectId,
    imagePath: path
  }))

  // 保留原有图片的ID，只更新保留下来的图片
  if (tempFormData.value.defectsDTO[index].defectImages) {
    tempFormData.value.defectsDTO[index].defectImages = images.map(img => {
      // 查找是否有匹配的现有图片（保留ID）
      const existingImage = currentImages.find(existing => existing.imagePath === img.imagePath)
      return {
        id: existingImage?.id || getId(), // 如果存在现有ID则使用，否则生成新ID
        defectId: img.defectId,
        imagePath: img.imagePath,
        createdAt: existingImage?.createdAt,
        updatedAt: existingImage?.updatedAt
      }
    })
  } else {
    // 如果defectImages不存在，则创建它
    tempFormData.value.defectsDTO[index].defectImages = images
  }

  // 强制触发视图更新
  tempFormData.value = JSON.parse(JSON.stringify(tempFormData.value))

  console.log(`更新后的临时数据(完整):`, tempFormData.value.defectsDTO[index])
}

const handleDefectCustomUpload = async (params: {file: File}, defectId: string | undefined, index: number) => {
  const defectKey = `defect-${index}`

  try {
    // 确保当前缺陷记录在编辑状态
    if (!editingSections.value.includes(defectKey)) {
      console.log(`缺陷记录 ${index} 不在编辑状态，添加到编辑状态`)
      editingSections.value.push(defectKey)
    }

    // 确保tempFormData已初始化
    if (!tempFormData.value) {
      tempFormData.value = JSON.parse(JSON.stringify(formData.value))
    }

    // 直接使用File对象
    const res = await postFilesUpload({file: params.file})
    const imagePath = res.data

    // 初始化临时存储
    if (!tempUploadedImages.value[defectKey]) {
      tempUploadedImages.value[defectKey] = []
    }

    // 初始化待执行操作
    initPendingOperations(defectKey)

    // 添加到临时上传图片列表
    tempUploadedImages.value[defectKey].push(imagePath)
    console.log(`已添加临时图片: ${imagePath} 到 ${defectKey}`)

    // 确保临时数据中的defectsDTO[index]已初始化
    if (!tempFormData.value.defectsDTO) {
      tempFormData.value.defectsDTO = []
    }

    if (!tempFormData.value.defectsDTO[index]) {
      if (formData.value?.defectsDTO?.[index]) {
        tempFormData.value.defectsDTO[index] = JSON.parse(JSON.stringify(formData.value.defectsDTO[index]))
      } else {
        // 如果原始数据不存在，创建一个空对象
        tempFormData.value.defectsDTO[index] = {
          defects: {id: defectId},
          defectImages: []
        }
      }
    }

    // 确保临时数据中的defectImages已初始化
    if (!tempFormData.value.defectsDTO[index].defectImages) {
      tempFormData.value.defectsDTO[index].defectImages = []
    }

    // 检查图片是否已存在，避免重复添加
    const existingImagePaths = tempFormData.value.defectsDTO[index].defectImages.map(img => img.imagePath)
    if (existingImagePaths.includes(imagePath)) {
      console.log(`图片已存在，不重复添加: ${imagePath}`)
      return imagePath
    }

    // 直接将新图片添加到临时数据中
    const newImage = {
      id: getId(),
      defectId,
      imagePath
    }

    // 将新图片添加到临时数据中
    tempFormData.value.defectsDTO[index].defectImages.push(newImage)

    // 记录需要添加的图片
    pendingOperations.value[defectKey].toAdd.push({
      defectId,
      path: imagePath
    })

    console.log(`直接添加新图片到临时数据: ${imagePath}`)

    // 强制更新视图
    tempFormData.value = JSON.parse(JSON.stringify(tempFormData.value))
    console.log(`更新后的临时数据(完整):`, tempFormData.value.defectsDTO[index])

    return imagePath
  } catch (error) {
    console.error('上传图片失败', error)
    ElMessage.error('上传图片失败')
    return ''
  }
}

// 添加计算属性处理缺陷图片
const getDefectImages = (defectDto: DefectsDto) => {
  // 查找索引
  const index = formData.value.defectsDTO?.findIndex(dto => dto.defects?.id === defectDto.defects?.id) || -1
  const defectKey = `defect-${index}`

  console.log(`获取缺陷图片 - 索引: ${index}, 编辑状态: ${editingSections.value.includes(defectKey)}`)

  // 检查是否在编辑状态
  if (editingSections.value.includes(defectKey) && tempFormData.value?.defectsDTO?.[index]) {
    // 确保defectImages存在
    if (tempFormData.value.defectsDTO[index].defectImages) {
      // 编辑状态下从临时数据获取
      const tempDefectImages = tempFormData.value.defectsDTO[index].defectImages || []
      const imagePaths = tempDefectImages.map(img => img.imagePath).filter(Boolean)
      console.log(`返回临时数据的图片路径:`, imagePaths)
      return imagePaths
    }
  }

  // 非编辑状态下使用原始数据
  if (!defectDto.defectImages) return []

  // 处理图片路径数组
  const imagePaths: string[] = []

  // 遍历缺陷图片
  for (const img of defectDto.defectImages) {
    if (img.imagePath && typeof img.imagePath === 'string') {
      imagePaths.push(img.imagePath)
    }
  }

  console.log(`返回原始数据的图片路径:`, imagePaths)
  return imagePaths
}

const handleExport = async () => {
  exporting.value = true
  try {
    ElMessage.info('正在准备导出文档，请稍候...')

    // 初始化AbortController
    abortController.value = new AbortController()
    const signal = abortController.value.signal

    // 准备导出数据
    if (!formData.value?.qcReports) {
      ElMessage.error('没有可导出的数据')
      exporting.value = false
      return
    }

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    const qcReports = formData.value.qcReports
    const defects =
      formData.value.defectsDTO?.map(dto => ({
        defectTitle: dto.defects?.defectTitle || '',
        defectDescription: dto.defects?.defectDescription || '',
        improvementSuggestion: dto.defects?.improvementSuggestion || '',
        inspector: dto.defects?.inspector || '',
        images: dto.defectImages?.map(img => img.imagePath || '') || []
      })) || []

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    // 构建导出数据
    const exportData: QCReportData = {
      modelCode: qcReports.modelCode || '',
      factoryCode: qcReports.factoryCode || '',
      supplier: qcReports.supplier || '',
      client: qcReports.client || '',
      poNumber: qcReports.poNumber || '',
      inspectionDate: qcReports.inspectionDate || '',
      orderQty: Number(qcReports.orderQty) || 0,
      reportDate: qcReports.reportDate || new Date().toISOString().split('T')[0],
      inspectQty: Number(qcReports.inspectQty) || 0,
      qcOfficer: qcReports.qcOfficer || '',
      passFail: (qcReports.passFail as 'Pass' | 'Fail') || 'Pass',
      secondQCDate: qcReports.secondQcDate || '',
      comments: qcReports.comments || '',

      // 产品外观图片
      stocksInWarehouse: qcReports.stocksInWarehouse,
      samplingOfProductsQuantity: qcReports.samplingOfProductsQuantity,
      shippingMarks: qcReports.shippingMarks,
      barcode: qcReports.barcode,
      packingOutside: qcReports.packingOutside,
      packingInside: qcReports.packingInside,

      // 椅子组件图片
      chairComponentsPacked: qcReports.chairComponentsPacked,
      chairComponentsUnpacked: qcReports.chairComponentsUnpacked,

      // 配件包图片
      fittingPackPacked: qcReports.fittingPackPacked,
      fittingPackUnpacked: qcReports.fittingPackUnpacked,

      // 标签和说明图片
      productionLabel: qcReports.productionLabel,
      assemblyInstructions: qcReports.assemblyInstructions,

      // 组件图片
      imageOfComponentsSeat: qcReports.imageOfComponentsSeat,
      imageOfComponentsBack: qcReports.imageOfComponentsBack,
      imageOfComponentsBase: qcReports.imageOfComponentsBase,
      imageOfComponentsCastors: qcReports.imageOfComponentsCastors,
      imageOfComponentsGasLiftCover: qcReports.imageOfComponentsGasLiftCover,
      imageOfComponentsGasLiftStamp: qcReports.imageOfComponentsGasLiftStamp,
      imageOfComponentsArmrest: qcReports.imageOfComponentsArmrest,
      imageOfComponentMechanism: qcReports.imageOfComponentMechanism,
      imageOfComponentsHeadrest: qcReports.imageOfComponentsHeadrest,

      // 成品图片
      imageOfProductBuiltFront: qcReports.imageOfProductBuiltFront,
      imageOfProductBuiltSide: qcReports.imageOfProductBuiltSide,
      imageOfProductBuiltBack: qcReports.imageOfProductBuiltBack,
      imageOfProductBuilt45Degree: qcReports.imageOfProductBuilt45Degree,
      frontImageOfProductBuiltCompare1: qcReports.frontImageOfProductBuiltCompare1,
      frontImageOfProductBuiltCompare2: qcReports.frontImageOfProductBuiltCompare2,

      // 功能检查图片
      functionCheckSeatHeightExtension: qcReports.functionCheckSeatHeightExtension,
      functionCheckMechanismAdjustment: qcReports.functionCheckMechanismAdjustment,
      functionCheckArmrestAdjustment: qcReports.functionCheckArmrestAdjustment,
      functionCheckHeadrestAdjustment: qcReports.functionCheckHeadrestAdjustment,
      functionCheckOther1: qcReports.functionCheckOther1,
      functionCheckOther2: qcReports.functionCheckOther2,

      // 缺陷记录
      defects,

      // 其他必需字段
      inspector: qcReports.qcOfficer || '',
      inspectionLocation: '工厂',
      sampleSize: Number(qcReports.inspectQty) || 0,
      defectCount: defects.length
    }

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    // 调用导出函数
    await exportQCReport(exportData)

    // 检查是否取消
    if (signal.aborted) {
      return
    }

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
    if ((error as Error).message === '用户取消导出') {
      ElMessage.info('导出已取消')
    } else {
      ElMessage.error(`导出失败: ${(error as Error).message}`)
    }
  } finally {
    exporting.value = false
    abortController.value = null
  }
}

const handleSave = async () => {
  try {
    loading.value = true

    // 保存基本信息
    if (isEditing.value && tempFormData.value?.qcReports) {
      console.log('保存前的临时数据:', JSON.stringify(tempFormData.value.qcReports))

      // 调用API保存更改
      await putQcReportsUpdate(tempFormData.value.qcReports)

      // 执行待执行的操作
      if (pendingOperations.value['basic']) {
        const operations = pendingOperations.value['basic']

        // 执行删除操作
        for (const item of operations.toDelete) {
          try {
            // 从服务器删除图片文件
            if (item.path) {
              await getFilesRemove({filePath: item.path})
              console.log(`已从服务器删除图片文件: ${item.path}`)
            }
          } catch (error) {
            console.error(`删除图片失败: ${item.path}`, error)
          }
        }

        // 清空待执行操作
        pendingOperations.value['basic'] = {
          toDelete: [],
          toAdd: [],
          toUpdate: []
        }
      }

      // 清理newUploads中的相关记录
      if (tempUploadedImages.value['newUploads']) {
        // 获取所有图片字段
        const imageFields = Object.keys(imageSections).flatMap(sectionKey => Object.keys(imageSections[sectionKey as keyof typeof imageSections].fields))

        // 找出所有使用的图片
        const usedImages: string[] = []
        for (const field of imageFields) {
          const value = tempFormData.value.qcReports[field as keyof typeof tempFormData.value.qcReports]
          if (typeof value === 'string' && value.startsWith('http')) {
            usedImages.push(value)
          }
        }

        // 从newUploads中移除已保存的图片
        tempUploadedImages.value['newUploads'] = tempUploadedImages.value['newUploads'].filter(path => !usedImages.includes(path))
        console.log('保存后清理临时上传记录，剩余:', tempUploadedImages.value['newUploads'])
      }

      // 更新本地数据
      formData.value = JSON.parse(JSON.stringify(tempFormData.value))

      // 使用可选链操作符避免undefined错误
      console.log('保存后的正式数据:', JSON.stringify(formData.value?.qcReports || {}))

      // 重置编辑状态
      isEditing.value = false
      editingSections.value = []

      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = async () => {
  // 检查是否有临时上传的图片需要删除
  if (isEditing.value && tempFormData.value?.qcReports) {
    // 获取所有图片字段
    const imageFields = Object.keys(imageSections).flatMap(sectionKey => Object.keys(imageSections[sectionKey as keyof typeof imageSections].fields))

    // 检查每个图片字段，找出临时添加的图片
    for (const field of imageFields) {
      const originalValue = formData.value.qcReports?.[field as keyof typeof formData.value.qcReports]
      const tempValue = tempFormData.value.qcReports[field as keyof typeof tempFormData.value.qcReports]

      // 如果临时值存在但与原始值不同，可能是新上传的图片
      if (tempValue && tempValue !== originalValue) {
        console.log(`检测到取消编辑时需要删除的临时图片 - 字段: ${field}, 值:`, tempValue)

        try {
          // 从服务器删除图片文件
          if (typeof tempValue === 'string' && tempValue.startsWith('http')) {
            await getFilesRemove({filePath: tempValue})
            console.log(`已从服务器删除临时图片文件: ${tempValue}`)
          }
        } catch (error) {
          console.error(`删除服务器临时图片文件失败: ${tempValue}`, error)
        }
      }

      // 获取临时上传的图片列表
      const newUploads = tempUploadedImages.value['newUploads'] || []

      // 删除所有临时上传的图片，确保没有遗漏
      for (const path of newUploads) {
        if (path && path.startsWith('http')) {
          try {
            await getFilesRemove({filePath: path})
            console.log('已删除临时上传的图片:', path)
          } catch (error) {
            console.error('删除临时上传图片失败:', error)
          }
        }

        // 清空临时上传列表
        tempUploadedImages.value['newUploads'] = []
        tempUploadedImages.value['basic'] = []

        // 清空待执行操作
        if (pendingOperations.value['basic']) {
          pendingOperations.value['basic'] = {
            toDelete: [],
            toAdd: [],
            toUpdate: []
          }
        }
      }

      // 重置编辑状态
      isEditing.value = false
      editingSections.value = []

      // 重置临时数据
      tempFormData.value = null

      ElMessage.info('已取消编辑')
    }
  }
}

const handleCancelExport = () => {
  if (exporting.value && abortController.value) {
    abortController.value.abort('用户取消导出')
    exporting.value = false
    ElMessage.info('导出已取消')
  }
}

defineOptions({
  name: 'SpecInfo'
})
</script>
