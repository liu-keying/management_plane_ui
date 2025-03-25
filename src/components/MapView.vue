<template>
  <div>
      <div id="worldgraph"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import worldData from '@/assets/json/world.json';
import { ref, onMounted, onUnmounted } from 'vue';

const worldGraph = ref(null);

onMounted(() => {
  initData();
});

onUnmounted(() => {
  if (worldGraph.value) {
      worldGraph.value.dispose();
      worldGraph.value = null;
  }
});

const initData = () => {
  if (worldGraph.value) {
      worldGraph.value.dispose();
      worldGraph.value = null;
  }
  
  const point = [
      { id: "example2", value: [120, 30] },
      { id: "example3", value: [104.195, 35.8617] },
      { id: "example4", value: [-74.0060, 40.7128] },
      { id: "example1", value: [-97.822, 37.751 + 15], type: 'iconData' }
  ];
  
  drawnWorldChart(point);
};

const drawnWorldChart = (point) => {
  if (!document.getElementById('worldgraph')) {
      return;
  }
  
  echarts.registerMap('world', JSON.stringify(worldData));
  worldGraph.value = echarts.init(document.getElementById('worldgraph'));
  
  let option = {
      grid: {
          width: '100%',
          height: '100%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
      },
      geo: {
          type: 'map',
          map: 'world',
          aspectScale: 0.85,
          emphasis: {
              label: { show: false },
              itemStyle: {
                  areaColor: '#A0C4FF',
                  borderColor: '#CEE0E7',
              }
          },
          zoom: 1.2,
          itemStyle: {
              areaColor: '#A0C4FF',
              borderColor: '#CEE0E7',
          },
      },
      tooltip: {
          trigger: 'item',
          formatter: (params) => {
              if (params.data) {
                  return `ID: ${params.data.id}<br/>Coordinates: ${params.data.value[0]}, ${params.data.value[1]}`;
              }
              return '';
          }
      },
      series: [
          {
              type: 'scatter',
              coordinateSystem: 'geo',
              symbolSize: 10,
              label: {
                  show: false,
              },
              data: point,
          }
      ]
  };
  
  worldGraph.value.setOption(option);
};
</script>

<style scoped>
#worldgraph {
  width: 100%;
  height: 600px;
}
</style>