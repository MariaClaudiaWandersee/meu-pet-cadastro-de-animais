<template>
  <a-dropdown trigger="click" placement="topRight">
    <button class="round-float-button">
      <component :is="GlobalOutlined" />
    </button>

    <template #overlay>
      <a-menu>
        <a-menu-item
          :class="{ selected: locale.value === 'pt' }"
          @click="changeLanguage('pt')"
        >
          🇧🇷 Português
        </a-menu-item>
        <a-menu-item
          :class="{ selected: locale.value === 'en' }"
          @click="changeLanguage('en')"
        >
          🇺🇸 English
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Dropdown, Menu } from 'ant-design-vue'
import { GlobalOutlined } from '@ant-design/icons-vue'

const { locale } = useI18n()

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('app-language', lang)
}
</script>

<style scoped>
.round-float-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #001529;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: background-color 0.3s, color 0.3s;
}

.round-float-button:hover {
  background-color: #03315a !important;
}

.selected {
  background-color: #002140;
  color: white;
}
</style>
