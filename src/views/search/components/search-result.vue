<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <van-cell
      v-for="item in list"
      :key="item.aut_id"
      :title="item.title"
    />
    </van-list>
  </div>
</template>

<script>
import { searchResults } from '../../../api/search'
export default {
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      searchContent: '', // 搜索的数据
      page: 1, // 页码
      per_page: 10// 每页多少条
    }
  },

  methods: {
    async onLoad () {
      //   请求数据
      const res = await searchResults({
        page: this.page,
        per_page: this.per_page,
        q: this.q// 查询参数
      })
      // console.log(res)
      this.list = res.data.data.results

      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (this.list.length >= 40) {
        this.finished = true
      }
    }
  }
}
</script>

<style>

</style>
