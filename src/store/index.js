import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import notification from './modules/notification'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 你的状态
    name: '注册/登录',
    email: '',
    hasLogin: false,
    avatar: '', // 用户头像URL
    roles: JSON.parse(localStorage.getItem('userRoles') || '[]'), // 当前用户角色 key 列表
  },
  mutations: {
    // 修改状态的方法
    setName(state, newName) {
      state.name = newName
    },
    setEmail(state, email) {
      state.email = email
    },
    setLoginStatus(state, newStatus) {
      state.hasLogin = newStatus
    },
    setAvatar(state, avatar) {
      state.avatar = avatar || ''
    },
    setRoles(state, roles) {
      state.roles = Array.isArray(roles) ? roles : []
      localStorage.setItem('userRoles', JSON.stringify(state.roles))
    }
  },
  actions: {
    // 拉取当前登录用户角色列表（officialReferView 按角色显示审批标签页）
    async fetchRoles({ commit }) {
      try {
        const res = await axios.get('/api/authUser/auth/roles')
        if (res.data && (res.data.success === true || res.data.code === 200)) {
          commit('setRoles', res.data.date || [])
        }
      } catch (error) {
        console.log('获取角色列表失败')
      }
    }
  },
  modules: {
    notification
  }
})