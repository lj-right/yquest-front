<template>
  <div class="container-wrapper">
    <!-- 导航栏 -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo">Y<span>Quest</span></router-link>
      </a>

      <div class="nav-links">
        <router-link to="/yquest" class="nav-link">首页</router-link>
        <router-link to="/refer" class="nav-link">内推机会</router-link>
        <router-link to="/refer" class="nav-link">求职交流</router-link>
        <router-link to="/refer" class="nav-link">我要内推</router-link>
        <router-link to="/refer" class="nav-link">关于作者</router-link>
      </div>

      <div class="nav-actions">
        <router-link to="/login" class="nav-btn btn-login">登录</router-link>
        <router-link to="/login" class="nav-btn btn-register">注册</router-link>
      </div>
    </nav>

    <!-- 首页主体内容 -->

    <main class="home-content">
      <!-- 英雄区域 -->
      <section class="hero">
        <div class="hero-text">
          <h1>你的追求,我们的推荐</h1>
          <p>通过内推码快速入职，加速你的职业发展</p>
          <div class="hero-actions">
            <router-link to="/refer" class="hero-btn primary"
              >探索内推机会</router-link
            >
            <router-link to="/login" class="hero-btn secondary"
              >立即注册</router-link
            >
          </div>
        </div>
      </section>

      <!-- 特点展示 -->
      <section class="features-section">
        <h2 class="section-title">为什么选择YQuest</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bolt"></i>
            </div>
            <h3>快速入职</h3>
            <p>通过内推渠道，平均入职时间缩短30%</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-star"></i>
            </div>
            <h3>优质机会</h3>
            <p>精选顶级企业未公开的内推岗位</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-handshake"></i>
            </div>
            <h3>直接沟通</h3>
            <p>与内部推荐人直接交流，获取一手信息</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-shield-alt"></i>
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
          <router-link to="/refer" class="view-all">查看全部 <i class="fas fa-arrow-right"></i></router-link>
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
              <button class="apply-btn">立即申请</button>
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
              <button class="apply-btn">立即申请</button>
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
              <button class="apply-btn">立即申请</button>
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
export default {
  name: "YuestPage",
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
    handleLogin() {
      // 这里实现登录逻辑
      if (this.login.email && this.login.password) {
        console.log("登录信息:", this.login)
        alert(`登录邮箱: ${this.login.email}`)
      } else {
        alert("请输入邮箱和密码")
      }
    },
    handleRegister() {
      // 表单验证
      if (
        !this.register.name ||
        !this.register.email ||
        !this.register.password ||
        !this.register.confirmPassword
      ) {
        alert("请填写所有必填项")
        return
      }

      // 密码验证
      if (this.register.password !== this.register.confirmPassword) {
        alert("两次输入的密码不一致！")
        return
      }

      // 密码复杂度校验
      if (this.register.password.length < 6) {
        alert("密码长度不能小于6位！")
        return
      }

      // 邮箱验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.register.email)) {
        alert("请输入有效的邮箱地址")
        return
      }

      // 这里实现注册逻辑
      console.log("注册信息:", this.register)
      alert(`注册成功: ${this.register.name} (${this.register.email})`)

      // 自动切换到登录页面
      this.isLogin = true

      // 重置注册表单
      this.register = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }
    },
    loadFontAwesome() {
      return new Promise((resolve) => {
        if (document.querySelector('link[href*="font-awesome"]')) {
          resolve();
          return;
        }
        
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
        link.onload = resolve;
        document.head.appendChild(link);
      });
    },
  },
  async mounted() {
    await this.loadFontAwesome();
    this.fontAwesomeLoaded = true;
  }
};
</script>

<style scoped>
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%);
  color: #333;
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

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #4a6cf8;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4a6cf8;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
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

.btn-register {
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  color: white;
  border: none;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 108, 248, 0.3);
}

/* 主体内容 */
.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 英雄区域 */
.hero {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  padding-top:50px;
  padding-left:370px;
  padding-bottom: 80px;
}

.hero-text {
  flex: 1;
}

.hero-text h1 {
  font-size: 2.8rem;
  line-height: 1.2;
  color: #333;
  margin-bottom: 20px;
}

.hero-text p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.hero-actions {
  display: flex;
  gap: 20px;
}

.hero-btn {
  padding: 14px 30px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.hero-btn.primary {
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  color: white;
}

.hero-btn.secondary {
  background: white;
  color: #4a6cf8;
  border: 2px solid #4a6cf8;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 特点区域 */
.features-section {
  margin-bottom: 80px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e4e7ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #4a6cf8;
  font-size: 28px;
  transition: opacity 0.3s ease;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #333;
}

/* 热门职位 */
.jobs-section {
  margin-bottom: 80px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.view-all {
  color: #4a6cf8;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.view-all:hover {
  color: #8a4af8;
  text-decoration: underline;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.job-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(74, 108, 248, 0.15);
}

.job-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.company-logo {
  width: 70px;
  height: 65px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e4e7ff 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: #4a6cf8;
}

.job-info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #333;
}

.company-name {
  color: #666;
  font-size: 0.95rem;
}

.job-details {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.job-tag {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.salary {
  background: #f0f4ff;
  color: #4a6cf8;
}

.experience {
  background: #e6f7ff;
  color: #1890ff;
}

.job-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.referral-code {
  color: #8a4af8;
  font-weight: 500;
  font-size: 0.95rem;
}

.apply-btn {
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.apply-btn:hover {
  background: linear-gradient(to right, #3a5ce6, #7a3ae6);
}

/* 页脚样式 */
.footer {
  background: white;
  padding: 30px 5%;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a6cf8;
  margin-bottom: 15px;
}

.footer-logo span {
  color: #8a4af8;
}

.footer-links {
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #4a6cf8;
}

.footer-bottom {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-links {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }
  
  .hero {
    flex-direction: column;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 901px) and (max-width: 1100px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
