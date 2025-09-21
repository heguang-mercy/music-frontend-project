<template>
  <div>
  <h1>我的音乐胶囊</h1>
  <div>
    <ul>
      <li><router-link to="/PlayListPage/LocalSongs" class="page-title">单曲</router-link></li>
      <li><a href="#playlist">歌单</a></li>
      <li><a href="#artist">歌手</a></li>
    </ul>
    <div class="child-container">
      <router-view />
    </div>
  </div>
  </div>
</template>

<script>

export default {
  name: 'PlayListPage'
}
</script>

<style>
/* 重置列表样式，去除默认的项目符号和内外边距 */
ul {
  border-radius: 5px 10px 15px 20px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-playbar);
}

/* 让列表项浮动到左侧，实现水平排列 */
li {
  float: left;
}

/* 设置导航栏链接样式 */
li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* 鼠标悬停时改变链接颜色 */
li a:hover {
  border-radius: 5px 10px 15px 20px;
  background-color: var(--color-btn);
}
</style>
