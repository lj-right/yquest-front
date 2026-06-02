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
                <i v-if="scope.row.icon" :class="`el-icon-${scope.row.icon}`" style="color: var(--color-primary)"></i>
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
.circle-container { padding: 0; width: 100%; min-height: 100%; overflow-x: hidden; }
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
  min-height: 200px;
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
