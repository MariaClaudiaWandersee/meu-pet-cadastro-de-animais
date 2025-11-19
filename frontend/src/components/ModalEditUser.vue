<template>
  <a-modal
    :open="open"
    :title="t('editUser')"
    :confirm-loading="loading"
    @ok="submitForm"
    @cancel="() => emit('update:open', false)"
    destroy-on-close
  >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item :label="t('name')" name="name" required>
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item :label="t('role')" name="role" required>
        <a-radio-group v-model:value="formState.role">
          <a-radio value="Admin">{{ t('admin') }}</a-radio>
          <a-radio value="Attendant">{{ t('attendant') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label="t('email')" name="email" required>
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        :label="t('password')"
        name="password"
        required
      >
        <a-input
          :type="showPassword ? 'text' : 'password'"
          v-model:value="formState.password"
          @input="handlePasswordInput"
        >
          <template #suffix>
            <span class="toggle-password" @click="showPassword = !showPassword">
              <EyeOutlined v-if="showPassword" />
              <EyeInvisibleOutlined v-else />
            </span>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ open: boolean; loading: boolean; user: any }>()
const emit = defineEmits(['update:open', 'saved'])

const formRef = ref()
const formState = reactive({
  name: '',
  role: '',
  email: '',
  password: ''
})

const showPassword = ref(false)
const passwordEdited = ref(false)

watch(
  () => props.user,
  (u) => {
    if (u) {
      formState.name = u.name
      formState.role = u.role
      formState.email = u.email
      formState.password = ''
      passwordEdited.value = false
      showPassword.value = false
    }
  },
  { immediate: true }
)

const handlePasswordInput = (e: Event) => {
  passwordEdited.value = true
  const target = e.target as HTMLInputElement | null
  if (target) {
    formState.password = target.value
  }
}

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const payload: any = {
      name: formState.name,
      role: formState.role,
      email: formState.email
    }

    if (formState.password && formState.password.trim() !== '') {
      payload.password = formState.password
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${props.user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(t('errorUpdateUser'))

    message.success(t('sucessUpdateUser'))
    emit('update:open', false)

    emit('saved', { ...props.user, ...payload })

  } catch (err) {
    message.error(t('errorUpdateUser'))
  }
}
</script>

<style scoped>
.toggle-password {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
