import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/yquest',
    name: 'yquest',
    component: () => import('../views/yquest/yquestView.vue')
  },
  {
    path: '/refer',
    name: 'refer',
    component: () => import('../views/yquest/referView.vue'),
  },
  {
    path: '/showRefer',
    name: 'showRefer',
    component: () => import('../views/yquest/showReferView.vue')
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('../views/manage/manageReferView.vue')
  },
  {
    path: '/aboutMe',
    name: 'aboutMe',
    component: () => import('../views/manage/authorView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/loginView.vue')
  },
  {
    path: '/circle',
    name: 'circle',
    component: () => import('../views/circle/circleView.vue')
  },
  {
    path: '/',
    redirect: '/yquest'

  }
]

const router = new VueRouter({
  routes
})

export default router
