<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-14 17:03:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-14 19:55:14
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Create.vue
 * @Description: 产品规格创建表单
-->
<template>
  <div class="create-product">
    <el-card>
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="基本信息" />
        <el-step title="面料信息" />
        <el-step title="包装信息" />
        <el-step title="生产物流" />
        <el-step title="产品尺寸" />
        <el-step title="结构信息" />
        <el-step title="组件信息" />
      </el-steps>

      <div class="form-container mt-4">
        <!-- 基本信息表单 -->
        <el-form
          v-if="activeStep === 0"
          :model="basicForm"
          label-width="120px"
          class="mt-4"
        >
          <el-form-item label="产品代码">
            <el-input v-model="basicForm.tccode" />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="basicForm.supplier" />
          </el-form-item>
          <el-form-item label="供应商代码">
            <el-input v-model="basicForm.supplier_code" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input v-model="basicForm.supplier_name" />
          </el-form-item>
          <el-form-item label="防火标准">
            <el-input v-model="basicForm.fire_standard" />
          </el-form-item>
          <el-form-item label="20尺柜FOB价格">
            <el-input-number v-model="basicForm.fob_20_container_price" :precision="2" />
          </el-form-item>
          <el-form-item label="40尺柜FOB价格">
            <el-input-number v-model="basicForm.fob_40_container_price" :precision="2" />
          </el-form-item>
          <el-form-item label="发货港口">
            <el-input v-model="basicForm.shipping_port" />
          </el-form-item>
        </el-form>

        <!-- 面料信息表单 -->
        <el-form
          v-if="activeStep === 1"
          :model="upholsteryForm"
          label-width="120px"
          class="mt-4"
        >
          <el-form-item label="面料制造商">
            <el-input v-model="upholsteryForm.fabric_manufacturer" />
          </el-form-item>
          <el-form-item label="颜色代码">
            <el-input v-model="upholsteryForm.colour_code" />
          </el-form-item>
          <el-form-item label="皮革等级">
            <el-input v-model="upholsteryForm.leather_grade" />
          </el-form-item>
          <el-form-item label="每把椅子用料">
            <el-input-number v-model="upholsteryForm.usage_per_chair" :precision="2" />
          </el-form-item>
        </el-form>

        <!-- 包装信息表单 -->
        <el-form
          v-if="activeStep === 2"
          :model="cartonForm"
          label-width="120px"
          class="mt-4"
        >
          <el-form-item label="包装箱宽度">
            <el-input-number v-model="cartonForm.width" />
          </el-form-item>
          <el-form-item label="包装箱深度">
            <el-input-number v-model="cartonForm.depth" />
          </el-form-item>
          <el-form-item label="包装箱高度">
            <el-input-number v-model="cartonForm.height" />
          </el-form-item>
          <el-form-item label="纸板类型">
            <el-input v-model="cartonForm.board_type" />
          </el-form-item>
          <el-form-item label="每箱数量">
            <el-input-number v-model="cartonForm.items_per_carton" />
          </el-form-item>
          <el-form-item label="箱体体积">
            <el-input-number v-model="cartonForm.carton_volume" :precision="3" />
          </el-form-item>
        </el-form>

        <!-- 生产物流信息表单 -->
        <el-form
          v-if="activeStep === 3"
          :model="logisticsForm"
          label-width="120px"
          class="mt-4"
        >
          <el-form-item label="生产时间(天)">
            <el-input-number v-model="logisticsForm.production_time" />
          </el-form-item>
          <el-form-item label="有效体积">
            <el-input-number v-model="logisticsForm.effective_volume" :precision="3" />
          </el-form-item>
          <el-form-item label="20尺标准柜装载">
            <el-input-number v-model="logisticsForm.loading_quantity_20gp" />
          </el-form-item>
          <el-form-item label="40尺高柜装载">
            <el-input-number v-model="logisticsForm.loading_quantity_40hc" />
          </el-form-item>
          <el-form-item label="净重(kg)">
            <el-input-number v-model="logisticsForm.net_weight" :precision="2" />
          </el-form-item>
          <el-form-item label="毛重(kg)">
            <el-input-number v-model="logisticsForm.gross_weight" :precision="2" />
          </el-form-item>
        </el-form>

        <!-- 产品尺寸表单 -->
        <el-form
          v-if="activeStep === 4"
          :model="dimensionsForm"
          label-width="140px"
          class="mt-4"
        >
          <el-form-item label="座位宽度">
            <el-input-number v-model="dimensionsForm.seat_width" />
          </el-form-item>
          <el-form-item label="座位深度">
            <el-input-number v-model="dimensionsForm.seat_depth" />
          </el-form-item>
          <el-form-item label="座位最小高度">
            <el-input-number v-model="dimensionsForm.seat_height_min" />
          </el-form-item>
          <el-form-item label="座位最大高度">
            <el-input-number v-model="dimensionsForm.seat_height_max" />
          </el-form-item>
          <el-form-item label="靠背宽度">
            <el-input-number v-model="dimensionsForm.back_width" />
          </el-form-item>
          <el-form-item label="靠背高度">
            <el-input-number v-model="dimensionsForm.back_height" />
          </el-form-item>
          <el-form-item label="靠背距座位高度">
            <el-input-number v-model="dimensionsForm.back_height_from_seat" />
          </el-form-item>
          <el-form-item label="整体宽度">
            <el-input-number v-model="dimensionsForm.overall_width" />
          </el-form-item>
          <el-form-item label="整体深度">
            <el-input-number v-model="dimensionsForm.overall_depth" />
          </el-form-item>
          <el-form-item label="整体最小高度">
            <el-input-number v-model="dimensionsForm.overall_height_min" />
          </el-form-item>
          <el-form-item label="整体最大高度">
            <el-input-number v-model="dimensionsForm.overall_height_max" />
          </el-form-item>
        </el-form>

        <!-- 结构信息表单 -->
        <template v-if="activeStep === 5">
          <h3>内部结构</h3>
          <el-form
            :model="innerComponentsForm"
            label-width="120px"
            class="mt-4"
          >
            <el-form-item label="组件类型">
              <el-radio-group v-model="innerComponentsForm.component_type">
                <el-radio label="SEAT_INNER">座椅内部</el-radio>
                <el-radio label="BACK_INNER">靠背内部</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="材料代码">
              <el-input v-model="innerComponentsForm.material_code" />
            </el-form-item>
            <el-form-item label="厚度">
              <el-input-number v-model="innerComponentsForm.thickness" />
            </el-form-item>
            <el-form-item label="层数">
              <el-input-number v-model="innerComponentsForm.layers_count" />
            </el-form-item>
            <el-form-item label="尺寸规格">
              <el-input v-model="innerComponentsForm.dimensions" />
            </el-form-item>
          </el-form>

          <h3 class="mt-4">外部结构</h3>
          <el-form
            :model="outerComponentsForm"
            label-width="120px"
            class="mt-4"
          >
            <el-form-item label="组件类型">
              <el-radio-group v-model="outerComponentsForm.component_type">
                <el-radio label="SEAT_OUTER">座椅外部</el-radio>
                <el-radio label="BACK_OUTER">靠背外部</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="材料">
              <el-input v-model="outerComponentsForm.material" />
            </el-form-item>
            <el-form-item label="尺寸">
              <el-input v-model="outerComponentsForm.dimensions" />
            </el-form-item>
            <el-form-item label="制造商名称">
              <el-input v-model="outerComponentsForm.manufacturer_name" />
            </el-form-item>
          </el-form>
        </template>

        <!-- 组件信息表单 -->
        <template v-if="activeStep === 6">
          <el-tabs>
            <el-tab-pane label="扶手信息">
              <el-form :model="armsForm" label-width="140px">
                <el-form-item label="材料">
                  <el-input v-model="armsForm.material" />
                </el-form-item>
                <el-form-item label="类型">
                  <el-input v-model="armsForm.type" />
                </el-form-item>
                <el-form-item label="制造商">
                  <el-input v-model="armsForm.manufacturer" />
                </el-form-item>
                <el-form-item label="描述">
                  <el-input type="textarea" v-model="armsForm.description" />
                </el-form-item>
                <el-form-item label="扶手距座面高度">
                  <el-input-number v-model="armsForm.arm_height_from_seat" />
                </el-form-item>
                <el-form-item label="扶手距地面高度">
                  <el-input-number v-model="armsForm.arm_height_from_floor" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="泡棉信息">
              <el-form :model="foamForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="foamForm.description" />
                </el-form-item>
                <el-form-item label="座椅密度">
                  <el-input-number v-model="foamForm.seat_density" />
                </el-form-item>
                <el-form-item label="靠背密度">
                  <el-input-number v-model="foamForm.back_density" />
                </el-form-item>
                <el-form-item label="座椅厚度">
                  <el-input-number v-model="foamForm.seat_thickness" />
                </el-form-item>
                <el-form-item label="靠背厚度">
                  <el-input-number v-model="foamForm.back_thickness" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="脚轮信息">
              <el-form :model="castorsForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="castorsForm.description" />
                </el-form-item>
                <el-form-item label="销轴直径">
                  <el-input-number v-model="castorsForm.pin_thickness" />
                </el-form-item>
                <el-form-item label="轮子直径">
                  <el-input-number v-model="castorsForm.wheel_diameter" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="底座信息">
              <el-form :model="baseForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="baseForm.description" />
                </el-form-item>
                <el-form-item label="底盘直径">
                  <el-input-number v-model="baseForm.size_diameter" />
                </el-form-item>
                <el-form-item label="材料">
                  <el-input v-model="baseForm.material" />
                </el-form-item>
                <el-form-item label="类型">
                  <el-input v-model="baseForm.type" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="气压棒信息">
              <el-form :model="gasLiftForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="gasLiftForm.description" />
                </el-form-item>
                <el-form-item label="气压等级">
                  <el-input v-model="gasLiftForm.gas_lift_class" />
                </el-form-item>
                <el-form-item label="外管长度">
                  <el-input-number v-model="gasLiftForm.casing_length" />
                </el-form-item>
                <el-form-item label="行程">
                  <el-input-number v-model="gasLiftForm.extension_size" />
                </el-form-item>
                <el-form-item label="锥度">
                  <el-input-number v-model="gasLiftForm.taper" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="气压罩信息">
              <el-form :model="gasLiftCoverForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="gasLiftCoverForm.description" />
                </el-form-item>
                <el-form-item label="材料">
                  <el-input v-model="gasLiftCoverForm.material" />
                </el-form-item>
                <el-form-item label="颜色">
                  <el-input v-model="gasLiftCoverForm.colour" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="机构信息">
              <el-form :model="mechanismForm" label-width="120px">
                <el-form-item label="描述">
                  <el-input v-model="mechanismForm.description" />
                </el-form-item>
                <el-form-item label="手柄数量">
                  <el-input-number v-model="mechanismForm.levers_count" />
                </el-form-item>
                <el-form-item label="锁定位置">
                  <el-input v-model="mechanismForm.locking_positions" />
                </el-form-item>
                <el-form-item label="型号">
                  <el-input v-model="mechanismForm.model_no" />
                </el-form-item>
                <el-form-item label="机构供应商">
                  <el-input v-model="mechanismForm.supplier_name" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="配件信息">
              <el-form :model="fittingsForm" label-width="120px">
                <el-form-item label="配件编号">
                  <el-input-number v-model="fittingsForm.fitting_number" />
                </el-form-item>
                <el-form-item label="描述">
                  <el-input v-model="fittingsForm.description" />
                </el-form-item>
                <el-form-item label="数量">
                  <el-input-number v-model="fittingsForm.quantity" />
                </el-form-item>
                <el-form-item label="材料">
                  <el-input v-model="fittingsForm.material" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </template>

        <!-- 步骤控制按钮 -->
        <div class="steps-control mt-4">
          <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
          <el-button type="primary" @click="nextStep" v-if="activeStep < 6">下一步</el-button>
          <el-button type="success" @click="submitForm" v-else>提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeStep = ref(0)

// 表单数据
const basicForm = reactive({
  tccode: '',
  supplier: '',
  supplier_code: '',
  supplier_name: '',
  fire_standard: '',
  fob_20_container_price: 0,
  fob_40_container_price: 0,
  shipping_port: ''
})

const upholsteryForm = reactive({
  fabric_manufacturer: '',
  colour_code: '',
  leather_grade: '',
  usage_per_chair: 0
})

const cartonForm = reactive({
  width: 0,
  depth: 0,
  height: 0,
  board_type: '',
  items_per_carton: 0,
  carton_volume: 0
})

const logisticsForm = reactive({
  production_time: 0,
  effective_volume: 0,
  loading_quantity_20gp: 0,
  loading_quantity_40hc: 0,
  net_weight: 0,
  gross_weight: 0
})

const dimensionsForm = reactive({
  seat_width: 0,
  seat_depth: 0,
  seat_height_min: 0,
  seat_height_max: 0,
  back_width: 0,
  back_height: 0,
  back_height_from_seat: 0,
  overall_width: 0,
  overall_depth: 0,
  overall_height_min: 0,
  overall_height_max: 0
})

const innerComponentsForm = reactive({
  component_type: 'SEAT_INNER',
  material_code: '',
  thickness: 0,
  layers_count: 0,
  dimensions: ''
})

const outerComponentsForm = reactive({
  component_type: 'SEAT_OUTER',
  material: '',
  dimensions: '',
  manufacturer_name: ''
})

const armsForm = reactive({
  material: '',
  type: '',
  manufacturer: '',
  description: '',
  arm_height_from_seat: 0,
  arm_height_from_floor: 0
})

const foamForm = reactive({
  description: '',
  seat_density: 0,
  back_density: 0,
  seat_thickness: 0,
  back_thickness: 0
})

const castorsForm = reactive({
  description: '',
  pin_thickness: 0,
  wheel_diameter: 0
})

const baseForm = reactive({
  description: '',
  size_diameter: 0,
  material: '',
  type: ''
})

const gasLiftForm = reactive({
  description: '',
  gas_lift_class: '',
  casing_length: 0,
  extension_size: 0,
  taper: 0
})

const gasLiftCoverForm = reactive({
  description: '',
  material: '',
  colour: ''
})

const mechanismForm = reactive({
  description: '',
  levers_count: 0,
  locking_positions: '',
  model_no: '',
  supplier_name: ''
})

const fittingsForm = reactive({
  fitting_number: 0,
  description: '',
  quantity: 0,
  material: ''
})

// 步骤控制
const nextStep = () => {
  if (activeStep.value < 6) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 提交表单
const submitForm = async () => {
  try {
    // TODO: 实现表单提交逻辑
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  }
}
</script>

<style scoped>
.create-product {
  padding: 20px;
}

.form-container {
  margin-top: 20px;
}

.mt-4 {
  margin-top: 16px;
}

.steps-control {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}
</style> 