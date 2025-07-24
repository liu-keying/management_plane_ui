<template>
  <div class="node-detail">
    <div v-if="node === null" class="loading-container">
      <el-empty description="请在左侧选择节点" />
    </div>
    <template v-else>
      <MapView :points="[node]" :lineConnections="[]" />
      <el-card :body-style="{ padding: '20px' }" class="detail-card">
        <!-- <h2 class="title">节点详细信息</h2> -->

        <div class="detail-info">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="info-item">
                <span class="label">节点ID:</span>
                <span>{{ node.nodeId }}</span>
              </div>
              <div class="info-item">
                <span class="label">昵称:</span>
                <span>{{ node.nickname || '无' }}</span>
              </div>
              <div class="info-item">
                <span class="label">IP地址:</span>
                <span>{{ node.ipAddress || '无' }}</span>
              </div>
              <div class="info-item">
                <span class="label">指纹:</span>
                <span>{{ node.fingerprint || '无' }}</span>
              </div>
              <div class="info-item">
                <span class="label">中继数量:</span>
                <span>{{ node.relayCount }}</span>
              </div>
            </el-col>

            <el-col :span="6">

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
                <span class="label">最大中继容量：</span>
                <span>{{ node.maxRelayCapacity }}</span>
              </div>
            </el-col>

            <el-col :span="6">
              <div class="info-item">
                <span class="label">角色:</span>
                <span>{{ node.role }}</span>
                <!-- <span :class="roleClass(node.role)">{{ node.role }}</span> -->
              </div>
              <div class="info-item">
                <span class="label">状态:</span>
                <span> {{ node.status }} </span>
                <!-- <el-tag :type="statusTagType(node.status)" size="small">{{ node.status }}</el-tag> -->
              </div>
              <div class="info-item">
                <span class="label">风险等级:</span>
                <span>{{ node.riskLevel }}</span>
              </div>

              <div class="info-item">
                <span class="label">云提供商:</span>
                <span>{{ node.cloudProvider }}</span>
              </div>

            </el-col>

            <el-col :span="6">
              <div class="info-item">
                <span class="label">地理位置:</span>
                <span>{{ node.geoLocation }}</span>
              </div>
              <div class="info-item">
                <span class="label">创建时间:</span>
                <span>{{ formatDate(node.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="label">创建人:</span>
                <span>{{ node.createdBy || '无' }}</span>
              </div>
              <div class="info-item">
                <span class="label">最后心跳:</span>
                <span>{{ formatDate(node.lastHeartbeat) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
              <!-- 按钮区域 -->
        <div class="action-buttons">
          <el-button type="primary" @click="openDialog('createRelay')">创建中继节点</el-button>
          <el-button type="warning" @click="openDialog('updateNode')">更新节点信息</el-button>
          <el-button type="danger" @click="openDialog('destroyNode')">销毁节点</el-button>
          <el-button type="primary" @click="refresh()" class="back-button">刷新</el-button>
        </div>
      <!-- 弹窗 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
        <template v-if="currentAction === 'updateNode'">
          <el-form :model="nodeForm" label-width="100px">>
            <el-form-item label="昵称">
              <el-input v-model="nodeForm.nickname" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="nodeForm.role" placeholder="选择角色">
                <el-option label="VPS_TE" value="VPS_TE" />
                <el-option label="VPS_RELAY" value="VPS_RELAY" />
                <el-option label="CLIENT" value="CLIENT" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="nodeForm.status" placeholder="选择状态">
                <el-option label="ONLINE" value="ONLINE" />
                <el-option label="OFFLINE" value="OFFLINE" />
                <el-option label="DESTROYING" value="DESTROYING" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template v-else-if="currentAction === 'createRelay'">
          <el-form :model="relayForm" label-width="100px">>
            <el-form-item label="昵称">
              <el-input v-model="relayForm.nickname" />
            </el-form-item>
            <el-form-item label="中继类型">
              <el-select v-model="relayForm.type" placeholder="选择类型">
                <el-option label="ANONYMOUS" value="ANONYMOUS" />
                <el-option label="ACCESS" value="ACCESS" />
                <el-option label="UNKNOWN" value="UNKNOWN" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <span>{{ dialogMessage }}</span>
        </template>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAction">确认</el-button>
        </template>
      </el-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard } from 'element-plus';
import { ElMessage } from 'element-plus';
import { formatDate, formatBytes, formatPercentage } from "@/utils/formatters.ts";
import { fetchNodeDetail, type NodeItem } from '@/api/node';


import MapView from '@/components/MapView.vue';

const router = useRouter();

const goBack = () => {
  router.push('/node');
};

const refresh = () => {
  fetchNodeDetail(props.nodeId);
}


// 弹窗控制
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const currentAction = ref('');

const nodeForm = ref({
  nodeId: '',
  nickname: '',
  role: '',
  status: ''
});

const relayForm = ref({
  nickname: '',
  type: ''
});

// 打开弹窗
const openDialog = (action: string) => {
  currentAction.value = action;
  if (action === 'createRelay') {
    dialogTitle.value = '创建中继节点';
  } else if (action === 'updateNode') {
    dialogTitle.value = '更新节点';
    // 填充 nodeForm
    nodeForm.value = {
      nodeId: node.value.nodeId,
      nickname: node.value.nickname,
      role: node.value.role,
      status: node.value.status,
    };
  } else if (action === 'destroyNode') {
    dialogTitle.value = '销毁节点';
    dialogMessage.value = '确定要销毁此节点吗？';
  }
  dialogVisible.value = true;
};

// 点击确认按钮
const confirmAction = async () => {
  try {
    if (currentAction.value === 'createRelay') {
      await createRelay();
      await fetchNodeDetail(nodeId); // 成功后刷新节点数据
    } else if (currentAction.value === 'updateNode') {
      await updateNode();
      await fetchNodeDetail(nodeId);     // 成功后刷新节点数据
    } else if (currentAction.value === 'destroyNode') {
      await deleteNode();

      //ElMessage.success('节点销毁成功');
    }
    dialogVisible.value = false; // 成功后自动关闭弹窗
  } catch (error) {
    console.error('操作失败', error);
    ElMessage.error('操作失败，请重试');
  }
};

const createRelay = async () => {
  console.log('创建中继节点', node.value, relayForm.value);
  if (useMock) {
    node.value.relayCount++;
    ElMessage.success('中继节点创建成功');
    return;
  }
  try {
    const response = await axios.post('/api/nodes', {
      nickname: relayForm.value.nickname,
      nodeId: node.value.nodeId,
      role: node.value.role,
      status: node.value.status,
      createdBy: null,//TODO: 传递管理员ID
      relayType: relayForm.value.type
    });

    if (response.status === 201) {
      ElMessage.success('中继节点创建成功');
    } else {
      ElMessage.error('中继节点创建失败，请稍后重试');
    }
  } catch (error) {
    console.error('创建中继节点失败：', error);
    ElMessage.error('中继节点创建失败');
  }
};

const updateNode = async () => {
  console.log('更新节点，新的数据：', nodeForm.value);
  if (useMock.value) {
    if (node.value) {
      node.value.nickname = nodeForm.value.nickname;
      node.value.role = nodeForm.value.role as NodeItem['role'];
      node.value.status = nodeForm.value.status as NodeItem['status'];
    }
    ElMessage.success('节点更新成功');
    return;
  }
  try {
    const nodeId = nodeForm.value.nodeId;
    const response = await axios.put(`/api/nodes/${nodeId}`, {
      nickname: nodeForm.value.nickname,
      role: nodeForm.value.role,
      status: nodeForm.value.status,
      userId: null //TODO: 传递管理员ID
    });

    if (response.status === 200) {
      ElMessage.success('节点更新成功');
    }
    else {
      ElMessage.error('节点更新失败，请稍后重试');
    }
  } catch (error) {
    console.error('更新失败：', error);
    ElMessage.error('节点更新失败');
  }
};

const deleteNode = async () => {
  console.log('销毁节点', node.value);
  if (useMock) {
    ElMessage.success('节点销毁成功');
    goBack(); // 销毁后返回节点列表
    return;
  }
  try {
    const userId = null; //TODO: 传递管理员ID
    const response = await axios.delete(`/api/nodes/node/${node.value.nodeId}?userId=${userId}`
    );
    if (response.status === 200) {
      ElMessage.success('节点销毁成功');
      goBack(); // 销毁后返回节点列表
    } else {
      ElMessage.error('节点销毁失败，请稍后重试');
    }
  } catch (error) {
    console.error('销毁节点失败：', error);
    ElMessage.error('节点销毁失败');
  }
};

const route = useRoute();


const props = defineProps<{
  nodeId: string;
}>();

const node = ref<NodeItem | null>(null);

watch(() => props.nodeId, async (newNodeId) => {
  if (newNodeId === null) {
    return;
  }
  const nodeData = await fetchNodeDetail(newNodeId);
  if (nodeData === null) {
    ElMessage.error('节点信息不存在或获取失败');
    return;
  }
  node.value = nodeData;
}, { immediate: true });



// 根据状态返回合适的标签类型
const statusTagType = (status) => {
  switch (status) {
    case "ONLINE":
      return "success";
    case "OFFLINE":
      return "warning";
    case "DESTROYING":
      return "danger";
    default:
      return "info";
  }
};

// 根据角色返回不同的样式
const roleClass = (role) => {
  switch (role) {
    case "VPS_TE":
      return "role-vps-te";
    case "VPS_RELAY":
      return "role-vps-relay";
    case "CLIENT":
      return "role-client";
    default:
      return "";
  }
};

// 页面加载时获取节点数据
onMounted(async () => {
//   const nodeData = await fetchNodeDetail(props.nodeId);
//   if (nodeData === null) {
//     ElMessage.error('节点信息不存在或获取失败');
//     return;
//   }
//   node.value = nodeData;
// 
});


</script>

<style scoped>

.map-view {
  width: 50%; 
  height: 300px; 
}

.node-detail {
  padding: 10px;

}

.detail-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 20px auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.detail-info .info-item {
  margin-bottom: 16px;
}

.detail-info .label {
  font-weight: bold;
  margin-right: 10px;
  color: #333;
}

.role-vps-te {
  color: #fff;
  background-color: #1976d2;
}

.role-vps-relay {
  color: #fff;
  background-color: #7b1fa2;
}

.role-client {
  color: #fff;
  background-color: #1f9ba2;
}

.action-buttons {
  margin-top: 20px;
  text-align: center;
}

.action-buttons .el-button {
  margin-left: 10px;
}

.back-button {
  /* margin-bottom: 20px;*/
  margin-left: 10px;
  background-color: #ffffff;
  /* border: 1px solid #dcdfe6; */
  color: #409eff;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ecf5ff;
  border-color: #c6e2ff;
  color: #409eff;
}

.back-button:active {
  background-color: #d9ecff;
  border-color: #a0cfff;
  color: #337ecc;
}
</style>
