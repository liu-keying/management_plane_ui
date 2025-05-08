<template>
    <div class="login-container">
      <el-card class="login-card">
        <h2 class="title">登录系统</h2>
        <el-form :model="loginForm" :rules="rules" ref="loginRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading" class="login-btn">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/composables/useAuth'
  
  const router = useRouter()
  const { login } = useAuth()
  
  const loginForm = ref({ username: '', password: '' })
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
  const loginRef = ref()
  const loading = ref(false)
  
  const handleLogin = () => {
    loginRef.value.validate((valid: boolean) => {
      if (!valid) return
      loading.value = true
      setTimeout(() => {
        loading.value = false
        login(loginForm.value.username)        // 🎯 登录成功后设置用户
        ElMessage.success('登录成功')
        router.push('/')                       // 跳回首页
      }, 1000)
    })
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  }
  .login-card {
    width: 400px;
    padding: 30px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  .title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }
  /* 🔥 调整登录按钮样式 */
  .login-btn {
    width: 100%;
    font-size: 18px;
    height: 48px;
  }
  </style>
  