<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <div class="col-2 border p-3">
        <NavBar />
      </div>
      <div class="col-10 border p-3">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>

// 1. 导入组件：从components文件夹引入我们写的VerticalNav
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  // 2. 注册组件：在components选项里声明，才能在template里使用
  components: {
    NavBar
  }
}
</script>

<style>
/* 去掉页面默认边距 */
#app {
  margin: 0;
  padding: 0;
}
</style>
