import './assets/css/global.css';
import '@mdi/font/css/materialdesignicons.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Garante que novas versões da PWA recarreguem a interface já aberta.
registerSW({ immediate: true })
