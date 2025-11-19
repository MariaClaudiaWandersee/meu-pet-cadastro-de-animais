<template>
  <a-modal
    centered
    :open="open"
    :title="t('editAnimal')"
    :confirm-loading="loading"
    @ok="submitForm"
    @cancel="() => emit('update:open', false)"
    destroy-on-close
    width="600px"
    :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '16px' }"
  >
    <a-form ref="formRef" :model="formState" layout="vertical">

      <a-form-item :label="t('name')" name="name" required>
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item :label="t('age')" name="age">
        <a-input v-model:value="formState.age" />
      </a-form-item>

      <a-form-item :label="t('sex')" name="sex" required>
        <a-radio-group v-model:value="formState.sex">
          <a-radio value="male">{{ t('male') }}</a-radio>
          <a-radio value="female">{{ t('female') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label="t('animalType')" name="animalType" required>
        <a-radio-group v-model:value="formState.animalType">
          <a-radio value="dog">{{ t('dog') }}</a-radio>
          <a-radio value="cat">{{ t('cat') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label="t('vaccines')">
        <a-checkbox-group v-model:value="formState.vaccines">
          <a-checkbox
            v-for="v in availableVaccines"
            :key="v"
            :value="v"
          >
            {{ t(v) }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item :label="t('hasRestrictions')" name="hasRestriction">
        <a-radio-group
          :value="formState.hasRestriction"
          @change="e => formState.hasRestriction = e.target.value === true || e.target.value === 'true'"
        >
          <a-radio :value="true">{{ t('yes') }}</a-radio>
          <a-radio :value="false">{{ t('no') }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        v-if="formState.hasRestriction"
        :label="t('restricion')"
        name="restrictionText"
      >
        <a-textarea v-model:value="formState.restrictionText" />
      </a-form-item>

      <a-form-item>
        <template #label>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span>{{ t('image') }}</span>
            <a-tooltip :title="t('imageTooltip')">
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
            <PlusOutlined />
            <div style="margin-top: 8px">{{ t('uploadImage') }}</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>

    <teleport to="body">
      <div v-if="previewVisible" class="preview-overlay" @click.self="previewVisible = false">
        <button class="close-btn" @click="previewVisible = false">×</button>
        <img :src="previewImage" alt="preview" class="preview-image" />
      </div>
    </teleport>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ open: boolean; loading: boolean; animal: any }>()
const emit = defineEmits(['update:open', 'animal-edited'])

const formRef = ref()
const fileList = ref<any[]>([])
const previewVisible = ref(false)
const previewImage = ref('')

const currentImageUrl = ref('')

const formState = reactive({
  name: '',
  age: '',
  animalType: '',
  hasRestriction: false,
  restrictionText: '',
  vaccines: [] as string[],
  image: null as File | null,
  sex: ''
})

const availableVaccines = computed(() => {
  if (formState.animalType === 'dog') {
    return ['vaccineV8V10', 'vaccineAntirrabica']
  } else if (formState.animalType === 'cat') {
    return ['vaccineV4V5', 'vaccineAntirrabica', 'vaccineFelv']
  }
  return []
})

watch(
  () => props.animal,
  (a) => {
    if (a) {
      formState.name = a.name
      formState.age = a.age
      formState.animalType = a.animalType || ''
      formState.hasRestriction =
        a.hasRestriction === true ||
        a.hasRestriction === 'true' ||
        a.hasRestriction === 1
      formState.restrictionText = a.restrictionText
      formState.vaccines = a.vaccines || []
      formState.sex = a.sex || ''

      const imageUrl = a.image
        ? `${import.meta.env.VITE_API_URL}${a.image}`
        : `${import.meta.env.VITE_API_URL}/uploads/default.jpg`

      currentImageUrl.value = imageUrl

      fileList.value = [
        {
          uid: '-1',
          name: 'current-image',
          status: 'done',
          url: imageUrl
        }
      ]
    }
  },
  { immediate: true, deep: true }
)

const handleFileChange = ({ fileList: newList }: any) => {
  fileList.value = newList
  formState.image =
    newList.length && newList[0].originFileObj ? newList[0].originFileObj : null
}

const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj)
  }
  previewImage.value = file.url || file.preview
  previewVisible.value = true
}

const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const submitForm = async () => {
  try {
    await formRef.value.validate()

    let body: BodyInit
    let headers: HeadersInit = {}

    if (formState.image) {
      const formData = new FormData()
      formData.append('name', formState.name)
      formData.append('age', formState.age)
      formData.append('animalType', formState.animalType)
      formData.append('hasRestriction', formState.hasRestriction ? 'true' : 'false')
      formData.append('restrictionText', formState.restrictionText)
      formData.append('vaccines', JSON.stringify(formState.vaccines))
      formData.append('sex', JSON.stringify(formState.sex))
      formData.append('image', formState.image)
      body = formData
    } else {
      body = JSON.stringify({
        name: formState.name,
        age: formState.age,
        animalType: formState.animalType,
        hasRestriction: formState.hasRestriction,
        restrictionText: formState.restrictionText,
        vaccines: formState.vaccines,
        sex: formState.sex,
        image: currentImageUrl.value
      })
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/animals/${props.animal._id}`, {
      method: 'PUT',
      headers,
      body
    })

    if (!res.ok) throw new Error()

    const updatedAnimal = await res.json()
    message.success(t('animalUpdated'))
    emit('update:open', false)
    emit('animal-edited', updatedAnimal)
  } catch (e) {
    console.error(e)
    message.error(t('errorupdateAnimal'))
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

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(10, 10, 10, 0.3);
  z-index: 99999;
  backdrop-filter: blur(2px);
}

.preview-image {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 10px;
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
