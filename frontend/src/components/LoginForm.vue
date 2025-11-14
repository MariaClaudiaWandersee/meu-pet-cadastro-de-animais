<template>
  <div class="login-container">
    <div v-if="isLoggingIn" class="loading-overlay">
      <a-spin size="large" />
    </div>

    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
          />
        </div>

        <div class="input-group password-group">
          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
            />
            <span class="toggle-password" @click="showPassword = !showPassword">
              <EyeOutlined v-if="showPassword" />
              <EyeInvisibleOutlined v-else />
            </span>
          </div>
        </div>

        <button type="submit" :disabled="isLoggingIn">
          Login
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { Spin } from 'ant-design-vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const isLoggingIn = ref(false)

const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  errorMessage.value = ''
  isLoggingIn.value = true

  try {
    const response = await axios.post('http://localhost:8080/users/login', {
      email: email.value,
      password: password.value
    })
    const user = response.data.user

    auth.setUser(user)

    localStorage.setItem('loggedUser', JSON.stringify(user))
    localStorage.setItem('loggedIn', 'true')

    router.push('/users')
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    isLoggingIn.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.login-container {
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  position: relative;
  background-color: #f5f5f5;
}

.login-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('../images/fundo-login.png');
  background-repeat: repeat;
  background-size: calc(100% / 3 - 40px) auto;
  background-position: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
  z-index: 1;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.75rem;
}

.input-group {
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #555;
}

input {
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #42b983;
  outline: none;
}

button {
  padding: 0.8rem;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  color: #e74c3c;
  text-align: center;
  font-weight: 500;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  width: 100%;
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
}

.toggle-password:hover {
  color: #42b983;
}
</style>
