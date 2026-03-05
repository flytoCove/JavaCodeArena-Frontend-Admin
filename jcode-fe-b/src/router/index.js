import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/jcode/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path:"/",
      redirect:"/jcode/login"
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

router.beforeEach((to, from, next) => {
  if (getToken()) {  //已经登陆过
    /* has token*/
    if (to.path === '/jcode/login') {
      next({ path: '/jcode/layout' })
    } else {
      next()
    }
  } else {
    if (to.path !== '/jcode/login') {
      next({path:'/jcode/login'})
    } else {
      next()
    }
  }
})

export default router
