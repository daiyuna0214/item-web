// 注册Vant组件

import Vue from 'vue'

// 加载需要使用的组件
import { Button, cell, CellGroup, icon, NavBar, Field, Toast } from 'vant'
// 注册
Vue.use(Button)
  .use(cell)
  .use(CellGroup)
  .use(icon)
  .use(NavBar)
  .use(Field)
  .use(Toast)
