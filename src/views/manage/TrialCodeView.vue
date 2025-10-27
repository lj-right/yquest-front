<template>
  <div class="trial-code-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">试用码管理</h2>
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
          <el-table-column prop="code" label="试用码" min-width="200" align="center">
            <template slot-scope="scope">
              <span class="code-text">{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 0 ? 'success' : 'info'" size="small">
                {{ scope.row.status === 0 ? '未使用' : '已使用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expireTime" label="过期时间" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.expireTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" width="150" align="center">
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="180" align="center">
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.createdTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
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
      title="试用码详情"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :modal="false"
    >
      <div class="detail-content" v-if="currentRow">
        <div class="detail-item">
          <span class="detail-label">ID：</span>
          <span class="detail-value">{{ currentRow.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">试用码：</span>
          <span class="detail-value code-highlight">{{ currentRow.code }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">状态：</span>
          <el-tag :type="currentRow.status === 0 ? 'success' : 'info'" size="small">
            {{ currentRow.status === 0 ? '未使用' : '已使用' }}
          </el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">过期时间：</span>
          <span class="detail-value">{{ formatDate(currentRow.expireTime) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">创建人：</span>
          <span class="detail-value">{{ currentRow.createdBy }}</span>
        </div>
        <div class="detail-item">
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
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "TrialCodeView",
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
      // 对话框
      dialogVisible: false,
      currentRow: null,
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
        .post("/api/trialCode/getPage", params)
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

    // 查看详情
    handleView(row) {
      this.currentRow = row
      this.dialogVisible = true
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除试用码"${row.code}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .delete("/api/trialCode/delete", {
              params: {
                id: row.id,
              },
            })
            .then((res) => {
              if (res.data.code === 200) {
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
.trial-code-container {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-btn {
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border: none;
}

.header-btn:hover {
  opacity: 0.9;
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

/* 试用码文本样式 */
.code-text {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 500;
  color: #4a6cf8;
  background: #f0f4ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
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
  align-items: center;
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

/* 标签样式 */
::v-deep .el-tag--success {
  background-color: #f0f9ff;
  border-color: #bae7ff;
  color: #1890ff;
}

::v-deep .el-tag--info {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #8c8c8c;
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
  .code-container {
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
    min-width: 800px;
  }

  ::v-deep .el-table th,
  ::v-deep .el-table td {
    padding: 10px 8px;
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
  .code-container {
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

  ::v-deep .el-table {
    font-size: 13px;
  }

  ::v-deep .el-pagination__total,
  ::v-deep .el-pagination__jump {
    display: none;
  }

  .trial-code {
    font-size: 11px;
  }
}
</style>
