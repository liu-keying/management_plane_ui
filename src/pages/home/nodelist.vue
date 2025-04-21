<template>
  <div class="scroll-container">
    <div v-for="(item, index) in internalList" :key="index" class="list-item">
      <div class="item-header">
        <span class="item-block item-name">{{ item.name }}</span>
        <span class="item-block item-name">{{ item.ipaddress }}</span>
        <span class="item-block tag role-tag" :class="'role-' + item.role">
          {{ item.role }}
        </span>
        <span class="item-block tag status-tag" :class="'status-' + item.status">
          {{ item.status }}
        </span>
        <span class="item-block">
          <el-button size="small" type="primary" @click="goToDetail(item.id)">
            详情
          </el-button>
        </span>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const internalList = ref([]);
const router = useRouter();

onMounted(() => {
  internalList.value = [
    { id: 1, name: '节点 A', ipaddress:'118.24.56.101', role: 'CLIENT', status: 'ONLINE' },
    { id: 2, name: '节点 B', ipaddress:	'156.234.72.99',role: 'VPS_RELAY', status: 'OFFLINE' },
    { id: 3, name: '节点 C', ipaddress:'103.45.98.12',role: 'VPS_TE', status: 'DESTROYING' },
    { id: 4, name: '节点 D', ipaddress:'139.224.8.33',role: 'CLIENT', status: 'ONLINE' },
    { id: 5, name: '节点 E', ipaddress:'120.27.12.55',role: 'CLIENT', status: 'ONLINE' },
    { id: 6, name: '节点 F', ipaddress:'104.193.88.121',role: 'VPS_RELAY', status: 'DESTROYING' },
    { id: 7, name: '节点 G', ipaddress:'185.220.101.14',role: 'VPS_RELAY', status: 'OFFLINE' }
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
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
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

/* 🎨 角色颜色 */
.role-VPS_TE {
  background-color: #1976d2;
}

.role-VPS_RELAY {
  background-color: #7b1fa2;
}

.role-CLIENT {
  background-color: #1f9ba2;
}

/* 🎨 状态颜色 */
.status-ONLINE {
  background-color: #2e7d32;
}

.status-OFFLINE {
  background-color: #ef6c00;
}

.status-DESTROYING {
  background-color: #c62828;
}
</style>
