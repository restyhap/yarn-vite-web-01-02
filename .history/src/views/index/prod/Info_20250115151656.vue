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

      <!-- 基本信息 (tb_products) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">基本信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="产品代码">{{ productInfo.tccode }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ productInfo.supplier }}</el-descriptions-item>
          <el-descriptions-item label="供应商代码">{{ productInfo.supplier_code }}</el-descriptions-item>
          <el-descriptions-item label="供应商名称">{{ productInfo.supplier_name }}</el-descriptions-item>
          <el-descriptions-item label="防火标准">{{ productInfo.fire_standard }}</el-descriptions-item>
          <el-descriptions-item label="发货港口">{{ productInfo.shipping_port }}</el-descriptions-item>
          <el-descriptions-item label="20尺柜FOB价格">¥{{ productInfo.fob_20_container_price }}</el-descriptions-item>
          <el-descriptions-item label="40尺柜FOB价格">¥{{ productInfo.fob_40_container_price }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 面料信息 (tb_upholstery) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">面料信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="面料制造商">{{ specTables.upholstery?.fabric_manufacturer }}</el-descriptions-item>
          <el-descriptions-item label="颜色代码">{{ specTables.upholstery?.colour_code }}</el-descriptions-item>
          <el-descriptions-item label="皮革等级">{{ specTables.upholstery?.leather_grade }}</el-descriptions-item>
          <el-descriptions-item label="每把椅子用料">{{ specTables.upholstery?.usage_per_chair }}m²</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 包装信息 (tb_carton_details) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">包装信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="包装箱宽度">{{ specTables.carton?.width }}mm</el-descriptions-item>
          <el-descriptions-item label="包装箱深度">{{ specTables.carton?.depth }}mm</el-descriptions-item>
          <el-descriptions-item label="包装箱高度">{{ specTables.carton?.height }}mm</el-descriptions-item>
          <el-descriptions-item label="纸板类型">{{ specTables.carton?.board_type }}</el-descriptions-item>
          <el-descriptions-item label="每箱数量">{{ specTables.carton?.items_per_carton }}件</el-descriptions-item>
          <el-descriptions-item label="箱体体积">{{ specTables.carton?.carton_volume }}m³</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 生产和物流信息 (tb_production_logistics) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">生产和物流信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="生产时间">{{ specTables.logistics?.production_time }}天</el-descriptions-item>
          <el-descriptions-item label="有效体积">{{ specTables.logistics?.effective_volume }}m³</el-descriptions-item>
          <el-descriptions-item label="20尺标准柜装载数量">{{ specTables.logistics?.loading_quantity_20gp }}件</el-descriptions-item>
          <el-descriptions-item label="40尺高柜装载数量">{{ specTables.logistics?.loading_quantity_40hc }}件</el-descriptions-item>
          <el-descriptions-item label="净重">{{ specTables.logistics?.net_weight }}kg</el-descriptions-item>
          <el-descriptions-item label="毛重">{{ specTables.logistics?.gross_weight }}kg</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 产品尺寸 (tb_product_dimensions) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">产品尺寸</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="座位宽度">{{ specTables.dimensions?.seat_width }}mm</el-descriptions-item>
          <el-descriptions-item label="座位深度">{{ specTables.dimensions?.seat_depth }}mm</el-descriptions-item>
          <el-descriptions-item label="座位最小高度">{{ specTables.dimensions?.seat_height_min }}mm</el-descriptions-item>
          <el-descriptions-item label="座位最大高度">{{ specTables.dimensions?.seat_height_max }}mm</el-descriptions-item>
          <el-descriptions-item label="靠背宽度">{{ specTables.dimensions?.back_width }}mm</el-descriptions-item>
          <el-descriptions-item label="靠背高度">{{ specTables.dimensions?.back_height }}mm</el-descriptions-item>
          <el-descriptions-item label="靠背距座面高度">{{ specTables.dimensions?.back_height_from_seat }}mm</el-descriptions-item>
          <el-descriptions-item label="整体宽度">{{ specTables.dimensions?.overall_width }}mm</el-descriptions-item>
          <el-descriptions-item label="整体深度">{{ specTables.dimensions?.overall_depth }}mm</el-descriptions-item>
          <el-descriptions-item label="整体最小高度">{{ specTables.dimensions?.overall_height_min }}mm</el-descriptions-item>
          <el-descriptions-item label="整体最大高度">{{ specTables.dimensions?.overall_height_max }}mm</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 座椅内部结构 (tb_seat_inner_components) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">座椅内部结构</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料代码">{{ specTables.seatInner?.material_code }}</el-descriptions-item>
          <el-descriptions-item label="厚度">{{ specTables.seatInner?.thickness }}mm</el-descriptions-item>
          <el-descriptions-item label="层数">{{ specTables.seatInner?.layers_count }}层</el-descriptions-item>
          <el-descriptions-item label="尺寸规格">{{ specTables.seatInner?.dimensions }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 背部内部结构 (tb_back_inner_components) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">背部内部结构</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料代码">{{ specTables.backInner?.material_code }}</el-descriptions-item>
          <el-descriptions-item label="厚度">{{ specTables.backInner?.thickness }}mm</el-descriptions-item>
          <el-descriptions-item label="层数">{{ specTables.backInner?.layers_count }}层</el-descriptions-item>
          <el-descriptions-item label="尺寸规格">{{ specTables.backInner?.dimensions }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 背部外部结构 (tb_back_outer_components) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">背部外部结构</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料">{{ specTables.backOuter?.material }}</el-descriptions-item>
          <el-descriptions-item label="尺寸">{{ specTables.backOuter?.dimensions }}</el-descriptions-item>
          <el-descriptions-item label="制造商名称">{{ specTables.backOuter?.manufacturer_name }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 座椅外部结构 (tb_seat_outer_components) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">座椅外部结构</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料">{{ specTables.seatOuter?.material }}</el-descriptions-item>
          <el-descriptions-item label="尺寸">{{ specTables.seatOuter?.dimensions }}</el-descriptions-item>
          <el-descriptions-item label="制造商名称">{{ specTables.seatOuter?.manufacturer_name }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 扶手信息 (tb_arms) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">扶手信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="材料">{{ specTables.arms?.material }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ specTables.arms?.type }}</el-descriptions-item>
          <el-descriptions-item label="制造商">{{ specTables.arms?.manufacturer }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ specTables.arms?.description }}</el-descriptions-item>
          <el-descriptions-item label="扶手距座面高度">{{ specTables.arms?.arm_height_from_seat }}mm</el-descriptions-item>
          <el-descriptions-item label="扶手距地面高度">{{ specTables.arms?.arm_height_from_floor }}mm</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 泡棉信息 (tb_foam_details) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">泡棉信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.foam?.description }}</el-descriptions-item>
          <el-descriptions-item label="座椅密度">{{ specTables.foam?.seat_density }}kg/m³</el-descriptions-item>
          <el-descriptions-item label="靠背密度">{{ specTables.foam?.back_density }}kg/m³</el-descriptions-item>
          <el-descriptions-item label="座椅厚度">{{ specTables.foam?.seat_thickness }}mm</el-descriptions-item>
          <el-descriptions-item label="靠背厚度">{{ specTables.foam?.back_thickness }}mm</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 脚轮信息 (tb_castors) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">脚轮信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.castors?.description }}</el-descriptions-item>
          <el-descriptions-item label="销轴直径">{{ specTables.castors?.pin_thickness }}mm</el-descriptions-item>
          <el-descriptions-item label="轮子直径">{{ specTables.castors?.wheel_diameter }}mm</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 底座信息 (tb_base) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">底座信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.base?.description }}</el-descriptions-item>
          <el-descriptions-item label="底盘直径">{{ specTables.base?.size_diameter }}mm</el-descriptions-item>
          <el-descriptions-item label="材料">{{ specTables.base?.material }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ specTables.base?.type }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 气压棒信息 (tb_gas_lift) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">气压棒信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.gasLift?.description }}</el-descriptions-item>
          <el-descriptions-item label="气压等级">{{ specTables.gasLift?.gas_lift_class }}</el-descriptions-item>
          <el-descriptions-item label="外管长度">{{ specTables.gasLift?.casing_length }}mm</el-descriptions-item>
          <el-descriptions-item label="行程">{{ specTables.gasLift?.extension_size }}mm</el-descriptions-item>
          <el-descriptions-item label="锥度">{{ specTables.gasLift?.taper }}mm</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 气压罩信息 (tb_gas_lift_cover) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">气压罩信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.gasLiftCover?.description }}</el-descriptions-item>
          <el-descriptions-item label="材料">{{ specTables.gasLiftCover?.material }}</el-descriptions-item>
          <el-descriptions-item label="颜色">{{ specTables.gasLiftCover?.colour }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 机构信息 (tb_mechanism) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">机构信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="描述">{{ specTables.mechanism?.description }}</el-descriptions-item>
          <el-descriptions-item label="手柄数量">{{ specTables.mechanism?.levers_count }}</el-descriptions-item>
          <el-descriptions-item label="锁定位置">{{ specTables.mechanism?.locking_positions }}</el-descriptions-item>
          <el-descriptions-item label="型号">{{ specTables.mechanism?.model_no }}</el-descriptions-item>
          <el-descriptions-item label="机构供应商">{{ specTables.mechanism?.supplier_name }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 配件信息 (tb_fittings) -->
      <div class="table-section">
        <h3 class="text-lg font-bold mb-4">配件信息</h3>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="配件编号">{{ specTables.fittings?.fitting_number }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ specTables.fittings?.description }}</el-descriptions-item>
          <el-descriptions-item label="数量">{{ specTables.fittings?.quantity }}</el-descriptions-item>
          <el-descriptions-item label="材料">{{ specTables.fittings?.material }}</el-descriptions-item>
        </el-descriptions>
      </div>
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
      supplier_code: 'SP001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      shipping_port: '宁波港',
      fob_20_container_price: '5000.00',
      fob_40_container_price: '9000.00'
    }

    // 模拟规格表数据
    specTables.value = {
      upholstery: {
        fabric_manufacturer: '布艺制造商A',
        colour_code: 'C001',
        leather_grade: 'A级',
        usage_per_chair: '2.5'
      },
      carton: {
        width: 800,
        depth: 600,
        height: 1200,
        board_type: '五层瓦楞纸',
        items_per_carton: 1,
        carton_volume: 0.576
      },
      logistics: {
        production_time: 15,
        effective_volume: 0.5,
        loading_quantity_20gp: 36,
        loading_quantity_40hc: 76,
        net_weight: 25.5,
        gross_weight: 28.0
      },
      dimensions: {
        seat_width: 500,
        seat_depth: 480,
        seat_height_min: 420,
        seat_height_max: 520,
        back_width: 460,
        back_height: 560,
        back_height_from_seat: 580,
        overall_width: 660,
        overall_depth: 660,
        overall_height_min: 1150,
        overall_height_max: 1250
      },
      // ... 其他表的模拟数据
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
    await new Promise(resolve => setTimeout(resolve, 1000))
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
