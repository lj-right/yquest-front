<template>
  <div class="admin-container-wrapper">
    <!-- 主体内容 -->
    <div class="main-content">
      <div class="center-container">
        <div class="container">
          <!-- 左侧品牌展示区 -->
          <div class="brand-section">
            <!-- 气泡动画容器 -->
            <div class="bubbles">
              <div v-for="i in 10" :key="`bubble-${i}`" class="bubble"></div>
            </div>

            <div class="brand-content">
              <div class="logo">
                <span>YQuest</span>
              </div>
              <p class="slogan">管理员控制台</p>
              <ul class="features">
                <li><i class="el-icon-check"></i> 内推审核管理</li>
                <li><i class="el-icon-check"></i> 用户数据管理</li>
                <li><i class="el-icon-check"></i> 交流圈内容管理</li>
                <li><i class="el-icon-check"></i> 敏感词过滤管理</li>
              </ul>
            </div>
          </div>

          <!-- 右侧登录表单区 -->
          <div class="form-section">
            <div class="form-container">
              <div class="admin-badge">
                <i class="el-icon-user-solid"></i>
              </div>
              <h2 class="form-title">管理员登录</h2>
              <p class="form-subtitle">欢迎使用 YQuest 后台管理系统</p>

              <form @submit.prevent="handleAdminLogin">
                <div class="form-group">
                  <div class="input-icon">
                    <i class="el-icon-message"></i>
                  </div>
                  <input
                    type="email"
                    id="adminEmail"
                    class="form-control"
                    placeholder="请输入管理员邮箱"
                    v-model="adminLogin.email"
                    required
                  />
                </div>

                <div class="form-group">
                  <div class="input-icon">
                    <i class="el-icon-lock"></i>
                  </div>
                  <input
                    type="password"
                    id="adminPassword"
                    class="form-control"
                    placeholder="请输入管理员密码"
                    v-model="adminLogin.password"
                    required
                  />
                </div>

                <div class="remember-me">
                  <el-checkbox v-model="rememberMe">记住登录状态</el-checkbox>
                </div>

                <button type="submit" class="btn">登 录</button>

                <div class="back-to-home">
                  <router-link to="/yquest">
                    <i class="el-icon-back"></i> 返回首页
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-bottom">
        <p>© 2025 YQuest 内推码平台 - 管理员控制台</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios"
export default {
  name: "AdminLoginPage",
  data() {
    return {
      adminLogin: {
        email: "",
        password: "",
      },
      rememberMe: false,
    }
  },
  methods: {
    handleAdminLogin() {
      // 验证邮箱和密码是否已填写
      if (!this.adminLogin.email || !this.adminLogin.password) {
        this.$message.warning("请输入管理员邮箱和密码")
        return
      }

      // 前端验证管理员邮箱
      if (this.adminLogin.email !== "suifeng.king@qq.com") {
        this.$message.error("该邮箱不是管理员账号")
        return
      }

      // 发送登录请求
      axios
        .post("/api/authUser/auth/login", {
          userName: this.adminLogin.email,
          password: this.adminLogin.password,
          status: 1,
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            // 存储管理员token
            localStorage.setItem("adminToken", res.data.date.tokenValue)
            localStorage.setItem("token", res.data.date.tokenValue)
            localStorage.setItem("userEmail", this.adminLogin.email) // 保存邮箱到 localStorage
            
            // 恢复 store 中的登录状态
            this.$store.commit('setLoginStatus', true)
            this.$store.commit('setEmail', this.adminLogin.email)
            
            // 获取用户信息（昵称和头像）
            this.fetchUserInfo(this.adminLogin.email)
            
            // 如果勾选了记住登录状态
            if (this.rememberMe) {
              localStorage.setItem("rememberAdmin", "true")
            }

            this.$message.success({ message: "登录成功", duration: 750 })
            
            // 跳转到后台管理页面
            if (this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect)
            } else {
              this.$router.push("/manage")
            }
          } else {
            this.$message.error("密码错误或管理员账号不存在")
          }
        })
        .catch((error) => {
          console.error("登录失败：", error)
          this.$message.error("登录失败，请稍后重试")
        })
    },
    initBubbles() {
      const bubbles = document.querySelectorAll(".bubble")
      bubbles.forEach((bubble) => {
        const delay = Math.random() * 5
        const duration = 10 + Math.random() * 10
        bubble.style.animationDelay = `${delay}s`
        bubble.style.animationDuration = `${duration}s`
      })
    },
    // 获取用户信息（昵称和头像）
    async fetchUserInfo(email) {
      try {
        const res = await axios.post('/api/authUser/queryByEmail', {
          email: email
        })
        if (res.data && (res.data.success === true || res.data.code === 200)) {
          const user = res.data.date || res.data.data || {}
          // 设置昵称
          if (user.nickName) {
            this.$store.commit('setName', user.nickName)
          } else {
            this.$store.commit('setName', user.userName || email)
          }
          // 设置头像
          const avatar = user.avatar || ''
          if (avatar && 
              typeof avatar === 'string' && 
              avatar !== 'url' && 
              avatar.trim() !== '' &&
              (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
            this.$store.commit('setAvatar', avatar)
          }
        }
      } catch (error) {
        console.log('获取用户信息失败')
      }
    },
  },
  mounted() {
    // 添加气泡动画
    this.initBubbles()

    // 检查是否已经登录
    const adminToken = localStorage.getItem("adminToken")
    if (adminToken) {
      this.$router.push("/manage")
    }
  },
}
</script>

<style scoped>
/* ── Admin Login Page ─────────────────────────── */
.admin-container-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  color: var(--color-text-primary);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-5);
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: var(--content-wide-max);
}

.container {
  width: 100%;
  max-width: 960px;
  min-height: 560px;
  height: 80vh;
  max-height: 680px;
  display: flex;
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  animation: fadeIn 400ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.brand-section {
  flex: 1;
  background: #CA6F1E;
  color: var(--color-text-inverse);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bubbles {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: float 15s infinite ease-in;
}
.bubble:nth-child(1) { width: 40px; height: 40px; left: 10%; }
.bubble:nth-child(2) { width: 25px; height: 25px; left: 20%; animation-delay: 2s; }
.bubble:nth-child(3) { width: 55px; height: 55px; left: 35%; animation-delay: 4s; }
.bubble:nth-child(4) { width: 30px; height: 30px; left: 50%; }
.bubble:nth-child(5) { width: 45px; height: 45px; left: 65%; animation-delay: 1s; }
.bubble:nth-child(6) { width: 35px; height: 35px; left: 80%; animation-delay: 3s; }
.bubble:nth-child(7) { width: 50px; height: 50px; left: 25%; animation-delay: 6s; }
.bubble:nth-child(8) { width: 45px; height: 45px; left: 45%; animation-delay: 8s; }
.bubble:nth-child(9) { width: 30px; height: 30px; left: 70%; animation-delay: 2s; }
.bubble:nth-child(10) { width: 25px; height: 25px; left: 85%; animation-delay: 5s; }

@keyframes float {
  0%   { bottom: -100px; transform: translateX(0) rotate(0deg); }
  50%  { transform: translateX(-20px) rotate(180deg); }
  100% { bottom: 110%; transform: translateX(20px) rotate(360deg); opacity: 0; }
}

.brand-content { position: relative; z-index: 1; }

.logo {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-5);
  letter-spacing: -0.5px;
}

.slogan {
  font-size: var(--text-xl);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-8);
  opacity: 0.85;
}

.features { list-style: none; margin-top: var(--space-8); }

.features li {
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  opacity: 0.8;
}

.features i {
  width: 28px; height: 28px;
  display: flex;
  align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  margin-right: var(--space-3);
  font-size: 13px;
}

.form-section {
  flex: 1;
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-container { max-width: 400px; margin: 0 auto; width: 100%; }

.admin-badge {
  width: 72px; height: 72px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center; justify-content: center;
  margin: 0 auto var(--space-5);
  box-shadow: var(--shadow-primary);
}

.admin-badge i { font-size: 36px; color: var(--color-text-inverse); }

.form-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
  text-align: center;
  color: var(--color-text-primary);
}

.form-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-8);
  font-size: var(--text-sm);
}

.form-group { margin-bottom: var(--space-4); position: relative; }

.input-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  display: flex; align-items: center;
  z-index: 1;
}

.form-control {
  width: 100%;
  padding: 13px var(--space-4) 13px 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg);
  transition: all var(--transition-base);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 93, 231, 0.1);
  background: var(--color-surface);
}

.remember-me { margin-bottom: var(--space-5); }

.btn {
  width: 100%;
  padding: 13px;
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-inverse);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  margin-top: var(--space-2);
}

.btn:hover {
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.back-to-home {
  text-align: center;
  margin-top: var(--space-6);
}

.back-to-home a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.back-to-home a:hover { color: var(--color-primary); }

.footer {
  background: transparent;
  padding: var(--space-5);
  margin-top: auto;
}

.footer-bottom {
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
}

@media (max-width: 900px) {
  .brand-section { display: none; }
  .container { width: 95%; height: auto; margin: var(--space-5) auto; }
  .form-section { padding: var(--space-8) var(--space-6); }
}

@media (max-height: 700px) {
  .container { height: auto; max-height: 95vh; }
}
</style>

