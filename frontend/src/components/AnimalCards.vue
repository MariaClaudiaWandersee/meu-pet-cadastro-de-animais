<template>
  <a-row v-if="localAnimals.length" :gutter="[16, 16]">
    <a-col
      v-for="animal in localAnimals"
      :key="animal._id"
      :xs="24"
      :sm="12"
      :md="8"
      :lg="6"
    >
      <a-card
        hoverable
        style="position: relative;"
        @click="handleCardClick($event, animal)"
      >
        <CloseOutlined
          class="delete-icon"
          @click.stop="confirmDelete(animal)"
          v-if="isAdmin"
        />

        <template #cover>
          <div class="card-image-wrapper">
            <img
              alt="Animal"
              :src="animal.image 
                ? `${API_URL}${animal.image}` 
                : `${API_URL}/uploads/default.jpg`"
            />
          </div>
        </template>

        <a-card-meta :title="animal.name">
          <template #description>
            <p>Name: {{animal.name}}</p>
            <p>Age: {{ animal.age ?? 'N/A' }}</p>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>

  <div v-else style="text-align: center; padding: 24px;">
    No animals found.
  </div>

  <a-modal
    :open="deleteVisible"
    title="Confirm deletion"
    ok-text="Yes, delete"
    cancel-text="Cancel"
    @ok="handleDelete"
    @cancel="() => (deleteVisible = false)"
  >
    <p>Are you sure you want to delete this registration?</p>
  </a-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  animals: {
    type: Array,
    required: true,
    default: () => []
  },
  showEditModal: {
    type: Function,
    required: true
  },
  refreshAnimals: {
    type: Function,
    required: false
  },
  loggedUser: {
    type: Object,
    required: true
  }
})

const API_URL = import.meta.env.VITE_API_URL

const localAnimals = ref([...props.animals])
watch(() => props.animals, (newVal) => {
  localAnimals.value = [...newVal]
})

const deleteVisible = ref(false)
const animalToDelete = ref(null)

const confirmDelete = (animal) => {
  animalToDelete.value = animal
  deleteVisible.value = true
}

const handleDelete = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/animals/${animalToDelete.value._id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Error deleting animal.')

    message.success('Animal successfully removed!')
    deleteVisible.value = false

    const index = localAnimals.value.findIndex(a => a._id === animalToDelete.value._id)
    if (index !== -1) localAnimals.value.splice(index, 1)

    if (typeof props.refreshAnimals === 'function') {
      await props.refreshAnimals()
    }

    animalToDelete.value = null
  } catch (e) {
    console.error(e)
    message.error(e.message || 'Error deleting animal.')
  }
}

const handleCardClick = (e, animal) => {
  if (!e.target.closest('.delete-icon')) showEditModal(animal)
}

const isAdmin = computed(() => {
  const role = props.loggedUser?.role
  console.log('Logged user role in AnimalCards:', role)
  return role?.trim().toLowerCase() === 'admin'
})
</script>

<style scoped>
a-card { cursor: pointer; transition: transform 0.2s ease; }
a-card:hover { transform: translateY(-3px); }

.delete-icon {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 18px;
  color: #ff4d4f;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 4px;
  transition: 0.2s;
}
.delete-icon:hover {
  color: white;
  background-color: #ff4d4f;
}

.card-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  overflow: hidden;
}
.card-image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}
</style>
