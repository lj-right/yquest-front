<template>
  <div class="refer-apply-panel">
    <div class="filter-bar">
      <el-select
        v-model="statusFilter"
        placeholder="全部状态"
        clearable
        @change="loadApplies"
      >
        <el-option
          v-for="(desc, code) in statusMap"
          :key="code"
          :label="desc"
          :value="Number(code)"
        ></el-option>
      </el-select>
    </div>

    <!-- 我的内推申请（求职者视角） -->
    <el-table v-if="type === 'my'" :data="applies" v-loading="loading" style="width: 100%">
      <el-table-column prop="jobTitle" label="职位" min-width="140"></el-table-column>
      <el-table-column prop="companyName" label="公司" min-width="120"></el-table-column>
      <el-table-column label="当前状态" width="130">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.currentStatus)" size="small">
            {{ scope.row.currentStatusDesc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="160">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template slot-scope="scope">
          <!-- 求职者操作按钮（按状态矩阵） -->
          <el-button
            v-if="[0, 3, 4, 5, 6].includes(scope.row.currentStatus)"
            size="mini"
            type="danger"
            plain
            @click="onAdvance(scope.row, 'WITHDRAW', '确认撤回该内推申请？撤回后不可重新投递该职位。')"
          >撤回</el-button>
          <el-button
            v-if="scope.row.currentStatus === 7"
            size="mini"
            type="primary"
            @click="onAdvance(scope.row, 'ACCEPT_OFFER', '确认接受该Offer？')"
          >接受Offer</el-button>
          <el-button
            v-if="scope.row.currentStatus === 7"
            size="mini"
            type="danger"
            plain
            @click="onAdvance(scope.row, 'DECLINE_OFFER', '确认拒绝该Offer？')"
          >拒绝Offer</el-button>
          <el-button
            size="mini"
            plain
            icon="el-icon-document"
            @click="viewResume(scope.row)"
          >查看简历</el-button>
          <el-button
            size="mini"
            plain
            @click="showFlowRecords(scope.row)"
          >查看进度</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 我收到的内推申请（内推人视角） -->
    <el-table v-else :data="applies" v-loading="loading" style="width: 100%">
      <el-table-column prop="jobSeekerName" label="求职者" width="100"></el-table-column>
      <el-table-column prop="jobSeekerEmail" label="邮箱" min-width="150"></el-table-column>
      <el-table-column prop="jobTitle" label="职位" min-width="130"></el-table-column>
      <el-table-column prop="companyName" label="公司" min-width="110"></el-table-column>
      <el-table-column label="当前状态" width="130">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.currentStatus)" size="small">
            {{ scope.row.currentStatusDesc }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="160">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createdTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <!-- 内推人操作按钮（按状态矩阵） -->
          <el-button
            v-if="scope.row.currentStatus === 0"
            size="mini"
            type="primary"
            @click="onAdvance(scope.row, 'ACCEPT', null)"
          >受理</el-button>
          <el-button
            v-if="scope.row.currentStatus === 0"
            size="mini"
            type="danger"
            plain
            @click="onAdvanceWithReason(scope.row, 'REJECT', '拒绝申请')"
          >拒绝</el-button>
          <el-button
            v-if="scope.row.currentStatus === 3"
            size="mini"
            type="primary"
            @click="onAdvance(scope.row, 'SCREEN_PASS', null)"
          >简历通过</el-button>
          <el-button
            v-if="scope.row.currentStatus === 3"
            size="mini"
            type="danger"
            plain
            @click="onAdvanceWithReason(scope.row, 'SCREEN_REJECT', '简历不通过')"
          >简历不通过</el-button>
          <el-button
            v-if="[4, 5, 6].includes(scope.row.currentStatus)"
            size="mini"
            type="primary"
            @click="onAdvance(scope.row, 'INTERVIEW_PASS', null)"
          >面试通过</el-button>
          <el-button
            v-if="[4, 5, 6].includes(scope.row.currentStatus)"
            size="mini"
            type="danger"
            plain
            @click="onAdvanceWithReason(scope.row, 'INTERVIEW_FAIL', '面试未通过')"
          >面试未通过</el-button>
          <el-button
            v-if="scope.row.currentStatus === 8"
            size="mini"
            type="success"
            @click="onAdvance(scope.row, 'CONFIRM_ONBOARD', '确认该求职者已入职？')"
          >确认入职</el-button>
          <el-button
            v-if="scope.row.currentStatus === 10"
            size="mini"
            type="success"
            @click="onAdvance(scope.row, 'PROBATION_PASS', '确认试用期通过？')"
          >试用期通过</el-button>
          <el-button
            v-if="scope.row.currentStatus === 10"
            size="mini"
            type="danger"
            plain
            @click="onAdvanceWithReason(scope.row, 'PROBATION_FAIL', '试用期未通过')"
          >试用期未通过</el-button>
          <el-button
            size="mini"
            plain
            icon="el-icon-document"
            @click="viewResume(scope.row)"
          >查看简历</el-button>
          <el-button
            size="mini"
            plain
            @click="showFlowRecords(scope.row)"
          >查看进度</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="total, prev, pager, next"
        background
      />
    </div>

    <!-- 拒绝原因输入弹窗 -->
    <el-dialog :title="reasonDialogTitle" :visible.sync="reasonDialogVisible" width="420px" append-to-body>
      <el-input
        type="textarea"
        :rows="3"
        v-model="reasonInput"
        placeholder="请填写原因（必填）"
        maxlength="255"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reasonDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="advancing" @click="confirmAdvanceWithReason">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 流转记录时间线弹窗 -->
    <el-dialog title="申请进度" :visible.sync="flowDialogVisible" width="560px" append-to-body>
      <div v-loading="flowLoading">
        <el-timeline v-if="flowRecords.length > 0">
          <el-timeline-item
            v-for="record in flowRecords"
            :key="record.id"
            :timestamp="formatTime(record.createdTime)"
            :type="timelineItemType(record)"
          >
            <div class="flow-title">
              <span class="flow-status">{{ record.toStatusDesc }}</span>
              <span class="flow-event">{{ eventDesc(record.event) }}</span>
            </div>
            <div class="flow-meta">
              操作人：{{ record.operatorName || '-' }}
              <template v-if="record.operatorRole">（{{ roleDesc(record.operatorRole) }}）</template>
            </div>
            <div v-if="record.remark" class="flow-remark">备注：{{ record.remark }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无流转记录"></el-empty>
      </div>
    </el-dialog>

    <!-- 简历详情弹窗 -->
    <el-dialog title="简历详情" :visible.sync="resumeDialogVisible" width="560px" append-to-body>
      <div v-loading="resumeLoading">
        <template v-if="resumeDetail">
          <div class="resume-file-box">
            <i class="el-icon-document resume-file-icon"></i>
            <div class="resume-file-info">
              <div class="resume-file-name">{{ resumeDetail.resumeFileName || '未命名简历' }}</div>
              <div class="resume-file-meta">上传时间：{{ formatTime(resumeDetail.createdTime) }}</div>
            </div>
            <el-button
              v-if="resumeDetail.resumeFileUrl"
              type="primary"
              size="small"
              icon="el-icon-view"
              @click="openResumeFile()"
            >打开文件</el-button>
          </div>
          <el-descriptions :column="1" border size="medium" class="resume-desc">
            <el-descriptions-item label="求职者">{{ resumeDetail.userName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ resumeDetail.userEmail || '-' }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ resumeDetail.userPhone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="自我介绍">{{ resumeDetail.selfIntroduction || '暂无' }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <el-empty v-else-if="!resumeLoading" description="简历不存在或已被删除"></el-empty>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resumeDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"

// 状态码 -> 描述（与接口文档 3.1 一致）
const STATUS_MAP = {
  0: "已提交待确认",
  3: "简历筛选",
  4: "初试",
  5: "复试",
  6: "终试",
  7: "已发Offer",
  8: "已接受Offer",
  10: "已入职",
  11: "试用期通过",
  2: "被拒绝",
  9: "已拒绝Offer",
  12: "试用期未通过",
  13: "已撤回",
}

// 事件名 -> 中文描述（与接口文档 3.2 一致）
const EVENT_DESC = {
  submit: "提交申请",
  withdraw: "撤回申请",
  accept: "受理申请",
  reject: "拒绝申请",
  screen_pass: "简历通过",
  screen_reject: "简历不通过",
  interview_pass: "面试通过",
  interview_fail: "面试未通过",
  accept_offer: "接受Offer",
  decline_offer: "拒绝Offer",
  confirm_onboard: "确认入职",
  probation_pass: "试用期通过",
  probation_fail: "试用期未通过",
}

// 角色标识 -> 中文描述
const ROLE_DESC = {
  jobseek_user: "求职者",
  recruiter_user: "内推人",
  manage_user: "管理员",
}

/**
 * 内推申请面板（可复用）
 * type = "my"        求职者：我的内推申请
 * type = "referrer"  内推人：我收到的申请（含处理操作）
 */
export default {
  name: "ReferApplyPanel",
  props: {
    type: {
      type: String,
      default: "my",
      validator: (val) => ["my", "referrer"].includes(val),
    },
  },
  data() {
    return {
      statusMap: STATUS_MAP,
      applies: [],
      pageNo: 1,
      total: 0,
      statusFilter: null,
      loading: false,
      pageSize: 10,
      // 状态流转
      advancing: false,
      // 拒绝原因弹窗
      reasonDialogVisible: false,
      reasonDialogTitle: "",
      reasonInput: "",
      pendingApply: null,
      pendingEvent: null,
      // 流转记录弹窗
      flowDialogVisible: false,
      flowLoading: false,
      flowRecords: [],
      // 简历详情弹窗
      resumeDialogVisible: false,
      resumeLoading: false,
      resumeDetail: null,
    }
  },
  computed: {
    apiUrl() {
      return this.type === "my" ? "/api/refer/apply/getMyApplies" : "/api/refer/apply/getReferrerApplies"
    },
  },
  methods: {
    // 加载申请列表
    loadApplies() {
      this.loading = true
      const params = {
        pageInfo: { pageNo: this.pageNo, pageSize: this.pageSize },
      }
      if (this.statusFilter !== null && this.statusFilter !== "") {
        params.currentStatus = this.statusFilter
      }
      axios
        .post(this.apiUrl, params)
        .then((res) => {
          this.loading = false
          if (res.data.success) {
            this.applies = res.data.date.result || []
            this.total = res.data.date.total || 0
          } else {
            this.$message.error(res.data.message || "查询失败")
          }
        })
        .catch(() => {
          this.loading = false
          this.$message.error(this.type === "my" ? "查询我的内推申请失败" : "查询收到的内推申请失败")
        })
    },
    handlePageChange(page) {
      this.pageNo = page
      this.loadApplies()
    },
    // 无需填原因的操作（可带确认提示）
    onAdvance(row, event, confirmText) {
      const doAdvance = () => this.doAdvance(row, event, null)
      if (confirmText) {
        this.$confirm(confirmText, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(doAdvance)
          .catch(() => {})
      } else {
        doAdvance()
      }
    },
    // 需要填原因的操作（拒绝类）
    onAdvanceWithReason(row, event, title) {
      this.pendingApply = row
      this.pendingEvent = event
      this.reasonDialogTitle = title
      this.reasonInput = ""
      this.reasonDialogVisible = true
    },
    confirmAdvanceWithReason() {
      if (!this.reasonInput || this.reasonInput.trim() === "") {
        this.$message.warning("请填写原因")
        return
      }
      this.doAdvance(this.pendingApply, this.pendingEvent, this.reasonInput.trim())
    },
    // 调用统一流转接口
    doAdvance(row, event, remark) {
      this.advancing = true
      axios
        .post("/api/refer/apply/advance", {
          applyId: row.id,
          event: event,
          remark: remark,
        })
        .then((res) => {
          this.advancing = false
          if (res.data.success) {
            this.$message.success("操作成功")
            this.reasonDialogVisible = false
            this.loadApplies()
            // 通知其它面板刷新（如求职者与内推人视角同时打开时）
            this.$emit("advanced")
          } else {
            // 后端返回的可读错误文案直接展示
            this.$message.error(res.data.message || "操作失败")
          }
        })
        .catch(() => {
          this.advancing = false
          this.$message.error("操作失败，请稍后重试")
        })
    },
    // 查询流转记录时间线
    showFlowRecords(row) {
      this.flowDialogVisible = true
      this.flowLoading = true
      this.flowRecords = []
      axios
        .post("/api/refer/apply/getFlowRecords", { applyId: row.id })
        .then((res) => {
          this.flowLoading = false
          if (res.data.success) {
            this.flowRecords = res.data.date || []
          } else {
            this.$message.error(res.data.message || "查询失败")
          }
        })
        .catch(() => {
          this.flowLoading = false
          this.$message.error("查询流转记录失败")
        })
    },
    // 查看简历详情（我的申请 / 收到的申请均可查看）
    viewResume(row) {
      if (!row.resumeId) {
        this.$message.warning("该申请未关联简历")
        return
      }
      this.resumeDialogVisible = true
      this.resumeLoading = true
      this.resumeDetail = null
      axios
        .get(`/api/resume/${row.resumeId}`)
        .then((res) => {
          this.resumeLoading = false
          if (res.data.success) {
            this.resumeDetail = res.data.date
          } else {
            this.$message.error(res.data.message || "查询简历失败")
          }
        })
        .catch(() => {
          this.resumeLoading = false
          this.$message.error("查询简历失败")
        })
    },
    // 打开简历文件：私有桶文件需先获取预签名URL（临时授权，1小时内有效；PDF 直接预览，Word 等触发下载）
    async openResumeFile() {
      const loading = this.$loading({ lock: true, text: "获取文件链接中...", background: "rgba(0, 0, 0, 0.7)" })
      try {
        const res = await axios.post("/api/resume/getDownloadUrl", { id: this.resumeDetail.id })
        if (res.data.success && res.data.date) {
          window.open(res.data.date, "_blank")
        } else {
          this.$message.error(res.data.message || "获取文件链接失败")
        }
      } catch (e) {
        this.$message.error("获取文件链接失败，请稍后重试")
      } finally {
        loading.close()
      }
    },
    // 状态标签颜色
    statusTagType(status) {
      if (status === 11) return "success"
      if ([2, 9, 12, 13].includes(status)) return "danger"
      if (status === 7) return "warning"
      if ([0, 3, 4, 5, 6, 8, 10].includes(status)) return "primary"
      return "info"
    },
    // 时间线节点颜色
    timelineItemType(record) {
      if (record.event === "submit") return "primary"
      if (["reject", "screen_reject", "interview_fail", "probation_fail", "withdraw", "decline_offer"].includes(record.event)) {
        return "danger"
      }
      if (record.event === "probation_pass") return "success"
      return "primary"
    },
    // 毫秒时间戳 / 日期字符串 -> 展示格式
    formatTime(ts) {
      if (!ts) return "-"
      // 兼容 "2026-08-26 17:22:19" 这类字符串（部分浏览器无法直接解析）
      if (typeof ts === "string") {
        ts = ts.replace(/-/g, "/")
      }
      const date = new Date(ts)
      if (isNaN(date.getTime())) return "-"
      const pad = (n) => String(n).padStart(2, "0")
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    eventDesc(event) {
      return EVENT_DESC[event] || event
    },
    roleDesc(role) {
      return ROLE_DESC[role] || role
    },
  },
  mounted() {
    this.loadApplies()
  },
}
</script>

<style scoped>
.refer-apply-panel {
  width: 100%;
}

.filter-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.filter-bar .el-select {
  width: 180px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: var(--space-5) 0;
}

/* 流转记录时间线 */
.flow-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-1);
}

.flow-status {
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
}

.flow-event {
  background: var(--color-bg);
  color: var(--color-text-secondary);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

.flow-meta {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.flow-remark {
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  margin-top: var(--space-2);
}

/* 简历详情弹窗 */
.resume-file-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
}

.resume-file-icon {
  font-size: 32px;
  color: var(--color-primary);
}

.resume-file-info {
  flex: 1;
  min-width: 0;
}

.resume-file-name {
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  word-break: break-all;
}

.resume-file-meta {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-1);
}

.resume-desc {
  margin-top: var(--space-2);
}

@media (max-width: 768px) {
  .filter-bar {
    justify-content: flex-start;
  }
}
</style>
