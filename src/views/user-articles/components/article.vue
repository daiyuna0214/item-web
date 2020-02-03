<template>
  <div class="article">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
         @click="$router.push('/article/'+item.art_id)"
        />
      </van-list>
  </div>
</template>

<script>
import { getUserArticle } from '../../../api/article'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 当前页码
      perPage: 10// 每页大小
    }
  },
  methods: {
    async onLoad () {
      // 获取数据
      let res = await getUserArticle({
        page: this.page,
        per_page: this.perPage
      })
      console.log(res)
      // 将数据添加到列表中
      let { results } = res.data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>

</style>
