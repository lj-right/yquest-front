<template>
  <div class="container-wrapper">
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

      <div class="nav-actions" v-if="!hasLogin">
        <router-link to="/login" class="nav-btn btn-login">登录</router-link>
        <router-link to="/login" class="nav-btn btn-register">注册</router-link>
      </div>
      <div v-else>
        <router-link to="/login" class="nav-btn btn-register"
          >欢迎{{ nickName }}来到YQuest</router-link
        >
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
            <div class="tabs">
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
                <div v-if="isLogin" key="login">
                  <h2 class="form-title">欢迎回到 YQuest</h2>

                  <form @submit.prevent="handleLogin">
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
                      <a href="#">忘记密码？</a>
                    </div>

                    <button type="submit" class="btn">登 录</button>

                    <div class="divider">或通过以下方式登录</div>

                    <div class="social-login">
                      <button class="social-btn">
                        <i class="el-icon-full-screen"></i>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- 注册表单 -->
                <div v-else key="register">
                  <h2 class="form-title">加入 YQuest</h2>

                  <form @submit.prevent="handleRegister">
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

              <!-- 切换表单提示 -->
              <div class="switch-form">
                <span v-if="isLogin">还没有账号？</span>
                <span v-else>已有账号？</span>
                <a href="#" @click.prevent="isLogin = !isLogin">
                  {{ isLogin ? "立即注册" : "马上登录" }}
                </a>
              </div>
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
export default {
  name: "LoginPage",
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
        emailCode: "",
        password: "",
        confirmPassword: "",
      },
      nickName: "用户", // 昵称
      hasLogin: false, //验证登录状态
      isButtonDisabled: false, //验证码按钮禁用状态
      rightCode: "", // 后端返回的验证码
    }
  },
  methods: {
    switchToLogin() {
      this.isLogin = true
    },
    switchToRegister() {
      this.isLogin = false
    },
    sendCodeBtn() {
      if (this.isButtonDisabled) return // 防止重复点击
      axios
        .post("http://27.106.112.21:5555/authUser/email/send", {
          email: this.register.email,
        })
        .then((res) => {
          if (res.data.code === 200) {
            // 发送后btn禁用2分钟
            this.isButtonDisabled = true // 禁用按钮
            // 模拟异步操作，2秒后恢复按钮可用
            setTimeout(() => {
              this.isButtonDisabled = false
            }, 120 * 1000)
          }
        })
    },
    getEmailCode() {
      axios
        .post("http://27.106.112.21:5555/authUser/auth/captcha", {
          email: this.register.email,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.rightCode = res.data.date
          }
        })
    },
    handleLogin() {
      // 这里实现登录逻辑
      if (this.login.email && this.login.password) {
        axios
          .post("http://27.106.112.21:5555/authUser/auth/login", {
            userName: this.login.email,
            password: this.login.password,
            status: 1,
          })
          .then((res) => {
            if (res.data.code === 200 && res.data.date) {
              localStorage.setItem("token", res.data.date.tokenValue)
              this.hasLogin = true
              alert("登录成功")
            } else {
              alert("密码错误或用户不存在")
            }
          })
      } else {
        alert("请输入邮箱和密码")
      }
    },
    registerUser() {
      axios.post("http://27.106.112.21:5555/authUser/no-auth/register", {
        nickName: this.register.name,
        email: this.register.email,
        password: this.login.password,
        introduce: "第一次加入YQuest，期待更多机会！",
      })
    },

    handleRegister() {
      // 表单验证
      if (
        !this.register.name ||
        !this.register.email ||
        !this.register.emailCode ||
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
      // 验证码验证
      this.getEmailCode
      if (this.register.emailCode.value !== this.rightCode.value) {
        alert("验证码错误，请重新输入")
        return
      }

      // 这里实现注册逻辑
      this.registerUser

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
    userIsLogin() {
      axios.get("http://27.106.112.21:5555/authUser/auth/isLogin").then((res) => {
        this.hasLogin = res.data.date
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
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1400px;
}

.container {
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  max-height: 800px;
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 150, 0.1);
  animation: fadeIn 0.6s ease-out;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  color: white;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 气泡动画容器 */
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
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: float 15s infinite ease-in;
}

.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 17s;
}

.bubble:nth-child(2) {
  width: 25px;
  height: 25px;
  left: 20%;
  animation-delay: 2s;
  animation-duration: 13s;
}

.bubble:nth-child(3) {
  width: 55px;
  height: 55px;
  left: 35%;
  animation-delay: 4s;
  animation-duration: 18s;
}

.bubble:nth-child(4) {
  width: 30px;
  height: 30px;
  left: 50%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.bubble:nth-child(5) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-delay: 1s;
  animation-duration: 19s;
}

.bubble:nth-child(6) {
  width: 35px;
  height: 35px;
  left: 80%;
  animation-delay: 3s;
  animation-duration: 15s;
}

.bubble:nth-child(7) {
  width: 50px;
  height: 50px;
  left: 25%;
  animation-delay: 6s;
  animation-duration: 16s;
}

.bubble:nth-child(8) {
  width: 45px;
  height: 45px;
  left: 45%;
  animation-delay: 8s;
  animation-duration: 14s;
}

.bubble:nth-child(9) {
  width: 30px;
  height: 30px;
  left: 70%;
  animation-delay: 2s;
  animation-duration: 20s;
}

.bubble:nth-child(10) {
  width: 25px;
  height: 25px;
  left: 85%;
  animation-delay: 5s;
  animation-duration: 11s;
}

@keyframes float {
  0% {
    bottom: -100px;
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(-20px) rotate(180deg);
  }
  100% {
    bottom: 1080px;
    transform: translateX(20px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-content {
  position: relative;
  z-index: 1;
}

.logo {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.logo span {
  color: #ffd866;
}

.slogan {
  font-size: 2rem;
  line-height: 1.3;
  margin-bottom: 30px;
}

.features {
  list-style: none;
  margin-top: 30px;
}

.features li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.features i {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: 15px;
  font-size: 14px;
}

.form-section {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.tab-btn {
  padding: 12px 25px;
  font-size: 18px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  position: relative;
  transition: color 0.3s;
}

.tab-btn.active {
  color: #4a6cf8;
}

.tab-btn::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #4a6cf8;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.tab-btn.active::after {
  transform: scaleX(1);
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-title {
  font-size: 1.8rem;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

/* 输入框图标 */
.input-icon {
  position: absolute;
  left: 15px;
  top: 55%;
  transform: translateY(-50%);
  color: #888;
  height: 20px;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
}
.form-control.email-code {
  width: 65%;
  padding-right: 10px;
}
.send-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding: 0 25px;
  background: #4a6cf8;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
}

.form-control:focus {
  outline: none;
  border-color: #4a6cf8;
  box-shadow: 0 0 0 3px rgba(74, 108, 248, 0.15);
  transform: translateY(-2px);
}

.btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.btn:after {
  content: "";
  position: absolute;
  top: -150%;
  left: -250%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transform: rotate(-30deg);
  background: rgba(255, 255, 255, 0.15);
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: btnWave 3s ease infinite;
}

.btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 7px 20px rgba(74, 108, 248, 0.4);
}

@keyframes btnWave {
  0% {
    opacity: 1;
    top: -50%;
    left: -50%;
  }
  100% {
    opacity: 0;
    top: 100%;
    left: 100%;
  }
}

.divider {
  text-align: center;
  position: relative;
  margin: 30px 0;
  color: #888;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #4a6cf8;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.forgot-password a:hover {
  color: #8a4af8;
  text-decoration: underline;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4ff;
  border: 1px solid #ddd;
  color: #4a6cf8;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  background: #e4e7ff;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.switch-form {
  text-align: center;
  margin-top: 30px;
  font-size: 15px;
  color: #666;
}

.switch-form a {
  color: #4a6cf8;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: all 0.3s;
}

.switch-form a:hover {
  color: #8a4af8;
  text-decoration: underline;
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
  .brand-section {
    display: none;
  }

  .container {
    width: 95%;
    height: auto;
    margin: 20px auto;
  }

  .form-section {
    padding: 30px 20px;
  }

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
}

@media (min-width: 901px) and (max-width: 1100px) {
  .brand-section {
    padding: 30px;
  }

  .slogan {
    font-size: 1.6rem;
  }
}

@media (max-height: 700px) {
  .container {
    height: auto;
    max-height: 95vh;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
