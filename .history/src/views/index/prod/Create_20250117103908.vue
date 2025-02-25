<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-14 17:03:09
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-17 10:38:49
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Create.vue
 * @Description: 产品规格创建表单
-->
<template>
  <div class="create-product">
    <el-card class="form-card">
      <el-steps :active="activeStep" finish-status="success" class="steps-container">
        <el-step title="基本信息" />
        <el-step title="面料信息" />
        <el-step title="包装信息" />
        <el-step title="生产物流" />
        <el-step title="产品尺寸" />
        <el-step title="座椅内部结构" />
        <el-step title="背部内部结构" />
        <el-step title="座椅外部结构" />
        <el-step title="背部外部结构" />
        <el-step title="扶手信息" />
        <el-step title="泡棉信息" />
        <el-step title="脚轮信息" />
        <el-step title="底座信息" />
        <el-step title="气压棒" />
        <el-step title="气压罩" />
        <el-step title="机构信息" />
        <el-step title="配件信息" />
        <el-step title="产品图片" />
      </el-steps>

      <div class="form-container">
        <!-- 基本信息表单 -->
        <el-form
          v-if="activeStep === 0"
          :model="basicForm"
          label-width="140px"
          class="form-content"
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
            <el-input-number v-model="basicForm.fob_20_container_price" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="40尺柜FOB价格">
            <el-input-number v-model="basicForm.fob_40_container_price" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="发货港口">
            <el-input v-model="basicForm.shipping_port" />
          </el-form-item>
        </el-form>

        <!-- 面料信息表单 -->
        <el-form
          v-if="activeStep === 1"
          :model="upholsteryForm"
          label-width="140px"
          class="form-content"
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
            <el-input-number v-model="upholsteryForm.usage_per_chair" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 包装信息表单 -->
        <el-form
          v-if="activeStep === 2"
          :model="cartonForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="包装箱宽度">
            <el-input-number v-model="cartonForm.width" class="w-full" />
          </el-form-item>
          <el-form-item label="包装箱深度">
            <el-input-number v-model="cartonForm.depth" class="w-full" />
          </el-form-item>
          <el-form-item label="包装箱高度">
            <el-input-number v-model="cartonForm.height" class="w-full" />
          </el-form-item>
          <el-form-item label="纸板类型">
            <el-input v-model="cartonForm.board_type" />
          </el-form-item>
          <el-form-item label="每箱数量">
            <el-input-number v-model="cartonForm.items_per_carton" class="w-full" />
          </el-form-item>
          <el-form-item label="箱体体积">
            <el-input-number v-model="cartonForm.carton_volume" :precision="3" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 生产物流信息表单 -->
        <el-form
          v-if="activeStep === 3"
          :model="logisticsForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="生产时间(天)">
            <el-input-number v-model="logisticsForm.production_time" class="w-full" />
          </el-form-item>
          <el-form-item label="有效体积">
            <el-input-number v-model="logisticsForm.effective_volume" :precision="3" class="w-full" />
          </el-form-item>
          <el-form-item label="20尺标准柜装载">
            <el-input-number v-model="logisticsForm.loading_quantity_20gp" class="w-full" />
          </el-form-item>
          <el-form-item label="40尺高柜装载">
            <el-input-number v-model="logisticsForm.loading_quantity_40hc" class="w-full" />
          </el-form-item>
          <el-form-item label="净重(kg)">
            <el-input-number v-model="logisticsForm.net_weight" :precision="2" class="w-full" />
          </el-form-item>
          <el-form-item label="毛重(kg)">
            <el-input-number v-model="logisticsForm.gross_weight" :precision="2" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 产品尺寸表单 -->
        <el-form
          v-if="activeStep === 4"
          :model="dimensionsForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="座位宽度">
            <el-input-number v-model="dimensionsForm.seat_width" class="w-full" />
          </el-form-item>
          <el-form-item label="座位深度">
            <el-input-number v-model="dimensionsForm.seat_depth" class="w-full" />
          </el-form-item>
          <el-form-item label="座位最小高度">
            <el-input-number v-model="dimensionsForm.seat_height_min" class="w-full" />
          </el-form-item>
          <el-form-item label="座位最大高度">
            <el-input-number v-model="dimensionsForm.seat_height_max" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背宽度">
            <el-input-number v-model="dimensionsForm.back_width" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背高度">
            <el-input-number v-model="dimensionsForm.back_height" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背距座位高度">
            <el-input-number v-model="dimensionsForm.back_height_from_seat" class="w-full" />
          </el-form-item>
          <el-form-item label="整体宽度">
            <el-input-number v-model="dimensionsForm.overall_width" class="w-full" />
          </el-form-item>
          <el-form-item label="整体深度">
            <el-input-number v-model="dimensionsForm.overall_depth" class="w-full" />
          </el-form-item>
          <el-form-item label="整体最小高度">
            <el-input-number v-model="dimensionsForm.overall_height_min" class="w-full" />
          </el-form-item>
          <el-form-item label="整体最大高度">
            <el-input-number v-model="dimensionsForm.overall_height_max" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 座椅内部结构表单 -->
        <el-form
          v-if="activeStep === 5"
          :model="seatInnerForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="材料代码">
            <el-input v-model="seatInnerForm.material_code" />
          </el-form-item>
          <el-form-item label="厚度">
            <el-input-number v-model="seatInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="层数">
            <el-input-number v-model="seatInnerForm.layers_count" class="w-full" />
          </el-form-item>
          <el-form-item label="尺寸规格">
            <el-input v-model="seatInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- 背部内部结构表单 -->
        <el-form
          v-if="activeStep === 6"
          :model="backInnerForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="材料代码">
            <el-input v-model="backInnerForm.material_code" />
          </el-form-item>
          <el-form-item label="厚度">
            <el-input-number v-model="backInnerForm.thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="层数">
            <el-input-number v-model="backInnerForm.layers_count" class="w-full" />
          </el-form-item>
          <el-form-item label="尺寸规格">
            <el-input v-model="backInnerForm.dimensions" />
          </el-form-item>
        </el-form>

        <!-- 座椅外部结构表单 -->
        <el-form
          v-if="activeStep === 7"
          :model="seatOuterForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="材料">
            <el-input v-model="seatOuterForm.material" />
          </el-form-item>
          <el-form-item label="尺寸">
            <el-input v-model="seatOuterForm.dimensions" placeholder="宽x深" />
          </el-form-item>
          <el-form-item label="制造商名称">
            <el-input v-model="seatOuterForm.manufacturer_name" />
          </el-form-item>
        </el-form>

        <!-- 背部外部结构表单 -->
        <el-form
          v-if="activeStep === 8"
          :model="backOuterForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="材料">
            <el-input v-model="backOuterForm.material" />
          </el-form-item>
          <el-form-item label="尺寸">
            <el-input v-model="backOuterForm.dimensions" placeholder="宽x高" />
          </el-form-item>
          <el-form-item label="制造商名称">
            <el-input v-model="backOuterForm.manufacturer_name" />
          </el-form-item>
        </el-form>

        <!-- 扶手信息表单 -->
        <el-form
          v-if="activeStep === 9"
          :model="armsForm"
          label-width="140px"
          class="form-content"
        >
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
            <el-input-number v-model="armsForm.arm_height_from_seat" class="w-full" />
          </el-form-item>
          <el-form-item label="扶手距地面高度">
            <el-input-number v-model="armsForm.arm_height_from_floor" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 泡棉信息表单 -->
        <el-form
          v-if="activeStep === 10"
          :model="foamForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="描述">
            <el-input v-model="foamForm.description" />
          </el-form-item>
          <el-form-item label="座椅密度">
            <el-input-number v-model="foamForm.seat_density" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背密度">
            <el-input-number v-model="foamForm.back_density" class="w-full" />
          </el-form-item>
          <el-form-item label="座椅厚度">
            <el-input-number v-model="foamForm.seat_thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="靠背厚度">
            <el-input-number v-model="foamForm.back_thickness" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 脚轮信息表单 -->
        <el-form
          v-if="activeStep === 11"
          :model="castorsForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="描述">
            <el-input v-model="castorsForm.description" />
          </el-form-item>
          <el-form-item label="销轴直径">
            <el-input-number v-model="castorsForm.pin_thickness" class="w-full" />
          </el-form-item>
          <el-form-item label="轮子直径">
            <el-input-number v-model="castorsForm.wheel_diameter" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 底座信息表单 -->
        <el-form
          v-if="activeStep === 12"
          :model="baseForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="描述">
            <el-input v-model="baseForm.description" />
          </el-form-item>
          <el-form-item label="底盘直径">
            <el-input-number v-model="baseForm.size_diameter" class="w-full" />
          </el-form-item>
          <el-form-item label="材料">
            <el-input v-model="baseForm.material" />
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="baseForm.type" />
          </el-form-item>
        </el-form>

        <!-- 气压棒信息表单 -->
        <el-form
          v-if="activeStep === 13"
          :model="gasLiftForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="描述">
            <el-input v-model="gasLiftForm.description" />
          </el-form-item>
          <el-form-item label="气压等级">
            <el-input v-model="gasLiftForm.gas_lift_class" />
          </el-form-item>
          <el-form-item label="外管长度">
            <el-input-number v-model="gasLiftForm.casing_length" class="w-full" />
          </el-form-item>
          <el-form-item label="行程">
            <el-input-number v-model="gasLiftForm.extension_size" class="w-full" />
          </el-form-item>
          <el-form-item label="锥度">
            <el-input-number v-model="gasLiftForm.taper" class="w-full" />
          </el-form-item>
        </el-form>

        <!-- 气压罩信息表单 -->
        <el-form
          v-if="activeStep === 14"
          :model="gasLiftCoverForm"
          label-width="140px"
          class="form-content"
        >
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

        <!-- 机构信息表单 -->
        <el-form
          v-if="activeStep === 15"
          :model="mechanismForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="描述">
            <el-input v-model="mechanismForm.description" />
          </el-form-item>
          <el-form-item label="手柄数量">
            <el-input-number v-model="mechanismForm.levers_count" class="w-full" />
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

        <!-- 配件信息表单 -->
        <el-form
          v-if="activeStep === 16"
          :model="fittingsForm"
          label-width="140px"
          class="form-content"
        >
          <el-form-item label="配件编号">
            <el-input-number v-model="fittingsForm.fitting_number" class="w-full" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="fittingsForm.description" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="fittingsForm.quantity" class="w-full" />
          </el-form-item>
          <el-form-item label="材料">
            <el-input v-model="fittingsForm.material" />
          </el-form-item>
        </el-form>

        <!-- 产品图片表单 -->
        <el-form
          v-if="activeStep === 17"
          :model="productImagesForm"
          label-width="140px"
          class="form-content"
        >
          <!-- 正视图上传 -->
          <el-form-item label="正视图">
            <div class="upload-preview-container">
              <el-upload
                class="upload-component"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="createHandleSuccess('front_img_path')"
                :on-error="handleError"
              >
                <template v-if="productImagesForm.front_img_path">
                  <div class="image-preview">
                    <img :src="productImagesForm.front_img_path" alt="正视图" />
                    <div class="image-actions">
                      <el-button type="danger" @click.stop="handleRemove('front_img_path')">删除</el-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="upload-placeholder">
                    <el-icon><Plus /></el-icon>
                    <span>点击上传正视图</span>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 侧视图上传 -->
          <el-form-item label="侧视图">
            <div class="upload-preview-container">
              <el-upload
                class="upload-component"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="createHandleSuccess('side_img_path')"
                :on-error="handleError"
              >
                <template v-if="productImagesForm.side_img_path">
                  <div class="image-preview">
                    <img :src="productImagesForm.side_img_path" alt="侧视图" />
                    <div class="image-actions">
                      <el-button type="danger" @click.stop="handleRemove('side_img_path')">删除</el-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="upload-placeholder">
                    <el-icon><Plus /></el-icon>
                    <span>点击上传侧视图</span>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 背视图上传 -->
          <el-form-item label="背视图">
            <div class="upload-preview-container">
              <el-upload
                class="upload-component"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="createHandleSuccess('back_view_path')"
                :on-error="handleError"
              >
                <template v-if="productImagesForm.back_view_path">
                  <div class="image-preview">
                    <img :src="productImagesForm.back_view_path" alt="背视图" />
                    <div class="image-actions">
                      <el-button type="danger" @click.stop="handleRemove('back_view_path')">删除</el-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="upload-placeholder">
                    <el-icon><Plus /></el-icon>
                    <span>点击上传背视图</span>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 横视图上传 -->
          <el-form-item label="横视图">
            <div class="upload-preview-container">
              <el-upload
                class="upload-component"
                action="#"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="createHandleSuccess('horizontal_view_path')"
                :on-error="handleError"
              >
                <template v-if="productImagesForm.horizontal_view_path">
                  <div class="image-preview">
                    <img :src="productImagesForm.horizontal_view_path" alt="横视图" />
                    <div class="image-actions">
                      <el-button type="danger" @click.stop="handleRemove('horizontal_view_path')">删除</el-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="upload-placeholder">
                    <el-icon><Plus /></el-icon>
                    <span>点击上传横视图</span>
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>

        <!-- 步骤控制按钮 -->
        <div class="steps-control-wrapper">
          <div class="steps-control">
            <div class="button-group">
              <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
              <el-button type="primary" @click="nextStep" v-if="activeStep < 17">下一步</el-button>
              <el-button type="success" @click="submitForm" v-else>提交</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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

// 座椅内部结构数据
const seatInnerForm = reactive({
  material_code: '',
  thickness: 0,
  layers_count: 0,
  dimensions: ''
})

// 背部内部结构数据
const backInnerForm = reactive({
  material_code: '',
  thickness: 0,
  layers_count: 0,
  dimensions: ''
})

// 座椅外部结构数据
const seatOuterForm = reactive({
  material: '',
  dimensions: '',
  manufacturer_name: ''
})

// 背部外部结构数据
const backOuterForm = reactive({
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

// 配件信息数据
const fittingsForm = reactive({
  fitting_number: 0,
  description: '',
  quantity: 0,
  material: ''
})

// 产品图片表单
interface ProductImagesForm {
  front_img_path: string;
  side_img_path: string;
  back_view_path: string;
  horizontal_view_path: string;
}

type ImagePathKey = keyof ProductImagesForm;

const productImagesForm = ref<ProductImagesForm>({
  front_img_path: '',
  side_img_path: '',
  back_view_path: '',
  horizontal_view_path: ''
})

// 处理图片上传前的验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
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

// 创建处理函数工厂
const createHandleSuccess = (type: ImagePathKey) => {
  return (response: any, uploadFile: UploadFile) => {
    handleSuccess(response, uploadFile, type)
  }
}

// 处理图片上传成功
const handleSuccess = (response: any, uploadFile: UploadFile, type: ImagePathKey) => {
  if (uploadFile.raw) {
    productImagesForm.value[type] = URL.createObjectURL(uploadFile.raw)
    ElMessage.success('上传成功')
  }
}

// 处理图片上传失败
const handleError = () => {
  ElMessage.error('上传失败，请重试')
}

// 处理图片移除
const handleRemove = (type: ImagePathKey) => {
  productImagesForm.value[type] = ''
}

// 步骤控制
const nextStep = () => {
  if (activeStep.value < 17) {
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
    const formData = {
      basicInfo: basicForm,
      upholstery: upholsteryForm,
      carton: cartonForm,
      logistics: logisticsForm,
      dimensions: dimensionsForm,
      seatInner: seatInnerForm,
      backInner: backInnerForm,
      seatOuter: seatOuterForm,
      backOuter: backOuterForm,
      arms: armsForm,
      foam: foamForm,
      castors: castorsForm,
      base: baseForm,
      gasLift: gasLiftForm,
      gasLiftCover: gasLiftCoverForm,
      mechanism: mechanismForm,
      fittings: fittingsForm,
      images: productImagesForm.value
    }

    console.log('提交的表单数据：', formData)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  }
}

// 修改键盘事件处理函数
const handleKeyDown = (e: KeyboardEvent) => {
  // 如果当前焦点在输入框或文本框中，不处理回车事件
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return
  }

  if (e.key === 'Enter') {
    if (activeStep.value < 17) {
      nextStep()
    } else {
      submitForm()
    }
  }
}

// 在组件挂载时添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// 在组件卸载时移除键盘事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 步骤配置
const steps = [
  {
    title: '基本信息',
    description: '填写产品基本信息',
    content: basicForm
  },
  // ... other steps ...
  {
    title: '配件信息',
    description: '填写产品配件信息',
    content: fittingsForm
  },
  {
    title: '产品图片',
    description: '上传产品各角度图片',
    content: productImagesForm
  }
]
</script>

<style scoped>
.create-product {
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.form-card {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 80px;
}

.steps-container {
  margin-bottom: 30px;
  padding: 20px 0;
}

.form-container {
  width: 100%;
  max-width: 800px;
  height: calc(100% - 80px) ;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  justify-content: center;
}

.form-content {
  min-height: 400px;
}

.w-full {
  width: 100%;
}

.steps-control-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.steps-control {
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  height: 80px;
  padding: 0 20px;
  max-width: 800px;
  margin: 0 auto;
}

:deep(.el-input-number) {
  width: 100%;
}
:deep(.el-card__body){
  height: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-textarea__inner) {
  min-height: 100px;
}

:deep(.el-steps) {
  overflow-x: auto;
  padding-bottom: 10px;
}

:deep(.el-steps__wrapper) {
  min-width: max-content;
}

:deep(.el-step__title) {
  font-size: 14px;
  line-height: 1.2;
  margin-top: 8px;
  text-align: center;
  display: block;
}

:deep(.el-step__head) {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.el-step) {
  text-align: center;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.el-step__main) {
  white-space: normal;
  max-width: 120px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.el-step__line) {
  margin-right: 0;
  top: 15px;
  left: calc(50% + 20px);
  right: calc(-50% + 20px);
}

:deep(.el-button) {
  min-width: 100px;
  height: 40px;
}

:deep(.el-steps--horizontal) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

:deep(.el-step:last-child) {
  padding-right: 0;
}

.upload-preview-container {
  width: 100%;
  max-width: 300px;
}

.upload-component {
  width: 100%;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: #f5f7fa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.upload-placeholder:hover {
  border-color: #409eff;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 180px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.image-actions {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px;
  border-radius: 4px;
}

.image-preview:hover .image-actions {
  display: block;
}
</style>
