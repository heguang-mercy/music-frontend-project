import Vue from 'vue'
import VueRouter from 'vue-router'
import PlayListView from '../views/PlayListView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/PlayListView',
    name: 'PlayListView',
    component: PlayListView
  }
]

// 启用 HTML5 History 模式（地址栏无 # 号）
const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',   // 哈希模式（默认，地址栏有 # 号）
  routes: routes// 传入上面定义的路由规则（可简写为 routes）
})

export default router
