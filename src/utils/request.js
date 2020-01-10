// 封装axios请求模块
import axios from 'axios'
// 处理大数字
import jsonBig from 'json-bigint'

// 引入容器
import store from '@/store'

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
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default request
