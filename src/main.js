import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/register-vant.js'// 引入vant组件
import 'normalize.css'
// 配置rem
import 'amfe-flexible'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
