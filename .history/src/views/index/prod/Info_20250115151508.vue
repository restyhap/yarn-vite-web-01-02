<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-15 13:00:44
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <!-- 顶部操作区 -->
      <div class="mb-6 flex items-center justify-between">
        <el-button @click="handleBack" class="!px-3">
          <el-icon class="mr-1"><Back /></el-icon>
          返回列表
        </el-button>
        <el-button type="primary" @click="handleExportWord">
          <el-icon class="mr-1"><Document /></el-icon>
          导出Word文档
        </el-button>
      </div>

      <!-- 基本信息 -->
      <el-descriptions
        title="基本信息"
        :column="3"
        border
        class="mb-6"
      >
        <el-descriptions-item label="产品代码">{{ productInfo.tccode }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ productInfo.supplier }}</el-descriptions-item>
        <el-descriptions-item label="供应商代码">{{ productInfo.supplier_code }}</el-descriptions-item>
      </el-descriptions>

      <!-- 表1：产品基本信息 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">1. 产品基本信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="产品名称">{{ specTables.table1?.product_name }}</el-descriptions-item>
          <el-descriptions-item label="产品型号">{{ specTables.table1?.model }}</el-descriptions-item>
          <el-descriptions-item label="产品类别">{{ specTables.table1?.category }}</el-descriptions-item>
          <el-descriptions-item label="产品规格">{{ specTables.table1?.specification }}</el-descriptions-item>
          <el-descriptions-item label="产品材质">{{ specTables.table1?.material }}</el-descriptions-item>
          <el-descriptions-item label="产品颜色">{{ specTables.table1?.color }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表2：包装信息 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">2. 包装信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="包装方式">{{ specTables.table2?.packaging_method }}</el-descriptions-item>
          <el-descriptions-item label="包装尺寸">{{ specTables.table2?.package_size }}</el-descriptions-item>
          <el-descriptions-item label="装箱数量">{{ specTables.table2?.quantity_per_box }}</el-descriptions-item>
          <el-descriptions-item label="毛重">{{ specTables.table2?.gross_weight }}</el-descriptions-item>
          <el-descriptions-item label="净重">{{ specTables.table2?.net_weight }}</el-descriptions-item>
          <el-descriptions-item label="体积">{{ specTables.table2?.volume }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表3：材质信息 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">3. 材质信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="面料材质">{{ specTables.table3?.fabric_material }}</el-descriptions-item>
          <el-descriptions-item label="面料成分">{{ specTables.table3?.fabric_composition }}</el-descriptions-item>
          <el-descriptions-item label="面料克重">{{ specTables.table3?.fabric_weight }}</el-descriptions-item>
          <el-descriptions-item label="填充物">{{ specTables.table3?.filling_material }}</el-descriptions-item>
          <el-descriptions-item label="海绵密度">{{ specTables.table3?.foam_density }}</el-descriptions-item>
          <el-descriptions-item label="框架材质">{{ specTables.table3?.frame_material }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表4：结构信息 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">4. 结构信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="框架结构">{{ specTables.table4?.frame_structure }}</el-descriptions-item>
          <el-descriptions-item label="连接方式">{{ specTables.table4?.connection_method }}</el-descriptions-item>
          <el-descriptions-item label="支撑系统">{{ specTables.table4?.support_system }}</el-descriptions-item>
          <el-descriptions-item label="座包结构">{{ specTables.table4?.seat_structure }}</el-descriptions-item>
          <el-descriptions-item label="靠包结构">{{ specTables.table4?.back_structure }}</el-descriptions-item>
          <el-descriptions-item label="扶手结构">{{ specTables.table4?.armrest_structure }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表5：功能特点 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">5. 功能特点</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="功能类型">{{ specTables.table5?.function_type }}</el-descriptions-item>
          <el-descriptions-item label="调节方式">{{ specTables.table5?.adjustment_method }}</el-descriptions-item>
          <el-descriptions-item label="特殊功能">{{ specTables.table5?.special_features }}</el-descriptions-item>
          <el-descriptions-item label="使用场景">{{ specTables.table5?.usage_scenario }}</el-descriptions-item>
          <el-descriptions-item label="适用人群">{{ specTables.table5?.target_users }}</el-descriptions-item>
          <el-descriptions-item label="最大承重">{{ specTables.table5?.max_weight_capacity }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表6：质量标准 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">6. 质量标准</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="执行标准">{{ specTables.table6?.quality_standard }}</el-descriptions-item>
          <el-descriptions-item label="环保等级">{{ specTables.table6?.environmental_grade }}</el-descriptions-item>
          <el-descriptions-item label="阻燃等级">{{ specTables.table6?.fire_resistance_grade }}</el-descriptions-item>
          <el-descriptions-item label="检验项目">{{ specTables.table6?.inspection_items }}</el-descriptions-item>
          <el-descriptions-item label="质保期限">{{ specTables.table6?.warranty_period }}</el-descriptions-item>
          <el-descriptions-item label="认证证书">{{ specTables.table6?.certifications }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 表7：维护保养 -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">7. 维护保养</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="清洁方式">{{ specTables.table7?.cleaning_method }}</el-descriptions-item>
          <el-descriptions-item label="保养周期">{{ specTables.table7?.maintenance_cycle }}</el-descriptions-item>
          <el-descriptions-item label="注意事项">{{ specTables.table7?.precautions }}</el-descriptions-item>
          <el-descriptions-item label="储存条件">{{ specTables.table7?.storage_conditions }}</el-descriptions-item>
          <el-descriptions-item label="使用环境">{{ specTables.table7?.usage_environment }}</el-descriptions-item>
          <el-descriptions-item label="维修服务">{{ specTables.table7?.repair_service }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 其他表格可以按照类似方式继续添加... -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const productInfo = ref<any>({})
const specTables = ref<any>({})

// 获取产品信息
const fetchProductInfo = async () => {
  try {
    // TODO: 这里应该调用实际的API获取数据
    // 目前使用模拟数据
    productInfo.value = {
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SP001'
    }

    // 模拟表格数据
    specTables.value = {
      table1: {
        product_name: '现代简约沙发',
        model: 'SF-001',
        category: '客厅沙发',
        specification: '200*90*85cm',
        material: '皮革/实木',
        color: '米白色'
      },
      table2: {
        packaging_method: '纸箱+气泡膜',
        package_size: '210*100*95cm',
        quantity_per_box: '1件/箱',
        gross_weight: '50kg',
        net_weight: '45kg',
        volume: '2.0m³'
      },
      table3: {
        fabric_material: '头层牛皮',
        fabric_composition: '100%真皮',
        fabric_weight: '1.2mm厚度',
        filling_material: '高密度海绵',
        foam_density: '35kg/m³',
        frame_material: '实木框架'
      },
      table4: {
        frame_structure: '榫卯结构',
        connection_method: '螺栓连接',
        support_system: '蛇形弹簧',
        seat_structure: '独立袋装弹簧',
        back_structure: '软包结构',
        armrest_structure: '实木包覆'
      },
      table5: {
        function_type: '固定式',
        adjustment_method: '无调节',
        special_features: '防水防污',
        usage_scenario: '家居客厅',
        target_users: '成人',
        max_weight_capacity: '300kg'
      },
      table6: {
        quality_standard: 'GB/T 22793-2008',
        environmental_grade: 'E1级',
        fire_resistance_grade: 'B1级',
        inspection_items: '外观、结构、材质',
        warranty_period: '3年',
        certifications: 'ISO9001, CCC'
      },
      table7: {
        cleaning_method: '专业皮革清洁剂擦拭',
        maintenance_cycle: '每3个月',
        precautions: '避免阳光直射',
        storage_conditions: '干燥通风',
        usage_environment: '室内使用',
        repair_service: '全国联保'
      }
    }
  } catch (error) {
    console.error('获取产品信息失败:', error)
    ElMessage.error('获取产品信息失败')
  }
}

// 返回列表页
const handleBack = () => {
  router.push('/prod/list')
}

// 导出Word文档
const handleExportWord = async () => {
  try {
    // TODO: 实现导出Word文档的逻辑
    ElMessage.success('文档导出中...')
    
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该调用后端API来生成和下载文档
    ElMessage.success('文档导出成功')
  } catch (error) {
    console.error('导出文档失败:', error)
    ElMessage.error('导出文档失败')
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchProductInfo()
  }
})
</script>

<style scoped>
.table-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table-section:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.el-descriptions {
  margin-bottom: 1rem;
}
</style>
