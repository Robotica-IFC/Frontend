import { createRouter, createWebHistory } from 'vue-router'
import welcomeView from '@/views/welcomeView.vue'
import signView from '@/views/signView.vue'
import changePasswordView from '@/views/changePasswordView.vue'
import tests from '@/views/tests.vue'
import HomePageView from '@/views/homePageView.vue'
import teamView from '@/views/teamView.vue'
import editUserView from '@/views/editUserView.vue'
import teamDetailsView from '@/views/teamDetailsView.vue'
import studentDetailsView from '@/views/studentDetailsView.vue'
import teacherDetailsView from '@/views/teacherDetailsView.vue'
import aboutUsView from '@/views/aboutUsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcomeView,
      meta: { hideHeader: true }
    },
    {
      path: '/sign',
      name: 'sign',
      component: signView,
      meta: { hideHeader: true }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: changePasswordView,
      meta: { hideHeader: true }
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
      component: editUserView,
      meta: { hideHeader: true }
    },
    {
      path: '/team/:id',
      name: 'teamDetails',
      component: teamDetailsView,
      props: true
    },
    {
      path: '/student/:id',
      name: 'studentDetails',
      component: studentDetailsView,
      props: true,
    },
    {
      path: '/teacher/:id',
      name: 'teacherDetails',
      component: teacherDetailsView,
      props: true,
    },
    {
      path: '/about-us',
      name: 'aboutUs',
      component: aboutUsView
    }
  ],
})

export default router
