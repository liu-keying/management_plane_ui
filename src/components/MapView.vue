<template>
  <div>
    <div ref="chartRef" id="worldgraph"></div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" width="30%">
      <div v-if="tooltipData.type === 'point'" class="dialog-content">
        <p><span class="label">节点 ID:</span> {{ tooltipData.data.nodeId }}</p>
        <p><span class="label">节点昵称:</span> {{ tooltipData.data.nickname }}</p>
        <p><span class="label">指纹:</span> {{ tooltipData.data.fingerprint }}</p>
        <p><span class="label">IP 地址:</span> {{ tooltipData.data.ipAddress }}</p>
        <p><span class="label">角色:</span> {{ tooltipData.data.role }}</p>
        <p><span class="label">状态:</span> {{ tooltipData.data.status }}</p>
        <p><span class="label">风险等级:</span> {{ tooltipData.data.riskLevel }}</p>

        <p><span class="label">CPU 使用率:</span> {{ tooltipData.data.cpuUsage }}%</p>
        <p><span class="label">内存使用率:</span> {{ tooltipData.data.memoryUsage }}%</p>

        <p><span class="label">流入流量:</span> {{ formatBytes(tooltipData.data.trafficIn) }}</p>
        <p><span class="label">流出流量:</span> {{ formatBytes(tooltipData.data.trafficOut) }}</p>

        <p><span class="label">地理位置:</span> {{ tooltipData.data.geoLocation }}</p>
        <p><span class="label">云服务商:</span> {{ tooltipData.data.cloudProvider }}</p>

        <p><span class="label">创建时间:</span> {{ formatDate(tooltipData.data.createdAt) }}</p>
        <p><span class="label">创建人:</span> {{ tooltipData.data.createdBy }}</p>
        <p><span class="label">最近心跳:</span> {{ formatDate(tooltipData.data.lastHeartbeat) }}</p>
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
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import worldData from '@/assets/json/world.json';
import { formatBytes, formatDate } from '@/utils/formatters';

// props 和 emit
const props = defineProps({
  points: { type: Array, required: true },
  lineConnections: { type: Array, default: () => [] },
  selectedNodeIds: { type: Array, default: () => [] }
});
const emit = defineEmits(['selectPoint']);

const router = useRouter();

const dialogVisible = ref(false);
const tooltipData = ref({});

const worldGraph = ref(null);
const chartRef = ref(null);
let mapRegistered = false;
let observer = null;

const lines = ref([]);

const goToNodeDetail = (nodeId) => {
  router.push(`/node/${nodeId}`);
};

const goToLinkDetail = (linkId) => {
  router.push(`/link/${linkId}`);
};

const handleDetailClick = () => {
  if (tooltipData.value.type === 'point') {
    goToNodeDetail(tooltipData.value.data.nodeId);
  } else if (tooltipData.value.type === 'line') {
    goToLinkDetail(tooltipData.value.linkId);
  }
};

const initChart = () => {
  if (!chartRef.value) return;

  if (!mapRegistered) {
    echarts.registerMap('world', worldData);
    mapRegistered = true;
  }

  worldGraph.value = echarts.init(chartRef.value);
  setChartOption();

  worldGraph.value.on('click', (params) => {
    if (params.seriesType === 'scatter' && params.data) {
      emit('selectPoint', params.data);
      tooltipData.value = { type: 'point', data: params.data };
      dialogVisible.value = true;
    } else if (params.seriesType === 'lines' && params.data) {
      tooltipData.value = {
        type: 'line',
        from: params.data.from,
        to: params.data.to,
        linkId: params.data.linkId
      };
      dialogVisible.value = true;
    }
  });
};

const setChartOption = () => {
  if (!worldGraph.value) return;

  const normalPoints = props.points.map(p => ({
    ...p,
    itemStyle: {
      color: props.selectedNodeIds.includes(p.nodeId) ? '#00C853' : '#FF6F61'
    }
  }));

  const selectedPoints = props.points.filter(p => props.selectedNodeIds.includes(p.nodeId));
  const selectedLines = [];
  for (let i = 0; i < selectedPoints.length; i++) {
    for (let j = i + 1; j < selectedPoints.length; j++) {
      selectedLines.push({
        coords: [selectedPoints[i].value, selectedPoints[j].value],
        from: selectedPoints[i],
        to: selectedPoints[j]
      });
    }
  }

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
          return `<strong>节点</strong> ${params.data.nodeId}`;
        }
        if (params.seriesType === 'lines') {
          const from = params.data.from?.name || '未知';
          const to = params.data.to?.name || '未知';
          return `<strong>链路</strong> ${params.data.linkId}`;
        }
        return '';
      }
    },
    series: [
      {
        name: 'Points',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 10,
        data: normalPoints
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
        data: lines.value
      },
      {
        name: 'SelectedLines',
        type: 'lines',
        coordinateSystem: 'geo',
        lineStyle: {
          color: '#00C853',
          width: 2,
          opacity: 0.9
        },
        data: selectedLines
      }
    ]
  };

  worldGraph.value.setOption(option, true);
};

const resizeChart = () => {
  nextTick(() => {
    if (worldGraph.value) {
      worldGraph.value.resize();
    }
  });
};

const generateLines = () => {
  lines.value = props.lineConnections.map(([fromId, toId], index) => {
    const from = props.points.find(p => p.nodeId === fromId);
    const to = props.points.find(p => p.nodeId === toId);
    if (from && to) {
      return {
        linkId: index + 1,
        from,
        to,
        coords: [from.value, to.value]
      };
    }
  }).filter(Boolean);
};

onMounted(async () => {
  generateLines();
  await nextTick();
  initChart();

  observer = new ResizeObserver(() => {
    resizeChart();
  });
  if (chartRef.value) {
    observer.observe(chartRef.value);
  }
});

onUnmounted(() => {
  if (worldGraph.value) worldGraph.value.dispose();
  if (observer && chartRef.value) observer.unobserve(chartRef.value);
});

// 父组件变化，刷新图表
watch(
  () => [props.points, props.lineConnections, props.selectedNodeIds],
  () => {
    if (worldGraph.value) {
      generateLines();
      setChartOption();
    }
  },
  { deep: true }
);
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
