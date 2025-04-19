<template>
    <el-card>
      <MapView/>
    </el-card>
  </template>

<script setup lang="ts">
import { ref } from "vue";
import MapView from "@/components/MapView.vue";


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
