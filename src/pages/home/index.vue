<template>
    <div>
        <MapView />
    </div>
    <div class="dashboard">
        <div class="stats">
            <div class="stat">
                <span class="label">节点总数:</span>
                <span class="value">{{ totalNodes }}</span>
            </div>
            <div class="stat">
                <span class="label">活跃节点:</span>
                <span class="value">{{ activeNodes }}</span>
            </div>
            <div class="stat">
                <span class="label">链路总数:</span>
                <span class="value">{{ totalLinks }}</span>
            </div>
            <div class="stat">
                <span class="label">活跃链路:</span>
                <span class="value">{{ activeLinks }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MapView from "@/components/MapView.vue";

// 这里可以替换成从 API 获取数据
const totalNodes = ref(100);
const activeNodes = ref(85);
const totalLinks = ref(200);
const activeLinks = ref(180);
</script>

<style scoped lang="scss">
.dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.stat {
    background: #2c3e50;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    text-align: center;
}

.label {
    font-size: 14px;
    font-weight: bold;
}

.value {
    font-size: 20px;
    margin-left: 5px;
}
</style>
