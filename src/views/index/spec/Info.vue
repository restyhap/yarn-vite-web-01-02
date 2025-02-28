<template>
  <div class="flex flex-col h-full bg-white">
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div style="padding: 20px">
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 40%" />
          <el-skeleton-item variant="text" style="width: 100%" />
        </div>
      </template>

      <template #default>
        <div class="flex-1 p-6" v-if="formData">
          <!-- 顶部操作栏 -->
          <div class="flex justify-between items-center mb-6">
            <div class="left-actions">
              <h2 class="text-2xl font-bold text-gray-800">质检报告详情</h2>
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
            <div class="table-section" :class="{ 'border-2 border-blue-500 bg-blue-50': editingSections.includes('basic') }">
              <div class="section-header">
                <h3>质检信息</h3>
              </div>
              <div class="form-content">
                <el-form :model="formData" label-width="120px">
                  <div class="form-grid">
                    <el-form-item v-for="(field, key) in basicFields"
                      :key="key"
                      :label="field">
                      <template v-if="editingSections.includes('basic')">
                        <el-input 
                          v-model="editingData[key]"
                        />
                      </template>
                      <template v-else>
                        {{ formData[key] || '-' }}
                      </template>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>

            <!-- 产品图片部分 -->
            <div class="table-section" :class="{ 'editing': editingSections.includes('basic') }">
              <div class="section-header">
                <h3>产品图片</h3>
              </div>
              <div class="images-grid">
                <template v-for="(label, key) in productImages" :key="key">
                  <div class="image-item">
                    <div class="image-label" :class="{ 'editing': editingSections.includes('basic') }">
                      {{ label }}
                    </div>
                    <div class="image-container">
                      <ImageHandler
                        v-model="formData[key]"
                        :editable="editingSections.includes('basic')"
                        width="100%"
                        height="200px"
                        @temp-file="handleTempFile"
                      />
                    </div>
                  </div>
                </template>
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
              
              <!-- 缺陷记录列表 -->
              <div v-if="formData.defects && formData.defects.length > 0" class="defects-list">
                <div v-for="(defect, index) in formData.defects" :key="defect.id" class="defect-card" :class="{ 'editing': editingSections.includes(`defect-${index}`) }">
                  <div class="defect-header">
                    <div class="defect-title">
                      <span class="defect-number">缺陷 #{{ index + 1 }}</span>
                      <template v-if="editingSections.includes(`defect-${index}`)">
                        <el-input 
                          v-model="tempFormData.defects[index].defectTitle" 
                          placeholder="请输入缺陷标题"
                          class="title-input"
                        />
                      </template>
                      <template v-else>
                        <h4>{{ defect.defectTitle || '缺陷记录' }}</h4>
                      </template>
                    </div>
                    <div class="defect-actions">
                      <template v-if="editingSections.includes(`defect-${index}`)">
                        <el-button type="success" size="small" @click="handleSaveDefect(index)">
                          <el-icon><Check /></el-icon>
                          保存
                        </el-button>
                        <el-button type="danger" size="small" @click="handleCancelDefect(index)">
                          <el-icon><Close /></el-icon>
                          取消
                        </el-button>
                      </template>
                      <template v-else>
                        <el-button type="primary" size="small" @click="handleEditDefect(index)">
                          <el-icon><Edit /></el-icon>
                          编辑
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDeleteDefect(index)">
                          <el-icon><Delete /></el-icon>
                          删除
                        </el-button>
                      </template>
                    </div>
                  </div>
                  
                  <div class="defect-content">
                    <div class="defect-info">
                      <div class="info-item">
                        <div class="info-label">问题描述:</div>
                        <div class="info-value">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input 
                              v-model="tempFormData.defects[index].defectDescription" 
                              type="textarea" 
                              :rows="3"
                              placeholder="请输入问题描述"
                            />
                          </template>
                          <template v-else>
                            <div class="text-content">{{ defect.defectDescription || '无' }}</div>
                          </template>
                        </div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">改进建议:</div>
                        <div class="info-value">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input 
                              v-model="tempFormData.defects[index].improvementSuggestion" 
                              type="textarea" 
                              :rows="3"
                              placeholder="请输入改进建议"
                            />
                          </template>
                          <template v-else>
                            <div class="text-content">{{ defect.improvementSuggestion || '无' }}</div>
                          </template>
                        </div>
                      </div>
                      
                      <div class="info-item">
                        <div class="info-label">检查员:</div>
                        <div class="info-value">
                          <template v-if="editingSections.includes(`defect-${index}`)">
                            <el-input 
                              v-model="tempFormData.defects[index].inspector" 
                              placeholder="请输入检查员姓名"
                            />
                          </template>
                          <template v-else>
                            <div class="text-content">{{ defect.inspector || '无' }}</div>
                          </template>
                        </div>
                      </div>
                    </div>
                    
                    <div class="defect-images">
                      <div class="images-label">缺陷图片:</div>
                      <div class="images-container">
                        <template v-if="defect.images && defect.images.length > 0">
                          <div v-for="(image, imgIndex) in defect.images" :key="image.id" class="defect-image-item">
                            <ImageHandler
                              :model-value="image.imagePath"
                              :editable="editingSections.includes(`defect-${index}`)"
                              width="100%"
                              height="150px"
                              @update:model-value="(val) => handleDefectImageUpdate(val, index, imgIndex)"
                            />
                          </div>
                        </template>
                        
                        <div v-if="editingSections.includes(`defect-${index}`) && (!defect.images || defect.images.length < 2)" 
                             class="defect-image-item">
                          <ImageHandler
                            :model-value="''"
                            alt="添加图片"
                            :editable="true"
                            width="100%"
                            height="150px"
                            @update:model-value="(val) => handleDefectImageAdd(val, index)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-defects">
                <el-empty description="暂无缺陷记录" />
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
      title="新建缺陷记录"
      class="defect-dialog"
      width="800px"
      :close-on-click-modal="false"
      :before-close="handleCloseDialog"
    >
      <el-form
        ref="defectFormRef"
        :model="newDefectForm.defects"
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
        <el-form-item label="缺陷图片">
          <div class="defect-image-grid">
            <div v-for="(image, imgIndex) in newDefectForm.defectImages" 
                 :key="image.id" 
                 class="defect-image-item">
              <ImageHandler
                :model-value="image.imagePath"
                :alt="`缺陷图片${imgIndex + 1}`"
                :editable="true"
                @update:model-value="(val) => handleNewDefectImageUpdate(val, image.id)"
              />
            </div>
            <!-- 如果图片数量小于2，显示上传按钮 -->
            <div v-if="newDefectForm.defectImages.length < 2" 
                 class="defect-image-item">
              <ImageHandler
                :model-value="''"
                alt="添加图片"
                :editable="true"
                @update:model-value="handleNewDefectImageAdd"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="handleSaveNewDefect">保存</el-button>
        </div>
      </template>
    </el-dialog>
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
}

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
const handleSave = async () => {
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
const handleCancel = () => {
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
  background: white;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

/* 修改表单项样式 */
:deep(.el-form-item) {
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

/* 非编辑状态的标签样式 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  width: 30% !important;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px 0 0;
}

/* 非编辑状态的内容样式 */
:deep(.el-form-item__content) {
  flex: none;
  width: 61.8% !important;
  min-height: 32px;
  line-height: 32px;
  padding: 0 12px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
}

 :deep(.el-dialog__body .el-form-item__content) {
  width:100% !important;
  min-height: 32px;
  line-height: 32px;
 
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 0 4px 4px 0;
  display: flex;
  align-items: center;
  margin : 0 10px 0 0 ;
}

/* 编辑状态的样式 */
.table-section.editing {
  background-color: var(--section-editing-background, #fafcff);
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
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 1000px) {
  .form-grid {
    grid-template-columns: 1fr;
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
  grid-template-columns: repeat(3, 1fr);
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
  max-width: 100%;
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
  height: 32px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #f9f9f9;
  padding: 0;  /* 移除内边距 */
}

/* 确保 ImageHandler 组件适应容器 */
.image-container :deep(.image-handler) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;  /* 移除内边距 */
}

/* 优化图片显示 */
.image-container :deep(.image-preview) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;  /* 移除内边距 */
}

/* 预览图片样式 */
.image-container :deep(.preview-thumbnail) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  margin: 0;  /* 移除外边距 */
}

/* 上传区域样式 */
.image-container :deep(.upload-area) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 缺陷图片网格样式 */
.defect-image-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.defect-image-item {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

.defect-preview-image {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
}

/* 移除旧的上传组件相关样式 */
.defect-image-uploader,
.el-upload {
  /* 这些样式可以删除 */
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
  justify-content: flex-start;  /* 改为左对齐 */
  align-items: center;
}

:deep(.el-dialog__body img) {
  max-width: 100%;
  max-height: calc(100vh - 120px);
  object-fit: contain;
  margin-left: 0;  /* 确保图片靠左 */
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
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;  /* 内容左对齐 */
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
  width: 100%;  /* 确保表单占满宽度 */
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.defect-number {
  background-color: #409eff;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.defect-title h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

/* 标题输入框样式 */
.title-input {
  width: 100%;
  max-width: 300px;
}

.title-input :deep(.el-input__inner) {
  font-weight: 500;
  font-size: 16px;
  height: 32px;
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

/* 移除可能影响 ImageHandler 的样式 */
:deep(.image-handler) {
  /* 不要在这里覆盖 ImageHandler 的样式 */
}

/* 对话框中的图片网格样式 */
.defect-dialog .defect-image-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  width: 100%;  /* 确保图片网格占满宽度 */
  justify-content: flex-start;  /* 图片从左侧开始排列 */
}

.defect-dialog .defect-image-item {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
}

/* 移除旧的上传组件相关样式 */
.defect-dialog .defect-image-uploader,
.defect-dialog .el-upload {
  /* 这些样式可以删除 */
}

/* 对话框表单项样式优化 */
.defect-dialog :deep(.el-form-item) {
  margin-bottom: 20px;
}

.defect-dialog :deep(.el-form-item__label) {
  padding-bottom: 8px;
  font-weight: 500;
}

.defect-dialog :deep(.el-form-item__content) {
  width: 100%;
  background-color: transparent;
}

/* 对话框底部按钮样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
}

.defect-content {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 12px;
}

/* 标签和内容分行显示 */
.full-width-label {
  display: block;
  width: 100%;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
}

/* 调整表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

/* 最后一个表单项不需要底部间距 */
:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 非编辑状态下的文本样式 */
.form-text {
  display: block;
  min-height: 22px;
  line-height: 1.5;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 图片表单项的特殊样式 */
.image-form-item {
  flex: 1;
  min-width: 0;
  flex-direction: column !important;
  align-items: center;
}

.image-form-item :deep(.el-form-item__label) {
  text-align: center;
  width: 100% !important;
  justify-content: center;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  font-size: 13px;
  white-space: nowrap;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
}

/* 编辑状态下的图片表单项样式 */
.image-form-item.editing :deep(.el-form-item__label) {
  background-color: #f0f7ff;
  border-color: #a3d0ff;
  color: #409eff;
}

/* 图片网格布局 */
.images-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
}

/* 输入框焦点状态 */
:deep(.el-form-item:has(.el-input__wrapper:focus-within)) .el-form-item__content {
  width: 100%;
  border-color: #409eff;
  box-shadow: 0 0 0 1px #409eff;
}

/* 图片标签样式 */
.image-label {
  text-align: center;
  width: 100%;
  padding: 4px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 13px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  color: #606266;
}

/* 编辑状态下的图片标签样式 */
.image-label.editing {
  background-color: #f0f7ff;
  border-color: #a3d0ff;
  color: #409eff;
  font-weight: 600;
}

/* 编辑状态下的表格区域样式 */
.table-section.editing {
  background-color: var(--section-editing-background, #fafcff);
  border: 2px solid #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.1);
}

.table-section.editing .section-header {
  border-bottom-color: #409eff;
  background-color: #ecf5ff;
  margin: -16px -16px 16px -16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-section.editing .section-header h3 {
  color: #409eff;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
}

/* 确保没有其他样式覆盖网格布局 */
  .table-section .images-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
}

.defect-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.defect-title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.defect-actions {
  display: flex;
  gap: 8px;
}

.defect-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;  /* 改回垂直布局 */
  align-items: center;  /* 居中对齐 */
  margin-bottom: 16px;
  width: 100%;
}

.info-label {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 80%;  /* 设置为父容器的 80% */
  text-align: center;
  margin-bottom: 8px;
}

.info-value {
  width: 80%;  /* 设置为父容器的 80% */
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}

.images-label {
  font-weight: 500;
}

.images-container {
  display: flex;
  gap: 16px;
}

.empty-defects {
  padding: 40px;
  text-align: center;
}

/* 缺陷记录样式 */
.defects-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.defect-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.defect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.defect-title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.defect-actions {
  display: flex;
  gap: 8px;
}

.defect-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.defect-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;  /* 改回垂直布局 */
  align-items: center;  /* 居中对齐 */
  margin-bottom: 16px;
  width: 100%;
}

.info-label {
  font-weight: 500;
  color: #606266;
  background-color: #f8f9fb;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 80%;  /* 设置为父容器的 80% */
  text-align: center;
  margin-bottom: 8px;
}

.info-value {
  width: 80%;  /* 设置为父容器的 80% */
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}

.images-label {
  font-weight: 500;
}

.images-container {
  display: flex;
  gap: 16px;
}

.empty-defects {
  padding: 40px;
  text-align: center;
}

/* 添加到 <style> 部分 */
.text-content {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 40px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.info-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.info-value {
  width: 80%;
}

/* 修改文本域输入框样式 */
:deep(.el-textarea__inner) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  min-height: 80px;
  width: 100%;
  resize: vertical;
}

:deep(.el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.el-textarea__inner:focus) {
  border-color: #409eff;
  outline: none;
}

/* 非编辑状态下的文本内容样式 */
.text-content {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-height: 40px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 修改缺陷卡片在编辑状态下的样式 */
.defect-card.editing {
  background-color: var(--section-editing-background, #fafcff);
  border: 2px solid #409eff;
  box-shadow: 0 0 10px rgba(64, 158, 255, 0.1);
}

/* 编辑状态下的头部样式 */
.defect-card.editing .defect-header {
  background-color: #ecf5ff;
  margin: -16px -16px 16px -16px;
  padding: 16px;
  border-bottom-color: #409eff;
}

.defect-card.editing .defect-title h4 {
  color: #409eff;
}

/* 编辑状态下的表单项样式 */
.defect-card.editing .info-label {
  background-color: #f0f7ff;
  border-color: #a3d0ff;
  color: #409eff;
  font-weight: 600;
}

.defect-card.editing .info-value {
  border: 1px solid #a3d0ff !important;
  background-color: #fff !important;
  border-radius: 4px;
  padding: 0;
}

/* 编辑状态下的输入框样式 */
.defect-card.editing :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: none !important;
  padding: 0;
}

.defect-card.editing :deep(.el-input__wrapper:hover) {
  background-color: #f5f7fa;
}

.defect-card.editing :deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
}

/* 编辑状态下的文本域样式 */
.defect-card.editing :deep(.el-textarea__inner) {
  border: none;
  padding: 8px 12px;
  background-color: #fff;
}

/* 编辑状态下的表单项获得焦点时的样式 */
.defect-card.editing .info-value:has(:deep(.el-input__wrapper:focus-within)),
.defect-card.editing .info-value:has(:deep(.el-textarea__inner:focus)) {
  border-color: #409eff !important;
  box-shadow: 0 0 0 1px #409eff;
}

/* 缺陷图片区域在编辑状态下的样式 */
.defect-card.editing .defect-images {
  background-color: #f0f7ff;
  border: 1px solid #a3d0ff;
  border-radius: 4px;
}

.defect-card.editing .images-label {
  color: #409eff;
  font-weight: 600;
}

</style>
