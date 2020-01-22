<template>
  <div class="comment-reply">
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" />
    </van-nav-bar>
    <!-- 当前评论 -->
    <comment-item :comment="comment" />
    <!-- /当前评论 -->
    <van-cell title="所有回复" />
    <!-- 回复列表 -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    >
    <comment-item
    v-for="(item,index) in list"
    :key="index"
    :title="item"
    :comment='item'
    />
    </van-list>
     <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow=true"
      >写评论</van-button>
      <!-- <van-icon
        class="comment-icon"
        name="comment-o"
        info="9"
      /> -->
      <!-- <van-icon
        color="orange"
        :name="list.is_collected?'star':'star-o'"
        @click="collectOrConcel"
      /> -->
      <van-icon
        color="#e5645f"
        :name="list.attitude?'good-job':'good-job-o'" @click="likeOrConcel"
      />
      <!-- <van-icon class="share-icon" name="share" /> -->
    </div>
    <!-- /底部区域 -->
    <van-popup v-model="isPostShow" position="bottom">
    <post-comment v-model='postMessage' @click-post="onPost"/>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import { getComments, addComments, addCommentsLike, delCommentsLike } from '../../../api/comment'
import PostComment from './post-comment'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Object, String, Number],
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      postMessage: '',
      list: [],
      loading: false,
      finished: false,
      articleComment: {}, // 接收获取到的文章评论数据
      offset: null, // 请求下一页数据的页码
      limit: 20// 总数据条数
    }
  },
  methods: {
    //   获取所有回复
    async onLoad () {
      // 请求获取数据
      const res = await getComments({
        type: 'c', // a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，
        // 表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit// 获取的评论数据个数，不传表示采用后端服务设定的默
        // 认每页数据量
      })
      console.log(res)
      //   将数据添加到列表里面
      const { results } = res.data.data
      console.log(results)
      this.list.push(...results)
      // 加载状态结束
      this.loading = false
      // 判断数据全部加载完成
      if (results.length) {
        this.offset = res.data.data.last_id
        // last_id 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数，
        // 若本次无具体数据，则值为NULL
      } else {
        this.finished = true
      }
    },
    // 发布回复的评论
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        let res = await addComments({
          target: this.comment.com_id.toString(),
          content: this.postMessage,
          art_id: this.articleId
        })
        console.log(res)
        // 清空文本框
        this.postMessage = ''
        // 将数据添加到列表顶部
        this.list.unshift(res.data.data.new_obj)
        // 更新回复的总数量
        this.comment.reply_count++
        // 关闭弹层
        this.isPostShow = false
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast.fail('发布失败')
      }
    },
    // 评论点赞
    async likeOrConcel () {
      try {
        // 如果已经点赞，则取消点赞
        const commentId = this.comment.com_id.toString()
        if (this.comment.is_liking) {
          await delCommentsLike(commentId)
          this.comment.like_count--
        } else {
        // 如果没有点赞，则点赞
          await addCommentsLike(commentId)
          this.comment.like_count++
        }
        // 更新视图
        this.comment.is_liking = !this.comment.is_liking
      } catch (error) {
        console.log(error)
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
</style>
