<template>
  <a-modal
    :open="open"
    :title="title"
    @ok="handleConfirm"
    @cancel="$emit('cancel')"
    :ok-text="$t('confirmDeletion')"
    :cancel-text="$t('cancelText')"
  >
    <p>
      {{ $t("confirmDeletionKey") }}
      <strong>{{ confirmationKey }}</strong>
    </p>

    <a-input
      v-model:value="inputValue"
      :placeholder="$t('enterCodeAbove')"
      style="margin-top: 12px"
    />
  </a-modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: "",
  },
  itemName: String,
  confirmationKey: String,
});

const emit = defineEmits(["confirm", "cancel", "regenerate"]);

const inputValue = ref("");

watch(
  () => props.open,
  (val) => {
    if (val) inputValue.value = "";
  }
);

function handleConfirm() {
  if (inputValue.value === props.confirmationKey) {
    emit("confirm");
  } else {
    message.error(t("codeMismatch"));
    inputValue.value = "";
    emit("regenerate");
  }
}
</script>

<style scoped>
p {
  margin-bottom: 8px;
}
</style>
