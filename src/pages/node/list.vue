<template>
  <div class="container">
    <div class="header">
        <h2 class="title">节点列表</h2>
        <div>
          <button class="create-button" @click="goToCreate">创建节点</button>
        </div>
      </div>

    <table class="node-table">
      <thead>
        <tr>
          <th>节点名称</th>
          <th>状态
            <select v-model="filters.status" @change="fetchNodes">
              <option value="">所有状态</option>
              <option value="ONLINE">ONLINE</option>
              <option value="OFFLINE">OFFLINE</option>
              <option value="DESTROYING">DESTROYING</option>
            </select>
          </th>
          <th>角色
            <select v-model="filters.role" @change="fetchNodes">
              <option value="">所有角色</option>
              <option value="DA">DA</option>
              <option value="RELAY">RELAY</option>
            </select>
          </th>
          <th>云提供商
            <select v-model="filters.cloudProvider" @change="fetchNodes">
              <option value="">所有云提供商</option>
              <option value="aws">AWS</option>
              <option value="gcp">GCP</option>
              <option value="azure">Azure</option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="node in nodes" :key="node.nodeId" @click="goToNodeDetail(node.nodeId)">
          <td>{{ node.nickname }}</td>
          <td>{{ node.status }}</td>
          <td>{{ node.role }}</td>
          <td>{{ node.cloudProvider }}</td>
        </tr>
        <tr v-if="!nodes.length">
          <td colspan="4">没有找到符合条件的节点。</td>
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

const nodes = ref([]);
const filters = ref({ status: '', role: '', cloudProvider: '' });

const mockData = [
  { nodeId: 1, nickname: 'Node A', status: 'ONLINE', role: 'DA', cloudProvider: 'aws' },
  { nodeId: 2, nickname: 'Node B', status: 'OFFLINE', role: 'RELAY', cloudProvider: 'gcp' },
  { nodeId: 3, nickname: 'Node C', status: 'ONLINE', role: 'RELAY', cloudProvider: 'azure' },
  { nodeId: 4, nickname: 'Node D', status: 'DESTROYING', role: 'DA', cloudProvider: 'aws' }
];

const fetchNodes = async () => {
  if (useMock.value) {
    nodes.value = mockData.filter(node => {
      return (
        (!filters.value.status || node.status === filters.value.status) &&
        (!filters.value.role || node.role === filters.value.role) &&
        (!filters.value.cloudProvider || node.cloudProvider === filters.value.cloudProvider)
      );
    });
  } else {
    try {
      const { status, role, cloudProvider } = filters.value;
      const response = await axios.get('/api/nodes', { params: { status, role, cloudProvider } });
      nodes.value = response.data;
    } catch (error) {
      console.error('获取节点失败:', error);
    }
  }
};

const goToNodeDetail = (nodeId) => {
  router.push({ name: 'NodeDetail', params: { nodeId } });
};

const goToCreate = () => {
    router.push(`/node/create`);
  };

onMounted(fetchNodes);
</script>


