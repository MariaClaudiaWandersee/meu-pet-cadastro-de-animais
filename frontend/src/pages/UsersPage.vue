<template>
  <div style="padding: 24px">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <img v-if="logo" :src="logo" alt="Logo" class="logo-header" />
      </div>
      <div style="display: flex; justify-content: flex-end; margin: 7px 14px;">
        <a-button danger :loading="isLoggingOut" @click="logout">Logout</a-button>
      </div>
    </div>

    <a-card bordered>
      <template #title>
        <a-tabs v-model:activeKey="activeKey" type="card">
          <a-tab-pane key="1" tab="Registered Animals" />
          <a-tab-pane key="2" tab="Registered Users" />
        </a-tabs>

        <div style="display: flex; justify-content: flex-end; align-items: center; margin: 7px 15px; gap: 8px;">
          
          <div v-if="activeKey === '1'" style="display: flex; gap: 8px; align-items: center;">
            <a-dropdown trigger="click">
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-checkbox v-model:checked="filterDogs">
                      Dogs
                    </a-checkbox>
                  </a-menu-item>
                  <a-menu-item>
                    <a-checkbox v-model:checked="filterCats">
                      Cats
                    </a-checkbox>
                  </a-menu-item>
                </a-menu>
              </template>

              <a-input
                v-model:value="animalFilter"
                placeholder="Filter by name..."
                style="width: 240px"
                @input="applyFilter"
              />
            </a-dropdown>
          </div>

          <a-button type="primary" @click="showAddModal">
            <PlusOutlined />
            {{ activeKey === '1' ? "Animal" : "User" }}
          </a-button>
        </div>
      </template>

      <!-- Aba de Animais -->
      <AnimalCards
        :activeKey="activeKey"
        v-if="activeKey === '1'"
        :animals="filteredAnimals"
        :showEditModal="showEditModal"
        :loggedUser="loggedUser"
      />

      <!-- Aba de Usuários -->
      <TableUsers
        v-if="activeKey === '2'"
        :users="users"
        :isAdmin="isAdmin"
        @edit="showEditModal"
        @delete="showDeleteModal"
        @user-added="users.push($event)"
      />

      <ModalAddUser
        v-if="activeKey === '2'"
        :open="isAddModalVisible"
        :loading="loading"
        :user="selectedUser"
        @update:open="val => isAddModalVisible = val"
        @user-added="handleUserAdded"
      />

      <ModalEditUser
        v-if="activeKey === '2' && loggedUser && isEditModalVisible"
        :open="isEditModalVisible"
        :loading="loading"
        :user="selectedUser"
        :logged-user="loggedUser"
        @update:open="val => isEditModalVisible = val"
        @saved="handleUserChanged"
      />

      <ModalAddAnimal
        v-if="activeKey === '1'"
        :key="selectedAnimal?._id" 
        :open="isAddAnimalModalVisible"
        :loading="loading"
        :animal="selectedAnimal"
        @update:open="val => isAddAnimalModalVisible = val"
        @animal-added="handleAnimalAdded"
      />

      <ModalEditAnimal
        v-if="activeKey === '1' && isEditAnimalModalVisible"
        :open="isEditAnimalModalVisible"
        :loading="loading"
        :animal="selectedAnimal"
        @update:open="val => isEditAnimalModalVisible = val"
        @animal-edited="handleAnimalChanged"
      />

      <a-modal
        :open="isDeleteModalVisible"
        :title="activeKey === '2'
          ? `Delete user ${userToDelete?.name}?`
          : `Delete animal ${animalToDelete?.name}?`"
        @ok="handleConfirmDelete"
        @cancel="handleCancelDelete"
        :ok-button-props="{ disabled: confirmInput.value !== key.value }"
        ok-text="Delete"
        cancel-text="Cancel"
        centered
      >
        <p>This action cannot be undone.</p>
        <p>
          Please enter the code
          <strong
            :style="{ userSelect: 'none', pointerEvents: 'none' }"
            @contextmenu.prevent
          >
            {{ key }}
          </strong>
          below to confirm deletion.
        </p>
        <a-input
          v-model:value="confirmInput"
          @input="e => confirmInput.value = e.target.value.toUpperCase()"
          placeholder="Enter code here"
        />
      </a-modal>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import ModalAddUser from '../components/ModalAddUser.vue'
import ModalEditUser from '../components/ModalEditUser.vue'
import ModalAddAnimal from '../components/ModalAddAnimal.vue'
import ModalEditAnimal from '../components/ModalEditAnimal.vue'
import AnimalCards from '../components/AnimalCards.vue'
import TableUsers from '../components/TableUsers.vue'

import logoPrincipal from '../images/logo-principal-1.jpeg'

const router = useRouter()

const activeKey = ref('1')
const users = ref([])
const animals = ref([])
const loading = ref(false)
const isLoggingOut = ref(false)

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

const logo = logoPrincipal

const applyFilter = () => {}

const emit = defineEmits(['logout'])
const logout = async () => {
  try {
    isLoggingOut.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    localStorage.removeItem('loggedUser')
    emit('logout')
    router.push('/login-meu-pet')
  } catch (error) {
    message.error('Error during logout')
  } finally {
    isLoggingOut.value = false
  }
}

const showAddModal = () => {
  if (activeKey.value === '1') {
    selectedAnimal.value = null
    isAddAnimalModalVisible.value = true
  } else {
    selectedUser.value = null
    isAddModalVisible.value = true
  }
}

const showEditModal = (item) => {
  if (activeKey.value === '1') {
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
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  ).toUpperCase()
}
watch(isDeleteModalVisible, (val) => {
  if (val) key.value = generateRandomKey()
})

const showDeleteModal = (item) => {
  confirmInput.value = ''
  if (activeKey.value === '1') animalToDelete.value = item
  else userToDelete.value = item
  isDeleteModalVisible.value = true
}

const handleConfirmDelete = async () => {
  try {
    if (confirmInput.value === key.value) {
      const url = activeKey.value === '1'
        ? `http://localhost:8080/animals/${animalToDelete.value._id}`
        : `http://localhost:8080/users/${userToDelete.value._id}`

      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) throw new Error('Error deleting item')

      message.success(activeKey.value === '1'
        ? 'Animal successfully deleted!'
        : 'User successfully deleted!')

      activeKey.value === '1' ? fetchAnimals() : fetchUsers()
      isDeleteModalVisible.value = false
      confirmInput.value = ''
      userToDelete.value = null
      animalToDelete.value = null
    } else {
      message.error('Enter the code correctly')
    }
  } catch (error) {
    message.error('Error deleting item: ' + error.message)
  }
}

const handleCancelDelete = () => {
  isDeleteModalVisible.value = false
  confirmInput.value = ''
  userToDelete.value = null
  animalToDelete.value = null
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/users')
    users.value = await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const fetchAnimals = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/animals')
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erro ${response.status}: ${errorText}`)
    }
    animals.value = await response.json()
  } catch (error) {
    console.error('Error fetching animals:', error)
    message.error('Erro ao carregar animais')
  } finally {
    loading.value = false
  }
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
const welcomeName = computed(() => loggedUser.value?.name ?? '')

onMounted(() => {
  activeKey.value === '1' ? fetchAnimals() : fetchUsers()
  const savedUser = localStorage.getItem('loggedUser')
  if (savedUser) {
    try {
      loggedUser.value = JSON.parse(savedUser)
    } catch {
      loggedUser.value = null
    }
  }
})

watch(activeKey, (val) => {
  val === '1' ? fetchAnimals() : fetchUsers()
})
</script>

<style scoped>
.logo-header {
  width: 220px;
  height: auto;
}

</style>
