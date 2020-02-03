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
// 根据id获取文章详情
export const getArticlesById = articleId => {
  return request({
    url: `/app/v1_0/articles/${articleId}`
  })
}
// 收藏文章
export const collectArticle = target => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/collections',
    data: { target }
  })
}
// 取消收藏文章
export const concelCollectArticle = target => {
  return request({
    method: 'delete',
    url: `/app/v1_0/article/collections/${target}`
  })
}
// 点赞文章
export const likeArticle = target => {
  return request({
    method: 'post',
    url: '/app/v1_0/article/likings',
    data: { target }
  })
}
// 取消点赞文章
export const concelLikeArticle = target => {
  return request({
    method: 'delete',
    url: `/app/v1_0/article/likings/${target}`
  })
}
// 获取用户收藏列表
export const getUserCollect = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/article/collections',
    params
  })
}
// 获取用户文章列表
export const getUserArticle = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/articles',
    params
  })
}
// 获取用户阅读历史列表
export const getUserHistory = params => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/histories',
    params
  })
}
