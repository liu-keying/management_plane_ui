<template>
  <MapView :points="transformedPoints" />
  <!-- <div>
    <button class="create-button" @click="goToCreate">创建节点</button>
  </div> -->
  <nodelist :list="points" />
  <!-- <div class="container">
    <div class="header">
        <h2 class="title">节点列表</h2>
        <div>
          <button class="create-button" @click="goToCreate">创建节点</button>
        </div>
      </div> -->

  <!-- <table class="node-table">
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
  </div> -->
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import axios from 'axios';
import useGlobalConfig from '@/composables/useGlobalConfig.ts';
import { useRouter } from 'vue-router';
import MapView from "@/components/MapView.vue";
import nodelist from "@/components/nodelist.vue";

const points = [
  {
    nodeId: 1,
    nickname: 'test1',
    fingerprint: 'a1b2c3d4e5f6g7h8',
    ipAddress: '192.168.1.1',
    role: 'CLIENT',
    status: 'ONLINE',
    riskLevel: 2,
    cpuUsage: 45.5,
    memoryUsage: 67.2,
    trafficIn: 1250000,
    trafficOut: 700000,
    geoLocation: 'Beijing, China',
    cloudProvider: 'AWS',
    createdAt: '2023-01-01T12:00:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T10:30:00',
    longitude: 116.4,
    latitude: 39.9
  },
  {
    nodeId: 2,
    nickname: 'testRelay',
    fingerprint: 'f1e2d3c4b5a6978g',
    ipAddress: '192.168.2.2',
    role: 'VPS_RELAY',
    status: 'OFFLINE',
    riskLevel: 3,
    cpuUsage: 88.1,
    memoryUsage: 74.6,
    trafficIn: 2000000,
    trafficOut: 1200000,
    geoLocation: 'Shanghai, China',
    cloudProvider: 'Azure',
    createdAt: '2023-03-15T08:45:00',
    createdBy: 'system',
    lastHeartbeat: '2025-04-27T09:10:00',
    longitude: 121.5,
    latitude: 31.2
  },
  {
    nodeId: 3,
    nickname: 'test3',
    fingerprint: 'abc123def456ghi789',
    ipAddress: '10.0.0.3',
    role: 'VPS_TE',
    status: 'DESTROYING',
    riskLevel: 1,
    cpuUsage: 52.3,
    memoryUsage: 49.7,
    trafficIn: 1500000,
    trafficOut: 850000,
    geoLocation: 'Guangzhou, China',
    cloudProvider: 'Tencent Cloud',
    createdAt: '2022-12-20T14:30:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-26T14:00:00',
    longitude: 113.3,
    latitude: 23.1
  },
  {
    nodeId: 4,
    nickname: 'test-4',
    fingerprint: 'xyz987uvw654rst321',
    ipAddress: '172.16.4.4',
    role: 'CLIENT',
    status: 'ONLINE',
    riskLevel: 0,
    cpuUsage: 33.0,
    memoryUsage: 50.0,
    trafficIn: 500000,
    trafficOut: 250000,
    geoLocation: 'New York, USA',
    cloudProvider: 'AWS',
    createdAt: '2023-06-10T20:00:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T10:00:00',
    longitude: -74.006,
    latitude: 40.7128
  },
  {
    nodeId: 5,
    nickname: 'test5relay',
    fingerprint: 'mnopqr123456stuv789',
    ipAddress: '172.31.5.5',
    role: 'VPS_RELAY',
    status: 'ONLINE',
    riskLevel: 2,
    cpuUsage: 65.5,
    memoryUsage: 71.2,
    trafficIn: 1800000,
    trafficOut: 950000,
    geoLocation: 'Tokyo, Japan',
    cloudProvider: 'GCP',
    createdAt: '2023-05-01T07:20:00',
    createdBy: 'network-admin',
    lastHeartbeat: '2025-04-28T09:50:00',
    longitude: 139.6917,
    latitude: 35.6895
  }
];

const transformedPoints = computed(() => {
  return points.map(point => ({
    ...point,
    value: [point.longitude, point.latitude],
    id: point.nodeId,
  }));
});

const { useMock } = useGlobalConfig();
const router = useRouter();

const nodes = ref([]);
const filters = ref({ status: '', role: '', cloudProvider: '' });

const mockData = [
  { nodeId: 1, nickname: 'Node A', status: 'ONLINE', role: 'VPS_TE', cloudProvider: 'aws' },
  { nodeId: 2, nickname: 'Node B', status: 'OFFLINE', role: 'VPS_RELAY', cloudProvider: 'gcp' },
  { nodeId: 3, nickname: 'Node C', status: 'ONLINE', role: 'VPS_RELAY', cloudProvider: 'azure' },
  { nodeId: 4, nickname: 'Node D', status: 'DESTROYING', role: 'VPS_TE', cloudProvider: 'aws' }
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
