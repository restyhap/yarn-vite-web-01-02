<!--
 * @Author: resty restyhap@hotmail.com
 * @Date: 2025-01-15 11:34:14
 * @LastEditors: resty restyhap@hotmail.com
 * @LastEditTime: 2025-01-16 07:27:40
 * @FilePath: /yarn-vite-web-01-02/src/views/index/prod/Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="info-container h-screen overflow-hidden">
    <div class="info-content h-full overflow-y-auto">
      <div class="p-8">
        <div class="bg-white rounded-lg shadow">
          <!-- 顶部操作区 -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <el-button @click="handleBack" class="!px-3">
              <el-icon class="mr-1"><Back /></el-icon>
              返回列表
            </el-button>
            <el-button type="primary" @click="handleExportWord">
              <el-icon class="mr-1"><Document /></el-icon>
              导出Word文档
            </el-button>
          </div>

          <div class="p-6">
            <!-- 基本信息 (tb_products) -->
            <div class="table-section">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold">基本信息</h3>
                <div class="flex gap-2">
                  <template v-if="editingSection === 'basic'">
                    <el-button type="success" size="small" @click="handleSave('basic')">
                      <el-icon class="mr-1"><Check /></el-icon>保存
                    </el-button>
                    <el-button size="small" @click="handleCancel('basic')">
                      <el-icon class="mr-1"><Close /></el-icon>取消
                    </el-button>
                  </template>
                  <el-button v-else type="primary" size="small" @click="handleEdit('basic')">
                    <el-icon class="mr-1"><Edit /></el-icon>编辑
                  </el-button>
                </div>
              </div>
              <div class="mt-4">
                <el-form v-if="editingSection === 'basic'" :model="editForm.basic" label-width="120px">
                  <el-form-item label="产品代码">
                    <el-input v-model="editForm.basic.tccode" />
                  </el-form-item>
                  <el-form-item label="供应商">
                    <el-input v-model="editForm.basic.supplier" />
                  </el-form-item>
                  <el-form-item label="供应商代码">
                    <el-input v-model="editForm.basic.supplier_code" />
                  </el-form-item>
                  <el-form-item label="供应商名称">
                    <el-input v-model="editForm.basic.supplier_name" />
                  </el-form-item>
                  <el-form-item label="防火标准">
                    <el-input v-model="editForm.basic.fire_standard" />
                  </el-form-item>
                  <el-form-item label="发货港口">
                    <el-input v-model="editForm.basic.shipping_port" />
                  </el-form-item>
                  <el-form-item label="20尺柜FOB价格">
                    <el-input v-model="editForm.basic.fob_20_container_price" type="number" />
                  </el-form-item>
                  <el-form-item label="40尺柜FOB价格">
                    <el-input v-model="editForm.basic.fob_40_container_price" type="number" />
                  </el-form-item>
                </el-form>
                <el-descriptions v-else :column="3" border>
                  <el-descriptions-item label="产品代码">{{ productInfo.value.tccode }}</el-descriptions-item>
                  <el-descriptions-item label="供应商">{{ productInfo.value.supplier }}</el-descriptions-item>
                  <el-descriptions-item label="供应商代码">{{ productInfo.value.supplier_code }}</el-descriptions-item>
                  <el-descriptions-item label="供应商名称">{{ productInfo.value.supplier_name }}</el-descriptions-item>
                  <el-descriptions-item label="防火标准">{{ productInfo.value.fire_standard }}</el-descriptions-item>
                  <el-descriptions-item label="发货港口">{{ productInfo.value.shipping_port }}</el-descriptions-item>
                  <el-descriptions-item label="20尺柜FOB价格">¥{{ productInfo.value.fob_20_container_price }}</el-descriptions-item>
                  <el-descriptions-item label="40尺柜FOB价格">¥{{ productInfo.value.fob_40_container_price }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>

              <!-- 度量单位说明 -->
              <div class="text-center my-4">
                <p class="text-gray-700 font-medium mb-2">ALL MEASUREMENTS ARE TO BE IN MILLIMETRE'S (MM) AND WEIGHTS IN KILOGRAMS (KG)</p>
                <p class="text-gray-700 font-medium">All Details to be completed fully</p>
              </div>

              <!-- 面料信息 (tb_upholstery) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">面料信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'upholstery'">
                      <el-button type="success" size="small" @click="handleSave('upholstery')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('upholstery')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('upholstery')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'upholstery'" :model="editForm.upholstery" label-width="120px">
                    <el-form-item label="面料制造商">
                      <el-input v-model="editForm.upholstery.fabric_manufacturer" />
                    </el-form-item>
                    <el-form-item label="颜色代码">
                      <el-input v-model="editForm.upholstery.colour_code" />
                    </el-form-item>
                    <el-form-item label="皮革等级">
                      <el-input v-model="editForm.upholstery.leather_grade" />
                    </el-form-item>
                    <el-form-item label="每把椅子用料">
                      <el-input v-model="editForm.upholstery.usage_per_chair" suffix="m²" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="面料制造商">{{ specTables.value.upholstery?.fabric_manufacturer }}</el-descriptions-item>
                    <el-descriptions-item label="颜色代码">{{ specTables.value.upholstery?.colour_code }}</el-descriptions-item>
                    <el-descriptions-item label="皮革等级">{{ specTables.value.upholstery?.leather_grade }}</el-descriptions-item>
                    <el-descriptions-item label="每把椅子用料">{{ specTables.value.upholstery?.usage_per_chair }}m²</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 包装信息 (tb_carton_details) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">包装信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'carton'">
                      <el-button type="success" size="small" @click="handleSave('carton')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('carton')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('carton')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'carton'" :model="editForm.carton" label-width="120px">
                    <el-form-item label="包装箱宽度">
                      <el-input v-model="editForm.carton.width" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="包装箱深度">
                      <el-input v-model="editForm.carton.depth" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="包装箱高度">
                      <el-input v-model="editForm.carton.height" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="纸板类型">
                      <el-input v-model="editForm.carton.board_type" />
                    </el-form-item>
                    <el-form-item label="每箱数量">
                      <el-input v-model="editForm.carton.items_per_carton" suffix="件" />
                    </el-form-item>
                    <el-form-item label="箱体体积">
                      <el-input v-model="editForm.carton.carton_volume" suffix="m³" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="包装箱宽度">{{ specTables.value.carton?.width }}mm</el-descriptions-item>
                    <el-descriptions-item label="包装箱深度">{{ specTables.value.carton?.depth }}mm</el-descriptions-item>
                    <el-descriptions-item label="包装箱高度">{{ specTables.value.carton?.height }}mm</el-descriptions-item>
                    <el-descriptions-item label="纸板类型">{{ specTables.value.carton?.board_type }}</el-descriptions-item>
                    <el-descriptions-item label="每箱数量">{{ specTables.value.carton?.items_per_carton }}件</el-descriptions-item>
                    <el-descriptions-item label="箱体体积">{{ specTables.value.carton?.carton_volume }}m³</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 生产和物流信息 (tb_production_logistics) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">生产和物流信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'logistics'">
                      <el-button type="success" size="small" @click="handleSave('logistics')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('logistics')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('logistics')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'logistics'" :model="editForm.logistics" label-width="120px">
                    <el-form-item label="生产时间">
                      <el-input v-model="editForm.logistics.production_time" suffix="天" />
                    </el-form-item>
                    <el-form-item label="有效体积">
                      <el-input v-model="editForm.logistics.effective_volume" suffix="m³" />
                    </el-form-item>
                    <el-form-item label="20尺标准柜装载数量">
                      <el-input v-model="editForm.logistics.loading_quantity_20gp" suffix="件" />
                    </el-form-item>
                    <el-form-item label="40尺高柜装载数量">
                      <el-input v-model="editForm.logistics.loading_quantity_40hc" suffix="件" />
                    </el-form-item>
                    <el-form-item label="净重">
                      <el-input v-model="editForm.logistics.net_weight" suffix="kg" />
                    </el-form-item>
                    <el-form-item label="毛重">
                      <el-input v-model="editForm.logistics.gross_weight" suffix="kg" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="生产时间">{{ specTables.value.logistics?.production_time }}天</el-descriptions-item>
                    <el-descriptions-item label="有效体积">{{ specTables.value.logistics?.effective_volume }}m³</el-descriptions-item>
                    <el-descriptions-item label="20尺标准柜装载数量">{{ specTables.value.logistics?.loading_quantity_20gp }}件</el-descriptions-item>
                    <el-descriptions-item label="40尺高柜装载数量">{{ specTables.value.logistics?.loading_quantity_40hc }}件</el-descriptions-item>
                    <el-descriptions-item label="净重">{{ specTables.value.logistics?.net_weight }}kg</el-descriptions-item>
                    <el-descriptions-item label="毛重">{{ specTables.value.logistics?.gross_weight }}kg</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 产品尺寸 (tb_product_dimensions) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">产品尺寸</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'dimensions'">
                      <el-button type="success" size="small" @click="handleSave('dimensions')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('dimensions')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('dimensions')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'dimensions'" :model="editForm.dimensions" label-width="120px">
                    <el-form-item label="座位宽度">
                      <el-input v-model="editForm.dimensions.seat_width" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="座位深度">
                      <el-input v-model="editForm.dimensions.seat_depth" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="座位最小高度">
                      <el-input v-model="editForm.dimensions.seat_height_min" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="座位最大高度">
                      <el-input v-model="editForm.dimensions.seat_height_max" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="靠背宽度">
                      <el-input v-model="editForm.dimensions.back_width" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="靠背高度">
                      <el-input v-model="editForm.dimensions.back_height" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="靠背距座面高度">
                      <el-input v-model="editForm.dimensions.back_height_from_seat" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="整体宽度">
                      <el-input v-model="editForm.dimensions.overall_width" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="整体深度">
                      <el-input v-model="editForm.dimensions.overall_depth" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="整体最小高度">
                      <el-input v-model="editForm.dimensions.overall_height_min" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="整体最大高度">
                      <el-input v-model="editForm.dimensions.overall_height_max" suffix="mm" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="座位宽度">{{ specTables.value.dimensions?.seat_width }}mm</el-descriptions-item>
                    <el-descriptions-item label="座位深度">{{ specTables.value.dimensions?.seat_depth }}mm</el-descriptions-item>
                    <el-descriptions-item label="座位最小高度">{{ specTables.value.dimensions?.seat_height_min }}mm</el-descriptions-item>
                    <el-descriptions-item label="座位最大高度">{{ specTables.value.dimensions?.seat_height_max }}mm</el-descriptions-item>
                    <el-descriptions-item label="靠背宽度">{{ specTables.value.dimensions?.back_width }}mm</el-descriptions-item>
                    <el-descriptions-item label="靠背高度">{{ specTables.value.dimensions?.back_height }}mm</el-descriptions-item>
                    <el-descriptions-item label="靠背距座面高度">{{ specTables.value.dimensions?.back_height_from_seat }}mm</el-descriptions-item>
                    <el-descriptions-item label="整体宽度">{{ specTables.value.dimensions?.overall_width }}mm</el-descriptions-item>
                    <el-descriptions-item label="整体深度">{{ specTables.value.dimensions?.overall_depth }}mm</el-descriptions-item>
                    <el-descriptions-item label="整体最小高度">{{ specTables.value.dimensions?.overall_height_min }}mm</el-descriptions-item>
                    <el-descriptions-item label="整体最大高度">{{ specTables.value.dimensions?.overall_height_max }}mm</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 座椅内部结构 (tb_seat_inner_components) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">座椅内部结构</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'seatInner'">
                      <el-button type="success" size="small" @click="handleSave('seatInner')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('seatInner')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('seatInner')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'seatInner'" :model="editForm.seatInner" label-width="120px">
                    <el-form-item label="材料代码">
                      <el-input v-model="editForm.seatInner.material_code" />
                    </el-form-item>
                    <el-form-item label="厚度">
                      <el-input v-model="editForm.seatInner.thickness" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="层数">
                      <el-input v-model="editForm.seatInner.layers_count" suffix="层" />
                    </el-form-item>
                    <el-form-item label="尺寸规格">
                      <el-input v-model="editForm.seatInner.dimensions" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="材料代码">{{ specTables.value.seatInner?.material_code }}</el-descriptions-item>
                    <el-descriptions-item label="厚度">{{ specTables.value.seatInner?.thickness }}mm</el-descriptions-item>
                    <el-descriptions-item label="层数">{{ specTables.value.seatInner?.layers_count }}层</el-descriptions-item>
                    <el-descriptions-item label="尺寸规格">{{ specTables.value.seatInner?.dimensions }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 背部内部结构 (tb_back_inner_components) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">背部内部结构</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'backInner'">
                      <el-button type="success" size="small" @click="handleSave('backInner')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('backInner')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('backInner')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'backInner'" :model="editForm.backInner" label-width="120px">
                    <el-form-item label="材料代码">
                      <el-input v-model="editForm.backInner.material_code" />
                    </el-form-item>
                    <el-form-item label="厚度">
                      <el-input v-model="editForm.backInner.thickness" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="层数">
                      <el-input v-model="editForm.backInner.layers_count" suffix="层" />
                    </el-form-item>
                    <el-form-item label="尺寸规格">
                      <el-input v-model="editForm.backInner.dimensions" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="材料代码">{{ specTables.value.backInner?.material_code }}</el-descriptions-item>
                    <el-descriptions-item label="厚度">{{ specTables.value.backInner?.thickness }}mm</el-descriptions-item>
                    <el-descriptions-item label="层数">{{ specTables.value.backInner?.layers_count }}层</el-descriptions-item>
                    <el-descriptions-item label="尺寸规格">{{ specTables.value.backInner?.dimensions }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 背部外部结构 (tb_back_outer_components) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">背部外部结构</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'backOuter'">
                      <el-button type="success" size="small" @click="handleSave('backOuter')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('backOuter')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('backOuter')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'backOuter'" :model="editForm.backOuter" label-width="120px">
                    <el-form-item label="材料">
                      <el-input v-model="editForm.backOuter.material" />
                    </el-form-item>
                    <el-form-item label="尺寸">
                      <el-input v-model="editForm.backOuter.dimensions" />
                    </el-form-item>
                    <el-form-item label="制造商名称">
                      <el-input v-model="editForm.backOuter.manufacturer_name" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="材料">{{ specTables.value.backOuter?.material }}</el-descriptions-item>
                    <el-descriptions-item label="尺寸">{{ specTables.value.backOuter?.dimensions }}</el-descriptions-item>
                    <el-descriptions-item label="制造商名称">{{ specTables.value.backOuter?.manufacturer_name }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 座椅外部结构 (tb_seat_outer_components) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">座椅外部结构</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'seatOuter'">
                      <el-button type="success" size="small" @click="handleSave('seatOuter')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('seatOuter')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('seatOuter')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'seatOuter'" :model="editForm.seatOuter" label-width="120px">
                    <el-form-item label="材料">
                      <el-input v-model="editForm.seatOuter.material" />
                    </el-form-item>
                    <el-form-item label="尺寸">
                      <el-input v-model="editForm.seatOuter.dimensions" />
                    </el-form-item>
                    <el-form-item label="制造商名称">
                      <el-input v-model="editForm.seatOuter.manufacturer_name" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="材料">{{ specTables.value.seatOuter?.material }}</el-descriptions-item>
                    <el-descriptions-item label="尺寸">{{ specTables.value.seatOuter?.dimensions }}</el-descriptions-item>
                    <el-descriptions-item label="制造商名称">{{ specTables.value.seatOuter?.manufacturer_name }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 扶手信息 (tb_arms) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">扶手信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'arms'">
                      <el-button type="success" size="small" @click="handleSave('arms')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('arms')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('arms')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'arms'" :model="editForm.arms" label-width="120px">
                    <el-form-item label="材料">
                      <el-input v-model="editForm.arms.material" />
                    </el-form-item>
                    <el-form-item label="类型">
                      <el-input v-model="editForm.arms.type" />
                    </el-form-item>
                    <el-form-item label="制造商">
                      <el-input v-model="editForm.arms.manufacturer" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input v-model="editForm.arms.description" />
                    </el-form-item>
                    <el-form-item label="扶手距座面高度">
                      <el-input v-model="editForm.arms.arm_height_from_seat" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="扶手距地面高度">
                      <el-input v-model="editForm.arms.arm_height_from_floor" suffix="mm" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="材料">{{ specTables.value.arms?.material }}</el-descriptions-item>
                    <el-descriptions-item label="类型">{{ specTables.value.arms?.type }}</el-descriptions-item>
                    <el-descriptions-item label="制造商">{{ specTables.value.arms?.manufacturer }}</el-descriptions-item>
                    <el-descriptions-item label="描述">{{ specTables.value.arms?.description }}</el-descriptions-item>
                    <el-descriptions-item label="扶手距座面高度">{{ specTables.value.arms?.arm_height_from_seat }}mm</el-descriptions-item>
                    <el-descriptions-item label="扶手距地面高度">{{ specTables.value.arms?.arm_height_from_floor }}mm</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 泡棉信息 (tb_foam_details) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">泡棉信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'foam'">
                      <el-button type="success" size="small" @click="handleSave('foam')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('foam')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('foam')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'foam'" :model="editForm.foam" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.foam.description" />
                    </el-form-item>
                    <el-form-item label="座椅密度">
                      <el-input v-model="editForm.foam.seat_density" suffix="kg/m³" />
                    </el-form-item>
                    <el-form-item label="靠背密度">
                      <el-input v-model="editForm.foam.back_density" suffix="kg/m³" />
                    </el-form-item>
                    <el-form-item label="座椅厚度">
                      <el-input v-model="editForm.foam.seat_thickness" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="靠背厚度">
                      <el-input v-model="editForm.foam.back_thickness" suffix="mm" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.foam?.description }}</el-descriptions-item>
                    <el-descriptions-item label="座椅密度">{{ specTables.value.foam?.seat_density }}kg/m³</el-descriptions-item>
                    <el-descriptions-item label="靠背密度">{{ specTables.value.foam?.back_density }}kg/m³</el-descriptions-item>
                    <el-descriptions-item label="座椅厚度">{{ specTables.value.foam?.seat_thickness }}mm</el-descriptions-item>
                    <el-descriptions-item label="靠背厚度">{{ specTables.value.foam?.back_thickness }}mm</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 脚轮信息 (tb_castors) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">脚轮信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'castors'">
                      <el-button type="success" size="small" @click="handleSave('castors')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('castors')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('castors')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'castors'" :model="editForm.castors" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.castors.description" />
                    </el-form-item>
                    <el-form-item label="销轴直径">
                      <el-input v-model="editForm.castors.pin_thickness" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="轮子直径">
                      <el-input v-model="editForm.castors.wheel_diameter" suffix="mm" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.castors?.description }}</el-descriptions-item>
                    <el-descriptions-item label="销轴直径">{{ specTables.value.castors?.pin_thickness }}mm</el-descriptions-item>
                    <el-descriptions-item label="轮子直径">{{ specTables.value.castors?.wheel_diameter }}mm</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 底座信息 (tb_base) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">底座信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'base'">
                      <el-button type="success" size="small" @click="handleSave('base')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('base')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('base')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'base'" :model="editForm.base" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.base.description" />
                    </el-form-item>
                    <el-form-item label="底盘直径">
                      <el-input v-model="editForm.base.size_diameter" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="材料">
                      <el-input v-model="editForm.base.material" />
                    </el-form-item>
                    <el-form-item label="类型">
                      <el-input v-model="editForm.base.type" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.base?.description }}</el-descriptions-item>
                    <el-descriptions-item label="底盘直径">{{ specTables.value.base?.size_diameter }}mm</el-descriptions-item>
                    <el-descriptions-item label="材料">{{ specTables.value.base?.material }}</el-descriptions-item>
                    <el-descriptions-item label="类型">{{ specTables.value.base?.type }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 气压棒信息 (tb_gas_lift) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">气压棒信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'gasLift'">
                      <el-button type="success" size="small" @click="handleSave('gasLift')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('gasLift')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('gasLift')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'gasLift'" :model="editForm.gasLift" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.gasLift.description" />
                    </el-form-item>
                    <el-form-item label="气压等级">
                      <el-input v-model="editForm.gasLift.gas_lift_class" />
                    </el-form-item>
                    <el-form-item label="外管长度">
                      <el-input v-model="editForm.gasLift.casing_length" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="行程">
                      <el-input v-model="editForm.gasLift.extension_size" suffix="mm" />
                    </el-form-item>
                    <el-form-item label="锥度">
                      <el-input v-model="editForm.gasLift.taper" suffix="mm" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.gasLift?.description }}</el-descriptions-item>
                    <el-descriptions-item label="气压等级">{{ specTables.value.gasLift?.gas_lift_class }}</el-descriptions-item>
                    <el-descriptions-item label="外管长度">{{ specTables.value.gasLift?.casing_length }}mm</el-descriptions-item>
                    <el-descriptions-item label="行程">{{ specTables.value.gasLift?.extension_size }}mm</el-descriptions-item>
                    <el-descriptions-item label="锥度">{{ specTables.value.gasLift?.taper }}mm</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 气压罩信息 (tb_gas_lift_cover) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">气压罩信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'gasLiftCover'">
                      <el-button type="success" size="small" @click="handleSave('gasLiftCover')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('gasLiftCover')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('gasLiftCover')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'gasLiftCover'" :model="editForm.gasLiftCover" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.gasLiftCover.description" />
                    </el-form-item>
                    <el-form-item label="材料">
                      <el-input v-model="editForm.gasLiftCover.material" />
                    </el-form-item>
                    <el-form-item label="颜色">
                      <el-input v-model="editForm.gasLiftCover.colour" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.gasLiftCover?.description }}</el-descriptions-item>
                    <el-descriptions-item label="材料">{{ specTables.value.gasLiftCover?.material }}</el-descriptions-item>
                    <el-descriptions-item label="颜色">{{ specTables.value.gasLiftCover?.colour }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 机构信息 (tb_mechanism) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">机构信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'mechanism'">
                      <el-button type="success" size="small" @click="handleSave('mechanism')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('mechanism')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('mechanism')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'mechanism'" :model="editForm.mechanism" label-width="120px">
                    <el-form-item label="描述">
                      <el-input v-model="editForm.mechanism.description" />
                    </el-form-item>
                    <el-form-item label="手柄数量">
                      <el-input v-model="editForm.mechanism.levers_count" suffix="个" />
                    </el-form-item>
                    <el-form-item label="锁定位置">
                      <el-input v-model="editForm.mechanism.locking_positions" />
                    </el-form-item>
                    <el-form-item label="型号">
                      <el-input v-model="editForm.mechanism.model_no" />
                    </el-form-item>
                    <el-form-item label="机构供应商">
                      <el-input v-model="editForm.mechanism.supplier_name" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="描述">{{ specTables.value.mechanism?.description }}</el-descriptions-item>
                    <el-descriptions-item label="手柄数量">{{ specTables.value.mechanism?.levers_count }}</el-descriptions-item>
                    <el-descriptions-item label="锁定位置">{{ specTables.value.mechanism?.locking_positions }}</el-descriptions-item>
                    <el-descriptions-item label="型号">{{ specTables.value.mechanism?.model_no }}</el-descriptions-item>
                    <el-descriptions-item label="机构供应商">{{ specTables.value.mechanism?.supplier_name }}</el-descriptions-item>
                  </el-descriptions>
                </div>
              </div>

              <!-- 配件信息 (tb_fittings) -->
              <div class="table-section">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold">配件信息</h3>
                  <div class="flex gap-2">
                    <template v-if="editingSection === 'fittings'">
                      <el-button type="success" size="small" @click="handleSave('fittings')">
                        <el-icon class="mr-1"><Check /></el-icon>保存
                      </el-button>
                      <el-button size="small" @click="handleCancel('fittings')">
                        <el-icon class="mr-1"><Close /></el-icon>取消
                      </el-button>
                    </template>
                    <el-button v-else type="primary" size="small" @click="handleEdit('fittings')">
                      <el-icon class="mr-1"><Edit /></el-icon>编辑
                    </el-button>
                  </div>
                </div>
                <div class="mt-4">
                  <el-form v-if="editingSection === 'fittings'" :model="editForm.fittings" label-width="120px">
                    <el-form-item label="配件编号">
                      <el-input v-model="editForm.fittings.fitting_number" />
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input v-model="editForm.fittings.description" />
                    </el-form-item>
                    <el-form-item label="数量">
                      <el-input v-model="editForm.fittings.quantity" suffix="个" />
                    </el-form-item>
                    <el-form-item label="材料">
                      <el-input v-model="editForm.fittings.material" />
                    </el-form-item>
                  </el-form>
                  <el-descriptions v-else :column="3" border>
                    <el-descriptions-item label="配件编号">{{ specTables.value.fittings?.fitting_number }}</el-descriptions-item>
                    <el-descriptions-item label="描述">{{ specTables.value.fittings?.description }}</el-descriptions-item>
                    <el-descriptions-item label="数量">{{ specTables.value.fittings?.quantity }}</el-descriptions-item>
                    <el-descriptions-item label="材料">{{ specTables.value.fittings?.material }}</el-descriptions-item>
                  </el-descriptions>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Back, Document, Edit, Check, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Document as DocxDocument, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, VerticalAlign } from 'docx'
import { saveAs } from 'file-saver'

const route = useRoute()
const router = useRouter()
const productInfo = ref<any>({})
const specTables = ref<any>({})
const editingSection = ref('')  // 当前正在编辑的部分
const editForm = ref<any>({})   // 编辑表单数据

// 定义所有表格的配置
const sections = [
  {
    key: 'upholstery',
    title: '面料信息',
    fields: [
      { key: 'fabric_manufacturer', label: '面料制造商' },
      { key: 'colour_code', label: '颜色代码' },
      { key: 'leather_grade', label: '皮革等级' },
      { key: 'usage_per_chair', label: '每把椅子用料', unit: 'm²' }
    ]
  },
  // ... 其他表格配置
]

// 开始编辑
const handleEdit = (section: string) => {
  editingSection.value = section
  // 深拷贝当前数据到编辑表单
  editForm.value[section] = JSON.parse(JSON.stringify(
    section === 'basic' ? productInfo.value : specTables.value[section]
  ))
}

// 保存编辑
const handleSave = async (section: string) => {
  try {
    // TODO: 调用API保存数据
    const formData = editForm.value[section]
    console.log('保存的数据:', formData)
    
    // 更新本地数据
    if (section === 'basic') {
      productInfo.value = { ...formData }
    } else {
      specTables.value[section] = { ...formData }
    }
    
    editingSection.value = ''
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 取消编辑
const handleCancel = (section: string) => {
  editingSection.value = ''
  editForm.value[section] = null
}

// 获取产品信息
const fetchProductInfo = async () => {
  try {
    // TODO: 这里应该调用实际的API获取数据
    // 目前使用模拟数据
    productInfo.value = {
      id: route.params.id,
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
      seatInner: {
        material_code: 'SI001',
        thickness: 50,
        layers_count: 3,
        dimensions: '500x480mm'
      },
      backInner: {
        material_code: 'BI001',
        thickness: 40,
        layers_count: 2,
        dimensions: '460x560mm'
      },
      backOuter: {
        material: '尼龙网布',
        dimensions: '460x560mm',
        manufacturer_name: '网布制造商A'
      },
      seatOuter: {
        material: '尼龙网布',
        dimensions: '500x480mm',
        manufacturer_name: '网布制造商A'
      },
      arms: {
        material: '尼龙PA6',
        type: '可调节扶手',
        manufacturer: '扶手制造商A',
        description: '3D调节扶手',
        arm_height_from_seat: 180,
        arm_height_from_floor: 600
      },
      foam: {
        description: '高密度定型海绵',
        seat_density: 55,
        back_density: 45,
        seat_thickness: 60,
        back_thickness: 50
      },
      castors: {
        description: '尼龙万向轮',
        pin_thickness: 11,
        wheel_diameter: 60
      },
      base: {
        description: '尼龙五星脚',
        size_diameter: 680,
        material: '尼龙PA6+GF',
        type: '五星脚'
      },
      gasLift: {
        description: '黑色气压棒',
        gas_lift_class: '4级',
        casing_length: 500,
        extension_size: 100,
        taper: 28
      },
      gasLiftCover: {
        description: '伸缩套管',
        material: 'PP',
        colour: '黑色'
      },
      mechanism: {
        description: '底盘机构',
        levers_count: 3,
        locking_positions: '多档位',
        model_no: 'M001',
        supplier_name: '机构制造商A'
      },
      fittings: {
        fitting_number: 'F001',
        description: '螺丝套件',
        quantity: 12,
        material: '碳钢'
      }
    }

    // 如果是从编辑按钮跳转来的，自动进入基本信息的编辑状态
    if (route.query.edit === 'true') {
      handleEdit('basic')
    }

    console.log('加载的产品信息:', productInfo.value)
    console.log('加载的规格表信息:', specTables.value)
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
    ElMessage.success('文档导出中...')
    
    // 创建文档
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: [
          // 标题
          new Paragraph({
            text: 'FULL PRODUCT SPECIFICATION SHEET ( 包装信息表 )',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // 度量单位说明
          new Paragraph({
            text: 'ALL MEASUREMENTS ARE TO BE IN MILLIMETRE\'S (MM) AND WEIGHTS IN KILOGRAMS (KG)',
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }),

          // 提示信息
          new Paragraph({
            text: 'All Details to be completed fully',
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 }
          }),

          // 基本信息表格
          new Table({
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('TCCODE')],
                  }),
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph(productInfo.value.tccode || 'N/A')],
                  }),
                ],
              }),
              ...['SUPPLIER', 'SUPPLIER CODE', 'SUPPLIER NAME', 'FIRE STANDARD', 'FOB 20\' CONTAINER PRICE', 'FOB 40\'HC CONTAINER PRICE', 'SHIPPING PORT'].map(label => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: 'pct' },
                      children: [new Paragraph(label)],
                    }),
                    new TableCell({
                      width: { size: 50, type: 'pct' },
                      children: [new Paragraph(
                        label.includes('PRICE') 
                          ? (productInfo.value[label.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')] ? `¥${productInfo.value[label.toLowerCase().replace(/['\s]/g, '_').replace('hc', 'h').replace('fob_', 'fob_')]}` : 'N/A')
                          : (productInfo.value[label.toLowerCase().replace(/\s/g, '_')] || 'N/A')
                      )],
                    }),
                  ],
                })
              ),
            ],
          }),

          // 面料信息表格（保持原样）
          new Table({
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: 'pct' },
                    rowSpan: 4,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({ 
                      text: 'UPHOLSTERY',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: "FFFFFF" },
                  }),
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('FABRIC MANUFACTURER')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(specTables.value.upholstery?.fabric_manufacturer || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('COLOUR CODE')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(specTables.value.upholstery?.colour_code || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('LEATHER GRADE (WHERE APPLICABLE)')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(specTables.value.upholstery?.leather_grade || 'N/A')],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('USAGE PER CHAIR (BACK/SEAT)')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(`${specTables.value.upholstery?.usage_per_chair || 'N/A'}m²`)],
                  }),
                ],
              }),
            ],
          }),

          // 包装信息表格
          new Table({
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: 'pct' },
                    rowSpan: 6,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({ 
                      text: 'CARTON',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: "FFFFFF" },
                  }),
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('WIDTH')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(`${specTables.value.carton?.width || 'N/A'}mm`)],
                  }),
                ],
              }),
              ...['DEPTH', 'HEIGHT', 'BOARD TYPE', 'ITEMS PER CARTON', 'CARTON VOLUME'].map(label => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: 'pct' },
                      children: [new Paragraph(label)],
                    }),
                    new TableCell({
                      width: { size: 30, type: 'pct' },
                      children: [new Paragraph(
                        label === 'CARTON VOLUME'
                          ? `${specTables.value.carton?.carton_volume || 'N/A'}m³`
                          : label === 'ITEMS PER CARTON'
                          ? `${specTables.value.carton?.items_per_carton || 'N/A'}pc`
                          : label.includes('WIDTH') || label.includes('DEPTH') || label.includes('HEIGHT')
                          ? `${specTables.value.carton?.[label.toLowerCase()] || 'N/A'}mm`
                          : (specTables.value.carton?.[label.toLowerCase().replace(/\s/g, '_')] || 'N/A')
                      )],
                    }),
                  ],
                })
              ),
            ],
          }),

          // 产品信息表格
          new Table({
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: 'pct' },
                    rowSpan: 6,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({ 
            text: 'PRODUCT',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: "FFFFFF" },
                  }),
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('PRODUCTION TIME (DAYS)')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(`${specTables.value.logistics?.production_time || 'N/A'}days`)],
                  }),
                ],
              }),
              ...['EFFECTIVE VOLUME', 'LOADING QUANTITY 20\'GP', 'LOADING QUANTITY 40\'HC', 'NET WEIGHT', 'GROSS WEIGHT'].map(label => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: 'pct' },
                      children: [new Paragraph(label)],
                    }),
                    new TableCell({
                      width: { size: 30, type: 'pct' },
                      children: [new Paragraph(
                        label === 'EFFECTIVE VOLUME'
                          ? `${specTables.value.logistics?.effective_volume || 'N/A'}m³`
                          : label.includes('WEIGHT')
                          ? `${specTables.value.logistics?.[label.toLowerCase().replace(/\s/g, '_')] || 'N/A'}kg`
                          : (specTables.value.logistics?.[label.toLowerCase().replace(/['\s]/g, '_')] || 'N/A')
                      )],
                    }),
                  ],
                })
              ),
            ],
          }),

          // 产品尺寸表格
          new Table({
            width: { size: 100, type: 'pct' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: 'pct' },
                    rowSpan: 5,
                    verticalAlign: VerticalAlign.CENTER,
                    children: [new Paragraph({ 
                      text: 'DIMENSIONS',
                      alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: "FFFFFF" },
                  }),
                  new TableCell({
                    width: { size: 50, type: 'pct' },
                    children: [new Paragraph('SEAT')],
                  }),
                  new TableCell({
                    width: { size: 30, type: 'pct' },
                    children: [new Paragraph(`WIDTH: ${specTables.value.dimensions?.seat_width || 'N/A'}mm DEPTH: ${specTables.value.dimensions?.seat_depth || 'N/A'}mm`)],
                  }),
                ],
              }),
              ...['BACK', 'SEAT HEIGHT', 'BACK HEIGHT FROM SEAT', 'OVERALL'].map(label => 
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 50, type: 'pct' },
                      children: [new Paragraph(label)],
                    }),
                    new TableCell({
                      width: { size: 30, type: 'pct' },
                      children: [new Paragraph(
                        label === 'BACK'
                          ? `WIDTH: ${specTables.value.dimensions?.back_width || 'N/A'}mm HEIGHT: ${specTables.value.dimensions?.back_height || 'N/A'}mm`
                          : label === 'SEAT HEIGHT'
                          ? `MIN: ${specTables.value.dimensions?.seat_height_min || 'N/A'}mm MAX: ${specTables.value.dimensions?.seat_height_max || 'N/A'}mm`
                          : label === 'BACK HEIGHT FROM SEAT'
                          ? `${specTables.value.dimensions?.back_height_from_seat || 'N/A'}mm`
                          : label === 'OVERALL'
                          ? `WIDTH: ${specTables.value.dimensions?.overall_width || 'N/A'}mm DEPTH: ${specTables.value.dimensions?.overall_depth || 'N/A'}mm HEIGHT: ${specTables.value.dimensions?.overall_height_min || 'N/A'}-${specTables.value.dimensions?.overall_height_max || 'N/A'}mm`
                          : 'N/A'
                      )],
                    }),
                  ],
                })
              ),
            ],
          }),
        ]
      }]
    })

    // 生成文档并下载
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, `PRODUCT_SPECIFICATION_${productInfo.value.tccode}_${new Date().toISOString().split('T')[0]}.docx`)
    
    ElMessage.success('文档导出成功')
  } catch (error) {
    console.error('导出文档失败:', error)
    ElMessage.error('导出文档失败')
  }
}

// 创建表格的辅助函数
const createTable = (data: string[][]) => {
  return new Table({
    width: {
      size: 100,
      type: 'pct',
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' }
    },
    rows: data.map(row => 
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 40,
              type: 'pct',
            },
            children: [new Paragraph(row[0])],
            shading: {
              fill: "FFFFFF",
            },
          }),
          new TableCell({
            width: {
              size: 60,
              type: 'pct',
            },
            children: [new Paragraph(row[1])],
          }),
        ],
      })
    ),
  })
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    fetchProductInfo()
  }
})
</script>

<style scoped>
.info-container {
  position: relative;
  width: 100%;
  background-color: #f5f7fa;
}

.info-content {
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #909399 #f4f4f5;
}

.info-content::-webkit-scrollbar {
  width: 6px;
}

.info-content::-webkit-scrollbar-track {
  background: #f4f4f5;
}

.info-content::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.table-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fff;
}

.table-section:hover {
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.table-section h3 {
  color: #303133;
  margin-bottom: 1.5rem;
}

.el-descriptions {
  margin-bottom: 0;
}

/* 统一表单样式 */
.el-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.el-form-item {
  margin-bottom: 0;
}

/* 统一描述列表样式 */
:deep(.el-descriptions__body) {
  background-color: #ffffff;
}

:deep(.el-descriptions__cell) {
  width: calc(100% / 3);
  min-width: 0;
}

:deep(.el-descriptions__label) {
  width: 160px;
  min-width: 160px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
  background-color: #f5f7fa !important;
  border-right: 1px solid #ebeef5;
}

:deep(.el-descriptions__content) {
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1rem;
  width: calc(100% - 160px);
  background-color: #ffffff !important;
  font-weight: 500;
}

:deep(.el-descriptions__table) {
  table-layout: fixed;
  width: 100%;
  border: 1px solid #ebeef5;
}

:deep(.el-descriptions__cell.is-bordered-content) {
  min-width: 0;
  background-color: #ffffff !important;
}

:deep(.el-descriptions__cell.is-bordered-label) {
  width: 160px;
  min-width: 160px;
  background-color: #f5f7fa !important;
}

/* 鼠标悬停效果 */
:deep(.el-descriptions__cell.is-bordered-content:hover) {
  background-color: #fafafa !important;
}

/* 顶部操作区样式 */
.mb-6 {
  margin-bottom: 2rem;
}

/* 编辑按钮组样式 */
.flex.gap-2 {
  gap: 0.5rem;
}

/* 表单输入框样式 */
:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.el-descriptions__table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.el-descriptions__cell.is-bordered-content) {
  min-width: 0;
}
</style>
