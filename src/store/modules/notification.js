import axios from 'axios'

const state = {
  hasUnread: false,           // 是否有未读通知
  notifications: [],          // 通知列表
  isPanelOpen: false,         // 面板是否展开
  activeTab: 'notifications', // 当前选项卡
  pagination: {
    pageNo: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  }
}

const mutations = {
  SET_UNREAD_STATUS(state, hasUnread) {
    state.hasUnread = hasUnread
  },

  SET_NOTIFICATIONS(state, { data, append }) {
    if (append) {
      state.notifications.push(...data)
    } else {
      state.notifications = data
    }
  },

  TOGGLE_PANEL(state, isOpen) {
    state.isPanelOpen = isOpen !== undefined ? isOpen : !state.isPanelOpen
  },

  SET_ACTIVE_TAB(state, tab) {
    state.activeTab = tab
  },

  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
  },

  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  }
}

const actions = {
  async fetchUnreadStatus({ commit }) {
    try {
      const response = await axios.get('/api/circle/share/message/unRead')
      if (response.data && (response.data.success === true || response.data.code === 200)) {
        commit('SET_UNREAD_STATUS', response.data.date || false)
      }
    } catch (error) {
      console.error('获取未读状态失败:', error)
    }
  },

  async fetchNotifications({ commit, state }, { isRead, append = false } = {}) {
    try {
      const requestBody = {
        pageInfo: {
          pageNo: append ? state.pagination.pageNo + 1 : state.pagination.pageNo,
          pageSize: state.pagination.pageSize
        }
      }
      
      // 只有当 isRead 参数存在时才添加到请求体中
      if (isRead !== undefined) {
        requestBody.isRead = isRead
      }
      
      const response = await axios.post('/api/circle/share/message/getMessages', requestBody)
      
      if (response.data && (response.data.success === true || response.data.code === 200)) {
        const pageResult = response.data.date || {}
        const notifications = pageResult.result || []
        
        commit('SET_NOTIFICATIONS', { data: notifications, append })
        commit('SET_PAGINATION', {
          pageNo: pageResult.pageNo || 1,
          total: pageResult.total || 0,
          totalPages: pageResult.totalPages || 0
        })
      }
    } catch (error) {
      console.error('获取通知列表失败:', error)
    }
  },

  async clearAllNotifications({ commit }) {
    commit('CLEAR_NOTIFICATIONS')
    commit('SET_UNREAD_STATUS', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
