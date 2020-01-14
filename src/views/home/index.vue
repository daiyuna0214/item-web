<template>
  <div class="home-contener">
    <!-- 导航 -->
      <van-nav-bar title="首页" left-arrow fixed/>
      <!-- tab标签页 -->
      <van-tabs v-model="active">
        <van-icon name="wap-nav" slot="nav-right" @click="isChannelEditShow=true"/>
        <van-tab :title="item.name" v-for="item in channelList" :key='item.id'>
          <!-- 向子组件找那个传递channel值 -->
          <article-list :channel='item'></article-list>
        </van-tab>
      </van-tabs>
      <!-- 编辑频道 -->
      <van-popup
        v-model="isChannelEditShow"
        position="bottom"
        round
        closeable
        close-icon="close"
        close-icon-position="top-left"
        :style="{ height: '100%' }">
        <!-- 父组件把channelList传递给子组件 -->
        <channel-edit :channelList='channelList' @switch='changeSwitch'/>
      </van-popup>
  </div>
</template>

<script>
import { getChannel } from '../../api/channel'
import ArticleList from '../home/components/article-list'
import channelEdit from './components/channel-edit'
// import { getItem } from '../../utils/storage'
export default {
  name: 'HomePage',
  components: { ArticleList, channelEdit },
  data () {
    return {
      active: 0, // 定义切换哪个频道，0是第一个
      channelList: [], // 接收频道列表数据
      isChannelEditShow: false// 弹层是否展示
    }
  },
  methods: {
    // 获取用户频道
    async loadChannel () {
      let res = await getChannel()
      console.log(res)

      this.channelList = res.data.data.channels
    },
    // 切换频道
    changeSwitch (index) {
      this.active = index
      // 切换完关闭弹层
      this.isChannelEditShow = false
    }
  },
  created () {
    this.loadChannel()
  }
}
</script>

<style lang='less' scoped>
.home-contener{
  padding-top: 90px;
  padding-bottom: 50px;
  /deep/.van-tabs__wrap {
      position: fixed;
      left: 0;
      right: 0;
      top: 46px;
      z-index: 1;
  }
}
.van-icon-wap-nav{
  position: fixed;
  top: 57px;
  right: 0;
  opacity: .8;
  background-color: #fff;
}
</style>
