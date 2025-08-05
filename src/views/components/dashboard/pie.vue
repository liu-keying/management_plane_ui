<template>
    <div class="webPie">

        <div class="webPie-content" :id="id">

        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: {
        id: String,
        data: Object
    },
    data() {
        return {
            myChart: null
        }
    },
    methods: {
        setChart() {
            // console.log(this.data)
            let option = {
                // tooltip: {
                //     trigger: 'item',
                //     backgroundColor: '#11367a',
                //     textStyle: {
                //         color: '#6dd0e3',
                //         fontSize: 10
                //     },
                //     formatter: "{b}:{d}%"
                // },
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        label: {
                            color: '#75deef',
                            fontSize: 11,
                            formatter: function (data) {
                                return data.data.name + ': ' + data.data.value
                            }
                        },
                        labelLine: {
                            length: 10,
                            length2: 8,
                            lineStyle: {
                                color: 'rgb(57,63,90)'
                            }
                        },
                        data: this.data.data,
                    }
                ]
            };
            if (!this.myChart) this.myChart = this.$echarts(document.getElementById(this.id));
            this.myChart.clear();
            this.myChart.resize();
            this.myChart.setOption(option);
        }
    },
    mounted() {
        this.setChart()
    },
    watch: {
        data: {
            handler(newVal) {
                //console.log('Data prop received in pie:', newVal);
                this.setChart();
            },
            //immediate: true,
            deep: true
        },
    }
}
</script>

<style lang="less" scoped>
.webPie {
    width: 100%;
    height: 100%;

    .webPie-content {
        height: 100%
    }
}
</style>
