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
            <span>告警信息</span>
            <router-link to="/alert" class="more-link">更多</router-link>
          </div>
        </template>
        <alertlist />
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
import Situation from "@/components/situationlist.vue";

const stats = [
  { label: '活跃节点', value: 12, type: 'active' },
  { label: '节点总数', value: 34, type: 'node' },
  { label: '活跃链路', value: 45, type: 'active-2' },
  { label: '链路总数', value: 56, type: 'link' },
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
  [3, 4],
  [5, 4],
  [3, 6],
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
