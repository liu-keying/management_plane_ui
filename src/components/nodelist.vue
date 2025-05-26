<template>
  <div>
    <!-- 筛选器 -->
    <div class="filter-bar">
      <el-input v-model="searchKeyword" placeholder="搜索 ID / 昵称 / IP地址" clearable class="filter-item search-input">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedRole" placeholder="选择角色" clearable class="filter-item">
        <el-option v-for="role in roleOptions" :key="role" :label="role" :value="role" />
      </el-select>

      <el-select v-model="selectedStatus" placeholder="选择状态" clearable class="filter-item">
        <el-option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
      </el-select>

    </div>



    <!-- 表格 -->
    <el-table :data="filteredList" style="width: 100%" border stripe highlight-current-row>
      <el-table-column prop="nodeId" label="ID" min-width="100" />
      <el-table-column prop="nickname" label="节点昵称" min-width="150" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="150" />
      <!-- <el-tabel-column prop="cloudProvider" label="云服务商" min-width="120" /> -->
      <el-table-column label="角色" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getRoleTagType(row.role)" effect="dark">
            {{ row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" effect="dark">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="" min-width="100" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleDetail(row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

// 接收父组件传入的数据
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();
const internalList = toRef(props, 'list');

// 筛选条件
const selectedRole = ref('');
const selectedStatus = ref('');

// 角色和状态选项
const roleOptions = ['CLIENT', 'VPS_RELAY', 'VPS_TE'];
const statusOptions = ['ONLINE', 'OFFLINE', 'DESTROYING'];
const searchKeyword = ref('');

// 计算筛选后的列表
const filteredList = computed(() => {
  return internalList.value.filter(item => {
    const matchRole = selectedRole.value ? item.role === selectedRole.value : true;
    const matchStatus = selectedStatus.value ? item.status === selectedStatus.value : true;

    const keyword = searchKeyword.value.trim().toLowerCase();
    const matchKeyword = keyword
      ? (String(item.id).toLowerCase().includes(keyword) ||
        (item.name && item.name.toLowerCase().includes(keyword)) ||
        (item.ipaddress && item.ipaddress.toLowerCase().includes(keyword)))
      : true;

    return matchRole && matchStatus && matchKeyword;
  });
});


// 点击详情按钮，跳转
const handleDetail = (item) => {
  router.push(`/node/${item.nodeId}`);
};

// 根据角色返回不同的tag样式
const getRoleTagType = (role) => {
  switch (role) {
    case 'VPS_TE':
      return 'primary';
    case 'VPS_RELAY':
      return 'success';
    case 'CLIENT':
      return 'warning';
    default:
      return 'info';
  }
};

// 根据状态返回不同的tag样式
const getStatusTagType = (status) => {
  switch (status) {
    case 'ONLINE':
      return 'success';
    case 'OFFLINE':
      return 'warning';
    case 'DESTROYING':
      return 'danger';
    default:
      return 'info';
  }
};
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 0 10px 0;
}

.filter-item {
  width: 200px;
  /* 筛选框变宽 */
}

.search-input {
  flex: 1;
  /* 搜索框自动拉伸占满空白 */
  min-width: 240px;
  max-width: 400px;
}

.el-table {
  font-size: 16px;
}

/* 优化 Tag 样式，可以让字体大一点更协调 */
.el-tag {
  font-size: 13px;
  padding: 4px 8px;
}
</style>
