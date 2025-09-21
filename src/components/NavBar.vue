<template>
<!--  &lt;!&ndash; Navbar &ndash;&gt;-->
  <nav class="navbar">
    <ul class="navbar-item">
     <div class="navbar-item-top">
       <li class="navbar-item-inner flexbox-left">
         <router-link to="/PlayListPage"  class="navbar-item-inner">
           <div class="navbar-item-inner flexbox-left">
             <ion-icon name="home-outline"></ion-icon>
           </div>
           <p class="navbar-item-inner flexbox-left">我的音乐</p>
         </router-link>
       </li>
       <li class="navbar-item-inner flexbox-left">
         <router-link to="/ThemeView" class="navbar-item-inner flexbox-left">
           <div class="navbar-item-inner flexbox-left">
             <ion-icon name="folder-open-outline"></ion-icon>
           </div>
           <p class="navbar-item-inner flexbox-left">主题</p>
         </router-link>
       </li>
     </div>
      <div class="navbar-item-bottom">
        <li class="navbar-item-inner">
          <router-link to="#" class="navbar-item-inner flexbox-left">
            <div class="navbar-item-inner flexbox-left">
              <ion-icon name="pie-chart-outline"></ion-icon>
            </div>
            <span class="navbar-item-inner flexbox-left"></span>
          </router-link>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script>
// 导出组件，让其他文件可以导入使用
export default {
  name: 'NavBar'// 组件名，建议和文件名一致
}
</script>

<style scoped>

.navbar {
  margin: 0;
  height: 100vh;
  background-color: var(--color-nav);
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  width: 16%;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px 10px 15px 20px;
}
.navbar-item{
  margin: auto;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin-right: auto;
  background-color: rgba(0, 0, 0, 0);
  height: 90%;
}
.navbar-item-top{
  display: flex;
  flex-direction: column;
}
.navbar-item-inner{
  margin: auto;
  color: var(--color-text);
  text-decoration: none;
}
.navbar-item-inner:hover {
  border-radius: 5px 10px 15px 20px;
  background-color: var(--color-playbar);
  transform: scale(0.98); /* 整体缩小2% */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 轻微阴影增强层次感 */
}
.navbar-item-bottom{
  background-color: rgba(0, 0, 0, 0);
  margin-top: auto; /* 自动占据剩余空间，将自身推到底部 */
  margin-bottom: 0; /* 清除底部多余间距 */
}
</style>
