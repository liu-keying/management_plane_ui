<template>
    <div class="worldMap"></div>
</template>

<script>
import "@/lib/world.js"
import { geoCoordMap } from "@/lib/geoCoords.js"

export default {
    name: 'worldMap',
    props: {
        nodes: {
            type: Array,
            default: () => []
        },
        links: {
            type: Array,
            default: () => []
        },
        //users: {
        //    type: Array,
        //    default: () => []
        //},
        showLegend: {
            type: Boolean,
            default: false
        },
        enableRoam: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myChart: null,
            mapSize: { width: 0, height: 0 }
        }
    },
    methods: {
        setChart() {
            // console.log('setChart');
            // 获取容器实际尺寸
            const containerWidth = this.$el.clientWidth;
            const containerHeight = this.$el.clientHeight;
            this.mapSize = { width: containerWidth, height: containerHeight };

            // 基于容器尺寸计算缩放因子
            const baseWidth = 800;
            const baseHeight = 440;
            const widthScale = containerWidth / baseWidth;
            const heightScale = containerHeight / baseHeight;
            const sizeScale = Math.min(widthScale, heightScale);

            // 处理点数据，转换地理位置为坐标
            var processPoints = function (points) {
                return points.map(p => {
                    const coords = p.value || convertGeoLocationToCoords(p.geoLocation);
                    return {
                        ...p,
                        value: coords,
                    };
                });
            };
            // 处理连线数据
            var processLinks = function (links, nodes) {
                return links.map(link => {
                    if (!link.relayIds || link.relayIds.length < 2) {
                        return null;
                    }

                    const startNode = nodes.find(node => node.anonymousRelayId === link.relayIds[0]);
                    const endNode = nodes.find(node => node.anonymousRelayId === link.relayIds[link.relayIds.length - 1]);

                    if (!startNode || !endNode) return null;

                    const startCoords = startNode.value || convertGeoLocationToCoords(startNode.geoLocation);
                    const endCoords = endNode.value || convertGeoLocationToCoords(endNode.geoLocation);

                    return {
                        ...link,
                        coords: [startCoords, endCoords]
                    };
                }).filter(link => link !== null);
            };

            // 将geoLocation转换为坐标
            const convertGeoLocationToCoords = (geoLocation) => {
                if (!geoLocation) return [116.4074, 39.9042]; // 默认北京坐标

                // 直接匹配
                if (geoCoordMap[geoLocation]) {
                    return geoCoordMap[geoLocation];
                }

                // 模糊匹配
                const fuzzyMatch = Object.keys(geoCoordMap).find(key =>
                    key.toLowerCase().includes(geoLocation.toLowerCase()) ||
                    geoLocation.toLowerCase().includes(key.toLowerCase())
                );

                if (fuzzyMatch) {
                    return geoCoordMap[fuzzyMatch];
                }

                // 如果都没匹配到，返回默认坐标
                console.warn(`未找到地理位置 "${geoLocation}" 的坐标，使用默认坐标`);
                return [116.4074, 39.9042]; // 默认北京坐标
            };

            let processedNodes = processPoints(this.nodes);
            let processedLinks = processLinks(this.links, processedNodes);

            let option = {
                tooltip: {
                    trigger: 'item',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    backgroundColor: '#11367a',
                    textStyle: {
                        color: '#6dd0e3',
                        fontSize: 9,
                    },
                    formatter: function (params) {
                        //console.log('Tooltip params:', params);

                        if (params.componentSubType === 'effectScatter') {
                            // 鼠标移动到点上时，显示nodeId
                            if (params.data && params.data.nodeId) {
                                return '<strong>Node ID:</strong> '
                                    + params.data.nodeId
                                    + '<br><strong>Status:</strong> '
                                    + params.data.status;
                            }
                            return 'Unknown Node';
                        } else if (params.componentSubType === 'lines') {
                            let tooltip = '';

                            if (params.data && params.data.linkId) {
                                tooltip += '<div style="margin-bottom: 5px;"><strong>Link ID:</strong> ' + params.data.linkId + '</div>';
                            }

                            if (params.data && params.data.status) {
                                tooltip += '<div style="margin-bottom: 5px;"><strong>Status:</strong> ' + params.data.status + '</div>';
                            }

                            if (params.data && params.data.relayIds && params.data.relayIds.length > 0) {
                                tooltip += '<div><strong>Relay Path:</strong></div>';
                                tooltip += '<div style="margin-top: 3px; padding: 3px;  border-radius: 3px;">';

                                // 用箭头连接各个relay点
                                const relayPath = params.data.relayIds.map((id) => {
                                    return '<span style="color: #ffcc00;">' + id + '</span>';
                                }).join(' <span style="color: #6dd0e3;">→</span> ');

                                tooltip += relayPath;
                                tooltip += '</div>';
                            }

                            return tooltip || 'Unknown Link';
                        }
                        return '';
                    }
                },
                title: [

                ],
                legend: {
                    show: this.showLegend,
                    orient: 'horizontal',
                    top: '5%',
                    right: '5%',
                    data: [
                        'VPS_DA', 'VPS_RELAY', 'CLIENT'
                    ],
                    itemHeight: 7,
                    textStyle: {
                        color: '#75deef',
                        fontSize: 9
                    }
                },
                // grid:
                //     {
                //         top: '88%',
                //         left: '3%',
                //         right: '3%',
                //         bottom: '2%',
                //     },
                geo: {
                    map: 'world',
                    zoom: 1.1,
                    aspectScale: 1,
                    top: '14%',
                    left: '8%',
                    right: '8%',
                    bottom: '15%',
                    roam: this.enableRoam,
                    scaleLimit: {
                        min: 1,
                        max: 5
                    },
                    // center: [0, 0],
                    // layoutCenter: ['50%', '50%'],
                    // layoutSize: '80%',
                    emphasis: {
                        itemStyle: {
                            areaColor: '#2a333d'
                        },
                        label: {
                            show: false
                        }
                    },
                    itemStyle: {
                        areaColor: 'rgb(40,113,234)',
                        borderColor: '#111'
                    }
                },
                series: [
                    {
                        type: 'lines',
                        coordinateSystem: 'geo',
                        // zlevel: 2,
                        effect: {
                            show: true,
                            symbol: 'arrow',
                            period: 5,
                            // trailLength: 0.7,
                            color: '#fff',
                            symbolSize: Math.max(2, 4 * sizeScale)
                        },
                        lineStyle: {
                            color: '#fff',
                            width: Math.max(0.8, 1.5 * sizeScale),
                        },
                        data: processedLinks
                    },
                    {
                        name: 'VPS_DA',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: processedNodes.filter(node => node.role === 'VPS_DA'),
                        symbolSize: Math.max(3, 5 * sizeScale),
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        itemStyle: {
                            color: 'rgb(230, 215, 5)'
                        }
                    },
                    {
                        name: 'VPS_RELAY',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: processedNodes.filter(node => node.role === 'VPS_RELAY'),
                        symbolSize: Math.max(3, 5 * sizeScale),
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        itemStyle: {
                            color: 'rgb(255, 153, 0)'
                        }
                    },
                    {
                        name: 'CLIENT',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: processedNodes.filter(node => node.role === 'CLIENT'),
                        symbolSize: Math.max(3, 5 * sizeScale),
                        label: {
                            show: false
                        },
                        emphasis: {
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        itemStyle: {
                            color: 'rgb(53, 248, 82)'
                        }
                    }
                ]
            }
            if (!this.myChart) {
                this.myChart = this.$echarts(this.$el, null, {
                    renderer: 'canvas'
                });
            }
            this.myChart.clear();
            this.myChart.resize()
            this.myChart.setOption(option);
        },
    },
    mounted() {
        this.setChart();
    },
    watch: {
        links: {
            handler(newVal) {
                //console.log('Links prop received in worldMap:', newVal);
                this.setChart();
            },
            //immediate: true,
            deep: true
        },
        nodes: {
            handler(newVal) {
                //console.log('Nodes prop received in worldMap:', newVal);
                this.setChart();
            },
            //immediate: true,
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
.worldMap {
    width: 100%;
    height: 100%;
}
</style>