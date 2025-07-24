<template>
  <div class="node-container">
    <div class="sidebar">
      <!-- 筛选器 -->
      <div class="filter-bar">
        <el-input v-model="searchKeyword" placeholder="搜索 ID / 昵称 / IP地址 / 云服务商" clearable
          class="filter-item search-input">
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
      <div class="node-items">
        <div v-for="node in filteredList" :key="node.nodeId" class="node-item"
          :class="{ selected: currentRowKey === node.nodeId }" @click="handleCurrentChange(node)">
          <div class="node-info">
            <div class="node-id">{{ node.nodeId }}</div>
            <div class="node-details">
              <span class="ipaddress">{{ node.ipAddress || 'IP地址未知' }}</span>
              <span class="status" :class="node.status.toLowerCase()">{{ node.status }}</span>
              <span class="role" :class="node.role.toLowerCase()">{{ node.role }}</span>
              <span class="location">{{ node.geoLocation }}</span>
            </div>
          </div>
          <!-- <div class="selection-indicator">
            <el-icon v-if="editForm.relayIds.includes(node.nodeId)" color="#409EFF">
              <Check />
            </el-icon>
          </div> -->
        </div>
      </div>
      <!-- 表格 -->
      <!-- <el-table
        :data="filteredList"
        style="width: 100%"
        border
        stripe
        highlight-current-row
        :current-row-key="currentRowKey"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="nodeId" label="ID" min-width="130" />
        <el-table-column prop="nickname" label="节点昵称" min-width="100" :formatter="defaultFormatter"/> 
        <el-table-column prop="ipAddress" label="IP地址" min-width="120" :formatter="defaultFormatter" />
        <el-table-column prop="cloudProvider" label="云服务商" min-width="100" :formatter="defaultFormatter"/> 
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
      </el-table> -->

    </div>
    <div class="node-detail">
      <detail :nodeId="currentRowKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchNodes, type NodeItem } from '@/api/node';
import { Search } from '@element-plus/icons-vue';
import { defaultFormatter } from '@/utils/formatters';
import Detail from './detail.vue';

const nodes = ref<NodeItem[]>([]);
const selectedNode = ref<NodeItem | null>(null);
const currentRowKey = ref<string | null>(null);

const selectedRole = ref('');
const selectedStatus = ref('');
const searchKeyword = ref('');

const roleOptions = ['CLIENT', 'VPS_RELAY', 'VPS_TE'];
const statusOptions = ['ONLINE', 'OFFLINE', 'DESTROYING'];

const filteredList = computed(() => {
  return nodes.value.filter(item => {
    const matchRole = selectedRole.value ? item.role === selectedRole.value : true;
    const matchStatus = selectedStatus.value ? item.status === selectedStatus.value : true;

    const keyword = searchKeyword.value.trim().toLowerCase();
    const matchKeyword = keyword
      ? (String(item.nodeId).toLowerCase().includes(keyword) ||
        (item.nickname && item.nickname.toLowerCase().includes(keyword)) ||
        (item.ipAddress && item.ipAddress.toLowerCase().includes(keyword)) ||
        (item.cloudProvider && item.cloudProvider.toLowerCase().includes(keyword)))
      : true;

    return matchRole && matchStatus && matchKeyword;
  });
});

onMounted(async () => {
  nodes.value = await fetchNodes({});
});

const handleCurrentChange = (val: NodeItem | null) => {
  if (val) {
    currentRowKey.value = val.nodeId;
    selectedNode.value = val;
  } else {
    currentRowKey.value = null;
    selectedNode.value = null;
  }
};

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
.node-container {
  display: flex;
}


.node-detail {
  flex: 1;
  padding: 20px;
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 0 0 10px 0;
}

.filter-item {
  width: 200px;
}

.search-input {
  flex: 1;
  min-width: 240px;
  max-width: 400px;
}

.el-table {
  font-size: 14px;
}

.el-table .el-table__row.current-row {
  background-color: #f0f0f0;
}

.el-tag {
  font-size: 12px;
  padding: 3px 6px;
}
</style>
