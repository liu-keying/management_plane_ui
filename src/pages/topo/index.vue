<template>
    <div class="full-screen">
        <v-chart :option="chartOptions" ref="chartRef"></v-chart>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type EChartsType } from 'echarts/core';
import { GetTopo } from "@/api/topo/topo";

const ICONS = {
    PC: 'image://src/assets/icons/PC.png',
    SWITCH: 'image://src/assets/icons/Switch.png',
    ROUTER: 'image://src/assets/icons/Router.png',
    DB: 'image://src/assets/icons/DB.png',
    DC: 'image://src/assets/icons/DC.png',
};

interface Device {
    id: number;
    name: string;
    device_type: string;
    ip_address: string;
    mac_address: string;
    location: string;
    description: string;
}

interface Connection {
    source: string;
    target: string;
}

interface TopologyResponse {
    devices: Device[];
    connections: [string, string][];
}

// 定义类型
interface Edge {
    source: string;
    target: string;
}

interface NodeData {
    name: string;
    symbol: string;
}

interface ChartOptions {
    title: {
        text: string;
    };
    tooltip: {};
    series: Array<{
        type: string;
        layout: string;
        symbolSize: number;
        roam: boolean;
        label: {
            show: boolean;
            fontSize: number;
        };
        edgeSymbol: [string, string];
        edgeSymbolSize: [number, number];
        force: {
            repulsion: number;
        };
        edges: Edge[];
        data: NodeData[];
    }>;
}

const chartOptions = ref<ChartOptions>({
    title: {
        text: '网络拓扑图',
    },
    tooltip: {},
    series: [
        {
            type: 'graph',
            layout: 'force', // 使用力导向布局
            symbolSize: 40,  // 节点大小
            roam: true,      // 支持缩放和平移
            label: {
                show: true,    // 显示节点名称
                fontSize: 10,
            },
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: [4, 4], // 边线箭头样式
            force: {
                repulsion: 800, // 节点间的排斥力
            },
            edges: [],        // 初始化为空数组
            data: [],         // 初始化为空数组
        },
    ],
});

const topologyData = ref<TopologyResponse | null>(null);
const chartRef = ref<EChartsType | null>(null);

const doGetTopo = async () => {
    let res = await GetTopo({ exp: String("exp1") });
    topologyData.value = res.data;
};

const resizeChart = () => {
    if (chartRef.value) {
        chartRef.value.resize();
    }
};

onMounted(async () => {


    await doGetTopo(); // 等待数据加载完成

    if (topologyData.value) {
        const edges = topologyData.value.connections.map(([source, target]) => ({ source, target }));
        const data = topologyData.value.devices.map(device => ({
            name: device.name,
            symbol: getDeviceIcon(device.device_type), // 根据设备类型选择合适的图标
        }));

        chartOptions.value.series[0].edges = edges;
        chartOptions.value.series[0].data = data;
    }

    window.addEventListener('resize', resizeChart);
});


// 根据设备类型返回合适的图标
function getDeviceIcon(deviceType: string) {
    switch (deviceType) {
        case 'PC':
            return ICONS.PC;
        case 'Switch':
            return ICONS.SWITCH;
        case 'Router':
            return ICONS.ROUTER;
        default:
            return 'circle'; // 默认图标
    }
}

</script>

<style scoped lang="scss">
.full-screen {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
    overflow: hidden;
}

html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>