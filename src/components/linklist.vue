<template>
  <div>
    <!-- 筛选器 -->
    <div class="filter-bar">
      <el-input v-model="searchKeyword" placeholder="搜索 节点/状态/策略" clearable class="filter-item search-input">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-select v-model="selectedPolicy" placeholder="选择策略" clearable class="filter-item">
        <el-option v-for="policy in policyOptions" :key="policy" :label="policy" :value="policy" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态" clearable class="filter-item">
        <el-option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
      </el-select>
    </div>

    <!-- 表格展示 -->
    <el-table :data="filteredList" style="width: 100%" border stripe highlight-current-row>
      <el-table-column prop="linkId" label="链路ID" min-width="160" />
      <el-table-column prop="sourceRelayId" label="起始节点" min-width="160" />
      <!-- <el-table-column prop="to" label="目标节点" min-width="160" /> -->
      <el-table-column label="策略" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getPolicyTagType(row.routingPolicy)" effect="dark">{{ row.routingPolicy }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)" effect="dark">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="goToDetail(row.linkId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();

// 接收父组件传入的数据
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});
const internalList = toRef(props, 'list');

// 筛选项
const selectedStatus = ref('');
const selectedPolicy = ref('');
const searchKeyword = ref('');

const statusOptions = ['ACTIVE', 'INACTIVE', 'PENDING'];
const policyOptions = ['RANDOM', 'RECOMMEND', 'SPECIFIED'];

// 筛选逻辑
const filteredList = computed(() => {
  return internalList.value.filter(item => {
    const keyword = searchKeyword.value.trim().toLowerCase();
    const matchKeyword = keyword
      ? item.linkId.toLowerCase().includes(keyword) ||
        item.sourceRelayId.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.routingPolicy.toLowerCase().includes(keyword)
      : true;

    const matchStatus = selectedStatus.value ? item.status === selectedStatus.value : true;
    const matchPolicy = selectedPolicy.value ? item.routingPolicy === selectedPolicy.value : true;

    return matchKeyword && matchStatus && matchPolicy;
  });
});


// 跳转详情页
const goToDetail = (id) => {
  router.push(`/link/${id}`);
};

// tag 样式
const getPolicyTagType = (policy) => {
  switch (policy) {
    case 'RANDOM': return 'primary';
    case 'RECOMMEND': return 'success';
    case 'SPECIFIED': return 'warning';
    default: return 'info';
  }
};

const getStatusTagType = (status) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'PENDING': return 'warning';
    case 'INACTIVE': return 'danger';
    default: return 'info';
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
}

.search-input {
  flex: 1;
  min-width: 240px;
  max-width: 400px;
}

.el-table {
  font-size: 16px;
}

.el-tag {
  font-size: 13px;
  padding: 4px 8px;
}
</style>
