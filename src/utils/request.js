// 封装axios请求模块
import axios from 'axios'
// 处理大数字
import jsonBig from 'json-bigint'

// 引入容器
import store from '@/store'
import router from 'vue-router'

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // config请求配置对象，我们可以通过修改config来实现统一的请求数据处理
    const { user } = store.state

    // 统一添加token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 在数据响应之前对大数字进行处理
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    console.log('转换失败')
    return {}
  }
}]

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error) {
    if (error.response && error.response.status === 401) {
      // 1,如果没有refresh_token则直接跳转页面
      const user = store.state.user
      if (!user || !user.refresh_token) {
        redirectLogin()
        return
      }
      // 2,如果有refresh_token,则请求更新token
      try {
        const { data } = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 3,如果刷新token成功了,吧刷新的token更新到容器中
        store.commit('setUser', {
          ...user,
          token: data.data.token
        })
        // 4,吧之前失败的请求继续发出去
        // error.config获取到的是本次请求相关的配置对象，其中包括method url等信息
        console.log(error.config)
        // 把本次因为token过期的失败请求重新发送
        return request(error.config)
      } catch (error) {
        console.log('刷新token失败', error)
        redirectLogin()
      }
    }
    return Promise.reject(error)
  })
function redirectLogin () {
  router.push({
    name: 'login',
    // query 参数会以 ?key=value&key=value 的格式添加到 url 后面
    query: {
      // 这里使用查询参数把要跳转回来的路由地址传递给了登录页面
      // router.currentRoute 就是当前路由对象，好比我们在组件中的 this.$route
      // 当前路由对象的fullPath 就是当前路由的路径
      redirect: router.currentRoute.fullPath
    }
  })
}
export default request
