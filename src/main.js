import Vue from 'vue'
import App from './App.vue'
// 导入路由配置
import router from './router'
// 导入本地存储工具
import storage from '@/utils/storage'
import defaultSongs from '@/assets/data/songs.json'

// 导入全局样式
import './assets/css/global.css'
// 导入 Bootstrap CSSoimport './assets/css/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// 导入 Bootstrap JS（如果需要用到交互组件，如弹窗、下拉菜单等）
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// 导入 Font Awesome 图标
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

// 如果localStorage里没有歌曲，就存入预设歌曲
if (storage.get('songs').length === 0) {
  storage.set('songs', defaultSongs)
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
