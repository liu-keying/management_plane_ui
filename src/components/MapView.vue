<template>
  <div>
    <div id="worldgraph"></div>

    <!-- 弹窗显示 -->
    <!-- <el-dialog v-model="dialogVisible" title="详情" width="30%"> -->
    <el-dialog v-model="dialogVisible"  width="30%">
      <div v-if="tooltipData.type === 'point'" class="dialog-content">
        <p><span class="label">节点名称:</span> {{ tooltipData.data.name }}</p>
        <p><span class="label">IP地址:</span> {{ tooltipData.data.ipaddress }}</p>
        <p><span class="label">角色:</span> {{ tooltipData.data.role }}</p>
        <p><span class="label">状态:</span> {{ tooltipData.data.status }}</p>
      </div>
      <div v-else-if="tooltipData.type === 'line'" class="dialog-content">
        <p><span class="label">连接:</span> {{ tooltipData.from.name }} → {{ tooltipData.to.name }}</p>
        <p><span class="label">源 IP:</span> {{ tooltipData.from.ipaddress }}</p>
        <p><span class="label">目标 IP:</span> {{ tooltipData.to.ipaddress }}</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleDetailClick">详情</el-button>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import worldData from '@/assets/json/world.json';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const dialogVisible = ref(false);
const tooltipData = ref({});

const worldGraph = ref(null);
let mapRegistered = false;
let resizeHandler = null;

const points = [
  { id: 1, name: '节点 A', ipaddress: '118.24.56.101', role: 'CLIENT', status: 'ONLINE', value: [-97.822, 52.751] },
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

const lines = lineConnections.map(([fromId, toId], index) => {
  const from = points.find(p => p.id === fromId);
  const to = points.find(p => p.id === toId);
  if (from && to) {
    return {
      id: index + 1, // 给每条线一个 id 用于跳转
      from,
      to,
      coords: [from.value, to.value]
    };
  }
}).filter(Boolean);

const goToNodeDetail = (id) => {
  router.push(`/node/${id}`);
};

const goToLinkDetail = (id) => {
  router.push(`/link/${id}`);
};

const handleDetailClick = () => {
  if (tooltipData.value.type === 'point') {
    goToNodeDetail(tooltipData.value.data.id);
  } else if (tooltipData.value.type === 'line') {
    goToLinkDetail(tooltipData.value.id);
  }
};


onMounted(() => {
  initChart();

  resizeHandler = () => {
    if (worldGraph.value) worldGraph.value.resize();
  };
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  if (worldGraph.value) worldGraph.value.dispose();
  window.removeEventListener('resize', resizeHandler);
});

const initChart = () => {
  if (!document.getElementById('worldgraph')) return;

  if (!mapRegistered) {
    echarts.registerMap('world', worldData);
    mapRegistered = true;
  }

  worldGraph.value = echarts.init(document.getElementById('worldgraph'));

  const option = {
    geo: {
      type: 'map',
      map: 'world',
      roam: true,
      zoom: 1,
      scaleLimit: { min: 1, max: 10 },
      itemStyle: {
        areaColor: '#E0F7FA',
        borderColor: '#90CAF9'
      },
      emphasis: {
        itemStyle: {
          areaColor: '#A0C4FF',
          borderColor: '#CEE0E7'
        }
      }
    },
    tooltip: {
      trigger: 'item',
      enterable: false,
      formatter: function (params) {
        if (params.seriesType === 'scatter') {
          return `<strong>节点:</strong> ${params.data.name}`;
        }
        if (params.seriesType === 'lines') {
          const from = params.data.from?.name || '未知';
          const to = params.data.to?.name || '未知';
          return `<strong>链路:</strong> ${from} → ${to}`;
        }
        // 对于地图区域，params.seriesType 为 undefined，也没有 data，直接返回空字符串
        return '';
      }
    },
    series: [
      {
        name: 'Points',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 10,
        itemStyle: { color: '#FF6F61' },
        data: points
      },
      {
        name: 'Connections',
        type: 'lines',
        coordinateSystem: 'geo',
        effect: {
          show: true,
          symbol: 'arrow',
          symbolSize: 6,
          color: '#2196F3'
        },
        lineStyle: {
          color: '#2196F3',
          width: 2,
          opacity: 0.7,
          curveness: 0
        },
        data: lines
      }
    ]
  };

  worldGraph.value.setOption(option);

  // 事件绑定
  worldGraph.value.on('click', (params) => {
    if (params.seriesType === 'scatter' && params.data) {
      tooltipData.value = {
        type: 'point',
        data: params.data
      };
      dialogVisible.value = true;
    } else if (params.seriesType === 'lines' && params.data) {
      tooltipData.value = {
        type: 'line',
        from: params.data.from,
        to: params.data.to,
        id: params.data.id
      };
      dialogVisible.value = true;
    }
  });
};
</script>

<style scoped>
#worldgraph {
  width: 100%;
  height: 600px;
  position: relative;
}

.dialog-content {
  font-size: 16px;
  line-height: 1.8;
  padding: 10px 0;
  color: #333;
}

.dialog-content .label {
  font-weight: 600;
  color: #409EFF;
  margin-right: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
