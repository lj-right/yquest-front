<template>
  <div class="container-wrapper">
    <el-container>
      <el-header>
        <!-- 导航栏 -->
        <nav class="navbar">
          <div class="navbar-left">
            <button @click="toggleSidebar" class="menu-toggle">
              <i class="el-icon-menu"></i>
            </button>
            <a href="#" class="navbar-brand">
              <router-link to="/yquest" class="brand-logo"
                >YQuest <span>后台管理</span></router-link
              >
            </a>
          </div>
          <div class="nav-actions">
            <NotificationBell />
            <UserMenu />
          </div>
        </nav>
      </el-header>

      <el-container>
        <el-aside width="220px" :class="['sidebar', { 'sidebar-visible': sidebarVisible }]">
          <div class="sidebar-menu">
            <router-link to="/manage/refer" class="menu-item">
              内推审核管理
            </router-link>
            <router-link to="/manage/user" class="menu-item">
              用户管理
            </router-link>
            <router-link to="/manage/circle" class="menu-item">
              交流圈管理
            </router-link>
            <router-link to="/manage/sensitive" class="menu-item">
              敏感词管理
            </router-link>
            <router-link to="/manage/code" class="menu-item">
              试用码管理
            </router-link>
          </div>
        </el-aside>
        <el-main class="main-content"> 
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios"
import UserMenu from '../../components/UserMenu.vue'
import NotificationBell from '../../components/NotificationBell.vue'

export default {
  components: {
    UserMenu,
    NotificationBell
  },
  data() {
    return {
      tableData: [],
      sidebarVisible: false,
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible
    },
    closeSidebar() {
      this.sidebarVisible = false
    },
  },
  mounted() {
    axios
      .post("/api/refer/manageReferPage", {})
      .then((res) => {
        this.tableData = res.data.date.result
      })
  },
}
</script>

<style scoped>
/* ── Admin Layout ─────────────────────────────── */
.container-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.el-container { height: 100%; }

.el-header {
  padding: 0;
  height: var(--navbar-height) !important;
  position: sticky;
  top: 0;
  z-index: 1000;
  overflow: visible;
}

.navbar {
  background: rgba(255, 255, 255, 0.84);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--navbar-height);
  box-sizing: border-box;
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

.navbar-left { display: flex; align-items: center; gap: var(--space-3); }

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.menu-toggle:hover { background: var(--color-bg); }

.nav-actions { gap: var(--space-3); }
.nav-actions > div { gap: var(--space-2); }

/* ── Sidebar ──────────────────────────────────── */
.sidebar {
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  min-height: calc(100vh - var(--navbar-height));
  padding: var(--space-6) 0;
  transition: transform var(--transition-slow);
  position: relative;
  z-index: 1;
  overflow-y: auto;
}

.sidebar-menu { display: flex; flex-direction: column; gap: var(--space-1); padding: 0 var(--space-4); }

.menu-item {
  display: block;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  position: relative;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--color-primary);
  border-radius: 0 3px 3px 0;
  transition: height var(--transition-base);
}

.menu-item:hover {
  background: var(--color-bg);
  color: var(--color-primary);
  padding-left: var(--space-6);
}

.menu-item:hover::before { height: 50%; }

.menu-item.router-link-active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding-left: var(--space-6);
}

.menu-item.router-link-active::before { height: 0; }

/* ── Main content ─────────────────────────────── */
.main-content {
  background: var(--color-bg);
  padding: 0;
  min-height: calc(100vh - var(--navbar-height));
  overflow-x: hidden;
}

.el-main { padding: 0; }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .menu-toggle { display: block; }

  .sidebar {
    position: fixed;
    top: var(--navbar-height); left: 0;
    height: calc(100vh - var(--navbar-height));
    z-index: 1000;
    box-shadow: var(--shadow-xl);
    transform: translateX(-100%);
  }

  .sidebar-visible { transform: translateX(0) !important; }

  .main-content { margin-left: 0; width: 100%; }

  .brand-logo span { display: none; }
}

@media (max-width: 480px) {
  .brand-logo { font-size: var(--text-base); }
  .menu-item { font-size: var(--text-sm); padding: var(--space-3) var(--space-4); }
}
</style>

