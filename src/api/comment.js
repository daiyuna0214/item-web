// 评论接口
import request from '../utils/request'
// 获取评论
export function getComments (params) {
  return request({
    url: '/app/v1_0/comments',
    params
  })
}
// 添加评论或回复评论
export const addComments = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/comments',
    data
  })
}
// 评论点赞
export const addCommentsLike = target => {
  return request({
    method: 'post',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}
// 取消评论点赞
export const delCommentsLike = target => {
  return request({
    method: 'delete',
    url: `/app/v1_0/comment/likings/${target}`
  })
}
