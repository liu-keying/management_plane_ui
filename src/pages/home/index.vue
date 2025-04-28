<template>
  <el-row :gutter="20" class="top-row">

    <el-col :span="18">
      <!-- <el-card class="tall-card"> -->
      <MapView :points="points" :lineConnections="lineConnections"/>
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
  { id: 1, name: '节点 A', ipaddress: '118.24.56.101', role: 'CLIENT', status: 'ONLINE', value: [116.4,39.9] },
  { id: 2, name: '节点 B', ipaddress: '156.234.72.99', role: 'VPS_RELAY', status: 'OFFLINE', value: [120, 30] },
  { id: 3, name: '节点 C', ipaddress: '103.45.98.12', role: 'VPS_TE', status: 'DESTROYING', value: [104.195, 35.8617] },
  { id: 4, name: '节点 D', ipaddress: '139.224.8.33', role: 'CLIENT', status: 'ONLINE', value: [-74.006, 40.7128] },
  { id: 5, name: '节点 E', ipaddress: '120.27.12.55', role: 'CLIENT', status: 'ONLINE', value: [-50.4074, -24.9042] },
  { id: 6, name: '节点 F', ipaddress: '104.193.88.121', role: 'VPS_RELAY', status: 'DESTROYING', value: [110, 40] },
  { id: 7, name: '节点 G', ipaddress: '185.220.101.14', role: 'VPS_RELAY', status: 'OFFLINE', value: [120.195, 35.8617] }
];

const lineConnections = [
  [1, 2],
  [1, 4],
  [5, 4],
  [3, 6],
  [6, 1]
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
