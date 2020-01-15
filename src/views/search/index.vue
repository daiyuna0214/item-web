<template>
  <div class="secrch-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchContent)"
        @cancel="onCancel"
        @focus="isSearchResultShow=false"
        @input="onSearchInput"
      />
      <!-- focus输入框获得焦点事件，获得焦点则不展示搜索结果 -->
    </form>
    <!-- 搜索结果 -->
    <!-- 如果显示搜索结果，则展示搜索结果 -->
    <search-result v-if="isSearchResultShow" :q='searchContent'></search-result>
    <!-- 联想建议 -->
    <!-- 如果输入框有搜索数据，则展示联想建议 -->
    <van-cell-group v-else-if="searchContent">
      <van-cell icon="search"  v-for="(item,index) in suggestions" :key="index"
       @click="onSearch(item)">
        <div slot="title" v-html="hightLight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <!-- 否则展示历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <template v-if="isDeleteShow">&nbsp;&nbsp;&nbsp;
          <span @click="searchHistories=[]">全部删除</span>&nbsp;&nbsp;&nbsp;
          <span @click="isDeleteShow=false">完成</span>
        </template>
          <van-icon name="delete" @click="isDeleteShow=true" v-else/>
      </van-cell>
        <van-cell :title="item" v-for="(item,index) in searchHistories"
        :key="index" @click="onHistoryClick(item,index)">
           <van-icon name="close" v-show="isDeleteShow"></van-icon>
        </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import searchResult from './components/search-result'
import { suggestion } from '../../api/search'
import { debounce } from 'lodash'
import { getItem, setItem } from '../../utils/storage'
export default {
  components: {
    searchResult
  },
  data () {
    return {
      searchContent: '', // 搜索的数据
      isSearchResultShow: false, // 是否展示搜索结果,默认为false
      suggestions: [], // 接收联想建议
      // searchHistories: [], // 搜索历史记录
      searchHistories: getItem('search-histories') || [], // 搜索历史记录有本地存储的使用本地存储
      isDeleteShow: false// 删除历史记录的显示状态
    }
  },

  methods: {
    onSearch (q) {
      // console.log('search')
      // 更新搜索文本框的数据
      this.searchContent = q
      // 记录搜索历史记录
      const searchHistories = this.searchHistories
      // 在历史记录里面查找当前搜索的内容，看是否有
      const index = searchHistories.indexOf(q)
      if (index !== -1) {
        // 如果历史记录里每页现在搜索的内容，则将现在的搜索内容添加到历史记录里面
        searchHistories.splice(index)
      }
      searchHistories.unshift(q)
      // 搜索的时候展示搜索结果
      this.isSearchResultShow = true
    },
    onCancel () {
      console.log('cancel')
    },
    // 输入事件，输入时展示联想建议
    // debounce函数
    // 参数1：函数
    // 参数2：防抖时间
    // 返回值：防抖之后的函数，和参数1功能是一样的
    onSearchInput: debounce(async function () {
      const searchContent = this.searchContent
      // 如果没有搜索的数据，则终止
      if (!searchContent) {
        return
      }
      // 如果有搜索的数据，则请求获取联想建议
      const res = await suggestion(searchContent)
      // console.log(res)
      this.suggestions = res.data.data.options
    }, 200),
    // async onSearchInput: () {
    //   const searchContent = this.searchContent
    //   // 如果没有搜索的数据，则终止
    //   if (!searchContent) {
    //     return
    //   }
    //   // 如果有搜索的数据，则请求获取联想建议
    //   const res = await suggestion(searchContent)
    //   // console.log(res)
    //   this.suggestions = res.data.data.options
    // },
    hightLight (str) {
      const searchContent = this.searchContent
      // /searchContent/如果这样写那么正则表达式中的一切内容都会当做字符串使用
      const reg = new RegExp(searchContent, 'gi')
      return str.replace(reg, `<span style='color:#3296fa'>${searchContent}</span>`)
    },
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        // 否则执行搜索操作
        this.onSearch(item)
      }
    }
  },
  watch: {
    searchHistories (val) {
      setItem('search-histories', val)
    }
  }
}
</script>

<style lang='less' scoped>
// 让搜索栏固定在头部
.secrch-container{
  padding-top: 54px;
  .search-form{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}

</style>
