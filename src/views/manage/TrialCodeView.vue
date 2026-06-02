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
.trial-code-container { padding: 0; width: 100%; min-height: 100%; overflow-x: hidden; }
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

.code-text {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.pagination-container {
  display: flex; justify-content: center;
  margin-top: var(--space-6); padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.detail-content { padding: var(--space-2) 0; }

.detail-item {
  display: flex; align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}
.detail-item:last-child { border-bottom: none; }

.detail-label {
  flex-shrink: 0; width: 120px;
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

.detail-value { flex: 1; color: var(--color-text-primary); }

.code-highlight {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--color-primary);
  background: var(--color-primary-soft);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}

.dialog-footer { display: flex; justify-content: flex-end; gap: var(--space-3); }

.table-container::v-deep .el-table { border-radius: var(--radius-md); overflow: hidden; }
.table-container::v-deep .el-table__row:hover { background-color: var(--color-primary-soft); }
::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active { background-color: var(--color-primary); }

@media (max-width: 768px) {
  .content-wrapper { padding: var(--space-4) var(--space-3) 0; }
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .page-title { font-size: var(--text-xl); }
  .table-container { padding: var(--space-4); overflow-x: auto; }
  ::v-deep .el-table { min-width: 800px; }
  ::v-deep .el-dialog { width: 90% !important; }
  .detail-item { flex-direction: column; align-items: flex-start; }
  .detail-label { margin-bottom: var(--space-1); }
}
</style>
