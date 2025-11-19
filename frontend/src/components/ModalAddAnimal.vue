<template>
  <a-modal
    centered
    :open="open"
    :title="$t('addAnimal')"
    :confirm-loading="loading"
    :cancel-text="$t('cancelText')"
    @ok="submitForm"
    @cancel="handleCancel"
    destroy-on-close
  >
    <div class="modal-scroll">
      <a-form ref="formRef" :model="formState" layout="vertical">

        <a-form-item :label="$t('name')" name="name" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>

        <a-form-item :label="$t('age')" name="age">
          <a-input v-model:value="formState.age" />
        </a-form-item>

        <a-form-item :label="$t('sex')" name="sex" required>
          <a-radio-group v-model:value="formState.sex">
            <a-radio value="male">{{ $t('male') }}</a-radio>
            <a-radio value="female">{{ $t('female') }}</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item :label="$t('animalType')" name="animalType" required>
          <a-radio-group v-model:value="formState.animalType">
            <a-radio value="dog">{{ $t('dog') }}</a-radio>
            <a-radio value="cat">{{ $t('cat') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="formState.animalType"
          :label="$t('vaccines')"
          name="vaccines"
        >
          <a-checkbox-group v-model:value="formState.vaccines">
            <a-checkbox
              v-for="v in availableVaccines"
              :key="v"
              :value="v"
            >
              {{ $t(v) }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item :label="$t('hasRestrictions')" name="hasRestriction">
          <a-radio-group v-model:value="formState.hasRestriction">
            <a-radio :value="true">{{ $t('yes') }}</a-radio>
            <a-radio :value="false">{{ $t('no') }}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="formState.hasRestriction"
          :label="$t('restricion')"
          name="restrictionText"
        >
          <a-textarea v-model:value="formState.restrictionText" />
        </a-form-item>

        <a-form-item>
          <template #label>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span>{{ $t('image') }}</span>
              <a-tooltip :title="$t('imageTooltip')">
                <QuestionCircleOutlined style="color: #999; cursor: pointer; font-size: 14px;" />
              </a-tooltip>
            </div>
          </template>

          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @change="handleFileChange"
            @preview="handlePreview"
            :before-upload="() => false"
          >
            <div>
              <PlusOutlined/>
              <div style="margin-top: 8px">{{ $t('uploadImage') }}</div>
            </div>
          </a-upload>

        </a-form-item>
      </a-form>
    </div>

    <div
      v-if="previewVisible"
      class="preview-overlay"
      @click.self="handleCancelPreview"
    >
      <button class="close-btn" @click="handleCancelPreview">×</button>
      <img :src="previewImage" alt="preview" class="preview-image" />
    </div>

  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{ open: boolean; loading: boolean }>()
const emit = defineEmits(['update:open', 'animal-added'])

const formRef = ref()
const fileList = ref<any[]>([])
const previewVisible = ref(false)
const previewImage = ref('')

const formState = reactive({
  name: '',
  age: '',
  animalType: '',
  hasRestriction: false,
  restrictionText: '',
  vaccines: [] as string[],
  sex: '',
  image: null as File | null
})

const availableVaccines = computed(() => {
  if (formState.animalType === 'dog') {
    return ['vaccineV8V10', 'vaccineAntirrabica']
  } else if (formState.animalType === 'cat') {
    return ['vaccineV4V5', 'vaccineAntirrabica', 'vaccineFelv']
  }
  return []
})

const resetForm = () => {
  formState.name = ''
  formState.age = ''
  formState.animalType = ''
  formState.hasRestriction = false
  formState.restrictionText = ''
  formState.vaccines = []
  formState.image = null
  formState.sex = ''
  fileList.value = []
}

const handleFileChange = ({ fileList: newList }: any) => {
  fileList.value = newList
  formState.image = newList.length ? newList[0].originFileObj : null
}

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
}

const handleCancelPreview = () => {
  previewVisible.value = false
}

const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const handleCancel = () => {
  resetForm()
  emit('update:open', false)
}

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const formData = new FormData()
    formData.append('name', formState.name)
    formData.append('age', formState.age)
    formData.append('animalType', formState.animalType)
    formData.append('sex', formState.sex)
    formData.append('hasRestriction', formState.hasRestriction ? 'true' : 'false')
    formData.append(
      'restrictionText',
      formState.hasRestriction ? formState.restrictionText : ''
    )
    formData.append('vaccines', JSON.stringify(formState.vaccines))
    if (formState.image) formData.append('image', formState.image)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/animals`, {
      method: 'POST',
      body: formData
    })

    if (!res.ok) throw new Error(t('errorAddingAnimal'))

    const newAnimal = await res.json()

    message.success(t('sucessAddingAnimal'))
    emit('animal-added', newAnimal)
    emit('update:open', false)
    resetForm()
  } catch (error) {
    console.error(error)
    message.error(t('errorAddingAnimal'))
  }
}
</script>

<style scoped>
:deep(.ant-upload-list-picture-card-container) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.ant-upload-list-item) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

:deep(.ant-upload-list-item-thumbnail img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.modal-scroll {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  backdrop-filter: blur(2px);
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}
</style>
