<template>
  <el-container>
    <el-header class="navbar">
      <div class="navbar-left">
        <img src="/src/assets/logo.png" class="logo" />
        <span class="title">GRN管理平台</span>
      </div>

      <el-menu mode="horizontal" :default-active="activeMenu" class="menu" background-color="#1976d2" text-color="#fff"
        active-text-color="#ffeb3b" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/node">节点管理</el-menu-item>
        <el-menu-item index="/link">链路管理</el-menu-item>
        <el-menu-item index="/alert">故障告警</el-menu-item>
        <el-menu-item index="/situation">态势感知</el-menu-item>
        <el-menu-item index="/users">用户管理</el-menu-item>
      </el-menu>

      <!-- 登录/用户名显示区域 -->
      <div class="navbar-right">
        <el-button v-if="!user" type="primary" size="medium" @click="goToLogin" class="login-btn-nav">
          登录
        </el-button>

        <el-dropdown v-else>
          <span class="el-dropdown-link">
            {{ user.username }}
            <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button @click="showSettingsDialog = true" type="primary" size="medium" class="login-btn-nav">
          <el-icon>
            <Setting />
          </el-icon>
          设置
        </el-button>
      </div>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
    <LoginDialog ref="loginDialogRef" />
  </el-container>
  <el-dialog v-model="showSettingsDialog" width="400px" title="设置">
    <el-form>
      <el-form-item label="刷新时间间隔(秒)">
        <el-input v-model="newRefreshInterval" type="number"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showSettingsDialog = false">取消</el-button>
      <el-button type="primary" @click="saveSettings">保存</el-button>
    </template>
  </el-dialog>
</template>


<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import LoginDialog from './components/login.vue';
import { useAuth } from '@/composables/useAuth'
import { useRefreshConfig } from '@/composables/useGlobalConfig';
import { Setting } from '@element-plus/icons-vue';

const { refreshInterval } = useRefreshConfig();
const showSettingsDialog = ref(false);
const newRefreshInterval = ref(refreshInterval.value);

const saveSettings = () => {
  refreshInterval.value = newRefreshInterval.value;
  showSettingsDialog.value = false;
};


const { user, logout } = useAuth();
const loginDialogRef = ref();
// 登录按钮跳转
const goToLogin = () => {
  loginDialogRef.value?.open();
};


const route = useRoute();
const router = useRouter();

// 当前激活菜单
const activeMenu = computed(() => {
  if (route.path.startsWith('/node')) return '/node';
  if (route.path.startsWith('/link')) return '/link';
  if (route.path.startsWith('/alert')) return '/alert';
  if (route.path.startsWith('/situation')) return '/situation';
  if (route.path.startsWith('/users')) return '/users';
  return '/';
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
  position: fixed;
  /* 固定在页面顶部 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* 保证在最上层 */
}

.el-main {
  padding-top: 90px;
  /* 留出空间，大于 header 高度一点 */
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
  margin-bottom: 15px;
  /* 靠近底部 */
}

.menu {
  flex: 29;
  margin-left: 40px;
  font-size: 30px;
}

.el-menu-item {
  padding: 0 24px;
  /* 扩大点击区域 */
  font-size: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
  color: white;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-size: 16px;
  user-select: none;
}

.login-btn-nav {
  font-size: 18px;
  height: 36px;
  padding: 0 20px;
  color: #1976d2;
  border-radius: 4px;
  border: none;
  background-color: white;
  transition: background-color 0.3s ease;
}
</style>