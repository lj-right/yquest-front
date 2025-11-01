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

      <div class="nav-actions">
        <div>
          <router-link 
            v-if="isAdminUser" 
            to="/manage" 
            class="nav-btn btn-admin"
          >
            后台管理
          </router-link>
          <UserMenu />
        </div>
      </div>
    </nav>

    <!-- 内推码主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>发起内推</h1>
        <p>发起优质企业的内推码，寻找优质人才</p>
      </div>

      <!-- 表单居中容器 -->
      <div class="form-center-container">
        <!-- 表单容器（多列布局核心） -->
        <div class="form-container">
          <!-- 左侧：表单主体（多列布局） -->
          <el-form
            ref="form"
            :model="form"
            label-width="100px"
            class="inner-form"
            :rules="formRules"
          >
            <!-- 第一行：2列布局（公司信息） -->
            <div class="form-row">
              <el-form-item
                label="公司名称"
                prop="company"
                class="form-col form-col-6"
              >
                <el-input
                  v-model="form.company"
                  placeholder="请输入企业全称（如：阿里巴巴集团）"
                  class="form-input"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="行业"
                prop="industry"
                class="form-col form-col-6"
              >
                <el-select
                  v-model="form.industry"
                  placeholder="请选择所属行业"
                  class="form-input"
                >
                  <el-option label="互联网/IT" value="互联网/IT"></el-option>
                  <el-option label="金融" value="金融"></el-option>
                  <el-option label="电商" value="电商"></el-option>
                  <el-option label="教育" value="教育"></el-option>
                  <el-option label="医疗健康" value="医疗健康"></el-option>
                  <el-option label="其他" value="其他"></el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- 第二行：2列布局（联系人信息） -->
            <div class="form-row">
              <el-form-item
                label="您的姓名"
                prop="name"
                class="form-col form-col-6"
              >
                <el-input
                  v-model="form.name"
                  placeholder="请输入您的真实姓名"
                  class="form-input"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="您的邮箱"
                prop="email"
                class="form-col form-col-6"
              >
                <el-input
                  v-model="form.email"
                  type="email"
                  placeholder="请输入常用邮箱（用于接收审核通知）"
                  class="form-input"
                ></el-input>
              </el-form-item>
            </div>

            <!-- 第三行：1列布局（核心信息） -->
            <div class="form-row">
              <el-form-item
                label="内推码"
                prop="refercode"
                class="form-col form-col-12"
              >
                <el-input
                  v-model="form.refercode"
                  placeholder="请输入有效的内推码/内推链接标识"
                  class="form-input"
                ></el-input>
              </el-form-item>
            </div>

            <!-- 第四行：1列布局（试用码信息） -->
            <div class="form-row">
              <el-form-item
                label="试用码"
                prop="trialCode"
                class="form-col form-col-12"
              >
                <el-input
                  v-model="form.trialCode"
                  placeholder="请输入试用码（请先点击获取）"
                  class="form-input"
                >
                  <el-button
                    slot="append"
                    type="primary"
                    @click="onGetTrialCode"
                    :loading="gettingTrialCode"
                  >
                    获取试用码
                  </el-button>
                </el-input>
              </el-form-item>
            </div>

            <!-- 第五行：1列布局（链接信息） -->
            <div class="form-row">
              <el-form-item
                label="内推直达链接"
                prop="url"
                class="form-col form-col-12"
              >
                <el-input
                  v-model="form.url"
                  type="textarea"
                  rows="2"
                  placeholder="请输入企业内推系统直达链接（如无则填内推码使用说明）"
                  class="form-input"
                ></el-input>
              </el-form-item>
            </div>

            <!-- 第六行：1列布局（选填信息） -->
            <div class="form-row">
              <el-form-item
                label="补充描述"
                prop="description"
                class="form-col form-col-12"
              >
                <el-input
                  v-model="form.description"
                  type="textarea"
                  rows="3"
                  placeholder="可补充内推岗位类型、要求、有效期等信息（选填）"
                  class="form-input"
                ></el-input>
              </el-form-item>
            </div>

            <!-- 按钮行：右对齐 -->
            <div class="form-row form-btn-row">
              <el-form-item class="form-col form-col-12">
                <el-button type="primary" @click="onSubmit" class="submit-btn"
                  >提交审核</el-button
                >
                <el-button @click="resetForm" class="reset-btn">重置</el-button>
              </el-form-item>
            </div>
          </el-form>

          <!-- 右侧：表单说明+辅助信息（固定宽度） -->
          <div class="form-sidebar">
            <!-- 内推须知卡片 -->
            <div class="form-tips-card">
              <h3 class="tips-title">内推提交须知</h3>
              <ul class="tips-list">
                <li>1. 请确保内推码/链接真实有效</li>
                <li>
                  2. 审核结果将在6个工作日内发送至您的个人中心，请留意查收
                </li>
                <li>3. 内推信息有效期默认180天，到期后可重新提交更新</li>
                <li>4. 若需修改已提交的内推信息，请联系处理</li>
              </ul>
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
            <a href="/yquest" class="footer-link">首页</a>
            <a href="/showRefer" class="footer-link">内推机会</a>
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

export default {
  data() {
    return {
      form: {
        company: "",
        refercode: "",
        industry: "",
        name: "",
        email: "",
        sort: 1,
        description: "",
        url: "",
        trialCode: "",
        createdBy: "",
        createdTime: "",
      },
      gettingTrialCode: false,
      // 表单验证规则
      formRules: {
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "公司名称长度需在2-50个字符之间",
            trigger: "blur",
          },
        ],
        refercode: [
          { required: true, message: "请输入内推码", trigger: "blur" },
        ],
        industry: [
          { required: true, message: "请选择行业", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入您的姓名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "姓名长度需在2-20个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入您的邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
        url: [
          {
            required: true,
            message: "请输入内推直达链接或使用说明",
            trigger: "blur",
          },
        ],
        trialCode: [
          { required: true, message: "请输入试用码", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "试用码长度需在3-50个字符之间",
            trigger: "blur",
          },
        ],
      },
    }
  },
  components: { UserMenu },
  methods: {
    // 获取试用码 - 每日仅限一次
    async onGetTrialCode() {
      if (!this.$store.state || !this.$store.state.email) {
        this.$message.warning('请先登录后再获取试用码')
        this.$router.push('/login')
        return
      }

      const email = this.$store.state.email
      const todayKey = `trial_code_date_${email}`
      const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      const lastDate = localStorage.getItem(todayKey)
      if (lastDate === today) {
        this.$message.info('您今天已获取过试用码，请明天再来')
        return
      }

      try {
        this.gettingTrialCode = true
        const res = await axios.post('/api/trialCode/getTrialCode')
        if (res.data && (res.data.success === true || res.data.code === 200)) {
          const code = res.data.date || res.data.data || ''
          if (code) {
            this.form.trialCode = code
            localStorage.setItem(todayKey, today)
            this.$message.success('获取成功，已自动填入试用码')
          } else {
            this.$message.error('未获取到试用码，请稍后重试')
          }
        } else {
          this.$message.error(res.data.message || '获取试用码失败')
        }
      } catch (e) {
        console.error('get trial code error', e)
        this.$message.error('网络异常，获取试用码失败')
      } finally {
        this.gettingTrialCode = false
      }
    },
    async onSubmit() {
      this.$refs.form.validate((isValid) => {
        if (!isValid) {
          this.$message({
            message: "请完善必填项并检查格式",
            type: "warning",
          })
          return false
        }

        // 先消费试用码，再提交内推
        const trialCode = this.form.trialCode
        const payload = { ...this.form }
        delete payload.trialCode

        const now = new Date()
        payload.createdTime = now
          .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          .replace(/[^\\d]/g, "")

        axios
          .post("/api/trialCode/consume", null, { params: { trialCode } })
          .then((consumeRes) => {
            if (
              consumeRes &&
              consumeRes.data &&
              (consumeRes.data === true ||
                consumeRes.data.date === true ||
                consumeRes.data.code === 200)
            ) {
              return axios.post("/api/refer/add", payload)
            }
            const msg =
              (consumeRes && consumeRes.data && consumeRes.data.message) ||
              "试用码无效或已被使用"
            return Promise.reject(new Error(msg))
          })
          .then((res) => {
            if (res.data.code === 200 && res.data.date) {
              this.$message({ message: "提交成功，等待审核", type: "success" })
              this.resetForm()
            } else {
              this.$message({ message: res.data.message || "提交失败，请重试", type: "error" })
            }
          })
          .catch((err) => {
            console.error(err)
            this.$message({ message: err.message || "操作失败，请稍后重试", type: "error" })
          })
      })
    },
    resetForm() {
      this.$refs.form && this.$refs.form.resetFields()
    },
  },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  mounted(){
    this.form.createdBy = this.$store.state.email
  }
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
  padding: 11px 5%; /* 调整padding以配合固定高度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px; /* 固定导航栏高度 */
  box-sizing: border-box;
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
  align-items: center;
  height: 38px; /* 固定高度，与UserMenu高度一致 */
}

.nav-actions > div {
  display: flex;
  align-items: center;
  height: 38px;
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

.btn-admin {
  background: transparent;
  color: #4a6cf8;
  border: none;
  margin-left: -6px;
}


/* 主体内容：控制整体居中 */
.main-content {
  flex: 1;
  padding: 40px 2% ;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 5px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* 表单整体居中容器 */
.form-center-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0 15px;
}

/* 表单核心容器：左侧表单+右侧侧边栏 */
.form-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  max-width: 1300px; /* 限制最大宽度，避免大屏下表单过宽 */
  width: 100%;
}

/* 左侧表单主体：多列布局核心 */
.inner-form {
  flex: 1;
  min-width: 300px;
  max-width: 800px; /* 限制表单最大宽度，提升填写体验 */
  background: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.inner-form:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

/* 表单行：控制每一行的布局 */
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 列之间的间距 */
  margin-bottom: 22px; /* 行之间的间距 */
  align-items: flex-start;
}

/* 表单列：控制列宽（参考Bootstrap栅格） */
.form-col {
  flex: 1;
  min-width: 240px; /* 最小列宽，避免小屏幕下挤压 */
  position: relative;
}

/* 6列（占半宽）和12列（占全宽） */
.form-col-6 {
  flex: 0 0 calc(50% - 10px); /* 50%宽度 - 一半间距（gap/2） */
}

.form-col-12 {
  flex: 0 0 100%; /* 100%宽度 */
}

/* 表单输入框样式优化 */
.form-input {
  border-radius: 8px !important;
  border-color: #e5e6eb !important;
  transition: all 0.3s ease !important;
  height: 44px !important;
  width: 100% !important; /* 确保输入框占满列宽 */
}


.form-input:focus {
  border-color: #8a4af8 !important;
  box-shadow: 0 0 0 2px rgba(138, 74, 248, 0.15) !important;
}

/* 文本域特殊处理 */
.el-textarea.form-input {
  height: auto !important;
  min-height: 100px !important;
  resize: vertical !important; /* 仅允许垂直拉伸 */
}

/* 按钮行：右对齐 */
.form-btn-row {
  margin-top: 10px;
  margin-bottom: 0;
}

.form-btn-row .el-form-item {
  margin-bottom: 0 !important;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

/* 表单按钮样式 */
.submit-btn {
  background: linear-gradient(to right, #4a6cf8, #8a4af8) !important;
  border: none !important;
  padding: 10px 24px !important;
  border-radius: 8px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.submit-btn:hover {
  opacity: 0.95 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(74, 108, 248, 0.3) !important;
}

.reset-btn {
  padding: 10px 24px !important;
  border-radius: 8px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  color: #666 !important;
  border-color: #e5e6eb !important;
  transition: all 0.3s ease !important;
}

.reset-btn:hover {
  background-color: #f9fafb !important;
  border-color: #d1d5db !important;
}

/* 右侧侧边栏：固定宽度，参考大厂表单侧边栏 */
.form-sidebar {
  flex: 0 0 220px; /* 固定宽度，不随屏幕拉伸 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 内推须知卡片 */
.form-tips-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
}

.tips-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-list {
  list-style: none;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.tips-list li {
  margin-bottom: 10px;
  position: relative;
}

/* 页脚样式 */
.footer {
  background: white;
  padding: 50px 5% 20px;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
}

.footer-info {
  flex: 1;
  min-width: 250px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a6cf8;
  margin-bottom: 15px;
  transition: color 0.3s ease;
}

.footer-logo:hover {
  color: #3a5be8;
}

.footer-logo span {
  color: #8a4af8;
}

.footer-info p {
  color: #666;
  line-height: 1.6;
  max-width: 300px;
}

.footer-links-group {
  flex: 0 0 auto;
  min-width: 150px;
}

.footer-links-group h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 18px;
  font-weight: 600;
  position: relative;
  padding-bottom: 8px;
}

.footer-links-group h3::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: #8a4af8;
}

.footer-links {
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.footer-link:hover {
  color: #4a6cf8;
  transform: translateX(3px);
}

.footer-bottom {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* 响应式适配：多列→单列，侧边栏→下方 */
@media (max-width: 1024px) {
  /* 中等屏幕：侧边栏宽度缩小 */
  .form-sidebar {
    flex: 0 0 280px;
  }
}

@media (max-width: 768px) {
  /* 小屏幕：表单+侧边栏纵向排列 */
  .form-container {
    flex-direction: column;
    max-width: 700px;
  }

  /* 小屏幕：多列→单列（取消固定宽度，改为自适应） */
  .form-col-6 {
    flex: 0 0 100%;
  }

  /* 小屏幕：侧边栏宽度自适应 */
  .form-sidebar {
    flex: 1;
    min-width: 300px;
    max-width: 100%;
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
    width: 100%;
  }

  .main-content {
    padding: 30px 15px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .inner-form {
    padding: 25px 20px;
    max-width: 100%;
  }

  /* 小屏幕：按钮纵向排列 */
  .form-btn-row .el-form-item {
    flex-direction: column;
    gap: 10px;
  }

  .form-btn-row .el-button {
    width: 100% !important;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }

  .footer-links-group {
    min-width: 100%;
  }
}

@media (max-width: 480px) {
  .nav-link {
    font-size: 14px;
  }

  .page-header h1 {
    font-size: 1.8rem;
  }

  .form-tips-card,
  .form-help-card {
    padding: 20px 15px;
  }

  .el-form-item {
    margin-bottom: 15px !important;
  }

  .el-form-item__label {
    font-size: 14px !important;
    width: 90px !important;
  }

  /* 超小屏幕：列最小宽度缩小 */
  .form-col {
    min-width: 100%;
  }
}
</style>
