<template>
  <MapView :points="nodes"/>
  <!-- <div>
    <button class="create-button" @click="goToCreate">创建节点</button>
  </div> -->
  <nodelist :list="nodes" />

</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue';
import useGlobalConfig from '@/composables/useGlobalConfig';
import { useRouter } from 'vue-router';
import MapView from "@/components/MapView.vue";
import nodelist from "@/components/nodelist.vue";
import { fetchNodes, type NodeItem } from '@/api/node'

const points = ref([]);

const transformedPoints = computed(() => {
  return points.map(point => ({
    ...point,
    value: [point.longitude, point.latitude],
    id: point.nodeId,
  }));
});

const { useMock } = useGlobalConfig();
const router = useRouter();

const nodes = ref<NodeItem[]>([])
const filters = ref({ status: '', role: '', cloudProvider: '' });
onMounted(async () => {
  nodes.value = await fetchNodes({})
})

</script>
