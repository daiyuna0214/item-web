<template>
<!-- 标签栏 -->
  <div class="tab-bar-contener">
    <!-- 二级路由视图 -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <van-tabbar v-model="active">
      <van-tabbar-item to="/" icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/my" icon="manager-o">
      {{$store.state.user?'我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'tabBar',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style>

</style>
