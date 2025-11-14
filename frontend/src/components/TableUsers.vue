<template>
  <a-table :dataSource="users" :columns="columns" rowKey="_id" />
</template>

<script setup>
import { computed, h } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  activeKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'user-added'])

const columns = computed(() => {
  const baseColumns = [
    {
      title: 'Name',
      key: 'name',
      customRender: ({ record }) => record.name,
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      customRender: ({ text }) =>
        h(
          'span',
          { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } },
          [
            text,
            h(CopyOutlined, {
              style: { color: '#1890ff', cursor: 'pointer' },
              onClick: () => {
                navigator.clipboard.writeText(text)
                message.success('Email copied!')
              }
            })
          ]
        ),
    },
    {
      title: 'Role',
      key: 'role',
      customRender: ({ record }) => record.role,
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Attendant', value: 'Attendant' },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ]

  if (props.isAdmin) {
    baseColumns.push({
      title: 'Actions',
      key: 'actions',
      customRender: ({ record }) =>
        h('div', { style: 'display: flex; gap: 10px;' }, [
          h(EditOutlined, {
            style: { color: 'blue', cursor: 'pointer' },
            onClick: () => emit('edit', record),
          }),
          h(DeleteOutlined, {
            style: { color: 'red', cursor: 'pointer' },
            onClick: () => emit('delete', record),
          }),
        ]),
    })
  }

  return baseColumns
})
</script>
