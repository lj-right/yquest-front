<template>
  <div class="user-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">用户管理</h2>
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
          <el-table-column prop="nickName" label="昵称" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" min-width="180" align="center">
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="150" align="center">
          </el-table-column>
          <el-table-column prop="sex" label="性别" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.sex === 0 ? 'success' : 'info'" size="small">
                {{ scope.row.sex === 0 ? '男' : scope.row.sex === 1 ? '女' : '未知' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
                {{ scope.row.status === 0 ? '启用' : '禁用' }}
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

    <!-- 编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
            <el-option label="未知" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduce">
          <el-input
            type="textarea"
            v-model="form.introduce"
            placeholder="请输入个人介绍"
            :rows="4"
            maxlength="500"
            show-word-limit
          ></el-input>
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
  name: "UserView",
  data() {
    return {
      tableData: [],
      loading: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      dialogTitle: "",
      submitLoading: false,
      form: {
        id: null,
        userName: "",
        nickName: "",
        email: "",
        phone: "",
        sex: 0,
        status: 0,
        introduce: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      },
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      const params = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      }
      
      axios
        .post("/api/authUser/queryPage", params)
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

    handleEdit(row) {
      this.dialogTitle = "编辑用户信息"
      this.form = {
        id: row.id,
        userName: row.userName,
        nickName: row.nickName,
        email: row.email,
        phone: row.phone,
        sex: row.sex,
        status: row.status,
        introduce: row.introduce,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          axios
            .put("/api/authUser/edit", this.form)
            .then((res) => {
              if (res.data === true || res.data.code === 200) {
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
        }
      })
    },

    handleDelete(row) {
      this.$confirm(`确定要删除用户"${row.nickName}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .delete(`/api/authUser/deleteById/${row.id}`)
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
        .catch(() => {})
    },

    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.pageNo = 1
      this.fetchData()
    },

    handleCurrentChange(val) {
      this.pagination.pageNo = val
      this.fetchData()
    },
  },
}
</script>

<style scoped>
.user-container {
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

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

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

::v-deep .el-pagination {
  font-weight: normal;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4a6cf8;
}

::v-deep .el-pagination.is-background .el-pager li:hover {
  color: #4a6cf8;
}

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

::v-deep .el-tag--danger {
  background-color: #fef0f0;
  border-color: #fde2e2;
  color: #f56c6c;
}

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
  .user-container {
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
    min-width: 700px;
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
}

@media (max-width: 576px) {
  .user-container {
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
}
</style>
