<template>
  <div id="app">
    <!-- <router-view/>是一个动态组件,
    外面包裹keep-alive标签会使组件缓存 -->
    <keep-alive :include="$store.state.cachePages">
        <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      cachePages: ['tabBar']
    }
  }
}
</script>
<style lang="less">
.info{
  background-color: #ccc;
  display: block;
  width: 100px;
  height: 50px;
  font-size: 48px
}
</style>
