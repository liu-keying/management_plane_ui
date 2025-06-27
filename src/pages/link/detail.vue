<template>
  <div class="link-detail">
    <MapView :points="[]" :lineConnections="lineConnections" />
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
              <span>{{ link?.linkId }}</span>
            </div>
            <div class="info-item">
              <span class="label">总流量:</span>
              <span>{{ formatBytes(link?.totalTraffic) }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态:</span>
              <span>{{ link?.status }}</span>
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
      <div style="height: calc(100% - 60px); padding: 10px;">
        <MapView :points="points" :selectedNodeIds="editForm.relayIds || []" :@selectPoint="handleSelectPoint" />
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



<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ElButton, ElDialog, ElTag, ElRow, ElCol, ElCard } from 'element-plus';
import { ElMessage } from 'element-plus';
import { computed } from "vue";
import { formatDate, formatBytes } from "@/utils/formatters.ts";

import useGlobalConfig from '@/composables/useGlobalConfig';
import MapView from '@/components/MapView.vue';
import { fetchLinkDetail, type LinkItem } from '@/api/link';

const { useMock } = useGlobalConfig();

const route = useRoute();
const router = useRouter();
const link = ref<LinkItem>();

const linkId = route.params.linkId as string;

const points = [

];


const lineConnections = [

];


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
        ElMessage.success('链路更新成功');
      }
      //await updateLink();// TODO: 调用API
      console.log('更新链路，新的数据：', editForm.value);
    } else if (currentAction.value === 'destroyLink') {
      console.log('销毁链路', link.value);
      // TODO: 调用API
      ElMessage.success('链路销毁成功');
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

const formatPath = (nodes: string[]) => {
  if (!nodes || nodes.length === 0) return 'N/A';
  return nodes.map((id) => `${id}`).join(' → ');
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
  const linkData = await fetchLinkDetail(linkId);
  if (linkData === null) {
    ElMessage.error('链路信息不存在或获取失败');
    goBack();
    return;
  }
  link.value = linkData;
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
</style>