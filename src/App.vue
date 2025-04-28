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

// 计算当前活跃的菜单项
const activeMenu = computed(() => {
  // 判断当前路径，并返回对应的菜单栏
  if (route.path.startsWith('/node')) {
    return '/node';
  } else if (route.path.startsWith('/link')) {
    return '/link';
  } else if (route.path.startsWith('/alert')) {
    return '/alert';
  } else if (route.path.startsWith('/situation')) {
    return '/situation';
  } else if (route.path.startsWith('/users')) {
    return '/users';
  } else {
    return '/'; // 默认为首页
  }
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background-color: #1976d2;
  padding: 0 20px;
  color: white;
  position: fixed; /* 固定在页面顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 保证在最上层 */
}

.el-main {
  padding-top: 90px; /* 留出空间，大于 header 高度一点 */
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