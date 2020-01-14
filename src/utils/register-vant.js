// 注册Vant组件

import Vue from 'vue'

// 加载需要使用的组件
import { Button, cell, CellGroup, icon, NavBar, Field,
  Toast, CountDown, Tabbar, TabbarItem, Grid, GridItem,
  image, Dialog, List, Tab, Tabs, PullRefresh, Popup } from 'vant'
// 注册
Vue.use(Button)
  .use(cell)
  .use(CellGroup)
  .use(icon)
  .use(NavBar)
  .use(Field)
  .use(Toast)
  .use(CountDown)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Grid)
  .use(GridItem)
  .use(image)
  .use(Dialog)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(PullRefresh)
  .use(Popup)
