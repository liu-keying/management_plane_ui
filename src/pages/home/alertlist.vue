<template>
    <div class="scroll-container">
      <div v-for="(item, index) in internalList" :key="index" class="list-item">
        <div class="item-header">
          <span class="item-block item-name">{{ item.name }}</span>
          <span class="item-block tag role-tag" :class="'role-' + item.role">
            {{ item.role }}
          </span>
          <span class="item-block tag status-tag" :class="'status-' + item.status">
            {{ item.status }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const internalList = ref([]);
  
  onMounted(() => {
    internalList.value = [
      { name: '节点 A', role: '主控', status: '正常' },
      { name: '节点 B', role: '子节点', status: '异常' },
      { name: '节点 C', role: '子节点', status: '告警' },
      { name: '节点 D', role: '主控', status: '正常' },
      { name: '节点 E', role: '子节点', status: '正常' },
      { name: '节点 F', role: '子节点', status: '异常' },
      { name: '节点 G', role: '主控', status: '告警' }
    ];
  });
  </script>
  
  <style scoped>
  .card {
    height: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .scroll-container {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  
  .list-item {
    padding: 16px 20px;
    margin-bottom: 12px;
    background-color: #f9fbff;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 500;
    color: #333;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }
  
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  
  .item-block {
    flex: 1;
    text-align: center;
  }
  
  
  
  .item-name {
    flex: 1;
  }
  
  .tag {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 14px;
    color: white;
    white-space: nowrap;
  }
  
  /* 🎨 角色颜色 */
  .role-主控 {
    background-color: #1976d2;
  }
  
  .role-子节点 {
    background-color: #7b1fa2;
  }
  
  /* 🎨 状态颜色 */
  .status-正常 {
    background-color: #2e7d32;
  }
  
  .status-异常 {
    background-color: #ef6c00;
  }
  
  .status-告警 {
    background-color: #c62828;
  }
  </style>
  