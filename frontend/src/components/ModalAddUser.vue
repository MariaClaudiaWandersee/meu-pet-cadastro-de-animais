<template>
  <a-modal
    :open="open"
    :title="t('addUser')"
    :confirm-loading="loading"
    :cancel-text="$t('cancelText')"
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
          <a-radio :value="'Admin'">{{ t('admin') }}</a-radio>
          <a-radio :value="'Attendant'">{{ t('attendant') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label="t('email')" name="email" required>
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item :label="t('password')" name="password" required>
        <a-input
          :type="showPassword ? 'text' : 'password'"
          v-model:value="formState.password"
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

const { t, locale } = useI18n()

const props = defineProps<{ open: boolean; loading: boolean }>()
const emit = defineEmits(['update:open', 'user-added'])

const formRef = ref()
const formState = reactive({
  name: '',
  role: 'Attendant',
  email: '',
  password: ''
})

const showPassword = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      Object.assign(formState, {
        name: '',
        role: 'Attendant',
        email: '',
        password: ''
      })
      formRef.value?.clearValidate()
    }
  }
)

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        "Accept-Language": locale.value },
      body: JSON.stringify({
        name: formState.name,
        role: formState.role,
        email: formState.email,
        password: formState.password
      })
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.message || t('errorAddUser'))
    }

    message.success( t('sucessAddUser') )
    emit('update:open', false)
    emit('user-added')

  } catch (err: any) {
    message.error(err.message || t('errorAddUser'))
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
