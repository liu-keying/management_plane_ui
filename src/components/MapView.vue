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

    const points = [
        { id: "example1", value: [-97.822, 37.751 + 15] },
        { id: "example2", value: [120, 30] },
        { id: "example3", value: [104.195, 35.8617] },
        { id: "example4", value: [-74.0060, 40.7128] }
    ];

    const lines = points.map((point, index) => {
        if (index < points.length - 1) {
            return {
                coords: [point.value, points[index + 1].value]
            };
        }
    }).filter(item => item !== undefined);

    drawnWorldChart(points, lines);
};

const drawnWorldChart = (points, lines) => {
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
            roam: true,  // 允许拖动和缩放
            zoom: 1,   // 初始缩放
            left: 0,     // 保证地图填充整个容器
            right: 0,
            top: 0,
            bottom: 0,
            scaleLimit: {
                min: 1,  // 限制最小缩放级别，避免缩小到地图太小
                max: 10  // 允许放大，但不会无限放大
            },
            emphasis: {
                label: { show: false },
                itemStyle: {
                    areaColor: '#A0C4FF',
                    borderColor: '#CEE0E7',
                }
            },
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
                data: points,
            },
            {
                type: 'lines',
                coordinateSystem: 'geo',
                effect: {
                    show: true,
                    symbol: 'arrow',
                    symbolSize: 6,
                    color: 'red',
                },
                lineStyle: {
                    color: 'blue',
                    width: 2,
                    opacity: 0.7,
                    curveness: 0.2
                },
                data: lines,
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