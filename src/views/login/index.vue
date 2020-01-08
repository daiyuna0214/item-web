<template>
  <div class="login-contener">
      <!-- 导航 -->
      <van-nav-bar title="注册/登录" left-arrow/>
      <!-- 输入框 -->
      <van-cell-group>
         <van-field placeholder="请输入用户名" left-icon="phone-circle-o"
         v-model="user.mobile"/>
        <van-field placeholder="请输入验证码" left-icon="records" v-model="user.code">
         <van-button slot="button" size="small" type="primary" round>发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <!-- 登录 -->
      <div class="login-button">
        <van-button type="info" @click="onLogin">登录</van-button>
      </div>
  </div>
</template>

<script>
import '@/styles/base.less'// 引入公共样式
import { Login } from '@/api/user.js'
export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async onLogin () {
    // 加载提示
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true
      })
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 发请求
      try {
        let res = await Login(user)
        console.log(res)
        this.$toast.success('登录成功')
      } catch (error) {
        console.log('登录失败', error)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-contener{
  .login-button{
    padding: 26px 16px;
    display: flex;
    .van-button{
      width: 100%;
      background-color: #6db4fb;
    }
  }
}
</style>
