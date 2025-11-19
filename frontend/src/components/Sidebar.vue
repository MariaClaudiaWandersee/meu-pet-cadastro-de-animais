<template>
  <a-layout-sider collapsible v-model:collapsed="collapsed">
    <div class="logo">
      <img v-if="!collapsed" :src="logo" alt="Logo" class="logo-header" />
      <img v-else :src="logoIcon" alt="Logo Icon" class="logo-icon" />
    </div>

    <a-menu
      mode="inline"
      :selectedKeys="[selectedKey]"
      @click="menuClick"
      style="border: none; background: transparent;"
    >
      <a-menu-item key="animals">
        <div class="menu-item">
          <HeartOutlined />
          <span v-if="!collapsed">{{ t("registeredAnimals") }}</span>
        </div>
      </a-menu-item>

      <a-menu-item key="users">
        <div class="menu-item">
          <UserAddOutlined />
          <span v-if="!collapsed">{{ t("registeredUsers") }}</span>
        </div>
      </a-menu-item>

      <a-menu-item key="logout" class="logout-item" @click="logout">
        <div class="menu-item logout">
          <LogoutOutlined />
          <span v-if="!collapsed">{{ t("logout") }}</span>
        </div>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { HeartOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  collapsed: Boolean,
  selectedKey: String,
  logo: String,
  logoIcon: String
})

const emit = defineEmits(['menuClick', 'logout'])

const menuClick = e => emit('menuClick', e.key)
</script>

<style scoped>
.logo {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-header {
  width: 180px;
  height: auto;
}
.logo-icon {
  width: 40px;
  height: 40px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f5f5f5;
}
.menu-item.logout {
  color: #ff4d4f;
}
</style>
