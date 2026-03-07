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
  margin-left: 0;
  margin-right: 8px;
  height: 38px;
}

.bell-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  cursor: pointer;
  color: #C9C9D0;
  font-size: 20px;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.bell-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}



.unread-indicator {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 4.5px;
  height: 4.5px;
  background: #f93232ff;
  border-radius: 50%;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 0.25s ease;
}

.panel-fade-enter {
  opacity: 0;
  transform: translateY(-12px);
}

.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
