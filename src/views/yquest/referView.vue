<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <NavBar />

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
                label="直达链接"
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
import NavBar from "../../components/NavBar.vue"

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
  components: { NavBar },
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
  mounted(){
    this.form.createdBy = this.$store.state.email
  }
}
</script>

<style scoped>
/* ── Referral Form Page ───────────────────────── */
.main-content {
  flex: 1;
  padding: var(--space-10) 2%;
  max-width: 1400px;
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
  margin-bottom: var(--space-3);
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.form-center-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-container {
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;
  max-width: 1100px;
  width: 100%;
}

.inner-form {
  flex: 1;
  min-width: 320px;
  max-width: 740px;
  background: var(--color-surface);
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
  align-items: flex-start;
}

.form-col {
  flex: 1;
  min-width: 240px;
}

.form-col-6 { flex: 0 0 calc(50% - 10px); }
.form-col-12 { flex: 0 0 100%; }

.form-input {
  border-radius: var(--radius-md) !important;
  border-color: var(--color-border) !important;
  transition: all var(--transition-base) !important;
  width: 100% !important;
}

.form-input:focus,
.el-textarea__inner:focus {
  border-color: var(--color-primary) !important;
  box-shadow: 0 0 0 3px rgba(59, 93, 231, 0.1) !important;
}

.form-btn-row { margin-top: var(--space-3); margin-bottom: 0; }

.form-btn-row .el-form-item {
  margin-bottom: 0 !important;
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.submit-btn {
  background: var(--gradient-primary) !important;
  border: none !important;
  padding: var(--space-3) var(--space-6) !important;
  border-radius: var(--radius-md) !important;
  font-size: var(--text-sm) !important;
  font-weight: var(--font-semibold) !important;
  transition: all var(--transition-base) !important;
}

.submit-btn:hover {
  box-shadow: var(--shadow-primary);
  transform: translateY(-1px);
}

.reset-btn {
  padding: var(--space-3) var(--space-6) !important;
  border-radius: var(--radius-md) !important;
  font-size: var(--text-sm) !important;
  font-weight: var(--font-medium) !important;
  color: var(--color-text-secondary) !important;
  border-color: var(--color-border) !important;
  transition: all var(--transition-base) !important;
}

.reset-btn:hover {
  background: var(--color-bg) !important;
  border-color: var(--color-text-tertiary) !important;
}

.form-sidebar {
  flex: 0 0 240px;
}

.form-tips-card {
  background: var(--color-surface);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.tips-title {
  font-size: var(--text-base);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  font-weight: var(--font-semibold);
}

.tips-list {
  list-style: none;
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.tips-list li {
  margin-bottom: var(--space-2);
  padding-left: var(--space-4);
  position: relative;
}

.tips-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  opacity: 0.4;
}

.form-input .el-button--primary {
  color: #fff !important;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .form-container {
    flex-direction: column;
  }

  .form-col-6 { flex: 0 0 100%; }

  .form-sidebar {
    flex: 1;
    width: 100%;
  }

  .main-content { padding: var(--space-6) var(--space-4); }

  .page-header h1 { font-size: var(--text-2xl); }

  .inner-form { padding: var(--space-6) var(--space-4); }

  .form-btn-row .el-form-item {
    flex-direction: column;
    gap: var(--space-2);
  }

  .form-btn-row .el-button {
    width: 100% !important;
  }
}

@media (max-width: 480px) {
  .page-header h1 { font-size: var(--text-xl); }
  .form-col { min-width: 100%; }
}
</style>
