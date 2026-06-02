<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo"
          >Y<span>Quest</span></router-link
        >
      </a>

      <!-- 桌面端导航链接 -->
      <div class="nav-links">
        <router-link to="/yquest" class="nav-link">首页</router-link>
        <router-link to="/showRefer" class="nav-link">内推机会</router-link>
        <router-link to="/circle" class="nav-link">求职交流</router-link>
        <router-link to="/refer" class="nav-link">我要内推</router-link>
        <router-link to="/aboutMe" class="nav-link">关于作者</router-link>
      </div>

      <!-- 移动端汉堡菜单按钮 -->
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

    <!-- 移动端菜单 -->
    <div :class="['mobile-menu', { open: mobileMenuOpen }]">
      <div class="mobile-menu-content">
        <router-link to="/yquest" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
        <router-link to="/showRefer" class="mobile-nav-link" @click="closeMobileMenu">内推机会</router-link>
        <router-link to="/circle" class="mobile-nav-link" @click="closeMobileMenu">求职交流</router-link>
        <router-link to="/refer" class="mobile-nav-link" @click="closeMobileMenu">我要内推</router-link>
        <router-link to="/aboutMe" class="mobile-nav-link" @click="closeMobileMenu">关于作者</router-link>
        <router-link v-if="isAdminUser" to="/manage" class="mobile-nav-link" @click="closeMobileMenu">后台管理</router-link>
      </div>
    </div>

    <!-- 内推码主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>内推机会</h1>
        <p>发现优质企业的内推码，加速你的求职之路</p>
      </div>

      <div class="search-section">
        <div class="search-box">
          <el-input
            placeholder="搜索您要查找的公司内推..."
            prefix-icon="Search"
            v-model="searchKeyword"
            @keyup.enter="searchByCompany"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 25px"
            @click="searchByCompany"
          >
            <el-icon class="el-icon-search" style="width: 60px"></el-icon>
          </el-button>
          <el-button type="primary" @click="resetMessage">
            <div style="width: 60px">重置</div>
          </el-button>
        </div>
      </div>

      <div class="refer-cards-container">
        <div 
          v-for="item in tableData" 
          :key="item.id"
          class="refer-card"
          @click="referLink(item.url)"
        >
          <div class="refer-card-header">
            <h3 class="company-name">{{ item.company }}</h3>
          </div>
          <div class="refer-card-info">
            <span class="refer-type">{{ item.industry }}</span>
            <span class="refer-code">{{ item.refercode }}</span>
          </div>
          <div class="refer-card-footer">
            <span class="submitted-by">{{ item.name }}</span>
            <span class="view-btn">查看</span>
          </div>
        </div>
      </div>

      <div class="pagination-container">
        <el-pagination
          :current-page="pageNo"
          :page-size="pageSize"
          :total="this.total"
          @current-change="currentChange"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            YQuest<span>&nbsp;&nbsp;Our Refer</span>
          </div>
          <p>连接优秀人才与顶级企业的内推平台</p>
        </div>

        <div class="footer-links-group">
          <h3>快速链接</h3>
          <div class="footer-links">
            <a href="/yquest" class="footer-link">首页</a>
            <a href="#" class="footer-link">内推机会</a>
            <a href="#" class="footer-link">求职攻略</a>
          </div>
        </div>

        <div class="footer-links-group">
          <h3>支持</h3>
          <div class="footer-links">
            <a href="#" class="footer-link">帮助中心</a>
            <a href="#" class="footer-link">联系我们</a>
            <a href="#" class="footer-link">常见问题</a>
          </div>
        </div>

        <div class="footer-links-group">
          <h3>法律</h3>
          <div class="footer-links">
            <a href="#" class="footer-link">隐私政策</a>
            <a href="#" class="footer-link">使用条款</a>
            <a href="#" class="footer-link">Cookie政策</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 YQuest 内推码平台，保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios"
import UserMenu from "../../components/UserMenu.vue"
import NotificationBell from "../../components/NotificationBell.vue"

export default {
  data() {
    return {
      tableData: [],
      searchKeyword: "",
      pageNo: 1,
      pageSize: 10, // 每页显示条数
      total: '',
      mobileMenuOpen: false
    }
  },
  components: { UserMenu, NotificationBell },
  methods: {
    // 切换移动端菜单
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    // 关闭移动端菜单
    closeMobileMenu() {
      this.mobileMenuOpen = false
    },
    referLink(url) {
      if (url) {
        window.open(url, "_blank") // 新标签页打开
        // 或使用: window.location.href = url; // 当前页跳转
      } else {
        console.warn("无效的URL")
      }
    },
    defaultquery() {
      axios
        .post("/api/refer/queryPage", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.tableData = res.data.date.result
          this.total =  res.data.date.total
        })
    },
    searchByCompany() {
      if (this.searchKeyword.trim() !== "") {
        this.pageNo = 1;
        axios
          .post("/api/refer/searchByMessage", {
            company: this.searchKeyword,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          })
          .then((res) => {
            this.tableData = res.data.date.result
            this.total =  res.data.date.total
          })
          .catch((error) => {
            this.$message.error("搜索请求失败:", error)
            // 可以在这里显示错误提示
          })
      } else {
        this.defaultquery()
      }
    },
    // 点击页码的方法
    currentChange(page) {
      // 确保页码有效
      if (page >= 1) {
        this.pageNo = page
        // 手动触发数据刷新
        if (this.searchKeyword.trim() !== "") {
          this.searchByCompany()
        } else {
          this.defaultquery()
        }
      }
    },
    resetMessage() {
      this.searchKeyword = ""
      this.pageNo = 1
      this.defaultquery()
    },
  },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  mounted() {
    axios
      .post("/api/refer/queryPage", {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      })
      .then((res) => {
        this.tableData = res.data.date.result
        this.total =  res.data.date.total
      })
  },
}
</script>

<style scoped>
/* ── Show Referrals Page ──────────────────────── */
.main-content {
  flex: 1;
  padding: var(--space-8) 5%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.page-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.page-header p {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.search-section {
  margin-bottom: var(--space-8);
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  width: 100%;
  max-width: 640px;
}

/* Cards */
.refer-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
  margin-bottom: var(--space-10);
}

.refer-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
  cursor: pointer;
}

.refer-card:hover {
  border-color: var(--color-text-tertiary);
}

.refer-card-header { margin-bottom: var(--space-3); }

.company-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.refer-card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

.refer-type {
  background: var(--color-bg);
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.refer-code {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.refer-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submitted-by {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.view-btn {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-1) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  transition: background var(--transition-fast);
}

.view-btn:hover {
  box-shadow: var(--shadow-primary);
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: var(--space-5) 0;
}

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

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-menu-btn { display: block; }

  .main-content { padding: var(--space-5) var(--space-4); }

  .search-box {
    flex-direction: column;
    gap: var(--space-3);
  }

  .search-box .el-input { width: 100%; }
  .search-box .el-button { margin-left: 0 !important; width: 100%; }
  .search-box .el-button .el-icon,
  .search-box .el-button div { width: auto !important; }

  .refer-cards-container {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .refer-card { padding: var(--space-5); }
}
</style>
