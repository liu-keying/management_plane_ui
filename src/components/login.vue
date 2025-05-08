<template>
    <el-dialog v-model="visible" title="登录系统" width="400px" :close-on-click-modal="false" class="login-dialog">
        <el-form :model="loginForm" :rules="rules" ref="loginRef" label-width="80px" class="login-form">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

const visible = ref(false)
const loginForm = ref({ username: '', password: '' })
const loginRef = ref()
const loading = ref(false)

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const open = () => {
    visible.value = true
}

const handleLogin = () => {
    loginRef.value.validate((valid: boolean) => {
        if (!valid) return
        loading.value = true
        setTimeout(() => {
            loading.value = false
            login(loginForm.value.username)
            ElMessage.success('登录成功')
            visible.value = false
        }, 1000)
    })
}

defineExpose({ open })
</script>

<style scoped>
.login-dialog {
    font-size: 18px;
}

:deep(.login-form .el-form-item__label) {
    font-size: 16px;
}

:deep(.login-form .el-input__inner) {
    font-size: 16px;
}

:deep(.el-dialog__footer) {
    font-size: 16px;
}
</style>