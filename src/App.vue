<template>
  <div>
       <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      message: "Hello Vu2ee",
    }
  },
  methods: {
    // 从 localStorage 恢复登录状态
    async restoreLoginStatus() {
      const token = localStorage.getItem('token')
      const email = localStorage.getItem('userEmail')
      
      if (token && email) {
        // 恢复 store 中的登录状态
        this.$store.commit('setLoginStatus', true)
        this.$store.commit('setEmail', email)
        
        // 尝试获取用户信息（昵称和头像）
        try {
          const res = await axios.post('/api/authUser/queryByEmail', {
            email: email
          })
          if (res.data && (res.data.success === true || res.data.code === 200)) {
            const user = res.data.date || res.data.data || {}
            // 设置昵称
            if (user.nickName) {
              this.$store.commit('setName', user.nickName)
            } else {
              this.$store.commit('setName', user.userName || email)
            }
            // 设置头像
            const avatar = user.avatar || ''
            if (avatar && 
                typeof avatar === 'string' && 
                avatar !== 'url' && 
                avatar.trim() !== '' &&
                (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/'))) {
              this.$store.commit('setAvatar', avatar)
            }
          }
        } catch (error) {
          console.log('获取用户信息失败，使用默认名称')
          this.$store.commit('setName', email)
        }
      }
    }
  },
  async mounted() {
    // 应用启动时恢复登录状态
    await this.restoreLoginStatus()
  }
}
</script>

<style></style>