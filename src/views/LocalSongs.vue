<template>
  <div class="local-songs-page">
    <h1 class="page-title">本地歌曲</h1>

    <!-- 歌曲列表 -->
    <div class="songs-list">
      <!-- 关键：添加 @dblclick 双击事件 -->
      <div
        v-for="song in songs"
        :key="song.id"
        class="song-item"
        @dblclick="handleDoubleClick(song)">  <!-- 双击播放 -->
        <!-- 新增固定文本，确认循环是否渲染 -->
        <div>测试歌曲项：{{ song.id }}</div>
        <!-- 封面图 -->
      <img :src="song.cover" :alt="song.name" class="song-cover">
      <!-- 歌曲信息 -->
       <div class="song-info">
        <div class="song-name component-title">{{ song.name }}</div>
        <div class="song-singer main-text">{{ song.singer }}</div>
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
    this.songs = songsData.map(song => ({
      ...song,
      audio: `/audios/${song.audio.split('/').pop()}`,
      cover: `/images/${song.cover.split('/').pop()}`
    }))
  },
  methods: {
    handleDoubleClick (song) {
      const currentSong = player.playSong(song)
      Vue.prototype.$bus.$emit('songChanged', currentSong)
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
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.song-item:hover {
  background-color: #f5f5f5;
}

.song-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 15px;
}

.song-info {
  flex: 1;  /* 占满剩余宽度 */
}

.song-duration {
  color: #999;
}
</style>
