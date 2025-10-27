<template>
  <div class="refer-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">内推审核管理</h2>
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
          <el-table-column label="操作" width="280" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                icon="el-icon-check"
                @click="handleApprove(scope.row)"
              >
                通过
              </el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="info"
                size="small"
                icon="el-icon-view"
                @click="handleView(scope.row)"
              >
                查看
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >
                删除
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

    <!-- 查看详情对话框 -->
    <el-dialog
      title="内推详情"
      :visible.sync="viewDialogVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <div class="detail-content" v-if="currentRow">
        <div class="detail-item">
          <span class="detail-label">ID：</span>
          <span class="detail-value">{{ currentRow.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">公司名称：</span>
          <span class="detail-value">{{ currentRow.company }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">内推码：</span>
          <span class="detail-value code-highlight">{{ currentRow.refercode }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">行业：</span>
          <span class="detail-value">{{ currentRow.industry }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">提交人：</span>
          <span class="detail-value">{{ currentRow.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">提交人邮箱：</span>
          <span class="detail-value">{{ currentRow.email }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">热门排序：</span>
          <span class="detail-value">{{ currentRow.sort }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">描述：</span>
          <span class="detail-value">{{ currentRow.description || '-' }}</span>
        </div>
        <div class="detail-item" v-if="currentRow.url">
          <span class="detail-label">内推地址：</span>
          <span class="detail-value">
            <a :href="currentRow.url" target="_blank" class="url-link">{{ currentRow.url }}</a>
          </span>
        </div>
        <div class="detail-item" v-if="currentRow.createdBy">
          <span class="detail-label">创建人：</span>
          <span class="detail-value">{{ currentRow.createdBy }}</span>
        </div>
        <div class="detail-item" v-if="currentRow.createdTime">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ formatDate(currentRow.createdTime) }}</span>
        </div>
        <div class="detail-item" v-if="currentRow.updatedBy">
          <span class="detail-label">更新人：</span>
          <span class="detail-value">{{ currentRow.updatedBy }}</span>
        </div>
        <div class="detail-item" v-if="currentRow.updatedTime">
          <span class="detail-label">更新时间：</span>
          <span class="detail-value">{{ formatDate(currentRow.updatedTime) }}</span>
    </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialogVisible"
      width="600px"
      :close-on-click-modal="false"
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
      // 查看对话框
      viewDialogVisible: false,
      currentRow: null,
      // 编辑对话框
      editDialogVisible: false,
      dialogTitle: "",
      submitLoading: false,
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

    // 审核通过
    handleApprove(row) {
      this.$confirm(`确定要通过"${row.company}"的内推申请吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success",
      })
        .then(() => {
          // 这里可以调用审核通过的接口，目前使用编辑接口更新状态
          // 根据实际后端接口调整
          this.$message.success("审核通过")
          this.fetchData()
        })
        .catch(() => {
          // 取消操作
        })
    },

    // 查看详情
    handleView(row) {
      this.currentRow = row
      this.viewDialogVisible = true
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

    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除"${row.company}"的内推信息吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .delete("/api/refer/deleteById", {
              data: {
                id: row.id,
              },
            })
            .then((res) => {
              if (res.data === true || res.data.code === 200) {
                this.$message.success("删除成功")
                this.fetchData()
              } else {
                this.$message.error(res.data.message || "删除失败")
              }
            })
            .catch((error) => {
              console.error("删除失败：", error)
              this.$message.error("删除失败，请稍后重试")
            })
        })
        .catch(() => {
          // 取消删除
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

    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr) return '-'
      try {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      } catch (error) {
        return dateStr
      }
    },
  },
}
</script>

<style scoped>
.refer-container {
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 100%;
  padding: 24px 20px 0;
  box-sizing: border-box;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

/* 内推码样式 */
.refer-code {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  color: #4a6cf8;
  background: #f0f4ff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-block;
}

/* Element UI 表格样式覆盖 */
.table-container::v-deep .el-table {
  border-radius: 8px;
  overflow: hidden;
}

.table-container::v-deep .el-table th {
  font-weight: 600;
}

.table-container::v-deep .el-table__row:hover {
  background-color: #f5f7fa;
}

.table-container::v-deep .el-button--primary {
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border: none;
}

.table-container::v-deep .el-button--primary:hover {
  opacity: 0.9;
}

.table-container::v-deep .el-button--success {
  background: #67c23a;
  border: none;
}

.table-container::v-deep .el-button--success:hover {
  background: #85ce61;
}

.table-container::v-deep .el-button--info {
  background: #909399;
  border: none;
}

.table-container::v-deep .el-button--info:hover {
  background: #a6a9ad;
}

.table-container::v-deep .el-button--danger {
  background: #f56c6c;
  border: none;
}

.table-container::v-deep .el-button--danger:hover {
  background: #f78989;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 详情内容样式 */
.detail-content {
  padding: 10px 0;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  flex-shrink: 0;
  width: 120px;
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  flex: 1;
  color: #2d3748;
  word-break: break-all;
}

.code-highlight {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
  color: #4a6cf8;
  background: #f0f4ff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.url-link {
  color: #4a6cf8;
  text-decoration: none;
  border-bottom: 1px solid #4a6cf8;
  transition: all 0.3s;
}

.url-link:hover {
  color: #8a4af8;
  border-bottom-color: #8a4af8;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element UI 对话框样式覆盖 */
::v-deep .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

::v-deep .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

::v-deep .el-dialog__body {
  padding: 24px;
}

::v-deep .el-form-item__label {
  font-weight: 500;
  color: #4a5568;
}

::v-deep .el-input__inner {
  border-radius: 6px;
}

::v-deep .el-input__inner:focus {
  border-color: #4a6cf8;
}

::v-deep .el-textarea__inner:focus {
  border-color: #4a6cf8;
}

/* 分页样式 */
::v-deep .el-pagination {
  font-weight: normal;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4a6cf8;
}

::v-deep .el-pagination.is-background .el-pager li:hover {
  color: #4a6cf8;
}

/* 响应式设计 */
@media (max-width: 1440px) {
  .content-wrapper {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 960px;
  }
}

@media (max-width: 768px) {
  .refer-container {
    padding: 20px 15px;
  }

  .content-wrapper {
    padding: 0;
    max-width: 100%;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 22px;
  }

  .table-container {
    padding: 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  ::v-deep .el-table {
    min-width: 900px;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table td {
    padding: 10px 8px;
  }

  ::v-deep .el-table__fixed-right {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .pagination-container {
    justify-content: center;
    padding: 16px 0;
  }

  ::v-deep .el-pagination {
    flex-wrap: wrap;
    gap: 8px;
  }

  ::v-deep .el-dialog {
    width: 90% !important;
    margin-top: 5vh !important;
  }

  ::v-deep .el-dialog__body {
    padding: 20px 16px;
  }

  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-label {
    margin-bottom: 6px;
  }
}

@media (max-width: 576px) {
  .refer-container {
    padding: 16px 10px;
  }

  .page-title {
    font-size: 20px;
  }

  .table-container {
    padding: 12px;
  }

  ::v-deep .el-button {
    padding: 10px 16px;
    font-size: 13px;
  }

  ::v-deep .el-button--small {
    padding: 7px 10px;
    font-size: 12px;
  }

  ::v-deep .el-table {
    font-size: 13px;
    min-width: 1000px;
  }

  ::v-deep .el-pagination__total,
  ::v-deep .el-pagination__jump {
    display: none;
  }

  .refer-code {
    font-size: 11px;
    padding: 4px 8px;
  }

  ::v-deep .el-table .cell {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .refer-container {
    padding: 12px 8px;
  }

  .page-title {
    font-size: 18px;
  }

  .table-container {
    padding: 10px;
  }

  ::v-deep .el-button--small {
    padding: 5px 8px;
    font-size: 11px;
  }

  ::v-deep .el-button--small [class*="el-icon-"] {
    font-size: 12px;
  }
}
</style>
