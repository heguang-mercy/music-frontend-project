import Vue from 'vue'
import VueRouter from 'vue-router'
import PlayListPage from '../views/PlayListPage.vue'
import PlayList from '../views/PlayList.vue'
import LocalSongs from '@/views/LocalSongs.vue'
import ThemeView from '@/views/ThemeView.vue'
import PlayListDetail from '@/views/PlayListDetail.vue'
import LoginPage from '@/views/LoginPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
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
        path: 'PlaylistDetail/:id',
        name: 'PlayListDetail',
        component: PlayListDetail
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

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
