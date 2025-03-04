<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-medium">质检报告详情</h2>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center space-x-4">
            <template v-if="editingSections.includes('basic') || editingSections.includes('images')">
              <el-button type="success" @click="handleSave('all')">
                <el-icon><Check /></el-icon>
                保存
              </el-button>
              <el-button type="danger" @click="handleCancel('all')">
                <el-icon><Close /></el-icon>
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button type="primary" @click="handleEdit('all')">
                <el-icon><Edit /></el-icon>
                编辑信息
              </el-button>
              <el-button type="primary" @click="handleExport">
                <el-icon><Document /></el-icon>
                导出报告
              </el-button>
            </template>
          </div>
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="h-[calc(100vh-60px)] overflow-y-auto bg-white">
      <div class="px-6 pb-6">
        <div class="max-w-[1200px] mx-auto">
          <!-- 基本信息部分 -->
          <div class="bg-white rounded-lg shadow-sm mb-6">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                <span>基本信息</span>
              </h3>

              <!-- 基本信息表单 -->
              <el-form class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <template v-for="(label, key) in basicFields" :key="key">
                    <div 
                      v-if="key !== 'comments'"
                      class="bg-gray-100 p-1 rounded flex items-center"
                    >
                      <div class="min-w-[120px] px-2 flex items-center h-[38px]">{{ label }}</div>
                      <div class="flex-1">
                        <template v-if="editingSections.includes('basic')">
                          <el-input 
                            v-if="!isDateField(key)"
                            v-model="tempFormData[key]"
                            :placeholder="`请输入${label}`"
                            class="!w-[240px] !h-[38px]"
                          />
                          <el-date-picker
                            v-else
                            v-model="tempFormData[key]"
                            type="date"
                            :placeholder="`请选择${label}`"
                            class="!w-[240px] !h-[38px]"
                          />
                        </template>
                        <template v-else>
                          <div class="text-gray-700 bg-gray-50 p-2 rounded h-[38px] leading-[22px] border border-gray-200 !w-[240px] flex items-center">
                            {{ formData[key] || '-' }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 评价内容单独处理 -->
                <div class="mt-4">
                  <div class="bg-gray-100 p-1 rounded">
                    <div class="min-w-[120px] px-2 mb-2">{{ basicFields.comments }}</div>
                    <template v-if="editingSections.includes('basic')">
                      <el-input
                        v-model="tempFormData.comments"
                        type="textarea"
                        :rows="3"
                        :placeholder="`请输入${basicFields.comments}`"
                        class="!w-full"
                      />
                    </template>
                    <template v-else>
                      <div class="text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px] border border-gray-200 !w-full">
                        {{ formData.comments || '-' }}
                      </div>
                    </template>
                  </div>
                </div>
              </el-form>
            </div>
          </div>

          <!-- 图片部分 -->
          <div class="bg-white rounded-lg shadow-sm mb-6">
            <div class="p-6">
              <template v-for="(section, index) in imageSections" :key="index">
                <div class="mb-8">
                  <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                    <span>{{ section.title }}</span>
                    
                  </h3>

                  <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <template v-for="(label, key) in section.fields" :key="key">
                      <div class="space-y-2">
                        <div class="text-sm text-gray-600 font-medium">{{ label }}</div>
                        <div class="w-full h-[240px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                          <ImageHandler 
                            :model-value="getImageValue(key)"
                            @update:model-value="val => updateImageValue(key, val)"
                            :editable="isEditing"
                            :size="200"
                            class="!w-full !h-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-w-full [&_img]:max-h-full [&_img]:object-contain [&_img]:m-auto"
                          />
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 缺陷记录部分 -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                <span>缺陷记录</span>
                <el-button type="primary" @click="addDefectDialogVisible = true">
                  <el-icon><Plus /></el-icon>
                  添加缺陷记录
                </el-button>
              </h3>

              <!-- 添加缺陷记录弹窗 -->
              <DefectDialog
                v-model:visible="addDefectDialogVisible"
                title="添加缺陷记录"
                :loading="loading"
                @save="handleSaveNewDefect"
                @close="handleCloseDialog"
              />
              
              <div class="mt-4 space-y-6">
                <template v-for="(defect, index) in formData.defects" :key="defect.id">
                  <div class="rounded p-4 border border-gray-200">
                    <!-- 标题栏 -->
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                      <div class="flex items-center flex-1">
                        <div class="bg-gray-100 rounded p-2 flex items-center">
                          <div class="min-w-[120px] px-2">标题内容</div>
                          <div class="flex-1">
                            <template v-if="editingSections.includes(`defect-${index}`)">
                              <el-input
                                v-model="tempFormData.defects[index].defectTitle"
                                placeholder="请输入标题内容"
                                class="!w-[400px] !h-[38px]"
                              />
                            </template>
                            <template v-else>
                              <div class="text-gray-700 bg-gray-50 p-2 h-[38px] leading-[22px] flex items-center border border-gray-200 !w-[400px]">
                                {{ defect.defectTitle || '-' }}
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                      <div class="flex gap-2">
                        <template v-if="editingSections.includes(`defect-${index}`)">
                          <el-button type="success" @click="handleSaveDefect(index, tempFormData.defects[index])">
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
                    <div class="flex justify-between mb-4">
                      <!-- 问题描述 -->
                      <div class="bg-gray-100 rounded p-2 flex items-center">
                        <div class="min-w-[120px] px-2">问题描述</div>
                        <div>
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input
                              v-model="tempFormData.defects[index].defectDescription"
                              placeholder="请输入问题描述"
                              class="!w-[400px] !h-[38px]"
                            />
                          </template>
                          <template v-else>
                            <div class="text-gray-700 bg-gray-50 p-2 h-[38px] leading-[22px] flex items-center border border-gray-200 !w-[400px]">
                              {{ defect.defectDescription || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                      <!-- 质检员 -->
                      <div class="bg-gray-100 rounded p-2 flex items-center">
                        <div class="min-w-[120px] px-2">质检员</div>
                        <div>
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input
                              v-model="tempFormData.defects[index].inspector"
                              placeholder="请输入质检员"
                              class="!w-[400px] !h-[38px]"
                            />
                          </template>
                          <template v-else>
                            <div class="text-gray-700 bg-gray-50 p-2 h-[38px] leading-[22px] flex items-center border border-gray-200 !w-[400px]">
                              {{ defect.inspector || '-' }}
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                    <!-- 改进建议独占一行 -->
                    <div class="bg-gray-100 p-1 rounded mb-4">
                      <div class="min-w-[120px] px-2 flex items-center h-[38px]">改进建议</div>
                      <div class="flex-1">
                        <template v-if="editingSections.includes(`defect-${index}`)">
                          <el-input
                            v-model="tempFormData.defects[index].improvementSuggestion"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入改进建议"
                            class="!w-full"
                          />
                        </template>
                        <template v-else>
                          <div class="text-gray-700 bg-gray-50 p-2 rounded min-h-[38px] leading-[22px] border border-gray-200 !w-full">
                            {{ defect.improvementSuggestion || '-' }}
                          </div>
                        </template>
                      </div>
                    </div>

                    <!-- 缺陷图片 -->
                    <div class="bg-gray-100 rounded p-2 flex items-center">
                      <div class="min-w-[120px] px-2 flex items-center h-[38px] bg-gray-100 ">缺陷图片</div>
                      <ImageHandler 
                        :model-value="defect.images?.map(img => img.imagePath) || []"
                        @update:model-value="(val) => handleDefectImageUpdate(val, defect.id, index)"
                        :editable="editingSections.includes(`defect-${index}`)"
                              :size="200"
                              class="!h-[200px] bg-gray-50  overflow-hidden border  border-gray-200 rounded-lg"
                              />
                    </div>
                    
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close, Delete, Plus, Back } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { exportQCReport } from '@/utils/exportQCReport'
import type { QCReportData } from '@/utils/exportQCReport'
import { saveAs } from 'file-saver'
import type { 
  QcReport as IQcReport,
  QcReportsDTO as IQcReportsDTO, 
  Defect as IDefect, 
  DefectImage as IDefectImage 
} from '@/api/specification'
import { 
  updateSpecification, 
  getQcReportsDtoById, 
  removeFile,
  upload,
  saveDefectImages,
  removeDefectImages,
  deleteDefects,
  updateDefects,
  saveDefects
} from '@/api'
import ImageHandler from '@/components/ImageHandler.vue'
import { getId } from '@/utils/idUtils'
import DefectDialog from '@/components/DefectDialog.vue'

interface IDefectsDTO {
  defects: {
    id: string
    reportId: string
    defectTitle: string
    defectDescription: string
    improvementSuggestion: string
    inspector: string
    createdAt: string
    updatedAt: string
  }
  defectImages: IDefectImage[]
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const editingSections = ref<string[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 添加调试模式开关
const showDebugInfo = ref(false)  // 可以根据需要设置为true或false

const formData = ref<IQcReport | any>({
  id: '',
  modelCode: '',
  factoryCode: '',
  supplier: '',
  customer: '',
  poNumber: '',
  inspectionDate: '',
  orderQty: 0,
  reportDate: '',
  inspectQty: 0,
  qcOfficer: '',
  passFail: 'Pass',
  secondQcDate: '',
  comments: '',
  defects: [],
  // 产品外观图片
  stocksInWarehouse: '',
  samplingOfProductsQuantity: '',
  shippingMarks: '',
  barcode: '',
  packingOutside: '',
  packingInside: '',
  // 椅子组件图片
  chairComponentsPacked: '',
  chairComponentsUnpacked: '',
  // 配件包图片
  fittingPackPacked: '',
  fittingPackUnpacked: '',
  // 标签和说明图片
  productionLabel: '',
  assemblyInstructions: '',
  // 组件图片
  imageOfComponentsSeat: '',
  imageOfComponentsBack: '',
  imageOfComponentsBase: '',
  imageOfComponentsCastors: '',
  imageOfComponentsGasLiftCover: '',
  imageOfComponentsGasLiftStamp: '',
  imageOfComponentsArmrest: '',
  imageOfComponentMechanism: '',
  imageOfComponentsHeadrest: '',
  // 成品图片
  imageOfProductBuiltFront: '',
  imageOfProductBuiltSide: '',
  imageOfProductBuiltBack: '',
  imageOfProductBuilt45Degree: '',
  frontImageOfProductBuiltCompare1: '',
  frontImageOfProductBuiltCompare2: '',
  // 功能检查图片
  functionCheckSeatHeightExtension: '',
  functionCheckMechanismAdjustment: '',
  functionCheckArmrestAdjustment: '',
  functionCheckHeadrestAdjustment: '',
  functionCheckOther1: '',
  functionCheckOther2: '',
  createdAt: '',
  updatedAt: '',
  frontImgPath: '',
  sideImgPath: '',
  backImgPath: ''
})

const tempFormData = ref<any>(null)
const tempFiles = ref<string[]>([])

// 添加待删除图片的存储
const pendingDeleteImages = ref<string[]>([])
const pendingDeleteDefectImages = ref<{ id: string; imagePath: string; }[]>([])

// 添加新的响应式变量来跟踪编辑时新上传的图片
const editingUploadedImages = ref<{ index: number; images: IDefectImage[] }[]>([])

// 基本字段定义
const basicFields = {
  modelCode: '型号代码',
  factoryCode: '工厂代码',
  supplier: '供应商',
  client: '客户',
  poNumber: 'PO编号',
  inspectionDate: '检验日期',
  orderQty: '订单数量',
  reportDate: '报告日期',
  inspectQty: '检验数量',
  qcOfficer: '质检员',
  passFail: '通过/失败',
  secondQcDate: '二次质检日期',
  comments: '评价内容'
} as const

// 缺陷记录字段定义
const defectFields = {
  defectTitle: '问题标题',
  defectDescription: '问题描述',
  improvementSuggestion: '改进建议',
  inspector: '检验员'
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

// 产品图片字段
const productImages = {
  // 产品外观图片
  stocksInWarehouse: '仓库库存',
  samplingOfProductsQuantity: '产品抽样数量',
  shippingMarks: '运输标记',
  barcode: '条形码',
  packingOutside: '外包装',
  packingInside: '内包装',
  
  // 椅子组件图片
  chairComponentsPacked: '椅子组件-已包装',
  chairComponentsUnpacked: '椅子组件-未包装',
  
  // 配件包图片
  fittingPackPacked: '配件包-已包装',
  fittingPackUnpacked: '配件包-未包装',
  
  // 标签和说明图片
  productionLabel: '生产标签',
  assemblyInstructions: '组装说明',
  
  // 组件图片
  imageOfComponentsSeat: '座椅组件',
  imageOfComponentsBack: '靠背组件',
  imageOfComponentsBase: '底座组件',
  imageOfComponentsCastors: '脚轮组件',
  imageOfComponentsGasLiftCover: '气压棒外罩',
  imageOfComponentsGasLiftStamp: '气压棒标记',
  imageOfComponentsArmrest: '扶手组件',
  imageOfComponentMechanism: '机构组件',
  imageOfComponentsHeadrest: '头枕组件',
  
  // 成品图片
  imageOfProductBuiltFront: '成品正视图',
  imageOfProductBuiltSide: '成品侧视图',
  imageOfProductBuiltBack: '成品背视图',
  imageOfProductBuilt45Degree: '成品45度视图',
  frontImageOfProductBuiltCompare1: '成品对比图1',
  frontImageOfProductBuiltCompare2: '成品对比图2',
  
  // 功能检查图片
  functionCheckSeatHeightExtension: '座椅高度调节',
  functionCheckMechanismAdjustment: '机构调节',
  functionCheckArmrestAdjustment: '扶手调节',
  functionCheckHeadrestAdjustment: '头枕调节',
  functionCheckOther1: '其他功能检查1',
  functionCheckOther2: '其他功能检查2'
}

// 定义常用的缺陷记录名称
const DEFECT_TITLES = {
  SINGLE: 'Single Defect Finding',
  MULTIPLE_1: 'First Defect Finding',
  MULTIPLE_2: 'Second Defect Finding',
  MULTIPLE_3: 'Third Defect Finding'
}

// 格式化字段值的函数
const formatFieldValue = (key: string, value: any): string => {
  if (value === undefined || value === null) return '-'
  
  switch (key) {
    case 'currency':
      return value === 0 ? '人民币' : '美元'
    case 'bifmaTested':
    case 'cadBlockAvailable':
    case 'productDataAvailable':
    case 'productImagesAvailable':
      return value === 1 ? '是' : '否'
    case 'sampleLeadTime':
    case 'createTime':
      return value ? new Date(value).toLocaleString() : '-'
    case 'fobPrice':
      return typeof value === 'number' ? value.toFixed(2) : '-'
    default:
      return String(value || '-')
  }
}

// 获取数据
const getData = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('无效的记录ID')
    router.back()
    return
  }

  loading.value = true
  try {
    const response = await getQcReportsDtoById(id)
    console.log('API Response:', response) // 检查整个响应
    
    if (response?.data) {
      const { qcReports, defectsDTO } = response.data as IQcReportsDTO
      console.log('defectsDTO from API:', defectsDTO) // 检查缺陷数据
      
      // 将defectsDTO数据整合到对应的defect中
      const defectsWithImages = defectsDTO?.map((dto: any) => {
        console.log('Processing defect DTO:', dto) // 检查每条缺陷记录的处理
        return {
          id: dto.defects.id,
          reportId: dto.defects.reportId,
          defectTitle: dto.defects.defectTitle,
          defectDescription: dto.defects.defectDescription,
          improvementSuggestion: dto.defects.improvementSuggestion,
          inspector: dto.defects.inspector,
          createdAt: dto.defects.createdAt,
          updatedAt: dto.defects.updatedAt,
          images: dto.defectImages.map((img: any) => ({
            id: img.id,
            defectId: img.defectId,
            imagePath: img.imagePath,
            createdAt: img.createdAt,
            updatedAt: img.updatedAt
          }))
        }
      }) || []
      
      console.log('Processed defects:', defectsWithImages) // 检查处理后的数据

      // 更新formData
      formData.value = {
        ...formData.value,
        ...qcReports,
        // 确保图片字段有初始值
        frontImgPath: qcReports.frontImgPath || '',
        sideImgPath: qcReports.sideImgPath || '',
        backImgPath: qcReports.backImgPath || '',
        defects: defectsWithImages // 添加这一行，确保缺陷记录被正确赋值
      }
      
      console.log('Final formData:', formData.value) // 检查最终的表单数据
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 修改 editingData 计算属性，确保正确绑定数据
const editingData = computed({
  get() {
    // 确保返回的是一个对象，而不是 null 或 undefined
    return tempFormData.value || formData.value || {};
  },
  set(newValue: any) {
    // 如果 tempFormData 不存在，先初始化它
    if (!tempFormData.value) {
      tempFormData.value = JSON.parse(JSON.stringify(formData.value || {}));
    }
    // 然后设置新值
    tempFormData.value = newValue;
    
    // 添加日志，查看设置后的值
    console.log('设置新的编辑数据:', JSON.stringify(tempFormData.value));
  }
});

// 添加编辑状态数组
const isEditing = ref<boolean>(false)

// 切换编辑状态
const handleEdit = (section: string) => {
  console.log('开始编辑');
  isEditing.value = true;
  
  // 初始化临时数据
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value));
  }
  
  // 添加到编辑区域列表
  editingSections.value = ['basic', 'images'];
};

// 处理保存按钮点击
const handleSave = async (section: string) => {
  if (!tempFormData.value) {
    ElMessage.error('没有要保存的数据');
    return;
  }
  
  try {
    loading.value = true;
    
    // 处理待删除的图片
    if (pendingDeleteImages.value.length > 0) {
      const deletePromises = pendingDeleteImages.value.map(imagePath => 
        removeFile(imagePath)
      );
      await Promise.all(deletePromises);
      pendingDeleteImages.value = [];
    }
    
    // 准备更新的数据
    const updateData = {
      ...tempFormData.value
    };
    
    // 发送更新请求
    const response = await updateSpecification(updateData);
    
    if (response?.code === '200') {
      formData.value = JSON.parse(JSON.stringify(tempFormData.value));
      ElMessage.success('保存成功');
      
      // 如果是全局编辑，清空所有编辑状态
      if (section === 'all') {
        editingSections.value = [];
      } else {
        editingSections.value = editingSections.value.filter(s => s !== section);
      }
      
      // 如果没有其他正在编辑的项，清空临时数据
      if (editingSections.value.length === 0) {
        tempFormData.value = null;
      }
    } else {
      ElMessage.error('保存失败：' + (response?.message || '未知错误'));
    }
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 添加导出状态
const exporting = ref(false)

// 修改导出方法
const handleExport = async () => {
  exporting.value = true
  try {
    // 准备缺陷数据
    const defectsData = formData.value.defects?.map((defect: IDefect) => ({
      defectTitle: '缺陷记录',
      defectDescription: defect.defectDescription || '',
      improvementSuggestion: defect.improvementSuggestion || '',
      inspector: formData.value.qcOfficer || '',
      images: defect.images.map((img: IDefectImage) => img.imagePath)
    }))

    // 准备质检报告数据
    const qcData: QCReportData = {
      // 基本信息
      modelCode: formData.value.modelCode || '',
      factoryCode: formData.value.factoryCode || '',
      supplier: formData.value.supplier || '',
      client: formData.value.client || '',
      poNumber: formData.value.poNumber || '',
      inspectionDate: formData.value.inspectionDate || '',
      orderQty: formData.value.orderQty || 0,
      reportDate: formData.value.reportDate || '',
      inspectQty: formData.value.inspectQty || 0,
      qcOfficer: formData.value.qcOfficer || '',
      passFail: formData.value.passFail || 'Pass',
      secondQCDate: formData.value.secondQcDate || '',
      comments: formData.value.comments || '',

      // 产品外观图片
      stocksInWarehouse: formData.value.stocksInWarehouse,
      samplingOfProductsQuantity: formData.value.samplingOfProductsQuantity,
      shippingMarks: formData.value.shippingMarks,
      barcode: formData.value.barcode,
      packingOutside: formData.value.packingOutside,
      packingInside: formData.value.packingInside,

      // 椅子组件图片
      chairComponentsPacked: formData.value.chairComponentsPacked,
      chairComponentsUnpacked: formData.value.chairComponentsUnpacked,

      // 配件包图片
      fittingPackPacked: formData.value.fittingPackPacked,
      fittingPackUnpacked: formData.value.fittingPackUnpacked,

      // 标签和说明图片
      productionLabel: formData.value.productionLabel,
      assemblyInstructions: formData.value.assemblyInstructions,

      // 组件图片
      imageOfComponentsSeat: formData.value.imageOfComponentsSeat,
      imageOfComponentsBack: formData.value.imageOfComponentsBack,
      imageOfComponentsBase: formData.value.imageOfComponentsBase,
      imageOfComponentsCastors: formData.value.imageOfComponentsCastors,
      imageOfComponentsGasLiftCover: formData.value.imageOfComponentsGasLiftCover,
      imageOfComponentsGasLiftStamp: formData.value.imageOfComponentsGasLiftStamp,
      imageOfComponentsArmrest: formData.value.imageOfComponentsArmrest,
      imageOfComponentMechanism: formData.value.imageOfComponentMechanism,

      // 新添加的必需字段
      inspector: formData.value.qcOfficer || '',
      inspectionLocation: '生产车间',
      sampleSize: formData.value.inspectQty || 0,
      defectCount: formData.value.defects?.length || 0,

      // 缺陷记录
      defects: defectsData
    }
    
    // 生成Excel文件
    const workbook = await exportQCReport(qcData)
    const buffer = await workbook.xlsx.writeBuffer()
    
    // 生成文件名并保存
    const fileName = `${qcData.modelCode} ${qcData.poNumber} ${new Date().getTime()}.xlsx`
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, fileName)
    
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

// 处理自定义上传
const handleCustomUpload = async (params: any, key: keyof FormData) => {
  try {
    const formDataObj = new FormData()
    formDataObj.append('file', params.file)
    
    const response = await upload(formDataObj)
    if (response?.data && tempFormData.value) {
      tempFormData.value[key] = response.data
      ElMessage.success('上传成功')
    } else {
      ElMessage.error('上传失败')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}

// 处理缺陷图片自定义上传
const handleDefectCustomUpload = async (params: any, defectIndex: number) => {
  try {
    const formDataObj = new FormData()
    formDataObj.append('file', params.file)
    
    const response = await upload(formDataObj)
    if (response?.data && tempFormData.value) {
      // 添加新的图片对象
      const newImage: IDefectImage = {
        id: getId(),
        defectId: tempFormData.value.defects[defectIndex].id || '',
        imagePath: response.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // 记录新上传的图片
      const existingIndex = editingUploadedImages.value.findIndex(item => item.index === defectIndex)
      if (existingIndex > -1) {
        editingUploadedImages.value[existingIndex].images.push(newImage)
      } else {
        editingUploadedImages.value.push({
          index: defectIndex,
          images: [newImage]
        })
      }
      
      tempFormData.value.defects[defectIndex].images.push(newImage)
      ElMessage.success('上传成功')
    } else {
      ElMessage.error('上传失败')
    }
  } catch (error: any) {
    console.error('上传失败:', error)
    ElMessage.error(`上传失败: ${error.message || '未知错误'}`)
  }
}

// 处理图片预览
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url || ''
  dialogVisible.value = true
}

// 处理图片移除
const handleImageRemove = (key: keyof FormData) => {
  if (!tempFormData.value || !tempFormData.value[key]) {
    return
  }
  
  // 将图片URL添加到待删除列表
  const imageUrl = tempFormData.value[key] as string
  if (imageUrl && !pendingDeleteImages.value.includes(imageUrl)) {
    pendingDeleteImages.value.push(imageUrl)
  }
  
  // 清空临时表单中的图片URL
  tempFormData.value[key] = ''
}

// 修改 handleEditDefect 函数
const handleEditDefect = (index: number) => {
  // 初始化编辑状态数组
  if (!isEditing.value) {
    isEditing.value = false
  }
  
  // 设置当前记录为编辑状态
  isEditing.value = true
  
  // 将当前缺陷记录添加到编辑状态
  editingSections.value.push(`defect-${index}`)
  
  // 初始化临时数据
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }
}

// 修改取消编辑的函数
const handleCancelDefect = (index: number) => {
  // 退出编辑模式
  editingSections.value = editingSections.value.filter((section: string) => section !== `defect-${index}`)
  isEditing.value = false
  
  // 如果没有其他正在编辑的项，清空临时数据
  if (editingSections.value.length === 0) {
    tempFormData.value = null
  }
  
  ElMessage.info('已取消编辑')
}

// 修改保存缺陷记录的函数
const handleSaveDefect = async (index: number, defectData: any) => {
  try {
    loading.value = true
    
    console.log('保存缺陷记录:', defectData)
    
    // 更新缺陷记录
    const response = await updateDefects(defectData)
    
    if (response?.code === '200') {
      // 更新本地数据
      formData.value.defects[index] = JSON.parse(JSON.stringify(defectData))
      ElMessage.success('保存成功')
      
      // 退出编辑模式
      editingSections.value = editingSections.value.filter((section: string) => section !== `defect-${index}`)
      isEditing.value = false
      
      // 如果没有其他正在编辑的项，清空临时数据
      if (editingSections.value.length === 0) {
        tempFormData.value = null
      }
    } else {
      ElMessage.error('保存失败：' + (response?.message || '未知错误'))
    }
  } catch (error) {
    console.error('保存缺陷记录失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理删除缺陷记录
const handleDeleteDefect = async (index: number) => {
  try {
    // 确认删除
    await ElMessageBox.confirm(
      '确定要删除该缺陷记录吗？此操作不可逆。',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const defect = formData.value.defects[index]
    
    // 如果没有ID，说明是新添加的未保存记录，直接从列表中移除
    if (!defect.id) {
      formData.value.defects.splice(index, 1)
      ElMessage.success('删除成功')
      return
    }
      
    try {
      // 1. 先删除所有图片文件
      const deleteFilePromises = defect.images.map((image: any) => 
        removeFile(image.imagePath)
      )
      await Promise.all(deleteFilePromises)
      
      // 2. 删除数据库中的图片记录
      const deleteImageRecordPromises = defect.images.map((image: any) =>
        removeDefectImages(image.id)
      )
      await Promise.all(deleteImageRecordPromises)
      
      // 3. 删除缺陷记录
      const response = await deleteDefects(defect.id)
        
      if (response?.code === '200') {
        // 从列表中移除
        formData.value.defects.splice(index, 1)
        ElMessage.success('删除成功')
        editingSections.value = editingSections.value.filter(
          (section: string) => section !== `defect-${index}`
        )
        // 重新获取最新数据
        await getData()
      } else {
        ElMessage.error('删除失败: ' + (response?.message || '未知错误'))
      }
    } catch (error) {
      console.error('删除缺陷记录失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  } catch (error) {
    // 用户取消删除
    console.log('用户取消删除')
  }
}

// 处理缺陷图片更新
const handleDefectImageUpdate = (val: string[], defectId: string, defectIndex: number) => {
  // 确保 tempFormData 已初始化
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value));
  }
  
  // 确保 defects 数组存在
  if (!tempFormData.value.defects) {
    tempFormData.value.defects = [];
  }
  
  // 找到对应的缺陷记录和图片
  const defect = tempFormData.value.defects[defectIndex];
  if (defect) {
    const imageIndex = defect.images.findIndex((img: IDefectImage) => img.id === defectId);
    if (imageIndex > -1) {
      defect.images[imageIndex].imagePath = val[0] || ''; // 取数组的第一个值作为图片路径
    }
  }
};

// 处理添加缺陷图片
const handleDefectImageAdd = async (val: string[], index: number) => {
  if (!val.length || !tempFormData.value || !tempFormData.value.defects) return;
  
  const defect = tempFormData.value.defects[index];
  if (!defect.images) defect.images = [];
  
  // 创建新的图片对象
  const newImage = {
    id: getId(),
    defectId: defect.id,
    imagePath: val[0], // 取数组的第一个值作为图片路径
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  defect.images.push(newImage);
  console.log(`添加缺陷 #${index + 1} 的新图片:`, val[0]);
  
  // 可选：立即保存图片到服务器
  try {
    await saveDefectImages(newImage);
    ElMessage.success('图片上传成功');
  } catch (error) {
    console.error('保存缺陷图片失败:', error);
    ElMessage.error('图片上传失败');
    // 移除失败的图片
    defect.images.pop();
  }
};

// 添加beforeUpload方法
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 添加新的响应式变量
const addDefectDialogVisible = ref(false)
const newDefectForm = ref<IDefectsDTO>({
  defects: {
    id: '',
    reportId: '',
    defectTitle: '',
    defectDescription: '',
    improvementSuggestion: '',
    inspector: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  defectImages: []
})

// 存储新上传的图片信息
const newUploadedImages = ref<IDefectImage[]>([])

// 显示添加缺陷记录对话框
const handleShowAddDefect = () => {
  newDefectForm.value = {
    defects: {
      id: getId(),
      reportId: formData.value.id,
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: formData.value.qcOfficer,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    defectImages: []
  }
  newUploadedImages.value = []
  addDefectDialogVisible.value = true
}

// 处理新缺陷记录的图片上传
const handleNewDefectImageUpload = async (params: any) => {
  try {
    const formDataObj = new FormData()
    formDataObj.append('file', params.file)
    
    const response = await upload(formDataObj)
    if (response?.data) {
      // 创建新的图片记录
      const newImage: IDefectImage = {
        id: getId(),
        defectId: newDefectForm.value.defects.id,
        imagePath: response.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // 保存到临时列表和表单数据中
      newUploadedImages.value.push(newImage)
      newDefectForm.value.defectImages.push(newImage)
      ElMessage.success('上传成功')
    }
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}

// 处理新缺陷记录的图片删除
const handleNewDefectImageRemove = async (image: IDefectImage) => {
  try {
    // 确认删除
    await ElMessageBox.confirm(
      '确定要删除这张图片吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 从服务器删除图片文件
    await removeFile(image.imagePath)

    // 从临时列表和表单数据中移除图片
    newUploadedImages.value = newUploadedImages.value.filter(img => img.id !== image.id)
    newDefectForm.value.defectImages = newDefectForm.value.defectImages.filter(img => img.id !== image.id)

    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error === 'cancel') {
      return
    }
    console.error('删除失败:', error)
    ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  }
}

// 处理取消添加缺陷记录
const handleCloseDialog = () => {
  addDefectDialogVisible.value = false
  newDefectForm.value = {
    defects: {
      id: '',
      reportId: '',
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    defectImages: []
  }
  // 清空新上传的图片列表
  newUploadedImages.value = []
}

// 处理新缺陷记录的保存
const handleSaveNewDefect = async (defectData: any) => {
  try {
    loading.value = true

    // 添加报告ID
    defectData.reportId = formData.value.id

    // 保存缺陷记录
    const result = await saveDefects(defectData)
    if (result.code === 200) {
      // 更新表单数据
      if (!formData.value.defects) {
        formData.value.defects = []
      }
      formData.value.defects.push(result.data)
      
      // 关闭弹窗
      addDefectDialogVisible.value = false
      ElMessage.success('添加成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 处理新缺陷记录图片添加
const handleNewDefectImageAdd = async (val: string[]) => {
  if (!val.length) return
  const newImage = {
    id: getId(),
    imagePath: val[val.length - 1]
  }
  if (!newDefectForm.value.defects.images) {
    newDefectForm.value.defects.images = []
  }
  newDefectForm.value.defects.images.push(newImage)
}

// 添加图片值获取方法
const getImageValue = (key: string): string[] => {
  if (!tempFormData.value) {
    const value = (formData.value as Record<string, any>)[key]
    return value ? [value] : []
  }
  const value = (tempFormData.value as Record<string, any>)[key]
  return value ? [value] : []
}

// 修改图片值更新方法
const updateImageValue = (key: string, value: string[]) => {
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }
  if (tempFormData.value) {
    const data = tempFormData.value as Record<string, any>
    data[key] = value[0] || '' // 取数组的第一个值作为图片路径
  }
}

// 添加初始化
onMounted(async () => {
  await getData()
  
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

// 处理取消按钮点击
const handleCancel = (section: string) => {
  console.log('取消编辑');
  
  // 如果是取消所有编辑
  if (section === 'all') {
    editingSections.value = [];
  } else {
    // 从编辑区域列表中移除指定区域
    editingSections.value = editingSections.value.filter(s => s !== section);
  }
  
  // 如果没有其他正在编辑的项，清空临时数据
  if (editingSections.value.length === 0) {
    tempFormData.value = null;
    pendingDeleteImages.value = [];
    isEditing.value = false;
  }
  
  ElMessage.info('已取消编辑');
}

// 处理新缺陷记录图片更新
const handleNewDefectImageUpdate = async (newPath: string, imageId: string) => {
  if (!newPath) {
    // 删除图片
    const imageToDelete = newDefectForm.value.defectImages.find((img: IDefectImage) => img.id === imageId);
    if (imageToDelete) {
      await removeFile(imageToDelete.imagePath);
      newDefectForm.value.defectImages = newDefectForm.value.defectImages.filter((img: IDefectImage) => img.id !== imageId);
      newUploadedImages.value = newUploadedImages.value.filter((img: IDefectImage) => img.id !== imageId);
    }
  } else {
    // 更新图片路径
    const imageIndex = newDefectForm.value.defectImages.findIndex((img: IDefectImage) => img.id === imageId);
    if (imageIndex > -1) {
      newDefectForm.value.defectImages[imageIndex].imagePath = newPath;
      // 同时更新 newUploadedImages
      const uploadedImageIndex = newUploadedImages.value.findIndex((img: IDefectImage) => img.id === imageId);
      if (uploadedImageIndex > -1) {
        newUploadedImages.value[uploadedImageIndex].imagePath = newPath;
      }
    }
  }
};

// 判断是否为图片字段
const isImageField = (key: string): boolean => {
  const imageFields = ['frontImgPath', 'sideImgPath', 'backImgPath'];
  return imageFields.includes(key);
};

// 更新临时表单数据的安全方法
const updateTempFormData = (key: string, value: any) => {
  console.log(`更新字段 ${key}:`, value); // 添加调试日志
  
  if (!tempFormData.value) {
    console.warn('tempFormData.value 不存在，创建新对象'); // 添加调试日志
    // 如果临时数据不存在，先从当前数据创建
    tempFormData.value = formData.value ? { ...formData.value } : {};
  }
  
  tempFormData.value[key] = value;
  console.log('更新后的临时数据:', tempFormData.value); // 添加调试日志
};

// 添加一个辅助方法来初始化临时表单数据
const initTempFormDataForDefect = (index: number, field: string, value: any) => {
  console.log(`初始化缺陷记录 #${index} 的 ${field} 字段:`, value);
  
  // 确保 tempFormData 已初始化
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value || {}));
    console.log('初始化临时表单数据:', JSON.stringify(tempFormData.value));
  }
  
  // 确保 defects 数组存在
  if (!tempFormData.value.defects) {
    tempFormData.value.defects = [];
    console.log('初始化缺陷数组');
  }
  
  // 确保特定索引的缺陷记录存在
  if (!tempFormData.value.defects[index]) {
    if (formData.value && formData.value.defects && formData.value.defects[index]) {
      tempFormData.value.defects[index] = JSON.parse(JSON.stringify(formData.value.defects[index]));
      console.log(`从原始数据复制缺陷记录 #${index}:`, JSON.stringify(tempFormData.value.defects[index]));
    } else {
      // 如果原始数据中也不存在，创建一个新的空对象
      tempFormData.value.defects[index] = {
        id: getId(),
        reportId: formData.value?.id || '',
        defectTitle: '',
        defectDescription: '',
        improvementSuggestion: '',
        inspector: '',
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log(`创建新的缺陷记录 #${index}:`, JSON.stringify(tempFormData.value.defects[index]));
    }
  }
  
  // 设置字段值
  tempFormData.value.defects[index][field] = value;
  console.log(`更新后的缺陷记录 #${index}:`, JSON.stringify(tempFormData.value.defects[index]));
};

// 添加一个调试函数，用于检查特定字段的值
const debugField = (key: string) => {
  console.log(`字段 ${key} 的值:`, 
    tempFormData.value ? tempFormData.value[key] : '临时数据不存在', 
    formData.value ? formData.value[key] : '表单数据不存在'
  );
  return tempFormData.value ? tempFormData.value[key] : (formData.value ? formData.value[key] : '');
};

// 更新单个图片
const updateImage = (key: string, value: string[]) => {
  formData.value[key] = value[0] || ''
}

// 判断是否为日期字段
const isDateField = (key: string): boolean => {
  const dateFields = ['inspectionDate', 'productionDate'];
  return dateFields.includes(key);
};

defineOptions({
  name: 'SpecInfo'
})
</script>
@/api/bak@/api/bak/specification