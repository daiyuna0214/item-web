<template>
  <div class="article-comments">
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
            @click-reply="$emit('click-reply',item)"
        />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '../../../api/comment'
import CommentItem from '../components/comment-item'
export default {
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      articleComment: {}, // 接收获取到的文章评论数据
      offset: null, // 请求下一页数据的页码
      limit: 20// 总数据条数
    }
  },

  methods: {
    async onLoad () {
      // 请求获取数据
      const res = await getComments({
        type: 'a', // a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id
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
    }
  }
}
</script>

<style>

</style>
