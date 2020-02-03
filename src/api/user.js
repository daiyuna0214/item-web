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
// 获取登录用户个人资料
export const getUserInfo = data => {
  return request({
    url: '/app/v1_0/user'
  })
}
// 获取指定用户个人信息
export const getUserInfoById = userId => {
  return request({
    url: `/app/v1_0/users/${userId}`
  })
}
// 关住用户
export const followUser = target => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: { target// target:被关住用户的id
    }
  })
}
// 取消关住用户
export const concelFollowUser = target => {
  return request({
    // target:被关住用户的id
    url: `/app/v1_0/user/followings/${target}`,
    method: 'delete'
  })
}

// 获取用户资料

export const getUserProfile = () => {
  return request({
    url: '/app/v1_0/user/profile'
  })
}

// 更新用户头像

export const updateUserPhoto = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/photo',
    data
  })
}
// 更新用户资料

export const updateUserProfile = data => {
  return request({
    method: 'patch',
    url: '/app/v1_0/user/profile',
    data
  })
}
