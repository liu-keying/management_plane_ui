<template>
    <div>
      <div id="worldgraph"></div>
  
      <!-- 弹窗 -->
      <el-dialog v-model="dialogVisible" title="节点详情" width="30%">
        <p><strong>ID:</strong> {{ selectedPoint.id }}</p>
        <p><strong>Name:</strong> {{ selectedPoint.name }}</p>
        <p><strong>Coordinates:</strong> {{ selectedPoint.value?.[0] }}, {{ selectedPoint.value?.[1] }}</p>
        <template #footer>
          <span class="dialog-footer">
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
import { ElDialog, ElButton } from 'element-plus';

const worldGraph = ref(null);
let mapRegistered = false;

const dialogVisible = ref(false);
const selectedPoint = ref({});

let resizeHandler = null;

onMounted(() => {
  initData();

  resizeHandler = () => {
    if (worldGraph.value) worldGraph.value.resize();
  };
  window.addEventListener('resize', resizeHandler);
});

onUnmounted(() => {
  if (worldGraph.value) {
    worldGraph.value.dispose();
    worldGraph.value = null;
  }
  window.removeEventListener('resize', resizeHandler);
});

const initData = () => {
  if (worldGraph.value) {
    worldGraph.value.dispose();
    worldGraph.value = null;
  }

  const points = [
    { id: 'example1', name: 'Node A', value: [-97.822, 52.751] },
    { id: 'example2', name: 'Node B', value: [120, 30] },
    { id: 'example3', name: 'Node C', value: [104.195, 35.8617] },
    { id: 'example4', name: 'Node D', value: [-74.006, 40.7128] }
  ];

  const lines = points.map((point, index) => {
    if (index < points.length - 1) {
      return {
        coords: [point.value, points[index + 1].value]
      };
    }
  }).filter(Boolean);

  drawnWorldChart(points, lines);
};

const drawnWorldChart = (points, lines) => {
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
      zoom: 1.2,
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
      formatter: params => {
        if (params.data) {
          return `ID: ${params.data.id}<br/>Name: ${params.data.name}<br/>Coordinates: ${params.data.value[0]}, ${params.data.value[1]}`;
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
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#333'
        },
        itemStyle: {
          color: '#FF6F61'
        },
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
          curveness: 0.1
        },
        data: lines
      }
    ]
  };

  worldGraph.value.setOption(option);

  // 添加点击事件
  worldGraph.value.on('click', function (params) {
    if (params.seriesType === 'scatter' && params.data) {
      selectedPoint.value = params.data;
      dialogVisible.value = true;
    }
  });
};

  </script>
  
  <style scoped>
  #worldgraph {
    width: 100%;
    height: 600px;
  }
  </style>
  