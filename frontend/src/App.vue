<template>
  <router-view />
  <FloatingLanguageSwitcher />
</template>

<script setup>
import FloatingLanguageSwitcher from './components/FloatingLanguageSwitcher.vue'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

onMounted(() => {
  const savedLang = localStorage.getItem('app-language')
  if (savedLang) locale.value = savedLang
})

</script>
