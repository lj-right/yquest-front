<template>
  <div>
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo">Y<span>Quest</span></router-link>
      </a>

      <div class="nav-links">
        <router-link to="/yquest" class="nav-link">首页</router-link>
        <router-link to="/showRefer" class="nav-link">内推机会</router-link>
        <router-link to="/officialRefer" class="nav-link">官方内推</router-link>
        <router-link to="/circle" class="nav-link">求职交流</router-link>
        <router-link to="/refer" class="nav-link">我要内推</router-link>
        <router-link to="/aboutMe" class="nav-link">关于作者</router-link>
      </div>

      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <div :class="['menu-icon', { active: mobileMenuOpen }]">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="nav-actions">
        <div>
          <router-link
            v-if="isAdminUser"
            to="/manage"
            class="nav-btn btn-admin"
          >
            后台管理
          </router-link>
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </nav>

    <div :class="['mobile-menu', { open: mobileMenuOpen }]">
      <div class="mobile-menu-content">
        <router-link to="/yquest" class="mobile-nav-link" @click.native="closeMobileMenu">首页</router-link>
        <router-link to="/officialRefer" class="mobile-nav-link" @click.native="closeMobileMenu">官方内推</router-link>
        <router-link to="/showRefer" class="mobile-nav-link" @click.native="closeMobileMenu">内推机会</router-link>
        <router-link to="/circle" class="mobile-nav-link" @click.native="closeMobileMenu">求职交流</router-link>
        <router-link to="/refer" class="mobile-nav-link" @click.native="closeMobileMenu">我要内推</router-link>
        <router-link to="/aboutMe" class="mobile-nav-link" @click.native="closeMobileMenu">关于作者</router-link>
        <router-link v-if="isAdminUser" to="/manage" class="mobile-nav-link" @click.native="closeMobileMenu">后台管理</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UserMenu from './UserMenu.vue'
import NotificationBell from './NotificationBell.vue'

export default {
  name: 'NavBar',
  components: { UserMenu, NotificationBell },
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  computed: {
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    }
  }
}
</script>

<style>
/* Mobile menu */
.mobile-menu-btn { display: none; cursor: pointer; z-index: 101; }

.menu-icon {
  width: 24px; height: 20px;
  position: relative;
}

.menu-icon span {
  display: block;
  position: absolute;
  height: 2px; width: 100%;
  background: var(--color-text-primary);
  border-radius: 1px;
  left: 0;
  transition: all var(--transition-base);
}

.menu-icon span:nth-child(1) { top: 0; }
.menu-icon span:nth-child(2) { top: 9px; }
.menu-icon span:nth-child(3) { top: 18px; }

.menu-icon.active span:nth-child(1) { top: 9px; transform: rotate(135deg); }
.menu-icon.active span:nth-child(2) { opacity: 0; }
.menu-icon.active span:nth-child(3) { top: 9px; transform: rotate(-135deg); }

.mobile-menu {
  position: fixed;
  top: 0; right: -100%;
  width: 80%; height: 100vh;
  background: var(--color-surface);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-sticky);
  transition: right var(--transition-slow);
  overflow-y: auto;
}

.mobile-menu.open { right: 0; }

.mobile-menu-content {
  padding: 80px var(--space-5) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.mobile-nav-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  transition: color var(--transition-fast);
}

.mobile-nav-link:hover { color: var(--color-primary); }

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: block; }
}
</style>
