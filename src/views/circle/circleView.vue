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
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </nav>

    <!-- 主体内容区域 -->
    <div class="main-content">
      <!-- 左侧一级分类 -->
      <div class="sidebar">
        <div class="circle-list-header">
          <h3>圈子分类</h3>
        </div>
        <div class="circle-list" v-loading="circleLoading">
          <div 
            v-for="circle in circleList" 
            :key="circle.id"
            :class="['circle-item-primary', { active: currentPrimaryCircle?.id === circle.id }]"
            @click="selectPrimaryCircle(circle)"
          >
            <span class="circle-name">{{ circle.circleName }}</span>
            <span class="circle-count" v-if="circle.children">{{ circle.children.length }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 顶部操作栏：二级分类标签 + 发布按钮 -->
        <div class="content-header">
          <div class="sub-circle-tabs" v-if="currentPrimaryCircle && currentPrimaryCircle.children">
            <div 
              v-for="subCircle in currentPrimaryCircle.children" 
              :key="subCircle.id"
              :class="['sub-tab', { active: currentCircleId === subCircle.id }]"
              @click="selectSubCircle(subCircle)"
            >
              {{ subCircle.circleName }}
            </div>
          </div>
          <el-button 
            type="primary" 
            icon="el-icon-edit" 
            class="publish-btn"
            @click="openPublishDialog"
          >
            发布动态
          </el-button>
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
                  :src="getUserAvatar(moment)" 
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
            <p class="empty-title">该圈子还没有任何动态</p>
            <p class="empty-subtitle">快来发布第一条吧！成为话题引领者</p>
            <el-button type="primary" @click="openPublishDialog" class="empty-action-btn">
              发布动态
            </el-button>
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

    <!-- 发布动态对话框 -->
    <el-dialog
      title="发布动态"
      :visible.sync="publishDialogVisible"
      width="620px"
      :close-on-click-modal="false"
      custom-class="publish-dialog"
    >
      <div class="publish-form-wrapper">
        <el-form :model="publishForm" label-width="100px">
          <el-form-item label="发布内容" class="content-form-item">
            <el-input
              type="textarea"
              v-model="publishForm.content"
              placeholder="分享你的想法、经验或问题... 温馨提示：请使用文明用语，共建和谐交流环境"
              :rows="8"
              maxlength="1000"
              show-word-limit
              class="publish-textarea"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择圈子" class="circle-select-item">
            <el-select 
              v-model="publishForm.circleId" 
              placeholder="请选择要发布的圈子分类" 
              style="width: 100%"
              class="circle-select"
            >
              <el-option-group
                v-for="circle in circleList"
                :key="circle.id"
                :label="circle.circleName"
              >
                <el-option
                  v-for="subCircle in circle.children"
                  :key="subCircle.id"
                  :label="subCircle.circleName"
                  :value="subCircle.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer publish-footer">
        <el-button @click="publishDialogVisible = false" class="cancel-btn">取 消</el-button>
        <el-button 
          type="primary" 
          :loading="publishing" 
          @click="submitPublish"
          class="publish-submit-btn"
          icon="el-icon-s-promotion"
        >
          {{ publishing ? '发布中...' : '发 布' }}
        </el-button>
      </div>
    </el-dialog>

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
              :src="getUserAvatar(currentMoment)" 
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
                    :src="getUserAvatar(comment)" 
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
              <div class="reply-list" v-if="comment.children && comment.children.length > 0">
                <div 
                  v-for="reply in getDisplayReplies(comment)" 
                  :key="reply.id"
                  class="reply-item"
                >
                  <div class="comment-header-wrapper">
                    <el-avatar 
                      :src="getUserAvatar(reply)" 
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
                  <div class="comment-content">
                    <span v-if="reply.toId && reply.toId !== reply.fromId" class="reply-to-user">@{{ reply.toUserName || '用户' }} </span>
                    {{ reply.content }}
                  </div>
                  <div class="comment-images" v-if="getValidImages(reply.picUrlList).length">
                    <img 
                      v-for="(pic, index) in getValidImages(reply.picUrlList)" 
                      :key="index"
                      :src="pic" 
                      alt="图片"
                      class="comment-image"
                    />
                  </div>
                  <div class="comment-actions">
                    <span class="reply-btn" @click.stop="replyToComment(reply)">回复</span>
                  </div>
                </div>
                <!-- 展开/折叠按钮 -->
                <div 
                  v-if="comment.children.length > 3" 
                  class="reply-toggle"
                  @click="toggleReplies(comment.id)"
                >
                  <span class="toggle-text">
                    {{ isRepliesExpanded(comment.id) ? '收起' : `展开更多回复 (${comment.children.length - 3}条)` }}
                  </span>
                  <i :class="['el-icon', isRepliesExpanded(comment.id) ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 发表评论 -->
          <div class="comment-input-section">
            <div class="comment-tips">
              <i class="el-icon-info"></i>
              <span>文明交流，理性讨论 · 遵守社区准则</span>
            </div>
            <div v-if="!$store.state.hasLogin" class="login-prompt">
              <i class="el-icon-warning"></i>
              <span>请先 <router-link to="/login" class="login-link">登录</router-link> 后再发表评论</span>
            </div>
            <el-input
              v-else
              type="textarea"
              v-model="commentForm.content"
              :placeholder="commentForm.replyType === 1 ? '写下你的评论...（文明交流，理性讨论）' : `回复 @${replyTarget?.userName}：表达你的看法...`"
              :rows="4"
              maxlength="500"
              show-word-limit
              class="comment-textarea"
            >
            </el-input>
            <div class="comment-actions-bar" v-if="$store.state.hasLogin">
              <div class="comment-notice">
                <i class="el-icon-warning-outline"></i>
                <span>提示：评论内容将经过敏感词检测</span>
              </div>
              <div class="comment-btns">
                <el-button 
                  v-if="commentForm.replyType === 2" 
                  size="small" 
                  @click="cancelReply"
                  class="cancel-reply-btn"
                >
                  取消回复
                </el-button>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="submitComment"
                  :loading="commentSubmitting"
                  class="submit-comment-btn"
                  icon="el-icon-s-promotion"
                >
                  {{ commentSubmitting ? '发表中...' : '发表' }}
                </el-button>
              </div>
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
import NotificationBell from '../../components/NotificationBell.vue'

export default {
  name: 'CircleView',
  components: { UserMenu, NotificationBell },
  data() {
    return {
      // 圈子相关
      circleList: [],
      currentPrimaryCircle: null, // 当前选中的一级分类
      currentCircleId: 0, // 当前选中的二级分类ID
      circleLoading: false,
      // 动态相关
      momentList: [],
      momentLoading: false,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 发布动态
      publishDialogVisible: false,
      publishing: false,
      publishForm: {
        circleId: 0,
        content: '',
        picUrlList: []
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
      commentSubmitting: false,
      // 回复折叠控制
      expandedReplies: {} // { commentId: true/false }
    }
  },
  computed: {
    // 判断是否为管理员用户
    isAdminUser() {
      return this.$store.state.email === 'suifeng.king@qq.com'
    }
  },
  async mounted() {
    await this.fetchCircleList()
    this.fetchMoments()
  },
  methods: {
    // 获取圈子列表
    async fetchCircleList() {
      this.circleLoading = true
      try {
        const res = await axios.get('/api/circle/share/circle/list')
        if (res.data.success || res.data.code === 200) {
          this.circleList = res.data.date || res.data.data || []
          // 默认选择第一个一级分类及其第一个子分类
          if (this.circleList.length > 0) {
            this.currentPrimaryCircle = this.circleList[0]
            if (this.currentPrimaryCircle.children && this.currentPrimaryCircle.children.length > 0) {
              this.currentCircleId = this.currentPrimaryCircle.children[0].id
            }
          }
        } else {
          this.$message.error('获取圈子列表失败')
        }
      } catch (error) {
        this.$message.error('获取圈子列表失败')
      } finally {
        this.circleLoading = false
      }
    },

    // 选择一级分类
    selectPrimaryCircle(circle) {
      this.currentPrimaryCircle = circle
      // 自动选择该分类下的第一个子分类
      if (circle.children && circle.children.length > 0) {
        this.currentCircleId = circle.children[0].id
      } else {
        this.currentCircleId = 0
      }
      this.pagination.pageNo = 1
      this.fetchMoments()
    },

    // 选择二级分类
    selectSubCircle(subCircle) {
      this.currentCircleId = subCircle.id
      this.pagination.pageNo = 1
      this.fetchMoments()
    },

    // 获取动态列表
    async fetchMoments() {
      // 使用二级分类ID来获取动态列表
      if (!this.currentCircleId) {
        this.momentList = []
        return
      }

      this.momentLoading = true
      try {
        const res = await axios.post('/api/circle/share/moment/getMoments', {
          circleId: this.currentCircleId,
          pageInfo: {
            pageNo: this.pagination.pageNo,
            pageSize: this.pagination.pageSize
          }
        })
        
        if (res.data.success || res.data.code === 200) {
          const result = res.data.date || res.data.data || {}
          this.momentList = result.result || []
          this.pagination.total = result.total || 0
        } else {
          this.$message.error(res.data.message || '获取动态列表失败')
        }
      } catch (error) {
        console.error('获取动态列表失败:', error)
        this.$message.error('获取动态列表失败')
      } finally {
        this.momentLoading = false
      }
    },

    // 打开发布对话框
    openPublishDialog() {
      if (!this.$store.state.hasLogin) {
        this.$message.warning('请先登录后再发布动态')
        this.$router.push('/login')
        return
      }
      this.publishForm.circleId = this.currentCircleId || 0
      this.publishDialogVisible = true
    },

    // 提交发布
    async submitPublish() {
      if (!this.publishForm.content.trim()) {
        this.$message.warning('请输入动态内容')
        return
      }
      if (!this.publishForm.circleId) {
        this.$message.warning('请选择圈子')
        return
      }

      this.publishing = true
      try {
        // 根据接口文档，发布动态使用 /circle/share/moment/save
        const res = await axios.post('/api/circle/share/moment/save', {
          circleId: this.publishForm.circleId,
          content: this.publishForm.content,
          picUrlList: this.publishForm.picUrlList.length > 0 ? this.publishForm.picUrlList : []
        })
        
        if (res.data.success || res.data.date === true) {
          this.$message.success({
            message: '动态发布成功！已分享到圈子',
            duration: 1500
          })
          this.publishForm.content = ''
          this.publishForm.picUrlList = []
          this.publishDialogVisible = false
          // 刷新动态列表
          await this.fetchMoments()
        } else {
          this.$message.error(res.data.message || '发布失败，请稍后重试')
        }
      } catch (error) {
        console.error('发布失败:', error)
        this.$message.error('发布失败，请稍后重试')
      } finally {
        this.publishing = false
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
      this.commentForm.momentId = moment.id
      this.commentForm.targetId = moment.id
      this.commentForm.replyType = 1
      this.replyTarget = null
      this.expandedReplies = {} // 重置展开状态
      // 使用动态ID查询评论列表
      await this.fetchComments(moment.id)
    },

    // 获取评论列表（使用动态ID）
    async fetchComments(momentId) {
      this.commentLoading = true
      try {
        const res = await axios.post('/api/circle/share/comment/list', {
          id: momentId
        })
        if (res.data.success || res.data.code === 200) {
          this.comments = res.data.date || res.data.data || []
        } else {
          this.$message.error(res.data.message || '获取评论失败')
        }
      } catch (error) {
        console.error('获取评论失败:', error)
        this.$message.error('获取评论失败')
      } finally {
        this.commentLoading = false
      }
    },

    // 回复评论
    replyToComment(comment) {
      if (!this.$store.state.hasLogin) {
        this.$message.warning('请先登录后再回复评论')
        this.$router.push('/login')
        return
      }
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

    // 切换回复展开/折叠
    toggleReplies(commentId) {
      this.$set(this.expandedReplies, commentId, !this.expandedReplies[commentId])
    },

    // 判断回复是否展开
    isRepliesExpanded(commentId) {
      return this.expandedReplies[commentId] === true
    },

    // 获取显示的回复列表（如果折叠则只显示前3条）
    getDisplayReplies(comment) {
      if (!comment.children || comment.children.length === 0) {
        return []
      }
      const isExpanded = this.isRepliesExpanded(comment.id)
      if (isExpanded || comment.children.length <= 3) {
        return comment.children
      }
      return comment.children.slice(0, 3)
    },

    // 提交评论
    async submitComment() {
      if (!this.$store.state.hasLogin) {
        this.$message.warning('请先登录后再发表评论')
        this.$router.push('/login')
        return
      }
      
      if (!this.commentForm.content.trim()) {
        this.$message.warning('请输入评论内容')
        return
      }

      this.commentSubmitting = true
      try {
        // 根据接口文档：
        // replyType: 1 表示评论动态，2 表示回复评论
        // momentId: 动态的ID
        // targetId: 评论时为动态ID，回复时为被回复的评论ID
        const res = await axios.post('/api/circle/share/comment/save', {
          momentId: this.currentMoment.id,
          replyType: this.commentForm.replyType,
          targetId: this.commentForm.targetId,
          content: this.commentForm.content,
          picUrlList: this.commentForm.picUrlList.length > 0 ? this.commentForm.picUrlList : []
        })
        
        if (res.data.success || res.data.date === true) {
          this.$message.success({
            message: this.commentForm.replyType === 1 ? '评论成功发表' : '回复成功发表',
            duration: 1200
          })
          this.commentForm.content = ''
          this.cancelReply()
          // 重新获取评论列表
          await this.fetchComments(this.currentMoment.id)
          // 重新获取动态列表以更新回复数
          await this.fetchMoments()
        } else {
          this.$message.error(res.data.message || '发表失败，请稍后重试')
        }
      } catch (error) {
        this.$message.error('网络异常，发表失败')
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
    },

    // 获取用户头像URL，如果无效则返回空字符串（显示默认图标）
    getUserAvatar(user) {
      if (!user) return ''
      // 尝试多种可能的头像字段名
      const avatar = user.avatar || user.userAvatar || ''
      // 验证头像URL是否有效
      if (avatar && 
          typeof avatar === 'string' && 
          avatar !== 'url' && 
          avatar.trim() !== '' &&
          (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
        return avatar
      }
      // 如果头像无效，返回空字符串，el-avatar 会显示默认图标
      return ''
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
  padding: 11px 5%; /* 调整padding以配合固定高度 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px; /* 固定导航栏高度 */
  box-sizing: border-box;
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
  display: inline-flex;
  align-items: center;
  line-height: 1.5; /* 确保文本垂直居中 */
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
  align-items: center;
  height: 38px; /* 固定高度，与UserMenu高度一致 */
}

.nav-actions > div {
  display: flex;
  align-items: center;
  height: 38px;
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

/* 左侧一级分类列表 */
.sidebar {
  width: 220px;
  flex-shrink: 0;
}

.circle-list-header {
  background: white;
  padding: 16px;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #f0f0f0;
}

.circle-list-header h3 {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.circle-list {
  background: white;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  padding: 8px 0;
}

.circle-item-primary {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 8px;
  border-radius: 8px;
  position: relative;
}

.circle-item-primary:hover {
  background: #f5f7fa;
}

.circle-item-primary.active {
  background: linear-gradient(90deg, #f0f4ff 0%, #e8ecff 100%);
  color: #4a6cf8;
  font-weight: 500;
}

.circle-name {
  font-size: 14px;
  flex: 1;
}

.circle-count {
  font-size: 12px;
  color: #8590a6;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 右侧内容区域 */
.content-area {
  flex: 1;
  min-width: 0;
}

/* 顶部操作栏：二级标签 + 发布按钮 */
.content-header {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sub-circle-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.sub-tab {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  color: #666;
  background: #f5f7fa;
  border: 1px solid transparent;
}

.sub-tab:hover {
  background: #e8ecff;
  color: #4a6cf8;
}

.sub-tab.active {
  background: linear-gradient(to right, #4a6cf8, #6a7cf8);
  color: white;
  box-shadow: 0 2px 8px rgba(74, 108, 248, 0.25);
}

.publish-btn {
  flex-shrink: 0;
  border-radius: 20px;
  font-weight: 500;
  padding: 8px 20px;
  box-shadow: 0 2px 8px rgba(74, 108, 248, 0.2);
}

/* 动态卡片样式 */
.feed-list {
  background: white;
  border-radius: 0 0 12px 12px;
  min-height: 500px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
}

/* 美化滚动条 */
.feed-list::-webkit-scrollbar {
  width: 6px;
}

.feed-list::-webkit-scrollbar-track {
  background: transparent;
}

.feed-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.feed-list::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.feed-card {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
}

.feed-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, #4a6cf8, #6a7cf8);
  transition: height 0.3s;
}

.feed-card:hover {
  background: #fafbfc;
}

.feed-card:hover::before {
  height: 100%;
}

.feed-card:last-child {
  border-bottom: none;
  border-radius: 0 0 12px 12px;
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
  padding: 80px 20px;
  background: white;
}

.empty-state i {
  font-size: 80px;
  color: #d9e0ff;
  margin-bottom: 20px;
  display: block;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtitle {
  font-size: 14px;
  color: #8590a6;
  margin-bottom: 24px;
}

.empty-action-btn {
  border-radius: 20px;
  padding: 10px 28px;
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

.reply-to-user {
  color: #4a6cf8;
  font-weight: 500;
  margin-right: 4px;
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

.reply-item .comment-actions {
  margin-left: 38px;
  margin-top: 8px;
}

/* 展开/折叠回复按钮 */
.reply-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.reply-toggle:hover {
  background: #e8ecff;
  color: #4a6cf8;
}

.toggle-text {
  font-size: 13px;
  color: #8590a6;
  font-weight: 500;
  transition: color 0.3s;
}

.reply-toggle:hover .toggle-text {
  color: #4a6cf8;
}

.reply-toggle i {
  font-size: 14px;
  color: #8590a6;
  transition: all 0.3s;
}

.reply-toggle:hover i {
  color: #4a6cf8;
}

/* 未登录提示 */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(to right, #fff7e6, #fffbf0);
  border: 1px dashed #ffd591;
  border-radius: 8px;
  margin-bottom: 12px;
}

.login-prompt i {
  font-size: 18px;
  color: #fa8c16;
}

.login-prompt span {
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #4a6cf8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-link:hover {
  color: #6a7cf8;
  text-decoration: underline;
}

/* 评论输入区域 */
.comment-input-section {
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafbfc;
  border-radius: 8px;
}

.comment-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: linear-gradient(to right, #f0f4ff, #f8f9ff);
  border-radius: 6px;
  font-size: 13px;
  color: #4a6cf8;
}

.comment-tips i {
  font-size: 16px;
}

.comment-textarea {
  margin-bottom: 12px;
}

::v-deep .comment-textarea .el-textarea__inner {
  border: 2px solid #e5e6eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s;
  background: white;
}

::v-deep .comment-textarea .el-textarea__inner:focus {
  border-color: #4a6cf8;
  box-shadow: 0 0 0 3px rgba(74, 108, 248, 0.1);
}

.comment-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.comment-notice {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #8590a6;
}

.comment-notice i {
  font-size: 14px;
  color: #f5a623;
}

.comment-btns {
  display: flex;
  gap: 10px;
}

.cancel-reply-btn {
  border-radius: 8px;
  border-color: #e5e6eb;
  color: #666;
  background: #fff;
  padding: 8px 16px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.cancel-reply-btn:hover {
  border-color: #d1d5db;
  background: #f9fafb;
  color: #333;
}

.submit-comment-btn {
  border-radius: 8px;
  background: linear-gradient(135deg, #4a6cf8 0%, #8a4af8 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(74, 108, 248, 0.3);
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.submit-comment-btn:hover {
  background: linear-gradient(135deg, #5b7cf9 0%, #9a5af9 100%);
  box-shadow: 0 4px 12px rgba(74, 108, 248, 0.4);
  transform: translateY(-1px);
}

.submit-comment-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(74, 108, 248, 0.3);
}

.submit-comment-btn.is-loading {
  opacity: 0.8;
  cursor: not-allowed;
}

/* 按钮图标样式优化 */
::v-deep .submit-comment-btn .el-icon-s-promotion {
  font-size: 16px;
  font-weight: 600;
}

/* Element UI 头像样式覆盖 */
::v-deep .el-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

::v-deep .el-avatar i {
  font-size: 20px;
}

/* 发布对话框样式 */
::v-deep .publish-dialog {
  border-radius: 16px;
  overflow: hidden;
}

::v-deep .publish-dialog .el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to right, #f8f9ff, #f5f7ff);
}

::v-deep .publish-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

::v-deep .publish-dialog .el-dialog__body {
  padding: 24px;
  background: #fafbfc;
}

.publish-form-wrapper {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.content-form-item {
  margin-bottom: 20px;
}

/* 统一标签样式，确保发布内容和选择圈子对齐 */
::v-deep .content-form-item .el-form-item__label,
::v-deep .circle-select-item .el-form-item__label {
  text-align: left;
  line-height: 40px;
  padding: 0 12px 0 0;
}

.publish-textarea {
  border-radius: 8px;
}

::v-deep .publish-textarea .el-textarea__inner {
  border: 2px solid #e5e6eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s;
}

::v-deep .publish-textarea .el-textarea__inner:focus {
  border-color: #4a6cf8;
  box-shadow: 0 0 0 3px rgba(74, 108, 248, 0.1);
}

.circle-select-item {
  margin-bottom: 0;
}

::v-deep .circle-select .el-input__inner {
  border-radius: 8px;
  border: 2px solid #e5e6eb;
  transition: all 0.3s;
}

::v-deep .circle-select .el-input__inner:focus {
  border-color: #4a6cf8;
}

.publish-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: #fafbfc;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  border-radius: 8px;
  padding: 9px 20px;
}

.publish-submit-btn {
  border-radius: 8px;
  padding: 9px 24px;
  background: linear-gradient(to right, #4a6cf8, #6a7cf8);
  border: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(74, 108, 248, 0.3);
}

.publish-submit-btn:hover {
  box-shadow: 0 4px 12px rgba(74, 108, 248, 0.4);
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
    padding: 11px 3%; /* 保持固定高度 */
    height: 60px; /* 确保固定高度 */
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
    padding: 11px 2%; /* 保持固定高度 */
    height: 60px; /* 确保固定高度 */
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
