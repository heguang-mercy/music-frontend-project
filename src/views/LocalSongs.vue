<template>
  <div class="local-songs-page">
    <h1 class="page-title">本地歌曲</h1>

    <!-- 歌曲列表 -->
    <div class="songs-list">
      <!-- 关键：添加 @dblclick 双击事件 -->
      <div
        v-for="song in songs"
        :key="song.id"
        class="song-item card"
        @click="handleSongSelect(song)"
        @dblclick="handleDoubleClick(song)">  <!-- 双击播放 -->
        <!-- 封面图 -->
      <img :src="song.cover" :alt="song.name" class="song-cover" @error="handleImageError">
      <!-- 歌曲信息 -->
       <div class="song-info">
        <div class="song-name component-title">{{ song.name }}</div>
        <div class="song-singer main-text">{{ song.singer }}</div>
       </div>
       <!-- 播放按钮（仅在移动设备上显示） -->
       <div class="play-button-mobile" @click.stop="playSong(song)">
         <ion-icon name="play-circle-outline" size="large"></ion-icon>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import songsData from '@/assets/data/songs.json'
import player from '@/utils/player' // 导入播放工具
import Vue from 'vue' // 用于事件总线

export default {
  data () {
    return {
      songs: []
    }
  },
  mounted () {
    // 直接使用配置的路径，不需要额外处理
    this.songs = songsData
  },
  methods: {
    handleDoubleClick (song) {
      this.playSong(song)
    },
    handleSongSelect (song) {
      // 在移动设备上，单击选择歌曲，可以显示更多信息或播放按钮
      // 这里可以根据需要添加逻辑
    },
    playSong (song) {
      const currentSong = player.playSong(song)
      Vue.prototype.$bus.$emit('songChanged', currentSong)
    },
    handleImageError (event) {
      console.error('图片加载失败:', event.target.src)
      // 隐藏加载失败的图片
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
/* 页面样式（结合你的 CSS 类） */
.local-songs-page {
  padding: 20px;
}

.songs-list {
  margin-top: 20px;
}

.song-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.song-item:hover {
  background-color: var(--color-hover);
  transform: translateX(5px);
}

.song-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.song-item:hover .song-cover {
  transform: scale(1.05);
}

.song-info {
  flex: 1;  /* 占满剩余宽度 */
}

.song-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  line-height: 1.2;
}

.song-singer {
  font-size: 16px;
  color: var(--color-nav-text);
  line-height: 1.2;
}

.play-button-mobile {
  display: none;
  color: var(--color-btn);
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .local-songs-page {
    padding: 15px;
  }
  .song-item {
    padding: 12px;
  }
  .song-cover {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  .song-name {
    font-size: 16px;
  }
  .song-singer {
    font-size: 14px;
  }
  .play-button-mobile {
    display: block;
  }
}

@media (max-width: 480px) {
  .local-songs-page {
    padding: 10px;
  }
  .song-item {
    padding: 10px;
  }
  .song-cover {
    width: 45px;
    height: 45px;
    margin-right: 10px;
  }
  .page-title {
    font-size: 24px;
    margin-bottom: 15px;
  }
  .song-name {
    font-size: 15px;
  }
  .song-singer {
    font-size: 13px;
  }
}
</style>
