<template>
  <div class="user-articles">
      <van-nav-bar fixed title="我的收藏/历史/作品" left-arrow  @click-left="$router.replace('/my')"/>
      <van-tabs v-model="active">
        <van-tab title="我的收藏">
          <Collect />
        </van-tab>
        <van-tab title="历史">
          <History />
        </van-tab>
        <van-tab title="作品">
            <Article />
        </van-tab>
      </van-tabs>
  </div>
</template>

<script>
import Article from './components/article'
import Collect from './components/collect'
import History from './components/history'
export default {
  name: 'userArticles',
  components: {
    Article,
    Collect,
    History
  },
  props: {
    type: String
  },
  data () {
    let active = ['collect', 'history'].indexOf(this.type)
    if (active === -1) {
      active = 2// 我的作品
    }
    return {
      active// 控制激活的标签选项
    }
  },
  // 路由导航钩子
  beforeRouteLeave (to, from, next) {
    console.log(to)
    // 如果跳转的是文章详情页，则把当前页面缓存起来，否则不缓存
    if (to.name === 'article') {
      this.$store.commit('addCachePage', 'userArticles')
    } else {
      this.$store.commit('removeCachePage', 'userArticles')
    }
    // 放行通过
    next()
  }
}
</script>

<style scoped lang='less'>
.user-articles{
  padding-top: 90px;
  padding-bottom: 50px;
    /deep/.van-tabs__wrap{
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
