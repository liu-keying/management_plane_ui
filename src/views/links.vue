<template>
  <div style="padding: 20px;">
    <Table
      border
      :columns="columns"
      :data="tableData"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            const row = params.row
            return h('div', {
              style: {
                padding: '10px',
                background: '#f9f9f9',
                border: '1px solid #eee'
              }
            }, [
              h('p', [ h('strong', '昵称：'), row.nickname || '暂无数据' ]),
              h('p', [ h('strong', 'IP 地址：'), row.ipAddress || '暂无数据' ]),
              h('p', [ h('strong', '备注：'), row.remark || '暂无数据' ])
            ])
          }
        },
        { title: '名称', key: 'name' },
        { title: '状态', key: 'status' }
      ],
      tableData: [
        { name: '设备A', status: '在线', nickname: '张三', ipAddress: '192.168.1.100', remark: '主机' },
        { name: '设备B', status: '离线', nickname: '', ipAddress: '', remark: '' }
      ]
    }
  }
}
</script>
