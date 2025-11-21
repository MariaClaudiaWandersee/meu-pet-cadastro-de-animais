<template>
  <a-table
    :dataSource="users"
    :columns="columns"
    rowKey="_id"
    :scroll="{ x: 'max-content' }"
  />
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { message, Button, Checkbox } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, CopyOutlined, FilterOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { ROLES } from '../constants/roles'

const { t } = useI18n()

const props = defineProps({
  users: { type: Array, required: true },
  isAdmin: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete', 'user-added'])

const translateRole = (role) => {
  const roleMap = {
    [ROLES.ADMIN]: t("admin"),
    [ROLES.ATTENDANT]: t("attendant"),
  }
  return roleMap[role] || role
}

const columns = computed(() => {
  const baseColumns = [
    {
      title: t("name"),
      key: 'name',
      columnTitle: "" ,
      customRender: ({ record }) => record.name,
    },
    {
      title: t("email"),
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
                if (navigator.clipboard?.writeText) {
                  navigator.clipboard.writeText(text)
                } else {
                  const textarea = document.createElement("textarea")
                  textarea.value = text
                  document.body.appendChild(textarea)
                  textarea.select()
                  document.execCommand("copy")
                  document.body.removeChild(textarea)
                }
                message.success(t("emailCopied"))
              }
            })
          ]
        ),
    },
    {
      title: t("role"),
      key: 'role',
      customRender: ({ record }) => translateRole(record.role),
      filters: [
        { text: t("admin"), value: ROLES.ADMIN },
        { text: t("attendant"), value: ROLES.ATTENDANT },
      ],

      onFilter: (value, record) => record.role === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys = [], confirm, clearFilters }) => {
        const options = [
          { label: t("admin"), value: ROLES.ADMIN },
          { label: t("attendant"), value: ROLES.ATTENDANT },
        ]
        const checkedValues = ref([...selectedKeys])
        
        const handleChange = (values) => {
          checkedValues.value = values
          setSelectedKeys(values)
        }

        const items = h(Checkbox.Group, {
          options,
          value: checkedValues.value,
          onChange: handleChange,
          style: { display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px 0' }
        })

        const footer = h('div', { style: { display: 'flex', gap: '8px', marginTop: '8px', padding: '4px 8px' } }, [
          h(Button, { onClick: () => { clearFilters(); confirm(); } }, { default: () => t('reset') }),
          h(Button, { type: 'primary', onClick: () => confirm() }, { default: () => t('okText') }),
        ])

        return h('div', { style: { padding: '8px', minWidth: '160px' } }, [items, footer])
      },
      filterIcon: (filtered) => h(FilterOutlined, { style: { color: filtered ? '#1890ff' : undefined } }),
    },
  ]

  if (props.isAdmin) {
    baseColumns.push({
      title: t("actions"),
      key: 'actions',
      customRender: ({ record }) =>
        h('div', { style: 'display: flex; gap: 10px;' }, [
          h(EditOutlined, { style: { color: 'blue', cursor: 'pointer' }, onClick: () => emit('edit', record) }),
          h(DeleteOutlined, { style: { color: 'red', cursor: 'pointer' }, onClick: () => emit('delete', record) }),
        ]),
    })
  }

  return baseColumns
})
</script>
