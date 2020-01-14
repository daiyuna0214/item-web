<template>
  <div class="channelEditContainer">
    <van-cell-group>
      <van-cell>
        <van-button type="danger" size='mini' round plain @click="isShowOrHide=!isShowOrHide">{{isShowOrHide?'完成':'编辑'}}</van-button>
      </van-cell>
    <van-cell title="我的频道" value="内容"/>
        <van-grid :gutter="10">
        <van-grid-item :text="item.name" v-for="(item,index) in channelList" :key="item.id"
        @click="delChannel(index)">
          <van-icon slot="icon" name="close" v-show='isShowOrHide && index !==0'></van-icon>
        </van-grid-item>
        </van-grid>
    <van-cell title="推荐频道" value="内容"/>
        <van-grid :gutter="10">
        <van-grid-item :text="item.name" :key="item.id" v-for="item in recommendChannel " @click='AddChannel(item)'/>
        </van-grid>
    </van-cell-group>
  </div>
</template>

<script>
// 获取全部频道接口
import { getAllChannel } from '../../../api/channel'
// import { setItem } from '../../../utils/storage'
export default {
  props: {
    // 接收父组件 传递过来的值
    channelList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 接收所有的频道
      isShowOrHide: false
    }
  },
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      let res = await getAllChannel()
      console.log(res)
      this.allChannels = res.data.data.channels
    },
    // 添加我的频道
    AddChannel (channel) {
      // 需要传一个频道，代表点击哪个频道添加哪个
      this.channelList.push(channel)
    },
    // 删除我的频道
    delChannel (index) {
      // 如果是编辑状态则删除
      if (this.isShowOrHide && index !== 0) {
        this.channelList.splice(index, 1)// 通过删除索引来删除频道
      } else {
        // 如果不是编辑状态，则切换频道
        this.$emit('switch', index)
      }
    }
  },
  computed: {
    recommendChannel () {
      const channel = []// 定义一个数组接收推荐频道
      // 遍历所有频道
      this.allChannels.forEach(item => {
        if (!this.channelList.find(c => c.id === item.id)) {
          channel.push(item)
        }
      })
      return channel
    }
  },
  created () {
    this.loadAllChannels()
  }
  // watch: {
  //   channelList (newValue) {
  //     // 当channelList发生改变时，将数据存储到本地
  //     setItem('channel-list', newValue)
  //   }
  // }
}
</script>

<style lang='less' scoped>
.van-button{
  float:right;
}
/deep/ .van-grid-item__icon-wrapper {
  position: absolute;
  top: -14px;
  right: -5px;
  .van-icon-close {
    font-size: 14px;
  }
}
</style>
