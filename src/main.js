import './assets/css/global.css';
import '@mdi/font/css/materialdesignicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import AppImage from './components/common/AppImage.vue'
import router from './router'

const app = createApp(App)

app.component('AppImage', AppImage)
app.use(createPinia())
app.use(router)

app.mount('#app')
