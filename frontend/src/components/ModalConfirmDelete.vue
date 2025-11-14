<template>
  <a-modal
    title="Confirm deletion"
    :open="visible"
    :confirm-loading="loading"
    ok-text="Delete"
    ok-type="danger"
    @ok="onOk"
    @cancel="onCancel"
    centered
  >
    Are you sure you want to delete?
    <strong>{{ userName }}</strong>?
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue';

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  userName: String,
});

const emit = defineEmits(['confirm', 'cancel']);

function onOk() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
}
</script>
