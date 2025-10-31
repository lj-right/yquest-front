import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 你的状态
    name: '注册/登录',
    email: '',
    hasLogin: false,
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
    }
  },
  modules: {
    // 模块化Vuex
  }
})