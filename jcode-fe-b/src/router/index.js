import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/jcode/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/jcode/system',
      name: 'systmm',
      component: () => import('../views/System.vue')
    }
  ],
})

export default router
