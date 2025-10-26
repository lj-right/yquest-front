<template>
  <div class="circle-container">
    <div class="content-wrapper">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">交流圈管理</h2>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
          新增圈子
        </el-button>
      </div>

      <!-- 数据表格 -->
      <div class="table-container" v-loading="loading">
        <el-tree
          :data="circleData"
          node-key="id"
          :props="treeProps"
          :render-content="renderContent"
          accordion
          highlight-current
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
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
      circleData: [],
      loading: false,
      treeProps: {
        children: "children",
        label: "circleName",
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
      currentNode: null,
    }
  },
  computed: {
    parentOptions() {
      return this.getFirstLevelCircles(this.circleData)
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
            this.circleData = res.data.date || []
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

    renderContent(h, { node, data }) {
      return h(
        "div",
        {
          class: "custom-tree-node",
        },
        [
          h(
            "span",
            {
              class: "node-label",
            },
            [
              data.icon && h("i", { class: `el-icon-${data.icon}`, style: "margin-right: 8px; color: #4a6cf8;" }),
              h("span", data.circleName),
            ]
          ),
          h(
            "span",
            {
              class: "node-actions",
            },
            [
              h(
                "el-button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    icon: "el-icon-edit",
                  },
                  on: {
                    click: () => this.handleEdit(data, node),
                  },
                },
                "编辑"
              ),
              h(
                "el-button",
                {
                   props: {
                    type: "danger",
                    size: "small",
                    icon: "el-icon-delete",
                  },
                  on: {
                    click: () => this.handleDelete(data),
                  },
                },
                "删除"
              ),
            ]
          ),
        ]
      )
    },

    handleNodeClick(data, node) {
      this.currentNode = node
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

    handleEdit(data, node) {
      this.dialogTitle = "编辑圈子"
      this.isEdit = true
      this.currentNode = node
      const level = node.level === 1 ? 1 : 2
      this.form = {
        id: data.id,
        circleName: data.circleName,
        icon: data.icon || "",
        level: level,
        parentId: data.parentId || -1,
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },

    handleDelete(data) {
      if (data.children && data.children.length > 0) {
        this.$message.warning("请先删除子分类")
        return
      }
      
      this.$confirm(`确定要删除圈子"${data.circleName}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("/api/circle/share/circle/remove", {
              id: data.id,
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

    getFirstLevelCircles(data) {
      return data.filter((item) => !item.parentId || item.parentId === -1)
    },
  },
}
</script>

<style scoped>
.circle-container {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  padding: 24px 20px 0;
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
  margin: 0 auto;
  min-height: 200px;
}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
}

.node-label {
  display: flex;
  align-items: center;
  flex: 1;
  color: #2d3748;
  font-weight: 500;
  font-size: 15px;
}

.node-actions {
  display: flex;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

::v-deep .el-tree {
  border: none;
  background: transparent;
}

::v-deep .el-tree-node__content {
  height: auto;
  padding: 12px 0 !important;
  border-bottom: 1px solid #f0f0f0;
}

::v-deep .el-tree-node__content:last-child {
  border-bottom: none;
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
  background: #f5f7fa;
}

::v-deep .el-tree-node__content:hover {
  background: #f5f7fa;
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

  ::v-deep .el-tree {
    min-width: 400px;
  }

  ::v-deep .el-dialog {
    width: 90% !important;
    margin-top: 5vh !important;
  }

  ::v-deep .el-dialog__body {
    padding: 20px 16px;
  }

  .node-actions {
    display: none;
  }

  .custom-tree-node:hover .node-actions,
  .custom-tree-node:active .node-actions {
    display: flex;
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

  .node-label {
    font-size: 14px;
  }

  .node-actions .el-button {
    padding: 5px 10px;
    font-size: 12px;
  }

  ::v-deep .el-tree-node__content {
    height: auto;
    min-height: 36px;
  }

  .custom-tree-node {
    flex-wrap: wrap;
  }
}
</style>
