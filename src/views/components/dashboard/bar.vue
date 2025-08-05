<template>
    <div class="webBar"></div>
</template>

<script>
export default {
    name: '',
    props: {
        data: Object
    },
    data() {
        return {
            myChart: null
        }
    },
    methods: {
        setData() {
            var max = Math.max.apply(null, this.data.value);
            var arr = []
            for (let i = 0; i < 6; i++) {
                arr.push(max / 10)
            }
            return arr;
        },
        // 网站
        setChart() {
            console.log(this.data);
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'none'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    backgroundColor: '#11367a',
                    textStyle: {
                        color: '#6dd0e3',
                        fontSize: 11,
                    },
                    formatter: (params) => {
                        // console.log(params);
                        // let tooltip = '';

                        //     if (params && params.linkId) {
                        //         tooltip += '<div style="margin-bottom: 5px;"><strong>Link ID:</strong> ' + params.linkId + '</div>';
                        //     }

                        //     if (params.path && params.data.relayIds.length > 0) {
                        //         tooltip += '<div><strong>Relay Path:</strong></div>';
                        //         tooltip += '<div style="margin-top: 3px; padding: 3px;  border-radius: 3px;">';

                        //         // 用箭头连接各个relay点
                        //         const relayPath = params.data.relayIds.map((id) => {
                        //             return '<span style="color: #ffcc00;">' + id + '</span>';
                        //         }).join(' <span style="color: #6dd0e3;">→</span> ');

                        //         tooltip += relayPath;
                        //         tooltip += '</div>';
                        //     }

                        //     return tooltip || 'Unknown Link';
                    }
                },
                grid: {
                    left: '4%',
                    top: '5%',
                    bottom: 10,

                    containLabel: true,
                },
                yAxis:
                {
                    type: 'category',
                    inverse: true,
                    position: 'left',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#1a3c58'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 13,
                        fontSize: 11,
                        color: '#75deef'
                    },
                    data: this.data.linkIds
                },
                xAxis:
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    }
                }
                ,
                series: [
                    {
                        name: '辅助',
                        type: 'bar',
                        stack: '总量',
                        barCategoryGap: 20,
                        barWidth: 8,
                        itemStyle: {
                            color: 'rgba(0,0,0,0)'
                        },
                        data: this.setData()
                    },
                    {
                        name: this.data.name,
                        type: 'bar',
                        stack: '总量',
                        barCategoryGap: 20,
                        barWidth: 8,
                        itemStyle: {
                            color: { // 颜色线性渐变
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 1,
                                y2: 0,
                                colorStops: [{
                                    offset: 0, color: 'rgb(' + this.data.color + ',0.1)' // 0% 处的颜色
                                }, {
                                    offset: 1, color: 'rgb(' + this.data.color + ',1)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            borderRadius: 5,
                        },
                        label: {
                            show: true,
                            position: 'right',
                            color: '#75deef',
                            fontSize: 11,
                            formatter: '{c}KB'
                        },
                        data: this.data.value
                    },
                ]
            };
            if (!this.myChart) this.myChart = this.$echarts(this.$el);
            this.myChart.clear();
            this.myChart.resize();
            this.myChart.setOption(option);
        },
    },
    mounted() {
        this.setChart()
    },
    watch: {
        data: {
            handler(newVal) {
                //console.log('Data prop received in bar:', newVal);
                this.setChart();
            },
            //immediate: true,
            deep: true
        },
    }
}
</script>

<style lang="less" scoped>
.webBar {
    float: left;
    width: 90%;
    height: 100%;
}
</style>