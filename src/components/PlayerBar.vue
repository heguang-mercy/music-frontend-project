<template>
  <div class="play-bar card">
    <!-- 歌曲信息和封面 -->
    <div class="song-info-container">
      <!-- 封面图 -->
      <div class="song-cover-container">
        <img
          v-if="currentSong?.cover"
          :src="currentSong.cover"
          :alt="currentSong?.name || '未播放歌曲'"
          class="song-cover"
          @error="handleCoverError"
        >
        <div v-else class="song-cover-placeholder">
          <ion-icon name="musical-notes-outline"></ion-icon>
        </div>
      </div>

      <!-- 歌曲信息 -->
      <div class="song-info">
        <div class="song-name main-text">{{ currentSong?.name || '未播放歌曲' }}</div>
        <div class="song-singer sub-text">{{ currentSong?.singer || '---' }}</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-section d-flex items-center gap-2 align-items-center" style="font-size: 16px;width: 80%">
      <!-- 左侧当前时间：增加容错，避免NaN显示 -->
      <div class="progress-time min-w-[50px] text-center">
        {{ formatTime(currentProgress) || "0:00" }}
      </div>

      <!-- 进度容器：用Bootstrap基础类统一样式，增加点击反馈 -->
      <div
        class="progress-container  h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
        @click="onProgressClick"
        title="点击调整播放进度"
        style="width: 80%"
      >
        <!-- 进度条：亮黄辅色+过渡动画，避免进度为0时消失 -->
        <div
          class="progress-bar bg-warning transition-all duration-300 ease-linear"
          :style="{
            width: `${progress || 0}%`,
            minWidth: '4px'
          }"
          role="progressbar"
          :aria-valuenow="progress || 0"
          :aria-valuemin="0"
          :aria-valuemax="100"
        ></div>
      </div>

      <!-- 右侧总时长：同样增加容错 -->
      <div class="progress-time min-w-[50px] text-center">
        {{ formatTime(currentDuration) || "0:00" }}
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="controls">
      <button class="control-btn" @click="playPrevious" title="上一首">
        <ion-icon name="play-skip-back-outline"></ion-icon>
      </button>
      <button class="control-btn play-pause-btn" @click="togglePlay" title="播放/暂停">
        <ion-icon :name="isPlaying ? 'pause-outline' : 'play-outline'"></ion-icon>
      </button>
      <button class="control-btn" @click="playNext" title="下一首">
        <ion-icon name="play-skip-forward-outline"></ion-icon>
      </button>
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
      currentDuration: 0
    }
  },

  computed: {
    progress () {
      if (!this.currentDuration || this.currentDuration <= 0) return 0
      return (this.currentProgress / this.currentDuration) * 100
    }
  },

  mounted () {
    player.init()

    // 事件处理函数用箭头函数，保证 this 指向组件
    this.onPlay = () => { this.isPlaying = true }
    this.onPause = () => { this.isPlaying = false }
    this.onEnded = () => { this.isPlaying = false }
    this.onLoadedMetadata = () => {
      this.currentDuration = player.audio.duration
    }
    this.onTimeUpdate = () => {
      this.currentProgress = player.audio.currentTime
      this.currentDuration = player.audio.duration
    }

    // 歌曲切换时重新绑定 audio 事件
    this.songChangedHandler = (song) => {
      this.currentSong = song
      player.playSong(song)
      this.removeAudioListeners()
      this.addAudioListeners()
    }
    Vue.prototype.$bus.$on('songChanged', this.songChangedHandler)

    // 首次绑定
    this.addAudioListeners()
  },

  beforeDestroy () {
    this.removeAudioListeners()
    Vue.prototype.$bus.$off('songChanged', this.songChangedHandler)
  },

  methods: {
    addAudioListeners () {
      if (player.audio) {
        player.audio.addEventListener('play', this.onPlay)
        player.audio.addEventListener('pause', this.onPause)
        player.audio.addEventListener('ended', this.onEnded)
        player.audio.addEventListener('loadedmetadata', this.onLoadedMetadata)
        player.audio.addEventListener('timeupdate', this.onTimeUpdate)
      }
    },
    removeAudioListeners () {
      if (player.audio) {
        player.audio.removeEventListener('play', this.onPlay)
        player.audio.removeEventListener('pause', this.onPause)
        player.audio.removeEventListener('ended', this.onEnded)
        player.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata)
        player.audio.removeEventListener('timeupdate', this.onTimeUpdate)
      }
    },
    togglePlay () {
      player.togglePause()
    },
    playPrevious () {
      console.log('播放上一首')
    },
    playNext () {
      console.log('播放下一首')
    },
    onProgressClick (event) {
      if (!this.currentDuration) return
      const progressBar = event.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const pos = (event.clientX - rect.left) / rect.width
      player.audio.currentTime = pos * this.currentDuration
    },
    formatTime (seconds) {
      if (isNaN(seconds) || seconds === undefined) return '0:00'
      const min = Math.floor(seconds / 60)
      const sec = Math.floor(seconds % 60)
      return `${min}:${sec < 10 ? '0' : ''}${sec}`
    },
    handleCoverError (event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.play-bar {
  border-radius: 15px;
  /* 核心：固定定位，让组件悬浮在窗口底部 */
  position: fixed; /* 相对于浏览器窗口固定位置 */
  bottom: 20px; /*离窗口底部20px */
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  min-height: 80px; /* 组件高度 */
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid var(--color-border);
  background-color: var(--color-card);
  /* 关键：设置z-index，确保悬浮在其他元素上方 */
  z-index: 999; /* 数值越大，越靠上（避免被其他元素遮挡） */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.play-bar:hover {
  transform: translateX(-50%) translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* 歌曲信息和封面容器 */
.song-info-container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 20px;
  min-width: 0; /* 允许内容收缩 */
}

/* 封面容器 */
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.song-cover-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background-color: var(--color-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

/* 歌曲信息 */
.song-info {
  flex: 1;
  min-width: 0; /* 允许内容收缩 */
}

.song-name {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  line-height: 1.2; /* 确保文字垂直居中 */
}

.song-singer {
  font-size: 14px;
  color: var(--color-nav-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2; /* 确保文字垂直居中 */
}

/* 进度条部分 */
.progress-section {
  display: flex;
  align-items: center;
  flex: 2;
  margin: 0 20px;
}

.progress-time {
  font-size: 12px;
  color: var(--color-text);
  margin: 0 8px;
  min-width: 35px;
}

.progress-container {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: var(--color-btn);
  border-radius: 3px;
  transition: width 0.1s linear;
}

/* 控制按钮 */
.controls {
  display: flex;
  align-items: center;
}

.control-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  margin: 0 5px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: var(--color-hover);
}

.play-pause-btn {
  width: 50px;
  height: 50px;
  font-size: 30px;
  background-color: var(--color-btn);
  color: white;
}

.play-pause-btn:hover {
  background-color: var(--color-btn);
  transform: scale(1.1);
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .play-bar {
    left: 10px;
    right: 10px;
    bottom: 10px;
    width: auto;
    transform: none;
    min-height: 70px;
    padding: 10px 15px;
    border-radius: 12px;
  }

  .song-info-container {
    margin-right: 10px;
  }

  .song-cover-container {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  .song-name {
    font-size: 16px;
  }

  .song-singer {
    font-size: 12px;
  }

  .progress-section {
    margin: 0 10px;
  }

  .progress-time {
    font-size: 10px;
    margin: 0 5px;
    min-width: 30px;
  }

  .control-btn {
    font-size: 20px;
    width: 35px;
    height: 35px;
  }

  .play-pause-btn {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .play-bar {
    left: 5px;
    right: 5px;
    bottom: 5px;
    min-height: 60px;
    padding: 8px 10px;
    border-radius: 10px;
  }

  .song-info-container {
    margin-right: 5px;
  }

  .song-cover-container {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }

  .song-name {
    font-size: 14px;
  }

  .song-singer {
    font-size: 10px;
  }

  .progress-section {
    margin: 0 5px;
  }

  .progress-time {
    font-size: 8px;
    margin: 0 3px;
    min-width: 25px;
  }

  .progress-container {
    height: 4px;
  }

  .control-btn {
    font-size: 18px;
    width: 30px;
    height: 30px;
    margin: 0 3px;
  }

  .play-pause-btn {
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
}
</style>
