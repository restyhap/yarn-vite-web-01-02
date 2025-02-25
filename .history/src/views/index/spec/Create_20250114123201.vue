<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">创建规格表</h2>
        <el-button @click="$router.back()">返回</el-button>
      </div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="max-w-3xl"
      >
        <el-form-item label="规格表名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入规格表名称" />
        </el-form-item>

        <el-form-item label="规格项" prop="items">
          <div v-for="(item, index) in formData.items" :key="index" class="flex gap-4 mb-4">
            <el-input v-model="item.name" placeholder="规格项名称" class="flex-1" />
            <el-input v-model="item.value" placeholder="规格值" class="flex-1" />
            <el-button type="danger" @click="removeItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addItem">添加规格项</el-button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref<FormInstance>()

// 表单数据
const formData = ref({
  name: '',
  items: [{ name: '', value: '' }],
  remark: ''
})

// 表单验证规则
const rules = ref<FormRules>({
  name: [
    { required: true, message: '请输入规格表名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
})

// 添加规格项
const addItem = () => {
  formData.value.items.push({ name: '', value: '' })
}

// 删除规格项
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
      router.push('/spec/list')
    }
  })
}
</script> 