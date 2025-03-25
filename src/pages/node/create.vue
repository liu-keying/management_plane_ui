<template>
    <div class="container">
      <h2 class="title">创建新节点</h2>
      <form @submit.prevent="createNode">
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
        <label>云提供商: <input v-model="node.cloudProvider" /></label>
        <label>风险等级: <input type="number" v-model.number="node.riskLevel" min="0" max="10" /></label>
        <label>经度: <input type="number" v-model.number="node.longitude" /></label>
        <label>纬度: <input type="number" v-model.number="node.latitude" /></label>
        <div class="button-group">
          <button type="submit">创建</button>
          <button type="button" @click="goBack">取消</button>
        </div>
      </form>
      <div v-if="message" class="message" :class="messageType">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const node = ref({
    role: "DA",
    status: "ONLINE",
    cloudProvider: "",
    createdAt: new Date().toISOString(),
    nickname: "",
    ipAddress: "",
    longitude: null,
    latitude: null,
    riskLevel: 0
  });
  const message = ref("");
  const messageType = ref("");
  
  const createNode = async () => {
    try {
      await axios.post("/api/nodes", node.value);
      message.value = "创建成功";
      messageType.value = "success";
      setTimeout(() => router.push("/nodes"), 2000);
    } catch (error) {
      message.value = "创建失败";
      messageType.value = "error";
      console.error("创建节点失败", error);
    }
  };
  
  const goBack = () => {
    router.push("/node");
  };
  </script>
  

  