<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">产品列表</h2>
        <el-button type="primary" @click="$router.push('/prod/create')">
          <el-icon class="mr-2"><Plus /></el-icon>
          新建产品
        </el-button>
      </div>

      <!-- 搜索区域 -->
      <div class="mb-4">
        <el-form :inline="true" :model="searchForm" class="flex flex-wrap gap-4">
          <el-form-item label="产品代码">
            <el-input v-model="searchForm.tccode" placeholder="请输入产品代码" />
          </el-form-item>
          <el-form-item label="供应商代码">
            <el-input v-model="searchForm.supplierCode" placeholder="请输入供应商代码" />
          </el-form-item>
          <el-form-item label="供应商名称">
            <el-input v-model="searchForm.supplierName" placeholder="请输入供应商名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tccode" label="产品代码" width="120" />
        <el-table-column prop="supplier" label="供应商" width="120" />
        <el-table-column prop="supplier_code" label="供应商代码" width="120" />
        <el-table-column prop="supplier_name" label="供应商名称" min-width="180" />
        <el-table-column prop="fire_standard" label="防火标准" width="120" />
        <el-table-column prop="fob_20_container_price" label="20尺柜FOB价格" width="150">
          <template #default="scope">
            ¥{{ scope.row.fob_20_container_price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="fob_40_container_price" label="40尺柜FOB价格" width="150">
          <template #default="scope">
            ¥{{ scope.row.fob_40_container_price?.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="shipping_port" label="发货港口" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索表单数据
const searchForm = ref({
  tccode: '',
  supplierCode: '',
  supplierName: ''
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    tccode: 'TC001',
    supplier: '供应商A',
    supplier_code: 'SA001',
    supplier_name: '某某贸易有限公司',
    fire_standard: 'BS 5852',
    fob_20_container_price: 5000.00,
    fob_40_container_price: 9000.00,
    shipping_port: '宁波港'
  },
  {
    id: 2,
    tccode: 'TC002',
    supplier: '供应商B',
    supplier_code: 'SB001',
    supplier_name: '某某实业有限公司',
    fire_standard: 'CAL TB 117',
    fob_20_container_price: 6000.00,
    fob_40_container_price: 11000.00,
    shipping_port: '上海港'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 搜索处理
const handleSearch = () => {
  console.log('搜索条件:', searchForm.value)
  // TODO: 调用搜索API
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    tccode: '',
    supplierCode: '',
    supplierName: ''
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  console.log('每页条数:', val)
  // TODO: 调用API获取数据
}

const handleCurrentChange = (val: number) => {
  console.log('当前页:', val)
  // TODO: 调用API获取数据
}

// 操作处理
const handleView = (row: any) => {
  console.log('查看:', row)
  router.push(`/prod/view/${row.id}`)
}

const handleEdit = (row: any) => {
  console.log('编辑:', row)
  router.push(`/prod/edit/${row.id}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该产品吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除API
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>
