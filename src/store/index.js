import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
      state.name = '欢迎：'+newName
    },
    setLoginStatus(state, newStatus) {
      state.hasLogin = newStatus
    }
  },
  actions: {
    setNickNameByLogin(context,email) {
      axios({
        url: '/api/authUser/queryNickNameByEmail',
        method: 'get',
        params: {
          email: email
        }
      }).then(res => {
        if (res.data.code === 200 && res.data.date) {
              context.commit('setName', res.data.date); 
            }
          })
        }
  },
  modules: {
    // 模块化Vuex
  }
})