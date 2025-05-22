<template>
  <el-row :gutter="20" class="top-row">

    <el-col :span="18">
      <!-- <el-card class="tall-card"> -->
      <MapView :points="transformedPoints" :lineConnections="lineConnections"/>
      <!-- </el-card> -->
    </el-col>
    <el-col :span="6">
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <span>网络状态概览</span>
          </div>
        </template>

        <el-row :gutter="20" class="stat-items">
          <el-col :span="12" v-for="item in stats" :key="item.label">
            <div class="stat-box" :class="item.type">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="bottom-row" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>节点列表</span>
            <router-link to="/node" class="more-link">更多</router-link>
          </div>
        </template>
        <nodelist :list="points" />
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>链路列表</span>
            <router-link to="/link" class="more-link">更多</router-link>
          </div>
        </template>
        <linklist />
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="bottom-row" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>用户信息</span>
            <router-link to="/user" class="more-link">更多</router-link>
          </div>
        </template>
        <userlist />
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>态势感知</span>
            <router-link to="/situation" class="more-link">更多</router-link>
          </div>
        </template>
        <Situation />
      </el-card>
    </el-col>
  </el-row>

</template>


<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import MapView from "@/components/MapView.vue";
import nodelist from "@/components/nodelist.vue"
import linklist from "@/components/linklist.vue"
import alertlist from "@/components/alertlist.vue"
import userlist from "@/components/userlist.vue"
import Situation from "@/components/situationlist.vue";

const stats = [
  { label: '活跃节点', value: 12, type: 'active' },
  { label: '节点总数', value: 15, type: 'node' },
  { label: '活跃链路', value: 2, type: 'active-2' },
  { label: '链路总数', value: 5, type: 'link' },
  { label: '故障告警', value: 3, type: 'alert' },
  { label: '用户总数', value: 13, type: 'user' },
];

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
  },
  {
    nodeId: 6,
    nickname: 'relay-x',
    fingerprint: 'aa11bb22cc33dd44',
    ipAddress: '10.1.1.6',
    role: 'VPS_RELAY',
    status: 'ONLINE',
    riskLevel: 1,
    cpuUsage: 40.3,
    memoryUsage: 52.5,
    trafficIn: 950000,
    trafficOut: 430000,
    geoLocation: 'London, UK',
    cloudProvider: 'AWS',
    createdAt: '2023-02-11T10:00:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T08:45:00',
    longitude: -0.1276,
    latitude: 51.5074
  },
  {
    nodeId: 7,
    nickname: 'testNode7',
    fingerprint: 'fgh987poi654lkj321',
    ipAddress: '10.5.5.7',
    role: 'CLIENT',
    status: 'OFFLINE',
    riskLevel: 3,
    cpuUsage: 91.2,
    memoryUsage: 87.3,
    trafficIn: 2200000,
    trafficOut: 1300000,
    geoLocation: 'Paris, France',
    cloudProvider: 'OVH',
    createdAt: '2023-04-25T16:00:00',
    createdBy: 'security-bot',
    lastHeartbeat: '2025-04-27T22:30:00',
    longitude: 2.3522,
    latitude: 48.8566
  },
  {
    nodeId: 8,
    nickname: 'relayAlpha',
    fingerprint: 'abcd1111efgh2222',
    ipAddress: '172.16.88.8',
    role: 'VPS_RELAY',
    status: 'DESTROYING',
    riskLevel: 1,
    cpuUsage: 48.6,
    memoryUsage: 60.2,
    trafficIn: 1600000,
    trafficOut: 840000,
    geoLocation: 'Berlin, Germany',
    cloudProvider: 'Hetzner',
    createdAt: '2023-08-01T13:00:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-26T11:00:00',
    longitude: 13.405,
    latitude: 52.52
  },
  {
    nodeId: 9,
    nickname: 'us-client-9',
    fingerprint: '9988aabbccddeeff',
    ipAddress: '192.168.9.9',
    role: 'CLIENT',
    status: 'ONLINE',
    riskLevel: 0,
    cpuUsage: 20.1,
    memoryUsage: 33.5,
    trafficIn: 300000,
    trafficOut: 150000,
    geoLocation: 'San Francisco, USA',
    cloudProvider: 'AWS',
    createdAt: '2023-10-10T19:00:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T09:20:00',
    longitude: -122.4194,
    latitude: 37.7749
  },
  {
    nodeId: 10,
    nickname: 'asia-relay',
    fingerprint: '1122ee33ff44gg55',
    ipAddress: '10.10.10.10',
    role: 'VPS_RELAY',
    status: 'OFFLINE',
    riskLevel: 3,
    cpuUsage: 79.4,
    memoryUsage: 90.0,
    trafficIn: 2500000,
    trafficOut: 1600000,
    geoLocation: 'Seoul, South Korea',
    cloudProvider: 'Naver Cloud',
    createdAt: '2023-11-15T21:30:00',
    createdBy: 'system',
    lastHeartbeat: '2025-04-27T07:30:00',
    longitude: 126.978,
    latitude: 37.5665
  },
  {
    nodeId: 11,
    nickname: 'fast-client',
    fingerprint: 'pqr789stu012vwx345',
    ipAddress: '192.0.2.11',
    role: 'CLIENT',
    status: 'ONLINE',
    riskLevel: 1,
    cpuUsage: 36.7,
    memoryUsage: 55.1,
    trafficIn: 800000,
    trafficOut: 400000,
    geoLocation: 'Toronto, Canada',
    cloudProvider: 'Oracle Cloud',
    createdAt: '2023-09-01T10:10:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T10:10:00',
    longitude: -79.3832,
    latitude: 43.6532
  },
  {
    nodeId: 12,
    nickname: 'node12',
    fingerprint: 'bcd234efg567hij890',
    ipAddress: '198.51.100.12',
    role: 'VPS_TE',
    status: 'DESTROYING',
    riskLevel: 2,
    cpuUsage: 59.2,
    memoryUsage: 66.7,
    trafficIn: 1400000,
    trafficOut: 770000,
    geoLocation: 'Singapore',
    cloudProvider: 'DigitalOcean',
    createdAt: '2023-12-01T15:00:00',
    createdBy: 'root',
    lastHeartbeat: '2025-04-26T15:00:00',
    longitude: 103.8198,
    latitude: 1.3521
  },
  {
    nodeId: 13,
    nickname: 'r13',
    fingerprint: 'xxx999yyy888zzz777',
    ipAddress: '203.0.113.13',
    role: 'VPS_RELAY',
    status: 'ONLINE',
    riskLevel: 1,
    cpuUsage: 38.9,
    memoryUsage: 42.0,
    trafficIn: 1100000,
    trafficOut: 600000,
    geoLocation: 'Sydney, Australia',
    cloudProvider: 'Azure',
    createdAt: '2023-07-20T17:30:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T08:20:00',
    longitude: 151.2093,
    latitude: -33.8688
  },
  {
    nodeId: 14,
    nickname: 'relay-n14',
    fingerprint: 'hgf432lkj765poi098',
    ipAddress: '203.0.113.14',
    role: 'VPS_RELAY',
    status: 'OFFLINE',
    riskLevel: 3,
    cpuUsage: 93.2,
    memoryUsage: 82.4,
    trafficIn: 3000000,
    trafficOut: 2200000,
    geoLocation: 'Delhi, India',
    cloudProvider: 'AWS',
    createdAt: '2023-03-03T12:45:00',
    createdBy: 'system',
    lastHeartbeat: '2025-04-27T06:40:00',
    longitude: 77.1025,
    latitude: 28.7041
  },
  {
    nodeId: 15,
    nickname: 'edge-client-15',
    fingerprint: 'aabbccddeeffgghh',
    ipAddress: '192.0.2.15',
    role: 'CLIENT',
    status: 'ONLINE',
    riskLevel: 0,
    cpuUsage: 27.4,
    memoryUsage: 40.3,
    trafficIn: 420000,
    trafficOut: 210000,
    geoLocation: 'Los Angeles, USA',
    cloudProvider: 'GCP',
    createdAt: '2023-08-18T11:30:00',
    createdBy: 'admin',
    lastHeartbeat: '2025-04-28T09:40:00',
    longitude: -118.2437,
    latitude: 34.0522
  }
];


const transformedPoints = computed(() => {
  return points.map(point => ({
    ...point,
    value: [point.longitude, point.latitude],
    id: point.nodeId,
  }));
});


const lineConnections = [
  [1, 2],
  [5, 13],
  [5, 7],
  [13, 6],
  [5, 15]
];

</script>

<style scoped>
.overview-card {
  height: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.card {
  height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.card .el-card__body {
  height: 100%;
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.more-link {
  font-size: 14px;
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

.stats-card {
  height: 100%;
}

.stat-items {
  padding: 10px;
  margin-bottom: 20px;
  /* 整体下边距 */
}

.stat-box {
  background-color: #f5f8ff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  height: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  /* 控制每行之间的间距 */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-box:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
}

/* 可选：不同类别高亮样式 */
.stat-box.active {
  background-color: #E0F2F1;  /* 浅绿蓝 */
  color: #00796B;             /* 墨绿色 */
}

.stat-box.node {
  background-color: #E3F2FD;  /* 浅蓝 */
  color: #1976D2;             /* 亮蓝 */
}

.stat-box.link {
  background-color: #EDE7F6;  /* 淡紫 */
  color: #5E35B1;             /* 深紫 */
}

.stat-box.alert {
  background-color: #FFEBEE;  /* 粉红 */
  color: #D32F2F;             /* 红色警告 */
}

.stat-box.user {
  background-color: #FFF3E0;  /* 淡橙 */
  color: #EF6C00;             /* 橙色强调 */
}

.stat-box.active-2 {
  background-color: #F1F8E9;  /* 淡绿色 */
  color: #558B2F;             /* 苔绿色 */
}

/* .short-card {
  height: 600px; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
} */
</style>
