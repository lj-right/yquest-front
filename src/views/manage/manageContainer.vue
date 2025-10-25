<template>
  <div class="container-wrapper">
    <el-container>
      <el-header>
        <!-- 导航栏 -->
        <nav class="navbar">
          <a href="#" class="navbar-brand">
            <router-link to="/yquest" class="brand-logo"
              >YQuest <span>后台管理</span></router-link
            >
          </a>
          <div class="nav-actions">
            <div>
              <button @click="handleLogout" class="nav-btn btn-logout">
                <i class="el-icon-switch-button"></i> 退出登录
              </button>
            </div>
          </div>
        </nav>
      </el-header>

      <el-container>
        <el-aside width="220px" class="sidebar">
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
export default {
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除token
        localStorage.removeItem('adminToken')
        localStorage.removeItem('token')
        localStorage.removeItem('rememberAdmin')
        
        this.$message.success('已退出登录')
        this.$router.push('/admin/login')
      }).catch(() => {
        // 取消退出
      })
    }
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
.el-header {
  padding: 0;
  height: auto !important;
}

/* 侧边栏样式 */
.sidebar {
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  min-height: calc(100vh - 60px);
  padding: 30px 0;
  transition: width 0.3s ease;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 20px;
}

.menu-item {
  display: block;
  padding: 16px 20px;
  color: #606266;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  position: relative;
  letter-spacing: 0.3px;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border-radius: 0 3px 3px 0;
  transition: height 0.3s ease;
}

.menu-item:hover {
  background: #f5f7fa;
  color: #4a6cf8;
  padding-left: 24px;
}

.menu-item:hover::before {
  height: 60%;
}

.menu-item.router-link-active {
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 108, 248, 0.25);
  padding-left: 24px;
}

.menu-item.router-link-active::before {
  height: 0;
}

/* 主内容区域 */
.main-content {
  background-color: #f5f7fa;
  padding: 30px;
  min-height: calc(100vh - 60px);
}

.el-main {
  padding: 0;
}
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.container-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  color: #333;
}

.el-container {
  height: 100%;
}

/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 15px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  color: #4a6cf8;
}

.brand-logo span {
  color: #8a4af8;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

.nav-actions > div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-info {
  background: #f0f4ff;
  color: #4a6cf8;
  border: 1px solid #d9e0ff;
  cursor: default;
}

.btn-login {
  background: #f0f4ff;
  color: #4a6cf8;
  border: 1px solid #d9e0ff;
}

.btn-login:hover {
  background: #e4e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 108, 248, 0.15);
}

.btn-logout {
  background: #fff1f0;
  color: #e74c3c;
  border: 1px solid #ffccc7;
  cursor: pointer;
}

.btn-logout:hover {
  background: #ffe4e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.15);
}

.btn-register {
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  color: white;
  border: none;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 108, 248, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .sidebar {
    width: 200px !important;
  }

  .sidebar-menu {
    padding: 0 15px;
  }

  .menu-item {
    font-size: 14px;
    padding: 14px 16px;
  }

  .main-content {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 180px !important;
  }

  .menu-item {
    font-size: 13px;
    padding: 12px 14px;
  }

  .main-content {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .sidebar {
    position: fixed;
    left: -220px;
    top: 60px;
    z-index: 999;
    transition: left 0.3s ease;
  }

  .sidebar.show {
    left: 0;
  }

  .main-content {
    padding: 15px;
    width: 100%;
  }
}
</style>
