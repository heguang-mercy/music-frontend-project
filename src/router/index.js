import Vue from 'vue'
import VueRouter from 'vue-router'
import PlayListPage from '../views/PlayListPage.vue'
import PlayList from '../views/PlayList.vue'
import LocalSongs from '@/views/LocalSongs.vue'
import ThemeView from '@/views/ThemeView.vue'
import PlayListDetail from '@/views/PlayListDetail.vue'
import LoginPage from '@/views/LoginPage.vue'
import MusicPlayer from '@/components/MusicPlayer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
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
        path: '/MusicPlayer',
        component: MusicPlayer
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
  }
]

// 启用 HTML5 History 模式（地址栏无 # 号）
const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
