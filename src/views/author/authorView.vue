<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo"
          >Y<span>Quest</span></router-link
        >
      </a>

      <div class="nav-links">
        <router-link to="/yquest" class="nav-link">首页</router-link>
        <router-link to="/showRefer" class="nav-link">内推机会</router-link>
        <router-link to="/circle" class="nav-link">求职交流</router-link>
        <router-link to="/refer" class="nav-link">我要内推</router-link>
        <router-link to="/aboutMe" class="nav-link">关于作者</router-link>
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

    <!-- 作者介绍主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>关于作者</h1>
        <h3>随风</h3>
      </div>
      <div class="contact-info">
        <div><span class="introduce-way">联系方式：</span></div>
        <div class="contact-methods">
          <div class="contact-card">
            <i class="el-icon-message"></i>
            <h4>邮箱</h4>
            <a href="mailto:suifeng.king@qq.com">suifeng.king@qq.com</a>
          </div>

          <div class="contact-card">
            <i class="el-icon-share"></i>
            <h4>Gitee</h4>
            <a href="https://gitee.com/liujiawei_1" target="_blank"
              >Gitee/suifeng</a
            >
          </div>

          <div class="contact-card">
            <i class="el-icon-link"></i>
            <h4>个人博客</h4>
            <a href="https://blog.suifeng1.cn" target="_blank">Blog</a>
          </div>
        </div>
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
import UserMenu from "../../components/UserMenu.vue"
import NotificationBell from "../../components/NotificationBell.vue"
export default {
  name: 'AuthorView',
  components: { UserMenu, NotificationBell },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  }
}
</script>

<style scoped>
/* ── About Author Page ────────────────────────── */
.main-content {
  flex: 1;
  padding: var(--space-10) 5%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.page-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.5px;
}

.page-header h3 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

/* Contacts */
.contact-info { margin-top: var(--space-8); }

.introduce-way {
  font-size: var(--text-lg);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-5);
  display: inline-block;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.contact-card {
  background: var(--color-surface);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  text-align: center;
  transition: all var(--transition-base);
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.contact-card i {
  font-size: 32px;
  margin-bottom: var(--space-4);
  color: var(--color-primary);
}

.contact-card h4 {
  margin-bottom: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.contact-card a {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.contact-card a:hover { color: var(--color-primary-dark); }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .main-content { padding: var(--space-6) var(--space-4); }
  .page-header h1 { font-size: var(--text-2xl); }
  .contact-methods { grid-template-columns: 1fr; }
}
</style>
