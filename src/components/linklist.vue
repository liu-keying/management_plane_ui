<template>
    <div class="scroll-container">
      <div v-for="(item, index) in internalList" :key="index" class="list-item">
        <div class="item-header">
          <span class="item-block item-name">{{ item.from }} -> {{ item.to }}</span>
          <span class="item-block tag role-tag" :class="'policy-' + item.policy">
            {{ item.policy }}
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
      { id: 1, from: '节点 A', to: '节点 B', status: 'ACTIVE', policy: 'RANDOM'},
      { id: 2, from: '节点 C', to: '节点 D', status: 'INACTIVE', policy: 'RANDOM'},
      { id: 3, from: '节点 E', to: '节点 F', status: 'PENDING', policy: 'RECOMMEND'},
      { id: 4, from: '节点 G', to: '节点 H', status: 'INACTIVE', policy: 'SPECIFIED'},
      { id: 5, from: '节点 I', to: '节点 J', status: 'ACTIVE', policy: 'RANDOM'},
      
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
  
  /* 🎨 角色颜色 */
  .policy-RANDOM {
    background-color: #1976d2;
  }
  
  .policy-RECOMMEND {
    background-color: #7b1fa2;
  }
  
  .policy-SPECIFIED {
    background-color: #1f9ba2;
  }
  
  /* 🎨 状态颜色 */
  .status-ACTIVE {
    background-color: #2e7d32;
  }
  
  .status-PENDING {
    background-color: #ef6c00;
  }
  
  .status-INACTIVE {
    background-color: #c62828;
  }
  </style>
  