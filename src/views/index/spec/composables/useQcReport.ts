import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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
import { getId } from '@/utils/idUtils'

export function useQcReport(id: string) {
  const loading = ref(false)
  const exporting = ref(false)
  const formData = ref<any>({
    id: '',
    modelCode: '',
    tccode: '',
    supplier: '',
    poNumber: '',
    inspectionDate: '',
    reportDate: '',
    orderQuantity: 0,
    inspectionQuantity: 0,
    qcOfficer: '',
    result: '',
    secondQcDate: '',
    comments: '',
    defects: []
  })
  
  const tempFormData = ref<any>(null)
  const pendingDeleteImages = ref<string[]>([])
  const editingSections = ref<string[]>([])
  const dialogVisible = ref(false)
  const dialogImageUrl = ref('')
  
  // 基本字段定义
  const basicFields = {
    modelCode: '型号代码',
    tccode: '工厂代码',
    supplier: '供应商',
    poNumber: 'PO编号',
    inspectionDate: '检验日期',
    reportDate: '报告日期',
    orderQuantity: '订单数量',
    inspectionQuantity: '检验数量',
    qcOfficer: '质检员',
    result: '通过/失败',
    secondQcDate: '二次质检日期',
    comments: '评价内容'
  }
  
  // 产品图片字段
  const productImages = {
    frontImgPath: '正面图',
    sideImgPath: '侧面图',
    backImgPath: '背面图',
    angleImgPath: '角度图'
  }
  
  // 编辑状态下的数据
  const editingData = computed({
    get() {
      return tempFormData.value || formData.value || {};
    },
    set(newValue) {
      tempFormData.value = newValue;
    }
  });
  
  // 获取数据
  const getData = async () => {
    try {
      loading.value = true
      const response = await getQcReportsDtoById(id)
      
      if (response?.code === '200' && response.data) {
        const { qcReports, defectsDTO } = response.data
        
        // 设置基本信息
        formData.value = {
          ...qcReports,
          defects: []
        }
        
        // 将defectsDTO数据整合到对应的defect中
        const defectsWithImages = defectsDTO?.map(dto => {
          return {
            id: dto.defects.id,
            reportId: dto.defects.reportId,
            defectTitle: dto.defects.defectTitle || '缺陷记录',
            defectDescription: dto.defects.defectDescription || '',
            improvementSuggestion: dto.defects.improvementSuggestion || '',
            inspector: dto.defects.inspector || '',
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
        
        formData.value.defects = defectsWithImages
      } else {
        ElMessage.error('获取数据失败：' + (response?.message || '未知错误'))
      }
    } catch (error) {
      console.error('获取数据失败:', error)
      ElMessage.error('获取数据失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }
  
  // 切换编辑状态
  const handleEdit = (section: string) => {
    // 创建当前数据的深拷贝作为临时数据
    if (formData.value) {
      try {
        // 使用深拷贝创建临时数据
        tempFormData.value = JSON.parse(JSON.stringify(formData.value));
        console.log('临时数据已创建:', tempFormData.value); // 添加调试日志
      } catch (error) {
        console.error('创建临时数据失败:', error);
        tempFormData.value = { ...formData.value }; // 使用浅拷贝作为备选
      }
    } else {
      // 如果 formData.value 不存在，创建一个空对象
      tempFormData.value = {};
      console.warn('formData.value 不存在，创建了空对象'); // 添加调试日志
    }
    
    // 添加到编辑区域列表
    editingSections.value.push(section);
  }
  
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
  
  // 判断是否为图片路径字段
  const isImagePath = (key: string): boolean => {
    const imageFields = ['frontImgPath', 'sideImgPath', 'backImgPath', 'angleImgPath'];
    return imageFields.includes(key);
  };
  
  return {
    loading,
    exporting,
    formData,
    tempFormData,
    pendingDeleteImages,
    editingSections,
    dialogVisible,
    dialogImageUrl,
    basicFields,
    productImages,
    editingData,
    getData,
    handleEdit,
    handleSave,
    handleCancel,
    updateTempFormData,
    isImagePath
  }
} 