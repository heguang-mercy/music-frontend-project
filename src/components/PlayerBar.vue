<template>
  <div class="play-bar">
    <!-- 歌曲信息（默认显示“未播放”） -->
    <div class="song-info">
      <div class="song-name main-text">{{ currentSong?.name || '未播放歌曲' }}</div>
      <div class="song-singer sub-text">{{ currentSong?.singer || '---' }}</div>
    </div>

    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 播放/暂停按钮 -->
    <button class="btn-primary" @click="togglePlay">
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
  </div>
</template>

<script>
import player from '@/utils/player'
import Vue from 'vue'

export default {
  data () {
    return {
      currentSong: null, // 当前播放的歌曲
      progress: 0, // 播放进度（0-100）
      isPlaying: false, // 是否正在播放
      progressTimer: null // 定时器（更新进度条）
    }
  },

  mounted () {
    // 1. 初始化播放工具
    player.init()

    // 2. 监听歌曲变化事件（来自歌曲列表的双击）
    Vue.prototype.$bus.$on('songChanged', (song) => {
      this.currentSong = player.playSong(song)
      console.log('发送播放事件，歌曲信息：', this.currentSong)
      this.isPlaying = true // 双击后一定是播放状态
    })

    // 3. 监听音频的播放/暂停状态（比如歌曲自然播放结束）
    player.audio.addEventListener('play', () => {
      this.isPlaying = true
    })
    player.audio.addEventListener('pause', () => {
      this.isPlaying = false
    })

    // 4. 启动定时器，每秒更新一次进度条
    this.progressTimer = setInterval(() => {
      this.progress = player.getProgress()
    }, 1000)
  },

  beforeDestroy () {
    // 离开页面时清除定时器（避免内存泄漏）
    clearInterval(this.progressTimer)
  },

  methods: {
    // 点击播放/暂停按钮
    togglePlay () {
      player.togglePause() // 调用播放工具的暂停/继续方法
    }
  }
}
</script>

<style scoped>
.play-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: #f5f5f5;
  border-top: 1px solid #eee;
}

.song-info {
  flex: 1; /* 占满剩余空间 */
  margin-right: 20px;
}

.progress-container {
  flex: 2;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #42b983; /* Vue的绿色，可换成你的主题色 */
}

.btn-primary {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #42b983;
  color: white;
  cursor: pointer;
}
</style>
