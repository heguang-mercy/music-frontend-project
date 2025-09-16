<template>
  <div class="min-vh-100 bg-gradient-to-br from-dark to-gray-800 text-white d-flex flex-column">
    <!-- 顶部导航 -->
    <header class="bg-dark/80 backdrop-blur-md border-bottom border-gray-700 py-4 px-6 sticky top-0 z-50">
      <div class="container mx-auto d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <i class="fas fa-music text-2xl text-primary"></i>
          <h1 class="text-xl font-bold text-primary">
            Harmony Player
          </h1>
        </div>
        <div class="d-flex align-items-center gap-4">
          <button class="hover:text-primary transition-colors" aria-label="搜索">
            <i class="fas fa-search"></i>
          </button>
          <button class="hover:text-primary transition-colors" aria-label="主题切换">
            <i class="fas fa-moon"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow container mx-auto px-4 py-8 d-flex flex-column lg:flex-row gap-8">
      <!-- 左侧专辑封面和控制区 -->
      <section class="lg:w-1/2 d-flex flex-column align-items-center justify-content-center">
        <div class="relative group mb-8">
          <!-- 专辑封面 -->
          <div class="w-64 h-64 md:w-80 md:h-80 rounded-circle overflow-hidden shadow-2xl shadow-primary/30 border-4 border-gray-700/50 relative">
            <img
              :src="currentSong.cover"
              :alt="currentSong.album"
              class="w-100 h-100 object-cover transition-transform duration-10000 ease-linear"
              :class="{ 'rotate-360': isPlaying }"
            >
          </div>

          <!-- 旋转的唱片效果 -->
          <div class="absolute top-50 start-50 translate-middle w-16 h-16 rounded-circle bg-dark border-4 border-gray-800 z-10"></div>

          <!-- 播放状态指示光环 -->
          <div v-if="isPlaying" class="absolute inset-0 rounded-circle border-4 border-primary/30 animate-ping"></div>
        </div>

        <!-- 歌曲信息 -->
        <div class="text-center mb-8 max-w-md">
          <h2 class="text-2xl md:text-3xl font-bold mb-2 truncate">{{ currentSong.title }}</h2>
          <p class="text-gray-400 mb-1">{{ currentSong.artist }}</p>
          <p class="text-gray-500 text-sm">{{ currentSong.album }}</p>
        </div>

        <!-- 进度条 -->
        <div class="w-100 max-w-md mb-2">
          <div class="d-flex justify-content-between text-xs text-gray-500 mb-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
          <div
            class="h-1 bg-gray-700 rounded-full cursor-pointer relative group"
            @click="seek"
          >
            <div
              class="h-100 bg-gradient-to-r from-primary to-purple-600 rounded-full"
              :style="{ width: `${progress}%` }"
            ></div>
            <div
              class="absolute top-50 translate-middle-y h-3 w-3 bg-white rounded-full shadow-md transition-transform group-hover:scale-150"
              :style="{ left: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="d-flex align-items-center justify-content-center gap-6 md:gap-10">
          <button
            @click="changeSong(-1)"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="上一曲"
          >
            <i class="fas fa-step-backward text-xl"></i>
          </button>
          <button
            @click="toggleShuffle"
            class="text-gray-400 hover:text-white transition-colors"
            :class="{ 'text-primary': isShuffle }"
            aria-label="随机播放"
          >
            <i class="fas fa-random text-xl"></i>
          </button>
          <button
            @click="playPrevious"
            class="text-gray-300 hover:text-white transition-colors"
            aria-label="前一首"
          >
            <i class="fas fa-backward text-2xl"></i>
          </button>
          <button
            @click="togglePlay"
            class="w-14 h-14 md:w-16 md:h-16 rounded-circle bg-gradient-to-r from-primary to-purple-600 d-flex align-items-center justify-content-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            aria-label="播放/暂停"
          >
            <i v-if="isPlaying" class="fas fa-pause text-2xl"></i>
            <i v-else class="fas fa-play text-2xl"></i>
          </button>
          <button
            @click="playNext"
            class="text-gray-300 hover:text-white transition-colors"
            aria-label="下一首"
          >
            <i class="fas fa-forward text-2xl"></i>
          </button>
          <button
            @click="toggleRepeat"
            class="text-gray-400 hover:text-white transition-colors"
            :class="{ 'text-primary': repeatMode !== 'none' }"
            aria-label="循环模式"
          >
            <i v-if="repeatMode === 'none'" class="fas fa-redo text-xl"></i>
            <i v-if="repeatMode === 'all'" class="fas fa-redo text-xl"></i>
            <i v-if="repeatMode === 'one'" class="fas fa-redo-alt text-xl"></i>
            <span class="sr-only">{{ repeatMode === 'none' ? '不循环' : repeatMode === 'all' ? '循环全部' : '单曲循环' }}</span>
          </button>
          <button
            @click="changeSong(1)"
            class="text-gray-400 hover:text-white transition-colors"
            aria-label="下一曲"
          >
            <i class="fas fa-step-forward text-xl"></i>
          </button>
        </div>

        <!-- 音量控制 -->
        <div class="d-flex align-items-center gap-3 mt-6 w-100 max-w-xs">
          <i class="fas fa-volume-up text-gray-400"></i>
          <input
            type="range"
            min="0"
            max="100"
            v-model="volume"
            @input="setVolume"
            class="w-100 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            aria-label="音量控制"
          >
        </div>
      </section>

      <!-- 右侧播放列表 -->
      <section class="lg:w-1/2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
        <div class="d-flex justify-content-between align-items-center mb-6">
          <h2 class="text-xl font-bold d-flex align-items-center">
            <i class="fas fa-list-ul me-2 text-primary"></i>
            播放列表
          </h2>
          <span class="text-gray-400 text-sm">{{ currentIndex + 1 }} / {{ songs.length }}</span>
        </div>

        <div class="gap-1 max-h-[500px] overflow-y-auto pe-2">
          <div
            v-for="(song, index) in songs"
            :key="song.id"
            @click="playSong(index)"
            class="d-flex align-items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-700/30 group"
            :class="{ 'bg-gray-700/30': index === currentIndex }"
          >
            <!-- 序号 -->
            <div class="w-8 text-center text-gray-400 me-3">
              <span v-if="index !== currentIndex">{{ index + 1 }}</span>
              <i v-else class="fas fa-music text-primary"></i>
            </div>

            <!-- 歌曲信息 -->
            <div class="flex-grow min-w-0">
              <h3 class="font-medium truncate group-hover:text-primary transition-colors">
                {{ song.title }}
              </h3>
              <p class="text-sm text-gray-400 truncate">{{ song.artist }}</p>
            </div>

            <!-- 时长和操作 -->
            <div class="d-flex align-items-center ms-4">
              <span class="text-sm text-gray-400 me-3">{{ song.duration }}</span>
              <button
                @click.stop="toggleLike(song.id)"
                class="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="喜欢"
              >
                <i v-if="song.isLiked" class="fas fa-heart text-pink-500"></i>
                <i v-else class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 最近播放和喜欢的歌曲标签页 -->
        <div class="mt-8">
          <div class="border-bottom border-gray-700">
            <ul class="d-flex gap-8 text-sm">
              <li>
                <button class="py-2 border-bottom-2 border-primary text-primary font-medium">
                  最近播放
                </button>
              </li>
              <li>
                <button class="py-2 border-bottom-2 border-transparent text-gray-400 hover:text-white transition-colors">
                  喜欢的歌曲
                </button>
              </li>
            </ul>
          </div>

          <div class="mt-4 gap-2">
            <div v-for="(song, index) in recentPlays" :key="`recent-${index}`" class="text-sm text-gray-400 hover:text-white transition-colors">
              {{ index + 1 }}. {{ song.title }} - {{ song.artist }}
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部播放栏（在小屏幕上显示） -->
    <div class="lg:hidden bg-dark/90 backdrop-blur-md border-top border-gray-800 py-3 px-4">
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          <div class="w-12 h-12 rounded overflow-hidden">
            <img :src="currentSong.cover" :alt="currentSong.title" class="w-100 h-100 object-cover">
          </div>
          <div class="min-w-0">
            <h4 class="text-sm font-medium truncate">{{ currentSong.title }}</h4>
            <p class="text-xs text-gray-400 truncate">{{ currentSong.artist }}</p>
          </div>
        </div>

        <div class="d-flex align-items-center gap-4">
          <button @click="playPrevious" class="text-gray-300 hover:text-white" aria-label="上一首">
            <i class="fas fa-backward"></i>
          </button>
          <button @click="togglePlay" class="w-8 h-8 rounded-circle bg-primary d-flex align-items-center justify-center" aria-label="播放/暂停">
            <i v-if="isPlaying" class="fas fa-pause text-xs"></i>
            <i v-else class="fas fa-play text-xs"></i>
          </button>
          <button @click="playNext" class="text-gray-300 hover:text-white" aria-label="下一首">
            <i class="fas fa-forward"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 音频元素 -->
    <audio
      ref="audioPlayer"
      :src="currentSong.url"
      @timeupdate="updateProgress"
      @loadedmetadata="setDuration"
      @ended="handleEnded"
      class="d-none"
    ></audio>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 播放状态
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      volume: 80,
      currentIndex: 0,
      repeatMode: 'none', // 'none', 'all', 'one'
      isShuffle: false,

      // 模拟歌曲数据
      songs: [
        {
          id: 1,
          title: 'Starlight',
          artist: 'Electronic Dreams',
          album: 'Neon Horizons',
          cover: 'https://picsum.photos/seed/song1/300/300',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          duration: '3:45',
          isLiked: false
        },
        {
          id: 2,
          title: 'Ocean Waves',
          artist: 'Ambient Sounds',
          album: "Nature's Rhythm",
          cover: 'https://picsum.photos/seed/song2/300/300',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          duration: '4:12',
          isLiked: true
        },
        {
          id: 3,
          title: 'Urban Jungle',
          artist: 'City Beats',
          album: 'Metropolitan',
          cover: 'https://picsum.photos/seed/song3/300/300',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          duration: '3:58',
          isLiked: false
        },
        {
          id: 4,
          title: 'Mountain Echo',
          artist: 'Acoustic Sessions',
          album: "Nature's Voice",
          cover: 'https://picsum.photos/seed/song4/300/300',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
          duration: '5:20',
          isLiked: false
        },
        {
          id: 5,
          title: 'Desert Wind',
          artist: 'World Music Ensemble',
          album: 'Global Journeys',
          cover: 'https://picsum.photos/seed/song5/300/300',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
          duration: '4:35',
          isLiked: true
        }
      ],

      // 最近播放列表
      recentPlays: []
    }
  },

  computed: {
    currentSong () {
      return this.songs[this.currentIndex]
    }
  },

  methods: {
    // 播放/暂停切换
    togglePlay () {
      const audio = this.$refs.audioPlayer
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
        // 添加到最近播放
        this.addToRecentPlays(this.currentSong)
      }
      this.isPlaying = !this.isPlaying
    },

    // 播放指定歌曲
    playSong (index) {
      if (index === this.currentIndex && this.isPlaying) {
        this.togglePlay()
        return
      }

      this.currentIndex = index
      this.$refs.audioPlayer.load()
      this.$refs.audioPlayer.play()
      this.isPlaying = true
      // 添加到最近播放
      this.addToRecentPlays(this.currentSong)
    },

    // 下一首
    playNext () {
      let nextIndex

      if (this.isShuffle) {
        // 随机播放，避免连续播放同一首
        do {
          nextIndex = Math.floor(Math.random() * this.songs.length)
        } while (nextIndex === this.currentIndex && this.songs.length > 1)
      } else {
        nextIndex = (this.currentIndex + 1) % this.songs.length
      }

      this.playSong(nextIndex)
    },

    // 上一首
    playPrevious () {
      let prevIndex

      if (this.isShuffle) {
        // 随机播放，避免连续播放同一首
        do {
          prevIndex = Math.floor(Math.random() * this.songs.length)
        } while (prevIndex === this.currentIndex && this.songs.length > 1)
      } else {
        prevIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length
      }

      this.playSong(prevIndex)
    },

    // 切换喜欢状态
    toggleLike (songId) {
      const song = this.songs.find(s => s.id === songId)
      if (song) {
        song.isLiked = !song.isLiked
      }
    },

    // 更新播放进度
    updateProgress () {
      const audio = this.$refs.audioPlayer
      this.currentTime = audio.currentTime
      this.progress = (this.currentTime / this.duration) * 100 || 0
    },

    // 设置总时长
    setDuration () {
      this.duration = this.$refs.audioPlayer.duration
    },

    // 格式化时间（秒 -> mm:ss）
    formatTime (seconds) {
      if (isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    },

    // 调整进度
    seek (e) {
      const audio = this.$refs.audioPlayer
      const progressBar = e.currentTarget
      const clickPosition = e.offsetX
      const progressPercent = (clickPosition / progressBar.offsetWidth) * 100
      const newTime = (progressPercent / 100) * this.duration

      audio.currentTime = newTime
      this.currentTime = newTime
      this.progress = progressPercent
    },

    // 设置音量
    setVolume () {
      this.$refs.audioPlayer.volume = this.volume / 100
    },

    // 切换循环模式
    toggleRepeat () {
      const modes = ['none', 'all', 'one']
      const currentModeIndex = modes.indexOf(this.repeatMode)
      this.repeatMode = modes[(currentModeIndex + 1) % modes.length]
    },

    // 切换随机播放
    toggleShuffle () {
      this.isShuffle = !this.isShuffle
    },

    // 处理歌曲结束
    handleEnded () {
      if (this.repeatMode === 'one') {
        // 单曲循环
        this.$refs.audioPlayer.currentTime = 0
        this.$refs.audioPlayer.play()
      } else {
        // 播放下一首
        this.playNext()
      }
    },

    // 快速切换歌曲（+1 下一首，-1 上一首）
    changeSong (direction) {
      if (direction > 0) {
        this.playNext()
      } else {
        this.playPrevious()
      }
    },

    // 添加到最近播放
    addToRecentPlays (song) {
      // 检查是否已存在，避免重复添加
      const exists = this.recentPlays.some(s => s.id === song.id)
      if (!exists) {
        this.recentPlays.unshift({ ...song })
        // 限制最近播放列表长度
        if (this.recentPlays.length > 5) {
          this.recentPlays.pop()
        }
      }
    }
  },

  mounted () {
    // 初始化音量
    this.setVolume()
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

/* 动画效果 */
@keyframes ping {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.rotate-360 {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
