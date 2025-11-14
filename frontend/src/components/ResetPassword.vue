<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const token = route.query.token as string;

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "As senhas não coincidem!";
    return;
  }

  try {
    await axios.post("http://localhost:3000/auth/reset-password/${token}", {
      newPassword: password.value,
    });

    successMessage.value = "Senha redefinida com sucesso!";
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Erro ao redefinir senha.";
  }
};
</script>

<template>
  <div class="reset-container">
    <h2>Redefinir Senha</h2>

    <input
      type="email"
      placeholder="Informe seu email"
      v-model="email"
      class="input"
    />

    <input
      type="password"
      placeholder="Nova Senha"
      v-model="password"
      class="input"
    />

    <input
      type="password"
      placeholder="Confirmar Senha"
      v-model="confirmPassword"
      class="input"
    />

    <button @click="handleResetPassword" class="btn">Salvar</button>

    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </div>
</template>

<style scoped>
.reset-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
.input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
.btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
