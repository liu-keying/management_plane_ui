<template>
  <div>
    <div id="worldgraph"></div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" width="30%">
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import worldData from '@/assets/json/world.json';

// ✅ 接收 props
const props = defineProps({
  points: {
    type: Array,
    required: true
  },
  lineConnections: {
    type: Array,
    required: true
  }
});

const router = useRouter();

const dialogVisible = ref(false);
const tooltipData = ref({});

const worldGraph = ref(null);
let mapRegistered = false;
let resizeHandler = null;

// ✅ 根据 props 动态生成线数据
const lines = ref([]);

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
        data: props.points
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
      }
    ]
  };

  worldGraph.value.setOption(option);

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

onMounted(() => {
  // 先生成 lines 数据
  generateLines();
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

// ✅ 根据传入的 points 和 lineConnections 自动算 lines
const generateLines = () => {
  lines.value = props.lineConnections.map(([fromId, toId], index) => {
    const from = props.points.find(p => p.id === fromId);
    const to = props.points.find(p => p.id === toId);
    if (from && to) {
      return {
        id: index + 1,
        from,
        to,
        coords: [from.value, to.value]
      };
    }
  }).filter(Boolean);
};

// ✅ 监听传入的数据变化（比如父组件动态更新 points / lines）
watch(() => [props.points, props.lineConnections], () => {
  if (worldGraph.value) {
    generateLines();
    initChart();
  }
});
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
