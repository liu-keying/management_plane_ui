<template>
  <div class="link-page">
    <MapView :points="nodes" :lineConnections="lineConnections" />
    
    <div class="content-section">
      <div class="section-header">
        <el-button type="primary" id="create-button" @click="openDialog('createCircuit')">创建链路</el-button>
      </div>
      
      <linklist :list="links" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import useGlobalConfig from '@/composables/useGlobalConfig';
import { useRouter } from 'vue-router';
import MapView from '@/components/MapView.vue';
import linklist from '@/components/linklist.vue';
import { fetchLinks, type LinkItem} from '@/api/link';
import { fetchNodes, type NodeItem } from '@/api/node';

const { useMock } = useGlobalConfig();
const router = useRouter();

const nodes = ref < NodeItem[] > ([])
const links = ref < LinkItem[] > ([]);


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
</style>
