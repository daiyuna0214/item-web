import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/login', // 配置登录路由
    component: () => import ('../views/login')
  },
  {
    path: '/', // 二级路由
    component: () => import('../views/tab-bar'),
    children: [{
      path: '',
      component: () => import('../views/home')
    },
    {
      path: '/my',
      component: () => import('../views/my')
    },
    {
      path: '/video',
      component: () => import('../views/video')
    },
    { path: '/question',
      component: () => import('../views/question')
    }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
