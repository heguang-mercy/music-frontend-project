import Vue from 'vue'
import VueRouter from 'vue-router'
import PlayListPage from '../views/PlayListPage.vue'
import PlayList from '../views/PlayList.vue'
import LocalSongs from '@/views/LocalSongs.vue'
import ThemeView from '@/views/ThemeView.vue'
import PlayListDetail from '@/views/PlayListDetail.vue'
import ArtistView from '@/views/ArtistView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/PlayListPage',
    name: 'PlayListPage',
    component: PlayListPage,
    redirect: '/PlayListPage/LocalSongs',
    children: [
      {
        path: 'LocalSongs',
        name: 'LocalSongs',
        component: LocalSongs
      },
      {
        path: 'Playlist',
        name: 'Playlist',
        component: PlayList
      },
      {
        path: 'PlaylistDetail/:id', // 动态路由：传递歌单 ID
        name: 'PlayListDetail',
        component: PlayListDetail
      },
      {
        path: 'artists',
        name: 'Artists',
        component: ArtistView
      }
    ]
  },
  {
    path: '/PlayList',
    name: 'PlayerPage',
    component: PlayList
  },
  {
    path: '/ThemeView',
    name: 'ThemeView',
    component: ThemeView
  },
  {
    path: '/artists',
    name: 'ArtistView',
    component: ArtistView
  }
]

// 启用 HTML5 History 模式（地址栏无 # 号）
const router = new VueRouter({
  mode: 'history',
  // mode: 'hash',   // 哈希模式（默认，地址栏有 # 号）
  routes: routes// 传入上面定义的路由规则（可简写为 routes）
})

export default router
