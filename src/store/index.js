import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
import decodeJwt from 'jwt-decode'

const USER_KEY = 'user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 在vuex中存储token
    // user:JSON.parse(window.localStorage.getItem('user'))
    user: getItem(USER_KEY)
  },
  mutations: {
    // mutations里面的函数默认第一个参数为state
    setUser (state, data) {
      // 解析JWT中的数据(需要使用用户id)
      if (data && data.token) {
        data.id = decodeJwt(data.token).user_id
      }
      state.user = data
      // 为了防止刷新丢失state中的user状态，我们把它放到本地存储、
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
