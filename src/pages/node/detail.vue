<template>
  <div class="node-detail">

    <MapView :points="points" :lineConnections="[]" />
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
              <span>{{ node.nickname }}</span>
            </div>
            <div class="info-item">
              <span class="label">IP地址:</span>
              <span>{{ node.ipAddress }}</span>
            </div>
            <div class="info-item">
              <span class="label">指纹:</span>
              <span>{{ node.fingerprint }}</span>
            </div>

          </el-col>

          <el-col :span="6">

            <div class="info-item">
              <span class="label">CPU使用率:</span>
              <span>{{ node.cpuUsage }}%</span>
            </div>
            <div class="info-item">
              <span class="label">内存使用率:</span>
              <span>{{ node.memoryUsage }}%</span>
            </div>
            <div class="info-item">
              <span class="label">流入流量:</span>
              <span>{{ formatTraffic(node.trafficIn) }}</span>
            </div>
            <div class="info-item">
              <span class="label">流出流量:</span>
              <span>{{ formatTraffic(node.trafficOut) }}</span>
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
              <span>{{ node.createdBy }}</span>
            </div>
            <div class="info-item">
              <span class="label">最后心跳:</span>
              <span>{{ formatDate(node.lastHeartbeat) }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 按钮区域 -->
      <div class="action-buttons">
        <el-button type="primary" @click="openDialog('createRelay')">创建 RELAY</el-button>
        <el-button type="warning" @click="openDialog('updateNode')">更新节点信息</el-button>
        <el-button type="danger" @click="openDialog('destroyNode')">销毁节点</el-button>
        <el-button type="primary" @click="goBack" class="back-button">返回节点列表</el-button>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <template v-if="currentAction === 'updateNode'">
        <el-form :model="editForm" label-width="100px">
          <el-form-item label="节点ID">
            <el-input v-model="editForm.nodeId" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="editForm.nickname" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="editForm.role" placeholder="选择角色">
              <el-option label="VPS_TE" value="VPS_TE" />
              <el-option label="VPS_RELAY" value="VPS_RELAY" />
              <el-option label="CLIENT" value="CLIENT" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editForm.status" placeholder="选择状态">
              <el-option label="ONLINE" value="ONLINE" />
              <el-option label="OFFLINE" value="OFFLINE" />
              <el-option label="DESTROYING" value="DESTROYING" />
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard } from 'element-plus';
import { ElMessage } from 'element-plus';

import MapView from '@/components/MapView.vue';

const router = useRouter();

const goBack = () => {
  router.push('/node'); 
};


// 弹窗控制
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const currentAction = ref('');

const editForm = ref({
  nodeId: '',
  nickname: '',
  role: '',
  status: ''
});


// 打开弹窗
const openDialog = (action) => {
  currentAction.value = action;
  if (action === 'createRelay') {
    dialogTitle.value = '创建 RELAY';
    dialogMessage.value = '确定要在此节点创建 RELAY 吗？';
  } else if (action === 'updateNode') {
    dialogTitle.value = '更新节点';
    // 填充 editForm
    editForm.value = {
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
      console.log('创建 RELAY', node.value);
      // TODO: 调用创建 RELAY 的 API
      ElMessage.success('RELAY 创建成功');
    } else if (currentAction.value === 'updateNode') {
      console.log('更新节点，新的数据：', editForm.value);
      node.value.id = editForm.value.nodeId;
      node.value.nickname = editForm.value.nickname;
      node.value.role = editForm.value.role;
      node.value.status = editForm.value.status;
      // TODO: 调用更新节点的 API
      ElMessage.success('节点更新成功');
    } else if (currentAction.value === 'destroyNode') {
      console.log('销毁节点', node.value);
      // TODO: 调用销毁节点的 API
      ElMessage.success('节点销毁成功');
    }

    dialogVisible.value = false; // ✅ 成功后自动关闭弹窗
    await fetchNodeDetail();     // ✅ 成功后刷新节点数据
  } catch (error) {
    console.error('操作失败', error);
    ElMessage.error('操作失败，请重试');
  }
};




const route = useRoute();

// 模拟数据：根据路由获取节点ID，加载节点详情
const nodeId = route.params.nodeId; // 假设路由传递了节点ID

const node = ref({});

const points = ref([]);

// 模拟从API或数据库获取节点数据
const fetchNodeDetail = () => {
  // 模拟请求数据
  const mockData = {
    nodeId: nodeId,
    nickname: "Node 1",
    fingerprint: "123456abcdef",
    ipAddress: "192.168.1.1",
    role: "CLIENT",
    status: "ONLINE",
    riskLevel: 3,
    cpuUsage: 75.5,
    memoryUsage: 60,
    trafficIn: 1000000,
    trafficOut: 500000,
    geoLocation: "Beijing, China",
    cloudProvider: "AWS",
    createdAt: "2023-01-01T12:00:00",
    createdBy: "admin",
    lastHeartbeat: "2023-04-26T15:00:00",
    longitude: 116.4,
    latitude: 39.9,
  };

  // 设置节点数据
  node.value = mockData;


  // 更新 points 中的 value
  points.value = [
    { id: nodeId, value: [mockData.longitude, mockData.latitude] }
  ];
};


// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 格式化流量
const formatTraffic = (traffic) => {
  if (traffic >= 1000000) {
    return (traffic / 1000000).toFixed(2) + " MB";
  } else if (traffic >= 1000) {
    return (traffic / 1000).toFixed(2) + " KB";
  } else {
    return traffic + " B";
  }
};

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
onMounted(() => {
  fetchNodeDetail();
});
</script>

<style scoped>
.node-detail {
  padding: 20px;

}

.detail-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 40px auto;
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
