<template>
  <div class="playlist-container">
    <h1 class="page-title">我的音乐胶囊</h1>
    <div class="nav-tabs">
      <ul class="tab-list">
        <li class="tab-item">
          <router-link to="/PlayListPage/LocalSongs" class="tab-link" active-class="active">单曲</router-link>
        </li>
        <li class="tab-item">
          <a href="#playlist" class="tab-link">歌单</a>
        </li>
        <li class="tab-item">
          <a href="#artist" class="tab-link">歌手</a>
        </li>
      </ul>
    </div>
    <div class="child-container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayListPage'
}
</script>

<style scoped>
.playlist-container {
  padding: 20px;
}

.page-title {
  font-size: 32px;
  text-align: center;
  margin-bottom: 30px;
  animation: slideInDown 0.5s ease;
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.nav-tabs {
  margin-bottom: 30px;
}

.tab-list {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
  background-color: var(--color-playbar);
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
}

.tab-link {
  display: block;
  color: var(--color-text);
  text-align: center;
  padding: 15px 20px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
}

.tab-link:hover {
  background-color: var(--color-btn);
  color: white;
}

.tab-link.active {
  background-color: var(--color-btn);
  color: white;
}

.child-container {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .playlist-container {
    padding: 15px;
  }
  .page-title {
    font-size: 28px;
    margin-bottom: 20px;
  }

  .tab-list {
    border-radius: 20px;
  }

  .tab-link {
    padding: 12px 15px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .playlist-container {
    padding: 10px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .tab-list {
    border-radius: 15px;
  }

  .tab-link {
    padding: 10px 12px;
    font-size: 12px;
  }
}
</style>
