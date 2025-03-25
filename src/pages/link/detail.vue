<template>
    <div class="container">
        <div class="header">
        <h2 class="title">链路详情</h2>
        <div>
          <button class="edit-button" @click="goToUpdate">更新链路</button>
          <button class="delete-button" @click="goToDelete">删除链路</button>
          <button class="back-button" @click="goBack">返回</button>
        </div>
      </div>
      <div v-if="link" class="details-grid">
        <div class="detail-item"><strong>链路 ID:</strong> {{ link.linkId }}</div>
        <div class="detail-item"><strong>节点 ID 列表:</strong> {{ link.nodeIds.join(', ') }}</div>
        <div class="detail-item"><strong>路由策略:</strong> {{ link.routingPolicy }}</div>
        <div class="detail-item"><strong>状态:</strong> {{ link.status }}</div>
        <div class="detail-item"><strong>创建者用户 ID:</strong> {{ link.createdBy }}</div>
        <div class="detail-item"><strong>创建时间:</strong> {{ formatDate(link.createdAt) }}</div>
        <div class="detail-item"><strong>更新时间:</strong> {{ formatDate(link.updatedAt) }}</div>
      </div>
      <p v-else>正在加载链路详情...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import useGlobalConfig from '@/composables/useGlobalConfig';
  
  const { useMock } = useGlobalConfig();
  
  const route = useRoute();
  const router = useRouter();
  const link = ref(null);

  const mockData = [
  {
    linkId: 1,
    nodeIds: [101, 102, 103],
    routingPolicy: "RANDOM",
    status: "ACTIVE",
    createdBy: 1,
    createdAt: "2025-03-15T12:30:00",
    updatedAt: "2025-03-20T14:45:10"
  },
  {
    linkId: 2,
    nodeIds: [104, 105],
    routingPolicy: "SPECIFIED",
    status: "INACTIVE",
    createdBy: 2,
    createdAt: "2025-02-10T09:15:45",
    updatedAt: "2025-03-01T10:20:30"
  }
];
  
  const fetchLinkDetail = async () => {
    if (useMock.value) {
        link.value = mockData.find((l) => l.linkId === Number(route.params.linkId)) || null;
    } else {
      try {
        const response = await axios.get(`/api/links/${route.params.linkId}`);
        link.value = response.data;
      } catch (error) {
        console.error('获取链路详情失败:', error);
      }
    }
  };
  
  const formatDate = (dateTime) => {
    return dateTime ? new Date(dateTime).toLocaleString() : 'N/A';
  };

  const goBack = () => {
    router.push('/link');
  };
  
  const goToUpdate = () => {
    router.push(`/link/${route.params.linkId}/update`);
  };

  const goToDelete = () => {
    router.push(`/link/${route.params.linkId}/delete`);
  };
  
  onMounted(fetchLinkDetail);
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    max-width: 800px;
    margin: auto;
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
  .back-button, .edit-button,.delete-button {
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
  }
  </style>
  