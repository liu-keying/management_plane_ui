<template>
    <Row class="page">
        <Col :span="18" style="padding:0 1%;">
        <div class="center-top">
            <world-map ref="worldMap" :nodes="nodes" :links="links" :users="users"></world-map>
        </div>
        </Col>
        <Col :span="6">
        <div class="right-1">
            <div class="right1-1">
                <span class='title'><span class="title-gradient">节点状态情况</span></span>
                <span class="angle1"></span>
                <span class="angle2"></span>
                <span class="angle3"></span>
                <span class="angle4"></span>
                <pie ref="node_status" id="node_status" :data="nodeStatus"></pie>
            </div>
        </div>
        <div class="right-1">
            <div class="right1-1">
                <span class='title'><span class="title-gradient">链路状态情况</span></span>
                <span class="angle1"></span>
                <span class="angle2"></span>
                <span class="angle3"></span>
                <span class="angle4"></span>
                <pie ref="link_status" id="link_status" :data="linkStatus"></pie>
            </div>
        </div>
        <div class="right-2">
            <div class="right1-1">
                <span class='title'><span class="title-gradient">链路流量排行</span></span>
                <span class="angle1"></span>
                <span class="angle2"></span>
                <span class="angle3"></span>
                <span class="angle4"></span>
                <bar ref="traffic_rank" :data="trafficRank"></bar>
            </div>
        </div>
        </Col>
    </Row>
</template>

<script>
import { fetchNodes } from '@/api/node.js'
import { fetchLinks } from '@/api/link.js'

const worldMap = () => import('./components/dashboard/worldMap');
const pie = () => import('./components/dashboard/pie');
const bar = () => import('./components/dashboard/bar');

export default {
    name: 'dashboard',
    components: {
        worldMap,
        pie,
        bar
    },
    data() {
        return {
            nodes: [],
            links: [],
            users: [],
            resizeFn: null
        }
    },
    computed: {
        nodeStatusCounts() {
            const counts = {
                'ONLINE': 0,
                'OFFLINE': 0,
                'DESTROYING': 0
            };

            this.nodes.forEach(node => {
                if (node.status && counts.hasOwnProperty(node.status)) {
                    counts[node.status]++;
                }
            });
            // console.log('counts:',counts);
            return counts;
        },

        nodeStatus() {
            return {
                color: '#BE232A',
                data: [
                    {
                        value: this.nodeStatusCounts.ONLINE,
                        name: 'ONLINE',
                        itemStyle: {
                            color: '#a262f2'
                        }
                    },
                    {
                        value: this.nodeStatusCounts.OFFLINE,
                        name: 'OFFLINE',
                        itemStyle: {
                            color: '#2ca8fe'
                        }
                    },
                    {
                        value: this.nodeStatusCounts.DESTROYING,
                        name: 'DESTROYING',
                        itemStyle: {
                            color: '#2cd9fe'
                        }
                    }
                ]
            };
        },
        linkStatusCounts() {
            const counts = {
                'ACTIVE': 0,
                'INACTIVE': 0,
                'PENDING': 0
            };

            this.links.forEach(link => {
                if (link.status && counts.hasOwnProperty(link.status)) {
                    counts[link.status]++;
                }
            });

            return counts;
        },

        linkStatus() {
            return {
                color: '#2C7BFE',
                data: [
                    {
                        value: this.linkStatusCounts.ACTIVE,
                        name: 'ACTIVE',
                        itemStyle: {
                            color: '#69f262'
                        }
                    },
                    {
                        value: this.linkStatusCounts.INACTIVE,
                        name: 'INACTIVE',
                        itemStyle: {
                            color: '#feac2c'
                        }
                    },
                    {
                        value: this.linkStatusCounts.PENDING,
                        name: 'PENDING',
                        itemStyle: {
                            color: '#feed2c'
                        }
                    }
                ]
            };
        },
        trafficRank() {
            // 对links按totalTraffic降序排序
            const sortedLinks = [...this.links].sort((a, b) => (b.totalTraffic || 0) - (a.totalTraffic || 0));

            // 取前10条数据
            const topLinks = sortedLinks.slice(0, 10);

            return {
                name: '流量排行',
                linkIds: topLinks.map(link => link.linkId || '未知链路'),
                data: topLinks.map(link => ({
                    linkId: link.linkId || '未知链路',
                    path: link.relayIds || '未知路径'
                })),
                color: '192,35,42',
                value: topLinks.map(link => link.totalTraffic || 0)
            };
        }
    },
    methods: {
        async fetchData() {
            try {
                const nodes = await fetchNodes({});
                if (nodes != null) {
                    this.nodes = nodes;
                }
                else this.nodes = [];
            }
            catch (error) {
                console.error('获取节点数据失败:', error);
                this.nodes = [];
            }
            try {
                const links = await fetchLinks({});
                if (links != null) {
                    this.links = links;
                }
                else this.links = [];
            }
            catch (error) {
                console.error('获取链路数据失败:', error);
                this.links = [];
            }
            // try {
            //     const users = await fetchUsers({});
            //     if (users != null) {
            //         this.users = users;
            //     }
            //     else this.users = [];
            // }
            // catch (error) {
            //     console.error('获取用户数据失败:', error);
            //     this.users = [];
            // }
            // console.log("fetchLinks:", this.links);
        }
    },
    created() {
        this.fetchData();
    },
    watch: {

    },
    mounted() {
        this.resizeFn = this.$debounce(() => {
            this.$refs.node_status.setChart();
            this.$refs.link_status.setChart();
            this.$refs.traffic_rank.setChart();
            this.$refs.worldMap.setChart();

        }, 500)
        window.addEventListener('resize', this.resizeFn)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeFn)
    }
}
</script>

<style lang="less" scoped>
.page {
    height: 100%;
    width: 100%;
    padding: 14px 20px 20px;
    background: #03044A;
    overflow: hidden;

    .ivu-col {
        height: 100%;
    }

    .left,
    .right1-1,
    .center-bottom {
        height: 100%;
        border: 1px solid #0D2451;
        position: relative;
        background: #151456;

        #left_5 {
            height: 100%;
            width: 45%;
            float: left;
        }

        #left_6 {
            height: 100%;
            width: 55%;
            float: left;
        }

        .circular {
            height: 100%;

            .canvas {
                height: 100%;
                width: 30%;
                float: left;

                .subtitle {
                    font-size: 12px;
                    font-weight: bold;
                    color: #fff;
                    height: 25px;
                    padding: 10px 0;
                    text-align: center;
                }

                .canvasList {
                    height: calc(~'100% - 25px');
                    text-align: center
                }
            }
        }

        .left1 {
            border-bottom: 1px solid #0D2451;
            background: #151456;
        }

    }

    .center-top {
        height: 100%;
    }

    .center-bottom {
        height: 40%;

        .bottom-radars {
            height: 55%;
        }

        .bottom-bars {
            height: 45%;
        }
    }

    .right-1 {
        height: 30%;

        .right1-1 {
            height: 92%;
        }
    }

    .right-2 {
        height: 40%;

    }
}
</style>
