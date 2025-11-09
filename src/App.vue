<template>
  <div id="app" class="container-fluid">
    <div class="row g-0">
      <div class="col-2 p-3">
        <NavBar v-if="!isLogin" />
      </div>
      <div class="col-10 p-3">
        <router-view />
        <PlayerBar v-if="!isLogin" />
      </div>
    </div>
  </div>
</template>

<script>

// 1. 导入组件：从components文件夹引入
import NavBar from './components/NavBar.vue'
import PlayerBar from './components/PlayerBar.vue'

export default {
  name: 'App',
  // 2. 注册组件：在components选项里声明，才能在template里使用
  components: {
    NavBar,
    PlayerBar
  },
  computed: {
    isLogin () {
      return this.$route.path === '/login'
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
</style>
