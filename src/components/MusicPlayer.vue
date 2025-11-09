<template>
  <div class="player-page">
    <!-- 顶部导航 -->
    <div class="page-header">
      <button class="back-btn" @click="$router.go(-1)">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <h1 class="page-title">正在播放</h1>
    </div>

    <!-- 专辑封面区域 -->
    <div class="album-cover-container">
      <div class="album-cover-wrapper" :class="{ rotating: isPlaying }">
        <img
          v-if="currentSong?.cover"
          :src="currentSong.cover"
          alt="专辑封面"
          class="album-cover"
          @error="handleCoverError"
        >
        <div v-else class="cover-placeholder">
          <ion-icon name="musical-notes-outline"></ion-icon>
        </div>
      </div>
    </div>

    <!-- 歌曲信息 -->
    <div class="song-info">
      <h2 class="song-title">{{ currentSong?.name || '未知歌曲' }}</h2>
      <p class="song-artist">{{ currentSong?.singer || '未知歌手' }}</p>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <div class="progress-time">{{ formatTime(currentProgress) }}</div>
      <div
        class="progress-container"
        ref="progressContainer"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <div class="progress-thumb" :style="{ left: progress + '%' }"></div>
      </div>
      <div class="progress-time">{{ formatTime(currentDuration) }}</div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button class="control-btn" @click="playPrevious">
        <ion-icon name="play-skip-back-outline"></ion-icon>
      </button>
      <button class="main-control-btn" @click="togglePlay">
        <ion-icon :name="isPlaying ? 'pause-circle-outline' : 'play-circle-outline'"></ion-icon>
      </button>
      <button class="control-btn" @click="playNext">
        <ion-icon name="play-skip-forward-outline"></ion-icon>
      </button>
    </div>

    <!-- 音量控制 -->
    <div class="volume-control">
      <button class="volume-btn" @click="toggleMute">
        <ion-icon :name="isMuted ? 'volume-mute-outline' : 'volume-high-outline'"></ion-icon>
      </button>
      <input
        type="range"
        class="volume-slider"
        min="0"
        max="1"
        step="0.05"
        v-model="volume"
        @input="setVolume"
      >
    </div>
  </div>
</template>

<script>
import player from '@/utils/player'
import Vue from 'vue'

export default {
  name: 'MusicPlayerPage',
  data () {
    return {
      currentSong: null,
      isPlaying: false,
      currentProgress: 0,
      currentDuration: 0,
      volume: 1,
      isMuted: false,
      loopMode: 'all', // 'all' 或 'one'
      isDragging: false,
      playQueue: []
    }
  },

  computed: {
    progress () {
      return this.currentDuration > 0
        ? (this.currentProgress / this.currentDuration) * 100
        : 0
    }
  },

  mounted () {
    // 初始化播放器
    player.init()
    this.setupAudio()
    this.setupEventListeners()
    this.loadPlayQueue()
    this.checkFavoriteStatus()
    Vue.prototype.$bus.$on('queueChanged', (queue) => {
      this.playQueue = queue
    })
  },

  beforeDestroy () {
    this.removeAudioListeners()
    this.removeDragListeners()
    Vue.prototype.$bus.$off('songChanged', this.handleSongChange)
  },

  methods: {
    // 音频相关
    setupAudio () {
      this.onPlay = () => { this.isPlaying = true }
      this.onPause = () => { this.isPlaying = false }
      this.onEnded = () => this.handlePlayEnd()
      this.onLoadedMetadata = () => {
        this.currentDuration = player.audio.duration
        this.volume = player.audio.volume
      }
      this.onTimeUpdate = () => {
        if (!this.isDragging) {
          this.currentProgress = player.audio.currentTime
        }
        if (!isNaN(player.audio.duration)) {
          this.currentDuration = player.audio.duration
        }
      }
      this.addAudioListeners()
      this.onError = () => {
        this.$message.error('音频加载失败，请尝试其他歌曲')
        this.isPlaying = false
      }
    },

    addAudioListeners () {
      if (!player.audio) return
      this.removeAudioListeners()
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((event, i) => {
        player.audio.removeEventListener(event, handlers[i])
        player.audio.addEventListener(event, handlers[i])
      })
    },

    removeAudioListeners () {
      if (!player.audio) return
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((event, i) => player.audio.removeEventListener(event, handlers[i]))
    },

    // 事件监听
    setupEventListeners () {
      this.handleSongChange = (song) => {
        this.currentSong = song
        this.checkFavoriteStatus()
      }
      Vue.prototype.$bus.$on('songChanged', this.handleSongChange)
    },

    // 播放控制
    togglePlay () {
      player.togglePause()
    },

    playSong (song) {
      const currentSong = player.playSong(song)
      Vue.prototype.$bus.$emit('songChanged', currentSong)
      this.playQueue = player.getPlayQueue()
    },

    playPrevious () {
      const prevSong = player.playPrevious()
      if (prevSong) {
        Vue.prototype.$bus.$emit('songChanged', prevSong)
      }
    },

    playNext () {
      const nextSong = player.playNext()
      if (nextSong) {
        Vue.prototype.$bus.$emit('songChanged', nextSong)
      }
    },

    handlePlayEnd () {
      if (this.loopMode === 'one') {
        player.audio.currentTime = 0
        player.play()
      } else {
        this.playNext()
      }
    },

    // 进度条拖拽
    startDrag (e) {
      if (!this.currentDuration) return
      this.isDragging = true
      this.updateProgress(e)

      const moveHandler = (moveE) => {
        if (!this.isDragging) return
        this.updateProgress(moveE)
      }

      const upHandler = () => {
        this.isDragging = false
        document.removeEventListener('mousemove', moveHandler)
        document.removeEventListener('mouseup', upHandler)
        document.removeEventListener('touchmove', moveHandler)
        document.removeEventListener('touchend', upHandler)
      }

      document.addEventListener('mousemove', moveHandler)
      document.addEventListener('mouseup', upHandler)
      document.addEventListener('touchmove', moveHandler, { passive: false })
      document.addEventListener('touchend', upHandler)

      e.preventDefault()
    },

    updateProgress (e) {
      const rect = this.$refs.progressContainer.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      let pos = (clientX - rect.left) / rect.width
      pos = Math.max(0, Math.min(1, pos))
      const newTime = pos * this.currentDuration
      player.audio.currentTime = newTime
      this.currentProgress = newTime
    },

    removeDragListeners () {
      document.removeEventListener('mousemove', () => {})
      document.removeEventListener('mouseup', () => {})
      document.removeEventListener('touchmove', () => {})
      document.removeEventListener('touchend', () => {})
    },

    // 音量控制
    setVolume () {
      player.audio.volume = this.volume
      this.isMuted = this.volume === 0
    },

    toggleMute () {
      this.isMuted = !this.isMuted
      player.audio.muted = this.isMuted
    },

    // 加载播放队列
    loadPlayQueue () {
      this.playQueue = player.getPlayQueue() || []
      this.currentSong = player.getCurrentSong()
      // 新增：如果队列有歌曲但未设置索引，手动初始化索引
      if (this.playQueue.length > 0 && player.currentIndex === -1) {
        player.currentIndex = this.playQueue.findIndex(song => song.id === this.currentSong?.id)
      }
    },

    // 工具函数
    formatTime (s) {
      if (isNaN(s) || s === 0) return '0:00'
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec < 10 ? '0' : ''}${sec}`
    },

    handleCoverError (e) {
      e.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.player-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: var(--text-primary);
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-primary);
  margin-right: 20px;
  cursor: pointer;
}

.album-cover-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.album-cover-wrapper {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.rotating {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 60px;
}

.song-info {
  text-align: center;
  margin-bottom: 30px;
}

.song-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 18px;
  color: var(--text-secondary);
}

.progress-section {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.progress-time {
  font-size: 14px;
  color: var(--text-secondary);
  min-width: 40px;
}

.progress-container {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin: 0 10px;
  position: relative;
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  background: var(--color-btn);
  border-radius: 2px;
}

.progress-thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-btn);
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.control-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  color: var(--color-btn);
  transform: scale(1.1);
}

.main-control-btn {
  background: none;
  border: none;
  font-size: 64px;
  color: var(--color-btn);
  cursor: pointer;
  transition: all 0.2s;
}

.main-control-btn:hover {
  transform: scale(1.05);
}

.volume-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 50px;
}

.volume-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-primary);
  cursor: pointer;
}

.volume-slider {
  width: 200px;
}

.playlist-section {
  margin-top: 30px;
}

.playlist-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.playlist-list {
  max-height: 300px;
  overflow-y: auto;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.queue-item:hover {
  background-color: var(--secondary-bg);
}

.queue-item.active {
  background-color: rgba(66, 185, 131, 0.1);
}

.queue-item-info {
  flex: 1;
}

.queue-item-name {
  font-weight: 600;
  display: block;
}

.queue-item-singer {
  font-size: 14px;
  color: var(--text-secondary);
}

.queue-item-duration {
  font-size: 14px;
  color: var(--text-secondary);
  margin-left: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .album-cover-wrapper {
    width: 250px;
    height: 250px;
  }

  .song-title {
    font-size: 24px;
  }

  .control-btn {
    font-size: 28px;
  }

  .main-control-btn {
    font-size: 56px;
  }
}

@media (max-width: 480px) {
  .album-cover-wrapper {
    width: 200px;
    height: 200px;
  }

  .song-title {
    font-size: 20px;
  }

  .song-artist {
    font-size: 16px;
  }

  .controls {
    gap: 15px;
  }

  .control-btn {
    font-size: 24px;
  }

  .main-control-btn {
    font-size: 48px;
  }

  .volume-slider {
    width: 150px;
  }
}
</style>
