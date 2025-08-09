<template>
    <div class="manage-page">
        <div class="sidebar">
            <!-- 筛选器 -->
            <div class="filter-bar">
                <Input v-model="searchKeyword" placeholder="搜索 ID / IP地址 " clearable class="filter-item search-input"
                    icon="ios-search">
                </Input>
                <Select v-model="selectedRole" placeholder="角色" clearable class="filter-item">
                    <Option v-for="role in roleOptions" :key="role" :label="role" :value="role" />
                </Select>
                <Select v-model="selectedStatus" placeholder="状态" clearable class="filter-item">
                    <Option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
                </Select>
                 <Button icon="ios-refresh" @click="refreshAllNodes" >刷新</Button>
            </div>
            <div class="item-list">
                <div v-for="node in filteredList" :key="node.nodeId" class="list-item"
                    :class="{ selected: currentRowKey === node.nodeId }" @click="handleCurrentChange(node)">
                    <div class="item-info">
                        <div class="item-id">{{ node.nodeId }}</div>
                        <div class="item-detail">
                            <span class="item-text">{{ node.ipAddress || 'IP地址未知' }}</span>
                            <span :class="['item-text', 'status-' + node.status.toLowerCase()]">{{ node.status }}</span>
                            <span :class="['item-text', 'role-' + node.role.toLowerCase()]">{{ node.role }}</span>
                            <span class="item-text">{{ node.geoLocation || '地理位置未知' }}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="detail">
            <detail :nodeId="currentRowKey" />
        </div>
    </div>
</template>


<script>
import { fetchNodes } from '@/api/node.js';
import { defaultFormatter } from '@/lib/formatters.js';

const Detail = () => import('./components/nodes/detail');


export default {
    name: 'NodeManagement',
    components: {
        Detail
    },
    data() {
        return {
            nodes: [],
            selectedNode: null,
            currentRowKey: null,
            selectedRole: '',
            selectedStatus: '',
            searchKeyword: '',
            roleOptions: ['CLIENT', 'VPS_RELAY', 'VPS_DA'],
            statusOptions: ['ONLINE', 'OFFLINE', 'DESTROYING']
        };
    },
    computed: {
        filteredList() {
            this.currentRowKey = null;
            this.selectedNode = null;
            return this.nodes.filter(item => {
                const matchRole = this.selectedRole ? item.role === this.selectedRole : true;
                const matchStatus = this.selectedStatus ? item.status === this.selectedStatus : true;

                const keyword = this.searchKeyword.trim().toLowerCase();
                const matchKeyword = keyword
                    ? (String(item.nodeId).toLowerCase().includes(keyword) ||
                        (item.nickname && item.nickname.toLowerCase().includes(keyword)) ||
                        (item.ipAddress && item.ipAddress.toLowerCase().includes(keyword)) ||
                        (item.cloudProvider && item.cloudProvider.toLowerCase().includes(keyword)))
                    : true;

                return matchRole && matchStatus && matchKeyword;
            });
        }
    },
    async mounted() {
        this.nodes = await fetchNodes({});
    },
    methods: {
        async refreshAllNodes() {
            this.$Spin.show({ render: (h) => h('div', [h('Icon', { props: { type: 'ios-loading', size: 18 }, style: { animation: 'ani-demo-spin 1s linear infinite' } }), h('div', '正在刷新节点信息...')]) });
            //Todo: 刷新所有节点信息
            // try {
            //     this.nodes = await fetchNodes({});
            //     this.$Message.success('节点信息刷新成功');
            // } catch (error) {
            //     this.$Message.error('刷新节点信息失败：' + (error.message || '未知错误'));
            // } finally {
            //     this.$Spin.hide();
            // }
        },
        handleCurrentChange(val) {
            // 如果点击的是当前已选中的节点，则取消选中
            if (val && this.currentRowKey === val.nodeId) {
                this.currentRowKey = null;
                this.selectedNode = null;
            } else if (val) {
                // 选中新节点
                this.currentRowKey = val.nodeId;
                this.selectedNode = val;
            } else {
                // 清空选中
                this.currentRowKey = null;
                this.selectedNode = null;
            }
        },
        // getStatusColor(status) {
        //     const colorMap = {
        //         'ONLINE': 'green',
        //         'OFFLINE': 'orange',
        //         'DESTROYING': 'red'
        //     };
        //     return colorMap[status] || 'default';
        // },
        // getRoleColor(role) {
        //     const colorMap = {
        //         'CLIENT': 'green',
        //         'VPS_RELAY': 'orange',
        //         'VPS_DA': 'yellow'
        //     };
        //     return colorMap[role] || 'default';
        // }
    }
};
</script>


<style lang="less" scoped>

@primary-color: #75deef;
@border-color: #2b3a57;
@bg-primary: #03044A;
@bg-secondary: rgba(117, 222, 239, 0.2);
@text-primary: #6EDDF1;
@text-secondary: #75deef;
@text-white: #fff;
@hover-bg: rgba(117, 222, 239, 0.1);
@selected-bg: rgba(117, 222, 239, 0.3);

.manage-page {
    display: flex;
    height: calc(100vh - 65px);
    background: @bg-primary;

    .sidebar {
        width: 33%;
        background: @bg-primary;
        // border-right: 1px solid @border-color;
        padding: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-top: 1px solid @border-color;

        .filter-bar {
            display: flex;
            flex-direction: row;
            gap: 6px;
            margin-bottom: 10px;
            width: 100%;
            box-sizing: border-box;
            //padding-right: 10px;
            //padding-bottom: 16px;
            // border-bottom: 1px solid @border-color;

            .filter-item {
                width: 20%;
                min-width: 0;
            }

            .search-input {
                width: 30%;
                min-width: 0;
            }
            .ivu-btn {
                    width: 20%; // 按钮宽度占满容器
                    // height: 30px; // 固定按钮高度
                    //margin: 0 0 12px 0; // 底部间距
                    //flex: 1;
                    padding: 0 20px;
                    //border-radius: 6px;
                    // font-weight: 600;
                    font-size: 12px;
                    font-family: inherit;
                    transition: all 0.3s ease;
                    border: 1px solid #75deef;
                    color: @text-primary !important;
                    background: @bg-secondary;
                    position: relative;
                    overflow: hidden;
                    //display: flex;
                    align-items: center;
                    justify-content: center;
                    
                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, #1a3c58, transparent);
                        transition: left 0.5s;
                    }

                    &:hover::before {
                        left: 100%;
                    }

                    &:hover {
                        border-color: #75deef;
                        background: #1a3c58;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(117, 222, 239, 0.3);
                    }

                    &:active {
                        transform: translateY(0);
                    }
                }
        }

        .item-list {
            flex: 1;
            overflow-y: auto;
            padding-right: 8px;

            // 自定义滚动条样式
            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: rgba(42, 62, 101, 0.284);
                border-radius: 3px;
            }

            &::-webkit-scrollbar-thumb {
                background: @primary-color;
                border-radius: 3px;

                &:hover {
                    background: lighten(@primary-color, 10%);
                }
            }

            .list-item {
                padding: 12px;
                border: 1px solid @border-color;
                border-radius: 4px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.3s;
                background: @bg-secondary;

                &:hover {
                    border-color: @primary-color;
                    box-shadow: 0 2px 12px rgba(117, 222, 239, 0.2);
                    background: @hover-bg;
                }

                &.selected {
                    border-color: @primary-color;
                    background: @selected-bg;
                    box-shadow: 0 4px 16px rgba(117, 222, 239, 0.3);
                }

                .item-info {
                    width: 100%;

                    .item-id {
                        font-size: 16px;
                        font-weight: 600;
                        color: @text-primary;
                        margin-bottom: 8px;
                        text-shadow: 0 0 8px rgba(117, 222, 239, 0.3);
                    }

                    .item-detail {
                        display: flex;
                        flex-direction: row;
                        gap: 8px;
                        align-items: center;
                        flex-wrap: wrap;

                        .item-text {
                            font-size: 12px;
                            color: @text-secondary;
                            white-space: nowrap;
                            font-family: 'Courier New', monospace;

                            // 状态颜色
                            &.status-online {
                                color: #52c41a;
                                font-weight: 600;
                            }

                            &.status-offline {
                                color: #ff4d4f;
                                font-weight: 600;
                            }

                            &.status-destroying {
                                color: #faad14;
                                font-weight: 600;
                            }

                            // 角色颜色
                            &.role-client {
                                color: #18ffbe;
                                font-weight: 600;
                            }

                            &.role-vps_relay {
                                color: #f79336;
                                font-weight: 600;
                            }

                            &.role-vps_da {
                                color: #ffec18;
                                font-weight: 600;
                            }
                        }

                        .item-tag {
                            margin: 0;
                            flex-shrink: 0;
                        }
                    }
                }
            }
        }
    }

    .detail {
        flex: 1;
        padding: 5px;
        background: @bg-primary;
        //margin-left: 16px;
        margin-bottom: 8px;
        margin-right: 8px;
        border-radius: 4px;
        border: 1px solid @border-color;
        position: relative;
    }
}

/* iView组件样式覆盖 - 科技风格 */
/deep/ .ivu-input {
    background: @bg-secondary !important;
    border: 1px solid @primary-color !important;
    color: @text-primary !important;

    &:focus {
        border-color: @primary-color !important;
        box-shadow: 0 0 8px rgba(117, 222, 239, 0.4) !important;
    }

    &::placeholder {
        color: rgba(117, 222, 239, 0.6) !important;
    }
}

/deep/ .ivu-select {
    .ivu-select-selection {
        background: @bg-secondary !important;
        border: 1px solid @primary-color !important;
        color: @text-primary !important;

        &:hover {
            border-color: @primary-color !important;
        }
    }

    .ivu-select-placeholder {
        color: rgba(117, 222, 239, 0.6) !important;
    }

    .ivu-select-arrow {
        color: @text-secondary !important;
    }
}

/deep/ .ivu-select-dropdown {
    background: rgb(21, 20, 86) !important;
    border: 1px solid @primary-color !important;
    box-shadow: 0 4px 20px rgba(3, 4, 74, 0.8) !important;

    .ivu-select-item {
        color: @text-primary !important;

        &:hover {
            background: @hover-bg !important;
        }

        &.ivu-select-item-selected {
            background: rgba(117, 222, 239, 0.15) !important;
            color: @primary-color !important;
        }
    }
}

/deep/ .ivu-tag {
    background: rgba(117, 222, 239, 0.2) !important;
    border: 1px solid rgba(117, 222, 239, 0.4) !important;
    color: @text-primary !important;
    font-size: 10px;
    border-radius: 3px;
}
</style>
