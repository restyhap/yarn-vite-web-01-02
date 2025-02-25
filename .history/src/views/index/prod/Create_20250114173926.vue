<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? '编辑产品' : '创建产品' }}</h2>
        <div class="flex gap-2">
          <el-button type="primary" @click="handleImportExcel">
            <el-icon class="mr-1"><Upload /></el-icon>
            导入Excel
          </el-button>
          <el-button type="success" @click="handleDownloadTemplate">
            <el-icon class="mr-1"><Download /></el-icon>
            下载模板
          </el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>

      <!-- 步骤条 -->
      <el-steps :active="activeStep" finish-status="success" class="mb-8">
        <el-step title="基本信息" description="产品基础信息" />
        <el-step title="面料信息" description="面料和材质" />
        <el-step title="包装信息" description="包装和尺寸" />
        <el-step title="生产物流" description="生产和运输" />
        <el-step title="产品尺寸" description="详细尺寸" />
        <el-step title="结构信息" description="内外部结构" />
        <el-step title="配件信息" description="扶手/泡棉等" />
        <el-step title="机构信息" description="底座/气压棒" />
      </el-steps>

      <!-- 导入Excel对话框 -->
      <el-dialog v-model="showImportDialog" title="导入Excel" width="500px">
        <el-upload
          class="upload-demo"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleExcelChange"
          :before-upload="beforeExcelUpload"
          accept=".xlsx,.xls"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件，且文件大小不超过 5MB
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="flex justify-end gap-2">
            <el-button @click="showImportDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmImport">确认导入</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 表单区域 -->
      <div class="form-container">
        <!-- 步骤1：基本信息 -->
        <div v-show="activeStep === 0">
          <el-form
            ref="basicFormRef"
            :model="formData.basic"
            :rules="rules.basic"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="产品代码" prop="tccode">
              <el-input v-model="formData.basic.tccode" placeholder="请输入产品代码" />
            </el-form-item>

            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="formData.basic.supplier" placeholder="请输入供应商" />
            </el-form-item>

            <el-form-item label="供应商代码" prop="supplier_code">
              <el-input v-model="formData.basic.supplier_code" placeholder="请输入供应商代码" />
            </el-form-item>

            <el-form-item label="供应商名称" prop="supplier_name">
              <el-input v-model="formData.basic.supplier_name" placeholder="请输入供应商名称" />
            </el-form-item>

            <el-form-item label="防火标准" prop="fire_standard">
              <el-select v-model="formData.basic.fire_standard" placeholder="请选择防火标准" class="w-full">
                <el-option label="BS 5852" value="BS 5852" />
                <el-option label="CAL TB 117" value="CAL TB 117" />
                <el-option label="16 CFR 1633" value="16 CFR 1633" />
                <el-option label="16 CFR 1632" value="16 CFR 1632" />
              </el-select>
            </el-form-item>

            <el-form-item label="20尺柜FOB价格" prop="fob_20_container_price">
              <el-input-number
                v-model="formData.basic.fob_20_container_price"
                :precision="2"
                :step="100"
                :min="0"
                class="w-full"
                placeholder="请输入20尺柜FOB价格"
              />
            </el-form-item>

            <el-form-item label="40尺柜FOB价格" prop="fob_40_container_price">
              <el-input-number
                v-model="formData.basic.fob_40_container_price"
                :precision="2"
                :step="100"
                :min="0"
                class="w-full"
                placeholder="请输入40尺柜FOB价格"
              />
            </el-form-item>

            <el-form-item label="发货港口" prop="shipping_port">
              <el-select v-model="formData.basic.shipping_port" placeholder="请选择发货港口" class="w-full">
                <el-option label="宁波港" value="宁波港" />
                <el-option label="上海港" value="上海港" />
                <el-option label="深圳港" value="深圳港" />
                <el-option label="广州港" value="广州港" />
                <el-option label="青岛港" value="青岛港" />
                <el-option label="天津港" value="天津港" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤2：面料信息 -->
        <div v-show="activeStep === 1">
          <el-form
            ref="upholsteryFormRef"
            :model="formData.upholstery"
            :rules="rules.upholstery"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="面料制造商" prop="fabric_manufacturer">
              <el-input v-model="formData.upholstery.fabric_manufacturer" placeholder="请输入面料制造商" />
            </el-form-item>

            <el-form-item label="颜色代码" prop="colour_code">
              <el-input v-model="formData.upholstery.colour_code" placeholder="请输入颜色代码" />
            </el-form-item>

            <el-form-item label="皮革等级" prop="leather_grade">
              <el-input v-model="formData.upholstery.leather_grade" placeholder="请输入皮革等级" />
            </el-form-item>

            <el-form-item label="每把椅子用料" prop="usage_per_chair">
              <el-input-number
                v-model="formData.upholstery.usage_per_chair"
                :precision="2"
                :step="0.1"
                :min="0"
                class="w-full"
                placeholder="请输入每把椅子用料(m²)"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤3：包装信息 -->
        <div v-show="activeStep === 2">
          <el-form
            ref="cartonFormRef"
            :model="formData.carton"
            :rules="rules.carton"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="包装箱宽度" prop="width">
              <el-input-number
                v-model="formData.carton.width"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入包装箱宽度(mm)"
              />
            </el-form-item>

            <el-form-item label="包装箱深度" prop="depth">
              <el-input-number
                v-model="formData.carton.depth"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入包装箱深度(mm)"
              />
            </el-form-item>

            <el-form-item label="包装箱高度" prop="height">
              <el-input-number
                v-model="formData.carton.height"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入包装箱高度(mm)"
              />
            </el-form-item>

            <el-form-item label="纸板类型" prop="board_type">
              <el-input v-model="formData.carton.board_type" placeholder="请输入纸板类型" />
            </el-form-item>

            <el-form-item label="每箱数量" prop="items_per_carton">
              <el-input-number
                v-model="formData.carton.items_per_carton"
                :step="1"
                :min="1"
                class="w-full"
                placeholder="请输入每箱数量"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤4：生产物流 -->
        <div v-show="activeStep === 3">
          <el-form
            ref="logisticsFormRef"
            :model="formData.logistics"
            :rules="rules.logistics"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="生产时间" prop="production_time">
              <el-input-number
                v-model="formData.logistics.production_time"
                :step="1"
                :min="1"
                class="w-full"
                placeholder="请输入生产时间(天)"
              />
            </el-form-item>

            <el-form-item label="20尺柜装载量" prop="loading_quantity_20gp">
              <el-input-number
                v-model="formData.logistics.loading_quantity_20gp"
                :step="1"
                :min="0"
                class="w-full"
                placeholder="请输入20尺标准柜装载数量"
              />
            </el-form-item>

            <el-form-item label="40尺柜装载量" prop="loading_quantity_40hc">
              <el-input-number
                v-model="formData.logistics.loading_quantity_40hc"
                :step="1"
                :min="0"
                class="w-full"
                placeholder="请输入40尺高柜装载数量"
              />
            </el-form-item>

            <el-form-item label="净重" prop="net_weight">
              <el-input-number
                v-model="formData.logistics.net_weight"
                :precision="2"
                :step="0.1"
                :min="0"
                class="w-full"
                placeholder="请输入净重(kg)"
              />
            </el-form-item>

            <el-form-item label="毛重" prop="gross_weight">
              <el-input-number
                v-model="formData.logistics.gross_weight"
                :precision="2"
                :step="0.1"
                :min="0"
                class="w-full"
                placeholder="请输入毛重(kg)"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤5：产品尺寸 -->
        <div v-show="activeStep === 4">
          <el-form
            ref="dimensionsFormRef"
            :model="formData.dimensions"
            :rules="rules.dimensions"
            label-width="140px"
            class="max-w-3xl"
          >
            <el-form-item label="座位宽度" prop="seat_width">
              <el-input-number
                v-model="formData.dimensions.seat_width"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入座位宽度(mm)"
              />
            </el-form-item>

            <el-form-item label="座位深度" prop="seat_depth">
              <el-input-number
                v-model="formData.dimensions.seat_depth"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入座位深度(mm)"
              />
            </el-form-item>

            <el-form-item label="座位最小高度" prop="seat_height_min">
              <el-input-number
                v-model="formData.dimensions.seat_height_min"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入座位最小高度(mm)"
              />
            </el-form-item>

            <el-form-item label="座位最大高度" prop="seat_height_max">
              <el-input-number
                v-model="formData.dimensions.seat_height_max"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入座位最大高度(mm)"
              />
            </el-form-item>

            <el-divider>靠背尺寸</el-divider>

            <el-form-item label="靠背宽度" prop="back_width">
              <el-input-number
                v-model="formData.dimensions.back_width"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入靠背宽度(mm)"
              />
            </el-form-item>

            <el-form-item label="靠背高度" prop="back_height">
              <el-input-number
                v-model="formData.dimensions.back_height"
                :step="10"
                :min="0"
                class="w-full"
                placeholder="请输入靠背高度(mm)"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤6：结构信息 -->
        <div v-show="activeStep === 5">
          <el-tabs v-model="activeStructureTab" class="max-w-3xl">
            <el-tab-pane label="内部结构" name="inner">
              <el-form
                ref="innerComponentsFormRef"
                :model="formData.innerComponents"
                :rules="rules.innerComponents"
                label-width="120px"
              >
                <el-form-item label="组件类型" prop="component_type">
                  <el-select v-model="formData.innerComponents.component_type" placeholder="请选择组件类型" class="w-full">
                    <el-option label="座椅内部" value="SEAT_INNER" />
                    <el-option label="靠背内部" value="BACK_INNER" />
                  </el-select>
                </el-form-item>

                <el-form-item label="材料代码" prop="material_code">
                  <el-input v-model="formData.innerComponents.material_code" placeholder="请输入材料代码" />
                </el-form-item>

                <el-form-item label="厚度" prop="thickness">
                  <el-input-number
                    v-model="formData.innerComponents.thickness"
                    :step="1"
                    :min="0"
                    class="w-full"
                    placeholder="请输入厚度(mm)"
                  />
                </el-form-item>

                <el-form-item label="层数" prop="layers_count">
                  <el-input-number
                    v-model="formData.innerComponents.layers_count"
                    :step="1"
                    :min="1"
                    class="w-full"
                    placeholder="请输入层数"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="外部结构" name="outer">
              <el-form
                ref="outerComponentsFormRef"
                :model="formData.outerComponents"
                :rules="rules.outerComponents"
                label-width="120px"
              >
                <el-form-item label="组件类型" prop="component_type">
                  <el-select v-model="formData.outerComponents.component_type" placeholder="请选择组件类型" class="w-full">
                    <el-option label="座椅外部" value="SEAT_OUTER" />
                    <el-option label="靠背外部" value="BACK_OUTER" />
                  </el-select>
                </el-form-item>

                <el-form-item label="材料" prop="material">
                  <el-input v-model="formData.outerComponents.material" placeholder="请输入材料" />
                </el-form-item>

                <el-form-item label="尺寸" prop="dimensions">
                  <el-input v-model="formData.outerComponents.dimensions" placeholder="请输入尺寸(宽x深/宽x高)" />
                </el-form-item>

                <el-form-item label="制造商名称" prop="manufacturer_name">
                  <el-input v-model="formData.outerComponents.manufacturer_name" placeholder="请输入制造商名称" />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 步骤7：配件信息 -->
        <div v-show="activeStep === 6">
          <el-form
            ref="accessoriesFormRef"
            :model="formData.accessories"
            :rules="rules.accessories"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="配件类型" prop="accessory_type">
              <el-select v-model="formData.accessories.accessory_type" placeholder="请选择配件类型" class="w-full">
                <el-option label="扶手" value="HANDLE" />
                <el-option label="泡棉" value="FOAM" />
              </el-select>
            </el-form-item>

            <el-form-item label="材料" prop="material">
              <el-input v-model="formData.accessories.material" placeholder="请输入材料" />
            </el-form-item>

            <el-form-item label="尺寸" prop="dimensions">
              <el-input v-model="formData.accessories.dimensions" placeholder="请输入尺寸(宽x深/宽x高)" />
            </el-form-item>

            <el-form-item label="制造商名称" prop="manufacturer_name">
              <el-input v-model="formData.accessories.manufacturer_name" placeholder="请输入制造商名称" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 步骤8：机构信息 -->
        <div v-show="activeStep === 7">
          <el-form
            ref="mechanismFormRef"
            :model="formData.mechanism"
            :rules="rules.mechanism"
            label-width="120px"
            class="max-w-3xl"
          >
            <el-form-item label="机构类型" prop="mechanism_type">
              <el-select v-model="formData.mechanism.mechanism_type" placeholder="请选择机构类型" class="w-full">
                <el-option label="底座" value="BASE" />
                <el-option label="气压棒" value="PRESSURE_BAR" />
              </el-select>
            </el-form-item>

            <el-form-item label="材料" prop="material">
              <el-input v-model="formData.mechanism.material" placeholder="请输入材料" />
            </el-form-item>

            <el-form-item label="尺寸" prop="dimensions">
              <el-input v-model="formData.mechanism.dimensions" placeholder="请输入尺寸(宽x深/宽x高)" />
            </el-form-item>

            <el-form-item label="制造商名称" prop="manufacturer_name">
              <el-input v-model="formData.mechanism.manufacturer_name" placeholder="请输入制造商名称" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-between mt-8">
          <el-button :disabled="activeStep === 0" @click="prevStep">上一步</el-button>
          <div class="flex gap-2">
            <el-button v-if="activeStep === 7" type="primary" @click="handleSubmit">提交</el-button>
            <el-button v-else type="primary" @click="nextStep">下一步</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Upload, Download, UploadFilled } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const router = useRouter()
const route = useRouter().currentRoute.value

// 当前步骤
const activeStep = ref(0)
const activeStructureTab = ref('inner')

// 表单引用
const basicFormRef = ref<FormInstance>()
const upholsteryFormRef = ref<FormInstance>()
const cartonFormRef = ref<FormInstance>()
const logisticsFormRef = ref<FormInstance>()
const dimensionsFormRef = ref<FormInstance>()
const innerComponentsFormRef = ref<FormInstance>()
const outerComponentsFormRef = ref<FormInstance>()
const accessoriesFormRef = ref<FormInstance>()
const mechanismFormRef = ref<FormInstance>()

// 判断是否是编辑模式
const isEdit = ref(route.path.includes('/edit/'))

// 表单数据
const formData = ref({
  basic: {
    tccode: '',
    supplier: '',
    supplier_code: '',
    supplier_name: '',
    fire_standard: '',
    fob_20_container_price: 0,
    fob_40_container_price: 0,
    shipping_port: ''
  },
  upholstery: {
    fabric_manufacturer: '',
    colour_code: '',
    leather_grade: '',
    usage_per_chair: 0
  },
  carton: {
    width: 0,
    depth: 0,
    height: 0,
    board_type: '',
    items_per_carton: 1,
    carton_volume: 0
  },
  logistics: {
    production_time: 1,
    effective_volume: 0,
    loading_quantity_20gp: 0,
    loading_quantity_40hc: 0,
    net_weight: 0,
    gross_weight: 0
  },
  dimensions: {
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
  },
  innerComponents: {
    component_type: '',
    material_code: '',
    thickness: 0,
    layers_count: 1,
    dimensions: ''
  },
  outerComponents: {
    component_type: '',
    material: '',
    dimensions: '',
    manufacturer_name: ''
  },
  arms: {
    material: '',
    type: '',
    manufacturer: '',
    description: '',
    arm_height_from_seat: 0,
    arm_height_from_floor: 0
  },
  foam: {
    description: '',
    seat_density: 0,
    back_density: 0,
    seat_thickness: 0,
    back_thickness: 0
  },
  castors: {
    description: '',
    pin_thickness: 0,
    wheel_diameter: 0
  },
  base: {
    description: '',
    size_diameter: 0,
    material: '',
    type: ''
  },
  gasLift: {
    description: '',
    gas_lift_class: '',
    casing_length: 0,
    extension_size: 0,
    taper: 0
  },
  gasLiftCover: {
    description: '',
    material: '',
    colour: ''
  },
  mechanism: {
    description: '',
    levers_count: 0,
    locking_positions: '',
    model_no: '',
    supplier_name: ''
  },
  fittings: [{
    fitting_number: 0,
    description: '',
    quantity: 0,
    material: ''
  }]
})

// 表单验证规则
const rules = ref<FormRules>({
  basic: {
    tccode: [
      { required: true, message: '请输入产品代码', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
    supplier_code: [{ required: true, message: '请输入供应商代码', trigger: 'blur' }],
    supplier_name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
    fire_standard: [{ required: true, message: '请选择防火标准', trigger: 'change' }],
    shipping_port: [{ required: true, message: '请选择发货港口', trigger: 'change' }]
  },
  upholstery: {
    fabric_manufacturer: [{ required: true, message: '请输入面料制造商', trigger: 'blur' }],
    colour_code: [{ required: true, message: '请输入颜色代码', trigger: 'blur' }]
  },
  carton: {
    width: [{ required: true, message: '请输入包装箱宽度', trigger: 'blur' }],
    depth: [{ required: true, message: '请输入包装箱深度', trigger: 'blur' }],
    height: [{ required: true, message: '请输入包装箱高度', trigger: 'blur' }]
  },
  logistics: {
    production_time: [{ required: true, message: '请输入生产时间', trigger: 'blur' }],
    loading_quantity_20gp: [{ required: true, message: '请输入20尺柜装载量', trigger: 'blur' }],
    loading_quantity_40hc: [{ required: true, message: '请输入40尺柜装载量', trigger: 'blur' }]
  },
  dimensions: {
    seat_width: [{ required: true, message: '请输入座位宽度', trigger: 'blur' }],
    seat_depth: [{ required: true, message: '请输入座位深度', trigger: 'blur' }]
  },
  innerComponents: {
    component_type: [{ required: true, message: '请选择组件类型', trigger: 'change' }],
    material_code: [{ required: true, message: '请输入材料代码', trigger: 'blur' }]
  },
  outerComponents: {
    component_type: [{ required: true, message: '请选择组件类型', trigger: 'change' }],
    material: [{ required: true, message: '请输入材料', trigger: 'blur' }]
  },
  accessories: {
    accessory_type: [{ required: true, message: '请选择配件类型', trigger: 'change' }],
    material: [{ required: true, message: '请输入材料', trigger: 'blur' }]
  },
  mechanism: {
    mechanism_type: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
    material: [{ required: true, message: '请输入材料', trigger: 'blur' }]
  }
})

// 下一步
const nextStep = async () => {
  let currentFormRef: FormInstance | undefined

  switch (activeStep.value) {
    case 0:
      currentFormRef = basicFormRef.value
      break
    case 1:
      currentFormRef = upholsteryFormRef.value
      break
    case 2:
      currentFormRef = cartonFormRef.value
      break
    case 3:
      currentFormRef = logisticsFormRef.value
      break
    case 4:
      currentFormRef = dimensionsFormRef.value
      break
    case 5:
      currentFormRef = activeStructureTab.value === 'inner' ? innerComponentsFormRef.value : outerComponentsFormRef.value
      break
    case 6:
      currentFormRef = accessoriesFormRef.value
      break
    case 7:
      currentFormRef = mechanismFormRef.value
      break
  }

  if (currentFormRef) {
    await currentFormRef.validate((valid) => {
      if (valid) {
        activeStep.value++
      }
    })
  }
}

// 上一步
const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 验证所有表单
    const formRefs = [
      basicFormRef.value,
      upholsteryFormRef.value,
      cartonFormRef.value,
      logisticsFormRef.value,
      dimensionsFormRef.value,
      innerComponentsFormRef.value,
      outerComponentsFormRef.value,
      accessoriesFormRef.value,
      mechanismFormRef.value
    ]

    const validations = await Promise.all(
      formRefs.map((formRef) => formRef?.validate().catch(() => false))
    )

    if (validations.every((valid) => valid !== false)) {
      console.log('提交的数据:', formData.value)
      // TODO: 调用创建/编辑API
      ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
      router.push('/prod/list')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 获取编辑数据
const getEditData = async (id: string) => {
  try {
    // TODO: 调用获取详情API
    const mockData = {
      // ... 模拟数据
    }
    // formData.value = mockData
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

// 在编辑模式下获取数据
onMounted(() => {
  if (isEdit.value && route.params.id) {
    getEditData(route.params.id as string)
  }
})

// 导入对话框
const showImportDialog = ref(false)
const selectedFile = ref<File | null>(null)

// Excel 相关处理函数
const handleImportExcel = () => {
  showImportDialog.value = true
}

const beforeExcelUpload = (file: File) => {
  const isExcel = /\.(xlsx|xls)$/.test(file.name.toLowerCase())
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB!')
    return false
  }
  return true
}

const handleExcelChange = (file: any) => {
  selectedFile.value = file.raw
}

const confirmImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length > 0) {
        // TODO: 处理导入的数据
        console.log('导入的数据:', jsonData)
        ElMessage.success('数据导入成功')
        showImportDialog.value = false
      }
    } catch (error) {
      console.error('Excel导入错误:', error)
      ElMessage.error('Excel导入失败，请检查文件格式')
    }
  }
  reader.readAsArrayBuffer(selectedFile.value)
}

const handleDownloadTemplate = () => {
  // 创建模板数据
  const templateData = {
    basic: {
      tccode: 'TC001',
      supplier: '供应商名称',
      supplier_code: 'SP001',
      supplier_name: '供应商全称'
    },
    upholstery: {
      fabric_manufacturer: '面料制造商',
      colour_code: 'C001',
      leather_grade: 'A级'
    }
    // ... 其他模板数据
  }

  // 创建工作簿
  const wb = XLSX.utils.book_new()
  
  // 创建基本信息工作表
  const wsBasic = XLSX.utils.json_to_sheet([templateData.basic])
  XLSX.utils.book_append_sheet(wb, wsBasic, '基本信息')
  
  // 创建面料信息工作表
  const wsUpholstery = XLSX.utils.json_to_sheet([templateData.upholstery])
  XLSX.utils.book_append_sheet(wb, wsUpholstery, '面料信息')
  
  // 下载文件
  XLSX.writeFile(wb, '产品信息导入模板.xlsx')
}
</script>

<style scoped>
.form-container {
  min-height: 400px;
}
</style> 