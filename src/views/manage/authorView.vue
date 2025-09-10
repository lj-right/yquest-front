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
        <router-link to="/login" class="nav-btn btn-login">登录</router-link>
        <router-link to="/login" class="nav-btn btn-register">注册</router-link>
      </div>
    </nav>

    <!-- 作者介绍主体内容 -->
    <div class="main-content">
      <div class="page-header">
        <h1>关于作者</h1>
        <h3>随风</h3>
      </div>
      <div class="contact-info">
        <div><span class="introduce-way">联系方式：</span></div>
        <div class="contact-methods">
          <div class="contact-card">
            <i class="fas fa-envelope"></i>
            <h4>邮箱</h4>
            <a href="mailto:suifeng.king@qq.com">suifeng.king@qq.com</a>
          </div>

          <div class="contact-card">
            <h4>Gitee</h4>
            <a href="https://gitee.com/liujiawei_1" target="_blank"
              >Gitee/suifeng</a
            >
          </div>

          <div class="contact-card">
            <i class="fas fa-blog"></i>
            <h4>个人博客</h4>
            <a href="https://blog.suifeng1.cn" target="_blank"
              >Blog</a
            >
          </div>
        </div>
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
export default {
  data() {
    return {
      tableData: [],
      searchKeyword: "",
    }
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

/* 联系方式样式 */
body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .main-content {
            padding: 40px;
        }
        
        .page-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }
        
        .page-header h1 {
            font-size: 2.8rem;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .page-header p {
            font-size: 1.4rem;
            color: #7f8c8d;
            font-weight: 300;
        }
        
        .author-profile {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .author-avatar {
            flex: 1;
            min-width: 250px;
            text-align: center;
        }
        
        .author-avatar img {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #f1f1f1;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .author-bio {
            flex: 2;
            min-width: 300px;
        }
        
        .author-bio h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 1.8rem;
        }
        
        .author-bio p {
            margin-bottom: 15px;
            color: #555;
            line-height: 1.8;
        }
        
        .contact-info {
            padding: 30px;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .contact-info h3 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
            display: inline-block;
        }
        .introduce-way {
            font-size: 1.2rem;
            color: #333;
            font-weight: 600;
            margin-bottom: 15px;
            display: inline-block;
        }
        
        .contact-methods {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .contact-card {
            flex: 1;
            min-width: 200px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .contact-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .contact-card i {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #3498db;
        }
        
        .contact-card h4 {
            margin-bottom: 10px;
            color: #0080ff;
        }
        
        .contact-card a {
            color: #6926e6;
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .contact-card a:hover {
            color: #0080ff;
        }
        
        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
            }
            
            .author-profile {
                flex-direction: column;
            }
            
            .contact-card {
                min-width: 100%;
            }
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
