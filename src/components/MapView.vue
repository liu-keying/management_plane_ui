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

// const goToNodeDetail = (nodeId) => {
//   router.push(`/node/${nodeId}`);
// };

// const goToLinkDetail = (linkId) => {
//   router.push(`/link/${linkId}`);
// };

const handleDetailClick = () => {
  if (tooltipData.value.type === 'point') {
    goToNodeDetail(tooltipData.value.data.nodeId);
  } else if (tooltipData.value.type === 'line') {
    goToLinkDetail(tooltipData.value.linkId);
  }
};

// 将geoLocation转换为坐标
const convertGeoLocationToCoords = (geoLocation) => {
  if (!geoLocation) return [116.4074, 39.9042]; // 默认北京坐标

  // 直接匹配
  if (locationMap[geoLocation]) {
    return locationMap[geoLocation];
  }

  // 模糊匹配
  const fuzzyMatch = Object.keys(locationMap).find(key =>
    key.toLowerCase().includes(geoLocation.toLowerCase()) ||
    geoLocation.toLowerCase().includes(key.toLowerCase())
  );

  if (fuzzyMatch) {
    return locationMap[fuzzyMatch];
  }

  // 如果都没匹配到，返回默认坐标
  console.warn(`未找到地理位置 "${geoLocation}" 的坐标，使用默认坐标`);
  return [116.4074, 39.9042]; // 默认北京坐标
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

// 处理点数据，转换地理位置为坐标
const processPoints = (points) => {
  return points.map(p => {
    const coords = p.value || convertGeoLocationToCoords(p.geoLocation);
    return {
      ...p,
      value: coords, // 确保使用转换后的坐标
      // itemStyle: {
      //   color: props.selectedNodeIds.includes(p.nodeId) ? '#00C853' : '#FF6F61'
      // }
    };
  });
};


const setChartOption = () => {
  if (!worldGraph.value) return;

  const normalPoints = processPoints(props.points);
  const userPoints = processPoints(users);

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
    legend: {
      data: ['relay', 'user'],
      // left: 'left',
      bottom: '10px'
    },
    series: [
      // {
      //   name: 'Points',
      //   type: 'scatter',
      //   coordinateSystem: 'geo',
      //   symbolSize: 10,
      //   data: normalPoints
      // },
      {
        name: 'relay',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: 10,
        data: normalPoints,
        itemStyle: {
          color: '#FF6F61',
          shadowBlur: 10,
          shadowColor: '#FF6F61'
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      },
      {
        name: 'user',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: 10,
        data: userPoints,
        itemStyle: {
          color: '#00C853',
          shadowBlur: 10,
          shadowColor: '#00C853'
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
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
          opacity: 0.8,
          curveness: 0.2
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
  const processedPoints = processPoints(props.points);
  lines.value = props.lineConnections.map(([fromId, toId], index) => {
    const from = processedPoints.find(p => p.nodeId === fromId);
    const to = processedPoints.find(p => p.nodeId === toId);
    if (from && to) {
      return {
        linkId: index + 1,
        from,
        to,
        coords: [from.value, to.value]
      };
    }
    return null;
  }).filter(Boolean);
};


onMounted(async () => {
  generateLines();
  // console.log('props.points', props.points);
  // console.log('props.lineConnections', props.lineConnections);
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

// 地理位置映射表
const locationMap = {
  "Beijing": [116.4074, 39.9042],
  "Shanghai": [121.4737, 31.2304],
  "Guangzhou": [113.2644, 23.1291],
  "Shenzhen": [114.0579, 22.5431],
  "Hangzhou": [120.1551, 30.2741],
  "Nanjing": [118.7969, 32.0603],
  "Wuhan": [114.2919, 30.5994],
  "Chengdu": [104.0668, 30.5728],
  "Xi'an": [108.9402, 34.3416],
  "Chongqing": [106.5516, 29.5630],
  "Tianjin": [117.1901, 39.1235],
  "Shenyang": [123.4328, 41.8057],
  "Changsha": [112.9388, 28.2282],
  "Zhengzhou": [113.6254, 34.7466],
  "Jinan": [117.0009, 36.6758],
  "Hong Kong": [114.1620, 22.2810],
  // 国外主要城市
  "New York": [-74.0060, 40.7128],
  "London, UK": [-0.1276, 51.5074],
  "Tokyo": [139.6503, 35.6762],
  "Paris": [2.3522, 48.8566],
  "Berlin": [13.4050, 52.5200],
  "Moscow": [37.6173, 55.7558],
  "Sydney": [151.2093, -33.8688],
  "Toronto": [-79.3832, 43.6532],
  "Singapore": [103.8198, 1.3521],
  "Seoul": [126.9780, 37.5665],
  "Mumbai": [72.8777, 19.0760],
  "Dubai": [55.2708, 25.2048],
  "Los Angeles": [-118.2437, 34.0522],
  "San Francisco": [-122.4194, 37.7749],
  "Washington DC": [-77.0369, 38.9072],
  "Chicago": [-87.6298, 41.8781],
  "Boston": [-71.0589, 42.3601],
  "Miami": [-80.1918, 25.7617],
  "Vancouver": [-123.1207, 49.2827],
  "Frankfurt": [8.6821, 50.1109],
  "Amsterdam": [4.9041, 52.3676],
  "Stockholm": [18.0686, 59.3293],
  "Zurich": [8.5417, 47.3769],
  "Vienna": [16.3738, 48.2082],
  "Rome": [12.4964, 41.9028],
  "Madrid": [-3.7038, 40.4168],
  "Barcelona": [2.1734, 41.3851],
  "Milan": [9.1900, 45.4642],
  "Munich": [11.5820, 48.1351],
  "Prague": [14.4378, 50.0755],
  "Warsaw": [21.0122, 52.2297],
  "Budapest": [19.0402, 47.4979],
  "Brussels": [4.3517, 50.8503],
  "Copenhagen": [12.5683, 55.6761],
  "Oslo": [10.7522, 59.9139],
  "Helsinki": [24.9384, 60.1699],
  "Lisbon": [-9.1393, 38.7223],
  "Athens": [23.7275, 37.9838],
  "Istanbul": [28.9784, 41.0082],
  "Tel Aviv": [34.7818, 32.0853],
  "Cairo": [31.2357, 30.0444],
  "Cape Town": [18.4241, -33.9249],
  "Johannesburg": [28.0473, -26.2041],
  "Lagos": [3.3792, 6.5244],
  "Nairobi": [36.8219, -1.2921],
  "Bangkok": [100.5018, 13.7563],
  "Manila": [120.9842, 14.5995],
  "Jakarta": [106.8451, -6.2088],
  "Kuala Lumpur": [101.6869, 3.1390],
  "Ho Chi Minh City": [106.6297, 10.8231],
  "Hanoi": [105.8542, 21.0285],
  "Yangon": [96.1951, 16.8661],
  "Dhaka": [90.4125, 23.8103],
  "Karachi": [67.0099, 24.8615],
  "Lahore": [74.3587, 31.5804],
  "Islamabad": [73.0479, 33.6844],
  "New Delhi": [77.2090, 28.6139],
  "Kolkata": [88.3639, 22.5726],
  "Chennai": [80.2707, 13.0827],
  "Bangalore": [77.5946, 12.9716],
  "Hyderabad": [78.4867, 17.3850],
  "Pune": [73.8567, 18.5204],
  "Ahmedabad": [72.5714, 23.0225],
  "Surat": [72.8311, 21.1702],
  "Jaipur": [75.7873, 26.9124],
  "Lucknow": [80.9462, 26.8467],
  "Kanpur": [80.3319, 26.4499],
  "Nagpur": [79.0882, 21.1458],
  "Indore": [75.8577, 22.7196],
  "Thane": [72.9781, 19.2183],
  "Bhopal": [77.4126, 23.2599],
  "Visakhapatnam": [83.3882, 17.6868],
  "Pimpri-Chinchwad": [73.8056, 18.6298],
  "Patna": [85.1376, 25.5941],
  "Vadodara": [73.2081, 22.3072],
  "Agra": [78.0081, 27.1767],
  "Ludhiana": [75.8573, 30.9010],
  "Nashville": [-86.7816, 36.1627],
  "Louisville": [-85.7585, 38.2527],
  "Portland": [-122.6765, 45.5152],
  "Las Vegas": [-115.1398, 36.1699],
  "Baltimore": [-76.6122, 39.2904],
  "Milwaukee": [-87.9065, 43.0389],
  "Albuquerque": [-106.6504, 35.0844],
  "Tucson": [-110.9265, 32.2226],
  "Fresno": [-119.7871, 36.7378],
  "Sacramento": [-121.4944, 38.5816],
  "Mesa": [-111.8315, 33.4152],
  "Kansas City": [-94.6275, 39.1142],
  "Atlanta": [-84.3880, 33.7490],
  "Colorado Springs": [-104.8214, 38.8339],
  "Raleigh": [-78.6382, 35.7796],
  "Omaha": [-95.9345, 41.2524],
  "Long Beach": [-118.1937, 33.7701],
  "Virginia Beach": [-75.9780, 36.8529],
  "Oakland": [-122.2711, 37.8044],
  "Minneapolis": [-93.2650, 44.9778],
  "Tulsa": [-95.9928, 36.1540],
  "Tampa": [-82.4572, 27.9506],
  "Arlington": [-97.1081, 32.7357],
  "Wichita": [-97.3301, 37.6872],
  "Cleveland": [-81.6944, 41.4993],
  "Reno": [-119.7674, 39.5296],
  "New Orleans": [-90.0715, 29.9511],
  "Honolulu": [-157.8583, 21.3099],
  "Anchorage": [-149.9003, 61.2181],
  "Montreal": [-73.5673, 45.5017],
  "Calgary": [-114.0719, 51.0447],
  "Edmonton": [-113.4909, 53.5461],
  "Winnipeg": [-97.1384, 49.8951],
  "Quebec City": [-71.2080, 46.8139],
  "Hamilton": [-79.8711, 43.2557],
  "Kitchener": [-80.4925, 43.4643],
  "London": [-81.2497, 42.9849],
  "Halifax": [-63.5752, 44.6488],
  "Victoria": [-123.3656, 48.4284],
  "Windsor": [-83.0165, 42.3149],
  "Oshawa": [-78.8658, 43.8971],
  "Saskatoon": [-106.6700, 52.1332],
  "Regina": [-104.6178, 50.4452],
  "Kelowna": [-119.4960, 49.8880],
  "Barrie": [-79.6903, 44.3894],
  "Guelph": [-80.2482, 43.5448],
  "Kingston": [-76.4860, 44.2312],
  "Kanata": [-75.9176, 45.3842],
  "Sherbrooke": [-71.8991, 45.4042],
  "Trois-Rivières": [-72.5477, 46.3432],
  "Saguenay": [-71.0706, 48.4284],
  "Thunder Bay": [-89.2477, 48.3809],
  "Sudbury": [-80.9930, 46.4917],
  "Peterborough": [-78.3197, 44.3091],
  "Belleville": [-77.3832, 44.1628],
  "Sarnia": [-82.4066, 42.9849],
  "Brantford": [-80.2644, 43.1394],
  "Red Deer": [-113.8112, 52.2681],
  "Lethbridge": [-112.8186, 49.6934],
  "Kamloops": [-120.3273, 50.6745],
  "Nanaimo": [-123.9365, 49.1659],
  "Prince George": [-122.7497, 53.9171],
  "Chilliwack": [-121.9583, 49.1579],
  "Courtenay": [-124.9936, 49.6866],
  "Vernon": [-119.2687, 50.2673],
  "Campbell River": [-125.2448, 50.0163],
  "Cranbrook": [-115.7681, 49.5122]
};

const users = [
  { name: "test1", geoLocation: "Chilliwack" },
  { name: "user2", geoLocation: "Guangzhou" },
  { name: "user3", geoLocation: "Shenzhen" },
  { name: "test4", geoLocation: "Hangzhou" },
  { name: "test5", geoLocation: "Zhengzhou" },
]

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
