<template>
  <div>
    <el-table :data="internalList" style="width: 100%" border stripe highlight-current-row>
      <el-table-column prop="id" label="ID" min-width="100" />
      <el-table-column prop="name" label="节点" min-width="150" />
      <el-table-column prop="ipaddress" label="IP地址" min-width="150" />
      <el-table-column label="风险等级" min-width="120">
        <template #default="{ row }">
          <el-tag :type="getLevelTagType(row.level)" effect="dark">
            {{ row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="" min-width="100" align="center">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="goToDetail(row.id)">
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

const internalList = ref([])
const router = useRouter()

onMounted(() => {
  internalList.value = [
    { id: 1, name: 'node-009', ipaddress: '172.18.0.9', level: '高风险' },
    { id: 2, name: 'node-014', ipaddress: '192.168.100.14', level: '中风险' },
    { id: 3, name: 'node-008', ipaddress: '192.168.10.8', level: '低风险' },
    { id: 4, name: 'node-004', ipaddress: '8.8.8.8', level: '中风险' },
    { id: 5, name: 'node-011', ipaddress: '192.168.0.4', level: '高风险' },
    { id: 6, name: 'node-012', ipaddress: '203.0.113.12', level: '低风险' }
  ]
})

const goToDetail = (id) => {
  router.push(`/node/${id}`)
}

const getLevelTagType = (level) => {
  switch (level) {
    case '低风险':
      return 'success'
    case '中风险':
      return 'warning'
    case '高风险':
      return 'danger'
    default:
      return 'info'
  }
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
