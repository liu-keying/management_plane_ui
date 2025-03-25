<template>
    <div class="container">
      <div class="header">
        <h2 class="title">节点详情</h2>
        <div>
          <button class="edit-button" @click="goToUpdate">修改节点</button>
          <button class="back-button" @click="goBack">返回</button>
        </div>
      </div>
      
      <div v-if="node" class="details-grid">
        <div class="detail-item"><strong>节点名称:</strong> {{ node.nickname }}</div>
        <div class="detail-item"><strong>节点 ID:</strong> {{ node.nodeId }}</div>
        <div class="detail-item"><strong>指纹:</strong> {{ node.fingerprint }}</div>
        <div class="detail-item"><strong>IP 地址:</strong> {{ node.ipAddress }}</div>
        <div class="detail-item"><strong>角色:</strong> {{ node.role }}</div>
        <div class="detail-item"><strong>状态:</strong> {{ node.status }}</div>
        <div class="detail-item"><strong>云提供商:</strong> {{ node.cloudProvider }}</div>
        <div class="detail-item"><strong>风险等级:</strong> {{ node.riskLevel }}</div>
        <div class="detail-item"><strong>CPU 使用率:</strong> {{ node.cpuUsage }}%</div>
        <div class="detail-item"><strong>内存使用量:</strong> {{ node.memoryUsage }} MB</div>
        <div class="detail-item"><strong>经度:</strong> {{ node.longitude }}</div>
        <div class="detail-item"><strong>纬度:</strong> {{ node.latitude }}</div>
        <div class="detail-item"><strong>创建时间:</strong> {{ formatDate(node.createdAt) }}</div>
        <div class="detail-item"><strong>最后心跳:</strong> {{ formatDate(node.lastHeartbeat) }}</div>
      </div>
      <p v-else>正在加载节点详情...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import useGlobalConfig from '@/composables/useGlobalConfig';
  
  const route = useRoute();
  const router = useRouter();
  const { useMock } = useGlobalConfig();
  const node = ref(null);
  
  const mockData = [
    {
      nodeId: 1,
      nickname: "Node A",
      fingerprint: "abc123",
      ipAddress: "192.168.1.1",
      role: "DA",
      status: "ONLINE",
      riskLevel: 3,
      cpuUsage: 45.6,
      memoryUsage: 2048,
      longitude: 120.1234,
      latitude: 30.5678,
      cloudProvider: "aws",
      createdAt: "2025-03-20T10:15:30",
      lastHeartbeat: "2025-03-21T12:10:45"
    },
    {
      nodeId: 2,
      nickname: "Node B",
      fingerprint: "def456",
      ipAddress: "192.168.1.2",
      role: "RELAY",
      status: "OFFLINE",
      riskLevel: 2,
      cpuUsage: 30.2,
      memoryUsage: 1024,
      longitude: 118.9876,
      latitude: 32.6543,
      cloudProvider: "gcp",
      createdAt: "2024-02-15T08:30:00",
      lastHeartbeat: "2024-02-16T14:45:20"
    }
  ];
  
  const fetchNodeDetail = async () => {
    if (useMock.value) {
      node.value = mockData.find(n => n.nodeId === Number(route.params.nodeId)) || null;
    } else {
      try {
        const response = await axios.get(`/api/nodes/${route.params.nodeId}`);
        node.value = response.data;
      } catch (error) {
        console.error('获取节点详情失败:', error);
      }
    }
  };
  
  const formatDate = (dateTime) => {
    return dateTime ? new Date(dateTime).toLocaleString() : 'N/A';
  };
  
  const goBack = () => {
    router.push('/node');
  };
  
  const goToUpdate = () => {
    router.push(`/node/${route.params.nodeId}/update`);
  };
  
  onMounted(fetchNodeDetail);
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .title {
    font-size: 24px;
    margin: 0;
  }
  .back-button, .edit-button {
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  .back-button:hover, .edit-button:hover {
    background-color: #0056b3;
  }
  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .detail-item {
    padding: 8px;
    background: #f9f9f9;
    border-radius: 4px;
  }
  p {
    font-size: 16px;
    margin: 5px 0;
  }
  </style>
  