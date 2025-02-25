<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? '编辑产品' : '创建产品' }}</h2>
        <el-button @click="$router.back()">返回</el-button>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="max-w-3xl"
      >
        <el-form-item label="产品代码" prop="tccode">
          <el-input v-model="formData.tccode" placeholder="请输入产品代码" />
        </el-form-item>

        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="formData.supplier" placeholder="请输入供应商" />
        </el-form-item>

        <el-form-item label="供应商代码" prop="supplier_code">
          <el-input v-model="formData.supplier_code" placeholder="请输入供应商代码" />
        </el-form-item>

        <el-form-item label="供应商名称" prop="supplier_name">
          <el-input v-model="formData.supplier_name" placeholder="请输入供应商名称" />
        </el-form-item>

        <el-form-item label="防火标准" prop="fire_standard">
          <el-select v-model="formData.fire_standard" placeholder="请选择防火标准" class="w-full">
            <el-option label="BS 5852" value="BS 5852" />
            <el-option label="CAL TB 117" value="CAL TB 117" />
            <el-option label="16 CFR 1633" value="16 CFR 1633" />
            <el-option label="16 CFR 1632" value="16 CFR 1632" />
          </el-select>
        </el-form-item>

        <el-form-item label="20尺柜FOB价格" prop="fob_20_container_price">
          <el-input-number
            v-model="formData.fob_20_container_price"
            :precision="2"
            :step="100"
            :min="0"
            class="w-full"
            placeholder="请输入20尺柜FOB价格"
          />
        </el-form-item>

        <el-form-item label="40尺柜FOB价格" prop="fob_40_container_price">
          <el-input-number
            v-model="formData.fob_40_container_price"
            :precision="2"
            :step="100"
            :min="0"
            class="w-full"
            placeholder="请输入40尺柜FOB价格"
          />
        </el-form-item>

        <el-form-item label="发货港口" prop="shipping_port">
          <el-select v-model="formData.shipping_port" placeholder="请选择发货港口" class="w-full">
            <el-option label="宁波港" value="宁波港" />
            <el-option label="上海港" value="上海港" />
            <el-option label="深圳港" value="深圳港" />
            <el-option label="广州港" value="广州港" />
            <el-option label="青岛港" value="青岛港" />
            <el-option label="天津港" value="天津港" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

// 判断是否是编辑模式
const isEdit = ref(route.path.includes('/edit/'))

// 表单数据
const formData = ref({
  tccode: '',
  supplier: '',
  supplier_code: '',
  supplier_name: '',
  fire_standard: '',
  fob_20_container_price: 0,
  fob_40_container_price: 0,
  shipping_port: ''
})

// 表单验证规则
const rules = ref<FormRules>({
  tccode: [
    { required: true, message: '请输入产品代码', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  supplier: [
    { required: true, message: '请输入供应商', trigger: 'blur' }
  ],
  supplier_code: [
    { required: true, message: '请输入供应商代码', trigger: 'blur' }
  ],
  supplier_name: [
    { required: true, message: '请输入供应商名称', trigger: 'blur' }
  ],
  fire_standard: [
    { required: true, message: '请选择防火标准', trigger: 'change' }
  ],
  fob_20_container_price: [
    { required: true, message: '请输入20尺柜FOB价格', trigger: 'blur' }
  ],
  fob_40_container_price: [
    { required: true, message: '请输入40尺柜FOB价格', trigger: 'blur' }
  ],
  shipping_port: [
    { required: true, message: '请选择发货港口', trigger: 'change' }
  ]
})

// 获取编辑数据
const getEditData = async (id: string) => {
  try {
    // TODO: 调用获取详情API
    const mockData = {
      id: 1,
      tccode: 'TC001',
      supplier: '供应商A',
      supplier_code: 'SA001',
      supplier_name: '某某贸易有限公司',
      fire_standard: 'BS 5852',
      fob_20_container_price: 5000.00,
      fob_40_container_price: 9000.00,
      shipping_port: '宁波港'
    }
    formData.value = mockData
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('提交的数据:', formData.value)
      // TODO: 调用创建/编辑API
      ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
      router.push('/prod/list')
    }
  })
}

// 在编辑模式下获取数据
onMounted(() => {
  if (isEdit.value && route.params.id) {
    getEditData(route.params.id as string)
  }
})
</script> 