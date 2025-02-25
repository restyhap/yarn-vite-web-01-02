<template>
  <div class="info-container">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </template>

      <template #default>
        <div class="content-wrapper" v-if="formData">
          <!-- 顶部操作栏 -->
          <div class="top-actions">
            <div class="left-actions">
              <h2 class="page-title">质检报告详情</h2>
            </div>
            <div class="right-actions">
              <template v-if="editingSections.includes('basic')">
                <el-button type="success" @click="handleSave">
                  <el-icon><Check /></el-icon>
                  保存
                </el-button>
                <el-button type="danger" @click="handleCancel">
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
              <el-button type="primary" :loading="exporting" @click="handleExport">
                <el-icon><Document /></el-icon>
                {{ exporting ? '导出中...' : '导出文档' }}
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
            <div class="table-section" :class="{ 'editing': editingSections.includes('basic') }">
              <div class="section-header">
                <h3 class="text-lg font-medium">基本信息</h3>
              </div>
              
              <el-form :model="editingSections.includes('basic') ? tempFormData : formData" label-width="120px">
                <div class="form-grid">
                  <el-form-item v-for="(field, key) in basicFields"
                                :key="key"
                                :label="field">
                        <template v-if="editingSections.includes('basic')">
                          <el-input v-model="tempFormData[key]" />
                        </template>
                        <template v-else>
                          {{ formData[key] || '-' }}
                        </template>
                  </el-form-item>
                </div>
              </el-form>
                </div>

            <!-- 产品图片 -->
            <div class="table-section">
              <div class="section-header">
                <h3 class="text-lg font-medium">产品图片</h3>
              </div>
              <div class="images-grid">
                <div v-for="(label, key) in productImages" :key="key" class="image-item">
                  <div class="image-label">{{ label }}</div>
                  <div class="image-container">
                    <ImageHandler
                      :model-value="getImageValue(key)"
                      @update:model-value="(val) => updateImageValue(key, val)"
                      :alt="label"
                      :editable="editingSections.includes('basic')"
                      @temp-file="handleTempFile"
                    />
                  </div>
                </div>
              </div>
            </div>

            

            <!-- 缺陷记录 -->
            <div class="table-section" :class="{ 'editing': editingSections.includes('defects') }">
              <div class="section-header">
                <div class="section-header-content">
                  <h3 class="text-lg font-medium">缺陷记录 ({{ formData.defects?.length || 0 }})</h3>
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="handleShowAddDefect"
                  >
                    <el-icon><Plus /></el-icon>
                    添加记录
                  </el-button>
                </div>
              </div>

              <!-- 添加调试信息 -->
              <pre v-if="showDebugInfo">{{ JSON.stringify(formData.defects, null, 2) }}</pre>

              <div v-if="formData.defects && formData.defects.length > 0">
                <div v-for="(defect, index) in formData.defects" 
                     :key="defect.id" 
                     class="defect-item"
                     :class="{ 'editing': editingSections.includes(`defect-${index}`) }">
                  <div class="defect-header">
                    <div class="defect-title">
                      <template v-if="editingSections.includes(`defect-${index}`)">
                        <el-input
                          v-model="tempFormData.defects[index].defectTitle"
                          placeholder="请输入问题标题"
                          class="title-input"
                        />
                      </template>
                      <template v-else>
                        <h4 class="text-base font-medium">
                          {{ defect.defectTitle || `质量问题记录 #${index + 1}` }}
                        </h4>
                      </template>
                    </div>
                    <div class="actions">
                      <template v-if="editingSections.includes(`defect-${index}`)">
                        <el-button type="success" @click="handleSaveDefect(index)">
                          <el-icon><Check /></el-icon>
                          保存
                        </el-button>
                        <el-button type="danger" @click="handleCancelDefect(index)">
                          <el-icon><Close /></el-icon>
                          取消
                        </el-button>
                        <el-button 
                          type="danger" 
                          link
                          @click="handleDeleteDefect(index)"
                        >
                          <el-icon><Delete /></el-icon>
                          删除
                        </el-button>
                      </template>
                      <template v-else>
                        <el-button type="primary" @click="handleEditDefect(index)">
                          <el-icon><Edit /></el-icon>
                          编辑
                        </el-button>
                      </template>
                    </div>
                  </div>

                  <!-- 图片区域 -->
                  <div class="defect-content">
                    <div class="defect-images">
                      <template v-if="editingSections.includes(`defect-${index}`)">
                        <div class="defect-image-grid">
                          <div v-for="(image, imgIndex) in tempFormData?.defects[index].images" 
                               :key="image.id" 
                               class="defect-image-item">
                            <el-image
                              :src="image.imagePath"
                              fit="contain"
                              class="defect-preview-image"
                            />
                            <div class="image-actions">
                              <el-button type="primary" link @click="handlePictureCardPreview({
                                url: image.imagePath,
                                name: 'preview.jpg',
                                status: 'success',
                                uid: image.id
                              })">
                                <el-icon><ZoomIn /></el-icon>
                              </el-button>
                              <el-button type="danger" link @click="() => handleDefectImageRemove({
                                url: image.imagePath,
                                name: 'preview.jpg',
                                status: 'success',
                                uid: image.id
                              }, index)">
                                <el-icon><Delete /></el-icon>
                              </el-button>
                            </div>
                          </div>
                          <el-upload
                            v-if="tempFormData?.defects[index].images.length < 2"
                            class="defect-image-uploader"
                            action="#"
                            :show-file-list="false"
                            :auto-upload="true"
                            :limit="2"
                            :http-request="(params) => handleDefectCustomUpload(params, index)"
                            :before-upload="beforeUpload"
                          >
                            <el-icon><Plus /></el-icon>
                          </el-upload>
                        </div>
                      </template>
                      <template v-else>
                        <div class="defect-image-grid">
                          <div v-for="image in defect.images" 
                               :key="image.id"
                               class="defect-image-item">
                            <el-image
                              :src="image.imagePath"
                              fit="contain"
                              class="defect-preview-image"
                            />
                            <div class="image-actions">
                              <el-button type="primary" link @click="handlePictureCardPreview({
                                url: image.imagePath,
                                name: 'preview.jpg',
                                status: 'success',
                                uid: image.id
                              })">
                                <el-icon><ZoomIn /></el-icon>
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>

                    <!-- 描述区域 -->
                    <div class="defect-description">
                      <el-form 
                        :model="editingSections.includes(`defect-${index}`) ? tempFormData.defects[index] : defect"
                        :disabled="!editingSections.includes(`defect-${index}`)"
                        label-position="top"
                      >
                        <el-form-item label="缺陷描述">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input 
                              v-model="tempFormData.defects[index].defectDescription"
                              type="textarea"
                              :rows="3"
                              placeholder="请输入缺陷描述"
                            />
                          </template>
                          <template v-else>
                            <el-input 
                              v-model="defect.defectDescription"
                              type="textarea"
                              :rows="3"
                              placeholder="请输入缺陷描述"
                              disabled
                            />
                          </template>
                        </el-form-item>
                        <el-form-item label="改进建议">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input 
                              v-model="tempFormData.defects[index].improvementSuggestion"
                              type="textarea"
                              :rows="3"
                              placeholder="请输入改进建议"
                            />
                          </template>
                          <template v-else>
                            <el-input 
                              v-model="defect.improvementSuggestion"
                              type="textarea"
                              :rows="3"
                              placeholder="请输入改进建议"
                              disabled
                            />
                          </template>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

    <!-- 添加缺陷记录对话框 -->
    <el-dialog
      v-model="addDefectDialogVisible"
      title="添加质量问题记录"
      width="1000px"
      custom-class="defect-dialog"
    >
      <el-form 
        :model="newDefectForm" 
        label-position="top"
        class="defect-form"
      >
        <el-form-item label="问题标题">
          <el-input v-model="newDefectForm.defects.defectTitle" placeholder="请输入问题标题" />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input 
            v-model="newDefectForm.defects.defectDescription" 
            type="textarea" 
            :rows="3"
            placeholder="请输入问题描述"
          />
        </el-form-item>
        <el-form-item label="改进建议">
          <el-input 
            v-model="newDefectForm.defects.improvementSuggestion" 
            type="textarea" 
            :rows="3"
            placeholder="请输入改进建议"
          />
        </el-form-item>
        <el-form-item label="图片">
          <div class="upload-container">
            <div class="image-list">
              <div v-for="image in newDefectForm.defectImages" 
                   :key="image.id" 
                   class="defect-image-item">
                <el-image :src="image.imagePath" fit="contain" />
                <div class="image-actions">
                  <el-button type="danger" link @click="() => handleNewDefectImageRemove(image)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
              <el-upload
                v-if="newDefectForm.defectImages.length < 2"
                class="defect-image-uploader"
                action="#"
                :show-file-list="false"
                :auto-upload="true"
                :limit="2"
                :http-request="handleNewDefectImageUpload"
                :before-upload="beforeUpload"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelNewDefect">取消</el-button>
          <el-button type="primary" @click="handleSaveNewDefect">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Edit, Check, Close, Delete, Plus, Back, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { exportQCReport } from '@/utils/exportQCReport'
import type { QCReportData } from '@/utils/exportQCReport'
import { saveAs } from 'file-saver'
import type { 
  IQCReport, 
  IDefect, 
  IDefectImage 
} from '@/types/specification'
import { 
  updateSpecification, 
  getQcReportsDtoById, 
  getSpecificationDetail, 
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

interface IQcReportsDTO {
  qcReports: IQCReport
  defectsDTO: IDefectsDTO[]
}

interface IDefectWithImages extends IDefect {
  id: string;
  reportId: string;
  defectTitle: string;
  defectDescription: string;
  improvementSuggestion: string;
  inspector: string;
  createdAt: string;
  updatedAt: string;
  images: IDefectImage[];
}

interface IFormData extends IQCReport {
  [key: string]: any;
  id: string;
  modelCode: string;
  factoryCode: string;
  supplier: string;
  client: string;
  poNumber: string;
  inspectionDate: string;
  orderQty: number;
  reportDate: string;
  inspectQty: number;
  qcOfficer: string;
  passFail: string;
  secondQcDate: string;
  comments: string;
  stocksInWarehouse: string;
  samplingOfProductsQuantity: string;
  shippingMarks: string;
  barcode: string;
  packingOutside: string;
  packingInside: string;
  chairComponentsPacked: string;
  chairComponentsUnpacked: string;
  fittingPackPacked: string;
  fittingPackUnpacked: string;
  productionLabel: string;
  assemblyInstructions: string;
  imageOfComponentsSeat: string;
  imageOfComponentsBack: string;
  imageOfComponentsBase: string;
  imageOfComponentsCastors: string;
  imageOfComponentsGasLiftCover: string;
  imageOfComponentsGasLiftStamp: string;
  imageOfComponentsArmrest: string;
  imageOfComponentMechanism: string;
  imageOfComponentsHeadrest: string;
  imageOfProductBuiltFront: string;
  imageOfProductBuiltSide: string;
  imageOfProductBuiltBack: string;
  imageOfProductBuilt45Degree: string;
  frontImageOfProductBuiltCompare1: string;
  frontImageOfProductBuiltCompare2: string;
  functionCheckSeatHeightExtension: string;
  functionCheckMechanismAdjustment: string;
  functionCheckArmrestAdjustment: string;
  functionCheckHeadrestAdjustment: string;
  functionCheckOther1: string;
  functionCheckOther2: string;
  createdAt: string;
  updatedAt: string;
  defects: IDefectWithImages[];
}

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const editingSections = ref<string[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

// 添加调试模式开关
const showDebugInfo = ref(false)  // 可以根据需要设置为true或false

const formData = ref<IFormData>({
  id: '',
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
  updatedAt: ''
})

const tempFormData = ref<IFormData | null>(null)
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
}

// 产品图片字段
const productImages = {
  stocksInWarehouse: '仓库库存',
  samplingOfProductsQuantity: '产品抽样数量',
  shippingMarks: '运输标记',
  barcode: '条形码',
  packingOutside: '外包装',
  packingInside: '内包装',
  chairComponentsPacked: '椅子组件（已包装）',
  chairComponentsUnpacked: '椅子组件（未包装）',
  fittingPackPacked: '配件包（已包装）',
  fittingPackUnpacked: '配件包（未包装）',
  productionLabel: '生产标签',
  assemblyInstructions: '组装说明',
  imageOfComponentsSeat: '座椅组件',
  imageOfComponentsBack: '靠背组件',
  imageOfComponentsBase: '底座组件',
  imageOfComponentsCastors: '脚轮组件',
  imageOfComponentsGasLiftCover: '气压棒护罩',
  imageOfComponentsGasLiftStamp: '气压棒印记',
  imageOfComponentsArmrest: '扶手组件',
  imageOfComponentMechanism: '机构组件',
  imageOfComponentsHeadrest: '头枕组件',
  imageOfProductBuiltFront: '成品正面',
  imageOfProductBuiltSide: '成品侧面',
  imageOfProductBuiltBack: '成品背面',
  imageOfProductBuilt45Degree: '成品45度角',
  frontImageOfProductBuiltCompare1: '成品对比1',
  frontImageOfProductBuiltCompare2: '成品对比2',
  functionCheckSeatHeightExtension: '座高调节功能检查',
  functionCheckMechanismAdjustment: '机构调节功能检查',
  functionCheckArmrestAdjustment: '扶手调节功能检查',
  functionCheckHeadrestAdjustment: '头枕调节功能检查',
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
    if (response?.data) {
      console.log('API Response:', response.data)
      
      const { qcReports, defectsDTO } = response.data as IQcReportsDTO
      
      // 添加调试日志
      console.log('qcReports:', qcReports)
      console.log('defectsDTO:', defectsDTO)
      
      // 将defectsDTO数据整合到对应的defect中
      const defectsWithImages = defectsDTO?.map(dto => {
        console.log('Processing DTO:', dto)
        return {
          id: dto.defects.id,
          reportId: dto.defects.reportId,
          defectTitle: dto.defects.defectTitle,
          defectDescription: dto.defects.defectDescription,
          improvementSuggestion: dto.defects.improvementSuggestion,
          inspector: dto.defects.inspector,
          createdAt: dto.defects.createdAt,
          updatedAt: dto.defects.updatedAt,
          images: dto.defectImages.map(img => ({
            id: img.id,
            defectId: img.defectId,
            imagePath: img.imagePath,
            createdAt: img.createdAt,
            updatedAt: img.updatedAt
          }))
        }
      }) || []

      // 更新formData
      formData.value = {
        ...qcReports,
        defects: defectsWithImages
      }

      // 如果是编辑模式，初始化 tempFormData
      if (route.query.edit === 'true') {
        tempFormData.value = JSON.parse(JSON.stringify(formData.value))
        editingSections.value = ['basic']
      }
    } else {
      ElMessage.error('获取数据失败')
      router.back()
    }
  } catch (error: any) {
    console.error('获取数据失败:', error)
    ElMessage.error(`获取数据失败: ${error.message || '未知错误'}`)
    router.back()
  } finally {
    loading.value = false
  }
}

// 切换编辑状态
const handleEdit = (section: string) => {
  const index = editingSections.value.indexOf(section)
  if (index > -1) {
    editingSections.value.splice(index, 1)
    tempFormData.value = null
  } else {
    editingSections.value.push(section)
    // 确保创建完整的数据副本
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
  }
}

// 处理保存按钮点击
const handleSave = async () => {
  try {
    loading.value = true
    
    // 处理需要删除的旧图片
    for (const key in productImages) {
      const currentPath = (formData.value as Record<string, any>)[key]
      const backupPath = tempFormData.value?.[key]
      
      if (backupPath && !currentPath) {
        try {
          await removeFile(backupPath)
        } catch (error) {
          console.error('删除服务器图片失败:', error)
        }
      }
    }

    // 调用更新接口
    await updateSpecification(formData.value)
    
    // 更新备份数据
    tempFormData.value = JSON.parse(JSON.stringify(formData.value))
    editingSections.value = []
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 添加导出状态
const exporting = ref(false)

// 修改导出方法
const handleExport = async () => {
  exporting.value = true
  try {
    // 准备缺陷数据
    const defectsData = formData.value.defects?.map(defect => ({
      defectTitle: '缺陷记录',
      defectDescription: defect.defectDescription || '',
      improvementSuggestion: defect.improvementSuggestion || '',
      inspector: formData.value.qcOfficer || '',
      images: defect.images.map(img => img.imagePath)
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

// 处理编辑缺陷记录
const handleEditDefect = (index: number) => {
  try {
    // 确保 tempFormData 存在且包含完整的数据
    if (!tempFormData.value) {
      tempFormData.value = JSON.parse(JSON.stringify(formData.value))
    } else {
      // 如果 tempFormData 已存在，确保它包含最新的数据
      tempFormData.value.defects = JSON.parse(JSON.stringify(formData.value.defects))
    }
    
    // 添加编辑标记
    editingSections.value.push(`defect-${index}`)
    
    // 初始化该记录的上传图片列表
    const existingIndex = editingUploadedImages.value.findIndex(item => item.index === index)
    if (existingIndex === -1) {
      editingUploadedImages.value.push({
        index,
        images: []
      })
    }
  } catch (error) {
    console.error('初始化编辑状态失败:', error)
    ElMessage.error('初始化编辑状态失败')
  }
}

// 处理保存缺陷记录
const handleSaveDefect = async (index: number) => {
  try {
    loading.value = true
    if (tempFormData.value) {
      // 如果有待删除的图片，先处理删除操作
      if (pendingDeleteDefectImages.value.length > 0) {
        try {
          // 删除服务器上的文件
          const deleteFilePromises = pendingDeleteDefectImages.value.map(img => 
            removeFile(img.imagePath)
          )
          await Promise.all(deleteFilePromises)
          
          // 删除数据库中的记录
          const deleteDbPromises = pendingDeleteDefectImages.value.map(img =>
            removeDefectImages(img.id)
          )
          await Promise.all(deleteDbPromises)
        } catch (error) {
          console.error('删除图片失败:', error)
          ElMessage.warning('部分图片删除失败')
        }
      }

      // 准备要保存的缺陷数据
      const defectData: IDefect = {
        id: tempFormData.value.defects[index].id,
        reportId: tempFormData.value.defects[index].reportId,
        defectTitle: tempFormData.value.defects[index].defectTitle,
        defectDescription: tempFormData.value.defects[index].defectDescription,
        improvementSuggestion: tempFormData.value.defects[index].improvementSuggestion,
        inspector: tempFormData.value.defects[index].inspector,
        createdAt: tempFormData.value.defects[index].createdAt,
        updatedAt: new Date().toISOString()
      }

      try {
        // 1. 保存缺陷记录
        const response = await updateDefects(defectData)
        
        if (response?.data) {
          // 2. 保存新上传的图片记录
          const uploadedImagesForDefect = editingUploadedImages.value.find(item => item.index === index)
          if (uploadedImagesForDefect && uploadedImagesForDefect.images.length > 0) {
            const saveImagePromises = uploadedImagesForDefect.images.map(image => 
              saveDefectImages(image)
            )
            await Promise.all(saveImagePromises)
          }

          // 更新本地数据
          formData.value.defects[index] = JSON.parse(JSON.stringify(tempFormData.value.defects[index]))
          ElMessage.success('保存成功')
          editingSections.value = editingSections.value.filter(section => section !== `defect-${index}`)
          
          // 清空待删除图片列表
          pendingDeleteDefectImages.value = []
          // 清空该记录的新上传图片记录
          editingUploadedImages.value = editingUploadedImages.value.filter(item => item.index !== index)
        } else {
          ElMessage.error('保存失败：未收到服务器响应')
          // 保存失败时删除新上传的图片
          const uploadedImagesForDefect = editingUploadedImages.value.find(item => item.index === index)
          if (uploadedImagesForDefect) {
            const deletePromises = uploadedImagesForDefect.images.map(image => 
              removeFile(image.imagePath)
            )
            await Promise.all(deletePromises)
          }
        }
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
        // 保存失败时删除新上传的图片
        const uploadedImagesForDefect = editingUploadedImages.value.find(item => item.index === index)
        if (uploadedImagesForDefect) {
          const deletePromises = uploadedImagesForDefect.images.map(image => 
            removeFile(image.imagePath)
          )
          await Promise.all(deletePromises)
        }
      }
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

// 处理取消编辑缺陷记录
const handleCancelDefect = async (index: number) => {
  try {
    // 删除编辑过程中新上传的图片
    const uploadedImagesForDefect = editingUploadedImages.value.find(item => item.index === index)
    if (uploadedImagesForDefect) {
      const deletePromises = uploadedImagesForDefect.images.map(image => 
        removeFile(image.imagePath)
      )
      await Promise.all(deletePromises)
      
      // 从列表中移除该缺陷记录的上传记录
      editingUploadedImages.value = editingUploadedImages.value.filter(item => item.index !== index)
    }

    // 恢复原始数据
    editingSections.value = editingSections.value.filter(section => section !== `defect-${index}`)
    if (tempFormData.value) {
      tempFormData.value.defects[index] = JSON.parse(JSON.stringify(formData.value.defects[index]))
    }
    
    // 清空待删除图片列表
    pendingDeleteDefectImages.value = []
  } catch (error) {
    console.error('删除新上传图片失败:', error)
    ElMessage.warning('部分新上传图片删除失败')
  }
}

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

// 处理删除缺陷记录
const handleDeleteDefect = async (index: number) => {
  try {
    // 确认删除
    await ElMessageBox.confirm(
      '确定要删除这条缺陷记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true

    if (tempFormData.value) {
      const defect = tempFormData.value.defects[index]
      
      try {
        // 1. 先删除所有图片文件
        const deleteFilePromises = defect.images.map(image => 
          removeFile(image.imagePath)
        )
        await Promise.all(deleteFilePromises)
        
        // 2. 删除数据库中的图片记录
        const deleteImageRecordPromises = defect.images.map(image =>
          removeDefectImages(image.id)
        )
        await Promise.all(deleteImageRecordPromises)
        
        // 3. 删除缺陷记录
        const response = await deleteDefects(defect.id)
        
        if (response?.data) {
          ElMessage.success('删除成功')
          editingSections.value = editingSections.value.filter(
            section => section !== `defect-${index}`
          )
          // 重新获取最新数据
          await getData()
        } else {
          ElMessage.error('删除失败：未收到服务器响应')
        }
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }
  } catch (error: any) {
    if (error === 'cancel') {
      return
    }
    console.error('删除失败:', error)
    ElMessage.error(`删除失败: ${error.message || '未知错误'}`)
  } finally {
    loading.value = false
  }
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
const handleCancelNewDefect = async () => {
  try {
    // 删除已上传的图片文件
    const deletePromises = newUploadedImages.value.map(image => 
      removeFile(image.imagePath)
    )
    await Promise.all(deletePromises)
    
    // 清空表单和临时数据
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
    newUploadedImages.value = []
    addDefectDialogVisible.value = false
  } catch (error) {
    console.error('删除图片失败:', error)
    ElMessage.warning('部分图片删除失败')
  }
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
      
      if (response?.data) {
        // 2. 保存图片记录，一个一个保存
        if (newUploadedImages.value.length > 0) {
          const saveImagePromises = newUploadedImages.value.map(image => 
            saveDefectImages(image)
          )
          await Promise.all(saveImagePromises)
        }
        
        ElMessage.success('添加成功')
        addDefectDialogVisible.value = false
        newUploadedImages.value = []
        // 重新获取最新数据
        await getData()
      } else {
        ElMessage.error('添加失败：未收到服务器响应')
        // 保存失败时删除已上传的图片
        const deletePromises = newUploadedImages.value.map(image => 
          removeFile(image.imagePath)
        )
        await Promise.all(deletePromises)
      }
    } catch (error) {
      console.error('保存失败:', error)
      ElMessage.error('保存失败')
      // 保存失败时删除已上传的图片
      const deletePromises = newUploadedImages.value.map(image => 
        removeFile(image.imagePath)
      )
      await Promise.all(deletePromises)
    }
  } catch (error) {
    console.error('添加失败:', error)
    ElMessage.error('添加失败')
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
onMounted(() => {
  getData()
})

// 修改取消编辑函数
const handleCancel = async () => {
  try {
    if (tempFormData.value) {
      // 删除所有临时上传的图片
      for (const key in productImages) {
        const currentPath = (formData.value as Record<string, any>)[key]
        const backupPath = (tempFormData.value as Record<string, any>)[key]
        
        if (currentPath && currentPath !== backupPath) {
          try {
            await removeFile(currentPath)
          } catch (error) {
            console.error('删除临时图片失败:', error)
          }
        }
      }
      
      // 恢复到编辑前的状态
      formData.value = JSON.parse(JSON.stringify(tempFormData.value))
    }
    editingSections.value = []
    tempFormData.value = null
    ElMessage.success('已取消编辑')
  } catch (error) {
    console.error('取消编辑失败:', error)
    ElMessage.error('取消编辑失败')
  }
}
</script>

<style scoped>
.info-container {
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  background: var(--page-background);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  padding-right: 10px;
}

.tables-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
}

/* 基本信息表占据整行 */
.table-section:first-child {
  grid-column: 1 / -1;
}

.table-section {
  background: var(--section-background);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  width: 100%;
  margin-bottom: 24px;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.table-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.15s ease;
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
  background: var(--section-background);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

/* 表单布局样式 */
:deep(.el-form) {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列布局 */
  gap: 16px;
  width: 100%;
}

/* 修改表单项样式 */
:deep(.el-form-item) {
  margin: 0;
  width: 100%;
  display: flex;
}

/* 非编辑状态的样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-right: none;
  border-radius: 4px 0 0 4px;
  width: 38.2% !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-form-item__content) {
  flex: none;
  min-height: 32px;
  line-height: 32px;
  padding: 0 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
}

/* 编辑状态的样式 */
.table-section.editing {
  background-color: var(--section-editing-background);
  border: 2px solid #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.1);
}

.table-section.editing .section-header {
  border-bottom-color: #409eff;
  background-color: #ecf5ff;
  margin: -16px -16px 16px -16px;
  padding: 16px;
}

.table-section.editing .section-header h3 {
  color: #409eff;
}

.table-section.editing :deep(.el-form-item__label) {
  background-color: #f0f7ff;
  border-color: #a3d0ff;
  color: #409eff;
  font-weight: 600;
}

.table-section.editing :deep(.el-form-item__content) {
  border-color: #a3d0ff;
  background-color: #fff;
}

/* 输入框焦点状态 */
:deep(.el-form-item:has(.el-input__wrapper:focus-within)) .el-form-item__content {
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

/* 移除之前的flex布局相关样式 */
:deep(.el-row) {
  display: none;
}

.page-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);  /* 在较小屏幕上切换为2列布局 */
  }
}

@media screen and (max-width: 1000px) {
  .form-grid {
    grid-template-columns: 1fr;  /* 在更小的屏幕上切换为单列布局 */
  }
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

:deep(.el-input__wrapper:hover) {
  background-color: #f5f7fa;
}

:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-form-item__content:has(.el-input__wrapper:focus-within)) {
  border-color: #409eff;
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
  background: var(--page-background);
}

/* 表格间距 */
.table-section {
  margin-bottom: 24px;
}

.table-section:last-child {
  margin-bottom: 0;
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
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.image-label {
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  padding: 4px 8px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  height: 24px;
  line-height: 24px;
}

.image-container {
  width: 100%;
  height: 200px;
}

.preview-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: scale-down;
  border-radius: 4px;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
}

.image-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  height: fit-content;
  display: none; /* 改为 display: none 而不是 opacity: 0 */
  justify-content: center;
  align-items: center;
  gap: 16px;
  z-index: 2;
}

/* 移除遮罩层 */
.image-container::after {
  display: none; /* 完全移除遮罩效果 */
}

/* 修改hover时的显示逻辑 */
.image-container:hover .image-actions {
  display: flex; /* 使用 display: flex 替代 opacity */
}

.image-actions .el-button {
  padding: 12px;
  width: 44px;
  height: 44px;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8) !important; /* 使用更明显的背景 */
  backdrop-filter: blur(4px);
  z-index: 3;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.image-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-actions .el-button.el-button--danger {
  background: rgba(255, 77, 79, 0.8) !important;
}

.image-actions .el-button.el-button--danger:hover {
  background: rgba(255, 0, 0, 0.3);
}

.image-actions .el-icon {
  font-size: 20px;
}

.defect-item {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.defect-item.editing {
  border-color: #409eff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.2);
}

.empty-state {
  padding: 40px;
  text-align: center;
}

/* 确保缺陷记录区域有足够的间距 */
.table-section {
  margin-bottom: 24px;
  padding: 20px;
}

/* 调试信息样式 */
pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 12px;
  overflow-x: auto;
}

.defect-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

.defect-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.defect-images {
  width: 100%;
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
}

.defect-image-grid {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
}

.defect-image-item {
  position: relative;
  width: 180px;
  height: 180px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #fff;
}

.defect-preview-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

/* 上传组件样式优化 */
.defect-image-uploader {
  width: 180px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.defect-image-uploader :deep(.el-upload) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.defect-image-uploader .upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
}

/* 修改加号图标样式 */
.defect-image-uploader .upload-placeholder .el-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
  line-height: 1;
}

/* 修改文字样式 */
.defect-image-uploader .upload-placeholder span {
  font-size: 12px;
  color: #8c939d;
  line-height: 1;
  white-space: nowrap;
}

/* hover效果 */
.defect-image-uploader:hover {
  border-color: var(--el-color-primary);
}

/* hover时改变图标和文字颜色 */
.defect-image-uploader:hover .upload-placeholder {
  color: var(--el-color-primary);
}

.defect-image-uploader:hover .upload-placeholder .el-icon {
  color: var(--el-color-primary);
}

/* 图片操作按钮样式 */
.defect-image-item .image-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  gap: 16px;
  z-index: 2;
}

.defect-image-item::after {
  display: none;
}

.defect-image-item:hover .image-actions {
  display: flex;
}

.defect-image-item .image-actions .el-button {
  padding: 12px;
  width: 44px;
  height: 44px;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8) !important; /* 使用更明显的背景 */
  backdrop-filter: blur(4px);
  z-index: 3;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.defect-image-item .image-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.defect-image-item .image-actions .el-button.el-button--danger {
  background: rgba(255, 77, 79, 0.8) !important;
}

.defect-image-item .image-actions .el-button.el-button--danger:hover {
  background: rgba(255, 0, 0, 0.3);
}

.defect-image-item .image-actions .el-icon {
  font-size: 20px;
}

/* 缺陷记录表单样式 */
.defect-description :deep(.el-form-item) {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.defect-description :deep(.el-form-item__label) {
  padding: 0 0 8px 0;
  color: #606266;
  font-weight: 500;
  line-height: 1.5;
  font-size: 14px;
  text-align: left;
  margin-bottom: 4px;
  width: 100% !important;
}

.defect-description :deep(.el-form-item__content) {
  background-color: #fff;
  border-radius: 4px;
  padding: 0;
  margin-left: 0 !important;
  width: 100%;
}

/* 文本域样式 */
.defect-description :deep(.el-textarea__inner) {
  background-color: #fff;
  border: none;
  box-shadow: none;
  width: 100%;
  padding: 8px;
  resize: none;
}

:root {
  --page-background: #f5f7fa;  /* 页面背景色 */
  --section-background: #ffffff;  /* 表格区域背景色 */
  --section-header-background: #ffffff;  /* 表格头部背景色 */
  --section-editing-background: #fafcff;  /* 编辑状态背景色 */
}

:deep(.el-image) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

:deep(.el-image img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: scale-down;
  padding: 0;
}

/* 图片预览对话框样式 */
:deep(.el-dialog__body) {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-dialog__body img) {
  max-width: 100%;
  max-height: calc(100vh - 120px);
  object-fit: contain;
}

.section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.section-header-content .el-button {
  margin-left: 16px;
}

/* 对话框样式 */
:deep(.defect-dialog) {
  border-radius: 8px;
  max-width: 90%;
  background-color: #fff;
}

:deep(.defect-dialog .el-dialog__header) {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f8f9fa;
}

:deep(.defect-dialog .el-dialog__body) {
  padding: 32px 24px;
  background-color: #fff;
}

:deep(.defect-dialog .el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #dcdfe6;
  background-color: #f8f9fa;
}

/* 表单样式 */
.defect-form {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  padding: 0 16px;
}

.defect-form :deep(.el-form-item) {
  margin-bottom: 24px;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  border: 1px solid #ebeef5;
  position: relative;
  display: flex;
  flex-direction: column;
}

.defect-form :deep(.el-form-item__label) {
  padding: 0 0 8px 0;
  color: #606266;
  font-weight: 500;
  line-height: 1.5;
  font-size: 14px;
  text-align: left;
  margin-bottom: 4px;
  width: 100% !important;
}

.defect-form :deep(.el-form-item__content) {
  background-color: #fff;
  border-radius: 4px;
  padding: 0;
  margin-left: 0 !important;
  width: 100%;
}

/* 输入框和文本域样式 */
.defect-form :deep(.el-input__wrapper),
.defect-form :deep(.el-textarea__inner) {
  background-color: #fff;
  border: none;
  box-shadow: none;
  width: 100%;
  padding: 8px;
}

/* 特别处理文本域 */
.defect-form :deep(.el-textarea__inner) {
  padding: 8px;
  resize: none;
  min-height: 80px;
}

.defect-form :deep(.el-form-item:focus-within) {
  border-color: var(--el-color-primary);
}

/* 修改必填星号的样式 */
.defect-form :deep(.el-form-item.is-required .el-form-item__label::before) {
  color: #f56c6c;
  margin-right: 4px;
}

/* 添加滚动条样式 */
.upload-container::-webkit-scrollbar {
  height: 6px;
}

.upload-container::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.upload-container::-webkit-scrollbar-track {
  background: transparent;
}

/* 上传容器样式 */
.upload-container {
  width: 100%;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

/* 图片列表布局 */
.image-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* 图片项样式 */
.defect-image-item {
  width: 180px;
  height: 180px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
}

/* 上传按钮样式 */
.defect-image-uploader {
  width: 180px;
  height: 180px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.defect-image-uploader:hover {
  border-color: var(--el-color-primary);
}

.defect-image-uploader .el-icon {
  font-size: 28px;
  color: #8c939d;
}

/* 确保el-form-item__content内的元素正确布局 */
.defect-form :deep(.el-form-item__content) {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* 添加新的样式 */
.defect-title {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
}

.defect-title .title-input {
  width: 100%;
}

/* 确保标题输入框的样式不被覆盖 */
.defect-title :deep(.el-input__wrapper) {
  background-color: #fff !important;
  border: 1px solid #dcdfe6 !important;
  box-shadow: none !important;
  padding: 0 12px !important;
  transition: all 0.3s;
  border-radius: 4px;
  height: 32px;
  display: flex;
  align-items: center;
  margin: 0;
  width: 100%;
}

.defect-title :deep(.el-input__wrapper:hover) {
  border-color: var(--el-color-primary) !important;
}

.defect-title :deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary) !important;
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
}

.defect-title :deep(.el-input__inner) {
  height: 24px;
  line-height: 24px;
  font-size: 16px;
  font-weight: 500;
  padding: 4px 0;
  color: #303133;
  width: 100%;
}

/* 修改标题容器样式 */
.defect-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #fff;
}

/* 确保标题区域有足够的空间 */
.defect-title {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
  display: flex;
  align-items: center;
}
</style>
