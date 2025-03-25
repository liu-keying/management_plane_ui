<template>
    <div class="container">
      <h2 class="title">修改节点</h2>
      <form @submit.prevent="updateNode">
        <label>节点名称: <input v-model="node.nickname" /></label>
        <label>IP 地址: <input v-model="node.ipAddress" /></label>
        <label>角色:
          <select v-model="node.role">
            <option value="DA">DA</option>
            <option value="RELAY">RELAY</option>
          </select>
        </label>
        <label>状态:
          <select v-model="node.status">
            <option value="ONLINE">ONLINE</option>
            <option value="OFFLINE">OFFLINE</option>
            <option value="DESTROYING">DESTROYING</option>
          </select>
        </label>
        <label>风险等级: <input type="number" v-model.number="node.riskLevel" min="0" max="10" /></label>
        <label>经度: <input type="number" v-model.number="node.longitude" /></label>
        <label>纬度: <input type="number" v-model.number="node.latitude" /></label>
        <button type="submit">保存</button>
        <button type="button" @click="goBack">取消</button>
      </form>
      <div v-if="message" class="message" :class="messageType">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  const node = ref({});
  const message = ref("");
  const messageType = ref("");
  const userId = 1; // 假设当前用户 ID
  
  const fetchNode = async () => {
    try {
      const response = await axios.get(`/api/nodes/${route.params.nodeId}`);
      node.value = response.data;
    } catch (error) {
      console.error("获取节点信息失败", error);
    }
  };
  
  const updateNode = async () => {
    try {
      await axios.put(`/api/nodes/${route.params.nodeId}`, {
        ...node.value,
        userId,
        updatedAt: new Date().toISOString()
      });
      message.value = "修改成功";
      messageType.value = "success";
      setTimeout(() => router.push(`/node/${route.params.nodeId}`), 2000);
    } catch (error) {
      message.value = "修改失败";
      messageType.value = "error";
      console.error("更新节点失败", error);
      setTimeout(() => router.push(`/node/${route.params.nodeId}`), 2000);
    }
  };
  
  const goBack = () => {
    router.push(`/node/${route.params.nodeId}`);
  };
  
  onMounted(fetchNode);
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    max-width: 500px;
    margin: auto;
  }
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  form {
    display: flex;
    flex-direction: column;
  }
.label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 48%;
}
input, select {
  width: 60%;
  padding: 8px;
}
  button {
    padding: 10px;
    margin-top: 10px;
    background: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
  .message {
    margin-top: 10px;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
  }
  .success {
    background: #d4edda;
    color: #155724;
  }
  .error {
    background: #f8d7da;
    color: #721c24;
  }
  </style>
  