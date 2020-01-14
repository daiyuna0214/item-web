<template>
  <div class="user-container">
    <!-- 导航栏 -->
    <van-nav-bar :title="userList.name" left-arrow />
    <!-- /导航栏 -->

    <!-- 用户信息 -->
    <div class="user-info-container">
      <div class="row1">
        <van-image
          class="col1"
          fit="cover"
          round
          :src="userList.photo"
        />
        <div class="col2">
          <div class="row1">
            <div class="item">
              <div class="count">{{userList.art_count}}</div>
              <div class="text">发布</div>
            </div>
            <div class="item">
              <div class="count">{{userList.follow_count}}</div>
              <div class="text">关注</div>
            </div>
            <div class="item">
              <div class="count">{{userList.fans_count}}</div>
              <div class="text">粉丝</div>
            </div>
            <div class="item">
              <div class="count">{{userList.like_count}}</div>
              <div class="text">获赞</div>
            </div>
          </div>
          <div class="action">
            <van-button
              type="primary"
              size="small"
            >私信</van-button>
            <van-button
              type="default"
              size="small"
            >编辑资料</van-button>
          </div>
        </div>
      </div>
      <div class="intro-wrap">
        <div>
          <span>认证：</span>
          <span>用户的认证信息</span>
        </div>
        <div>
          <span>简介：</span>
          <span>用户的简介信息</span>
        </div>
      </div>
    </div>
    <!-- /用户信息 -->

    <!-- 文章列表 -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad">
        <van-cell
            v-for="(item,index) in list"
            :key="index"
            :title="item.title"/>
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getUserInfoById } from '../../api/user'
import { getArticleById } from '../../api/article'
export default {
  name: 'UserPage',
  data () {
    return {
      userList: {}, // 接收指定用户信息
      list: [], // 文章列表数据
      loading: false,
      finished: false,
      page: 1// 获取下一页数据的页码
    }
  },
  methods: {
    // 获取指定用户信息
    async loadUserInfoById () {
      try {
        let res = await getUserInfoById(this.$route.params.userId)
        // console.log(res)
        this.userList = res.data.data
      } catch (error) {
        this.$toast('获取用户数据失败')
      }
    },
    async onLoad () {
      // 请求获取数据
      let res = await getArticleById(this.$route.params.userId,
        { page: this.page, // 可选参数，默认是第一页
          per_page: 20// 可选参数，默认每页十条
        })
      console.log(res)
      // 把数据添加到列表中
      const { results } = res.data.data// results是一个数组，不能直接push，需要使用数组拓展运算符将里面的值一个一个拿出来
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 判断数据是否全部加载完成
      if (results.length) {
        this.page++// 没有加载完成就更新下一页数据的页码
      } else {
        this.finished = true// 数据加载完成就不需要加载更多了
      }
    }
  },
  created () {
    this.loadUserInfoById()
  }
}
</script>

<style scoped lang="less">
.user-container {
  font-size: 14px;
  .user-info-container {
    padding: 12px;
    background-color: #fff;
    margin-bottom: 10px;
    >.row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .item {
        text-align: center;
        .text {
          font-size: 12px;
        }
      }
      >.col1 {
        width: 80px;
        height: 80px;
      }
      >.col2 {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        width: 70%;
        height: 80px;
        padding: 0 12px;
        >.row1 {
          display: flex;
          justify-content: space-between;
        }
        .action {
          display: flex;
          justify-content: space-between;
          .van-button {
            width: 45%;
          }
        }
      }
    }
  }
}
</style>
