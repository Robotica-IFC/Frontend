import { createRouter, createWebHistory } from 'vue-router'
import welcomeView from '@/views/welcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcomeView,
    }
  ],
})

export default router
