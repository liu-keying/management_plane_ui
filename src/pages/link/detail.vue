<template>
  <div class="link-detail">
  <div v-if="link === null" class="loading-container">
      <el-empty description="请在左侧选择链路" />
    </div>
    <template v-else>
    <MapView :points="points" :lineConnections="lineConnections" />
    <el-card :body-style="{ padding: '20px' }" class="detail-card">
      <div class="detail-info">
        <el-row :gutter="20">
          <el-col :span="8">
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

          <el-col :span="8">
            <div class="info-item">
              <span class="label">电路数量:</span>
              <span>{{ link?.circuitCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">总流量:</span>
              <span>{{ formatBytes(link?.totalTraffic) }}</span>
            </div>
            <div class="info-item">
              <span class="label">源节点:</span>
              <span>{{ link?.sourceRelayId }}</span>
            </div>
          </el-col>

          <el-col :span="8">
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
              <span>{{ formatPath(link?.relayIds) }}</span>
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
          <!-- <el-form-item label="链路ID">
            <el-input v-model="editForm.linkId" />
          </el-form-item> -->
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

          <template v-if="editForm.routingPolicy === 'SPECIFIED'">
            <div style="margin-top: 20px;">
              <el-button type="primary" @click="openDrawer">选择电路</el-button>
              <div style="margin-top: 10px;">
                <span>当前电路: </span>
                <span v-if="editForm.relayIds.length">{{ formatPath(editForm.relayIds) }}</span>
                <span v-else>{{ formatPath(link?.relayIds) }}</span>
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
      <div style="margin-top: 10px;">
        <span>当前电路: </span>
        <span v-if="editForm.relayIds.length">{{ formatPath(editForm.relayIds) }}</span>
        <span v-else>{{ formatPath(link?.relayIds) }}</span>
      </div>
      <br><br><br>
      <div style="height: calc(100% - 60px); padding: 10px;">
        <div class="node-list">
          <div class="search-box" style="margin-bottom: 20px;">
            <el-input v-model="searchKeyword" placeholder="搜索节点ID或昵称" prefix-icon="Search" clearable />
          </div>
          <div class="node-items">
            <div v-for="node in filteredNodes" :key="node.nodeId" class="node-item"
              :class="{ selected: editForm.relayIds.includes(node.nodeId) }" @click="toggleNodeSelection(node.nodeId)">
              <div class="node-info">
                <div class="node-id">{{ node.nodeId }}</div>
                <div class="node-details">
                  <span class="nickname">{{ node.nickname || '无昵称' }}</span>
                  <span class="status" :class="node.status.toLowerCase()">{{ node.status }}</span>
                  <span class="location">{{ node.geoLocation }}</span>
                </div>
              </div>
              <div class="selection-indicator">
                <el-icon v-if="editForm.relayIds.includes(node.nodeId)" color="#409EFF">
                  <Check />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;">
          <span style="margin-right: 10px; color: #666;">
            已选择 {{ editForm.relayIds.length }} 个节点
          </span>
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSelection">确定</el-button>
        </div>
      </template>
    </el-drawer>
</template>
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard, ElIcon } from 'element-plus';
import { Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { formatDate, formatBytes, formatPath } from "@/utils/formatters.ts";

import MapView from '@/components/MapView.vue';
import { fetchLinkDetail, type LinkItem } from '@/api/link';
import { fetchNodes, type NodeItem } from '@/api/node'


const route = useRoute();
const router = useRouter();
const nodes = ref<NodeItem[]>([]);

const props = defineProps<{
  linkId?: string;
}>();

const link = ref<LinkItem | null>(null);

watch(() => props.linkId, async (newLinkId) => {
  if (newLinkId === null) {
    return;
  }
  const linkData = await fetchLinkDetail(newLinkId);
  
  if (linkData === null) {
    ElMessage.error('链路信息不存在或获取失败');
    return;
  }
  link.value = linkData;
}, { immediate: true });

const points = computed(() => {
  // console.log("=== Points计算开始 ===");
  // console.log("link.value?.relayIds:", link.value?.relayIds);
  // console.log("nodes.value.length:", nodes.value.length);
  
  if (!link.value || !link.value.relayIds || !nodes.value.length) {
    // console.log("提前返回空数组");
    return [];
  }

  // 将 Proxy 数组转换为普通数组
  const relayIds = [...link.value.relayIds];
  // console.log("转换后的 relayIds:", relayIds);

  const result = nodes.value.filter(node => {
    const isIncluded = relayIds.includes(node.nodeId);
    // console.log(`节点 ${node.nodeId} 是否匹配: ${isIncluded}`);
    return isIncluded;
  });
  
  // console.log("最终结果:", result);
  // console.log("=== Points计算结束 ===");
  return result;
});



const lineConnections = computed(() => {
  if (!link.value || !link.value.relayIds || link.value.relayIds.length < 2) {
    return [];
  }

  const connections = [];
  for (let i = 0; i < link.value.relayIds.length - 1; i++) {
    connections.push([link.value.relayIds[i], link.value.relayIds[i + 1]]);
  }
  return connections;
});



const drawerVisible = ref(false);
const searchKeyword = ref('');

const filteredNodes = computed(() => {
  if (!nodes.value.length) return [];

  if (!searchKeyword.value) {
    return nodes.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return nodes.value.filter(node =>
    node.nodeId.toLowerCase().includes(keyword) ||
    (node.nickname && node.nickname.toLowerCase().includes(keyword)) ||
    (node.geoLocation && node.geoLocation.toLowerCase().includes(keyword))
  );
});

const toggleNodeSelection = (nodeId: string) => {
  const index = editForm.value.relayIds.indexOf(nodeId);
  if (index > -1) {
    // 如果已选中，则取消选中
    editForm.value.relayIds.splice(index, 1);
  } else {
    // 如果未选中，则添加到选中列表
    editForm.value.relayIds.push(nodeId);
  }
  console.log('当前选中的节点:', editForm.value.relayIds);
};

const confirmSelection = () => {
  console.log('确认选择的电路:', editForm.value.relayIds);
  ElMessage.success(`已选择 ${editForm.value.relayIds.length} 个节点`);
  drawerVisible.value = false;
};


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
  relayIds: []
});


// 打开弹窗
const openDialog = (action: string) => {
  currentAction.value = action;
  if (action === 'updateLink') {
    dialogTitle.value = '更新链路';
    // 填充 editForm
    editForm.value = {
      linkId: link.value.linkId,
      routingPolicy: link.value.routingPolicy,
      status: link.value.status,
      relayIds: []
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
      if (useMock) {
        link.value.linkId = editForm.value.linkId;
        link.value.routingPolicy = editForm.value.routingPolicy;
        link.value.status = editForm.value.status;
        if (editForm.value.relayIds.length) {
          link.value.relayIds = editForm.value.relayIds;
        }
        link.value.updatedAt = new Date();
        ElMessage.success('链路更新成功');
      }
      //await updateLink();// TODO: 调用API
      console.log('更新链路，新的数据：', editForm.value);
    } else if (currentAction.value === 'destroyLink') {
      console.log('销毁链路', link.value);
      // TODO: 调用API
      ElMessage.success('链路销毁成功');
      goBack();
    }

    dialogVisible.value = false; //成功后自动关闭弹窗
    //await fetchLinkDetail();     // 
  } catch (error) {
    console.error('操作失败', error);
    ElMessage.error('操作失败，请重试');
  }
};

const handleSelectPoint = (point) => {
  if (!editForm.value.relayIds.includes(point.id)) {
    editForm.value.relayIds.push(point.id);
  }
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

onMounted(async () => {
    if (props.linkId === null) {
    return;
  }
  const linkData = await fetchLinkDetail(props.linkId);
  if (linkData === null) {
    ElMessage.error('链路信息不存在或获取失败');
    goBack();
    return;
  }
  link.value = linkData;
  nodes.value = await fetchNodes({});
}
);
</script>

<style scoped>
.link-detail {

  padding: 20px;
}

.detail-card {
  max-width: 900px;
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

.node-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.node-items {
  flex: 1;
  overflow-y: auto;
}

.node-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-item:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.node-item.selected {
  background-color: #ecf5ff;
  border-color: #409EFF;
}

.node-info {
  flex: 1;
}

.node-id {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.node-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #606266;
}

.nickname {
  color: #409EFF;
}

.status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}

.status.online {
  background-color: #f0f9ff;
  color: #67c23a;
}

.status.offline {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.status.destroying {
  background-color: #fef0f0;
  color: #f56c6c;
}

.location {
  color: #909399;
}

.selection-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>