<template>
  <div class="position-relative">
    <!-- 圆形默认形态 -->
    <div
      class="w-12 h-12 md:w-14 md:h-14 rounded-circle bg-gradient-to-br from-primary to-purple-600 d-flex align-items-center justify-content-center shadow-lg cursor-pointer z-10 transition-all duration-300 hover:scale-105"
      @mouseenter="isExpanded = true"
    >
      <i v-if="isPlaying" class="fas fa-pause text-white text-xl"></i>
      <i v-else class="fas fa-play text-white text-xl"></i>
    </div>

    <!-- 展开后的长条形播放器 -->
    <div
      class="position-absolute bottom-100 start-50 translate-middle-x mb-3 w-80 bg-dark rounded-xl shadow-2xl shadow-black/30 border border-gray-700 p-4 transition-all duration-300 ease-out z-50"
      :style="{
        opacity: isExpanded ? 1 : 0,
        visibility: isExpanded ? 'visible' : 'hidden',
        transform: isExpanded ? 'translate(-50%, 0)' : 'translate(-50%, 10px)'
      }"
      @mouseleave="isExpanded = false"
    >
      <!-- 展开状态的播放器内容 -->
      <div class="d-flex align-items-center">
        <!-- 专辑封面 -->
        <div class="w-14 h-14 rounded overflow-hidden flex-shrink-0">
          <img
            :src="currentSong.cover"
            :alt="currentSong.title"
            class="w-100 h-100 object-cover"
          >
        </div>

        <!-- 歌曲信息 -->
        <div class="ms-4 flex-grow min-w-0">
          <h4 class="text-sm font-medium truncate">{{ currentSong.title }}</h4>
          <p class="text-xs text-gray-400 truncate">{{ currentSong.artist }}</p>

          <!-- 进度条 -->
          <div class="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-100 bg-gradient-to-r from-primary to-purple-600"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>

          <div class="d-flex justify-content-between mt-1">
            <span class="text-xs text-gray-500">{{ formatTime(currentTime) }}</span>
            <span class="text-xs text-gray-500">{{ currentSong.duration }}</span>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="ms-4 d-flex align-items-center gap-3">
          <button class="text-gray-400 hover:text-white transition-colors" aria-label="上一首">
            <i class="fas fa-step-backward"></i>
          </button>
          <button
            class="w-8 h-8 rounded-circle bg-primary d-flex align-items-center justify-content-center hover:bg-primary/80 transition-colors"
            @click="togglePlay"
            aria-label="播放/暂停"
          >
            <i v-if="isPlaying" class="fas fa-pause text-white text-xs"></i>
            <i v-else class="fas fa-play text-white text-xs"></i>
          </button>
          <button class="text-gray-400 hover:text-white transition-colors" aria-label="下一首">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatingPlayer',
  data () {
    return {
      isExpanded: false, // 是否展开
      isPlaying: false, // 播放状态
      currentTime: 45, // 当前播放时间（秒）
      progress: 30, // 播放进度（百分比）
      currentSong: {
        title: 'Starlight',
        artist: 'Electronic Dreams',
        cover: 'https://picsum.photos/seed/song1/300/300',
        duration: '3:45'
      }
    }
  },
  methods: {
    // 切换播放状态
    togglePlay () {
      this.isPlaying = !this.isPlaying
    },
    // 格式化时间
    formatTime (seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }
  }
}
</script>

<style scoped>
/* 确保展开的播放器不会被其他元素遮挡 */
.z-50 {
  z-index: 50 !important;
}
</style>
