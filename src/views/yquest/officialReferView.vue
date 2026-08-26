<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <NavBar />

    <!-- 官方内推主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>官方内推</h1>
        <p>平台官方内推流程：浏览职位 → 提交申请 → 简历筛选 → 面试 → Offer → 入职，全程可追踪</p>
      </div>

      <!-- 管理员：仅在后台管理中处理内推，此处仅作提示 -->
      <div v-if="isAdmin" class="admin-tip">
        <el-alert
          title="管理员账号"
          description="内推申请的相关处理请前往后台管理系统进行操作。"
          type="info"
          show-icon
          :closable="false"
        ></el-alert>
        <div class="admin-tip-actions">
          <el-button type="primary" @click="$router.push('/manage')">前往后台管理</el-button>
        </div>
      </div>

      <!-- 求职者 / 招聘者：按角色划分的内推申请 -->
      <el-tabs v-else v-model="activeTab">
        <!-- 职位大厅：展示官方在招职位，可提交内推申请 -->
        <el-tab-pane label="职位大厅" name="jobs">
          <div class="job-filter-bar">
            <el-input
              v-model="jobFilter.jobTitle"
              placeholder="搜索职位名称"
              clearable
              class="job-filter-input"
              @keyup.enter.native="searchJobs"
              @clear="searchJobs"
            ></el-input>
            <el-input
              v-model="jobFilter.companyName"
              placeholder="搜索公司名称"
              clearable
              class="job-filter-input"
              @keyup.enter.native="searchJobs"
              @clear="searchJobs"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchJobs">搜索</el-button>
          </div>

          <div v-loading="jobLoading" class="job-list">
            <div v-for="job in jobs" :key="job.id" class="job-card">
              <div class="job-card-header">
                <div class="job-title-row">
                  <h3 class="job-title">{{ job.jobTitle }}</h3>
                  <el-tag size="small" type="info" v-if="job.jobType">{{ job.jobType }}</el-tag>
                </div>
                <span class="job-salary">{{ salaryText(job) }}</span>
              </div>
              <div class="job-company">
                <i class="el-icon-office-building"></i>
                {{ job.companyName }}<template v-if="job.department"> · {{ job.department }}</template>
              </div>
              <div class="job-tags">
                <el-tag v-if="job.location" size="mini" effect="plain"><i class="el-icon-location-outline"></i> {{ job.location }}</el-tag>
                <el-tag v-if="job.experience" size="mini" effect="plain"><i class="el-icon-time"></i> {{ job.experience }}</el-tag>
                <el-tag v-if="job.education" size="mini" effect="plain"><i class="el-icon-medal"></i> {{ job.education }}</el-tag>
              </div>
              <p v-if="job.description" class="job-desc">{{ job.description }}</p>
              <div class="job-card-footer">
                <span class="job-stats">
                  <i class="el-icon-view"></i> {{ job.viewCount || 0 }} 浏览 · <i class="el-icon-s-order"></i> {{ job.applyCount || 0 }} 人已申请
                </span>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-position"
                  @click="openApplyDialog(job)"
                >申请内推</el-button>
              </div>
            </div>
            <el-empty v-if="!jobLoading && jobs.length === 0" description="暂无在招职位"></el-empty>
          </div>

          <div class="pagination-container">
            <el-pagination
              :current-page="jobPageNo"
              :page-size="jobPageSize"
              :total="jobTotal"
              @current-change="handleJobPageChange"
              layout="total, prev, pager, next"
              background
            />
          </div>
        </el-tab-pane>

        <!-- 我的内推申请（求职者 / 招聘者均可查看） -->
        <el-tab-pane label="我的内推申请" name="my" lazy>
          <ReferApplyPanel type="my" />
        </el-tab-pane>

        <!-- 我收到的内推申请（仅招聘者可查看并处理） -->
        <el-tab-pane v-if="isRecruiter" label="我收到的申请" name="referrer" lazy>
          <ReferApplyPanel type="referrer" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 申请内推弹窗 -->
    <el-dialog title="申请内推" :visible.sync="applyDialogVisible" width="560px" :close-on-click-modal="false">
      <div v-loading="applyLoading" class="apply-dialog-body">
        <!-- 职位摘要 -->
        <div v-if="currentJob" class="apply-job-summary">
          <h4>{{ currentJob.jobTitle }}</h4>
          <p>
            {{ currentJob.companyName }}<template v-if="currentJob.location"> · {{ currentJob.location }}</template>
            <template v-if="currentJob.experience"> · {{ currentJob.experience }}</template>
          </p>
        </div>

        <el-form label-width="90px">
          <el-form-item label="内推码" required>
            <el-select v-model="applyForm.referId" placeholder="请选择内推码" style="width: 100%" :disabled="applyLoading">
              <el-option
                v-for="r in referOptions"
                :key="r.id"
                :label="`${r.company}（${r.refercode || '-'}）· ${r.name || '官方'}`"
                :value="r.id"
              ></el-option>
            </el-select>
            <div v-if="!applyLoading && referOptions.length === 0" class="form-tip">
              未找到该公司对应的内推码，请联系平台补充
            </div>
          </el-form-item>

          <el-form-item label="上传简历" required>
            <el-upload
              class="resume-uploader"
              action=""
              :auto-upload="false"
              :limit="1"
              accept=".pdf,.doc,.docx,.md,.html"
              :file-list="resumeFileList"
              :on-change="onResumeFileChange"
              :on-remove="onResumeFileRemove"
              :on-exceed="handleResumeExceed"
            >
              <el-button v-if="resumeFileList.length === 0" size="small" type="primary" plain icon="el-icon-upload2">
                选择简历文件
              </el-button>
              <div slot="tip" class="form-tip">支持 PDF / Word / Markdown，大小不超过 10MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitApply">提交申请</el-button>
      </span>
    </el-dialog>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            YQuest<span>&nbsp;&nbsp;Our Refer</span>
          </div>
          <p>连接优秀人才与顶级企业的内推平台</p>
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
import ReferApplyPanel from "../../components/ReferApplyPanel.vue"

export default {
  name: "OfficialReferView",
  components: { NavBar, ReferApplyPanel },
  data() {
    return {
      activeTab: "jobs",
      // 职位大厅
      jobs: [],
      jobPageNo: 1,
      jobPageSize: 9,
      jobTotal: 0,
      jobLoading: false,
      jobFilter: {
        jobTitle: "",
        companyName: "",
      },
      // 申请内推弹窗
      applyDialogVisible: false,
      applyLoading: false,
      submitting: false,
      currentJob: null,
      referOptions: [],
      userInfo: null, // 当前登录用户信息（上传简历所需）
      resumeFileList: [], // 待上传的简历文件
      applyForm: {
        referId: null,
      },
    }
  },
  computed: {
    roles() {
      return this.$store.state.roles || []
    },
    // 管理员：内推申请处理统一在后台管理完成
    isAdmin() {
      return this.roles.includes("manage_user")
    },
    // 招聘者（企业招聘）：可查看并处理收到的内推申请
    isRecruiter() {
      return this.roles.includes("recruiter_user")
    },
  },
  methods: {
    // ── 职位大厅 ──────────────────────────────
    // 加载已发布职位（job 表 status=1）
    loadJobs() {
      this.jobLoading = true
      const params = {
        pageNo: this.jobPageNo,
        pageSize: this.jobPageSize,
        status: 1, // 仅展示已发布职位
      }
      if (this.jobFilter.jobTitle) {
        params.jobTitle = this.jobFilter.jobTitle.trim()
      }
      if (this.jobFilter.companyName) {
        params.companyName = this.jobFilter.companyName.trim()
      }
      axios
        .post("/api/job/queryPage", params)
        .then((res) => {
          this.jobLoading = false
          if (res.data.success) {
            this.jobs = res.data.date.result || []
            this.jobTotal = res.data.date.total || 0
          } else {
            this.$message.error(res.data.message || "查询职位失败")
          }
        })
        .catch(() => {
          this.jobLoading = false
          this.$message.error("查询职位失败，请稍后重试")
        })
    },
    searchJobs() {
      this.jobPageNo = 1
      this.loadJobs()
    },
    handleJobPageChange(page) {
      this.jobPageNo = page
      this.loadJobs()
    },
    // 薪资展示
    salaryText(job) {
      const min = job.salaryMin ? Number(job.salaryMin) : null
      const max = job.salaryMax ? Number(job.salaryMax) : null
      if (min && max) return `${min / 1000}K-${max / 1000}K`
      if (min) return `${min / 1000}K 起`
      if (max) return `最高 ${max / 1000}K`
      return "面议"
    },
    // ── 申请内推 ──────────────────────────────
    // 打开申请弹窗：并行加载该公司内推码 + 当前用户信息
    openApplyDialog(job) {
      this.currentJob = job
      this.applyForm.referId = null
      this.referOptions = []
      this.userInfo = null
      this.resumeFileList = []
      this.applyDialogVisible = true
      this.applyLoading = true
      Promise.all([this.loadReferOptions(job), this.loadUserInfo()])
        .catch(() => {})
        .finally(() => {
          this.applyLoading = false
        })
    },
    // 加载该公司对应的内推码（公司名模糊匹配；搜不到时回退全量内推码）
    loadReferOptions(job) {
      return axios
        .post("/api/refer/searchByMessage", {
          company: job.companyName,
          pageNo: 1,
          pageSize: 50,
        })
        .then((res) => {
          if (res.data.success) {
            const list = res.data.date.result || []
            if (list.length > 0) {
              this.referOptions = list
              return
            }
            // 该公司无内推码，回退展示全部内推码
            return axios.post("/api/refer/queryPage", { pageNo: 1, pageSize: 50 }).then((res2) => {
              if (res2.data.success) {
                this.referOptions = res2.data.date.result || []
              }
            })
          }
        })
        .catch(() => {
          this.$message.error("查询内推码失败")
        })
    },
    // 加载当前登录用户信息（上传简历时需要 userId/姓名/电话）
    loadUserInfo() {
      const email = this.$store.state.email
      if (!email) {
        return Promise.resolve()
      }
      return axios
        .post("/api/authUser/queryByEmail", { email })
        .then((res) => {
          if (res.data.success && res.data.date) {
            this.userInfo = res.data.date
          }
        })
        .catch(() => {
          this.$message.error("获取用户信息失败")
        })
    },
    // ── 简历文件选择 ──────────────────────────
    onResumeFileChange(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$message.error("简历文件不能超过 10MB")
        this.resumeFileList = []
        return
      }
      this.resumeFileList = [file]
    },
    onResumeFileRemove() {
      this.resumeFileList = []
    },
    handleResumeExceed() {
      this.$message.warning("只能上传一份简历文件，如需更换请先移除已选文件")
    },
    // 提交内推申请：先上传简历，再用新简历ID提交申请
    submitApply() {
      if (!this.applyForm.referId) {
        this.$message.warning("请选择内推码")
        return
      }
      if (this.resumeFileList.length === 0) {
        this.$message.warning("请选择要上传的简历文件")
        return
      }
      if (!this.userInfo || !this.userInfo.id) {
        this.$message.error("未获取到用户信息，请关闭弹窗后重试")
        return
      }
      this.submitting = true
      // 1. 上传简历
      const formData = new FormData()
      formData.append("file", this.resumeFileList[0].raw)
      formData.append("jobId", this.currentJob.id)
      formData.append("userId", this.userInfo.id)
      formData.append("userName", this.userInfo.userName || this.userInfo.nickName || "")
      
      formData.append("userEmail", this.$store.state.email || "")
      formData.append("userPhone", this.userInfo.phone || "")
      axios
        .post("/api/resume/upload", formData)
        .then((res) => {
          if (!res.data.success || !res.data.date) {
            this.submitting = false
            this.$message.error(res.data.message || "简历上传失败")
            return
          }
          const resumeId = res.data.date
          // 2. 用新简历ID提交内推申请
          return axios
            .post("/api/refer/apply/save", {
              referId: this.applyForm.referId,
              jobId: this.currentJob.id,
              resumeId: resumeId,
            })
            .then((res2) => {
              this.submitting = false
              if (res2.data.success) {
                this.$message.success("内推申请提交成功，可在「我的内推申请」中查看进度")
                this.applyDialogVisible = false
                // 刷新职位申请数并跳转到我的申请
                this.loadJobs()
                this.activeTab = "my"
              } else {
                // 后端返回可读错误文案（如重复投递），直接展示
                this.$message.error(res2.data.message || "提交失败")
              }
            })
        })
        .catch(() => {
          this.submitting = false
          this.$message.error("提交失败，请稍后重试")
        })
    },
  },
  mounted() {
    // 拉取当前用户角色，用于按角色划分显示内容（未登录时由路由守卫拦截）
    this.$store.dispatch("fetchRoles")
    // 加载职位列表
    this.loadJobs()
  },
}
</script>

<style scoped>
/* ── Official Refer Page ──────────────────────── */
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

/* 管理员提示 */
.admin-tip {
  max-width: 560px;
  margin: 0 auto;
}

.admin-tip-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-5);
}

/* ── 职位大厅 ─────────────────────────────────── */
.job-filter-bar {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.job-filter-input {
  width: 220px;
}

.job-list {
  min-height: 200px;
}

.job-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  transition: all var(--transition-base);
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
}

.job-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.job-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.job-salary {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  white-space: nowrap;
}

.job-company {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.job-tags {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-top: var(--space-3);
}

.job-desc {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.job-stats {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

/* ── 申请内推弹窗 ─────────────────────────────── */
.apply-job-summary {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5);
}

.apply-job-summary h4 {
  margin: 0 0 var(--space-1);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.apply-job-summary p {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.form-tip {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

.resume-uploader {
  width: 100%;
}

.resume-uploader >>> .el-upload-list__item {
  transition: none;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: var(--space-5) 0;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .main-content {
    padding: var(--space-5) var(--space-4);
  }

  .job-filter-bar {
    flex-direction: column;
  }

  .job-filter-input {
    width: 100%;
  }

  .job-card-header {
    flex-direction: column;
  }
}
</style>
