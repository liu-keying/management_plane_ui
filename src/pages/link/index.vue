<!-- <template>
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
</template> -->

<template>
  <div class="node-container">
    <div class="sidebar">
      <!-- 筛选器 -->
      <div class="filter-bar">
        <el-input v-model="searchKeyword" placeholder="搜索 节点/状态/策略" clearable class="filter-item search-input">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-select v-model="selectedPolicy" placeholder="选择策略" clearable class="filter-item">
        <el-option v-for="policy in policyOptions" :key="policy" :label="policy" :value="policy" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态" clearable class="filter-item">
        <el-option v-for="status in statusOptions" :key="status" :label="status" :value="status" />
      </el-select>
      </div>
      <div class="node-items">
        <div v-for="link in filteredList" :key="link.linkId" class="node-item"
          :class="{ selected: currentRowKey === link.linkId }" @click="handleCurrentChange(link)">
          <div class="node-info">
            <div class="node-id">{{ link.linkId }}</div>
            <div class="node-details">
              <!-- <span class="ipaddress">{{ node.ipAddress || 'IP地址未知' }}</span> -->
              <span class="status" :class="link.status.toLowerCase()">{{ link.status }}</span>
              <span class="role" :class="link.routingPolicy.toLowerCase()">{{ link.routingPolicy }}</span>
              <!-- <span class="location">{{ node.geoLocation }}</span> -->
            </div>
          </div>

        </div>
      </div>

    </div>
    <div class="node-detail">
      <detail :linkId="currentRowKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard, ElIcon, ElMessage, ElSelect, ElOption, ElInput, ElDrawer } from 'element-plus';

import { useRouter } from 'vue-router';
import MapView from '@/components/MapView.vue';
import linklist from '@/components/linklist.vue';
import { fetchLinks, type LinkItem } from '@/api/link';
import { fetchNodes, type NodeItem } from '@/api/node';
import { formatPath } from "@/utils/formatters.ts";
import Detail from './detail.vue';
import { Search } from '@element-plus/icons-vue';


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

const currentRowKey = ref<string | null>(null);

// 筛选项
const selectedStatus = ref('');
const selectedPolicy = ref('');
const searchKeyword1 = ref('');

const statusOptions = ['ACTIVE', 'INACTIVE', 'PENDING'];
const policyOptions = ['RANDOM', 'RECOMMEND', 'SPECIFIED'];

// 筛选逻辑
const filteredList = computed(() => {
  return links.value.filter(item => {
    const keyword = searchKeyword1.value.trim().toLowerCase();
    const matchKeyword = keyword
      ? item.linkId.toLowerCase().includes(keyword) ||
        item.sourceRelayId.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        item.routingPolicy.toLowerCase().includes(keyword)
      : true;

    const matchStatus = selectedStatus.value ? item.status === selectedStatus.value : true;
    const matchPolicy = selectedPolicy.value ? item.routingPolicy === selectedPolicy.value : true;

    return matchKeyword && matchStatus && matchPolicy;
  });
});

const selectedNode = ref<LinkItem | null>(null);

const handleCurrentChange = (val: LinkItem | null) => {
  if (val) {
    currentRowKey.value = val.linkId;
    selectedNode.value = val;
  } else {
    currentRowKey.value = null;
    selectedNode.value = null;
  }
};

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

.node-container {
  display: flex;
}


.node-detail {
  flex: 1;
  padding: 20px;
}

</style>
