<template>
  <div class="notification-bell-container" ref="bellContainer">
    <div class="bell-icon" @click="togglePanel">
    <i class="el-icon-bell"></i>
      <span v-if="hasUnread" class="unread-indicator"></span>
    </div>
    <transition name="panel-fade">
      <NotificationPanel v-if="isPanelOpen" />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NotificationPanel from './NotificationPanel.vue'

export default {
  name: 'NotificationBell',
  components: {
    NotificationPanel
  },
  computed: {
    ...mapState('notification', ['hasUnread', 'isPanelOpen'])
  },
  methods: {
    togglePanel() {
      this.$store.commit('notification/TOGGLE_PANEL')
      if (this.$store.state.notification.isPanelOpen) {
        this.$store.dispatch('notification/fetchNotifications')
        // 点击铃铛后立即清除红点
        this.$store.commit('notification/SET_UNREAD_STATUS', false)
      }
    },
    handleClickOutside(event) {
      if (this.$refs.bellContainer && !this.$refs.bellContainer.contains(event.target)) {
        if (this.isPanelOpen) {
          this.$store.commit('notification/TOGGLE_PANEL', false)
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('notification/fetchUnreadStatus')
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.notification-bell-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.bell-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: var(--color-text-tertiary);
  font-size: 20px;
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);
}

.bell-icon:hover {
  background: var(--color-bg);
  color: var(--color-text-secondary);
}

.unread-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  background: var(--color-danger);
  border-radius: var(--radius-full);
  border: 2px solid var(--color-surface);
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 200ms ease;
}

.panel-fade-enter,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
