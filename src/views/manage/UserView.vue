<template>
  <div class="user-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">用户管理</h2>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd" class="header-btn">
            新增用户
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
          <el-table-column prop="introduce" label="个人介绍" width="120" align="center">

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
      :modal="false"
    >
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
            <el-option label="未知" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人介绍" prop="introduce">
          <el-input
            type="textarea"
            v-model="form.introduce"
            placeholder="请输入个人介绍"
            :rows="4"
            maxlength="35"
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
      isEdit: false,
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
    }
  },
  computed: {
    rules() {
      const baseRules = {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
        ],
      }
      
      if (!this.isEdit) {
        baseRules.password = [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "密码长度需在6-20个字符之间", trigger: "blur" },
        ]
      }
      
      return baseRules
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

    handleAdd() {
      this.dialogTitle = "新增用户"
      this.isEdit = false
      this.form = {
        id: null,
        userName: "",
        nickName: "",
        email: "",
        phone: "",
        sex: 0,
        status: 0,
        introduce: "",
        password: "",
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    handleEdit(row) {
      this.dialogTitle = "编辑用户信息"
      this.isEdit = true
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
          if (this.isEdit) {
            // 编辑
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
          } else {
            // 新增
            axios
              .post("/api/authUser/no-auth/register", this.form)
              .then((res) => {
                if (res.data === true || res.data.code === 200) {
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
.user-container { padding: 0; width: 100%; min-height: 100%; overflow-x: hidden; }
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

@media (max-width: 768px) {
  .content-wrapper { padding: var(--space-4) var(--space-3) 0; }
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-4); }
  .page-title { font-size: var(--text-xl); }
  .table-container { padding: var(--space-4); overflow-x: auto; }
  ::v-deep .el-table { min-width: 700px; }
  ::v-deep .el-dialog { width: 90% !important; }
}
</style>
