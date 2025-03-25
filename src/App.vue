<template>
  <div id="app" class="app">
    <nav class="nav-style">
      <div class="nav-center">
        <img src="@/assets/logo.png" alt="Logo" class="logo-style" />
      </div>
      <!-- <div class="nav-links">
        <router-link to="/" class="nav-tap-style">主页</router-link> |
        <router-link to="/topo" class="nav-tap-style">拓扑</router-link> |
        <router-link to="/settings" class="nav-tap-style">设置</router-link>
      </div> -->
    </nav>

    <div class="main-content">
      <!-- 侧边栏 使用 el-menu -->
      <el-menu class="el-menu-vertical" default-active="1" router background-color="#ffffff" text-color="#000000"
        active-text-color="#000000">
        <!-- <template v-if="isHomePage"> -->
          <el-menu-item index="/" :class="{ 'active-item': activeIndex === '1' }">全局概览</el-menu-item>
          <el-menu-item index="/node" :class="{ 'active-item': activeIndex === '2' }">节点管理</el-menu-item>
          <el-menu-item index="/link" :class="{ 'active-item': activeIndex === '3' }">链路管理</el-menu-item>
          <el-menu-item index="/alert" :class="{ 'active-item': activeIndex === '4' }">故障告警</el-menu-item>
          <el-menu-item index="/situation" :class="{ 'active-item': activeIndex === '5' }">态势感知</el-menu-item>
          <el-menu-item index="/user" :class="{ 'active-item': activeIndex === '6' }">用户管理</el-menu-item>
        <!-- </template> -->
        <!-- <template v-else-if="isTopoPage">
          <el-menu-item index="1" :class="{ 'active-item': activeIndex === '1' }">实验1</el-menu-item>
          <el-menu-item index="2" :class="{ 'active-item': activeIndex === '2' }">实验2</el-menu-item>
          <el-menu-item index="3" :class="{ 'active-item': activeIndex === '3' }">实验3</el-menu-item>
        </template> -->
      </el-menu>

      <!-- 主要内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 计算当前路由是否为主页或拓扑页
//const isHomePage = computed(() => route.path === '/')
//const isTopoPage = computed(() => route.path === '/topo')

// 获取激活的菜单项索引，确保返回类型 "1" | "2" | "3"
const activeIndex = computed(() => {
  if (route.path === '/') {
    return '1';
  } else if (route.path === '/node') {
    return '2';
  } else if (route.path === '/link'){
    return '3';
  }
  else if (route.path === '/alert'){
    return '4';
  }
  else if (route.path === '/situation'){
    return '5';
  }
  else if (route.path === '/user'){
    return '6';
  }
});
</script>
<style scoped lang="scss">
.app {
  margin-top: 20px;
}

.nav-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #204f9f;
  color: white;

  .logo-style {
    width: 100%;
    height: 100%;
    margin-bottom: 10px;
  }

  .nav-links {
    text-align: center;
  }

  .nav-tap-style {
    margin: 0 10px;
    color: white;
    text-decoration: none;
  }

  .nav-tap-style:hover {
    text-decoration: underline;
  }
}

.main-content {
  display: flex;
}

.el-menu-vertical {
  width: 200px;
  background-color: #ffffff;
  height: 100vh;
  text-anchor: #000000;
  /* 侧边栏文本颜色设置为黑色 */
}

.active-item {
  font-weight: bold;
  /* 激活项加粗 */
}

.content {
  flex-grow: 1;
  padding: 20px;
}
</style>
