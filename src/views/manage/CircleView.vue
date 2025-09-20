<template>
  <div class="container-wrapper">
    <!-- 圈子管理 -->
    <div class="common-layout">
      <el-container>
          <el-main>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column
                fixed
                prop="company"
                label="圈子名称"
                width="150"
              >
              </el-table-column>
              <el-table-column prop="refercode" label="圈子" width="120">
              </el-table-column>
              <el-table-column prop="industry" label="行业" width="120">
              </el-table-column>
              <el-table-column prop="name" label="提交人" width="120">
              </el-table-column>
              <el-table-column prop="email" label="提交人邮箱" width="300">
              </el-table-column>
              <el-table-column prop="sort" label="热门排序" width="120">
              </el-table-column>
              <el-table-column fixed="description" label="描述" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="passClick(scope.row)"
                    type="text"
                    size="small"
                    >通过</el-button
                  >
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
  },
  mounted() {
    axios.post("/api/refer/manageReferPage",{}).then((res)=>{
      this.tableData = res.data.date.result;
    })
  },
}
</script>

<style scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.container-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ff 100%);
  color: #333;
}

/* 导航栏样式 */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 15px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  color: #4a6cf8;
}

.brand-logo span {
  color: #8a4af8;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #4a6cf8;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4a6cf8;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-login {
  background: #f0f4ff;
  color: #4a6cf8;
  border: 1px solid #d9e0ff;
}

.btn-login:hover {
  background: #e4e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 108, 248, 0.15);
}

.btn-register {
  background: linear-gradient(to right, #4a6cf8, #8a4af8);
  color: white;
  border: none;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 108, 248, 0.3);
}
</style>
