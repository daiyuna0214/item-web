// 处理日期

import moment from 'moment'
import Vue from 'vue'

// 配置中文语言
moment.locale('zh-cn')

// 相对时间
Vue.filter('relativeTime', value => {
  return moment(value).startOf('second').fromNow()
})

// 日期格式化
Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(value).format(format)
})
