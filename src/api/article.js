// 有关文章的接口页面处理
import request from '@/utils/request.js'

// 获取指定用户的文章列表
export const getArticleById = (userId, params) => {
  return request({
    url: `/app/v1_0/users/${userId}/articles`,
    params
  })
}
// 获取频道新闻推荐
export const getArticleByChannel = (params) => {
  return request({
    url: '/app/v1_1/articles',
    params
  })
}
