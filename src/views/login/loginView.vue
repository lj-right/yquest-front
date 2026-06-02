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
              <div class="logo">Y<span>Quest</span></div>
              <p class="slogan">发现您的职业新机会</p>
              <ul class="features">
                <li><i class="el-icon-check"></i>顶级企业真实内推机会</li>
                <li><i class="el-icon-check"></i> 简历优先进入招聘系统</li>
                <li><i class="el-icon-check"></i> 全程跟踪内推进展</li>
                <li><i class="el-icon-check"></i> 高效直接的沟通渠道</li>
              </ul>
            </div>
          </div>

          <!-- 右侧表单区 -->
          <div class="form-section">
            <!-- 选项卡 -->
            <div class="tabs" v-if="!isForgotPassword">
              <button
                class="tab-btn"
                :class="{ active: isLogin }"
                @click="switchToLogin"
              >
                登录
              </button>
              <button
                class="tab-btn"
                :class="{ active: !isLogin }"
                @click="switchToRegister"
              >
                注册
              </button>
            </div>

            <!-- 表单区域 -->
            <div class="form-container">
              <transition name="fade" mode="out-in">
                <!-- 登录表单 -->
                <div v-if="isLogin && !isForgotPassword" key="login">
                  <h2 class="form-title">欢迎回到 YQuest</h2>

                  <!-- 登录方式切换 -->
                  <div class="login-type-switch">
                    <span 
                      class="login-type-btn" 
                      :class="{ active: !isCodeLogin }"
                      @click="isCodeLogin = false"
                    >
                      密码登录
                    </span>
                    <span class="login-type-divider">|</span>
                    <span 
                      class="login-type-btn" 
                      :class="{ active: isCodeLogin }"
                      @click="isCodeLogin = true"
                    >
                      验证码登录
                    </span>
                  </div>

                  <!-- 密码登录表单 -->
                  <form v-if="!isCodeLogin" @submit.prevent="handleLogin">
                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-message"></i>
                      </div>
                      <input
                        type="email"
                        id="loginEmail"
                        class="form-control"
                        placeholder="请输入邮箱"
                        v-model="login.email"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-lock"></i>
                      </div>
                      <input
                        type="password"
                        id="loginPassword"
                        class="form-control"
                        placeholder="请输入密码"
                        v-model="login.password"
                        required
                      />
                    </div>

                    <div class="forgot-password">
                      <a href="#" @click.prevent="switchToForgotPassword">忘记密码？</a>
                    </div>

                    <button type="submit" class="btn">登 录</button>
                  </form>

                  <!-- 验证码登录表单 -->
                  <form v-else @submit.prevent="handleCodeLogin">
                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-message"></i>
                      </div>
                      <input
                        type="email"
                        id="codeLoginEmail"
                        class="form-control"
                        placeholder="请输入邮箱"
                        v-model="codeLogin.email"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-time"></i>
                      </div>
                      <input
                        type="text"
                        id="codeLoginCode"
                        class="form-control email-code"
                        placeholder="请输入邮箱验证码"
                        v-model="codeLogin.emailCode"
                        required
                      />
                      <button
                        :disabled="isCodeLoginButtonDisabled"
                        type="button"
                        class="send-btn"
                        @click="sendCodeLoginBtn"
                      >
                        {{ isCodeLoginButtonDisabled ? "已发送" : "发送验证码" }}
                      </button>
                    </div>

                    <button type="submit" class="btn">登 录</button>
                  </form>

                  <div class="divider">或通过以下方式登录</div>

                  <div class="social-login">
                    <button
                      type="button"
                      class="social-btn"
                      @click="loginByWx"
                    >
                      <i class="el-icon-full-screen"></i>
                    </button>
                  </div>
                </div>

                <!-- 忘记密码表单 -->
                <div v-else-if="isForgotPassword" key="forgotPassword">
                  <h2 class="form-title">重置密码</h2>
                  <p class="form-subtitle">请输入您的邮箱和验证码，密码将重置为123456</p>

                  <form @submit.prevent="handleForgotPassword">
                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-message"></i>
                      </div>
                      <input
                        type="email"
                        id="forgotEmail"
                        class="form-control"
                        placeholder="请输入邮箱"
                        v-model="forgotPassword.email"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-time"></i>
                      </div>
                      <input
                        type="text"
                        id="forgotEmailCode"
                        class="form-control email-code"
                        placeholder="请输入邮箱验证码"
                        v-model="forgotPassword.emailCode"
                        required
                      />
                      <button
                        :disabled="isForgotButtonDisabled"
                        type="button"
                        class="send-btn"
                        @click="sendForgotCodeBtn"
                      >
                        {{ isForgotButtonDisabled ? "已发送" : "发送验证码" }}
                      </button>
                    </div>

                    <button type="button" class="btn" @click="handleForgotPassword">重置密码</button>

                    <div class="back-to-login">
                      <a href="#" @click.prevent="switchToLogin">返回登录</a>
                    </div>
                  </form>
                </div>

                <!-- 注册表单 -->
                <div v-else key="register">
                  <h2 class="form-title">加入 YQuest</h2>

                  <form>
                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-user"></i>
                      </div>
                      <input
                        type="text"
                        id="registerName"
                        class="form-control"
                        placeholder="请输入用户名"
                        v-model="register.name"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-message"></i>
                      </div>
                      <input
                        type="email"
                        id="registerEmail"
                        class="form-control"
                        placeholder="请输入邮箱"
                        v-model="register.email"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-time"></i>
                      </div>
                      <input
                        type="emailCode"
                        id="sendEail"
                        class="form-control email-code"
                        placeholder="请输入邮箱验证码"
                        v-model="register.emailCode"
                        required
                      />
                      <button
                        :disabled="isButtonDisabled"
                        type="button"
                        class="send-btn"
                        @click="sendCodeBtn"
                      >
                        {{ isButtonDisabled ? "已发送" : "发送验证码" }}
                      </button>
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-lock"></i>
                      </div>
                      <input
                        type="password"
                        id="registerPassword"
                        class="form-control"
                        placeholder="请输入密码(6-20位字符)"
                        v-model="register.password"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <div class="input-icon">
                        <i class="el-icon-lock"></i>
                      </div>
                      <input
                        type="password"
                        id="registerPassword2"
                        class="form-control"
                        placeholder="再次输入密码"
                        v-model="register.confirmPassword"
                        required
                      />
                    </div>

                    <button type="submit" class="btn" @click="registerUser">
                      创建账号
                    </button>
                  </form>
                </div>
              </transition>
            </div>
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
            <a href="/request" class="footer-link">首页</a>
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
        <p>© 2025 YQuest 内推码平台,保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios"
import UserMenu from "../../components/UserMenu.vue"
import NotificationBell from "../../components/NotificationBell.vue"
export default {
  name: "LoginPage",
  components: { UserMenu, NotificationBell },
  data() {
    return {
      isLogin: true,
      isForgotPassword: false,
      isCodeLogin: false,
      login: {
        email: "",
        password: "",
      },
      codeLogin: {
        email: "",
        emailCode: "",
      },
      register: {
        name: "",
        email: "",
        emailCode: "",
        password: "",
        confirmPassword: "",
      },
      forgotPassword: {
        email: "",
        emailCode: "",
      },
      isButtonDisabled: false,
      isForgotButtonDisabled: false,
      isCodeLoginButtonDisabled: false,
    }
  },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  methods: {
    switchToLogin() {
      this.isLogin = true
      this.isForgotPassword = false
    },
    switchToRegister() {
      this.isLogin = false
      this.isForgotPassword = false
    },
    switchToForgotPassword() {
      this.isForgotPassword = true
      this.isLogin = true
    },
    goToRefer() {
      if (!this.$store.state.hasLogin) {
        this.$router.push("/login")
      } else {
        this.$router.push("/refer")
      }
    },
    sendCodeBtn() {
      if (this.isButtonDisabled) return
      axios
        .post("/api/authUser/email/send", {
          email: this.register.email,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.isButtonDisabled = true
            setTimeout(() => {
              this.isButtonDisabled = false
            }, 120 * 1000)
          }
        })
    },
    sendForgotCodeBtn() {
      if (this.isForgotButtonDisabled) return
      if (!this.forgotPassword.email) {
        this.$message.warning("请输入邮箱")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.forgotPassword.email)) {
        this.$message.error("请输入有效的邮箱地址")
        return
      }
      axios
        .post("/api/authUser/email/send", {
          email: this.forgotPassword.email,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success("验证码已发送")
            this.isForgotButtonDisabled = true
            setTimeout(() => {
              this.isForgotButtonDisabled = false
            }, 120 * 1000)
          } else {
            this.$message.error(res.data.message || "发送验证码失败")
          }
        })
        .catch(() => {
          this.$message.error("发送验证码失败")
        })
    },    handleForgotPassword() {
      if (!this.forgotPassword.email || !this.forgotPassword.emailCode) {
        this.$message.warning("请填写邮箱和验证码")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.forgotPassword.email)) {
        this.$message.error("请输入有效的邮箱地址")
        return
      }
      axios
        .post("/api/authUser/auth/forgetPwd", {
          email: this.forgotPassword.email,
          extJson: this.forgotPassword.emailCode,
        })
        .then((res) => {
          if (res.data.code === 200 && !!res.data.date) {
            this.$message.success("密码已重置为123456，请登录后修改密码")
            this.forgotPassword = {
              email: "",
              emailCode: "",
            }
            this.switchToLogin()
          } else {
            this.$message.error("验证码错误，请重新输入")
          }
        })
        .catch(() => {
          this.$message.error("重置密码失败，请稍后重试")
        })
    },
    sendCodeLoginBtn() {
      if (this.isCodeLoginButtonDisabled) return
      if (!this.codeLogin.email) {
        this.$message.warning("请输入邮箱")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.codeLogin.email)) {
        this.$message.error("请输入有效的邮箱地址")
        return
      }
      axios
        .post("/api/authUser/email/sendToLogin", {
          email: this.codeLogin.email,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success("验证码已发送")
            this.isCodeLoginButtonDisabled = true
            setTimeout(() => {
              this.isCodeLoginButtonDisabled = false
            }, 120 * 1000)
          } else {
            this.$message.error(res.data.message || "发送验证码失败")
          }
        })
        .catch(() => {
          this.$message.error("发送验证码失败")
        })
    },
    handleCodeLogin() {
      if (!this.codeLogin.email || !this.codeLogin.emailCode) {
        this.$message.warning("请填写邮箱和验证码")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.codeLogin.email)) {
        this.$message.error("请输入有效的邮箱地址")
        return
      }
      axios
        .post("/api/authUser/auth/captchaToLogin", {
          email: this.codeLogin.email,
          extJson: this.codeLogin.emailCode,
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.date === true) {
            return axios.post("/api/authUser/auth/login", {
              email: this.codeLogin.email,
              extJson: this.codeLogin.emailCode,
              status: 2,
            })
          } else {
            throw new Error("验证码错误或用户不存在")
          }
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            localStorage.setItem("token", res.data.date.tokenValue)
            localStorage.setItem("userEmail", this.codeLogin.email)
            this.$store.commit("setLoginStatus", true)
            this.$store.commit("setEmail", this.codeLogin.email)
            this.fetchUserNickName(this.codeLogin.email)
            this.$message.success({ message: "登录成功", duration: 750 })
            if (this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect)
            } else {
              this.$router.push("/")
            }
          } else {
            this.$message.error(res.data.message || "登录失败")
          }
        })
        .catch((err) => {
          this.$message.error(err.message || "登录失败，请稍后重试")
        })
    },
    getEmailCode() {
      return axios
        .post("/api/authUser/auth/captcha", {
          email: this.register.email,
          extJson: this.register.emailCode,
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            return true;
          }
          return false;
        })
    },
    handleLogin() {
      if (this.login.email && this.login.password) {
        axios
          .post("/api/authUser/auth/login", {
            userName: this.login.email,
            password: this.login.password,
            status: 1,
          })
          .then((res) => {
            if (res.data.code === 200 && res.data.date) {
              localStorage.setItem("token", res.data.date.tokenValue)
              localStorage.setItem("userEmail", this.login.email) // 保存邮箱到 localStorage
              this.$store.commit("setLoginStatus", true)
              this.$store.commit("setEmail", this.login.email)
              // 尝试获取用户昵称
              this.fetchUserNickName(this.login.email)
              this.$message.success({ message: "登录成功", duration: 750 })
              if (this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect)
              } else {
                this.$router.push("/")
              }
            } else {
              this.$message.error("密码错误或用户不存在")
            }
          })
      } else {
        this.$message.warning("请输入邮箱和密码")
      }
    },
    loginByWx() {
      this.$message.info("微信登录功能已被禁用！")
    },
    // 获取用户昵称和头像
    async fetchUserNickName(email) {
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
        console.log('获取用户信息失败，使用邮箱作为名称')
        this.$store.commit('setName', email)
      }
    },
    async registerUser() {
      //预处理表单验证
       const isValid = await this.handleRegister();
       if (!isValid) {
        return;
        }
      //发送注册请求
      axios
        .post("/api/authUser/no-auth/register", {
          nickName: this.register.name,
          email: this.register.email,
          password: this.register.password,
          introduce: "第一次加入YQuest，期待更多机会！",
        })
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            this.$message.success("注册成功")
            // 自动切换到登录页面
            this.isLogin = true

            // 重置注册表单
            this.register = {
              name: "",
              email: "",
              emailCode: "",
              password: "",
              confirmPassword: "",
            }
          } else {
            this.$message.error("该用户已注册，请登录")
          }
        })
    },

    async handleRegister() {
      // 表单验证
      if (
        !this.register.name ||
        !this.register.email ||
        !this.register.emailCode ||
        !this.register.password ||
        !this.register.confirmPassword
      ) {
        this.$message.error("请填写所有必填项")
        return false
      }
      //name长度限制
      if (this.register.name.length < 1 || this.register.name.length > 5) {
        this.$message.error("用户名长度应在1到5个字符之间")
        return false
      }

      // 密码验证
      if (this.register.password !== this.register.confirmPassword) {
        this.$message.error("两次输入的密码不一致！")
        return false
      }

      // 密码复杂度校验
      if (this.register.password.length < 6) {
        this.$message.error("密码长度不能小于6位！")
        return false
      }

      // 邮箱验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.register.email)) {
        this.$message.error("请输入有效的邮箱地址")
        return false
      }
      // 验证码验证
      const isValid = await this.getEmailCode();
      if (!isValid) {
      this.$message.error("验证码错误，请重新输入")
      return false
      }
      return true
    },
    userIsLogin() {
      axios.get("/api/authUser/auth/isLogin").then((res) => {
        this.$store.state.hasLogin = res.data.date
      })
    },

    addFontAwesome() {
      // 检查是否已存在Font Awesome
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href =
          "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        document.head.appendChild(link)
      }
    },
    initBubbles() {
      const bubbles = document.querySelectorAll(".bubble")
      bubbles.forEach((bubble) => {
        // 设置随机动画延迟和持续时间
        const delay = Math.random() * 5
        const duration = 10 + Math.random() * 10

        bubble.style.animationDelay = `${delay}s`
        bubble.style.animationDuration = `${duration}s`
      })
    },
  },
  mounted() {
    // 动态添加Font Awesome图标库
    this.addFontAwesome()

    // 添加气泡动画
    this.initBubbles()

    //刷新登录状态
    this.userIsLogin()
  },
}
</script>

<style scoped>
/* ── Login Page Layout ────────────────────────── */
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
  max-width: 1100px;
  min-height: 600px;
  height: 85vh;
  max-height: 760px;
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

/* ── Brand Section ────────────────────────────── */
.brand-section {
  flex: 1;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.1);
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

.brand-content {
  position: relative;
  z-index: 1;
}

.logo {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-5);
  letter-spacing: -0.5px;
}

.logo span {
  color: #FFD866;
}

.slogan {
  font-size: var(--text-xl);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-8);
  opacity: 0.9;
}

.features {
  list-style: none;
  margin-top: var(--space-8);
}

.features li {
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  opacity: 0.85;
}

.features i {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  margin-right: var(--space-3);
  font-size: 13px;
}

/* ── Form Section ─────────────────────────────── */
.form-section {
  flex: 1;
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-8);
  gap: var(--space-1);
}

.tab-btn {
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-tertiary);
  position: relative;
  transition: color var(--transition-base);
}

.tab-btn.active {
  color: var(--color-primary);
}

.tab-btn::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
  transform: translateX(-50%);
  transition: width var(--transition-base);
}

.tab-btn.active::after {
  width: 60%;
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-6);
  text-align: center;
  color: var(--color-text-primary);
}

.form-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
}

/* Login type switch */
.login-type-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-6);
  gap: var(--space-3);
}

.login-type-btn {
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-base);
}

.login-type-btn:hover {
  color: var(--color-primary);
}

.login-type-btn.active {
  color: var(--color-primary);
  font-weight: var(--font-semibold);
}

.login-type-divider {
  color: var(--color-border);
}

/* Form inputs */
.form-group {
  margin-bottom: var(--space-4);
  position: relative;
}

.input-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  z-index: 1;
}

.form-control {
  width: 100%;
  padding: 13px var(--space-4) 13px 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-text-primary);
  box-shadow: none;
  background: var(--color-surface);
}

.form-control.email-code {
  width: 62%;
  padding-right: var(--space-2);
}

.send-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 var(--space-3);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  white-space: nowrap;
  letter-spacing: var(--tracking-normal);
  transition: background var(--transition-fast);
}

.send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Submit button */
.btn {
  width: 100%;
  padding: 13px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-inverse);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-normal);
  cursor: pointer;
  transition: background var(--transition-fast);
  margin-top: var(--space-2);
}

.btn:hover { background: var(--color-primary-dark); }

/* Divider */
.divider {
  text-align: center;
  position: relative;
  margin: var(--space-8) 0;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 38%;
  height: 1px;
  background: var(--color-border);
}

.divider::before { left: 0; }
.divider::after  { right: 0; }

/* Links */
.forgot-password {
  text-align: right;
  margin-bottom: var(--space-5);
}

.forgot-password a,
.back-to-login a {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.forgot-password a:hover,
.back-to-login a:hover {
  color: var(--color-primary-dark);
}

.back-to-login {
  text-align: center;
  margin-top: var(--space-5);
}

/* Social login */
.social-login {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 18px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.social-btn:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms, transform 200ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 900px) {
  .brand-section {
    display: none;
  }

  .container {
    height: auto;
    max-height: none;
    min-height: auto;
    width: 95%;
    margin: var(--space-5) auto;
  }

  .form-section {
    padding: var(--space-8) var(--space-6);
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: var(--space-6) var(--space-4);
  }

  .form-title {
    font-size: var(--text-xl);
  }

  .tab-btn {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }
}

@media (max-height: 700px) {
  .container {
    height: auto;
    max-height: 95vh;
  }
}
</style>
