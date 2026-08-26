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
    roles: [], // 当前用户角色标识（jobseek_user/recruiter_user/manage_user）
    rolesLoaded: false, // 是否已从后端拉取过角色
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
      state.rolesLoaded = true
    },
    clearRoles(state) {
      state.roles = []
      state.rolesLoaded = false
    }
  },
  actions: {
    // 拉取当前登录用户的角色（用于前端权限划分）
    fetchRoles({ commit, state }) {
      if (!state.hasLogin) {
        return Promise.resolve()
      }
      if (state.rolesLoaded) {
        return Promise.resolve(state.roles)
      }
      return axios
        .post('/api/authUser/auth/getMyRoles')
        .then((res) => {
          if (res.data && res.data.success) {
            commit('setRoles', res.data.date || [])
            return state.roles
          }
          commit('setRoles', [])
          return []
        })
        .catch(() => {
          // 拉取失败时标记已加载，避免反复请求
          commit('setRoles', [])
          return []
        })
    }
  },
  modules: {
    notification
  }
})