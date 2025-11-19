<template>
  <div class="top-actions">
    <div
      v-if="selectedKey === 'animals'"
      class="filter-row"
    >
      <a-dropdown trigger="click">
        <template #overlay>
          <div
            style="display: flex; flex-direction: column; padding: 8px; background: white; border-radius: 4px;"
          >
            <a-checkbox
              :checked="filterDogs"
              @change="e => $emit('update:filterDogs', e.target.checked)"
              style="margin-bottom: 4px;"
            >
              {{ t('dog') }}
            </a-checkbox>

            <a-checkbox
              :checked="filterCats"
              @change="e => $emit('update:filterCats', e.target.checked)"
            >
              {{ t('cat') }}
            </a-checkbox>
          </div>
        </template>

        <a-input
          :value="animalFilter"
          @input="e => $emit('update:animalFilter', e.target.value)"
          :placeholder="t('filterText')"
          style="width: 240px"
        />
      </a-dropdown>
    </div>

    <div class="add-button-row">
      <a-button type="primary" class="button" @click="$emit('add-click')">
        <PlusOutlined />
        {{ selectedKey === 'animals' ? t('animal') : t('user') }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  selectedKey: { type: String, required: true },
  animalFilter: { type: String, default: '' },
  filterDogs: { type: Boolean, default: true },
  filterCats: { type: Boolean, default: true },
})

const emit = defineEmits([
  'update:animalFilter',
  'update:filterDogs',
  'update:filterCats',
  'add-click'
])

watch(() => props.filterDogs, val => emit('update:filterDogs', val))
watch(() => props.filterCats, val => emit('update:filterCats', val))
</script>

<style scoped>
.top-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.filter-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-button-row {
  display: flex;
}

.button {
  background-color: #002140
}

.button:hover {
  background-color: #03315a;
}
</style>
