import Vue from "vue"
import VueRouter from "vue-router"
// import store from '../store' // 导入store

Vue.use(VueRouter)

const routes = [
  {
    path: "/yquest",
    name: "yquest",
    component: () => import("../views/yquest/yquestView.vue"),
  },
  {
    path: "/refer",
    name: "refer",
    component: () => import("../views/yquest/referView.vue"),
    meta: { requireAuth: true }
  },
  {
    path: "/showRefer",
    name: "showRefer",
    component: () => import("../views/yquest/showReferView.vue"),
  },
  {
    path: "/manage",
    name: "manage",
    component: () => import("../views/manage/manageReferView.vue"),
    redirect: "/manage/admin",
    children: [
      {
        path: "/manage/user",
        name: "add",
        component: () => import("../views/manage/UserView.vue"),
      },
      {
        path: "/manage/admin",
        name: "edit",
        component: () => import("../views/manage/manageReferView.vue"),
      },
    ],
  },
  {
    path: "/aboutMe",
    name: "aboutMe",
    component: () => import("../views/author/authorView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/loginView.vue"),
  },
  {
    path: "/circle",
    name: "circle",
    component: () => import("../views/circle/circleView.vue"),
  },
  {
    path: "/",
    redirect: "/yquest",
  },
]

const router = new VueRouter({
  routes,
})

import { Message } from 'element-ui';
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // 从store中获取登录状态
    // const isLoggedIn = store.state.hasLogin;
    const token = localStorage.getItem("token");
    if (token) {
      next()
    } else {
      Message.warning({ message: "请先登录", duration: 350 })
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      })
    }
  } else {
    next()
  }
})

export default router
