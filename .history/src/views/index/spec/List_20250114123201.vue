<template>
  <div class="flex-1 p-8">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">规格表列表</h2>
        <el-button type="primary" @click="$router.push('/spec/create')">
          <el-icon class="mr-2"><Plus /></el-icon>
          新建规格表
        </el-button>
      </div>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="规格表名称" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">查看</el-button>
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '标准规格表A',
    createTime: '2024-01-15 10:00:00',
    updateTime: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    name: '定制规格表B',
    createTime: '2024-01-16 14:30:00',
    updateTime: '2024-01-16 15:20:00'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

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
  // TODO: 实现查看逻辑
}

const handleEdit = (row: any) => {
  console.log('编辑:', row)
  router.push(`/spec/edit/${row.id}`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除该规格表吗？',
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