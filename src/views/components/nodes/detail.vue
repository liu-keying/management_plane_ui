<template>
    <div class="detail-page">
        <div v-if="node === null" class="loading-container">
            <div class="empty-state">
                <Icon type="ios-information-circle" size="60" color="#c5c8ce" />
                <p>请在左侧选择节点</p>
            </div>
        </div>
        <template v-else>
            <div class="main-layout">
                <div class="top-section">
                    <div class="detail-map">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <world-map ref="worldMap" :nodes="[node]"></world-map>
                    </div>
                    <div class="action-buttons">
                        <Button @click="openDialog('createRelay')">创建中继</Button>
                        <Button @click="openDialog('updateRole')">更新节点角色</Button>
                        <Button @click="openDialog('updateStatus')">更新节点状态</Button>
                        <Button @click="openDialog('destroyNode')">销毁节点</Button>
                    </div>
                </div>
                <div class="bottom-section">
                    <Card :padding="20" class="detail-card">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <div class="detail-info">
                            <Row :gutter="8">
                                <Col :span="8">
                                <div class="info-item">
                                    <span class="label">节点ID:</span>
                                    <span>{{ node.nodeId }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">IP地址:</span>
                                    <span>{{ node.ipAddress || '无' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">角色:</span>
                                    <span>{{ node.role }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">状态:</span>
                                    <span>{{ node.status }}</span>
                                    <!-- <Tag :color="statusTagType(node.status)">{{ node.status }}</Tag> -->
                                </div>
                                <div class="info-item">
                                    <span class="label">云提供商:</span>
                                    <span>{{ node.cloudProvider }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">地理位置:</span>
                                    <span>{{ node.geoLocation }}</span>
                                </div>

                                </Col>

                                <Col :span="8">
                                <div class="info-item">
                                    <span class="label">CPU使用率:</span>
                                    <span>{{ formatPercentage(node.cpuUsage) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">内存使用率:</span>
                                    <span>{{ formatPercentage(node.memoryUsage) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">流入流量:</span>
                                    <span>{{ formatBytes(node.trafficIn) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">流出流量:</span>
                                    <span>{{ formatBytes(node.trafficOut) }}</span>
                                </div>

                                <div class="info-item">
                                    <span class="label">创建时间:</span>
                                    <span>{{ formatDate(node.createdAt) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">最后心跳:</span>
                                    <span>{{ formatDate(node.lastHeartbeat) }}</span>
                                </div>
                                </Col>

                                <Col :span="8">


                                <!-- <div class="info-item">
                                    <span class="label">创建人:</span>
                                    <span>{{ node.createdBy || '无' }}</span>
                                </div> -->
                                <div class="info-item">
                                    <span class="label">风险等级:</span>
                                    <span>{{ node.riskLevel }}</span>
                                </div>

                                <div class="info-item">
                                    <span class="label">最大中继容量:</span>
                                    <span>{{ node.maxRelayCapacity }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">中继数量:</span>
                                    <span>{{ node.relayCount }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">匿名网络中继ID:</span>
                                    <span>{{ node.anonymousRelayId }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">接入网络中继ID:</span>
                                    <span>{{ node.accessRelayId }}</span>
                                </div>
                                </Col>
                            </Row>
                        </div>

                    </Card>
                    <Card :padding="20" class="detail-card expandable-table-card">
                        <span class="angle1"></span>
                        <span class="angle2"></span>
                        <span class="angle3"></span>
                        <span class="angle4"></span>
                        <!-- <div class="card-title">中继列表</div> -->
                        <Table :columns="tableColumns" :data="relayData" class="expandable-table">

                        </Table>
                    </Card>
                </div>
            </div>

            <!-- 弹窗 -->
            <Modal v-model="dialogVisible" :title="dialogTitle" width="400" @on-ok="confirmAction">
                <template v-if="currentAction === 'updateRole'">
                    <Form :model="nodeForm" :label-width="100">
                        <FormItem label="节点ID">
                            <Input v-model="nodeForm.nodeId" disabled />
                        </FormItem>
                        <FormItem label="节点角色">
                            <Select v-model="nodeForm.role" placeholder="选择角色">
                                <Option value="VPS_DA" label="VPS_DA" />
                                <Option value="VPS_RELAY" label="VPS_RELAY" />
                                <Option value="CLIENT" label="CLIENT" />
                            </Select>
                        </FormItem>
                    </Form>
                </template>
                <template v-if="currentAction === 'updateStatus'">
                    <Form :model="nodeForm" :label-width="100">
                        <FormItem label="节点ID">
                            <Input v-model="nodeForm.nodeId" disabled />
                        </FormItem>
                        <FormItem label="节点状态">
                            <Select v-model="nodeForm.status" placeholder="选择状态">
                                <Option value="ONLINE" label="ONLINE" />
                                <Option value="OFFLINE" label="OFFLINE" />
                                <Option value="DESTROYING" label="DESTROYING" />
                            </Select>
                        </FormItem>
                    </Form>
                </template>
                <template v-else-if="currentAction === 'createRelay'">
                    <Form :model="relayForm" :label-width="100">
                        <!-- <FormItem label="昵称">
                            <Input v-model="relayForm.nickname" />
                        </FormItem> -->
                        <FormItem label="中继类型">
                            <Select v-model="relayForm.type" placeholder="选择类型">
                                <Option value="ANONYMOUS" label="ANONYMOUS" />
                                <Option value="ACCESS" label="ACCESS" />
                                <!-- <Option value="UNKNOWN" label="UNKNOWN" /> -->
                            </Select>
                        </FormItem>
                        <FormItem label="中继角色">
                            <Select v-model="relayForm.role" placeholder="选择角色">
                                <Option value="ROLE_DA" label="ROLE_DA" />
                                <Option value="ROLE_RELAY" label="ROLE_RELAY" />
                                <Option value="ROLE_EXIT" label="ROLE_EXIT" />
                                <Option value="ROLE_CLIENT" label="ROLE_CLIENT" />
                                <Option value="ROLE_HS" label="ROLE_HS" />
                            </Select>
                        </FormItem>
                    </Form>
                </template>
                <template v-else-if="currentAction === 'updateRelay'">
                    <Form :model="relayForm" :label-width="100">
                        <FormItem label="中继ID">
                            <Input v-model="relayForm.relayId" disabled />
                        </FormItem>
                        <FormItem label="中继类型">
                            <Select v-model="relayForm.type" placeholder="选择类型">
                                <Option value="ANONYMOUS" label="ANONYMOUS" />
                                <Option value="ACCESS" label="ACCESS" />
                                <!-- <Option value="UNKNOWN" label="UNKNOWN" /> -->
                            </Select>
                        </FormItem>
                        <FormItem label="中继角色">
                            <Select v-model="relayForm.role" placeholder="选择角色">
                                <Option value="ROLE_DA" label="ROLE_DA" />
                                <Option value="ROLE_RELAY" label="ROLE_RELAY" />
                                <Option value="ROLE_EXIT" label="ROLE_EXIT" />
                                <Option value="ROLE_CLIENT" label="ROLE_CLIENT" />
                                <Option value="ROLE_HS" label="ROLE_HS" />
                            </Select>
                        </FormItem>
                    </Form>
                </template>
                <template v-else>
                    <span>{{ dialogMessage }}</span>
                </template>

                <!-- <div slot="footer">
                    <Button @click="dialogVisible = false">取消</Button>
                    <Button type="primary" @click="confirmAction">确认</Button>
                </div> -->
            </Modal>
        </template>
    </div>
</template>

<script>
import { formatDate, formatBytes, formatPercentage } from "@/lib/formatters.js";
import { handleApiSafely } from "@/lib/utils.js";
import { fetchNodeDetail, updateNode, createRelay, deleteRelay, fetchRelayList, deleteNode, updateRelay } from '@/api/node';
const worldMap = () => import('@/views/components/worldMap');

export default {
    name: 'NodeDetail',
    components: {
        worldMap
    },
    emits: ['refresh-and-clear'],
    props: {
        nodeId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            node: null,
            dialogVisible: false,
            dialogTitle: '',
            dialogMessage: '',
            currentAction: '',
            nodeForm: {
                nodeId: '',
                role: '',
                status: ''
            },
            relayForm: {
                //nickname: '',
                relayId: '',
                type: '',
                role: ''
            },
            selectedRelay: null,
            tableColumns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        const row = params.row;

                        // 创建统一样式的信息项
                        const createInfoItem = (label, value) => {
                            return h('div', {
                                class: 'info-item',
                                style: {
                                    marginBottom: '5px',
                                    padding: '5px 0',
                                    borderBottom: '1px solid rgba(13, 36, 81, 0.3)',
                                    transition: 'all 0.3s ease'
                                }
                            }, [
                                h('span', {
                                    class: 'label',
                                    style: {
                                        display: 'inline-block',
                                        fontWeight: '600',
                                        //marginRight: '5px',
                                        color: '#6EDDF1',
                                        minWidth: '80px',
                                        fontSize: '13px',
                                        textShadow: '0 0 6px rgba(117, 222, 239, 0.3)'
                                    }
                                }, label),
                                h('span', {
                                    style: {
                                        color: '#75deef',
                                        fontSize: '13px',
                                        fontFamily: "'Courier New', monospace"
                                    }
                                }, value || '无')
                            ]);
                        };

                        return h('div', {
                            class: 'detail-info',
                            style: {
                                padding: '10px',
                                background: '#151456',
                                //borderRadius: '4px'
                            }
                        }, [
                            h('Row', { props: { gutter: 8 } }, [
                                h('Col', { props: { span: 12 } }, [
                                    createInfoItem('中继ID:', row.relayId),
                                    createInfoItem('昵称:', row.nickname),
                                    createInfoItem('指纹:', row.fingerprint),
                                    createInfoItem('IP 地址:', row.ipAddress),
                                    createInfoItem('OR端口:', row.orPort),
                                    createInfoItem('DIR端口:', row.dirPort),
                                    createInfoItem('带宽:', formatBytes(row.bandwidth)),
                                    createInfoItem('退出策略:', row.exitPolicy),
                                    createInfoItem('发布时间:', row.published ? formatDate(row.published) : null),
                                    h('div', { style: {} }, [
                                        h('p', [
                                            h('strong', { style: { color: '#75deef', marginRight: '8px' } }, '节点flags: '),
                                            Array.isArray(params.row.flags) && params.row.flags.length > 0
                                                ? h('div', { style: { display: 'inline-block', marginLeft: '15px' } }, params.row.flags.map(flag => {
                                                    return h('span', {
                                                        style: {
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            margin: '0 5px 5px 0',
                                                            fontSize: '13px',
                                                            fontFamily: "'Courier New', monospace",
                                                            //background: 'rgba(13, 36, 81, 0.6)',
                                                            color: '#75deef',
                                                            //border: '1px solid rgba(117, 222, 239, 0.4)'
                                                        }
                                                    }, flag);
                                                }))
                                                : '暂无数据'
                                        ]),
                                    ])
                                ]),
                                h('Col', { props: { span: 12 } }, [
                                    createInfoItem('Tor版本:', row.version),
                                    createInfoItem('平台信息:', row.platform),
                                    createInfoItem('VPS节点ID:', row.nodeId),
                                    createInfoItem('容器ID:', row.containerId),
                                    createInfoItem('容器名称:', row.containerName),
                                    createInfoItem('中继状态:', row.status),
                                    createInfoItem('创建时间:', row.createdAt ? formatDate(row.createdAt) : null),
                                    createInfoItem('更新时间:', row.updatedAt ? formatDate(row.updatedAt) : null),
                                    createInfoItem('中继类型:', row.relayType),
                                    createInfoItem('中继类型:', row.relayRole),
                                ])
                            ]),
                        ]);
                    }
                },
                {
                    title: '中继ID',
                    key: 'relayId',
                    width: 150,
                },
                {
                    title: '状态',
                    key: 'status',
                    width: 150,
                    // render: (h, params) => {
                    //     let color;
                    //     switch (params.row.status) {
                    //         case 'RELAY_RUNNING': color = 'success'; break;
                    //         case 'RELAY_STOPPED': color = 'warning'; break;
                    //         case 'RELAY_FAILED': color = 'error'; break;
                    //         case 'RELAY_CREATING': color = 'primary'; break;
                    //         case 'RELAY_DESTROYING': color = 'default'; break;
                    //         default: color = 'default';
                    //     }
                    //     return h('Tag', {
                    //         props: { color: color }
                    //     }, params.row.status);
                    // }
                },
                {
                    title: '中继类型',
                    key: 'relayType',
                    width: 120
                },
                // {
                //     title: '节点flags',
                //     key: 'flags',
                //     width: 150,
                //     render: (h, params) => {
                //         return h('p', [
                //             Array.isArray(params.row.flags) && params.row.flags.length > 0
                //                 ? h('div', { style: { display: 'inline-block', } }, params.row.flags.map(flag => {
                //                     return h('span', {
                //                         style: {
                //                             display: 'inline-block',
                //                             padding: '2px 8px',
                //                             margin: '0 5px 0 0',
                //                             //fontSize: '13px',
                //                             //fontFamily: "'Courier New', monospace",
                //                             //background: 'rgba(13, 36, 81, 0.6)',
                //                             color: '#75deef',
                //                             //border: '1px solid rgba(117, 222, 239, 0.4)'
                //                         }
                //                     }, flag);
                //                 }))
                //                 : '暂无数据'
                //         ])
                //     }
                // },
                {
                    title: '操作',
                    key: 'action',
                    width: 250,
                    render: (h, params) => {
                        const btnStyle = {
                            width: '250px',
                            height: '30px',
                            padding: '0 20px',
                            borderRadius: '6px',
                            //fontWeight: '600',
                            fontSize: '12px',
                            transition: 'all 0.3s ease',
                            border: '1px solid #75deef',
                            color: '#75deef',
                            background: '#1a3c58',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        };

                        return h('div', {
                            style: {
                                display: 'flex',
                                gap: '10px'
                            }
                        }, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    ...btnStyle,
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.openRelayDialog('updateRelay', params.row);
                                    }
                                }
                            }, '更新中继信息'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: btnStyle,
                                on: {
                                    click: () => {
                                        this.openRelayDialog('destroyRelay', params.row);
                                    }
                                }
                            }, '销毁中继')
                        ]);
                    }
                }
            ],
            relayData: []
        };
    },
    watch: {
        nodeId: {
            handler(newNodeId) {
                if (newNodeId) {
                    this.fetchNodeData(newNodeId);
                }
                else {
                    this.node = null;
                }
            },
            immediate: true
        }
    },
    methods: {
        formatDate,
        formatBytes,
        formatPercentage,

        async fetchNodeData(nodeId) {
            // 获取节点详情
            const nodeData = await handleApiSafely(
                () => fetchNodeDetail(nodeId),
                '获取节点详情'
            );
            if (nodeData) {
                this.node = nodeData;
            }

            // 获取中继列表
            const relayList = await handleApiSafely(
                () => fetchRelayList(nodeId),
                '获取中继列表'
            );
            if (relayList) {
                this.relayData = relayList;
            }
        },

        openRelayDialog(action, relay) {
            this.currentAction = action;
            this.selectedRelay = relay;

            if (action === 'updateRelay') {
                this.dialogTitle = '更新中继信息';
                this.relayForm = {
                    relayId: relay.relayId,
                    type: relay.relayType,
                    role: relay.relayRole,
                };
            } else if (action === 'destroyRelay') {
                this.dialogTitle = '销毁中继';
                this.dialogMessage = `确定要销毁中继 ${relay.relayId} 吗？此操作不可恢复。`;
            }

            this.dialogVisible = true;
        },

        async destroyRelay() {
            console.log('销毁中继', this.selectedRelay);

            const message = await handleApiSafely(
                () => deleteRelay(this.selectedRelay.relayId, {
                    userId: 'admin' // 使用当前用户ID
                }),
                "销毁中继"
            );

            if (message) {
                this.$Message.success(message);
                // 刷新中继列表和节点信息
                await this.fetchNodeData(this.nodeId);
            }
        },

        async updateRelayInfo() {
            console.log('更新中继信息', this.selectedRelay, this.relayForm);

            const message = await handleApiSafely(
                () => updateRelay(this.selectedRelay.relayId, {
                    type: this.relayForm.type,
                    role: this.relayForm.role,
                    userId: 'admin' // 使用当前用户ID
                }),
                "更新中继信息"
            );

            if (message) {
                this.$Message.success(message);
                // 刷新中继列表
                await this.fetchNodeData(this.nodeId);
            }
        },

        refresh() {
            if (this.nodeId) {
                this.fetchNodeData(this.nodeId);
            }
        },

        goBack() {
            // 触发事件通知父组件刷新和清除选中
            this.$emit('refresh-and-clear');
            // 导航回节点列表页
            this.$router.push('/nodes');
        },


        openDialog(action) {
            this.currentAction = action;
            if (action === 'createRelay') {
                this.dialogTitle = '创建中继节点';
                this.relayForm = {
                    relayId: '',
                    role: '',
                    type: '',
                }
            } else if (action === 'updateRole') {
                this.dialogTitle = '更新节点角色';
                this.nodeForm = {
                    nodeId: this.node.nodeId,
                    role: this.node.role,
                    status: this.node.status,
                };
            } else if (action === 'updateStatus') {
                this.dialogTitle = '更新节点状态';
                this.nodeForm = {
                    nodeId: this.node.nodeId,
                    role: this.node.role,
                    status: this.node.status,
                };
            } else if (action === 'destroyNode') {
                this.dialogTitle = '销毁节点';
                this.dialogMessage = `确定要销毁 ${this.node.nodeId} 节点吗？`;
            }
            this.dialogVisible = true;
        },

        async confirmAction() {
            try {
                if (this.currentAction === 'createRelay') {
                    await this.createNewRelay();
                    await this.fetchNodeData(this.nodeId);
                } else if (this.currentAction === 'updateRole') {
                    await this.updateRole();
                    await this.fetchNodeData(this.nodeId);
                } else if (this.currentAction === 'updateStatus') {
                    await this.updateStatus();
                    await this.fetchNodeData(this.nodeId);
                } else if (this.currentAction === 'destroyNode') {
                    await this.destroyNode();
                } else if (this.currentAction === 'destroyRelay') {
                    await this.destroyRelay();
                } else if (this.currentAction === 'updateRelay') {
                    await this.updateRelayInfo();
                }
                this.dialogVisible = false;
            } catch (error) {
                console.error('操作失败', error);
                this.$Message.error('操作失败，请重试');
            }
        },

        async createNewRelay() {
            console.log('创建中继节点', this.node, this.relayForm);
            const message = await handleApiSafely(() => createRelay(this.node.nodeId,
                {
                    type: this.relayForm.type,
                    role: this.relayForm.role,
                    userId: 'admin',
                })
                , "创建中继节点");
            this.$Message.success(message);
        },

        async updateRole() {
            console.log('更新节点角色', this.node, this.nodeForm);
            const message = await handleApiSafely(() => updateNode(this.node.nodeId,
                {
                    role: this.nodeForm.role,
                    userId: 'admin',
                })
                , "更新节点角色");
            this.$Message.success(message);
        },

        async updateStatus() {
            console.log('更新节点状态', this.node, this.nodeForm);
            const message = await handleApiSafely(() => updateNode(this.node.nodeId,
                {
                    status: this.nodeForm.status,
                    userId: 'admin',
                })
                , "更新节点状态");
            this.$Message.success(message);
        },

        async destroyNode() {
            console.log('销毁节点', this.node);
            const message = await handleApiSafely(
                () => deleteNode(this.node.nodeId, 'admin'),  // 传递nodeId和userId
                "销毁节点"
            );
            if (message) {
                this.$Message.success(message);
                this.goBack();
            }
        },

        statusTagType(status) {
            switch (status) {
                case "ONLINE":
                    return "success";
                case "OFFLINE":
                    return "warning";
                case "DESTROYING":
                    return "error";
                default:
                    return "default";
            }
        },

        roleClass(role) {
            switch (role) {
                case "VPS_DA":
                    return "role-vps-da";
                case "VPS_RELAY":
                    return "role-vps-relay";
                case "CLIENT":
                    return "role-client";
                default:
                    return "";
            }
        }
    }
};
</script>


<style lang="less" scoped>
// 颜色变量
@primary-color: #75deef;
@border-color: #0D2451;
@bg-primary: #03044A;
@bg-secondary: #151456;
@text-primary: #6EDDF1;
@text-secondary: #75deef;
@text-light: rgba(117, 222, 239, 0.6);
@hover-bg: rgba(117, 222, 239, 0.1);
@card-bg: #151456;


.detail-page {
    padding: 16px;
    height: 100%;
    background: @bg-primary;
    overflow-y: auto;
    box-sizing: border-box;

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

    .loading-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .empty-state {
            text-align: center;
            padding: 60px 20px;

            .ivu-icon {
                display: block;
                margin: 0 auto 16px;
                color: @text-light !important;
            }

            p {
                font-size: 16px;
                color: @text-light;
                margin: 0;
                font-weight: 300;
            }
        }
    }

    .main-layout {
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;

        .top-section {
            display: flex;
            gap: 20px;
            height: 280px;

            .detail-map {
                //flex: 2; // 地图占2/3空间
                height: 250px;
                width: 400px;
                position: relative;
                border: 1px solid @border-color;
            }

            .action-buttons {
                flex: 1; // 按钮区占1/3空间
                display: flex;
                flex-direction: column;
                justify-content: center; // 垂直居中
                padding: 20px;
                backdrop-filter: blur(10px);
                box-sizing: border-box;

                .ivu-btn {
                    width: 120px;
                    height: 30px; // 固定按钮高度
                    margin: 0 0 12px 0; // 底部间距
                    padding: 0 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.3s ease;
                    border: 1px solid #75deef;
                    color: #75deef;
                    background: #1a3c58;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:last-child {
                        margin-bottom: 0; // 最后一个按钮底部无间距
                    }

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
        }

        .bottom-section {
            flex: 1;

            .detail-card {
                background: @card-bg;
                border: 1px solid @border-color;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(3, 4, 74, 0.6);
                margin-bottom: 20px;
                backdrop-filter: blur(10px);

                .detail-info {
                    .info-item {
                        margin-bottom: 5px;
                        padding: 12px 0;
                        border-bottom: 1px solid rgba(13, 36, 81, 0.3);
                        transition: all 0.3s ease;

                        &:last-child {
                            border-bottom: none;
                        }


                        .label {
                            display: inline-block;
                            font-weight: 600;
                            margin-right: 12px;
                            color: @text-primary;
                            min-width: 80px;
                            font-size: 13px;
                            text-shadow: 0 0 6px rgba(117, 222, 239, 0.3);
                        }

                        span:not(.label) {
                            color: @text-secondary;
                            font-size: 13px;
                            font-family: 'Courier New', monospace;
                        }
                    }
                }
            }

            // 角色样式类
            .role-vps-da {
                color: #fff;
                background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            }

            .role-vps-relay {
                color: #fff;
                background: linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            }

            .role-client {
                color: #fff;
                background: linear-gradient(135deg, #1f9ba2 0%, #4dd0e1 100%);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            }
        }
    }
}

// iView组件样式覆盖
/deep/ .ivu-card {
    background: @card-bg !important;
    border: 1px solid @border-color !important;
    color: @text-primary !important;

    .ivu-card-body {
        background: transparent !important;
    }
}

/deep/ .ivu-tag {
    background: rgba(117, 222, 239, 0.2) !important;
    border: 1px solid rgba(117, 222, 239, 0.4) !important;
    color: @text-primary !important;
    font-size: 11px !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
}

.expandable-table-card {
    margin-top: 20px;

    .expandable-table {
        width: 100%;
        //max-width: 99% !important;
        border: 1px solid @bg-secondary !important;
        border-radius: 4px;
        overflow: hidden;
        //margin-top: 20px;
        background: @bg-secondary;

        // /deep/ .ivu-table-wrapper {
        //     width: 100% !important;
        //     max-width: 100% !important;
        //     overflow: hidden !important;
        //     border: 1px solid @border-color !important;
        // }

        /deep/ .ivu-table {
            background: @bg-secondary;
            color: @text-primary;
            margin: 0;
            border: none !important;

            &:before,
            &:after {
                display: none;
                background-color: transparent !important;
            }


            th {
                background: @bg-secondary;
                color: @text-secondary;
                border-bottom: 1px solid rgba(117, 222, 239, 0.6) !important;
            }

            td {
                background: @border-color;
                border-bottom: 1px solid rgba(13, 36, 81, 0.3);
                border-left: none !important;
            }

            tr:first-child td {
                border-top: none !important;
            }

            .ivu-table-row:hover td {
                background-color: rgba(117, 222, 239, 0.1);
            }

            .ivu-table-expanded-cell {
                //padding: 20px;
                background: @bg-secondary;
                color: @text-primary !important;
            }
        }
    }
}
</style>
