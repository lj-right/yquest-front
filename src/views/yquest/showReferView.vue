<template>
  <div class="container-wrapper">
    <!-- 导航栏 -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo"
          >Y<span>Quest</span></router-link
        >
      </a>

      <div class="nav-links">
        <router-link to="/yquest" class="nav-link">首页</router-link>
        <router-link to="/showRefer" class="nav-link">内推机会</router-link>
        <router-link to="/circle" class="nav-link">求职交流</router-link>
        <router-link to="/refer" class="nav-link">我要内推</router-link>
        <router-link to="/aboutMe" class="nav-link">关于作者</router-link>
      </div>

      <div class="nav-actions">
        <div>
          <router-link to="/login" class="nav-btn btn-login" >{{
            this.$store.state.name
          }}</router-link>
        </div>
      </div>
    </nav>

    <!-- 内推码主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>内推机会</h1>
        <p>发现优质企业的内推码，加速你的求职之路</p>
      </div>

      <div class="search-section">
        <div class="search-box">
          <el-input
            placeholder="搜索您要查找的公司内推..."
            prefix-icon="Search"
            v-model="searchKeyword"
            @keyup.enter="searchByCompany"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 25px"
            @click="searchByCompany"
          >
            <el-icon class="el-icon-search" style="width: 60px"></el-icon>
          </el-button>
          <el-button type="primary" @click="resetMessage">
            <div style="width: 60px">重置</div>
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-card class="table-card">
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column
              prop="company"
              label="公司名称"
              width="150"
              sortable
            >
            </el-table-column>
            <el-table-column prop="refercode" label="内推码" width="120">
            </el-table-column>
            <el-table-column prop="industry" label="行业" width="120">
            </el-table-column>
            <el-table-column prop="name" label="提交人" width="120">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              min-width="180"
            ></el-table-column>
            <el-table-column prop="url" label="内推官方链接" min-width="180">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="referLink(scope.row.url)"
                  >前往内推地址</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              :current-page="pageNo"
              :page-size="pageSize"
              :total="this.total"
              @current-change="currentChange"
              layout="total, prev, pager, next"
              background
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <div class="footer-logo">
            YQuest<span>&nbsp;&nbsp;Our Refer</span>
          </div>
          <p>连接优秀人才与顶级企业的内推平台</p>
        </div>

        <div class="footer-links-group">
          <h3>快速链接</h3>
          <div class="footer-links">
            <a href="/yquest" class="footer-link">首页</a>
            <a href="#" class="footer-link">内推机会</a>
            <a href="#" class="footer-link">求职攻略</a>
          </div>
        </div>

        <div class="footer-links-group">
          <h3>支持</h3>
          <div class="footer-links">
            <a href="#" class="footer-link">帮助中心</a>
            <a href="#" class="footer-link">联系我们</a>
            <a href="#" class="footer-link">常见问题</a>
          </div>
        </div>

        <div class="footer-links-group">
          <h3>法律</h3>
          <div class="footer-links">
            <a href="#" class="footer-link">隐私政策</a>
            <a href="#" class="footer-link">使用条款</a>
            <a href="#" class="footer-link">Cookie政策</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 YQuest 内推码平台，保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      tableData: [],
      searchKeyword: "",
      pageNo: 1,
      pageSize: 10, // 每页显示条数
      total: ''
    }
  },
  methods: {
    referLink(url) {
      if (url) {
        window.open(url, "_blank") // 新标签页打开
        // 或使用: window.location.href = url; // 当前页跳转
      } else {
        console.warn("无效的URL")
      }
    },
    defaultquery() {
      axios
        .post("/api/refer/queryPage", {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.tableData = res.data.date.result
          this.total =  res.data.date.total
        })
    },
    searchByCompany() {
      if (this.searchKeyword.trim() !== "") {
        this.pageNo = 1;
        axios
          .post("/api/refer/searchByMessage", {
            company: this.searchKeyword,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
          })
          .then((res) => {
            this.tableData = res.data.date.result
            this.total =  res.data.date.total
          })
          .catch((error) => {
            this.$message.error("搜索请求失败:", error)
            // 可以在这里显示错误提示
          })
      } else {
        this.defaultquery()
      }
    },
    // 点击页码的方法
    currentChange(page) {
      // 确保页码有效
      if (page >= 1) {
        this.pageNo = page
        // 手动触发数据刷新
        if (this.searchKeyword.trim() !== "") {
          this.searchByCompany()
        } else {
          this.defaultquery()
        }
      }
    },
    resetMessage() {
      this.searchKeyword = ""
      this.pageNo = 1
      this.defaultquery()
    },
  },
  mounted() {
    axios
      .post("/api/refer/queryPage", {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      })
      .then((res) => {
        this.tableData = res.data.date.result
        this.total =  res.data.date.total
      })
  },
}
</script>

<style scoped>
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

/* 主体内容 */
.main-content {
  flex: 1;
  padding: 30px 5%;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.page-header p {
  font-size: 1.1rem;
  color: #666;
}

.search-section {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.search-box {
  display: flex;
  width: 100%;
  max-width: 600px;
}

.table-container {
  margin-bottom: 40px;
}

.table-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 10px;
}

.stats-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 页脚样式 */
.footer {
  background: white;
  padding: 30px 5%;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a6cf8;
  margin-bottom: 15px;
}

.footer-logo span {
  color: #8a4af8;
}

.footer-links {
  padding: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #4a6cf8;
}

.footer-bottom {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-links {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-content {
    padding: 20px 15px;
  }

  .search-box {
    flex-direction: column;
    gap: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }

  .stats-section .el-col {
    margin-bottom: 15px;
  }
}
</style>
