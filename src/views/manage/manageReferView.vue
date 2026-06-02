<template>
  <div class="refer-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">内推审核管理</h2>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-refresh" @click="fetchData" class="header-btn">
            刷新
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loading"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', textAlign: 'center' }"
        >
          <el-table-column prop="id" label="ID" width="80" align="center">
          </el-table-column>
          <el-table-column prop="company" label="公司名称" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="refercode" label="内推码" width="150" align="center">
            <template slot-scope="scope">
              <span class="refer-code">{{ scope.row.refercode }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="industry" label="行业" width="120" align="center">
          </el-table-column>
          <el-table-column prop="name" label="提交人" width="120" align="center">
          </el-table-column>
          <el-table-column prop="email" label="提交人邮箱" min-width="200" align="center">
          </el-table-column>
          <el-table-column prop="sort" label="热门排序" width="100" align="center">
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="150" align="center" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-s-check"
                @click="handleAudit(scope.row)"
              >
                审核
              </el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="内推码" prop="refercode">
          <el-input v-model="form.refercode" placeholder="请输入内推码"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="form.industry" placeholder="请输入行业"></el-input>
        </el-form-item>
        <el-form-item label="提交人" prop="name">
          <el-input v-model="form.name" placeholder="请输入提交人"></el-input>
        </el-form-item>
        <el-form-item label="提交人邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入提交人邮箱"></el-input>
        </el-form-item>
        <el-form-item label="热门排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="内推地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入内推地址"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请输入描述"
            :rows="4"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- 审核对话框 -->
    <el-dialog
      title="审核内推"
      :visible.sync="auditDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div class="audit-content" v-if="auditRow">
        <p style="margin-bottom: 20px; color: #606266;">请选择审核结果：</p>
        <el-form :model="auditRow" label-width="100px">
          <el-form-item label="公司名称">
            <span>{{ auditRow.company }}</span>
          </el-form-item>
          <el-form-item label="内推码">
            <span class="refer-code">{{ auditRow.refercode }}</span>
          </el-form-item>
          <el-form-item label="行业">
            <span>{{ auditRow.industry }}</span>
          </el-form-item>
          <el-form-item label="提交人">
            <span>{{ auditRow.name }}</span>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="handleReject">
          拒绝
        </el-button>
        <el-button type="success" @click="handlePass">
          通过
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "ManageReferView",
  data() {
    return {
      // 表格数据
      tableData: [],
      loading: false,
      // 分页参数
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      // 编辑对话框
      editDialogVisible: false,
      dialogTitle: "",
      submitLoading: false,
      // 审核对话框
      auditDialogVisible: false,
      auditRow: null,
      // 表单数据
      form: {
        id: null,
        company: "",
        refercode: "",
        industry: "",
        name: "",
        email: "",
        sort: 0,
        description: "",
        url: "",
      },
      // 表单验证规则
      rules: {
        company: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        refercode: [
          { required: true, message: "请输入内推码", trigger: "blur" },
        ],
        industry: [
          { required: true, message: "请输入行业", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入提交人", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "请输入热门排序", trigger: "blur" },
        ],
      },
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true
      const params = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      }
      
      axios
        .post("/api/refer/manageReferPage", params)
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            this.tableData = res.data.date.result || []
            this.pagination.total = res.data.date.total || 0
          } else {
            this.$message.error(res.data.message || "获取数据失败")
          }
        })
        .catch((error) => {
          console.error("获取数据失败：", error)
          this.$message.error("获取数据失败，请稍后重试")
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 审核（打开审核对话框）
    handleAudit(row) {
      this.auditRow = row
      this.auditDialogVisible = true
    },

    // 通过审核
    handlePass() {
      axios
        .put("/api/refer/passRefer", this.auditRow)
        .then((res) => {
          if (res.data === true || res.data.code === 200) {
            this.$message.success("审核通过")
            this.auditDialogVisible = false
            this.fetchData()
          } else {
            this.$message.error(res.data.message || "操作失败")
          }
        })
        .catch((error) => {
          console.error("操作失败：", error)
          this.$message.error("操作失败，请稍后重试")
        })
    },

    // 拒绝审核
    handleReject() {
      axios
        .delete("/api/refer/deleteById", {
          data: {
            id: this.auditRow.id,
          },
        })
        .then((res) => {
          if (res.data === true || res.data.code === 200) {
            this.$message.success("已拒绝")
            this.auditDialogVisible = false
            this.fetchData()
          } else {
            this.$message.error(res.data.message || "操作失败")
          }
        })
        .catch((error) => {
          console.error("操作失败：", error)
          this.$message.error("操作失败，请稍后重试")
        })
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑内推信息"
      this.form = {
        id: row.id,
        company: row.company,
        refercode: row.refercode,
        industry: row.industry,
        name: row.name,
        email: row.email,
        sort: row.sort,
        description: row.description,
        url: row.url,
      }
      this.editDialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    // 提交表单
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          // 编辑
          axios
            .put("/api/refer/edit", this.form)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success("更新成功")
                this.editDialogVisible = false
                this.fetchData()
              } else {
                this.$message.error(res.data.message || "更新失败")
              }
            })
            .catch((error) => {
              console.error("更新失败：", error)
              this.$message.error("更新失败，请稍后重试")
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.pageNo = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.fetchData()
    },

  },
}
</script>

<style scoped>
.refer-container { padding: 0; width: 100%; min-height: 100%; overflow-x: hidden; }
.content-wrapper { width: 100%; padding: var(--space-6) var(--space-5) 0; box-sizing: border-box; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.header-actions { display: flex; align-items: center; gap: var(--space-3); }

.table-container {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

.refer-code {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.table-container::v-deep .el-table { border-radius: var(--radius-md); overflow: hidden; }
.table-container::v-deep .el-table__row:hover { background-color: var(--color-primary-soft); }

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.dialog-footer { display: flex; justify-content: flex-end; gap: var(--space-3); }

@media (max-width: 768px) {
  .content-wrapper { padding: var(--space-4) var(--space-3) 0; }
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .page-title { font-size: var(--text-xl); }
  .table-container { padding: var(--space-4); overflow-x: auto; }
  ::v-deep .el-table { min-width: 900px; }
  ::v-deep .el-dialog { width: 90% !important; }
}
</style>
