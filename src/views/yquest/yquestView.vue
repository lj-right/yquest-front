<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <NavBar />

    <!-- 首页主体内容 -->

    <main class="home-content">
      <!-- 英雄区域 -->
      <section class="hero">
        <div class="hero-text">
          <h1>你的追求,我们的推荐</h1>
          <p>通过内推码快速入职，加速你的职业发展</p>
          <div style="display: flex; justify-content: center">
            <div class="hero-actions">
              <router-link to="/refer" class="hero-btn primary"
                >探索内推机会</router-link
              >
              <router-link to="/login" class="hero-btn secondary"
                >立即注册</router-link
              >
            </div>
          </div>
        </div>
      </section>

      <!-- 特点展示 -->
      <section class="features-section">
        <h2 class="section-title">为什么选择YQuest</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="el-icon-trophy-1"></i>
            </div>
            <h3>快速入职</h3>
            <p>通过内推渠道，平均入职时间缩短30%</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="el-icon-star-off"></i>
            </div>
            <h3>优质机会</h3>
            <p>精选顶级企业未公开的内推岗位</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="el-icon-chat-line-square"></i>
            </div>
            <h3>直接沟通</h3>
            <p>与内部推荐人直接交流，获取一手信息</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="el-icon-lock"></i>
            </div>
            <h3>申请保障</h3>
            <p>内推申请100%直达招聘团队</p>
          </div>
        </div>
      </section>

      <!-- 热门内推职位 -->
      <section class="jobs-section">
        <div class="section-header">
          <h2 class="section-title">热门内推职位</h2>
          <router-link to="/showRefer" class="view-all"
            >查看全部 <i class="fas fa-arrow-right"></i
          ></router-link>
        </div>

        <div class="jobs-grid">
          <div class="job-card">
            <div class="job-header">
              <div class="company-logo">Tencent</div>
              <div class="job-info">
                <h3>高级前端工程师</h3>
                <div class="company-name">腾讯 · 深圳</div>
              </div>
            </div>
            <div class="job-details">
              <div class="job-tag salary">25K-40K</div>
              <div class="job-tag experience">3-5年经验</div>
            </div>
            <div class="job-actions">
              <div class="referral-code">内推码: TXF2025</div>
              <router-link to="/showRefer" class="apply-btn"
                >立即申请
              </router-link>
            </div>
          </div>

          <div class="job-card">
            <div class="job-header">
              <div class="company-logo">Alibaba</div>
              <div class="job-info">
                <h3>Java后端开发</h3>
                <div class="company-name">阿里巴巴 · 杭州</div>
              </div>
            </div>
            <div class="job-details">
              <div class="job-tag salary">28K-45K</div>
              <div class="job-tag experience">5年以上经验</div>
            </div>
            <div class="job-actions">
              <div class="referral-code">内推码: ALJ2025</div>
              <router-link to="/showRefer" class="apply-btn"
                >立即申请
              </router-link>
            </div>
          </div>

          <div class="job-card">
            <div class="job-header">
              <div class="company-logo">Huawei</div>
              <div class="job-info">
                <h3>云计算架构师</h3>
                <div class="company-name">华为 · 深圳</div>
              </div>
            </div>
            <div class="job-details">
              <div class="job-tag salary">35K-60K</div>
              <div class="job-tag experience">8年以上经验</div>
            </div>
            <div class="job-actions">
              <div class="referral-code">内推码: HWC2025</div>
              <router-link to="/showRefer" class="apply-btn"
                >立即申请
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
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
            <a href="#" class="footer-link">首页</a>
            <a href="#" class="footer-link">职位搜索</a>
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
import NavBar from "../../components/NavBar.vue"
export default {
  name: "YuestPage",
  components: { NavBar },
  data() {
    return {
      isLogin: true,
      login: {
        email: "",
        password: "",
      },
      register: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    }
  },
  methods: {
    switchToLogin() {
      this.isLogin = true
    },
    switchToRegister() {
      this.isLogin = false
    },
  },
}
</script>

<style scoped>
/* ── Homepage — Minimalist ────────────────────── */
.home-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-16) var(--space-5);
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--space-24) 0 var(--space-32);
}

.hero-text { max-width: 680px; margin: 0 auto; }

.hero-text h1 {
  font-size: 3rem;
  font-weight: var(--font-bold);
  line-height: 1.15;
  color: var(--color-text-primary);
  margin-bottom: var(--space-5);
  letter-spacing: var(--tracking-tight);
}

.hero-text p {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-10);
  line-height: var(--leading-relaxed);
  font-weight: var(--font-normal);
  letter-spacing: var(--tracking-normal);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
}

.hero-btn {
  padding: 13px 28px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: all var(--transition-base);
  letter-spacing: var(--tracking-normal);
}

.hero-btn.primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.hero-btn.primary:hover {
  background: var(--color-primary-dark);
}

.hero-btn.secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.hero-btn.secondary:hover {
  border-color: var(--color-text-primary);
}

/* Features */
.features-section {
  margin-bottom: var(--space-32);
}

.section-title {
  text-align: center;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-16);
  letter-spacing: var(--tracking-tight);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
}

.feature-card {
  text-align: center;
  padding: var(--space-8) var(--space-6);
  transition: opacity var(--transition-base);
}

.feature-card:hover { opacity: 0.7; }

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-5);
  color: var(--color-text-primary);
  font-size: 22px;
}

.feature-card h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-normal);
}

.feature-card p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* Jobs */
.jobs-section { margin-bottom: var(--space-32); }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-10);
}

.section-header .section-title { margin-bottom: 0; }

.view-all {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-normal);
  transition: color var(--transition-fast);
}

.view-all:hover { color: var(--color-text-primary); }

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.job-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-6) var(--space-5);
  border: 1px solid var(--color-border);
  transition: border-color var(--transition-base);
}

.job-card:hover {
  border-color: var(--color-text-tertiary);
}

.job-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.company-logo {
  width: 48px;
  height: 48px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wide);
}

.job-info h3 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
  color: var(--color-text-primary);
}

.company-name {
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
}

.job-details {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.job-tag {
  padding: 3px var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-normal);
}

.salary {
  background: var(--color-bg);
  color: var(--color-text-secondary);
}

.experience {
  background: var(--color-bg);
  color: var(--color-text-tertiary);
}

.job-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.referral-code {
  color: var(--color-text-tertiary);
  font-weight: var(--font-medium);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-normal);
}

.apply-btn {
  text-decoration: none;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: 7px var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-normal);
  transition: background var(--transition-fast);
}

.apply-btn:hover { background: var(--color-primary-dark); }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .jobs-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .home-content { padding: var(--space-10) var(--space-4); }
  .hero { padding: var(--space-16) 0 var(--space-20); }
  .hero-text h1 { font-size: var(--text-3xl); }
  .hero-text p { font-size: var(--text-base); }
  .hero-actions { flex-direction: column; width: 100%; max-width: 320px; margin: 0 auto; }
  .hero-btn { width: 100%; justify-content: center; }
  .features-grid { grid-template-columns: 1fr; gap: var(--space-8); }
  .jobs-grid { grid-template-columns: 1fr; }
  .section-title { font-size: var(--text-2xl); margin-bottom: var(--space-10); }
  .section-header { flex-direction: column; gap: var(--space-4); text-align: center; }
}
</style>
