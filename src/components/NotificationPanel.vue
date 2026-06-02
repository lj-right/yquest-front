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
  max-height: 480px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: var(--z-dropdown);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.tab-switcher { display: flex; gap: var(--space-6); }

.tab-item {
  position: relative;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
  padding-bottom: var(--space-1);
}

.tab-item:hover { color: var(--color-text-primary); }

.tab-item.active {
  color: var(--color-primary);
  font-weight: var(--font-medium);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 0; right: 0;
  height: 2px;
  background: var(--color-primary);
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
  background: var(--color-surface);
}

.panel-content::-webkit-scrollbar { width: 5px; }
.panel-content::-webkit-scrollbar-track { background: transparent; }
.panel-content::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

.notification-list { padding: var(--space-2) 0; }

.notification-item {
  padding: var(--space-3) var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.notification-item:hover { background: var(--color-surface-hover); }
.notification-item:last-child { border-bottom: none; }

.notification-content { display: flex; flex-direction: column; gap: var(--space-1); }

.notification-text {
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.notification-time {
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
}

.load-more {
  padding: var(--space-3) var(--space-5);
  text-align: center;
  color: var(--color-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.load-more:hover { background: var(--color-primary-soft); }

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
