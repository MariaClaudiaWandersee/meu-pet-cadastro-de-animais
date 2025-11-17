<template>
  <a-modal
    :open="open"
    title="Add user"
    :confirm-loading="loading"
    @ok="submitForm"
    @cancel="() => emit('update:open', false)"
    destroy-on-close
  >
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item label="Name" name="name" required>
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item label="Role" name="role" required>
        <a-radio-group v-model:value="formState.role">
          <a-radio :value="'Admin'">Admin</a-radio>
          <a-radio :value="'Attendant'">Attendant</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="Email" name="email" required>
        <a-input v-model:value="formState.email" />
      </a-form-item>

      <a-form-item label="Password" name="password" required>
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formState.name,
        role: formState.role,
        email: formState.email,
        password: formState.password
      })
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.message || "Error creating user")
    }

    message.success('User created!')
    emit('update:open', false)
    emit('user-added')

  } catch (err) {
    console.error("Error creating user:", err)
    message.error(err.message)
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
