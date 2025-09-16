<template>
  <!-- 外层容器：纵向排列的导航栏 -->
    <div class="vertical-nav">
      <!-- 导航项列表 -->
      <ul>
        <li class="nav-item">
          <a href="#">首页</a>
        </li>
        <li class="nav-item">
          <router-link to="/PlayListView" class="page-title">我的音乐</router-link>
        </li>
        <li class="nav-item">
          <a href="#">播放列表</a>
        </li>
        <li class="nav-item">
          <a href="#">喜欢的音乐</a>
        </li>
      </ul>
    </div>
</template>

<script>
// 导出组件，让其他文件可以导入使用
export default {
  name: 'NavBar'// 组件名，建议和文件名一致
}
</script>

<style>
/* 导航栏整体样式：固定宽度，纵向排列 */
.vertical-nav {
  width: 200px;        /* 宽度固定，适合纵向导航 */
  background-color: #333;  /* 深色背景 */
  padding: 20px 0;     /* 上下内边距 */
  height: 100vh;       /* 高度占满整个屏幕 */
}

/* 去掉列表默认样式 */
.vertical-nav ul {
  list-style: none;    /* 去掉默认圆点 */
  padding: 0;
  margin: 0;
}

/* 每个导航项样式 */
.nav-item {
  text-align: center;  /* 文字居中 */
  margin: 10px 0;      /* 上下间距 */
}

/* 链接样式 */
.nav-item a {
  color: white;        /* 文字白色 */
  text-decoration: none;  /* 去掉下划线 */
  font-size: 18px;     /* 字体稍大，符合你的需求 */
  display: block;      /* 让链接占满整个li，点击区域更大 */
  padding: 10px;       /* 内边距，增大点击区域 */
}

/* 鼠标悬停效果 */
.nav-item a:hover {
  background-color: #165DFF;  /* 深蓝色背景（你的主色） */
}
</style>
