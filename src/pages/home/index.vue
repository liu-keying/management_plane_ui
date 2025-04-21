<template>
  <el-row :gutter="20" class="top-row">

    <el-col :span="18">
      <!-- <el-card class="tall-card"> -->
      <MapView />
      <!-- </el-card> -->
    </el-col>
    <el-col :span="6">
      <el-card class="card">
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
        <nodelist />
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
import nodelist from "@/pages/home/nodelist.vue"
import linklist from "@/pages/home/linklist.vue"
import alertlist from "@/pages/home/alertlist.vue"
import Situation from "@/pages/home/situation.vue";

const stats = [
  { label: '活跃节点', value: 12, type: 'active' },
  { label: '节点总数', value: 34, type: 'total' },
  { label: '链路数量', value: 56, type: 'link' },
  { label: '告警数量', value: 3, type: 'alert' }
];

</script>

<style scoped>
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
  background-color: #e0f7fa;
  color: #00796b;
}

.stat-box.total {
  background-color: #e3f2fd;
  color: #1565c0;
}

.stat-box.link {
  background-color: #f3e5f5;
  color: #6a1b9a;
}

.stat-box.alert {
  background-color: #ffebee;
  color: #c62828;
}

/* .short-card {
  height: 600px; 
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
} */
</style>
