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
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.admin-container-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #333;
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
  max-width: 1000px;
  height: 600px;
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.6s ease-out;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, rgb(74, 108, 248) 0%, rgb(90, 103, 216) 100%);
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
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo i {
  font-size: 3rem;
}

.slogan {
  font-size: 1.5rem;
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
  font-size: 1.1rem;
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

.form-container {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.admin-badge {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgb(74, 108, 248) 0%, rgb(90, 103, 216) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(74, 108, 248, 0.3);
}

.admin-badge i {
  font-size: 40px;
  color: white;
}

.form-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  text-align: center;
  color: #2c3e50;
}

.form-subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

/* 输入框图标 */
.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  height: 20px;
  display: flex;
  align-items: center;
}

.form-control {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: rgb(74, 108, 248);
  box-shadow: 0 0 0 3px rgba(74, 108, 248, 0.15);
  transform: translateY(-2px);
}

.form-control[readonly] {
  background-color: #f8f9fa;
  color: #495057;
  cursor: not-allowed;
  border-color: #dee2e6;
}

.form-control[readonly]:focus {
  border-color: #dee2e6;
  box-shadow: none;
  transform: none;
}

.remember-me {
  margin-bottom: 20px;
  color: #7f8c8d;
}

.btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, rgb(74, 108, 248), rgb(90, 103, 216));
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

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(74, 108, 248, 0.4);
}

.back-to-home {
  text-align: center;
  margin-top: 25px;
}

.back-to-home a {
  color: #7f8c8d;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.back-to-home a:hover {
  color: rgb(74, 108, 248);
}

/* 页脚样式 */
.footer {
  background: transparent;
  padding: 20px 5%;
  border-top: none;
  margin-top: auto;
}

.footer-bottom {
  text-align: center;
  color: #94a3b8;
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
}

@media (max-height: 700px) {
  .container {
    height: auto;
    max-height: 95vh;
  }
}
</style>

