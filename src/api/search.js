import request from '../utils/request'

// 获取联想建议
export const suggestion = q => {
  return request({
    url: '/app/v1_0/suggestion',
    params: { q }
  })
}

// 获取搜索结果
export const searchResults = params => {
  return request({
    url: '/app/v1_0/search',
    params
  })
}
