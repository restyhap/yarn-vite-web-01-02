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
              <el-button type="primary" @click="handleExport">
                <el-icon><Document /></el-icon>
                导出文档
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
                      <div class="w-full text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px]">
                        {{ formData.qcReports?.[key] || '-' }}
                      </div>
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
                      <div class="w-full text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px]">
                        {{ formData.qcReports?.comments || '-' }}
                      </div>
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
                                {{ defectDto.defects?.defectTitle || '-' }}
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
                              {{ defectDto.defects?.defectDescription || '-' }}
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
                              {{ defectDto.defects?.inspector || '-' }}
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
                              {{ defectDto.defects?.improvementSuggestion || '-' }}
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
                            :model-value="getDefectImages(defectDto)"
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
import {Document, Edit, Check, Close, Delete, Plus, Back} from '@element-plus/icons-vue'
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

// 处理图片值获取
const getImageValue = (key: string) => {
  if (!formData.value?.qcReports) return []
  const value = formData.value.qcReports[key as keyof typeof formData.value.qcReports]
  return value ? [value as string] : []
}

// 处理图片值更新
const updateImageValue = (key: string, val: string[]) => {
  if (!formData.value?.qcReports) return
  if (formData.value.qcReports) {
    formData.value.qcReports = {
      ...formData.value.qcReports,
      [key]: val[0] || ''
    }
  }
}

// 处理编辑
const handleEdit = (section: string) => {
  isEditing.value = true
  // 创建临时表单数据的深拷贝
  tempFormData.value = JSON.parse(JSON.stringify(formData.value))
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

// 临时存储上传的图片路径，用于取消时删除
const tempUploadedImages = ref<string[]>([])

const handleCloseDialog = async () => {
  // 如果有临时上传的图片，需要删除
  if (tempUploadedImages.value.length > 0) {
    try {
      // 删除已上传的图片
      for (const imagePath of tempUploadedImages.value) {
        await getFilesRemove({filePath: imagePath})
      }
      tempUploadedImages.value = [] // 清空临时图片列表
    } catch (error) {
      console.error('删除临时图片失败', error)
    }
  }

  addDefectDialogVisible.value = false
}

// 自定义上传图片处理函数
const handleCustomUpload = async (params: any) => {
  try {
    // 直接使用File对象
    const res = await postFilesUpload({file: params.file})
    const imagePath = res.data

    // 添加到临时上传图片列表
    tempUploadedImages.value.push(imagePath)

    return imagePath
  } catch (error) {
    console.error('上传图片失败', error)
    ElMessage.error('上传图片失败')
    return ''
  }
}

const handleEditDefect = (index: number) => {
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }
  editingSections.value.push(`defect-${index}`)
}

const handleSaveDefect = async (index: number, defect: any) => {
  try {
    loading.value = true

    // 1. 更新缺陷基本信息
    await putDefectsUpdate(defect)

    // 2. 获取当前缺陷记录的图片数据
    const currentDefectDto = formData.value.defectsDTO?.[index]
    const tempDefectDto = tempFormData.value.defectsDTO?.[index]

    if (currentDefectDto && tempDefectDto) {
      // 3. 检查图片是否有变化
      const currentImages = currentDefectDto.defectImages || []
      const tempImages = tempDefectDto.defectImages || []

      // 如果图片数量或内容有变化，则更新图片
      if (JSON.stringify(currentImages) !== JSON.stringify(tempImages)) {
        console.log('图片有变化，需要更新')

        // 3.1 删除已移除的图片
        // 使用类型断言解决类型问题
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentImageIds = new Set((currentImages as any[]).map(img => img.id).filter(Boolean))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempImageIds = new Set((tempImages as any[]).map(img => img.id).filter(Boolean))

        // 创建当前图片路径的映射，用于后续删除服务器文件
        const currentImagePathMap = new Map<string, string>()
        for (let i = 0; i < currentImages.length; i++) {
          const img = currentImages[i] as DefectImages
          if (img.id) {
            currentImagePathMap.set(img.id, img.imagePath || '')
          }
        }

        // 找出已删除的图片ID
        const removedImageIds = [...currentImageIds].filter(id => !tempImageIds.has(id))

        // 删除已移除的图片
        for (const imageId of removedImageIds) {
          if (imageId) {
            // 1. 先从数据库中删除图片记录
            await deleteDefectImagesRemoveById({id: imageId})
            console.log(`已删除图片记录: ${imageId}`)

            // 2. 从服务器删除图片文件
            const imagePath = currentImagePathMap.get(imageId)
            if (imagePath) {
              try {
                await getFilesRemove({filePath: imagePath})
                console.log(`已从服务器删除图片文件: ${imagePath}`)
              } catch (error) {
                console.error(`删除服务器图片文件失败: ${imagePath}`, error)
              }
            }
          }
        }

        // 3.2 更新或添加图片
        // 注意：这里有类型检查警告，但功能正常
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tempImages.forEach((img: any) => {
          if (img.id) {
            // 更新现有图片
            putDefectImagesUpdate({
              id: img.id,
              defectId: defect.id,
              imagePath: img.imagePath
            })
              .then(() => {
                console.log(`已更新图片: ${img.id}`)
              })
              .catch(err => {
                console.error('更新图片失败:', err)
              })
          } else if (img.imagePath) {
            // 添加新图片
            const newImage: DefectImages = {
              defectId: defect.id,
              imagePath: img.imagePath
            }
            postDefectImagesSave(newImage)
              .then(() => {
                console.log(`已添加新图片: ${img.imagePath}`)
              })
              .catch(err => {
                console.error('添加图片失败:', err)
              })
          }
        })
      }

      // 4. 更新本地数据
      // 使用深拷贝确保数据独立
      if (formData.value.defectsDTO) {
        formData.value.defectsDTO[index] = JSON.parse(JSON.stringify(tempDefectDto))
      }
    }

    // 5. 退出编辑模式
    editingSections.value = editingSections.value.filter(item => item !== `defect-${index}`)
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleCancelDefect = (index: number) => {
  editingSections.value = editingSections.value.filter(item => item !== `defect-${index}`)
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

const handleDefectImageUpdate = (val: string[], defectId: string | undefined, index: number) => {
  if (!formData.value.defectsDTO?.[index]) return

  // 更新图片路径
  const images = val.map(path => ({
    defectId,
    imagePath: path
  }))

  if (formData.value.defectsDTO[index].defectImages) {
    formData.value.defectsDTO[index].defectImages = images.map(img => ({
      id: undefined,
      defectId: img.defectId,
      imagePath: img.imagePath,
      createdAt: undefined,
      updatedAt: undefined
    }))
  }
}

const handleDefectCustomUpload = async (params: any, defectId: string | undefined, index: number) => {
  // 使用通用的上传函数
  const imagePath = await handleCustomUpload(params)
  return imagePath
}

// 添加计算属性处理缺陷图片
const getDefectImages = (defectDto: DefectsDto) => {
  if (!defectDto.defectImages) return []
  return defectDto.defectImages.map(img => img.imagePath || '').filter(path => path !== '')
}

const handleExport = async () => {
  try {
    ElMessage.info('正在准备导出文档，请稍候...')

    // 准备导出数据
    if (!formData.value?.qcReports) {
      ElMessage.error('没有可导出的数据')
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

    // 调用导出函数
    await exportQCReport(exportData)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败', error)
    ElMessage.error('导出失败')
  }
}

const handleSave = async () => {
  try {
    loading.value = true

    // 保存基本信息
    if (isEditing.value && tempFormData.value?.qcReports) {
      await putQcReportsUpdate(tempFormData.value.qcReports)

      // 更新本地数据
      formData.value = JSON.parse(JSON.stringify(tempFormData.value))

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

const handleCancel = () => {
  // 重置编辑状态
  isEditing.value = false
  editingSections.value = []

  // 重置临时数据
  tempFormData.value = null

  ElMessage.info('已取消编辑')
}

defineOptions({
  name: 'SpecInfo'
})
</script>
