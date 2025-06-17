<template>
  <div class="link-detail">
    <MapView :points="transformedPoints" :lineConnections="lineConnections" />
    <el-card :body-style="{ padding: '20px' }" class="detail-card">
      <div class="detail-info">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">链路ID:</span>
              <span>{{ link?.linkId }}</span>
            </div>
            <div class="info-item">
              <span class="label">路由策略:</span>
              <span>{{ link?.routingPolicy }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态:</span>
              <span>{{ link?.status }}</span>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="info-item">
              <span class="label">创建时间:</span>
              <span>{{ formatDate(link?.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">创建人:</span>
              <span>{{ link?.createdBy }}</span>
            </div>
            <div class="info-item">
              <span class="label">更新时间:</span>
              <span>{{ formatDate(link?.updatedAt) }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="info-item">
              <span class="label">电路:</span>
              <span>{{ formatPath(link?.nodeIds) }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="action-buttons">

        <el-button type="primary" @click="openDialog('updateLink')">更新链路</el-button>
        <el-button type="danger" @click="openDialog('destroyLink')">销毁链路</el-button>
        <el-button type="primary" @click="goBack" class="back-button">返回链路列表</el-button>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <template v-if="currentAction === 'updateLink'">
        <el-form :model="editForm" label-width="100px">
          <el-form-item label="链路ID">
            <el-input v-model="editForm.linkId" />
          </el-form-item>
          <el-form-item label="路由策略">
            <el-select v-model="editForm.routingPolicy" placeholder="选择策略">
              <el-option label="RANDOM" value="RANDOM" />
              <el-option label="SPECIFIED" value="SPECIFIED" />
              <el-option label="RECOMMEND" value="RECOMMEND" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="editForm.status" placeholder="选择状态">
              <el-option label="ACTIVE" value="ACTIVE" />
              <el-option label="INACTIVE" value="INACTIVE" />
              <el-option label="PENDING" value="PENDING" />
            </el-select>
          </el-form-item>

          <!-- 新增！当routingPolicy为RECOMMEND时显示地图 -->
          <template v-if="editForm.routingPolicy === 'RECOMMEND'">
            <div style="margin-top: 20px;">
              <el-button type="primary" @click="openDrawer">选择电路</el-button>
              <div style="margin-top: 10px;">
                <span>当前电路: </span>
                <span v-if="editForm.nodeIds.length">{{ formatPath(editForm.nodeIds) }}</span>
                <span v-else>{{ formatPath(link.nodeIds) }}</span>
              </div>
            </div>
          </template>

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
    <el-drawer v-model="drawerVisible" title="选择电路节点" size="50%" direction="rtl" :destroy-on-close="true">
      <div style="height: calc(100% - 60px); padding: 10px;">
        <MapView :points="points" :selectedNodeIds="editForm.value.nodeIds" @selectPoint="handleSelectPoint" />
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="drawerVisible = false">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard } from 'element-plus';
import { ElMessage } from 'element-plus';
import { computed } from "vue";
import {formatDate} from "@/utils/formatters.ts";

import useGlobalConfig from '@/composables/useGlobalConfig';
import MapView from '@/components/MapView.vue';

const { useMock } = useGlobalConfig();

const route = useRoute();
const router = useRouter();
const link = ref(null);

const mockData = [
  {
    linkId: 1,
    nodeIds: [1, 2, 3, 4],
    routingPolicy: "RANDOM",
    status: "ACTIVE",
    createdBy: 'admin',
    createdAt: "2025-03-15T12:30:00",
    updatedAt: "2025-03-20T14:45:10"
  },
  {
    linkId: 2,
    nodeIds: [4, 5, 6, 7],
    routingPolicy: "SPECIFIED",
    status: "INACTIVE",
    createdBy: 2,
    createdAt: "2025-02-10T09:15:45",
    updatedAt: "2025-03-01T10:20:30"
  }
];

const points = [
 // {
 //   nodeId: 1,
 //   nickname: 'test1',
 //   fingerprint: 'a1b2c3d4e5f6g7h8',
 //   ipAddress: '192.168.1.1',
 //   role: 'CLIENT',
 //   status: 'ONLINE',
 //   riskLevel: 2,
 //   cpuUsage: 45.5,
 //   memoryUsage: 67.2,
 //   trafficIn: 1250000,
 //   trafficOut: 700000,
 //   geoLocation: 'Beijing, China',
 //   cloudProvider: 'AWS',
 //   createdAt: '2023-01-01T12:00:00',
 //   createdBy: 'admin',
 //   lastHeartbeat: '2025-04-28T10:30:00',
 //   longitude: 116.4,
 //   latitude: 39.9
 // },
 // {
 //   nodeId: 2,
 //   nickname: 'testRelay',
 //   fingerprint: 'f1e2d3c4b5a6978g',
 //   ipAddress: '192.168.2.2',
 //   role: 'VPS_RELAY',
 //   status: 'OFFLINE',
 //   riskLevel: 3,
 //   cpuUsage: 88.1,
 //   memoryUsage: 74.6,
 //   trafficIn: 2000000,
 //   trafficOut: 1200000,
 //   geoLocation: 'Shanghai, China',
 //   cloudProvider: 'Azure',
 //   createdAt: '2023-03-15T08:45:00',
 //   createdBy: 'system',
 //   lastHeartbeat: '2025-04-27T09:10:00',
 //   longitude: 121.5,
 //   latitude: 31.2
 // },
  // {
  //   nodeId: 3,
  //   nickname: 'test3',
  //   fingerprint: 'abc123def456ghi789',
  //   ipAddress: '10.0.0.3',
  //   role: 'VPS_TE',
  //   status: 'DESTROYING',
  //   riskLevel: 1,
  //   cpuUsage: 52.3,
  //   memoryUsage: 49.7,
  //   trafficIn: 1500000,
  //   trafficOut: 850000,
  //   geoLocation: 'Guangzhou, China',
  //   cloudProvider: 'Tencent Cloud',
  //   createdAt: '2022-12-20T14:30:00',
  //   createdBy: 'admin',
  //   lastHeartbeat: '2025-04-26T14:00:00',
  //   longitude: 113.3,
  //   latitude: 23.1
  // },
  // {
  //   nodeId: 4,
  //   nickname: 'test-4',
  //   fingerprint: 'xyz987uvw654rst321',
  //   ipAddress: '172.16.4.4',
  //   role: 'CLIENT',
  //   status: 'ONLINE',
  //   riskLevel: 0,
  //   cpuUsage: 33.0,
  //   memoryUsage: 50.0,
  //   trafficIn: 500000,
  //   trafficOut: 250000,
  //   geoLocation: 'New York, USA',
  //   cloudProvider: 'AWS',
  //   createdAt: '2023-06-10T20:00:00',
  //   createdBy: 'admin',
  //   lastHeartbeat: '2025-04-28T10:00:00',
  //   longitude: -74.006,
  //   latitude: 40.7128
  // },
];
const transformedPoints = computed(() => {
  return points.map(point => ({
    ...point,
    value: [point.longitude, point.latitude],
    id: point.nodeId,
  }));
});

const lineConnections = [
  [1, 2],
  [2, 3],
  [3, 4],
];

const fetchLinkDetail = async () => {
    try {
      const response = await axios.get(`/api/links/${route.params.linkId}`);
      link.value = response.data;
    } catch (error) {
      console.error('获取链路详情失败:', error);
    }

};

const drawerVisible = ref(false);

const openDrawer = () => {
  drawerVisible.value = true;
};

// 弹窗控制
const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const currentAction = ref('');

const editForm = ref({
  linkId: '',
  routingPolicy: '',
  status: '',
  nodeIds: []
});


// 打开弹窗
const openDialog = (action) => {
  currentAction.value = action;
  if (action === 'updateLink') {
    dialogTitle.value = '更新链路';
    // 填充 editForm
    editForm.value = {
      linkId: link.value.linkId,
      routingPolicy: link.value.routingPolicy,
      status: link.value.status,
      nodeIds:[]
      // nodeIds: [...(link.value.nodeIds || [])]
    };
  } else if (action === 'destroyLink') {
    dialogTitle.value = '销毁链路';
    dialogMessage.value = '确定要销毁此链路吗？';
  }
  dialogVisible.value = true;
};

// 点击确认按钮
const confirmAction = async () => {
  try {
    if (currentAction.value === 'updateLink') {
      await updateLink();
      console.log('更新链路，新的数据：', editForm.value);
      link.value.id = editForm.value.id;
      link.value.routingPolicy = editForm.value.routingPolicy;
      link.value.status = editForm.value.status;
      link.value.nodeIds = editForm.value.nodeIds;
      // TODO: 调用API
      ElMessage.success('链路更新成功');
    } else if (currentAction.value === 'destroyLink') {
      console.log('销毁链路', link.value);
      // TODO: 调用API
      ElMessage.success('链路销毁成功');
    }

    dialogVisible.value = false; // ✅ 成功后自动关闭弹窗
    await fetchLinkDetail();     // 
  } catch (error) {
    console.error('操作失败', error);
    ElMessage.error('操作失败，请重试');
  }
};

const handleSelectPoint = (point) => {
  if (!editForm.value.nodeIds.includes(point.id)) {
    editForm.value.nodeIds.push(point.id);
  }
};

const formatPath = (nodes) => {
  if (!nodes || nodes.length === 0) return 'N/A';
  return nodes.map((id) => `节点${id}`).join(' → ');
};



const goBack = () => {
  router.push('/link');
};

const goToUpdate = () => {
  router.push(`/link/${route.params.linkId}/update`);
};

const goToDelete = () => {
  router.push(`/link/${route.params.linkId}/delete`);
};

onMounted(fetchLinkDetail);
</script>

<style scoped>
.link-detail {

  padding: 20px;
}

.detail-card {
  max-width: 700px;
  margin: 40px auto;
  /* 上下留空、左右居中 */
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.detail-info .info-item {
  margin-bottom: 16px;
}

.detail-info .label {
  font-weight: bold;
  margin-right: 8px;
  color: #555;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
  /* 按钮居中 */
}

.action-buttons .el-button {
  margin: 0 10px;
  /* 左右留点空隙 */
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