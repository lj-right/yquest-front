<template>
  <div class="user-menu-wrapper">
    <!-- 未登录：显示 注册/登录 按钮 -->
    <router-link v-if="!isLoggedIn" to="/login" class="guest-login-btn">
      <span>注册/登录</span>
    </router-link>

    <!-- 已登录：显示用户图标 + 下拉菜单 -->
    <el-dropdown v-else trigger="click" @command="handleCommand">
      <span class="user-menu-trigger">
        <i class="el-icon-user"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="settings">账号设置</el-dropdown-item>
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
        <el-form-item label="头像URL">
          <el-input v-model="accountForm.avatar" placeholder="请输入头像地址" />
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
      return !!token && this.$store && this.$store.state && this.$store.state.hasLogin === true
    }
  },
  methods: {
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
      localStorage.removeItem('token')
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
}
.guest-login-btn {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  background: #f0f4ff;
  color: #4a6cf8;
  border: 1px solid #d9e0ff;
  text-decoration: none;
  transition: all 0.2s ease;
}
.guest-login-btn:hover {
  background: #e4e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 108, 248, 0.15);
}
.user-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f0f4ff;
  color: #4a6cf8;
  border: 1px solid #d9e0ff;
  cursor: pointer;
  transition: all 0.2s ease;
}
.user-menu-trigger:hover {
  background: #e4e7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 108, 248, 0.15);
}
.user-menu-trigger i {
  font-size: 18px;
}
</style>


