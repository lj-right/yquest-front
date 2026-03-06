<template>
  <div class="notification-panel">
    <div class="panel-header">
      <div class="tab-switcher">
        <span 
          :class="['tab-item', { active: activeTab === 'notifications' }]"
          @click="switchTab('notifications')"
        >
          未读
        </span>
        <span 
          :class="['tab-item', { active: activeTab === 'all' }]"
          @click="switchTab('all')"
        >
          已读
        </span>
      </div>
    </div>
    
    <div class="panel-content" v-loading="loading">
      <EmptyState v-if="!hasNotifications" />
      <div v-else class="notification-list">
        <div 
          v-for="item in notifications" 
          :key="item.id"
          class="notification-item"
        >
          <div class="notification-content">
            <div class="notification-text">
              {{ formatContent(item.content) }}
            </div>
            <div class="notification-time">
              {{ formatTime(item.createdTime) }}
            </div>
          </div>
        </div>
        
        <div v-if="hasMore" class="load-more" @click="loadMore">
          加载更多
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EmptyState from './EmptyState.vue'

export default {
  name: 'NotificationPanel',
  components: {
    EmptyState
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('notification', ['activeTab', 'notifications', 'pagination']),
    hasNotifications() {
      return this.notifications && this.notifications.length > 0
    },
    hasMore() {
      return this.pagination.pageNo < this.pagination.totalPages
    }
  },
  methods: {
    switchTab(tab) {
      this.$store.commit('notification/SET_ACTIVE_TAB', tab)
      this.fetchNotifications()
    },
    async fetchNotifications() {
      this.loading = true
      try {
        // 根据选项卡决定查询参数：通知=未读(2)，已读=传isRead参数（1）
        const params = this.activeTab === 'notifications' 
          ? { isRead: 2 } 
          : {isRead: 1}
        await this.$store.dispatch('notification/fetchNotifications', params)
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      this.loading = true
      try {
        const params = this.activeTab === 'notifications' 
          ? { isRead: 0, append: true } 
          : { append: true }
        await this.$store.dispatch('notification/fetchNotifications', params)
      } finally {
        this.loading = false
      }
    },
    formatContent(content) {
      if (!content) return '无内容'
      if (typeof content === 'string') return content.msg
      if (typeof content === 'object') {
        // 优先显示 msg 字段
        if (content.msg) {
          return content.msg
        }
        return JSON.stringify(content)
      }
      return String(content)
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      
      // 如果已经是格式化的字符串，直接返回
      if (typeof timestamp === 'string' && timestamp.includes('-')) {
        return timestamp
      }
      
      // 如果是时间戳，转换为日期格式
      const date = new Date(Number(timestamp))
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  },
  mounted() {
    this.fetchNotifications()
  }
}
</script>

<style scoped>
.notification-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  max-height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.tab-switcher {
  display: flex;
  gap: 24px;
}

.tab-item {
  position: relative;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s ease;
  padding-bottom: 4px;
}

.tab-item:hover {
  color: #333;
}

.tab-item.active {
  color: #9D75CB;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 0;
  right: 0;
  height: 2px;
  background: #9D75CB;
}

.panel-content {
  max-height: 420px;
  overflow-y: auto;
  background: white;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.panel-content::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  padding: 14px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f9f9f9;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notification-text {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}

.notification-time {
  color: #999;
  font-size: 12px;
}

.load-more {
  padding: 12px 20px;
  text-align: center;
  color: #9D75CB;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.load-more:hover {
  background: #f5f0fa;
}

@media (max-width: 768px) {
  .notification-panel {
    width: 100vw;
    max-width: 100vw;
    border-radius: 0;
    right: auto;
    left: 0;
  }
}
</style>
