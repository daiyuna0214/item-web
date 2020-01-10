// 用户请求相关页面处理
import request from '@/utils/request.js'

// 用户登录模块
export const Login = data => {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data
  })
}
// 用户登录模块--获取短信验证码
export const getMsCode = mobile => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    mobile
  })
}
