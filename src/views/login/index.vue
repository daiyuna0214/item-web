<template>
  <div class="login-contener">
      <!-- 导航 -->
      <van-nav-bar title="注册/登录" left-arrow/>
      <!-- 输入框 -->
      <!-- 表单验证
      ValidationObserver包裹整个需要验证的表单
      ValidationProvider包裹每一条
       -->
      <ValidationObserver ref="form">
        <ValidationProvider name='手机号' rules='required|mobile' immediate>
            <van-field placeholder="请输入用户名" left-icon="phone-circle-o"
            v-model="user.mobile"/>
        </ValidationProvider>
        <ValidationProvider name='验证码' rules='required|code' immediate>
            <van-field placeholder="请输入验证码" left-icon="records" v-model="user.code">
            <!-- slot="button" 自定义输入框尾部按钮 -->
            <van-count-down  slot="button" :time="1000 * 6" format="ss s" v-if="isCountDownShow" @finish='isCountDownShow=false'/>
            <van-button slot="button" size="small" type="primary" round  v-else @click="onSendMsgCode">发送验证码</van-button>
            </van-field>
        </ValidationProvider>
      </ValidationObserver>
      <!-- 登录 -->
      <div class="login-button">
        <van-button type="info" @click="onLogin">登录</van-button>
      </div>
  </div>
</template>

<script>
import '@/styles/base.less'// 引入公共样式
import { Login, getMsCode } from '@/api/user.js'
import { validate } from 'vee-validate'
export default {
  name: 'LoginPage',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false
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
      // 调用组件的validate方法
      const success = await this.$refs.form.validate()
      if (!success) {
        // 表单验证失败处理
        alert('表单验证失败')
        // 如果需要在js验证中能马上获取到错误消息，必须给每一个ValidationProvider
        // 配置immediate初始验证
        const errors = this.$refs.form.errors// 获取错误信息
        console.log(errors)
        // 因为可能是验证码错误也可能是手机号错误，有两个，所以需要遍历
        for (let key in errors) {
          const item = errors[key]
          if (item[0]) {
            // 找到第一个有错误的消息，轻提示，并停止遍历
            this.$toast(item[0])
            return
          }
        }
        return
      } else {
        // 表单验证成功处理
      }
      // 发请求
      try {
        let { data } = await Login(user)
        // console.log(res)
        // 登录成功将后端返回的token数据存储到容器中
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        // 跳转到首页
        this.$router.push('/')
      } catch (error) {
        console.log('登录失败', error)
        this.$toast.fail('登录失败，手机号或验证码错误')
      }
    },
    async onSendMsgCode () {
      // 校验手机号是否有效
      try {
        const { mobile } = this.user
        const validateResult = await validate(mobile, 'required|mobile', {
          name: '手机号'
        })
        if (!validateResult.valid) {
          console.log(validateResult)
          // return
          this.$toast(validateResult.errors[0])
        }

        // 请求发送验证码
        await getMsCode(this.user.mobile)
        // console.log(res)
        // 显示倒计时
        this.isCountDownShow = true
      } catch (error) {
        console.log(error)
        this.isCountDownShow = false
        this.$toast('请勿频繁操作')
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
