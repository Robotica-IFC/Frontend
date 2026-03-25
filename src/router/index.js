import { createRouter, createWebHistory } from 'vue-router'
import welcomeView from '@/views/welcomeView.vue'
import signView from '@/views/signView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcomeView,
    },
    {
      path: '/sign',
      name: 'sign',
      component: signView
    }
  ],
})

export default router
