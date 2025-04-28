<template>
  <div>
    <!-- 表头+筛选器 -->
    <div class="list-header">
      <!-- 名称列 -->
      <div class="header-cell">
        <span>名称</span>
        <div class="filter-placeholder"></div> <!-- 不筛选，占位 -->
      </div>

      <!-- IP地址列 -->
      <div class="header-cell">
        <span>IP地址</span>
        <div class="filter-placeholder"></div> <!-- 不筛选，占位 -->
      </div>

      <!-- 角色列 -->
      <div class="header-cell">
        <span>角色</span>
        <el-select
          v-model="selectedRole"
          placeholder="选择角色"
          clearable
          size="small"
          class="filter-select"
        >
          <el-option
            v-for="role in roleOptions"
            :key="role"
            :label="role"
            :value="role"
          />
        </el-select>
      </div>

      <!-- 状态列 -->
      <div class="header-cell">
        <span>状态</span>
        <el-select
          v-model="selectedStatus"
          placeholder="选择状态"
          clearable
          size="small"
          class="filter-select"
        >
          <el-option
            v-for="status in statusOptions"
            :key="status"
            :label="status"
            :value="status"
          />
        </el-select>
      </div>

      <!-- 操作列 -->
      <div class="header-cell">
        <span>操作</span>
        <div class="filter-placeholder"></div> <!-- 不筛选，占位 -->
      </div>
    </div>

    <!-- 滚动区域 -->
    <div class="scroll-container">
      <div
        v-for="(item, index) in filteredList"
        :key="index"
        class="list-item"
      >
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
            <el-button size="small" type="primary" @click="handleDetail(item)">
              详情
            </el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, computed, toRef } from 'vue';
import { useRouter } from 'vue-router';

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

// 计算筛选后的列表
const filteredList = computed(() => {
  return internalList.value.filter(item => {
    const matchRole = selectedRole.value ? item.role === selectedRole.value : true;
    const matchStatus = selectedStatus.value ? item.status === selectedStatus.value : true;
    return matchRole && matchStatus;
  });
});

// 点击详情按钮，直接跳转
const handleDetail = (item) => {
  router.push(`/node/${item.id}`);
};
</script>

<style scoped>
.list-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 12px;
  padding: 4px 20px;
  background-color: #ffffff;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #dce3ee;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 粘性滚动时更柔和的阴影 */
  backdrop-filter: blur(4px); /* 可选，让顶部略微有磨砂质感 */
  transition: all 0.3s ease;
}

/* 每列内部布局 */
.header-cell {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 4px; /* 标题和筛选框之间的间距 */
}

/* 占位用，不筛选的地方 */
.filter-placeholder {
  height: 36px; /* el-select 统一高度 */
}

/* 筛选器统一样式 */
.filter-select {
  width: 120px;
  font-size: 14px; /* 和标题基本匹配 */
  height: 36px;
}

/* 让 el-select 里面的内容高度也适配 */
.filter-select .el-input__inner {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
  background-color: #f5f7fa; /* 很浅的灰色，看着清爽 */
}



.list-item {
  width: 100%;
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
  padding-right: 8px;
}

.item-block {
  flex-shrink: 0;
  text-align: left;
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

/* 角色颜色 */
.role-VPS_TE {
  background-color: #1976d2;
}

.role-VPS_RELAY {
  background-color: #7b1fa2;
}

.role-CLIENT {
  background-color: #1f9ba2;
}

/* 状态颜色 */
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
