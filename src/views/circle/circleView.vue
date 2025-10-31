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
          <router-link 
            v-if="isAdminUser" 
            to="/manage" 
            class="nav-btn btn-admin"
          >
            后台管理
          </router-link>
          <UserMenu />
        </div>
      </div>
    </nav>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧圈子列表 -->
      <div class="sidebar">
        <div class="circle-list-header">
          <h3>交流圈</h3>
        </div>
        <div class="circle-list" v-loading="circleLoading">
          <div 
            v-for="circle in circleList" 
            :key="circle.id"
            class="circle-category"
          >
            <div class="category-title">{{ circle.circleName }}</div>
            <div 
              v-for="subCircle in circle.children" 
              :key="subCircle.id"
              :class="['circle-item', { active: currentCircleId === subCircle.id }]"
              @click="selectCircle(subCircle)"
            >
              <span class="circle-name">{{ subCircle.circleName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧动态列表 -->
      <div class="content-area">
        <!-- 顶部标签栏 -->
        <div class="tab-bar">
          <div 
            :class="['tab', { active: currentTab === 'recommend' }]"
            @click="switchTab('recommend')"
          >
            推荐
          </div>
          <div 
            :class="['tab', { active: currentTab === 'frontend' }]"
            @click="switchTab('frontend')"
          >
            前端
          </div>
          <div 
            :class="['tab', { active: currentTab === 'backend' }]"
            @click="switchTab('backend')"
          >
            后端
          </div>
        </div>

        <!-- 动态列表 -->
        <div class="feed-list" v-loading="momentLoading">
          <div 
            v-for="moment in momentList" 
            :key="moment.id"
            class="feed-card"
            @click="viewMomentDetail(moment)"
          >
            <div class="user-info">
              <div class="user-left">
                <el-avatar 
                  :src="moment.avatar || moment.userAvatar" 
                  :size="40"
                  class="user-avatar"
                >
                  <i class="el-icon-user-solid"></i>
                </el-avatar>
                <div class="user-details">
                  <div class="username">{{ moment.userName || '匿名用户' }}</div>
                  <div class="post-time">{{ formatTime(moment.createdTime) }}</div>
                </div>
              </div>
            </div>
            
            <div class="post-content">
              <div class="post-text">{{ moment.content }}</div>
              <div class="post-images" v-if="getValidImages(moment.picUrlList).length">
                <img 
                  v-for="(pic, index) in getValidImages(moment.picUrlList)" 
                  :key="index"
                  :src="pic" 
                  alt="图片"
                  class="post-image"
                />
              </div>
            </div>
            
            <div class="post-actions">
              <div class="action-item" @click.stop="viewMomentDetail(moment)">
                <i class="el-icon-chat-dot-round"></i>
                <span>{{ moment.replyCount || 0 }}</span>
              </div>
              <div class="action-item">
                <i class="el-icon-star-off"></i>
                <span>收藏</span>
              </div>
              <div class="action-item">
                <i class="el-icon-share"></i>
                <span>分享</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!momentLoading && momentList.length === 0" class="empty-state">
            <i class="el-icon-chat-line-round"></i>
            <p>暂无动态</p>
          </div>

          <!-- 暂时隐藏分页，接口返回全部数据 -->
          <!-- <div class="pagination-container" v-if="pagination.total > 0">
            <el-pagination
              @current-change="handlePageChange"
              :current-page="pagination.pageNo"
              :page-size="pagination.pageSize"
              layout="prev, pager, next"
              :total="pagination.total"
            >
            </el-pagination>
          </div> -->
        </div>
      </div>
    </div>

    <!-- 动态详情对话框 -->
    <el-dialog
      title="动态详情"
      :visible.sync="detailDialogVisible"
      width="700px"
      :close-on-click-modal="false"
      custom-class="moment-detail-dialog"
    >
      <div class="moment-detail" v-if="currentMoment">
        <!-- 动态内容 -->
        <div class="detail-moment">
          <div class="user-info">
            <el-avatar 
              :src="currentMoment.avatar || currentMoment.userAvatar" 
              :size="40"
              class="user-avatar"
            >
              <i class="el-icon-user-solid"></i>
            </el-avatar>
            <div class="user-details">
              <div class="username">{{ currentMoment.userName || '匿名用户' }}</div>
              <div class="post-time">{{ formatTime(currentMoment.createdTime) }}</div>
            </div>
          </div>
          <div class="moment-content">
            <p>{{ currentMoment.content }}</p>
            <div class="moment-images" v-if="getValidImages(currentMoment.picUrlList).length">
              <img 
                v-for="(pic, index) in getValidImages(currentMoment.picUrlList)" 
                :key="index"
                :src="pic" 
                alt="图片"
                class="moment-image"
              />
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comment-section" v-loading="commentLoading">
          <div class="comment-header">
            <h4>评论 ({{ comments.length }})</h4>
          </div>
          
          <div class="comment-list">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item-wrapper"
            >
              <div class="comment-item">
                <div class="comment-header-wrapper">
                  <el-avatar 
                    :src="comment.avatar" 
                    :size="32"
                    class="comment-avatar"
                  >
                    <i class="el-icon-user-solid"></i>
                  </el-avatar>
                  <div class="comment-user-info">
                    <span class="comment-username">{{ comment.userName }}</span>
                    <span class="comment-time">{{ formatTime(comment.createdTime) }}</span>
                  </div>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
                <div class="comment-images" v-if="getValidImages(comment.picUrlList).length">
                  <img 
                    v-for="(pic, index) in getValidImages(comment.picUrlList)" 
                    :key="index"
                    :src="pic" 
                    alt="图片"
                    class="comment-image"
                  />
                </div>
                <div class="comment-actions">
                  <span class="reply-btn" @click="replyToComment(comment)">回复</span>
                </div>
              </div>

              <!-- 子回复 -->
              <div class="reply-list" v-if="comment.children && comment.children.length">
                <div 
                  v-for="reply in comment.children" 
                  :key="reply.id"
                  class="reply-item"
                >
                  <div class="comment-header-wrapper">
                    <el-avatar 
                      :src="reply.avatar" 
                      :size="28"
                      class="comment-avatar"
                    >
                      <i class="el-icon-user-solid"></i>
                    </el-avatar>
                    <div class="comment-user-info">
                      <span class="comment-username">{{ reply.userName }}</span>
                      <span class="comment-time">{{ formatTime(reply.createdTime) }}</span>
                    </div>
                  </div>
                  <div class="comment-content">{{ reply.content }}</div>
                  <div class="comment-images" v-if="getValidImages(reply.picUrlList).length">
                    <img 
                      v-for="(pic, index) in getValidImages(reply.picUrlList)" 
                      :key="index"
                      :src="pic" 
                      alt="图片"
                      class="comment-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发表评论 -->
          <div class="comment-input-section">
            <el-input
              type="textarea"
              v-model="commentForm.content"
              :placeholder="commentForm.replyType === 1 ? '发表你的评论...' : `回复 @${replyTarget?.userName}...`"
              :rows="3"
              maxlength="500"
              show-word-limit
            >
            </el-input>
            <div class="comment-actions-bar">
              <el-button 
                v-if="commentForm.replyType === 2" 
                size="small" 
                @click="cancelReply"
              >
                取消回复
              </el-button>
              <el-button 
                type="primary" 
                size="small" 
                @click="submitComment"
                :loading="commentSubmitting"
              >
                发表
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import UserMenu from '../../components/UserMenu.vue'

export default {
  name: 'CircleView',
  components: { UserMenu },
  data() {
    return {
      // 圈子相关
      circleList: [],
      currentCircleId: 0,
      circleLoading: false,
      // 标签相关
      currentTab: 'recommend',
      // 动态相关
      momentList: [],
      momentLoading: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 详情对话框
      detailDialogVisible: false,
      currentMoment: null,
      // 评论相关
      comments: [],
      commentLoading: false,
      commentForm: {
        momentId: 0,
        replyType: 1, // 1评论 2回复
        targetId: 0,
        content: '',
        picUrlList: []
      },
      replyTarget: null,
      commentSubmitting: false
    }
  },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  mounted() {
    this.fetchCircleList()
    this.fetchMoments()
  },
  methods: {
    // 获取圈子列表
    async fetchCircleList() {
      this.circleLoading = true
      try {
        const res = await axios.get('/api/circle/share/circle/list')
        if (res.data.success) {
          this.circleList = res.data.date || []
          // 默认选择第一个子圈子
          if (this.circleList.length > 0 && this.circleList[0].children && this.circleList[0].children.length > 0) {
            this.currentCircleId = this.circleList[0].children[0].id
          }
        }
      } catch (error) {
        console.error('获取圈子列表失败：', error)
        this.$message.error('获取圈子列表失败')
      } finally {
        this.circleLoading = false
      }
    },

    // 选择圈子
    selectCircle(circle) {
      this.currentCircleId = circle.id
      this.pagination.pageNo = 1
      this.fetchMoments()
    },

    // 切换标签
    switchTab(tab) {
      this.currentTab = tab
      this.pagination.pageNo = 1
      this.fetchMoments()
    },

    // 获取动态列表
    async fetchMoments() {
      // 如果是前端或后端标签，直接显示空数据
      if (this.currentTab === 'frontend' || this.currentTab === 'backend') {
        this.momentList = []
        this.pagination.total = 0
        return
      }

      // 推荐标签：从接口获取数据
      this.momentLoading = true
      try {
        const res = await axios.post('/api/circle/share/comment/list', {
          id: this.currentCircleId || 1
        })
        if (res.data.success) {
          // 获取根评论作为动态列表
          const comments = res.data.date || []
          // 只显示根评论（rootNode: true）
          this.momentList = comments.filter(item => item.rootNode === true).map(item => ({
            ...item,
            // 添加回复数统计
            replyCount: item.children ? item.children.length : 0,
            // 映射字段以保持兼容
            userAvatar: item.avatar
          }))
          this.pagination.total = this.momentList.length
        }
      } catch (error) {
        console.error('获取动态列表失败：', error)
        this.$message.error('获取动态列表失败')
      } finally {
        this.momentLoading = false
      }
    },

    // 分页改变
    handlePageChange(page) {
      this.pagination.pageNo = page
      this.fetchMoments()
    },

    // 查看动态详情
    async viewMomentDetail(moment) {
      this.currentMoment = moment
      this.detailDialogVisible = true
      this.commentForm.momentId = moment.momentId || moment.id
      this.commentForm.targetId = moment.id
      this.commentForm.replyType = 1
      // 如果已有 children 数据，直接使用，否则从接口获取
      if (moment.children && moment.children.length > 0) {
        this.comments = moment.children
      } else {
        await this.fetchComments(moment.id)
      }
    },

    // 获取评论列表
    async fetchComments(momentId) {
      this.commentLoading = true
      try {
        const res = await axios.post('/api/circle/share/comment/list', {
          id: momentId
        })
        if (res.data.success) {
          this.comments = res.data.date || []
        }
      } catch (error) {
        console.error('获取评论失败：', error)
      } finally {
        this.commentLoading = false
      }
    },

    // 回复评论
    replyToComment(comment) {
      this.commentForm.replyType = 2
      this.commentForm.targetId = comment.id
      this.replyTarget = comment
    },

    // 取消回复
    cancelReply() {
      this.commentForm.replyType = 1
      this.commentForm.targetId = this.currentMoment.id
      this.replyTarget = null
    },

    // 提交评论
    async submitComment() {
      if (!this.commentForm.content.trim()) {
        this.$message.warning('请输入评论内容')
        return
      }

      this.commentSubmitting = true
      try {
        const res = await axios.post('/api/circle/share/comment/save', {
          momentId: this.currentMoment.momentId || 1,
          replyType: this.commentForm.replyType,
          targetId: this.commentForm.targetId,
          content: this.commentForm.content,
          picUrlList: this.commentForm.picUrlList
        })
        
        if (res.data.success || res.data.date === true) {
          this.$message.success('发表成功')
          this.commentForm.content = ''
          this.cancelReply()
          // 重新获取动态列表以更新数据
          await this.fetchMoments()
          // 重新获取评论列表
          const updatedMoment = this.momentList.find(m => m.id === this.currentMoment.id)
          if (updatedMoment) {
            this.currentMoment = updatedMoment
            this.comments = updatedMoment.children || []
          }
        } else {
          this.$message.error(res.data.message || '发表失败')
        }
      } catch (error) {
        console.error('发表评论失败：', error)
        this.$message.error('发表失败，请稍后重试')
      } finally {
        this.commentSubmitting = false
      }
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return ''
      
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      // 一分钟内
      if (diff < 60000) {
        return '刚刚'
      }
      // 一小时内
      if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`
      }
      // 一天内
      if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`
      }
      // 一周内
      if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}天前`
      }
      
      // 格式化为 MM-DD HH:mm
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      
      return `${month}-${day} ${hours}:${minutes}`
    },

    // 过滤有效的图片URL
    getValidImages(picUrlList) {
      if (!picUrlList || !Array.isArray(picUrlList)) {
        return []
      }
      // 过滤掉无效的URL（如 "url"、空字符串等）
      return picUrlList.filter(url => {
        return url && 
               typeof url === 'string' && 
               url !== 'url' && 
               (url.startsWith('http://') || url.startsWith('https://'))
      })
    }
  }
}
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.social-qa-container {
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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

.btn-admin {
  background: transparent;
  color: #4a6cf8;
  border: none;
  margin-left: -6px;
}


/* 主体内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  padding: 20px;
}

/* 左侧圈子列表 */
.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.circle-list-header {
  background: white;
  padding: 15px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.circle-list-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.circle-list {
  background: white;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.circle-category {
  border-bottom: 1px solid #f0f0f0;
}

.circle-category:last-child {
  border-bottom: none;
}

.category-title {
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 600;
  color: #999;
  background: #fafafa;
}

.circle-item {
  padding: 12px 15px 12px 30px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.circle-item:hover {
  background: #f5f7fa;
}

.circle-item.active {
  background: #f0f4ff;
  border-left-color: #4a6cf8;
  color: #4a6cf8;
}

.circle-name {
  font-size: 14px;
}

/* 右侧内容区域 */
.content-area {
  flex: 1;
  min-width: 0;
}

/* 顶部标签栏样式 */
.tab-bar {
  display: flex;
  background-color: white;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.tab:hover {
  background: #f5f7fa;
}

.tab.active {
  color: #4a6cf8;
  border-bottom: 2px solid #4a6cf8;
  background: white;
}

/* 动态卡片样式 */
.feed-list {
  background: white;
  border-radius: 0 0 8px 8px;
  min-height: 400px;
}

.feed-card {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.feed-card:hover {
  background: #fafafa;
}

.feed-card:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  flex-shrink: 0;
}

.user-avatar i {
  font-size: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.post-time {
  font-size: 12px;
  color: #8590a6;
  margin-top: 2px;
}

.post-content {
  margin: 12px 0;
}

.post-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.post-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

/* 互动按钮样式 */
.post-actions {
  display: flex;
  gap: 30px;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8590a6;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  color: #4a6cf8;
}

.action-item i {
  font-size: 18px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 14px;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 动态详情对话框 */
.moment-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-moment {
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.moment-content {
  margin-left: 50px;
  margin-top: 12px;
}

.moment-content p {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.moment-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.moment-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

/* 评论区域 */
.comment-section {
  margin-top: 20px;
}

.comment-header {
  margin-bottom: 15px;
}

.comment-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.comment-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item-wrapper {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.comment-item-wrapper:last-child {
  border-bottom: none;
}

.comment-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.comment-header-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.comment-username {
  font-size: 14px;
  font-weight: 500;
  color: #4a6cf8;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
  margin-left: 42px;
}

.comment-images {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  margin-left: 42px;
}

.comment-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

.comment-actions {
  margin-top: 8px;
  margin-left: 42px;
}

.reply-btn {
  font-size: 13px;
  color: #8590a6;
  cursor: pointer;
  transition: color 0.3s;
}

.reply-btn:hover {
  color: #4a6cf8;
}

/* 子回复列表 */
.reply-list {
  margin-left: 42px;
  margin-top: 10px;
}

.reply-item {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  margin-bottom: 8px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-item .comment-content {
  margin-left: 38px;
}

.reply-item .comment-images {
  margin-left: 38px;
}

/* 评论输入区域 */
.comment-input-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.comment-actions-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

/* Element UI 头像样式覆盖 */
::v-deep .el-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

::v-deep .el-avatar i {
  font-size: 20px;
}

/* Element UI 对话框样式覆盖 */
::v-deep .moment-detail-dialog {
  border-radius: 12px;
}

::v-deep .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

::v-deep .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

::v-deep .el-dialog__body {
  padding: 24px;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #4a6cf8;
}

::v-deep .el-pagination.is-background .el-pager li:hover {
  color: #4a6cf8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    padding: 15px;
  }

  .sidebar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 15px 3%;
  }

  .nav-links {
    display: none;
  }

  .brand-logo {
    font-size: 20px;
  }

  .main-content {
    flex-direction: column;
    padding: 10px;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 15px;
  }

  .circle-list {
    max-height: none;
  }

  .circle-category {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .category-title {
    width: 100%;
  }

  .circle-item {
    flex: 0 0 auto;
    padding: 8px 15px;
  }

  .post-images {
    grid-template-columns: repeat(2, 1fr);
  }

  .post-image {
    height: 100px;
  }

  ::v-deep .el-dialog {
    width: 95% !important;
  }

  .moment-images {
    grid-template-columns: repeat(2, 1fr);
  }

  .moment-image {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 12px 2%;
  }

  .brand-logo {
    font-size: 18px;
  }

  .nav-btn {
    padding: 6px 15px;
    font-size: 14px;
  }

  .feed-card {
    padding: 15px;
  }

  ::v-deep .user-avatar {
    width: 35px !important;
    height: 35px !important;
  }

  .user-avatar i {
    font-size: 18px;
  }

  .post-text {
    font-size: 14px;
  }

  .post-actions {
    gap: 20px;
  }

  .action-item {
    font-size: 13px;
  }

  .action-item i {
    font-size: 16px;
  }

  ::v-deep .el-pagination__jump {
    display: none;
  }

  .moment-content {
    margin-left: 0;
  }

  .comment-content {
    margin-left: 38px;
  }

  .comment-images {
    margin-left: 38px;
  }

  .comment-actions {
    margin-left: 38px;
  }

  .reply-list {
    margin-left: 38px;
  }

  .reply-item .comment-content {
    margin-left: 34px;
  }

  .reply-item .comment-images {
    margin-left: 34px;
  }

  ::v-deep .comment-avatar {
    width: 30px !important;
    height: 30px !important;
  }

  .comment-avatar i {
    font-size: 16px;
  }
}
</style>
