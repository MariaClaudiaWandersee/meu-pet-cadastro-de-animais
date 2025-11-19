import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/global.css'
import { i18n } from './i18n'
import Antd from 'ant-design-vue'
import ptBR from 'ant-design-vue/es/locale/pt_BR'

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(Antd, { locale: ptBR })
app.use(pinia)
app.use(router)
app.mount('#app')
