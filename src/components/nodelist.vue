<template>
  <div>
    <!-- 表头 -->
    <div class="list-header">
      <span class="header-block">名称</span>
      <span class="header-block">IP地址</span>
      <span class="header-block">角色</span>
      <span class="header-block">状态</span>
      <span class="header-block">操作</span>
    </div>

    <!-- 滚动区域 -->
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
  </div>
</template>



<script setup>
import { useRouter } from 'vue-router';
import { toRef } from 'vue';

// 接收父组件传入的数据
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();

const internalList = toRef(props, 'list');

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

.list-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  padding: 16px 20px;
  background-color: #ffffff; /* 背景白色更通用 */
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #dce3ee;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05); /* ✨ 阴影效果 */
  transition: box-shadow 0.3s ease;
}

.header-block {
  text-align: center;
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
