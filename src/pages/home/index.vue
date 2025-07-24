<template>
  <el-row :gutter="20" class="top-row">
    <el-col :span="18">
      <!-- <el-card class="tall-card"> -->
      <MapView :points="nodes" :lineConnections='lineConnections' />
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

  <!-- <el-row :gutter="20" class="bottom-row" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>节点列表</span>
            <router-link to="/node" class="more-link">更多</router-link>
          </div>
        </template>
        <nodelist :list="nodes" />
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
        <linklist :list="links" />
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="20" class="bottom-row" style="margin-top: 20px;">
    <el-col :span="12">
      <el-card class="card">
        <template #header>
          <div class="card-header">
            <span>用户信息</span>
            <router-link to="/users" class="more-link">更多</router-link>
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
  </el-row> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import MapView from "@/components/MapView.vue";
import nodelist from "@/components/nodelist.vue";
import linklist from "@/components/linklist.vue";
import alertlist from "@/components/alertlist.vue";
import userlist from "@/components/userlist.vue";
import Situation from "@/components/situationlist.vue";

import { fetchNodes, type NodeItem } from '@/api/node'
import { fetchLinks, type LinkItem} from '@/api/link'



const stats = computed(() => [
  {
    label: '活跃节点',
    value: nodes.value.filter((n: { status: string; }) => n.status === 'ONLINE').length,
    type: 'active',
  },
  {
    label: '节点总数',
    value: nodes.value.length,
    type: 'node',
  },
  {
    label: '活跃链路',
    value: links.value.filter((l: { status: string; }) => l.status === 'ACTIVE').length,
    type: 'active-2',
  },
  {
    label: '链路总数',
    value: links.value.length,
    type: 'link',
  },
  {
    label: '故障告警',
    value: alerts.value.length,
    type: 'alert',
  },
  {
    label: '用户总数',
    value: users.value.length,
    type: 'user',
  },
]);


const nodes = ref<NodeItem[]>([])
const links = ref<LinkItem[]>([]);
const alerts = ref([1]);
const users = ref([1,2,3,4,5]);
const lineConnections = computed(() => 
  links.value
    .map(link => {
      const source = link.sourceRelayId;
      const target = link.relayIds[link.relayIds.length - 1];
      return source && target ? [source, target] : null;
    })
    .filter((pair): pair is [string, string] => pair !== null)
);

// 定义刷新间隔，单位为毫秒
const refreshInterval = ref(5000); // 默认为5秒

// 定义定时器ID
let intervalId: number | undefined;

// 在组件挂载时获取数据
onMounted(async () => {
  nodes.value = await fetchNodes({});
  links.value = await fetchLinks({});

  // 设置定时器，根据refreshInterval的值来刷新数据
  intervalId = setInterval(async () => {
    nodes.value = await fetchNodes({});
    links.value = await fetchLinks({});
  }, refreshInterval.value);
})

// 在组件卸载时清除定时器
onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

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
}

.stat-box {
  background-color: #f5f8ff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  height: 120px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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

.stat-box.active {
  background-color: #E0F2F1;
  color: #00796B;
}

.stat-box.node {
  background-color: #E3F2FD;
  color: #1976D2;
}

.stat-box.link {
  background-color: #EDE7F6;
  color: #5E35B1;
}

.stat-box.alert {
  background-color: #FFEBEE;
  color: #D32F2F;
}

.stat-box.user {
  background-color: #FFF3E0;
  color: #EF6C00;
}

.stat-box.active-2 {
  background-color: #F1F8E9;
  color: #558B2F;
}
</style>