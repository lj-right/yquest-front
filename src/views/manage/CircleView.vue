<template>
  <div class="circle-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">交流圈管理</h2>
        <div class="header-actions">
          <el-button type="primary" icon="el-icon-plus" @click="handleAdd" class="header-btn">
            新增圈子
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
          <el-table-column prop="circleName" label="圈子名称" min-width="200" align="center">
            <template slot-scope="scope">
              <span style="margin-right: 8px;">
                <i v-if="scope.row.icon" :class="`el-icon-${scope.row.icon}`" style="color: #4a6cf8;"></i>
              </span>
              {{ scope.row.circleName }}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="级别" width="120" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.level === 1 ? 'success' : 'info'" size="small">
                {{ scope.row.level === 1 ? '一级分类' : '二级分类' }}
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
        <el-form-item label="圈子名称" prop="circleName">
          <el-input v-model="form.circleName" placeholder="请输入圈子名称"></el-input>
        </el-form-item>
        <el-form-item label="圈子图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标名称（如：coffee）">
            <template slot="prepend">el-icon-</template>
          </el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择级别" style="width: 100%" @change="onLevelChange">
            <el-option label="一级分类" :value="1"></el-option>
            <el-option label="二级分类" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父分类" prop="parentId" v-if="form.level === 2">
          <el-select v-model="form.parentId" placeholder="请选择父分类" style="width: 100%">
            <el-option label="无" :value="-1"></el-option>
            <el-option
              v-for="item in parentOptions"
              :key="item.id"
              :label="item.circleName"
              :value="item.id"
            ></el-option>
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
  name: "CircleView",
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
        circleName: "",
        icon: "",
        level: 1,
        parentId: -1,
      },
      rules: {
        circleName: [
          { required: true, message: "请输入圈子名称", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" },
        ],
      },
    }
  },
  computed: {
    parentOptions() {
      return this.tableData.filter((item) => item.level === 1)
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      axios
        .get("/api/circle/share/circle/list")
        .then((res) => {
          if (res.data.code === 200 && res.data.date) {
            const treeData = res.data.date || []
            // 将树形结构转换为扁平数组
            this.tableData = this.flattenTree(treeData)
            this.pagination.total = this.tableData.length
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

    // 将树形结构转换为扁平数组
    flattenTree(tree, level = 1) {
      let result = []
      tree.forEach(item => {
        result.push({
          ...item,
          level: level
        })
        if (item.children && item.children.length > 0) {
          result = result.concat(this.flattenTree(item.children, level + 1))
        }
      })
      return result
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

    handleAdd() {
      this.dialogTitle = "新增圈子"
      this.isEdit = false
      this.form = {
        id: null,
        circleName: "",
        icon: "",
        level: 1,
        parentId: -1,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    handleEdit(row) {
      this.dialogTitle = "编辑圈子"
      this.isEdit = true
      this.form = {
        id: row.id,
        circleName: row.circleName,
        icon: row.icon || "",
        level: row.level,
        parentId: row.parentId || -1,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    handleDelete(row) {
      // 检查是否有子分类
      const hasChildren = this.tableData.some(item => item.parentId === row.id)
      if (hasChildren) {
        this.$message.warning("请先删除子分类")
        return
      }
      
      this.$confirm(`确定要删除圈子"${row.circleName}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("/api/circle/share/circle/remove", {
              id: row.id,
            })
            .then((res) => {
              if (res.data.code === 200 || res.data.date === true) {
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

    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const submitData = {
            circleName: this.form.circleName,
            icon: this.form.icon,
            parentId: this.form.level === 1 ? -1 : this.form.parentId,
          }

          if (this.isEdit) {
            submitData.id = this.form.id
            axios
              .post("/api/circle/share/circle/update", submitData)
              .then((res) => {
                if (res.data.code === 200 || res.data.date === true) {
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
            axios
              .post("/api/circle/share/circle/save", submitData)
              .then((res) => {
                if (res.data.code === 200 || res.data.date === true) {
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

    onLevelChange() {
      if (this.form.level === 1) {
        this.form.parentId = -1
      } else {
        this.form.parentId = this.parentOptions.length > 0 ? this.parentOptions[0].id : -1
      }
    },
  },
}
</script>

<style scoped>
.circle-container {
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
  min-height: 200px;
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

.add-button {
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border: none;
}

.add-button:hover {
  opacity: 0.9;
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

::v-deep .el-button--primary {
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border: none;
}

::v-deep .el-button--primary:hover {
  opacity: 0.9;
}

::v-deep .el-button--danger {
  background: #f56c6c;
  border: none;
}

::v-deep .el-button--danger:hover {
  background: #f78989;
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

::v-deep .el-pagination {
  font-weight: normal;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4a6cf8;
}

::v-deep .el-pagination.is-background .el-pager li:hover {
  color: #4a6cf8;
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

::v-deep .el-select .el-input.is-focus .el-input__inner {
  border-color: #4a6cf8;
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
  .circle-container {
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

  .table-header {
    margin-bottom: 16px;
  }

  .add-button {
    width: 100%;
  }

  ::v-deep .el-table {
    min-width: 600px;
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
  .circle-container {
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
    min-width: 700px;
  }

  ::v-deep .el-pagination__total,
  ::v-deep .el-pagination__jump {
    display: none;
  }
}
</style>
