import { createRouter, createWebHistory } from 'vue-router'
import welcomeView from '@/views/welcomeView.vue'
import signView from '@/views/signView.vue'
import changePasswordView from '@/views/changePasswordView.vue'
import tests from '@/views/tests.vue'

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
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: changePasswordView
    },
    {
      path: '/test',
      name: 'test',
      component: tests
    }
  ],
})

export default router
