<template>
  <div class="h-full bg-gray-100">
    <!-- 顶部操作栏 -->
    <div class="fixed top-0 left-0 right-0 z-10">
      <div class="flex items-center justify-between py-3 px-6 bg-white border-b border-gray-200">
        <div class="flex items-center gap-2">
          <el-button @click="$router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
          <span class="text-lg font-medium">规格详情</span>
        </div>
        <div class="flex items-center gap-2">
          <el-button type="primary" @click="handleExport">
            <el-icon><Document /></el-icon>
            导出
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="pt-[60px] h-full overflow-auto">
      <el-skeleton :loading="loading" animated>
        <template #default>
          <div class="max-w-[1200px] mx-auto">
            <div class="bg-white rounded-lg shadow-sm">
              <div class="p-6">
                <!-- 基本信息部分 -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                    <span>基本信息</span>
                    <div class="flex gap-2 ml-auto">
                      <template v-if="editingSections.includes('basic')">
                        <el-button type="success" @click="handleSave('basic')">
                          <el-icon><Check /></el-icon>
                          保存
                        </el-button>
                        <el-button type="danger" @click="handleCancel('basic')">
                          <el-icon><Close /></el-icon>
                          取消
                        </el-button>
                      </template>
                      <template v-else>
                        <el-button type="primary" @click="handleEdit('basic')">
                          <el-icon><Edit /></el-icon>
                          编辑
                        </el-button>
                      </template>
                    </div>
                  </h3>

                  <el-form 
                    :model="formData"
                    label-width="140px"
                    class="[&_.el-form-item__label]:text-gray-600 [&_.el-form-item__label]:font-medium [&_.el-input__wrapper]:shadow-none [&_.el-input__inner]:h-[38px]"
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <template v-for="(label, key) in basicFields" :key="key">
                        <el-form-item 
                          :label="label" 
                          :class="[
                            'mb-4',
                            key === 'comments' ? 'col-span-full' : ''
                          ]"
                        >
                          <template v-if="editingSections.includes('basic')">
                            <template v-if="key === 'comments'">
                              <el-input 
                                v-model="formData[key]"
                                type="textarea"
                                :rows="4"
                                :placeholder="`请输入${label}`"
                                class="w-full"
                              />
                            </template>
                            <template v-else>
                              <el-input 
                                v-model="formData[key]"
                                :placeholder="`请输入${label}`"
                                class="w-full"
                              />
                            </template>
                          </template>
                          <template v-else>
                            <div :class="[
                              'w-full text-gray-700 bg-white p-2 rounded',
                              key === 'comments' ? 'min-h-[100px] whitespace-pre-wrap' : 'h-[38px] leading-[22px]'
                            ]">
                              {{ formatFieldValue(key, formData[key]) || '-' }}
                            </div>
                          </template>
                        </el-form-item>
                      </template>
                    </div>
                  </el-form>
                </div>

                <!-- 图片部分 -->
                <template v-for="(section, _index) in imageSections" :key="section.key">
                  <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-800 w-full border-b pb-2 flex justify-between items-center">
                      <span>{{ section.title }}</span>
                      <div class="flex gap-2 ml-auto">
                        <template v-if="editingSections.includes(section.key)">
                          <el-button type="success" @click="handleSave(section.key)">
                            <el-icon><Check /></el-icon>
                            保存
                          </el-button>
                          <el-button type="danger" @click="handleCancel(section.key)">
                            <el-icon><Close /></el-icon>
                            取消
                          </el-button>
                        </template>
                        <template v-else>
                          <el-button type="primary" @click="handleEdit(section.key)">
                            <el-icon><Edit /></el-icon>
                            编辑
                          </el-button>
                        </template>
                      </div>
                    </h3>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                      <div v-for="(label, key) in section.fields" :key="key" class="bg-white rounded-lg p-4">
                        <div class="text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>
                        <div class="w-full h-[240px] bg-white rounded-lg overflow-hidden">
                          <ImageHandler 
                            :model-value="getImageValue(key)"
                            @update:model-value="val => updateImageValue(key, val)"
                            :editable="editingSections.includes(section.key)"
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
        </template>
      </el-skeleton>
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

// 切换编辑状态
const handleEdit = (section: string) => {
  // 输出点击编辑前的数据
  console.log('点击编辑前的数据:', JSON.stringify(formData.value));
  
  // 创建当前数据的深拷贝作为临时数据
  if (formData.value) {
    try {
      // 使用深拷贝创建临时数据
      tempFormData.value = JSON.parse(JSON.stringify(formData.value));
      console.log('临时数据已创建:', JSON.stringify(tempFormData.value));
      
      // 检查几个关键字段
      debugField('modelCode');
      debugField('supplier');
      debugField('poNumber');
    } catch (error) {
      console.error('创建临时数据失败:', error);
      tempFormData.value = { ...formData.value }; // 使用浅拷贝作为备选
    }
  } else {
    // 如果 formData.value 不存在，创建一个空对象
    tempFormData.value = {};
    console.warn('formData.value 不存在，创建了空对象');
  }
  
  // 添加到编辑区域列表
  editingSections.value.push(section);
  
  // 输出点击编辑后的数据
  console.log('点击编辑后的数据:', JSON.stringify(tempFormData.value));
};

// 处理保存按钮点击
const handleSave = async (section: string) => {
  // 确保 tempFormData.value 存在
  if (!tempFormData.value) {
    ElMessage.error('没有要保存的数据');
    return;
  }
  
  try {
    loading.value = true;
    
    // 1. 处理待删除的图片
    if (pendingDeleteImages.value.length > 0) {
      // 删除服务器上的文件
      const deletePromises = pendingDeleteImages.value.map(imagePath => 
        removeFile(imagePath)
      );
      await Promise.all(deletePromises);
      pendingDeleteImages.value = []; // 清空待删除列表
    }
    
    // 2. 准备更新的数据
    const updateData = {
      ...tempFormData.value
    };
    
    // 3. 发送更新请求
    const response = await updateSpecification(updateData);
    
    if (response?.code === '200') {
      // 4. 更新成功，刷新页面数据
      // 先更新本地数据，避免等待网络请求的延迟
      formData.value = JSON.parse(JSON.stringify(tempFormData.value));
      ElMessage.success('保存成功');
      
      // 5. 退出编辑模式
      editingSections.value = [];
      // 清空临时数据
      tempFormData.value = null;
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
  // 创建一个新的临时数据对象
  tempFormData.value = {
    ...tempFormData.value,
    defects: [...(formData.value.defects || [])]
  }

  // 确保当前编辑的缺陷记录存在
  if (formData.value && formData.value.defects && formData.value.defects[index]) {
    // 深拷贝当前缺陷记录
    tempFormData.value.defects[index] = JSON.parse(JSON.stringify(formData.value.defects[index]))
  }

  // 添加到编辑区域
  editingSections.value.push(`defect-${index}`)
  console.log(`开始编辑缺陷记录 #${index + 1}`, tempFormData.value.defects[index])
}

// 修复 handleSaveDefect 函数，确保正确保存数据
const handleSaveDefect = async (index: number) => {
  if (!tempFormData.value || !tempFormData.value.defects || !tempFormData.value.defects[index]) {
    ElMessage.error('没有要保存的数据');
    return;
  }
  
  try {
    loading.value = true;
    const defect = tempFormData.value.defects[index];
    
    console.log('保存缺陷记录:', defect);
    
    // 更新缺陷记录
    const response = await updateDefects(defect);
    
    if (response?.code === '200') {
      // 更新本地数据
      formData.value.defects[index] = JSON.parse(JSON.stringify(defect));
      ElMessage.success('保存成功');
      
      // 退出编辑模式
      editingSections.value = editingSections.value.filter((section: string) => section !== `defect-${index}`);
      
      // 如果没有其他正在编辑的项，清空临时数据
      if (editingSections.value.length === 0) {
        tempFormData.value = null;
      }
    } else {
      ElMessage.error('保存失败：' + (response?.message || '未知错误'));
    }
  } catch (error) {
    console.error('保存缺陷记录失败:', error);
    ElMessage.error('保存失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 修复 handleCancelDefect 函数，确保正确取消编辑
const handleCancelDefect = (index: number) => {
  // 直接退出编辑模式，不保存任何更改
  editingSections.value = editingSections.value.filter((section: string) => section !== `defect-${index}`);
  
  // 如果只编辑了这一个缺陷记录，可以清空临时数据
  if (editingSections.value.length === 0) {
    tempFormData.value = null;
  } else if (tempFormData.value && tempFormData.value.defects) {
    // 否则，恢复这个缺陷记录的原始数据
    tempFormData.value.defects[index] = JSON.parse(JSON.stringify(formData.value.defects[index]));
  }
  
  ElMessage.info('已取消编辑');
};

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
const handleDefectImageUpdate = (val: string, defectIndex: number, imageIndex: number) => {
  // 确保 tempFormData 已初始化
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value));
  }
  
  // 确保 defects 数组存在
  if (!tempFormData.value.defects) {
    tempFormData.value.defects = [];
  }
  
  // 确保特定索引的缺陷记录存在
  if (!tempFormData.value.defects[defectIndex]) {
    if (formData.value && formData.value.defects && formData.value.defects[defectIndex]) {
      tempFormData.value.defects[defectIndex] = JSON.parse(JSON.stringify(formData.value.defects[defectIndex]));
    } else {
      // 如果原始数据中也不存在，创建一个新的空对象
      tempFormData.value.defects[defectIndex] = {
        id: getId(),
        reportId: formData.value.id,
        defectTitle: '',
        defectDescription: '',
        improvementSuggestion: '',
        inspector: '',
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }
  
  // 确保 images 数组存在
  if (!tempFormData.value.defects[defectIndex].images) {
    tempFormData.value.defects[defectIndex].images = [];
  }
  
  // 更新或添加图片
  if (imageIndex >= tempFormData.value.defects[defectIndex].images.length) {
    // 添加新图片
    const newImage = {
      id: getId(),
      defectId: tempFormData.value.defects[defectIndex].id,
      imagePath: val,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tempFormData.value.defects[defectIndex].images.push(newImage);
  } else {
    // 更新现有图片
    tempFormData.value.defects[defectIndex].images[imageIndex].imagePath = val;
  }
  
  console.log(`更新缺陷 #${defectIndex + 1} 的图片 #${imageIndex + 1}:`, val);
};

// 处理添加缺陷图片
const handleDefectImageAdd = async (val: string, defectIndex: number) => {
  if (!tempFormData.value || !tempFormData.value.defects) return;
  
  const defect = tempFormData.value.defects[defectIndex];
  if (!defect.images) defect.images = [];
  
  // 创建新的图片对象
  const newImage = {
    id: getId(),
    defectId: defect.id,
    imagePath: val,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  defect.images.push(newImage);
  console.log(`添加缺陷 #${defectIndex + 1} 的新图片:`, val);
  
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
}

// 保存新缺陷记录
const handleSaveNewDefect = async () => {
  try {
    loading.value = true
    
    // 验证必填字段
    if (!newDefectForm.value.defects.defectTitle || !newDefectForm.value.defects.defectDescription) {
      ElMessage.warning('请填写问题标题和问题描述')
      return
    }
    
    // 验证 reportId
    if (!newDefectForm.value.defects.reportId) {
      ElMessage.error('报告ID不能为空')
      return
    }
    
    // 准备要保存的数据
    const saveData: IDefect = {
      id: newDefectForm.value.defects.id,
      reportId: newDefectForm.value.defects.reportId,
      defectTitle: newDefectForm.value.defects.defectTitle,
      defectDescription: newDefectForm.value.defects.defectDescription,
      improvementSuggestion: newDefectForm.value.defects.improvementSuggestion,
      inspector: newDefectForm.value.defects.inspector,
      createdAt: newDefectForm.value.defects.createdAt,
      updatedAt: newDefectForm.value.defects.updatedAt
    }
    
    try {
      // 1. 保存缺陷记录
      const response = await saveDefects(saveData)
      console.log('Save defect response:', response)
      
      if (response?.data) {
        // 2. 保存图片记录
        if (newUploadedImages.value.length > 0) {
          const saveImagePromises = newUploadedImages.value.map(image => {
            // 构建正确的图片数据结构
            const imageData: IDefectImage = {
              ...image,
              defectId: response.data.id,  // 使用新保存的缺陷记录ID
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
            console.log('Saving image with data:', imageData)
            return saveDefectImages(imageData)
          })
          await Promise.all(saveImagePromises)
        }
        
        ElMessage.success('添加成功')
        addDefectDialogVisible.value = false
        newUploadedImages.value = []
        
        // 重新获取最新数据
        await getData()
      } else {
        throw new Error('保存失败：未收到服务器响应')
      }
    } catch (error) {
      // 保存失败时删除已上传的图片
      const deletePromises = newUploadedImages.value.map(image => 
        removeFile(image.imagePath)
      )
      await Promise.all(deletePromises)
      throw error
    }
  } catch (error: any) {
    console.error('添加失败:', error)
    ElMessage.error(`添加失败: ${error.message || '未知错误'}`)
  } finally {
    loading.value = false
  }
}

// 处理缺陷图片删除
const handleDefectImageRemove = async (file: UploadFile, defectIndex: number) => {
  try {
    if (!file.url || !tempFormData.value) {
      return
    }

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

    // 从临时数据中找到要删除的图片
    const images = tempFormData.value.defects[defectIndex].images
    const imageIndex = images.findIndex(img => img.imagePath === file.url)
    
    if (imageIndex > -1) {
      const imageToDelete = images[imageIndex]
      
      // 将要删除的图片信息添加到待删除列表
      pendingDeleteDefectImages.value.push({
        id: imageToDelete.id,
        imagePath: imageToDelete.imagePath
      })
      
      // 从临时数据中移除图片
      images.splice(imageIndex, 1)
      
      ElMessage.success('图片已标记为待删除')
    }
  } catch (error: any) {
    if (error === 'cancel') {
      return
    }
    console.error('删除失败:', error)
    ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  }
}

// 处理临时文件
const handleTempFile = (filePath: string) => {
  tempFiles.value.push(filePath)
}

// 添加图片值获取方法
const getImageValue = (key: string): string => {
  if (!tempFormData.value) {
    return (formData.value as Record<string, any>)[key] || ''
  }
  return (tempFormData.value as Record<string, any>)[key] || ''
}

// 修改图片值更新方法
const updateImageValue = (key: string, value: string) => {
  if (!tempFormData.value) {
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }
  if (tempFormData.value) {
    const data = tempFormData.value as Record<string, any>
    data[key] = value
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
  // 清空临时数据
  tempFormData.value = null
  
  // 清空待删除图片列表
  pendingDeleteImages.value = []
  
  // 退出编辑模式
  editingSections.value = []
  
  ElMessage.info('已取消编辑')
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

// 处理新缺陷记录图片添加
const handleNewDefectImageAdd = async (newPath: string) => {
  if (!newPath) return;
  
  const newImage: IDefectImage = {
    id: getId(),
    defectId: '', // 将在保存缺陷记录时设置
    imagePath: newPath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // 添加到表单数据和上传列表
  newDefectForm.value.defectImages.push(newImage);
  newUploadedImages.value.push(newImage);
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
</script>
