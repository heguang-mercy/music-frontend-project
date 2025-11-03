<template>
  <!-- 外层：控制弹出隐藏 -->
  <div
    class="play-bar-wrapper"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <!-- 播放器本体 -->
    <div class="play-bar card">
      <!-- 点击封面来回跳 -->
      <div class="song-info-container" @click="togglePage">
        <div class="song-cover-container">
          <img
            v-if="currentSong?.cover"
            :src="currentSong.cover"
            alt="歌曲封面"
            class="song-cover"
            @error="handleCoverError"
          />
          <div v-else class="song-cover-placeholder">
            <ion-icon name="musical-notes-outline"></ion-icon>
          </div>
        </div>

        <div class="song-info">
          <div class="song-name main-text">
            {{ currentSong?.name || '未播放歌曲' }}
          </div>
          <div class="song-singer sub-text">
            {{ currentSong?.singer || '---' }}
          </div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <div class="progress-time">
          {{ formatTime(currentProgress) }}
        </div>
        <div class="progress-container" @click="onProgressClick">
          <div class="progress-bar" :style="{ width: `${progress}%` }" />
        </div>
        <div class="progress-time">
          {{ formatTime(currentDuration) }}
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
      show: false // 控制弹出
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
    Vue.prototype.$bus.$off('songChanged', this.songChangedHandler)
  },

  methods: {
    setupAudio () {
      this.onPlay = () => { this.isPlaying = true }
      this.onPause = () => { this.isPlaying = false }
      this.onEnded = () => { this.isPlaying = false }
      this.onLoadedMetadata = () => { this.currentDuration = player.audio.duration }
      this.onTimeUpdate = () => {
        this.currentProgress = player.audio.currentTime
        this.currentDuration = player.audio.duration
      }
      this.addAudioListeners()
    },

    addAudioListeners () {
      if (!player.audio) return
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((e, i) => player.audio.addEventListener(e, handlers[i]))
    },

    removeAudioListeners () {
      if (!player.audio) return
      const events = ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate']
      const handlers = [this.onPlay, this.onPause, this.onEnded, this.onLoadedMetadata, this.onTimeUpdate]
      events.forEach((e, i) => player.audio.removeEventListener(e, handlers[i]))
    },

    togglePlay () { player.togglePause() },
    playPrevious () { console.log('上一首') },
    playNext () { console.log('下一首') },

    onProgressClick (e) {
      if (!this.currentDuration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      player.audio.currentTime = pos * this.currentDuration
    },

    formatTime (s) {
      if (isNaN(s) || s === 0) return '0:00'
      const m = Math.floor(s / 60)
      const sec = Math.floor(s % 60)
      return `${m}:${sec < 10 ? '0' : ''}${sec}`
    },

    handleCoverError (e) {
      e.target.style.display = 'none'
    },

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
/* 外层：控制弹出位置 */
.play-bar-wrapper {
  position: fixed;
  bottom: -70px; /* 默认隐藏 */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  z-index: 999;
  transition: bottom 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 悬浮时弹出 */
.play-bar-wrapper:hover {
  bottom: 20px;
}

/* 播放器卡片 */
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
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
}

/* 底部小凸起（触发悬浮） */
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
  cursor: pointer;
}

/* 弹出时隐藏凸起 */
.play-bar-wrapper:hover .play-bar::before {
  opacity: 0;
}

/* 内容区 */
.song-info-container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 20px;
  min-width: 0;
  cursor: pointer;
}
.song-cover-container { width: 60px; height: 60px; margin-right: 15px; flex-shrink: 0; }
.song-cover { width: 100%; height: 100%; border-radius: 8px; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,.2); }
.song-cover-placeholder { width: 100%; height: 100%; border-radius: 8px; background: var(--color-btn); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; }
.song-info { flex: 1; min-width: 0; }
.song-name { font-size: 18px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
.song-singer { font-size: 14px; color: var(--color-nav-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.progress-section { display: flex; align-items: center; flex: 2; margin: 0 20px; }
.progress-time { font-size: 12px; color: var(--color-text); min-width: 40px; text-align: center; }
.progress-container { flex: 1; height: 6px; background: #ddd; border-radius: 3px; overflow: hidden; cursor: pointer; }
.progress-bar { height: 100%; background: var(--color-btn); border-radius: 3px; transition: width .1s linear; min-width: 4px; }

.controls { display: flex; align-items: center; }
.control-btn { background: none; border: none; color: var(--color-text); font-size: 24px; cursor: pointer; padding: 5px; margin: 0 5px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all .3s; }
.control-btn:hover { background: var(--color-hover); }
.play-pause-btn { width: 50px; height: 50px; font-size: 30px; background: var(--color-btn); color: #fff; }
.play-pause-btn:hover { transform: scale(1.1); }

/* 手机端 */
@media (max-width: 768px) {
  .play-bar-wrapper {
    width: calc(100% - 20px);
    left: 10px;
    transform: none;
    bottom: -70px;
  }
  .play-bar-wrapper:hover { bottom: 10px; }
  .song-cover-container { width: 50px; height: 50px; }
}
</style>
