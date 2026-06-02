import { createRouter, createWebHistory } from 'vue-router'
import welcomeView from '@/views/welcomeView.vue'
import signView from '@/views/signView.vue'
import changePasswordView from '@/views/changePasswordView.vue'
import tests from '@/views/tests.vue'
import HomePageView from '@/views/homePageView.vue'
import teamView from '@/views/teamView.vue'
import editUserView from '@/views/editUserView.vue'


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
      path: '/home-page',
      name: 'home-page',
      component: HomePageView
    },
    {
      path: '/team',
      name: 'team',
      component: teamView
    },
    {
      path: '/test',
      name: 'test',
      component: tests
    },
    {
      path: '/edit',
      name: 'edit',
      component: editUserView
    }
  ],
})

export default router
