<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      collapsible
      v-model:collapsed="collapsed"
    >
      <div
        class="logo"
        :style="{ padding: isMobile ? '12px' : '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }"
      >
        <img v-if="!collapsed" :src="logo" alt="Logo" class="logo-header" />
        <img v-else :src="logoIcon" alt="Logo Icon" class="logo-icon" />
      </div>

      <div style="border-top: 1px solid #f0f0f0;">
        <a-menu
          mode="inline"
          :selectedKeys="[selectedKey]"
          @click="handleMenuClick"
          style="border: none; background: transparent;"
        >
          <a-menu-item key="animals" :title="collapsed ? $t('registeredAnimals') : ''">
            <div style="display: flex; align-items: center; width: 100%;">
              <HeartOutlined style="color: #f5f5f5;" />
              <span v-if="!collapsed" style="color: #f5f5f5; margin-left: 8px;">{{ $t('registeredAnimals') }}</span>
            </div>
          </a-menu-item>

          <a-menu-item key="users" :title="collapsed ? $t('registeredUsers') : ''">
            <div style="display: flex; align-items: center; width: 100%;">
              <UserAddOutlined style="color: #f5f5f5;" />
              <span v-if="!collapsed" style="color: #f5f5f5; margin-left: 8px;">{{ $t('registeredUsers') }}</span>
            </div>
          </a-menu-item>

          <a-menu-item key="logout" class="logout-item" @click="logout" :title="collapsed ? $t('logout') : ''">
            <div style="display: flex; align-items: center; width: 100%; color: #ff4d4f;">
              <LogoutOutlined />
              <span v-if="!collapsed" style="margin-left: 8px;">{{ $t('logout') }}</span>
            </div>
          </a-menu-item>
        </a-menu>
      </div>
    </a-layout-sider>

    <a-layout-content
      :style="{
        padding: '24px',
        transition: 'margin-left 0.3s',
        marginLeft: isMobile.value ? (collapsed.value ? '57px' : '0') : '0'
      }"
    >
      <a-card
        bordered
        :style="{
          marginLeft: isMobile && collapsed ? '55px' : '0'
        }"
        :class="[{ 'mobile-collapsed-card': isMobile && collapsed }]"
      >

        <PageHeaderActions
          :selectedKey="selectedKey"
          :animalFilter="animalFilter"
          :filterDogs="filterDogs"
          :filterCats="filterCats"
          @update:animalFilter="val => animalFilter = val"
          @update:filterDogs="val => filterDogs = val"
          @update:filterCats="val => filterCats = val"
          @add-click="showAddModal"
        />

        <AnimalCards
          v-if="selectedKey === 'animals'"
          :key="'animals'"
          :animals="filteredAnimals"
          :showEditModal="showEditModal"
          :loggedUser="loggedUser || {}"
        />

        <TableUsers
          v-if="selectedKey === 'users'"
          :key="'users'"
          :users="users"
          :isAdmin="isAdmin"
          @edit="showEditModal"
          @delete="showDeleteModal"
          @user-added="users.push($event)"
        />

        <ModalAddUser
          v-if="selectedKey === 'users'"
          :open="isAddModalVisible"
          :loading="loading"
          :user="selectedUser"
          @update:open="val => isAddModalVisible = val"
          @user-added="handleUserAdded"
        />

        <ModalEditUser
          v-if="selectedKey === 'users' && loggedUser && isEditModalVisible"
          :open="isEditModalVisible"
          :loading="loading"
          :user="selectedUser"
          :logged-user="loggedUser"
          @update:open="val => isEditModalVisible = val"
          @saved="handleUserChanged"
        />

        <ModalAddAnimal
          v-if="selectedKey === 'animals'"
          :key="selectedAnimal?._id"
          :open="isAddAnimalModalVisible"
          :loading="loading"
          :animal="selectedAnimal"
          @update:open="val => isAddAnimalModalVisible = val"
          @animal-added="handleAnimalAdded"
        />

        <ModalEditAnimal
          v-if="selectedKey === 'animals' && isEditAnimalModalVisible"
          :open="isEditAnimalModalVisible"
          :loading="loading"
          :animal="selectedAnimal"
          @update:open="val => isEditAnimalModalVisible = val"
          @animal-edited="handleAnimalChanged"
        />

        <ConfirmDeleteModal
          :open="isDeleteModalVisible"
          :title="`Delete ${selectedKey === 'animals' ? animalToDelete?.name : userToDelete?.name}`"
          :confirmationKey="key"
          @confirm="handleConfirmDelete"
          @cancel="isDeleteModalVisible = false"
          @regenerate="key = generateRandomKey()"
        />
      </a-card>

      <a-spin
        v-if="isLoggingOut"
        :spinning="isLoggingOut"
        size="large"
        style="
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;"
      ></a-spin>

    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { LogoutOutlined, UserAddOutlined, HeartOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import PageHeaderActions from '../components/PageHeaderActions.vue'
import ModalAddUser from '../components/ModalAddUser.vue'
import ModalEditUser from '../components/ModalEditUser.vue'
import ModalAddAnimal from '../components/ModalAddAnimal.vue'
import ModalEditAnimal from '../components/ModalEditAnimal.vue'
import AnimalCards from '../components/AnimalCards.vue'
import TableUsers from '../components/TableUsers.vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'

import logoPrincipal from '../images/logo-principal-fundo-azul.jpeg'
import logoPrincipalIcon from '../images/logo-principal-icon-azul.png'

const { t } = useI18n()

const router = useRouter()
const collapsed = ref(false)
const selectedKey = ref('animals')
const users = ref([])
const animals = ref([])
const loading = ref(false)

const isAddModalVisible = ref(false)
const isAddAnimalModalVisible = ref(false)
const isEditModalVisible = ref(false)
const isEditAnimalModalVisible = ref(false)
const isDeleteModalVisible = ref(false)

const selectedUser = ref(null)
const selectedAnimal = ref(null)
const userToDelete = ref(null)
const animalToDelete = ref(null)

const confirmInput = ref('')
const key = ref('')

const loggedUser = ref(null)

const animalFilter = ref('')
const filterDogs = ref(true)
const filterCats = ref(true)

const isLoggingOut = ref(false)

const logo = logoPrincipal
const logoIcon = logoPrincipalIcon

const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth <= 768
  window.addEventListener('resize', () => isMobile.value = window.innerWidth <= 768)
})

const emit = defineEmits(['logout'])

const logout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 900))
    localStorage.removeItem('loggedUser')
    emit('logout')
    router.push('/login')
  } catch (error) {
    message.error($t('errorLogout'))
  } finally {
    isLoggingOut.value = false
  }
}

const showAddModal = () => {
  if (selectedKey.value === 'animals') {
    selectedAnimal.value = null
    isAddAnimalModalVisible.value = true
  } else {
    selectedUser.value = null
    isAddModalVisible.value = true
  }
}

const showEditModal = (item) => {
  if (selectedKey.value === 'animals') {
    selectedAnimal.value = { ...item }
    isEditAnimalModalVisible.value = true
  } else {
    selectedUser.value = { ...item }
    isEditModalVisible.value = true
  }
}

const handleUserAdded = () => fetchUsers()
const handleAnimalAdded = () => fetchAnimals()

const handleUserChanged = (updatedUser) => {
  const index = users.value.findIndex(u => u._id === updatedUser._id)
  if (index !== -1) users.value[index] = updatedUser
  else fetchUsers()
}

const handleAnimalChanged = (updatedAnimal) => {
  const index = animals.value.findIndex(a => a._id === updatedAnimal._id)
  if (index !== -1) animals.value[index] = updatedAnimal
  else fetchAnimals()
}

function generateRandomKey() {
  return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toUpperCase()
}

watch(isDeleteModalVisible, val => { if (val) key.value = generateRandomKey() })

const showDeleteModal = (item) => {
  confirmInput.value = ''
  if (selectedKey.value === 'animals') animalToDelete.value = item
  else userToDelete.value = item
  isDeleteModalVisible.value = true
}

const handleConfirmDelete = async () => {
  try {
    const url = selectedKey.value === 'animals'
      ? `${import.meta.env.VITE_API_URL}/animals/${animalToDelete.value._id}`
      : `${import.meta.env.VITE_API_URL}/users/${userToDelete.value._id}`

    const response = await fetch(url, { method: 'DELETE' })
    if (!response.ok) throw new Error('Error deleting item')

    message.success(selectedKey.value === 'animals' ? $t('sucessDeletingAnimal') : $t('sucessDeletingUser'))
    selectedKey.value === 'animals' ? fetchAnimals() : fetchUsers()

    isDeleteModalVisible.value = false
    confirmInput.value = ''
    userToDelete.value = null
    animalToDelete.value = null
  } catch (error) {
    message.error($t('errorDeletingItem'))
  }
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`)
    users.value = await response.json()
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

const fetchAnimals = async () => {
  loading.value = true
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/animals`)
    if (!response.ok) throw new Error(await response.text())
    animals.value = await response.json()
  } catch (error) { console.error(error) }
  finally { loading.value = false }
}

const filteredAnimals = computed(() => {
  return animals.value.filter(a => {
    const matchesName = a.name?.toLowerCase().includes(animalFilter.value.toLowerCase())
    const matchesType =
      (filterDogs.value && a.animalType?.toLowerCase() === 'dog') ||
      (filterCats.value && a.animalType?.toLowerCase() === 'cat')
    return matchesName && matchesType
  })
})

const isAdmin = computed(() => loggedUser.value?.role?.toUpperCase() === 'ADMIN')

onMounted(() => {
  selectedKey.value === 'animals' ? fetchAnimals() : fetchUsers()
  const savedUser = localStorage.getItem('loggedUser')
  if (savedUser) {
    try { loggedUser.value = JSON.parse(savedUser) }
    catch { loggedUser.value = null }
  }
})

watch(selectedKey, val => { val === 'animals' ? fetchAnimals() : fetchUsers() })

const handleMenuClick = e => selectedKey.value = e.key
</script>
<style scoped>
.logo-header {
  width: 180px;
  height: auto;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.a-layout-sider .ant-menu-item {
  background-color: #001529;
  color: #fff;
  transition: background-color 0.3s, color 0.3s;
}

.a-layout-sider .ant-menu-item:hover,
.a-layout-sider .ant-menu-item-selected {
  background-color: #002140 !important;
  color: #fff;
}

.logout-item:hover div {
  color: #ff7875 !important;
}

:global(.ant-menu-item) {
  background-color: #001529;
  color: #fff;
}

:global(.ant-menu-item:hover) {
  background-color: #00263a !important;
}

:global(.ant-menu-item-selected) {
  background-color: #002140 !important;
  color: #fff !important;
}

:global(.ant-layout-sider) {
  width: 200px !important;
  max-width: 200px !important;
}

@media (max-width: 768px) {
  :global(.ant-layout-sider) {
    position: fixed !important;
    left: 0;
    top: 0;
    bottom: 0;
    width: auto !important;
    max-width: auto !important;
    z-index: 10;
  }

  :global(.ant-layout-sider-trigger) {
    position: fixed !important;
    bottom: 0 !important;
    top: auto !important;
    height: auto !important;
    z-index: 999;
  }
}

@media (max-width: 600px) {
  .logo {
    padding: 12px !important;
  }

  .logo-header {
    width: 120px !important;
  }

  .top-actions {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
  }

  .filter-row {
    width: 100% !important;
  }

  .add-button-row {
    width: 100% !important;
    display: flex;
    justify-content: flex-start;
  }
}
</style>
