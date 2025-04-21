<template>
  <el-container>
    <el-header class="navbar">
      <div class="navbar-left">
        <img src="/src/assets/logo.png" class="logo" />
        <span class="title">GRN管理平台</span>
      </div>

      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        class="menu"
        background-color="#1976d2"
        text-color="#fff"
        active-text-color="#ffeb3b"
        router
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/node">节点信息</el-menu-item>
        <el-menu-item index="/link">链路信息</el-menu-item>
        <el-menu-item index="/alert">故障告警</el-menu-item>
        <el-menu-item index="/situation">态势感知</el-menu-item>
        <el-menu-item index="/users">用户管理</el-menu-item>
      </el-menu>

      <!-- <div class="navbar-right">
        <el-button type="primary" size="small">登录</el-button>
      </div> -->
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: #1976d2; /* 蓝色背景 */
  padding: 0 20px;
  color: white;
}
.navbar-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 60px;
  margin-right: 12px;
}
.title {
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-top: auto;
  margin-bottom: 15px; /* 靠近底部 */
}
.menu {
  flex: 29;
  margin-left: 40px;
  font-size: 30px;
}
.el-menu-item {
  padding: 0 24px; /* 扩大点击区域 */
  font-size: 20px;
}
.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

</style>