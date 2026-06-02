<template>
  <div class="sensitive-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">敏感词管理</h2>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd" class="header-btn">
            新增敏感词
          </el-button>
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
        <el-table-column prop="id" label="ID" width="100" align="center">
              </el-table-column>
        <el-table-column prop="words" label="敏感词" min-width="200" align="center">
              </el-table-column>
        <el-table-column prop="type" label="类型" width="150" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.type === 1 ? 'danger' : 'warning'" size="small">
              {{ scope.row.type === 1 ? '黑名单' : '白名单' }}
            </el-tag>
          </template>
              </el-table-column>
        <el-table-column label="操作" width="220" align="center" fixed="right">
                <template slot-scope="scope">
                  <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            >
              编辑
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="敏感词" prop="words">
          <el-input
            v-model="form.words"
            placeholder="请输入敏感词"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="黑名单" :value="1"></el-option>
            <el-option label="白名单" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
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
  name: "SensitiveView",
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
      dialogTitle: "",
      isEdit: false,
      submitLoading: false,
      // 表单数据
      form: {
        id: null,
        words: "",
        type: 1,
      },
      // 表单验证规则
      rules: {
        words: [
          { required: true, message: "请输入敏感词", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择类型", trigger: "change" },
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
        .post("/api/circle/sensitive/words/queryPage", params)
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

    // 新增
    handleAdd() {
      this.dialogTitle = "新增敏感词"
      this.isEdit = false
      this.form = {
        id: null,
        words: "",
        type: 1,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    // 编辑
    handleEdit(row) {
      this.dialogTitle = "编辑敏感词"
      this.isEdit = true
      this.form = {
        id: row.id,
        words: row.words,
        type: row.type,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    // 提交表单
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          if (this.isEdit) {
            // 更新
            axios
              .post("/api/circle/sensitive/words/update", this.form)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("更新成功")
                  this.dialogVisible = false
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
          } else {
            // 新增
            axios
              .get("/api/circle/sensitive/words/save", {
                params: {
                  words: this.form.words,
                  type: this.form.type,
                },
              })
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("新增成功")
                  this.dialogVisible = false
                  this.fetchData()
                } else {
                  this.$message.error(res.data.message || "新增失败")
                }
              })
              .catch((error) => {
                console.error("新增失败：", error)
                this.$message.error("新增失败，请稍后重试")
              })
              .finally(() => {
                this.submitLoading = false
              })
          }
        }
      })
    },

    // 删除
    handleDelete(row) {
      this.$confirm(`确定要删除敏感词"${row.words}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .get("/api/circle/sensitive/words/remove", {
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
  },
}
</script>

<style scoped>
.sensitive-container { padding: 0; width: 100%; min-height: 100%; overflow-x: hidden; }
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

.pagination-container {
  display: flex; justify-content: center;
  margin-top: var(--space-6); padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
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
  ::v-deep .el-table { min-width: 600px; }
  ::v-deep .el-dialog { width: 90% !important; }
}
</style>
