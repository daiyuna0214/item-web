<template>
   <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 -->
      <!-- 如果loading为true，那么处于加载 状态 -->
    <van-loading
      v-if="loading"
      class="loading"
      color="#1989fa"
      vertical
    >
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->

    <!-- 文章详情 -->
      <!-- 如果有list.title，那么处于加载完成状态 -->
    <div class="detail" v-else-if="list.title">
      <h3 class="title">{{list.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="list.aut_photo"
          />
          <div class="text">
            <p class="name">{{list.aut_name}}</p>
            <p class="time">{{list.pubdate | relativeTime}}</p>
          </div>
        </div>
        <van-button class="follow-btn"
        :type="list.is_followed?'default':'info'" size="small" round
        v-if="!user || list.aut_id !==user.id"
        @click="followOrConcel"
        :loading="isFollowLoading"
        >{{list.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="markdown-body" v-html="list.content"></div>
    </div>
    <!-- /文章详情 -->
    <!-- 加载失败提示 -->
    <div class="error" v-else>
      <img src="./no-network.png" alt="no-network">
      <p class="text">亲，网络不给力哦~</p>
      <van-button
        class="btn"
        type="default"
        size="small"
      >点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->

    <!-- 文章评论 -->
    <article-comment :article-id='articleId' ref="article-comment"
    @click-reply="onReplyShow"
    ></article-comment>

    <!-- 底部区域 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow=true"
      >写评论</van-button>
      <van-icon
        class="comment-icon"
        name="comment-o"
        info="9"
      />
      <van-icon
        color="orange"
        :name="list.is_collected?'star':'star-o'"
        @click="collectOrConcel"
      />
      <van-icon
        color="#e5645f"
        :name="list.attitude?'good-job':'good-job-o'" @click="likeOrConcel"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->
    <!-- 发布文章评论 -->
    <van-popup v-model="isPostShow" position="bottom" :style="{height:'20%'}">
      <!-- 评论内容组件 -->
      <!-- 在组件是使用v-model
      以前父传子:value='postMessage'
      现在@input='postMessage'=事件参数，本质还是父子通信，会给子组件传递一个名叫value的数据
      -->
      <post-comment v-model='postMessage' @click-post="onPost"/>
    </van-popup>
    <!--回复评论 -->
    <van-popup v-model="isReplyShow" position="bottom" :style="{height:'90%'}">
      <comment-reply :comment='currentComment' :articleId='articleId'></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticlesById, collectArticle, concelCollectArticle,
  likeArticle, concelLikeArticle }
  from '../../api/article'
import { followUser, concelFollowUser } from '../../api/user'
//   vuex模块提供了一些辅助方法，专门用来让我们更方便的获取容器中的数据
// mapState:映射获取state数据
// mapMutation：映射获取mutation数据
// mapAction：映射获取action数据
import { mapState } from 'vuex'
import articleComment from './components/article-comment'
import postComment from './components/post-comment'
import { addComments } from '../../api/comment'
import commentReply from './components/comment-reply'
export default {
  name: 'article',
  components: { articleComment, postComment, commentReply },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  computed: {
    //   mapState方法返回一个对象，对象中就是映射过来的容器中的数据成员
    // ...操作符就是把一个对象展开
    ...mapState(['user'])
  },
  data () {
    return {
      list: {}, // 接收文章详情数据
      loading: true, // 文章加载的状态
      isFollowLoading: false, // 关注按钮的loading状态
      isPostShow: false, // 是否展示写评论的弹框
      postMessage: '', // 发布评论内容
      isReplyShow: false, // 是否展示评论回复的弹框
      currentComment: ''// 记录点击回复评论的对象
    }
  },
  methods: {
    // 回复评论
    onReplyShow (comment) {
      // 记录点击回复的评论对象
      this.currentComment = comment
      this.isReplyShow = true
    },
    // 发布评论
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // console.log('发布')
        let res = await addComments({
          target: this.articleId,
          content: this.postMessage
        })
        // console.log(res)
        // 清空文本框内容
        this.postMessage = ''
        // 关闭弹层
        this.isPostShow = false
        // 将数据添加到列表顶部
        this.$refs['article-comment'].list.unshift(res.data.data.new_obj)
        this.$toast.success('评论成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('评论失败')
      }
    },
    async loadArticle () {
    //   文章加载时loading为true
      this.loading = true
      try {
        let res = await getArticlesById(this.articleId)
        // console.log(res)
        this.list = res.data.data
      } catch (error) {
      }
      //   文章加载完成时loading为false
      this.loading = false
    },
    async collectOrConcel () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 如果已收藏，则取消收藏
        if (this.list.attitude) {
          await concelCollectArticle(this.articleId)
          this.list.attitude = false
          this.$toast.success('取消收藏')
        } else {
          // 否则添加收藏
          await collectArticle(this.articleId)
          this.list.attitude = true
          this.$toast.success('收藏成功')
        }
      } catch (error) {
        console.log('操作失败', error)
        this.$toast.fail('操作失败')
      }
    },
    async likeOrConcel () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 如果已点赞，则取消点赞
        if (this.list.attitude) {
          await concelLikeArticle(this.articleId)
          this.list.attitude = false
          this.$toast.success('取消点赞')
        } else {
          // 否则点赞收藏
          await likeArticle(this.articleId)
          this.list.attitude = true
          this.$toast.success('点赞成功')
        }
      } catch (error) {
        console.log('操作失败', error)
        this.$toast.fail('操作失败')
      }
    },
    async followOrConcel () {
      this.isFollowLoading = true
      try {
        // 如果已关注，则取消关注
        if (this.list.is_followed) {
          await concelFollowUser(this.list.aut_id)
          this.list.attitude = false
          this.$toast.success('取消关注')
        } else {
          // 否则关注
          await followUser(this.list.aut_id)
          this.list.attitude = true
          this.$toast.success('关注成功')
        }
      } catch (error) {
        console.log('操作失败', error)
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    }
  },
  created () {
    this.loadArticle()
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  padding: 46px 20px 100px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3A3A3A;
    }
    .author-wrap {
      padding: 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 35px;
          height: 35px;
          margin-right: 5px;
        }
        .text {
          .name {
            margin: 0;
            font-size: 12px;
          }
          .time {
            margin: 0;
            font-size: 10px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
  }
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
}
</style>
