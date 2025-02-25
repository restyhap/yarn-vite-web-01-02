<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">创建报价单</h2>
        <el-button @click="$router.back()">返回</el-button>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="max-w-4xl"
      >
        <el-form-item label="报价单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入报价单名称" />
        </el-form-item>

        <el-form-item label="客户名称" prop="customer">
          <el-input v-model="formData.customer" placeholder="请输入客户名称" />
        </el-form-item>

        <el-form-item label="报价项目">
          <div class="border rounded-lg p-4 mb-4" v-for="(item, index) in formData.items" :key="index">
            <div class="flex justify-end mb-2">
              <el-button type="danger" link @click="removeItem(index)">删除</el-button>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <el-form-item :prop="'items.' + index + '.name'" :rules="{ required: true, message: '请输入项目名称', trigger: 'blur' }">
                <el-input v-model="item.name" placeholder="项目名称" />
              </el-form-item>
              
              <el-form-item :prop="'items.' + index + '.spec'" :rules="{ required: true, message: '请选择规格', trigger: 'change' }">
                <el-select v-model="item.spec" placeholder="选择规格">
                  <el-option v-for="spec in specOptions" :key="spec.value" :label="spec.label" :value="spec.value" />
                </el-select>
              </el-form-item>
            </div>

            <div class="grid grid-cols-3 gap-4 mt-4">
              <el-form-item :prop="'items.' + index + '.quantity'" :rules="{ required: true, message: '请输入数量', trigger: 'blur' }">
                <el-input-number v-model="item.quantity" :min="1" placeholder="数量" />
              </el-form-item>
              
              <el-form-item :prop="'items.' + index + '.price'" :rules="{ required: true, message: '请输入单价', trigger: 'blur' }">
                <el-input-number v-model="item.price" :min="0" :precision="2" placeholder="单价" />
              </el-form-item>
              
              <el-form-item label="小计">
                <span class="text-lg font-bold">¥{{ (item.quantity * item.price).toFixed(2) }}</span>
              </el-form-item>
            </div>
          </div>
          
          <el-button type="primary" @click="addItem">添加项目</el-button>
        </el-form-item>

        <el-form-item label="总金额">
          <span class="text-xl font-bold text-red-500">¥{{ totalAmount.toFixed(2) }}</span>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            rows="4"
            placeholder="请输入备注信息"
          />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()

// 规格选项（模拟数据）
const specOptions = [
  { value: 'spec1', label: '规格A' },
  { value: 'spec2', label: '规格B' },
  { value: 'spec3', label: '规格C' }
]

// 表单数据
const formData = ref({
  name: '',
  customer: '',
  items: [{
    name: '',
    spec: '',
    quantity: 1,
    price: 0
  }],
  remark: ''
})

// 计算总金额
const totalAmount = computed(() => {
  return formData.value.items.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)
})

// 表单验证规则
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入报价单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  customer: [
    { required: true, message: '请输入客户名称', trigger: 'blur' }
  ]
})

// 添加项目
const addItem = () => {
  formData.value.items.push({
    name: '',
    spec: '',
    quantity: 1,
    price: 0
  })
}

// 删除项目
const removeItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('提交的数据:', formData.value)
      // TODO: 调用创建API
      ElMessage.success('创建成功')
      router.push('/quote/list')
    }
  })
}
</script> 