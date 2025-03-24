<template>
  <div dir="ltr" class="flex-1 ps-1 min-w-0 overflow-hidden h-screen">
    <!-- 固定在顶部的标题栏 -->
    <div class="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div class="flex justify-between items-center py-3 px-6">
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-gray-800">创建质检报告</h2>
        </div>
        <div class="flex gap-2">
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 可滚动的内容区域 -->
    <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px">
      <div class="p-6">
        <el-form :model="formData" label-width="140px" class="w-full mx-auto px-4">
          <!-- 质检信息 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">质检信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
              <el-form-item label="型号代码" class="bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.modelCode" placeholder="请输入型号代码" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="工厂代码" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.factoryCode" placeholder="请输入工厂代码" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="供应商" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.supplier" placeholder="请输入供应商" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="客户" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.client" placeholder="请输入客户" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="PO编号" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.poNumber" placeholder="请输入PO编号" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="检验日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.inspectionDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="订单数量" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input-number v-model="formData.qcReports.orderQty" :min="0" class="w-full !h-[38px]" placeholder="请输入订单数量" />
              </el-form-item>
              <el-form-item label="报告日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.reportDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="检验数量" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input-number v-model="formData.qcReports.inspectQty" :min="0" class="w-full !h-[38px]" placeholder="请输入检验数量" />
              </el-form-item>
              <el-form-item label="质检员" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.qcOfficer" placeholder="请输入质检员" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="检验结果" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-radio-group v-model="formData.qcReports.passFail">
                  <el-radio label="Pass">通过</el-radio>
                  <el-radio label="Fail">失败</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="二次质检日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-date-picker v-model="formData.qcReports.secondQcDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" class="w-full !h-[38px]" />
              </el-form-item>
              <el-form-item label="评价内容" class="col-span-3 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                <el-input v-model="formData.qcReports.comments" placeholder="请输入评价内容" class="w-full !h-[38px]" />
              </el-form-item>
            </div>
          </div>
          <!-- 图片信息 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">图片信息</h3>
            <div class="grid gap-4 lg:gap-6" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))">
              <!-- 遍历所有图片字段 -->
              <template v-for="(label, key) in basicFields" :key="key">
                <!-- 只显示图片字段 -->
                <div v-if="isImageField(key)" class="bg-gray-100 p-2 rounded flex flex-col h-full">
                  <div class="text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>

                  <ImageHandler :model-value="formData.qcReports[key] ? [formData.qcReports[key]] : []" @update:model-value="updateImageField(key, $event)" :size="200" :limit="1" :editable="true" @preview="handlePreview" class="mt-2" />
                </div>
              </template>
            </div>
          </div>
          <!-- 缺陷记录信息 -->
          <div class="mb-8" v-if="formData.defectsDTO.length > 0">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">缺陷记录信息</h3>

            <!-- 缺陷记录列表 -->
            <div class="space-y-4">
              <div v-for="(defect, index) in formData.defectsDTO" :key="defect.defects.id" class="bg-gray-50 rounded-lg p-4 shadow-sm">
                <!-- 缺陷记录标题栏 -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-base font-medium text-gray-700">缺陷记录 #{{ index + 1 }}</h4>
                  <div class="flex gap-2">
                    <template v-if="defect.isEditing">
                      <el-button type="success" size="small" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm !h-8" @click="saveDefectEdit(index)">
                        <el-icon><Check /></el-icon>
                        保存
                      </el-button>
                      <el-button size="small" class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm !h-8" @click="cancelDefectEdit(index)">取消</el-button>
                    </template>
                    <template v-else>
                      <el-button type="primary" size="small" @click="startDefectEdit(index)" class="!h-8">
                        <el-icon><Edit /></el-icon>
                        编辑
                      </el-button>
                    </template>
                    <el-button type="danger" size="small" @click="removeDefect(index)" class="!h-8">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </div>

                <!-- 缺陷记录内容 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <el-form-item label="缺陷标题" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.defectTitle" placeholder="请输入缺陷标题" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.defectTitle }}
                    </div>
                  </el-form-item>

                  <el-form-item label="检查人员" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.inspector" placeholder="请输入检查人员" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.inspector }}
                    </div>
                  </el-form-item>

                  <el-form-item label="缺陷描述" class="col-span-2 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.defectDescription" placeholder="请输入缺陷描述" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.defectDescription }}
                    </div>
                  </el-form-item>

                  <el-form-item label="改进建议" class="col-span-2 bg-gray-100 p-1 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <template v-if="defect.isEditing">
                      <el-input v-model="defect.editData.defects.improvementSuggestion" placeholder="请输入改进建议" class="w-full !h-[38px]" />
                    </template>
                    <div v-else class="w-full text-gray-700 bg-white p-2 rounded h-[38px] leading-[22px]">
                      {{ defect.defects.improvementSuggestion }}
                    </div>
                  </el-form-item>

                  <!-- 缺陷图片展示 -->
                  <el-form-item label="缺陷图片" class="col-span-2 bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                    <div class="w-full">
                      <template v-if="defect.isEditing">
                        <ImageHandler v-model="defect.editData.defectImages" :limit="2" :size="120" :editable="true" @preview="handlePreview" />
                      </template>
                      <template v-else>
                        <ImageHandler :model-value="defect.defectImages.map(img => img.imagePath)" :size="120" :editable="false" @preview="handlePreview" />
                      </template>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>

          <!-- 缺陷记录弹窗 -->
          <el-dialog
            v-model="defectDialogVisible"
            title="添加缺陷记录"
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
            <el-form :model="currentDefect" label-width="100px">
              <div class="grid grid-cols-1 gap-4">
                <el-form-item label="缺陷标题" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.defectTitle" placeholder="请输入缺陷标题" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="检查人员" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.inspector" placeholder="请输入检查人员" class="w-full !h-[38px]" />
                </el-form-item>

                <el-form-item label="缺陷描述" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.defectDescription" type="textarea" :rows="3" placeholder="请输入缺陷描述" class="w-full" />
                </el-form-item>

                <el-form-item label="改进建议" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <el-input v-model="currentDefect.defects.improvementSuggestion" type="textarea" :rows="3" placeholder="请输入改进建议" class="w-full" />
                </el-form-item>

                <!-- 缺陷图片 -->
                <el-form-item label="缺陷图片" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center !mb-2" label-position="left">
                  <div class="w-full">
                    <ImageHandler v-model="defectImageUrls" :editable="true" :size="120" :limit="2" :multiple="true" />
                  </div>
                </el-form-item>
              </div>
            </el-form>

            <template #footer>
              <div class="flex justify-end gap-4">
                <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="saveDefect">
                  <el-icon><Check /></el-icon>
                  确定
                </el-button>
                <el-button class="bg-gray-200 hover:bg-gray-300 border-0 shadow-sm" @click="defectDialogVisible = false">取消</el-button>
              </div>
            </template>
          </el-dialog>

          <!-- 图片预览弹窗 -->
          <el-dialog
            v-model="dialogVisible"
            :title="'图片预览'"
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
            <img :src="dialogImageUrl" class="max-h-[300px] w-auto object-contain" />
          </el-dialog>
        </el-form>
      </div>
    </div>

    <!-- 固定在底部的提交按钮 -->
    <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0">
      <div class="bg-white shadow-[0_-2px_3px_rgba(0,0,0,0.1)]">
        <div class="p-4 flex justify-center items-center gap-4 mx-auto">
          <el-button type="primary" plain @click="addDefect">
            <el-icon><Plus /></el-icon>
            添加缺陷记录
          </el-button>
          <el-button type="success" class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" @click="submitForm">
            <el-icon><Check /></el-icon>
            提交质检报告
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Check, Back, Delete, Plus, Edit, DataLine} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import type {QcReportsDto, Defects, DefectImages, DefectsDto} from '@/api/interface'
import ImageHandler from '@/components/ImageHandler.vue'
import {getId} from '@/utils/idUtils'
import {postQcReportsDtoSave} from '@/api/controller'

// 添加编辑相关的类型
interface DefectEditData {
  defects: {
    defectTitle: string
    defectDescription: string
    improvementSuggestion: string
    inspector: string
  }
  defectImages: string[]
}

// 扩展DefectsDto接口，添加UI相关属性
interface ExtendedDefectsDto extends DefectsDto {
  isEditing?: boolean
  editData?: DefectEditData
}

// 扩展QcReportsDto接口，使用ExtendedDefectsDto
interface ExtendedQcReportsDto extends Omit<QcReportsDto, 'defectsDTO'> {
  defectsDTO?: ExtendedDefectsDto[]
}

const router = useRouter()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const defectDialogVisible = ref(false)
const currentDefect = ref<ExtendedDefectsDto>({
  defects: {
    id: getId(),
    defectTitle: '',
    defectDescription: '',
    improvementSuggestion: '',
    inspector: ''
  },
  defectImages: []
})

const formData = ref<ExtendedQcReportsDto>({
  qcReports: {
    id: getId(),
    modelCode: '',
    factoryCode: '',
    supplier: '',
    client: '',
    poNumber: '',
    inspectionDate: '',
    orderQty: 0,
    reportDate: '',
    inspectQty: 0,
    qcOfficer: '',
    passFail: 'Pass',
    secondQcDate: '',
    comments: '',
    stocksInWarehouse: '',
    samplingOfProductsQuantity: '',
    shippingMarks: '',
    barcode: '',
    packingOutside: '',
    packingInside: '',
    chairComponentsPacked: '',
    chairComponentsUnpacked: '',
    fittingPackPacked: '',
    fittingPackUnpacked: '',
    productionLabel: '',
    assemblyInstructions: '',
    imageOfComponentsSeat: '',
    imageOfComponentsBack: '',
    imageOfComponentsBase: '',
    imageOfComponentsCastors: '',
    imageOfComponentsGasLiftCover: '',
    imageOfComponentsGasLiftStamp: '',
    imageOfComponentsArmrest: '',
    imageOfComponentMechanism: '',
    imageOfComponentsHeadrest: '',
    imageOfProductBuiltFront: '',
    imageOfProductBuiltSide: '',
    imageOfProductBuiltBack: '',
    imageOfProductBuilt45Degree: '',
    frontImageOfProductBuiltCompare1: '',
    frontImageOfProductBuiltCompare2: '',
    functionCheckSeatHeightExtension: '',
    functionCheckMechanismAdjustment: '',
    functionCheckArmrestAdjustment: '',
    functionCheckHeadrestAdjustment: '',
    functionCheckOther1: '',
    functionCheckOther2: ''
  },
  defectsDTO: []
})

// 修改 defectImageUrls 的定义，确保它是响应式数组
const defectImageUrls = ref<string[]>([])

// 基本字段定义
const basicFields = {
  // 基础信息字段
  id: '序列号',
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
  passFail: '检验结果',
  secondQcDate: '二次质检日期',
  comments: '评价内容',

  // 产品外观图片
  stocksInWarehouse: '仓库库存图片',
  samplingOfProductsQuantity: '产品抽样数量图片',
  shippingMarks: '运输标记图片',
  barcode: '条形码图片',
  packingOutside: '外包装图片',
  packingInside: '内包装图片',

  // 椅子组件图片
  chairComponentsPacked: '椅子组件-已包装图片',
  chairComponentsUnpacked: '椅子组件-未包装图片',

  // 配件包图片
  fittingPackPacked: '配件包-已包装图片',
  fittingPackUnpacked: '配件包-未包装图片',
  productionLabel: '生产标签图片',
  assemblyInstructions: '组装说明图片',

  // 组件图片
  imageOfComponentsSeat: '组件图片-座椅',
  imageOfComponentsBack: '组件图片-靠背',
  imageOfComponentsBase: '组件图片-底座',
  imageOfComponentsCastors: '组件图片-脚轮',
  imageOfComponentsGasLiftCover: '组件图片-气压棒外罩',
  imageOfComponentsGasLiftStamp: '组件图片-气压棒标记',
  imageOfComponentsArmrest: '组件图片-扶手',
  imageOfComponentMechanism: '组件图片-机构',
  imageOfComponentsHeadrest: '组件图片-头枕',

  // 成品图片
  imageOfProductBuiltFront: '成品图片-正视图',
  imageOfProductBuiltSide: '成品图片-侧视图',
  imageOfProductBuiltBack: '成品图片-背视图',
  imageOfProductBuilt45Degree: '成品图片-45度视图',
  frontImageOfProductBuiltCompare1: '成品图片-样品对比图1',
  frontImageOfProductBuiltCompare2: '成品图片-样品对比图2',

  // 功能检查图片
  functionCheckSeatHeightExtension: '功能检查-座椅高度调节',
  functionCheckMechanismAdjustment: '功能检查-机构调节',
  functionCheckArmrestAdjustment: '功能检查-扶手调节',
  functionCheckHeadrestAdjustment: '功能检查-头枕调节',
  functionCheckOther1: '功能检查-其他1',
  functionCheckOther2: '功能检查-其他2'
}

// 修改 isImageField 函数的实现
const isImageField = (key: string): boolean => {
  // 排除基础字段
  const basicFieldKeys = ['id', 'modelCode', 'factoryCode', 'supplier', 'client', 'poNumber', 'inspectionDate', 'orderQty', 'reportDate', 'inspectQty', 'qcOfficer', 'passFail', 'secondQcDate', 'comments']
  return !basicFieldKeys.includes(key)
}

// 判断是否为日期字段
const isDateField = (key: keyof QcReportsDto['qcReports']): boolean => {
  const dateFields = ['inspectionDate', 'reportDate', 'secondQcDate']
  return dateFields.includes(key)
}

// 添加删除缺陷记录的函数
const removeDefect = (index: number) => {
  if (formData.value.defectsDTO) {
    formData.value.defectsDTO.splice(index, 1)
    ElMessage.success('缺陷记录已删除')
  }
}

// 修改 saveDefect 函数,添加编辑状态
const saveDefect = () => {
  // 验证必填字段
  if (!currentDefect.value.defects?.defectTitle) {
    ElMessage.warning('请输入缺陷标题')
    return
  }
  if (!currentDefect.value.defects?.defectDescription) {
    ElMessage.warning('请输入缺陷描述')
    return
  }
  if (!currentDefect.value.defects?.improvementSuggestion) {
    ElMessage.warning('请输入改进建议')
    return
  }
  if (!currentDefect.value.defects?.inspector) {
    ElMessage.warning('请输入检查人员')
    return
  }

  // 验证是否有图片
  if (defectImageUrls.value.length === 0) {
    ElMessage.warning('请至少上传一张缺陷图片')
    return
  }

  // 创建新的缺陷记录对象
  const newDefect: ExtendedDefectsDto = {
    defects: {
      ...currentDefect.value.defects,
      id: getId(),
      reportId: formData.value.qcReports?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    defectImages: defectImageUrls.value.map(url => ({
      id: getId(),
      defectId: currentDefect.value.defects?.id || '',
      imagePath: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    isEditing: false
  }

  // 添加到表单数据中
  if (formData.value.defectsDTO) {
    formData.value.defectsDTO.push(newDefect)
  } else {
    formData.value.defectsDTO = [newDefect]
  }

  // 重置表单和图片数组
  currentDefect.value = {
    defects: {
      id: getId(),
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: ''
    },
    defectImages: []
  }
  defectImageUrls.value = []

  defectDialogVisible.value = false
  ElMessage.success('缺陷记录添加成功')
}

// 开始编辑
const startDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  if (!defect.defects || !defect.defectImages) return

  defect.isEditing = true
  defect.editData = {
    defects: {...defect.defects},
    defectImages: defect.defectImages.map(img => img.imagePath || '')
  }
}

// 保存编辑
const saveDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  if (!defect.editData || !defect.defects) return

  // 验证必填字段
  if (!defect.editData.defects.defectTitle) {
    ElMessage.warning('请输入缺陷标题')
    return
  }
  if (!defect.editData.defects.defectDescription) {
    ElMessage.warning('请输入缺陷描述')
    return
  }
  if (!defect.editData.defects.improvementSuggestion) {
    ElMessage.warning('请输入改进建议')
    return
  }
  if (!defect.editData.defects.inspector) {
    ElMessage.warning('请输入检查人员')
    return
  }
  if (defect.editData.defectImages.length === 0) {
    ElMessage.warning('请至少上传一张缺陷图片')
    return
  }

  // 更新数据
  if (defect.defects) {
    Object.assign(defect.defects, defect.editData.defects)
  }

  defect.defectImages = defect.editData.defectImages.map(url => ({
    id: getId(),
    defectId: defect.defects?.id || '',
    imagePath: url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))

  defect.isEditing = false
  defect.editData = undefined
  ElMessage.success('修改成功')
}

// 取消编辑
const cancelDefectEdit = (index: number) => {
  if (!formData.value.defectsDTO) return
  const defect = formData.value.defectsDTO[index]
  defect.isEditing = false
  defect.editData = undefined
}

// 添加缺陷记录时重置所有数据
const addDefect = () => {
  currentDefect.value = {
    defects: {
      id: getId(),
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: ''
    },
    defectImages: []
  }
  defectImageUrls.value = [] // 确保重置图片数组
  defectDialogVisible.value = true
}

// 处理图片预览
const handlePreview = (url: string) => {
  dialogImageUrl.value = url
  dialogVisible.value = true
}

// 添加提交表单函数
const submitForm = async () => {
  try {
    // 确保formData已初始化
    initializeFormData()

    // 表单验证
    if (!formData.value.qcReports?.modelCode) {
      ElMessage.warning('请输入型号代码')
      return
    }
    if (!formData.value.qcReports?.factoryCode) {
      ElMessage.warning('请输入工厂代码')
      return
    }
    if (!formData.value.qcReports?.supplier) {
      ElMessage.warning('请输入供应商')
      return
    }
    if (!formData.value.qcReports?.client) {
      ElMessage.warning('请输入客户')
      return
    }
    if (!formData.value.qcReports?.poNumber) {
      ElMessage.warning('请输入PO编号')
      return
    }
    if (!formData.value.qcReports?.inspectionDate) {
      ElMessage.warning('请选择检验日期')
      return
    }
    if (!formData.value.qcReports?.qcOfficer) {
      ElMessage.warning('请输入质检员')
      return
    }

    // 确保所有必要的关联ID都已设置
    if (formData.value.defectsDTO) {
      formData.value.defectsDTO.forEach(dto => {
        if (formData.value.qcReports?.id && dto.defects) {
          dto.defects.reportId = formData.value.qcReports.id
          if (dto.defectImages) {
            dto.defectImages.forEach(img => {
              if (dto.defects) {
                img.defectId = dto.defects.id
              }
            })
          }
        }
      })
    }

    // 打印formData内容，用于调试
    console.log('提交的formData:', JSON.stringify(formData.value))

    // 转换为API需要的格式
    const apiData: QcReportsDto = {
      qcReports: formData.value.qcReports,
      defectsDTO: formData.value.defectsDTO
    }

    // 调用保存API
    const response = await postQcReportsDtoSave(apiData)
    console.log('API响应:', response)
    if (response?.data) {
      ElMessage.success('质检报告提交成功')
      // 跳转到列表页面
      router.push({
        name: 'specList'
      })
    } else {
      ElMessage.error('提交失败')
    }
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(`提交失败: ${error.message || '未知错误'}`)
  }
}

// 修改 initializeImageFields 函数
const initializeImageFields = () => {
  if (!formData.value.qcReports) return

  const allFields = Object.keys(formData.value.qcReports)

  allFields.forEach(field => {
    if (isImageField(field) && formData.value.qcReports && formData.value.qcReports[field] === undefined) {
      formData.value.qcReports[field] = ''
    }
  })
}

// 修改 updateImageField 函数
const updateImageField = (key: string, value: string[]) => {
  if (isImageField(key) && formData.value.qcReports) {
    formData.value.qcReports[key] = value[0] || '' // 只取第一张图片
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initializeFormData()
})

// 初始化表单数据
const initializeFormData = () => {
  // 确保qcReports对象存在
  if (!formData.value.qcReports) {
    formData.value.qcReports = {
      id: getId(),
      modelCode: '',
      factoryCode: '',
      supplier: '',
      client: '',
      poNumber: '',
      inspectionDate: '',
      orderQty: 0,
      reportDate: '',
      inspectQty: 0,
      qcOfficer: '',
      passFail: 'Pass',
      secondQcDate: '',
      comments: ''
    }
  }

  // 确保defectsDTO数组存在
  if (!formData.value.defectsDTO) {
    formData.value.defectsDTO = []
  }

  // 初始化图片字段
  initializeImageFields()
}
</script>
