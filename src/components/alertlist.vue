<template>
  <div>
    <el-table :data="internalList" style="width: 100%" border stripe highlight-current-row>
      <el-table-column prop="id" label="ID" min-width="100" />
      <el-table-column prop="name" label="节点" min-width="150" />
      <el-table-column prop="ipAddress" label="IP地址" min-width="150" />
      <el-table-column prop="alert" label="故障描述" min-width="120"/>
      <el-table-column label="" min-width="100" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="goToDetail(row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const internalList = ref([]);
const router = useRouter();

onMounted(() => {
  internalList.value = [
    { id: 1, name: '节点 A', ipAddress:"192.168.100.14", alert: '磁盘空间不足', ugency:'HIGH'},

  ];
});

const goToDetail = (id) => {
  router.push(`/node/${id}`);
};
</script>

<style scoped>

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.list-item {
  width: 100%; /* 撑满容器宽度 */
  padding: 16px 20px;
  margin-bottom: 12px;
  background-color: #f9fbff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}



.item-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
  padding-right: 8px; /* 新增：防止按钮贴边 */
}


.item-block {
  flex-shrink: 0; /* 不允许压缩 */
  text-align: center;
  padding: 0 4px;
}

.item-block:last-child {
  flex: none;
  text-align: right;
}



.item-name {
  flex: 1;
}

.tag {
  display: inline-block;
  max-width: 120px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 14px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table {
  font-size: 16px;
}

/* 优化 Tag 样式，可以让字体大一点更协调 */
.el-tag {
  font-size: 13px;
  padding: 4px 8px;
}

/* 🎨 状态颜色 */
.ugency-LOW {
  background-color: #2e7d32;
}

.ugency-MEDIUM {
  background-color: #ef6c00;
}

.ugency-HIGH {
  background-color: #c62828;
}
</style>
