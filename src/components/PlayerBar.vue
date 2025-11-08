<template>
  <div class="play-bar-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <div class="play-bar card">

      <!-- 歌曲信息 -->
      <div class="song-info-container" @click="togglePage">
        <div class="song-cover-container">
          <img v-if="currentSong?.cover" :src="currentSong.cover" alt="封面" class="song-cover" @error="handleCoverError" />
          <div v-else class="song-cover-placeholder">
            <ion-icon name="musical-notes-outline"></ion-icon>
          </div>
        </div>

        <div class="song-info">
          <div class="song-name main-text">{{ currentSong?.name || '未播放歌曲' }}</div>
          <div class="song-singer sub-text">{{ currentSong?.singer || '---' }}</div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button @click.stop="playPrevious" class="control-btn" title="上一首">
          <ion-icon name="play-skip-back-outline"></ion-icon>
        </button>
        <button @click.stop="togglePlay" class="control-btn play-pause-btn" title="播放/暂停">
          <ion-icon :name="isPlaying ? 'pause-outline' : 'play-outline'"></ion-icon>
        </button>
        <button @click.stop="playNext" class="control-btn" title="下一首">
          <ion-icon name="play-skip-forward-outline"></ion-icon>
        </button>
      </div>

      <!-- 全宽进度条（拉长到整个播放栏） -->
      <div class="full-progress-section">
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

      <!-- 歌曲信息下方小进度条（可选保留） -->
      <div class="current-song-progress-wrapper">
        <div class="current-song-progress-bg">
          <div class="current-song-progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import player from '@/utils/player'
import Vue from 'vue'

export default {
  data () {
    return {
      currentSong: null,
      isPlaying: false,
      currentProgress: 0,
      currentDuration: 0,
      fromPath: null,
      show: false,
      isDragging: false
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
    player.init()
    this.setupAudio()
    this.setupSongChange()
  },

  beforeDestroy () {
    this.removeAudioListeners()
    this.removeDragListeners()
    Vue.prototype.$bus.$off('songChanged', this.songChangedHandler)
  },

  methods: {
    /* ========== 音频监听 ========== */
    setupAudio () {
      this.onPlay = () => { this.isPlaying = true }
      this.onPause = () => { this.isPlaying = false }
      this.onEnded = () => { this.isPlaying = false }
      this.onLoadedMetadata = () => { this.currentDuration = player.audio.duration }
      this.onTimeUpdate = () => {
        if (!this.isDragging) {
          this.currentProgress = player.audio.currentTime
        }
        this.currentDuration = player.audio.duration
      }
      this.addAudioListeners()
    },

    addAudioListeners () {
      if (!player.audio) return
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((event, i) => player.audio.addEventListener(event, handlers[i]))
    },

    removeAudioListeners () {
      if (!player.audio) return
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((event, i) => player.audio.removeEventListener(event, handlers[i]))
    },

    /* ========== 拖拽进度条 ========== */
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
      player.audio.currentTime = pos * this.currentDuration
    },

    removeDragListeners () {
      document.removeEventListener('mousemove', () => {})
      document.removeEventListener('mouseup', () => {})
      document.removeEventListener('touchmove', () => {})
      document.removeEventListener('touchend', () => {})
    },

    /* ========== 播放控制 ========== */
    togglePlay () { player.togglePause() },
    playPrevious () { console.log('上一首') },
    playNext () { console.log('下一首') },

    /* ========== 工具函数 ========== */
    formatTime (s) {
      if (isNaN(s) || s === 0) return '0:00'
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec < 10 ? '0' : ''}${sec}`
    },

    handleCoverError (e) { e.target.style.display = 'none' },

    setupSongChange () {
      this.songChangedHandler = (song) => {
        this.currentSong = song
        player.playSong(song)
        this.removeAudioListeners()
        this.addAudioListeners()
      }
      Vue.prototype.$bus.$on('songChanged', this.songChangedHandler)
    },

    togglePage () {
      const target = '/first-image'
      if (this.$route.path === target && this.fromPath) {
        this.$router.push(this.fromPath)
        this.fromPath = null
        return
      }
      if (this.$route.path !== target) {
        this.fromPath = this.$route.path
        this.$router.push(target)
      }
    }
  }
}
</script>

<style scoped>
.play-bar-wrapper {
  position: fixed;
  bottom: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 999;
  transition: bottom .4s cubic-bezier(.25,.8,.25,1);
}

.play-bar-wrapper:hover,
.play-bar-wrapper.show {
  bottom: 20px;
}

.play-bar {
  width: 100%;
  min-height: 80px;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid var(--color-border);
  background: var(--color-card);
  box-shadow: 0 5px 15px rgba(0,0,0,.2);
  border-radius: 15px 15px 0 0;
  position: relative;
  overflow: hidden;
}

.play-bar::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 10px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
}

.play-bar-wrapper:hover .play-bar::before {
  opacity: 0;
}

.song-info-container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 20px;
  min-width: 0;
  cursor: pointer;
  position: relative;
}

.song-cover-container {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
}

.song-cover {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0,0,0,.2);
}

.song-cover-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: var(--color-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.song-info {
  flex: 1;
  min-width: 0;
  position: relative;
}

.song-name {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.song-singer {
  font-size: 14px;
  color: var(--color-nav-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 歌曲信息下方小进度条（可选） */
.current-song-progress-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  pointer-events: none;
  border-radius: 2px;
  overflow: hidden;
}

.current-song-progress-bg {
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.15);
}

.current-song-progress-fill {
  height: 100%;
  background: var(--color-btn);
  border-radius: 2px;
  transition: width .2s linear;
}

/* 全宽进度条（关键修改） */
.full-progress-section {
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}

.full-progress-section .progress-time {
  font-size: 11px;
  color: var(--color-text);
  min-width: 36px;
  flex-shrink: 0;
  pointer-events: auto;
  font-weight: 500;
}

.full-progress-section .progress-container {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
  margin: 0 8px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  transition: height 0.2s ease;
}

.full-progress-section .progress-container:hover {
  height: 6px;
}

.full-progress-section .progress-bar {
  height: 100%;
  background: var(--color-btn);
  border-radius: 2px;
  transition: width 0.12s ease;
  min-width: 0;
}

.full-progress-section .progress-thumb {
  position: absolute;
  top: 50%;
  left: 0;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2.5px solid var(--color-btn);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.full-progress-section .progress-container:hover .progress-thumb {
  opacity: 1;
}

.controls {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.control-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all .3s;
}

.control-btn:hover {
  background: var(--color-hover);
}

.play-pause-btn {
  width: 50px;
  height: 50px;
  font-size: 30px;
  background: var(--color-btn);
  color: #fff;
}

.play-pause-btn:hover {
  transform: scale(1.1);
}

/* 响应式 */
@media (max-width: 768px) {
  .play-bar-wrapper {
    width: calc(100% - 20px);
    left: 10px;
    transform: none;
    bottom: -70px;
  }

  .play-bar-wrapper:hover,
  .play-bar-wrapper.show {
    bottom: 10px;
  }

  .song-cover-container {
    width: 50px;
    height: 50px;
  }

  .current-song-progress-wrapper {
    height: 2px;
  }

  .full-progress-section {
    bottom: 8px;
    left: 15px;
    right: 15px;
  }

  .full-progress-section .progress-time {
    font-size: 10px;
    min-width: 32px;
  }

  .full-progress-section .progress-container {
    height: 3px;
    margin: 0 6px;
  }

  .full-progress-section .progress-container:hover {
    height: 5px;
  }

  .full-progress-section .progress-thumb {
    width: 10px;
    height: 10px;
  }
}
</style>

