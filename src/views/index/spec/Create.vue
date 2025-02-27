<template>
  <div class="info-container">
    <div class="content-wrapper">
      <!-- 顶部操作栏 -->
      <div class="top-actions">
        <div class="left-actions">
          <h2 class="page-title">新建质检报告</h2>
        </div>
        <div class="right-actions">
          <el-button type="primary" @click="fillTestData">
            填充测试数据
          </el-button>
          <el-button @click="router.back()">
            <el-icon><Back /></el-icon>
            返回
          </el-button>
          
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="tables-container">
        <!-- 基本信息 -->
        <div class="table-section">
          <div class="section-header">
            <h3 class="text-lg font-medium">基本信息</h3>
          </div>
          
          <el-form :model="formData.qcReports" label-width="120px">
            <!-- 基本信息表格 -->
            <div class="basic-info-grid">
              <!-- 非日期字段 -->
              <template v-for="(field, key) in basicFields" :key="key">
                <template v-if="!isImageField(key) && key !== 'comments' && !isDateField(key)">
                  <el-form-item :label="field">
                    <template v-if="key === 'passFail'">
                      <el-radio-group v-model="formData.qcReports[key]">
                        <el-radio label="Pass">通过</el-radio>
                        <el-radio label="Fail">失败</el-radio>
                      </el-radio-group>
                    </template>
                    <el-input 
                      v-else
                      v-model="formData.qcReports[key]" 
                      :disabled="key === 'id'"
                    />
                  </el-form-item>
                </template>
              </template>
            </div>

            <!-- 日期字段单独分组 -->
            <div class="dates-section">
              <div class="date-row">
                <el-form-item label="检验日期">
                  <el-date-picker
                    v-model="formData.qcReports.inspectionDate"
                    type="date"
                    placeholder="请选择检验日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item label="通过/失败">
                  <el-radio-group v-model="formData.qcReports.passFail">
                    <el-radio label="Pass">通过</el-radio>
                    <el-radio label="Fail">失败</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="date-row">
                <el-form-item label="报告日期">
                  <el-date-picker
                    v-model="formData.qcReports.reportDate"
                    type="date"
                    placeholder="请选择报告日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item label="二次质检日期">
                  <el-date-picker
                    v-model="formData.qcReports.secondQcDate"
                    type="date"
                    placeholder="请选择二次质检日期"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </div>
            </div>

            <!-- 评价内容 -->
            <div class="comments-section">
              <div class="comments-label">评价内容</div>
              <div class="comments-content-wrapper">
                <el-input 
                  v-model="formData.qcReports.comments" 
                  type="textarea"
                  :rows="4"
                  placeholder="请输入评价内容"
                />
              </div>
            </div>

            <!-- 图片字段 -->
            <div class="images-grid">
              <template v-for="(field, key) in basicFields" :key="key">
                <template v-if="isImageField(key)">
                  <ImageHandler
                    v-model="formData.qcReports[key]"
                    :label="field"
                    :field-key="key"
                    :limit="1"
                    @preview="handlePictureCardPreview"
                  />
                </template>
              </template>
            </div>
          </el-form>
        </div>

        <!-- 缺陷记录 -->
        <div class="table-section">
          <div class="section-header">
            <h3 class="text-lg font-medium">缺陷记录</h3>
          </div>

          <div v-for="(defect, index) in formData.defectsDTO" :key="index" class="defect-item">
            <div class="defect-header">
              <h4 class="defect-title">质量问题记录 #{{ index + 1 }}</h4>
              <el-button 
                type="danger" 
                link
                @click="formData.defectsDTO.splice(index, 1)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>

            <!-- 缺陷标题 -->
            <div class="defect-field">
              <div class="defect-label">问题标题</div>
              <div class="defect-content">
                <el-input 
                  v-model="defect.defects.defectTitle"
                  placeholder="请输入问题标题"
                />
              </div>
            </div>

            <!-- 缺陷描述 -->
            <div class="defect-field">
              <div class="defect-label">问题描述</div>
              <div class="defect-content">
                <el-input 
                  v-model="defect.defects.defectDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入问题描述"
                />
              </div>
            </div>

            <!-- 改进建议 -->
            <div class="defect-field">
              <div class="defect-label">改进建议</div>
              <div class="defect-content">
                <el-input 
                  v-model="defect.defects.improvementSuggestion"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入改进建议"
                />
              </div>
            </div>

            <!-- 检查人员 -->
            <div class="defect-field">
              <div class="defect-label">检查人员</div>
              <div class="defect-content">
                <el-input 
                  v-model="defect.defects.inspector"
                  placeholder="请输入检查人员姓名"
                />
              </div>
            </div>

            <!-- 图片区域 -->
            <div class="defect-field">
              <div class="defect-label">缺陷图片</div>
              <div class="defect-content">
                <div class="image-grid">
                  <div v-for="(image, imgIndex) in defect.defectImages"
                       :key="imgIndex"
                       class="image-item">
                    <ImageHandler
                      v-model="image.imagePath"
                      :label="`缺陷图片 ${imgIndex + 1}`"
                      :limit="1"
                      @preview="handlePictureCardPreview"
                    />
                  </div>
                  <!-- 添加图片按钮 -->
                  <div v-if="defect.defectImages.length < 2" class="image-item">
                    <ImageHandler
                      v-model="newDefectImage"
                      label="添加图片"
                      :limit="1"
                      @update:model-value="(val) => handleAddDefectImage(index, val)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 添加记录按钮 -->
          <div class="add-defect">
            <el-button 
              type="primary"
              @click="addDefect"
            >
              <el-icon><Plus /></el-icon>
              添加缺陷记录
            </el-button>
          </div>
        </div>

        <!-- 底部提交按钮 -->
        <div class="bottom-actions">
          <el-button type="primary" size="large" @click="handleSave">
            <el-icon><Check /></el-icon>
            提交质检报告
          </el-button>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Back, Delete, Plus, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { QcReportsDTO, DefectsDTO, DefectImages } from '@/types/qcReport'
import ImageHandler from '@/components/ImageHandler.vue'
import { getId } from '@/utils/idUtils'
import { saveQcReportsDTO } from '@/api/specification'

const router = useRouter()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const mockLoading = ref(false)

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

// 定义图片字段类型
type ImageFieldKey = keyof Pick<QcReportsDTO['qcReports'], 
  | 'stocksInWarehouse'
  | 'samplingOfProductsQuantity'
  | 'shippingMarks'
  | 'barcode'
  | 'packingOutside'
  | 'packingInside'
  | 'chairComponentsPacked'
  | 'chairComponentsUnpacked'
  | 'fittingPackPacked'
  | 'fittingPackUnpacked'
  | 'productionLabel'
  | 'assemblyInstructions'
  | 'imageOfComponentsSeat'
  | 'imageOfComponentsBack'
  | 'imageOfComponentsBase'
  | 'imageOfComponentsCastors'
  | 'imageOfComponentsGasLiftCover'
  | 'imageOfComponentsGasLiftStamp'
  | 'imageOfComponentsArmrest'
  | 'imageOfComponentMechanism'
  | 'imageOfComponentsHeadrest'
  | 'imageOfProductBuiltFront'
  | 'imageOfProductBuiltSide'
  | 'imageOfProductBuiltBack'
  | 'imageOfProductBuilt45Degree'
  | 'frontImageOfProductBuiltCompare1'
  | 'frontImageOfProductBuiltCompare2'
  | 'functionCheckSeatHeightExtension'
  | 'functionCheckMechanismAdjustment'
  | 'functionCheckArmrestAdjustment'
  | 'functionCheckHeadrestAdjustment'
  | 'functionCheckOther1'
  | 'functionCheckOther2'
>

// 判断是否为图片字段
const isImageField = (key: keyof QcReportsDTO['qcReports']): key is ImageFieldKey => {
  const imageFields: ImageFieldKey[] = [
    'stocksInWarehouse',
    'samplingOfProductsQuantity',
    'shippingMarks',
    'barcode',
    'packingOutside',
    'packingInside',
    'chairComponentsPacked',
    'chairComponentsUnpacked',
    'fittingPackPacked',
    'fittingPackUnpacked',
    'productionLabel',
    'assemblyInstructions',
    'imageOfComponentsSeat',
    'imageOfComponentsBack',
    'imageOfComponentsBase',
    'imageOfComponentsCastors',
    'imageOfComponentsGasLiftCover',
    'imageOfComponentsGasLiftStamp',
    'imageOfComponentsArmrest',
    'imageOfComponentMechanism',
    'imageOfComponentsHeadrest',
    'imageOfProductBuiltFront',
    'imageOfProductBuiltSide',
    'imageOfProductBuiltBack',
    'imageOfProductBuilt45Degree',
    'frontImageOfProductBuiltCompare1',
    'frontImageOfProductBuiltCompare2',
    'functionCheckSeatHeightExtension',
    'functionCheckMechanismAdjustment',
    'functionCheckArmrestAdjustment',
    'functionCheckHeadrestAdjustment',
    'functionCheckOther1',
    'functionCheckOther2'
  ]
  return imageFields.includes(key as ImageFieldKey)
}

// 判断是否为日期字段
const isDateField = (key: keyof QcReportsDTO['qcReports']): boolean => {
  const dateFields = ['inspectionDate', 'reportDate', 'secondQcDate']
  return dateFields.includes(key)
}

// 基本字段定义 - 重新排序，将日期字段放在一起
const basicFields: Record<keyof Omit<QcReportsDTO['qcReports'], 'createdAt' | 'updatedAt'>, string> = {
  id: '序列号',
  modelCode: '型号代码',
  factoryCode: '工厂代码',
  supplier: '供应商',
  client: '客户',
  poNumber: 'PO编号',
  orderQty: '订单数量',
  inspectQty: '检验数量',
  qcOfficer: '质检员',
  // 将三个日期字段放在一起
  inspectionDate: '检验日期',
  reportDate: '报告日期',
  secondQcDate: '二次质检日期',
  passFail: '通过/失败',
  comments: '评价内容',
  stocksInWarehouse: '仓库库存图片',
  samplingOfProductsQuantity: '产品抽样数量图片',
  shippingMarks: '运输标记图片',
  barcode: '条形码图片',
  packingOutside: '外包装图片',
  packingInside: '内包装图片',
  chairComponentsPacked: '椅子组件-已包装图片',
  chairComponentsUnpacked: '椅子组件-未包装图片',
  fittingPackPacked: '配件包-已包装图片',
  fittingPackUnpacked: '配件包-未包装图片',
  productionLabel: '生产标签图片',
  assemblyInstructions: '组装说明图片',
  imageOfComponentsSeat: '组件图片-座椅',
  imageOfComponentsBack: '组件图片-靠背',
  imageOfComponentsBase: '组件图片-底座',
  imageOfComponentsCastors: '组件图片-脚轮',
  imageOfComponentsGasLiftCover: '组件图片-气压棒外罩',
  imageOfComponentsGasLiftStamp: '组件图片-气压棒标记',
  imageOfComponentsArmrest: '组件图片-扶手',
  imageOfComponentMechanism: '组件图片-机构',
  imageOfComponentsHeadrest: '组件图片-头枕',
  imageOfProductBuiltFront: '成品图片-正视图',
  imageOfProductBuiltSide: '成品图片-侧视图',
  imageOfProductBuiltBack: '成品图片-背视图',
  imageOfProductBuilt45Degree: '成品图片-45度视图',
  frontImageOfProductBuiltCompare1: '成品图片-样品对比图1',
  frontImageOfProductBuiltCompare2: '成品图片-样品对比图2',
  functionCheckSeatHeightExtension: '功能检查-座椅高度调节',
  functionCheckMechanismAdjustment: '功能检查-机构调节',
  functionCheckArmrestAdjustment: '功能检查-扶手调节',
  functionCheckHeadrestAdjustment: '功能检查-头枕调节',
  functionCheckOther1: '功能检查-其他1',
  functionCheckOther2: '功能检查-其他2'
}

// 添加缺陷记录
const addDefect = () => {
  const newDefect: DefectsDTO = {
    defects: {
      id: getId(),
      reportId: formData.value.qcReports.id,
      defectTitle: '',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: formData.value.qcReports.qcOfficer || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    defectImages: []
  }
  
  formData.value.defectsDTO.push(newDefect)
}

// 处理缺陷图片变化
const handleDefectImageChange = (images: string[], index: number) => {
  // 将新的图片数据转换为DefectImages对象
  const defectImages: DefectImages[] = images.map(imagePath => ({
    id: getId(),
    defectId: formData.value.defectsDTO[index].defects.id,
    imagePath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
  
  // 更新defectImages数组
  formData.value.defectsDTO[index].defectImages = defectImages
}

// 获取缺陷图片路径数组
const getDefectImagePaths = (defectImages: DefectImages[]) => {
  return defectImages.map(img => img.imagePath)
}

// 处理图片预览
const handlePictureCardPreview = (url: string) => {
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
    defectsDTO
  }

  ElMessage.success(`测试数据填充成功: ${defectCount}个缺陷记录`)
}


</script>

<style scoped>
/* 复用 Info.vue 的样式 */
.info-container {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 10px;
  padding-top: 10px;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

.table-section {
  padding: 16px;
  width: 100%;
  margin-bottom: 24px;
  border: none;
  box-shadow: none;
  background-color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.top-actions {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.left-actions {
  flex: 1;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

/* 基本信息表格样式 */
.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.basic-info-grid :deep(.el-form-item) {
  margin: 0;
}

.basic-info-grid :deep(.el-form-item__label) {
  width: 120px !important;
  justify-content: flex-start;
  padding: 0 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.basic-info-grid :deep(.el-form-item__content) {
  flex: 1;
  padding: 0 12px;
}

/* 修改基本信息表格中的 input 背景色 */
.basic-info-grid :deep(.el-input__wrapper) {
  background-color: #fff;
}

/* 评价内容样式 */
.comments-section {
  margin-bottom: 24px;
  width: 100%;
}

.comments-label {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
  width: 120px;
  text-align: center;
}

.comments-content-wrapper {
  width: 100%;
}

/* 修改评价内容的背景色 */
.comments-content-wrapper :deep(.el-textarea__inner) {
  background-color: #fff;
}

/* 图片网格布局 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.image-label {
  font-size: 14px;
  color: #606266;
  text-align: center;
  margin-bottom: 12px;
  font-weight: 500;
}

/* 图片上传和预览样式 */
:deep(.el-upload--picture-card) {
  display: inline-flex;
  width: 148px;
  height: 148px;
  margin: 0;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 当有图片时隐藏上传按钮 */
:deep(.el-upload-list:not(:empty) + .el-upload--picture-card) {
  display: none !important;
}

/* 缺陷记录样式 */
.defect-item {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.05);
  margin-bottom: 16px;
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.defect-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.defect-field {
  margin-bottom: 20px;
}

.defect-field:last-child {
  margin-bottom: 0;
}

.defect-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.defect-content {
  width: 100%;
}

/* 修改缺陷记录中的 input 背景色 */
.defect-content :deep(.el-input__wrapper),
.defect-content :deep(.el-textarea__inner) {
  background-color: transparent;  /* 移除背景色 */
  border: 1px solid #dcdfe6;     /* 添加边框 */
}

.defect-content :deep(.el-input__wrapper:hover),
.defect-content :deep(.el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

.defect-content :deep(.el-input__wrapper.is-focus),
.defect-content :deep(.el-textarea__inner:focus) {
  border-color: #409eff;
}

.add-defect {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .basic-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 1000px) {
  .basic-info-grid {
    grid-template-columns: 1fr;
  }
  
  .images-grid {
    grid-template-columns: 1fr;
  }
}

/* 自定义滚动条样式 */
.content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

/* 底部提交按钮样式 */
.bottom-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 16px;
}

.bottom-actions :deep(.el-button) {
  min-width: 200px;
  height: 48px;
  font-size: 16px;
}

/* 单选按钮组样式 */
:deep(.el-radio-group) {
  display: flex;
  gap: 16px;
}

:deep(.el-radio) {
  margin-right: 0;
  height: 32px;
  display: flex;
  align-items: center;
}

:deep(.el-radio__label) {
  font-size: 14px;
  padding-left: 8px;
}

:deep(.el-radio__input.is-checked + .el-radio__label) {
  color: var(--el-color-primary);
}

/* 日期字段分组样式 */
.dates-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.date-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.dates-section :deep(.el-form-item) {
  margin: 0;
  width: 100%;
}

.dates-section :deep(.el-form-item__label) {
  width: 120px !important;
  justify-content: flex-start;
  padding: 0 12px;
  background-color: #fff;
  border-radius: 4px;
}

.dates-section :deep(.el-date-editor.el-input),
.dates-section :deep(.el-radio-group) {
  width: 100%;
}

/* 修改日期选择器的背景色 */
.dates-section :deep(.el-input__wrapper) {
  background-color: #fff;
}

/* 响应式布局调整 */
@media screen and (max-width: 768px) {
  .date-row {
    grid-template-columns: 1fr;
  }
}
</style> 