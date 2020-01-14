<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
            v-for="item in list"
            :key="item.id"
            :title="item.title"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleByChannel } from '../../../api/article'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], //
      loading: false,
      finished: false,
      timestamp: null, // 用于获取下一页的时间戳
      isLoading: false// 是否下拉加载
    }
  },

  methods: {
    async onLoad () {
      // 获取列表数据
      let res = await getArticleByChannel({
        channel_id: this.channel.id, // 频道id。。。父组件传递过来的
        // 第一次使用Data.now()获取最新数据
        // 下一页的数据使用本次返回的数据中的timestamp
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，
        // 请求历史推荐传指定的时间戳
        with_top: 1// 是否包含置顶项，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      console.log(res)
      const results = res.data.data.results
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (results.length) {
        this.timestamp = res.data.data.per_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新事件
    async onRefresh () {
      // 下拉刷新组件会自动开启loading
      // 获取数据
      const res = await getArticleByChannel({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 下拉刷新永远是请求最新数据
        with_top: 1
      })
      // 把获取到的最新数据放到列表冻得顶部
      console.log(res)
      const results = res.data.data.results
      this.list.unshift(...results)
      // 关闭刷新状态
      this.isLoading = false
      this.$toast(`更新了${results.length}条数据`)
    }
  }
}
</script>

<style>

</style>
