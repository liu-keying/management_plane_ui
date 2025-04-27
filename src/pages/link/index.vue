<template>
    <div class="container">
      <div class="header">
          <h2 class="title">链路列表</h2>
          <div>
            <button class="create-button" @click="goToCreate">创建链路</button>
          </div>
        </div>
  
      <table class="link-table">
        <thead>
          <tr>
            <th> 源节点ID</th>
            <th> 目的节点ID</th>
            <th>链路状态
              <select v-model="filters.status" @change="fetchLinks">
                <option value="">所有状态</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </th>
            <th>
              路由模式
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in links" :key="link.linkId" @click="goToLinkDetail(link.linkId)">
            <td>{{ link.source }}</td>
            <td>{{ link.destination }}</td>
            <td>{{ link.status }}</td>
            <td>{{ link.routingPolicy }}</td>
          </tr>
          <tr v-if="!links.length">
            <td colspan="4">没有找到符合条件的链路。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import useGlobalConfig from '@/composables/useGlobalConfig';
  import { useRouter } from 'vue-router';
  
  const { useMock } = useGlobalConfig();
  const router = useRouter();
  
  const links = ref([]);
  const filters = ref({ status: ''});
  
  const mockData = [
    { linkId:1, source: 1, destination: 2, status: 'ACTIVE', routingPolicy: 'RANDOM' },
    { linkId:2, source: 3, destination: 4, status: 'INACTIVE', routingPolicy: 'RECOMMEND' },
    { linkId:3, source: 4, destination: 5, status: 'PENDING', routingPolicy: 'SPECIFIED' }
  ];
  
  const fetchLinks = async () => {
    if (useMock.value) {
      links.value = mockData.filter(link => {
        return (
          (!filters.value.status || link.status === filters.value.status)
        );
      });
    } else {
      try {
        const { status } = filters.value;
        const response = await axios.get('/api/links', { params: { status } });
        links.value = response.data;
      } catch (error) {
        console.error('获取链路失败:', error);
      }
    }
  };
  
  const goToLinkDetail = (linkId) => {
    router.push({ name: 'LinkDetail', params: { linkId } });
  };
  
  const goToCreate = () => {
      router.push(`/link/create`);
    };
  
  onMounted(fetchLinks);
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
    .create-button{
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
  .link-table {
    width: 100%;
    border-collapse: collapse;
  }
  .link-table th, .link-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  .link-table th select {
    width: 100%;
    padding: 5px;
  }
  </style>
  