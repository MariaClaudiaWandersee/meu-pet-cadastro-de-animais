<template>
  <a-modal
    :title="t('confirmDelete')"
    :open="visible"
    :confirm-loading="loading"
    :ok-text="t('deleteText')"
    ok-type="danger"
    @ok="onOk"
    @cancel="onCancel"
    centered
  >
    {{ t('deleteUser') }}
    <strong>{{ userName }}</strong>?
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  userName: String,
})

const emit = defineEmits(['confirm', 'cancel'])

function onOk() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>
