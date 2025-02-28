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
    <div class="bg-white overflow-auto" style="height: calc(100vh - 64px); padding-bottom: 72px;">
      <div class="p-6">
        <el-form
          :model="formData"
          label-width="140px"
          class="w-full mx-auto px-4"
        >
          <!-- 质检信息 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">质检信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <el-form-item label="型号代码" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.modelCode"
                  placeholder="请输入型号代码"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="工厂代码" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.factoryCode"
                  placeholder="请输入工厂代码"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="供应商" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.supplier"
                  placeholder="请输入供应商"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="客户" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.client"
                  placeholder="请输入客户"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="PO编号" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.poNumber"
                  placeholder="请输入PO编号"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="检验日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-date-picker
                  v-model="formData.qcReports.inspectionDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="订单数量" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input-number 
                  v-model="formData.qcReports.orderQty" 
                  :min="0" 
                  class="w-full"
                  placeholder="请输入订单数量"
                />
              </el-form-item>
              <el-form-item label="报告日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-date-picker
                  v-model="formData.qcReports.reportDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="检验数量" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input-number 
                  v-model="formData.qcReports.inspectQty" 
                  :min="0" 
                  class="w-full"
                  placeholder="请输入检验数量"
                />
              </el-form-item>
              <el-form-item label="质检员" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input 
                  v-model="formData.qcReports.qcOfficer"
                  placeholder="请输入质检员"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="检验结果" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-radio-group v-model="formData.qcReports.passFail">
                  <el-radio label="Pass">通过</el-radio>
                  <el-radio label="Fail">失败</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="二次质检日期" class="bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-date-picker
                  v-model="formData.qcReports.secondQcDate"
                  type="date"
                  placeholder="选择日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item label="评价内容" class="col-span-3 bg-gray-100 p-2 rounded flex flex-col sm:flex-row items-start sm:items-center" label-position="left">
                <el-input
                  v-model="formData.qcReports.comments"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入评价内容"
                  class="w-full"
                />
              </el-form-item>
            </div>
          </div>
          <!-- 图片信息 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4 border-b pb-2">图片信息</h3>
            <div class="grid gap-4 lg:gap-6"
              style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));"
            >
              <!-- 遍历所有图片字段 -->
              <template v-for="(label, key) in basicFields" :key="key">
                <!-- 只显示图片字段 -->
                <div 
                  v-if="isImageField(key)"
                  class="bg-gray-100 p-2 rounded flex flex-col h-full"
                >
                  <div class="text-sm text-gray-600 mb-2 font-medium">{{ label }}</div>
                  
                  <ImageHandler
                    :model-value="formData.qcReports[key] ? [formData.qcReports[key]] : []"
                    @update:model-value="updateImageField(key, $event)"
                    :size="200"
                    :limit="1"
                    :editable="true"
                    @preview="handlePreview"
                    class="mt-2"
                  />
                </div>
              </template>
            </div>
          </div>

          <!-- 缺陷记录弹窗 -->
          <el-dialog
            v-model="defectDialogVisible"
            title="添加缺陷记录"
            width="800px"
            :close-on-click-modal="false"
            class="!fixed defect-dialog"
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
              <el-form-item label="缺陷标题" class="bg-gray-100 p-2 rounded" label-position="left">
                <el-input v-model="currentDefect.defects.defectTitle" placeholder="请输入缺陷标题" />
              </el-form-item>
              <el-form-item label="缺陷描述" class="bg-gray-100 p-2 rounded" label-position="left">
                <el-input
                  v-model="currentDefect.defects.defectDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入缺陷描述"
                />
              </el-form-item>
              <el-form-item label="改进建议" class="bg-gray-100 p-2 rounded" label-position="left">
                <el-input
                  v-model="currentDefect.defects.improvementSuggestion"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入改进建议"
                />
              </el-form-item>
              <el-form-item label="检查人员" class="bg-gray-100 p-2 rounded" label-position="left">
                <el-input v-model="currentDefect.defects.inspector" placeholder="请输入检查人员" />
              </el-form-item>
              
              <!-- 缺陷图片 -->
              <el-form-item label="缺陷图片" class="bg-gray-100 p-2 rounded" label-position="left">
                <div class="flex gap-4">
                  <ImageHandler
                    v-model="defectImageUrls"
                    class="w-[200px] h-[200px]"
                    :limit="2"
                    :editable="true"
                  />
                </div>
              </el-form-item>
            </el-form>
            
            <template #footer>
              <div class="flex justify-end gap-2">
                <el-button @click="defectDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveDefect">确定</el-button>
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
            <img 
              :src="dialogImageUrl" 
              class="max-h-[300px] w-auto object-contain"
            />
          </el-dialog>
        </el-form>
      </div>
    </div>

    <!-- 固定在底部的提交按钮 -->
    <div class="fixed bottom-0 right-0 z-10 ps-1 min-w-0" style="width: calc(100% - 256px); margin-right: 0;">
      <div class="bg-white shadow-[0_-2px_3px_rgba(0,0,0,0.1)]">
        <div class="p-4 flex justify-center items-center gap-4 mx-auto">
          <el-button type="primary" plain @click="addDefect">
            <el-icon><Plus /></el-icon>
            添加缺陷记录
          </el-button>
          <el-button 
            type="success" 
            class="bg-green-500 hover:bg-green-600 border-0 shadow-sm" 
            @click="submitForm"
          >
            <el-icon><Check /></el-icon>
            提交质检报告
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Back, Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { QcReportsDTO, DefectsDTO, DefectImages } from '@/types/qcReport'
import ImageHandler from '@/components/ImageHandler.vue'
import { getId } from '@/utils/idUtils'
import { saveQcReportsDTO } from '@/api/specification'

const router = useRouter()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const defectDialogVisible = ref(false)
const currentDefect = ref<DefectsDTO>({
  defects: {
    id: getId(),
    defectTitle: '',
    defectDescription: '',
    improvementSuggestion: '',
    inspector: ''
  },
  defectImages: []
})

const formData = ref<QcReportsDTO>({
  qcReports: {
    id: getId(),
    modelCode: '',
    factoryCode: '',
    supplier: '',
    client: '',
    poNumber: '',
    inspectionDate: null,
    orderQty: 0,
    reportDate: null,
    inspectQty: 0,
    qcOfficer: '',
    passFail: 'Pass',
    secondQcDate: null,
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
    functionCheckOther2: '',
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
  const basicFieldKeys = [
    'id', 'modelCode', 'factoryCode', 'supplier', 'client', 'poNumber',
    'inspectionDate', 'orderQty', 'reportDate', 'inspectQty', 'qcOfficer',
    'passFail', 'secondQcDate', 'comments'
  ]
  return !basicFieldKeys.includes(key)
}

// 判断是否为日期字段
const isDateField = (key: keyof QcReportsDTO['qcReports']): boolean => {
  const dateFields = ['inspectionDate', 'reportDate', 'secondQcDate']
  return dateFields.includes(key)
}

// 修改保存缺陷记录的方法
const saveDefect = () => {
  // 验证必填字段
  if (!currentDefect.value.defects.defectTitle) {
    ElMessage.warning('请输入缺陷标题')
    return
  }

  // 验证是否有图片
  if (defectImageUrls.value.length === 0) {
    ElMessage.warning('请至少上传一张缺陷图片')
    return
  }

  // 创建新的缺陷记录对象
  const newDefect: DefectsDTO = {
    defects: {
      ...currentDefect.value.defects,
      id: getId()
    },
    defectImages: defectImageUrls.value.map(url => ({
      id: getId(),
      defectId: currentDefect.value.defects.id,
      imagePath: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }

  // 添加到表单数据中
  formData.value.defectsDTO.push(newDefect)
  
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

// 修改保存函数
const handleSave = async () => {
  try {
    // 确保所有必要的关联ID都已设置
    formData.value.defectsDTO.forEach(dto => {
      dto.defects.reportId = formData.value.qcReports.id
      dto.defectImages.forEach(img => {
        img.defectId = dto.defects.id
      })
    })

    // 调用保存API
    const response = await saveQcReportsDTO(formData.value)
    
    if (response?.data) {
      ElMessage.success('保存成功')
      // 使用正确的路由名称 'spec-info'
      router.push({
        name: 'specList',  // 这里使用router/index.js中定义的名称
        params: { 
          id: formData.value.qcReports.id 
        }
      })
    } else {
      ElMessage.error('保存失败')
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(`保存失败: ${error.message || '未知错误'}`)
  }
}

// 添加 fillTestData 函数
const fillTestData = () => {
  const testImages = [
    'https://img.shetu66.com/2023/04/25/1682391094827084.png',
    'https://img.shetu66.com/2023/04/25/1682410877994833.png',
    'https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/02/04/ChMkJlbKyFOILgqwAAU1Zymsk68AALIAgFwgVgABTV_720.jpg',
    'https://img.shetu66.com/2023/04/25/1682391086456995.png',
    'https://ts1.cn.mm.bing.net/th/id/R-C.26fa5434823e0afae3f9b576b61b3df0?rik=1ki5rrqJXLS00w&riu=http%3a%2f%2fpic.52112.com%2f180420%2f180420_32%2fJ9xjxe1jIg_small.jpg&ehk=a8hQQlllEncpFeXgnFZ1a7fIII7lcz2ph6WLdtzS51k%3d&risl=&pid=ImgRaw&r=0'
  ]
  const getRandomImage = () => testImages[Math.floor(Math.random() * testImages.length)]

  // 随机生成0-2条缺陷记录
  const defectCount = Math.floor(Math.random() * 3)
  
  // 随机缺陷标题列表
  const defectTitles = [
    '座椅靠背划痕',
    '扶手连接处磨损',
    '气压棒功能异常',
    '座垫接缝不平整',
    '脚轮转动不顺畅',
    '头枕调节卡顿',
    '包装破损',
    '标签贴附不牢',
    '螺丝紧固不到位',
    '喷漆表面瑕疵'
  ]

  // 随机缺陷描述列表
  const defectDescriptions = [
    '产品表面出现约3cm长的浅划痕，影响美观',
    '连接处出现轻微磨损，可能影响使用寿命',
    '调节时有异响，升降不够顺畅',
    '缝线部分出现松动，影响产品质感',
    '转动时有卡顿现象，不够流畅',
    '调节机构有噪音，需要额外用力',
    '外包装角落破损，可能影响运输安全',
    '产品标签边角翘起，粘贴不牢固',
    '部分螺丝未达到规定扭力标准',
    '局部漆面出现细小气泡，影响外观'
  ]

  // 随机改进建议列表
  const improvements = [
    '建议加强包装保护，避免运输磕碰',
    '需要调整生产工艺，提高装配精度',
    '建议更换更高品质的零部件',
    '加强质量控制，提高生产标准',
    '优化工艺流程，确保产品一致性',
    '增加出厂前的功能测试项目',
    '改进包装设计，增加缓冲保护',
    '使用更好的粘合材料和工艺',
    '规范装配流程，加强培训',
    '改进表面处理工艺，提高品质'
  ]

  // 随机检查人员列表
  const inspectors = ['张三', '李四', '王五', '赵六', '钱七', '孙八']

  // 生成随机缺陷记录
  const defectsDTO: DefectsDTO[] = Array.from({ length: defectCount }, () => {
    const randomIndex = Math.floor(Math.random() * defectTitles.length)
    return {
      defects: {
        id: getId(),
        reportId: formData.value.qcReports.id,
        defectTitle: defectTitles[randomIndex],
        defectDescription: defectDescriptions[randomIndex],
        improvementSuggestion: improvements[Math.floor(Math.random() * improvements.length)],
        inspector: inspectors[Math.floor(Math.random() * inspectors.length)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      defectImages: [
        {
          id: getId(),
          defectId: '',
          imagePath: getRandomImage()
        },
        {
          id: getId(),
          defectId: '',
          imagePath: getRandomImage()
        }
      ]
    }
  })

  // 设置缺陷图片的 defectId
  defectsDTO.forEach(defectDTO => {
    defectDTO.defectImages.forEach(image => {
      image.defectId = defectDTO.defects.id
    })
  })

  formData.value = {
    qcReports: {
      id: getId(),
      modelCode: 'TEST-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
      factoryCode: 'FC-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
      supplier: '供应商' + Math.floor(Math.random() * 10),
      client: '客户' + Math.floor(Math.random() * 10),
      poNumber: 'PO-' + new Date().getTime().toString().slice(-6),
      inspectionDate: new Date(),
      orderQty: 500 + Math.floor(Math.random() * 1000),
      reportDate: new Date(),
      inspectQty: 50 + Math.floor(Math.random() * 100),
      qcOfficer: inspectors[Math.floor(Math.random() * inspectors.length)],
      passFail: defectCount > 0 ? 'Fail' : 'Pass',
      secondQcDate: new Date(),
      comments: defectCount > 0 
        ? '产品存在' + defectCount + '处缺陷，需要改进。'
        : '产品质量良好，符合标准要求。',
      stocksInWarehouse: getRandomImage(),
      samplingOfProductsQuantity: getRandomImage(),
      shippingMarks: getRandomImage(),
      barcode: getRandomImage(),
      packingOutside: getRandomImage(),
      packingInside: getRandomImage(),
      chairComponentsPacked: getRandomImage(),
      chairComponentsUnpacked: getRandomImage(),
      fittingPackPacked: getRandomImage(),
      fittingPackUnpacked: getRandomImage(),
      productionLabel: getRandomImage(),
      assemblyInstructions: getRandomImage(),
      imageOfComponentsSeat: getRandomImage(),
      imageOfComponentsBack: getRandomImage(),
      imageOfComponentsBase: getRandomImage(),
      imageOfComponentsCastors: getRandomImage(),
      imageOfComponentsGasLiftCover: getRandomImage(),
      imageOfComponentsGasLiftStamp: getRandomImage(),
      imageOfComponentsArmrest: getRandomImage(),
      imageOfComponentMechanism: getRandomImage(),
      imageOfComponentsHeadrest: getRandomImage(),
      imageOfProductBuiltFront: getRandomImage(),
      imageOfProductBuiltSide: getRandomImage(),
      imageOfProductBuiltBack: getRandomImage(),
      imageOfProductBuilt45Degree: getRandomImage(),
      frontImageOfProductBuiltCompare1: getRandomImage(),
      frontImageOfProductBuiltCompare2: getRandomImage(),
      functionCheckSeatHeightExtension: getRandomImage(),
      functionCheckMechanismAdjustment: getRandomImage(),
      functionCheckArmrestAdjustment: getRandomImage(),
      functionCheckHeadrestAdjustment: getRandomImage(),
      functionCheckOther1: getRandomImage(),
      functionCheckOther2: getRandomImage(),
    },
    defectsDTO,
  }

  ElMessage.success(`测试数据填充成功: ${defectCount}个缺陷记录`)
}

// 修改 initializeImageFields 函数
const initializeImageFields = () => {
  const allFields = Object.keys(formData.value.qcReports)
  
  allFields.forEach(field => {
    if (isImageField(field) && formData.value.qcReports[field] === undefined) {
      formData.value.qcReports[field] = ''
    }
  })
}

// 修改 updateImageField 函数
const updateImageField = (key: string, value: string[]) => {
  if (isImageField(key)) {
    formData.value.qcReports[key] = value[0] || ''  // 只取第一张图片
  }
}

// 在组件挂载时初始化
onMounted(() => {
  initializeImageFields()
})

</script>

