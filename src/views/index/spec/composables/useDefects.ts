import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  removeFile,
  saveDefectImages,
  removeDefectImages,
  deleteDefects,
  updateDefects,
  saveDefects
} from '@/api'
import { getId } from '@/utils/idUtils'

export function useDefects(formData, tempFormData, editingSections, getData) {
  const addDefectDialogVisible = ref(false)
  const newDefectForm = ref({
    defects: {
      id: '',
      reportId: '',
      defectTitle: '缺陷记录',
      defectDescription: '',
      improvementSuggestion: '',
      inspector: '',
    },
    defectImages: []
  })
  const newUploadedImages = ref([])
  
  // 处理编辑缺陷记录
  const handleEditDefect = (index: number) => {
    if (formData.value && formData.value.defects) {
      // 确保 tempFormData 已初始化
      if (!tempFormData.value) {
        tempFormData.value = JSON.parse(JSON.stringify(formData.value));
      }
      
      // 添加到编辑区域
      editingSections.value.push(`defect-${index}`);
      console.log(`开始编辑缺陷记录 #${index + 1}`);
    }
  };
  
  // 处理保存缺陷记录
  const handleSaveDefect = async (index: number) => {
    if (!tempFormData.value || !tempFormData.value.defects) return;
    
    try {
      const defect = tempFormData.value.defects[index];
      
      // 更新缺陷记录
      const response = await updateDefects(defect);
      
      if (response?.code === '200') {
        // 更新本地数据
        formData.value.defects[index] = JSON.parse(JSON.stringify(defect));
        ElMessage.success('保存成功');
        
        // 退出编辑模式
        editingSections.value = editingSections.value.filter(section => section !== `defect-${index}`);
      } else {
        ElMessage.error('保存失败：' + (response?.message || '未知错误'));
      }
    } catch (error) {
      console.error('保存缺陷记录失败:', error);
      ElMessage.error('保存失败，请稍后重试');
    }
  };
  
  // 处理取消编辑缺陷记录
  const handleCancelDefect = (index: number) => {
    // 如果有临时数据，恢复原始数据
    if (tempFormData.value && tempFormData.value.defects) {
      tempFormData.value.defects[index] = JSON.parse(JSON.stringify(formData.value.defects[index]));
    }
    
    // 退出编辑模式
    editingSections.value = editingSections.value.filter(section => section !== `defect-${index}`);
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
          
        if (response?.code === '200') {
          // 从列表中移除
          formData.value.defects.splice(index, 1)
          ElMessage.success('删除成功')
          editingSections.value = editingSections.value.filter(
            section => section !== `defect-${index}`
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
    if (!tempFormData.value || !tempFormData.value.defects) return;
    
    const defect = tempFormData.value.defects[defectIndex];
    if (!defect.images) defect.images = [];
    
    defect.images[imageIndex].imagePath = val;
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
  
  // 显示添加缺陷对话框
  const handleShowAddDefect = () => {
    // 重置表单
    newDefectForm.value = {
      defects: {
        id: getId(),
        reportId: formData.value.id,
        defectTitle: '缺陷记录',
        defectDescription: '',
        improvementSuggestion: '',
        inspector: formData.value.qcOfficer || '',
      },
      defectImages: []
    }
    newUploadedImages.value = []
    addDefectDialogVisible.value = true
  }
  
  // 关闭对话框
  const handleCloseDialog = () => {
    addDefectDialogVisible.value = false
  }
  
  // 处理新缺陷图片添加
  const handleNewDefectImageAdd = async (val: string) => {
    // 创建新的图片对象
    const newImage = {
      id: getId(),
      defectId: newDefectForm.value.defects.id,
      imagePath: val,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 添加到临时列表和表单数据
    newUploadedImages.value.push(newImage)
    newDefectForm.value.defectImages.push(newImage)
    
    ElMessage.success('图片上传成功')
  }
  
  // 处理新缺陷图片更新
  const handleNewDefectImageUpdate = (val: string, imageId: string) => {
    const imageIndex = newDefectForm.value.defectImages.findIndex(img => img.id === imageId)
    if (imageIndex > -1) {
      newDefectForm.value.defectImages[imageIndex].imagePath = val
    }
  }
  
  // 保存新缺陷记录
  const handleSaveNewDefect = async () => {
    try {
      // 1. 保存缺陷记录
      const defectData = {
        ...newDefectForm.value.defects
      }
      
      const response = await saveDefects(defectData)
      
      if (response?.code === '200') {
        // 2. 保存图片记录
        if (newUploadedImages.value.length > 0) {
          const saveImagePromises = newUploadedImages.value.map(image => {
            // 构建正确的图片数据结构
            const imageData = {
              ...image,
              defectId: defectData.id
            }
            return saveDefectImages(imageData)
          })
          
          await Promise.all(saveImagePromises)
        }
        
        // 3. 重新获取数据以更新UI
        await getData()
        
        // 4. 关闭对话框
        addDefectDialogVisible.value = false
        ElMessage.success('添加缺陷记录成功')
      } else {
        ElMessage.error('保存失败：' + (response?.message || '未知错误'))
      }
    } catch (error) {
      // 保存失败时删除已上传的图片
      const deletePromises = newUploadedImages.value.map(image => 
        removeFile(image.imagePath)
      )
      await Promise.all(deletePromises)
      
      console.error('添加缺陷记录失败:', error)
      ElMessage.error('添加失败，请稍后重试')
    }
  }
  
  return {
    addDefectDialogVisible,
    newDefectForm,
    newUploadedImages,
    handleEditDefect,
    handleSaveDefect,
    handleCancelDefect,
    handleDeleteDefect,
    handleDefectImageUpdate,
    handleDefectImageAdd,
    handleShowAddDefect,
    handleCloseDialog,
    handleNewDefectImageAdd,
    handleNewDefectImageUpdate,
    handleSaveNewDefect
  }
} 