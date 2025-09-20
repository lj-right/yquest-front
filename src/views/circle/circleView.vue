<template>
  <div class="social-qa-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <a href="#" class="navbar-brand">
        <router-link to="/yquest" class="brand-logo">Y<span>Quest</span></router-link>
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
    <!-- 顶部标签栏 -->
    <div class="tab-bar">
      <div class="tab active">关注</div>
      <div class="tab active">推荐</div>
      <div class="tab">圈子</div>
    </div>

    <!-- 动态列表 -->
    <div class="feed-list">
      <!-- 第一条动态 -->
      <div class="feed-card">
        <div class="user-info">
          <div class="username">测试 <span class="user-level">LV.1</span></div>
          <div class="post-time">08-21 12:09</div>
        </div>
        <div class="post-content">
          <div class="post-tags">
            <span class="tag">测试</span>
            <span class="tag">Java</span>
          </div>
          <div class="post-text">京东秋招</div>
          <div class="post-detail">感觉表现的还不错</div>
        </div>
        <div class="post-actions">
          <div class="action-item">
            <span class="icon like">👍</span>
            <span>3</span>
          </div>
          <div class="action-item">
            <span class="icon comment">💬</span>
            <span>9</span>
          </div>
          <div class="action-item">
            <span class="icon favorite">⭐</span>
            <span>1</span>
          </div>
          <div class="action-item">
            <span class="icon share">↗️</span>
            <span>分享</span>
          </div>
        </div>
        <div class="comment-preview">
          <div class="comment-item">
            <span class="comment-user">爽朗用户：</span>
            <span class="comment-text">一样</span>
          </div>
        </div>
      </div>

      <!-- 第二条动态 -->
      <div class="feed-card">
        <div class="user-info">
          <div class="username">代码写不完 <span class="user-level">LV.3</span></div>
          <div class="post-time">08-22 12:25</div>
        </div>
        <div class="post-content">
          <div class="post-tags">
            <span class="tag">测试</span>
            <span class="tag">golang</span>
          </div>
          <div class="post-text">国企吗</div>
          <div class="post-detail">还排名这么靠前?</div>
          <div class="post-meta">哈哈</div>
        </div>
        <div class="post-actions">
          <div class="action-item">
            <span class="icon like">👍</span>
            <span>3</span>
          </div>
          <div class="action-item">
            <span class="icon comment">💬</span>
            <span>9</span>
          </div>
          <div class="action-item">
            <span class="icon favorite">⭐</span>
            <span>1</span>
          </div>
          <div class="action-item">
            <span class="icon share">↗️</span>
            <span>分享</span>
          </div>
        </div>
        <div class="comment-preview">
          <div class="comment-item">
            <span class="comment-user">赛博用户：</span>
            <span class="comment-text">content</span>
          </div>
        </div>
        <div class="additional-info">
          Huawei等公司10个岗位
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  // 可以在这里添加组件逻辑
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
.social-qa-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
}

/* 顶部标签栏样式 */
.tab-bar {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  font-weight: 500;
  cursor: pointer;
}

.tab.active {
  color: #0084ff;
  border-bottom: 2px solid #0084ff;
}

/* 动态卡片样式 */
.feed-list {
  padding: 10px;
}

.feed-card {
  background-color: white;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.username {
  font-weight: 500;
}

.user-level {
  font-size: 12px;
  color: #8590a6;
  margin-left: 4px;
}

.post-time {
  font-size: 12px;
  color: #8590a6;
}

.post-tags {
  margin-bottom: 8px;
}

.tag {
  display: inline-block;
  font-size: 12px;
  color: #8590a6;
  background-color: #f6f6f6;
  padding: 2px 8px;
  border-radius: 3px;
  margin-right: 8px;
}

.post-text {
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 16px;
}

.post-detail {
  color: #595959;
  margin-bottom: 6px;
  font-size: 14px;
}

.post-meta {
  color: #8590a6;
  font-size: 14px;
  margin-top: 4px;
}

/* 互动按钮样式 */
.post-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  color: #8590a6;
  font-size: 14px;
  cursor: pointer;
}

.icon {
  margin-right: 4px;
  font-size: 16px;
}

/* 评论预览样式 */
.comment-preview {
  margin-top: 12px;
  padding: 10px;
  background-color: #f6f6f6;
  border-radius: 4px;
}

.comment-item {
  font-size: 14px;
}

.comment-user {
  color: #0084ff;
}

.comment-text {
  color: #595959;
}

.additional-info {
  margin-top: 12px;
  padding: 8px 12px;
  background-color: #f0f7ff;
  border-radius: 4px;
  font-size: 13px;
  color: #0084ff;
}
</style>