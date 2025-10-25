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
    component: () => import("../views/manage/manageContainer.vue"),
    redirect: "/manage/refer",
    meta: { requireAuth: true, isAdmin: true },
    children: [
      {
        path: "/manage/user",
        name: "user",
        component: () => import("../views/manage/UserView.vue"),
        meta: { requireAuth: true, isAdmin: true }
      },
      {
        path: "/manage/sensitive",
        name: "sensitive",
        component: () => import("../views/manage/SensitiveView.vue"),
        meta: { requireAuth: true, isAdmin: true }
      },
      {
        path: "/manage/circle",
        name: "circle",
        component: () => import("../views/manage/CircleView.vue"),
        meta: { requireAuth: true, isAdmin: true }
      },
      {
        path: "/manage/refer",
        name: "manageRefer",
        component: () => import("../views/manage/manageReferView.vue"),
        meta: { requireAuth: true, isAdmin: true }
      },
      {
        path: "/manage/code",
        name: "manageCode",
        component: () => import("../views/manage/TrialCodeView.vue"),
        meta: { requireAuth: true, isAdmin: true }
      }
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
    path: "/admin/login",
    name: "adminLogin",
    component: () => import("../views/login/adminLoginView.vue"),
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
    // 检查是否是管理员页面
    const isAdminPage = to.matched.some((record) => record.meta.isAdmin);
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
    if (isAdminPage) {
      // 管理员页面需要管理员token
      if (adminToken) {
        next()
      } else {
        Message.warning({ message: "请先登录管理员账号", duration: 750 })
        next({
          path: "/admin/login",
          query: { redirect: to.fullPath },
        })
      }
    } else {
      // 普通用户页面
      if (token) {
        next()
      } else {
        Message.warning({ message: "请先登录", duration: 350 })
        next({
          path: "/login",
          query: { redirect: to.fullPath },
        })
      }
    }
  } else {
    next()
  }
})

export default router
