<template>
  <div class="user-articles">
      <van-nav-bar fixed title="我的收藏/历史/作品" left-arrow  @click-left="$router.back()"/>
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
