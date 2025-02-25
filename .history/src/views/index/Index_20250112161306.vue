<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 侧边导航栏 -->
    <SideNav />
    
    <!-- 主内容区域 -->
    <div class="flex-1 p-6">
      <!-- 标题和操作按钮区 -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">规格表列表</h2>
        <div class="flex gap-2">
          <el-input
            v-model="searchText"
            placeholder="搜索规格表..."
            class="w-64"
            :prefix-icon="Search"
          />
          <el-button type="danger" :icon="Plus" @click="handleBatchDelete">批量删除</el-button>
          <el-button type="success" :icon="Download" @click="exportToExcel">导出Excel</el-button>
          <el-button type="primary" :icon="Plus">添加规格</el-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table
        :data="filteredTableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="code" label="商品编码" width="120" />
        <el-table-column prop="name" label="供应商" width="150" />
        <el-table-column prop="model" label="供应商编码" width="120" />
        <el-table-column prop="supplierCode" label="供应商名称" width="150" />
        <el-table-column prop="spec" label="消防规范" width="120" />
        <el-table-column prop="price20" label="20尺柜FOB价格" width="150" />
        <el-table-column prop="price40" label="40尺柜FOB价格" width="150" />
        <el-table-column prop="port" label="装运港口" width="120" />
        
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" :icon="View" circle @click="handleView(row)" />
            <el-button type="warning" :icon="Edit" circle @click="handleEdit(row)" />
            <el-button type="danger" :icon="Delete" circle @click="handleDelete(row)" />
            <el-button type="success" :icon="Message" circle @click="handleMessage(row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="flex justify-between items-center mt-4">
        <span class="text-sm text-gray-500">
          Total {{ total }} items
        </span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import SideNav from '@/components/SideNav.vue';
import {
  Search,
  Plus,
  Download,
  View,
  Edit,
  Delete,
  Message
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 搜索文本
const searchText = ref('');

// 表格数据
const tableData = ref([
  {
    code: 'TC-001',
    name: 'Acme Electronics',
    model: 'AE-2024001',
    supplierCode: 'Acme Electronics Co., Ltd',
    spec: 'UL94-V0',
    price20: '$2,500',
    price40: '$4,800',
    port: 'Shanghai'
  },
  {
    code: 'TC-002',
    name: 'Global Tech',
    model: 'GT-2024002',
    supplierCode: 'Global Technologies Inc.',
    spec: 'UL94-V1',
    price20: '$3,200',
    price40: '$6,100',
    port: 'Ningbo'
  },
  {
    code: 'TC-003',
    name: 'Smart Solutions',
    model: 'SS-2024003',
    supplierCode: 'Smart Solutions Limited',
    spec: 'UL94-V2',
    price20: '$2,800',
    price40: '$5,400',
    port: 'Shenzhen'
  },
  {
    code: 'TC-004',
    name: 'Eastern Manufacturing',
    model: 'EM-2024004',
    supplierCode: 'Eastern Manufacturing Co.',
    spec: 'UL94-V0',
    price20: '$3,500',
    price40: '$6,800',
    port: 'Guangzhou'
  },
  {
    code: 'TC-005',
    name: 'Prime Industries',
    model: 'PI-2024005',
    supplierCode: 'Prime Industries Group',
    spec: 'UL94-V1',
    price20: '$2,900',
    price40: '$5,600',
    port: 'Xiamen'
  }
]);

// 添加搜索功能
const filteredTableData = computed(() => {
  if (!searchText.value) return tableData.value;
  
  const search = searchText.value.toLowerCase();
  return tableData.value.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(search)
    );
  });
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 添加批量删除功能
const selectedRows = ref<any[]>([]);

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection;
};

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的项目');
    return;
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 项吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里实现实际的删除逻辑
    const selectedIds = selectedRows.value.map(row => row.code);
    tableData.value = tableData.value.filter(
      item => !selectedIds.includes(item.code)
    );
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 添加导出Excel功能
const exportToExcel = () => {
  // 这里可以实现导出逻辑
  ElMessage.success('开始导出Excel...');
};

// 添加查看详情功能
const handleView = (row: any) => {
  ElMessage.info(`查看详情：${row.code}`);
};

// 添加编辑功能
const handleEdit = (row: any) => {
  ElMessage.info(`编辑：${row.code}`);
};

// 添加删除功能
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除 ${row.code} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.code !== row.code);
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 添加消息功能
const handleMessage = (row: any) => {
  ElMessage.info(`发送消息给：${row.name}`);
};
</script>

<style scoped>
.el-button {
  margin-left: 4px;
  margin-right: 4px;
}
</style>
