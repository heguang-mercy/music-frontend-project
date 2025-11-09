<template>
  <!-- Navbar -->
  <nav class="navbar">
    <ul class="navbar-item">
      <div class="navbar-item-top">
        <li class="navbar-item-inner flexbox-left">
          <router-link to="/PlayListPage" class="navbar-item-inner">
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
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
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
  width: 60px; /* Initial collapsed width */
  transition: width 0.3s ease; /* Smooth transition for width */
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px 10px 15px 20px;
}

.navbar:hover {
  width: 16%; /* Expanded width */
}

.navbar-item {
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: rgba(0, 0, 0, 0);
  height: 90%;
}

.navbar-item-top {
  display: flex;
  flex-direction: column;
}

.navbar-item-inner {
  font-size: 25px;
  margin: auto;
  color: var(--color-text);
  text-decoration: none;
  opacity: 0; /* Hidden text initially */
  transition: opacity 0.3s ease; /* Smooth transition for opacity */
}

.navbar:hover .navbar-item-inner {
  opacity: 1; /* Show text on hover */
}

.navbar-item-inner:hover {
  border-radius: 5px 10px 15px 20px;
  background-color: var(--color-playbar);
  transform: scale(0.98);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-item-bottom {
  background-color: rgba(0, 0, 0, 0);
  margin-top: auto;
  margin-bottom: 0;
}
</style>
