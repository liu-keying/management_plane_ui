<template>
    <div class="manage-page">
        <div class="sidebar">
            <!-- 筛选器 -->
            <div class="filter-bar">
                <Input v-model="searchKeyword" placeholder="搜索 ID / 昵称 / IP地址 / 云服务商" clearable
                    class="filter-item search-input" icon="ios-search">
                </Input>
                <Select v-model="selectedRole" placeholder="选择角色" clearable class="filter-item">
                    <Option v-for="role in roleOptions" :key="role" :label="role" :value="role" />
                </Select>
                <Select v-model="selectedStatus" placeholder="选择状态" clearable class="filter-item">
                    <Option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
                </Select>
            </div>
            <div class="item-list">
                <div v-for="node in filteredList" :key="node.nodeId" class="list-item"
                    :class="{ selected: currentRowKey === node.nodeId }" @click="handleCurrentChange(node)">
                    <div class="item-info">
                        <div class="item-id">{{ node.nodeId }}</div>
                        <div class="item-detail">
                            <span class="item-text">{{ node.ipAddress || 'IP地址未知' }}</span>
                            <Tag :color="getStatusColor(node.status)" class="item-tag">{{ node.status }}</Tag>
                            <Tag :color="getRoleColor(node.role)" class="item-tag">{{ node.role }}</Tag>
                            <span class="item-text">{{ node.geoLocation }}</span>
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
        handleCurrentChange(val) {
            if (val) {
                this.currentRowKey = val.nodeId;
                this.selectedNode = val;
            } else {
                this.currentRowKey = null;
                this.selectedNode = null;
            }
        },
        getStatusColor(status) {
            const colorMap = {
                'ONLINE': 'success',
                'OFFLINE': 'error',
                'DESTROYING': 'warning'
            };
            return colorMap[status] || 'default';
        },
        getRoleColor(role) {
            const colorMap = {
                'CLIENT': 'blue',
                'VPS_RELAY': 'green',
                'VPS_DA': 'purple'
            };
            return colorMap[role] || 'default';
        }
    }
};
</script>


<style scoped>
.manage-page {
    display: flex;
    height: calc(100vh - 50px);
    background: #03044A;
}

.sidebar {
    width: 40%;
    background: #fff;
    border-right: 1px solid #e8eaec;
    padding: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.detail {
    flex: 1;
    padding: 20px;
    background: #fff;
    margin-left: 16px;
    border-radius: 4px;
}

.filter-bar {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8eaec;
}

.filter-item {
    flex: 1;
    min-width: 0;
}

.search-input {
    flex: 2;
    min-width: 0;
}


.item-list {
    flex: 1;
    overflow-y: auto;
}

.list-item {
    padding: 12px;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
}

.list-item:hover {
    border-color: #2d8cf0;
    box-shadow: 0 2px 8px rgba(45, 140, 240, 0.1);
}

.list-item.selected {
    border-color: #2d8cf0;
    background: #f0f8ff;
    box-shadow: 0 2px 8px rgba(45, 140, 240, 0.15);
}

.item-info {
    width: 100%;
}

.item-id {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
}

.item-detail {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

.item-text {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
}

.item-tag {
    margin: 0;
    flex-shrink: 0;
}

/* iView组件样式调整 */
.ivu-input-wrapper {
    margin-bottom: 0;
}

.ivu-select {
    width: 100%;
}

.ivu-tag {
    font-size: 11px;
    border-radius: 2px;
}
</style>
