<template>
  <div class="link-page">
    <MapView :points="nodes" :lineConnections="lineConnections" />

    <div class="content-section">
      <div class="section-header">
        <el-button type="primary" id="create-button" @click="openDialog('createCircuit')">创建链路</el-button>
      </div>

      <linklist :list="links" />
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="editForm" label-width="100px">
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
              <span>{{ formatPath(editForm.relayIds) }}</span>
            </div>
          </div>
        </template>

      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAction">确认</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawerVisible" title="选择电路节点" size="50%" direction="rtl" :destroy-on-close="true">
      <div >
        <span>当前电路: </span>
        <span >{{ formatPath(editForm.relayIds) }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard, ElIcon, ElMessage, ElSelect, ElOption, ElInput, ElDrawer } from 'element-plus';
import useGlobalConfig from '@/composables/useGlobalConfig';
import { useRouter } from 'vue-router';
import MapView from '@/components/MapView.vue';
import linklist from '@/components/linklist.vue';
import { fetchLinks, type LinkItem } from '@/api/link';
import { fetchNodes, type NodeItem } from '@/api/node';
import { formatPath } from "@/utils/formatters.ts";

const { useMock } = useGlobalConfig();
const router = useRouter();

const nodes = ref<NodeItem[]>([])
const links = ref<LinkItem[]>([]);
const lineConnections = computed(() =>
  links.value
    .map(link => {
      const source = link.sourceRelayId;
      const target = link.relayIds[link.relayIds.length - 1];
      return source && target ? [source, target] : null;
    })
    .filter((pair): pair is [string, string] => pair !== null)
);


const dialogVisible = ref(false);
const dialogTitle = ref('');

const editForm = ref({
  routingPolicy: '',
  status: '',
  relayIds: []
});

const openDialog = (action: string) => {
  dialogTitle.value = '创建链路';
  dialogVisible.value = true;
};
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

const confirmAction = async () => {
  try {
    if (useMock) {
      const link = {
        linkId: "link-005",
        relayIds: editForm.value.relayIds,
        routingPolicy: editForm.value.routingPolicy,
        status: editForm.value.status,
        createdBy: "admin",
        createdAt: "2025-06-25T08:30:00Z",
        updatedAt: "2025-06-26T23:55:00Z",
        circuitCount: 2,
        totalTraffic: 420,
        sourceRelayId: editForm.value.relayIds[0]
      }
      links.value.push(link);
      // if (editForm.value.relayIds.length) {
      //   link.value.relayIds = editForm.value.relayIds;
      // }
      ElMessage.success('链路创建成功')

      dialogVisible.value = false; //成功后自动关闭弹窗
    }
  } catch (error) {
    console.error('操作失败', error);
    ElMessage.error('操作失败，请重试');
  }
};

// const goToLinkDetail = (linkId) => {
//   router.push({ name: 'LinkDetail', params: { linkId } });
// };

// const goToCreate = () => {
//   router.push(`/link/create`);
// };

onMounted(async () => {
  nodes.value = await fetchNodes({});
  links.value = await fetchLinks({});
})
</script>

<style scoped>
.link-page {
  padding: 20px;
}

.content-section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.create-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
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
