<template>
  <div class="user-menu-wrapper">
    <!-- 未登录：显示 注册/登录 按钮 -->
    <router-link v-if="!isLoggedIn" to="/login" class="guest-login-btn">
      <span>注册/登录</span>
    </router-link>

    <!-- 已登录：显示用户头像 + 下拉菜单 -->
    <el-dropdown v-else trigger="click" @command="handleCommand">
      <span class="user-menu-trigger">
        <el-avatar 
          :src="userAvatarFromStore" 
          :size="38"
          class="user-avatar-display"
        >
          <i class="el-icon-user"></i>
        </el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="settings">个人中心</el-dropdown-item>
        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 账号设置对话框 -->
    <el-dialog
      title="账号设置"
      :visible.sync="settingsVisible"
      width="520px"
      :close-on-click-modal="false"
      :modal="false"
      :lock-scroll="false"
    >
      <el-form :model="accountForm" label-width="86px">
        <el-form-item label="昵称">
          <el-input v-model="accountForm.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="accountForm.email" disabled />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="accountForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input type="textarea" :rows="3" v-model="accountForm.introduce" placeholder="一句话介绍你自己" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingsVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="saveProfile">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'UserMenu',
  data() {
    return {
      settingsVisible: false,
      saving: false,
      accountForm: {
        id: 0,
        userName: '',
        nickName: '',
        email: '',
        phone: '',
        avatar: '',
        introduce: '',
        sex: 0,
        extJson: ''
      }
    }
  },
  computed: {
    isLoggedIn() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      const hasLoginInStore = this.$store && this.$store.state && this.$store.state.hasLogin === true
      // 如果 token 存在但 store 中没有登录状态，尝试恢复
      if (token && !hasLoginInStore) {
        const email = localStorage.getItem('userEmail')
        if (email) {
          this.$store.commit('setLoginStatus', true)
          this.$store.commit('setEmail', email)
          return true
        }
      }
      return !!token && hasLoginInStore
    },
    // 从 store 获取头像，避免每次都重新加载
    userAvatarFromStore() {
      return this.$store.state.avatar || ''
    }
  },
  async mounted() {
    // 组件挂载时，如果已登录且 store 中没有头像，才获取用户头像
    if (this.isLoggedIn && !this.userAvatarFromStore) {
      await this.loadUserAvatar()
    }
  },
  watch: {
    // 监听登录状态变化，登录后如果 store 中没有头像则加载
    isLoggedIn(newVal) {
      if (!newVal) {
        this.$store.commit('setAvatar', '')
      } else if (!this.userAvatarFromStore) {
        this.loadUserAvatar()
      }
    }
  },
  methods: {
    // 加载用户头像（只在 store 中没有头像时调用）
    async loadUserAvatar() {
      if (!this.$store.state.email) return
      
      try {
        const res = await axios.post('/api/authUser/queryByEmail', {
          email: this.$store.state.email
        })
        if (res.data && (res.data.success === true || res.data.code === 200)) {
          const user = res.data.date || res.data.data || {}
          // 验证头像URL是否有效
          const avatar = user.avatar || ''
          if (avatar && 
              typeof avatar === 'string' && 
              avatar !== 'url' && 
              avatar.trim() !== '' &&
              (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
            // 存储到 store，这样所有页面都能共享
            this.$store.commit('setAvatar', avatar)
          } else {
            this.$store.commit('setAvatar', '')
          }
        }
      } catch (error) {
        console.log('获取用户头像失败:', error)
        this.$store.commit('setAvatar', '')
      }
    },
    handleCommand(cmd) {
      if (cmd === 'settings') {
        this.openSettings()
      } else if (cmd === 'logout') {
        this.handleLogout()
      }
    },
    async openSettings() {
      if (!this.$store.state.email) {
        this.$message.warning('请先登录')
        return
      }
      this.settingsVisible = true
      await this.fetchProfile()
    },
    async fetchProfile() {
      try {
        const res = await axios.post('/api/authUser/queryByEmail', {
          email: this.$store.state.email
        })
        const ok = (res.data && (res.data.success === true || res.data.code === 200))
        if (ok) {
          const u = res.data.date || res.data.data || {}
          this.accountForm = {
            id: u.id || 0,
            userName: u.userName || u.nickName || '',
            nickName: u.nickName || '',
            email: u.email || this.$store.state.email || '',
            phone: u.phone || '',
            avatar: u.avatar || '',
            introduce: u.introduce || '',
            sex: typeof u.sex === 'number' ? u.sex : 0,
            extJson: u.extJson || ''
          }
          // 更新头像显示（同步到 store）
          const avatar = u.avatar || ''
          if (avatar && 
              typeof avatar === 'string' && 
              avatar !== 'url' && 
              avatar.trim() !== '' &&
              (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
            this.$store.commit('setAvatar', avatar)
          } else {
            this.$store.commit('setAvatar', '')
          }
        } else {
          this.$message.error(res.data.message || '获取用户信息失败')
        }
      } catch (e) {
        console.error('fetchProfile error', e)
        this.$message.error('网络异常，获取用户信息失败')
      }
    },
    async saveProfile() {
      this.saving = true
      try {
        if (!this.accountForm.id) {
          this.$message.warning('用户ID缺失，无法更新资料')
          this.saving = false
          return
        }
        const payload = {
          id: this.accountForm.id,
          nickName: this.accountForm.nickName,
          email: this.accountForm.email,
          phone: this.accountForm.phone,
          avatar: this.accountForm.avatar,
          introduce: this.accountForm.introduce,
          sex: this.accountForm.sex,
          extJson: this.accountForm.extJson
        }
        const res = await axios.put('/api/authUser/edit', payload)
        const ok = (res.data && (res.data.success === true || res.data.code === 200))
        if (ok) {
          // 同步昵称展示
          if (this.accountForm.nickName) {
            this.$store.commit('setName', this.accountForm.nickName)
          }
          // 更新头像显示（同步到 store）
          const avatar = this.accountForm.avatar || ''
          if (avatar && 
              typeof avatar === 'string' && 
              avatar !== 'url' && 
              avatar.trim() !== '' &&
              (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
            this.$store.commit('setAvatar', avatar)
          } else {
            this.$store.commit('setAvatar', '')
          }
          this.$message.success('资料已更新')
          this.settingsVisible = false
        } else {
          this.$message.error(res.data.message || '资料更新失败')
        }
      } catch (e) {
        console.error('saveProfile error', e)
        this.$message.error('网络异常，资料更新失败')
      } finally {
        this.saving = false
      }
    },
    async handleLogout() {
      try {
        await axios.post('/api/authUser/auth/exit-login', {
          email: this.$store.state.email
        })
      } catch (e) {
        // 忽略网络错误，以保证能本地退出
      }
      this.$store.commit('setLoginStatus', false)
      this.$store.commit('setEmail', '')
      this.$store.commit('setName', '注册/登录')
      this.$store.commit('setAvatar', '') // 清除头像
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail') // 清除保存的邮箱
      this.$message.success({ message: '已退出登录', duration: 800 })
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.user-menu-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.guest-login-btn {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border: 1px solid transparent;
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-base);
}

.guest-login-btn:hover {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.user-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform var(--transition-fast);
  padding: 0;
  border: none;
  background: transparent;
}

.user-menu-trigger:hover {
  transform: translateY(-1px);
}

.user-menu-trigger:hover .user-avatar-display {
  box-shadow: var(--shadow-primary);
}

.user-avatar-display {
  border: 2px solid var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
  flex-shrink: 0;
}

.user-avatar-display >>> .el-avatar {
  background-color: var(--color-surface);
}

.user-avatar-display >>> .el-icon-user {
  color: var(--color-text-tertiary);
  font-size: 20px;
}

.avatar-preview {
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.preview-avatar {
  border: 2px solid var(--color-border);
}

.preview-tip {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}
</style>


