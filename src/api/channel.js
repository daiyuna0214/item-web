// 处理频道相关的内容
import request from '../utils/request'

// 获取用户频道
export const getChannel = () => {
  return request({
    url: '/app/v1_0/user/channels'
  })
}

// 获取所有频道
export const getAllChannel = () => {
  return request({
    url: '/app/v1_0/channels'
  })
}
