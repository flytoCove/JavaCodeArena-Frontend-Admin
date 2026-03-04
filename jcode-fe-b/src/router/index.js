import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/jcode/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/jcode/layout',
      name: 'layout',
      component: () => import('@/views/Layout.vue'),
      children: [
        {
          path: 'question',
          name: 'question',
          component: () => import('@/views/Question.vue'),
        },
        {
          path: 'exam',
          name: 'exam',
          component: () => import('@/views/Exam.vue'),
        },
        {
          path: 'cuser',
          name: 'cuser',
          component: () => import('@/views/Cuser.vue'),
        },
      ],
    },
  ],
})

export default router
