<template>
    <div>
      <el-table :data="userList" style="width: 100%" border stripe highlight-current-row>
        <el-table-column prop="userId" label="用户ID" min-width="100" />
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column label="认证状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getAuthTagType(row.authenticated)" effect="dark">
              {{ row.authenticated ? '已认证' : '未认证' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="活跃状态" min-width="120">
          <template #default="{ row }">
            <el-tag :type="getActiveTagType(row.active)" effect="dark">
              {{ row.active ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="" min-width="100" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="goToDetail(row.userId)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const userList = ref([])
  const router = useRouter()
  
  onMounted(() => {
    userList.value = [
      //{ userId: 1001, username: 'alice', authenticated: true, active: true },
      //{ userId: 1002, username: 'bob', authenticated: false, active: true },
      //{ userId: 1003, username: 'charlie', authenticated: true, active: false },
      //{ userId: 1004, username: 'diana', authenticated: false, active: false },
      //{ userId: 1005, username: 'eve', authenticated: true, active: true }
    ]
  })
  
  const goToDetail = (userId) => {
    router.push(`/user/${userId}`)
  }
  
  const getAuthTagType = (authenticated) => {
    return authenticated ? 'success' : 'info'
  }
  
  const getActiveTagType = (active) => {
    return active ? 'success' : 'danger'
  }
  </script>
  
  <style scoped>
  .el-table {
    font-size: 16px;
  }
  
  .el-tag {
    font-size: 13px;
    padding: 4px 8px;
  }
  </style>
  