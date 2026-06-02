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
              <div class="action-item" :class="{ 'liked': getLikeData(moment.id, 0).isLiked }" @click.stop="toggleLike(moment.id, 0)">
                <i :class="getLikeData(moment.id, 0).isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                <span>{{ getLikeData(moment.id, 0).account || 0 }}</span>
              </div>
              <div class="action-item" @click.stop="viewMomentDetail(moment)">
                <i class="el-icon-chat-dot-round"></i>
                <span>{{ moment.replyCount || 0 }}</span>
              </div>
              <div class="action-item">
                <i class="el-icon-star-off"></i>
                <span>收藏</span>
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
                  <span class="like-btn" :class="{ 'liked': getLikeData(comment.id, 1).isLiked }" @click.stop="toggleLike(comment.id, 1)">
                    <i :class="getLikeData(comment.id, 1).isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                    {{ getLikeData(comment.id, 1).account || 0 }}
                  </span>
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
                    <span class="like-btn" :class="{ 'liked': getLikeData(reply.id, 2).isLiked }" @click.stop="toggleLike(reply.id, 2)">
                      <i :class="getLikeData(reply.id, 2).isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
                      {{ getLikeData(reply.id, 2).account || 0 }}
                    </span>
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
      expandedReplies: {}, // { commentId: true/false }
      // 点赞状态存储
      momentLikes: {}, // { momentId: { isLiked: false, account: 0 } }
      commentLikes: {}, // { commentId: { isLiked: false, account: 0 } }
      replyLikes: {} // { replyId: { isLiked: false, account: 0 } }
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
          // 初始化点赞状态
          if (this.$store.state.hasLogin) {
            this.initMomentLikes(this.momentList)
          }
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
          // 初始化评论点赞状态
          if (this.$store.state.hasLogin) {
            this.initCommentLikes(this.comments)
          }
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
    },

    // ========== 点赞功能 ==========
    // 获取点赞状态和数量
    async fetchLikeStatus(id, type) {
      try {
        const res = await axios.post('/api/shareLike/isLiked', {
          momentId: type === 0 ? id : 0,
          commentId: type === 1 || type === 2 ? id : 0,
          type: type
        })
        if (res.data.code === 200) {
          return res.data.date || false
        }
        return false
      } catch (error) {
        console.error('获取点赞状态失败:', error)
        return false
      }
    },

    // 获取点赞数量
    async fetchLikeCount(id, type) {
      try {
        const res = await axios.post('/api/shareLike/getAccount', {
          momentId: type === 0 ? id : 0,
          commentId: type === 1 || type === 2 ? id : 0,
          type: type
        })
        if (res.data.code === 200) {
          return res.data.date || 0
        }
        return 0
      } catch (error) {
        console.error('获取点赞数量失败:', error)
        return 0
      }
    },

    // 初始化动态点赞状态
    async initMomentLikes(momentList) {
      for (const moment of momentList) {
        const isLiked = await this.fetchLikeStatus(moment.id, 0)
        const account = await this.fetchLikeCount(moment.id, 0)
        this.$set(this.momentLikes, moment.id, { isLiked, account })
      }
    },

    // 初始化评论点赞状态
    async initCommentLikes(comments) {
      for (const comment of comments) {
        const isLiked = await this.fetchLikeStatus(comment.id, 1)
        const account = await this.fetchLikeCount(comment.id, 1)
        this.$set(this.commentLikes, comment.id, { isLiked, account })
        // 处理回复
        if (comment.children && comment.children.length > 0) {
          for (const reply of comment.children) {
            const replyIsLiked = await this.fetchLikeStatus(reply.id, 2)
            const replyAccount = await this.fetchLikeCount(reply.id, 2)
            this.$set(this.replyLikes, reply.id, { isLiked: replyIsLiked, account: replyAccount })
          }
        }
      }
    },

    // 点赞/取消点赞
    async toggleLike(id, type) {
      if (!this.$store.state.hasLogin) {
        this.$message.warning('请先登录后再点赞')
        this.$router.push('/login')
        return
      }

      let likeData
      if (type === 0) {
        likeData = this.momentLikes[id] || { isLiked: false, account: 0 }
      } else if (type === 1) {
        likeData = this.commentLikes[id] || { isLiked: false, account: 0 }
      } else {
        likeData = this.replyLikes[id] || { isLiked: false, account: 0 }
      }

      try {
        const res = await axios.post('/api/shareLike/add', {
          momentId: type === 0 ? id : 0,
          commentId: type === 1 || type === 2 ? id : 0,
          type: type
        })
        
        if (res.data.code === 200 && res.data.date === true) {
          // 更新本地状态
          const newIsLiked = !likeData.isLiked
          const newAccount = newIsLiked ? likeData.account + 1 : Math.max(0, likeData.account - 1)
          
          if (type === 0) {
            this.$set(this.momentLikes, id, { isLiked: newIsLiked, account: newAccount })
          } else if (type === 1) {
            this.$set(this.commentLikes, id, { isLiked: newIsLiked, account: newAccount })
          } else {
            this.$set(this.replyLikes, id, { isLiked: newIsLiked, account: newAccount })
          }
          
          this.$message.success(newIsLiked ? '点赞成功' : '已取消点赞')
        } else {
          this.$message.error(res.data.message || '操作失败')
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
        this.$message.error('网络异常，操作失败')
      }
    },

    // 获取点赞数据
    getLikeData(id, type) {
      if (type === 0) {
        return this.momentLikes[id] || { isLiked: false, account: 0 }
      } else if (type === 1) {
        return this.commentLikes[id] || { isLiked: false, account: 0 }
      } else {
        return this.replyLikes[id] || { isLiked: false, account: 0 }
      }
    }
  }
}
</script>

<style scoped>
/* ── Circle/Social QA ─────────────────────────── */
.social-qa-container {
  background: var(--color-bg);
  min-height: 100vh;
  font-family: var(--font-family);
  color: var(--color-text-primary);
}

/* ── Main layout ──────────────────────────────── */
.main-content {
  max-width: var(--content-max-width);
  margin: 0 auto;
  display: flex;
  gap: var(--space-5);
  padding: var(--space-5);
}

/* Sidebar */
.sidebar {
  width: 220px;
  flex-shrink: 0;
}

.circle-list-header {
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  border-bottom: 1px solid var(--color-border);
}

.circle-list-header h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.circle-list {
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
  padding: var(--space-2) 0;
  box-shadow: var(--shadow-sm);
}

.circle-item-primary {
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1px var(--space-2);
  border-radius: var(--radius-md);
}

.circle-item-primary:hover { background: var(--color-bg); }

.circle-item-primary.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: var(--font-medium);
}

.circle-name { font-size: var(--text-sm); flex: 1; }

.circle-count {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  background: var(--color-bg);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
}

/* Content area */
.content-area { flex: 1; min-width: 0; }

.content-header {
  background: var(--color-surface);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-3) var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.sub-circle-tabs { display: flex; gap: var(--space-2); flex-wrap: wrap; flex: 1; }

.sub-tab {
  padding: 6px var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1px solid transparent;
}

.sub-tab:hover { background: var(--color-primary-soft); color: var(--color-primary); }

.sub-tab.active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Feed cards */
.feed-list {
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  min-height: 400px;
  max-height: calc(100vh - 240px);
  overflow-y: auto;
  box-shadow: var(--shadow-sm);
}

.feed-list::-webkit-scrollbar { width: 5px; }
.feed-list::-webkit-scrollbar-track { background: transparent; }
.feed-list::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }

.feed-card {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.feed-card:hover { background: var(--color-surface-hover); }
.feed-card:last-child { border-bottom: none; }

.user-info { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
.user-left { display: flex; align-items: center; gap: var(--space-3); }
.user-avatar { flex-shrink: 0; }

.username { font-weight: var(--font-medium); font-size: var(--text-sm); color: var(--color-text-primary); }
.post-time { font-size: var(--text-xs); color: var(--color-text-tertiary); }

.post-content { margin: var(--space-3) 0; }
.post-text {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
  word-wrap: break-word;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.post-image {
  width: 100%; height: 120px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.post-actions {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-light);
}

.action-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.action-item:hover { color: var(--color-primary); }
.action-item.liked { color: var(--color-danger); }
.action-item.liked:hover { color: #F87171; }
.action-item i { font-size: 18px; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: var(--space-20) var(--space-5);
  background: var(--color-surface);
}

.empty-state i {
  font-size: 64px;
  color: var(--color-border);
  margin-bottom: var(--space-4);
  display: block;
}

.empty-title { font-size: var(--text-base); font-weight: var(--font-medium); color: var(--color-text-primary); }
.empty-subtitle { font-size: var(--text-sm); color: var(--color-text-tertiary); margin-bottom: var(--space-6); }

/* ── Detail Dialog ────────────────────────────── */
.moment-detail { max-height: 70vh; overflow-y: auto; }
.detail-moment { padding-bottom: var(--space-5); border-bottom: 1px solid var(--color-border); }

.moment-content { margin-left: 50px; margin-top: var(--space-3); }
.moment-content p { font-size: var(--text-sm); line-height: 1.8; color: var(--color-text-primary); white-space: pre-wrap; }

.moment-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); margin-top: var(--space-4); }
.moment-image { width: 100%; height: 150px; object-fit: cover; border-radius: var(--radius-md); cursor: pointer; }

/* Comments */
.comment-section { margin-top: var(--space-5); }
.comment-header { margin-bottom: var(--space-4); }
.comment-header h4 { font-size: var(--text-base); font-weight: var(--font-semibold); }

.comment-list { max-height: 350px; overflow-y: auto; }

.comment-item-wrapper {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}
.comment-item-wrapper:last-child { border-bottom: none; }

.comment-item { padding: var(--space-3); background: var(--color-bg); border-radius: var(--radius-md); }

.comment-header-wrapper { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2); }
.comment-avatar { flex-shrink: 0; }

.comment-username { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-primary); }
.comment-time { font-size: var(--text-xs); color: var(--color-text-tertiary); }

.comment-content {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
  margin-left: 42px;
}

.reply-to-user { color: var(--color-primary); font-weight: var(--font-medium); }

.comment-images { display: flex; gap: var(--space-2); margin-top: var(--space-2); margin-left: 42px; }
.comment-image { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); cursor: pointer; }

.comment-actions { margin-top: var(--space-2); margin-left: 42px; display: flex; gap: var(--space-4); }

.like-btn, .reply-btn {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}
.like-btn:hover, .reply-btn:hover { color: var(--color-primary); }
.like-btn.liked { color: var(--color-danger); }

/* Reply list */
.reply-list { margin-left: 42px; margin-top: var(--space-2); }
.reply-item { padding: var(--space-2); background: var(--color-surface); border-radius: var(--radius-sm); margin-bottom: var(--space-2); }
.reply-item .comment-content { margin-left: 38px; }
.reply-item .comment-images { margin-left: 38px; }
.reply-item .comment-actions { margin-left: 38px; }

.reply-toggle {
  display: flex; align-items: center; justify-content: center;
  gap: var(--space-1); margin-top: var(--space-2); padding: var(--space-2);
  background: var(--color-bg); border-radius: var(--radius-sm);
  cursor: pointer; transition: all var(--transition-fast); user-select: none;
}
.reply-toggle:hover { background: var(--color-primary-soft); color: var(--color-primary); }
.toggle-text { font-size: var(--text-xs); color: var(--color-text-tertiary); }

/* Login prompt */
.login-prompt {
  display: flex; align-items: center; justify-content: center;
  gap: var(--space-2); padding: var(--space-5);
  background: var(--color-warning-light);
  border: 1px dashed #FCD34D;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}
.login-prompt i { font-size: 18px; color: var(--color-warning); }
.login-prompt span { font-size: var(--text-sm); color: var(--color-text-secondary); }
.login-link { color: var(--color-primary); text-decoration: none; font-weight: var(--font-medium); }

/* Comment input */
.comment-input-section {
  margin-top: var(--space-5); padding: var(--space-5);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg); border-radius: var(--radius-md);
}

.comment-tips {
  display: flex; align-items: center; gap: var(--space-2);
  margin-bottom: var(--space-3); padding: var(--space-2) var(--space-3);
  background: var(--color-primary-soft); border-radius: var(--radius-sm);
  font-size: var(--text-xs); color: var(--color-primary);
}

.comment-actions-bar { display: flex; justify-content: space-between; align-items: center; }
.comment-notice { display: flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); color: var(--color-text-tertiary); }
.comment-notice i { font-size: 14px; color: var(--color-warning); }
.comment-btns { display: flex; gap: var(--space-2); }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .main-content { flex-direction: column; padding: var(--space-3); }
  .sidebar { width: 100%; }
  .post-images { grid-template-columns: repeat(2, 1fr); }
  .post-image { height: 100px; }
  .moment-images { grid-template-columns: repeat(2, 1fr); }
  .moment-image { height: 120px; }
  .moment-content { margin-left: 0; }
  .comment-content, .comment-images, .comment-actions { margin-left: 38px; }
  .reply-list { margin-left: 38px; }
}

@media (max-width: 480px) {
  .feed-card { padding: var(--space-4); }
  .post-text { font-size: var(--text-sm); }
  .post-actions { gap: var(--space-5); }
}
</style>
