// 播放控制工具（全局唯一，所有组件共用这一个实例）
const player = {
  audio: null, // 音频对象（HTML5的Audio）
  currentSong: null, // 当前播放的歌曲信息

  // 初始化（只需要执行一次）
  init () {
    this.audio = new Audio() // 创建音频实例
    // 添加错误处理
    this.audio.addEventListener('error', (e) => {
      console.error('音频播放错误:', e)
    })

    // 添加播放状态监听
    this.audio.addEventListener('play', () => {
      console.log('音频开始播放')
    })

    this.audio.addEventListener('pause', () => {
      console.log('音频暂停')
    })

    this.audio.addEventListener('ended', () => {
      console.log('音频播放结束')
    })
  },

  // 播放指定歌曲
  playSong (song) {
    if (!this.audio) this.init() // 没初始化就先初始化

    console.log('准备播放歌曲:', song)

    // 如果点击的是新歌曲，重新设置音频源
    if (this.currentSong?.id !== song.id) {
      this.currentSong = song
      // 使用绝对路径
      this.audio.src = song.audio
      console.log('设置音频源:', song.audio)
    }

    // 确保在用户交互后播放
    const playPromise = this.audio.play()
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log('音频播放成功')
      }).catch(error => {
        console.error('音频播放失败:', error)
      })
    }

    return song // 返回当前歌曲，方便更新UI
  },

  // 暂停/继续播放
  togglePause () {
    if (this.audio.paused) {
      console.log('恢复播放')
      this.audio.play().catch(error => {
        console.error('恢复播放失败:', error)
      })
    } else {
      console.log('暂停播放')
      this.audio.pause()
    }
  },

  // 获取当前播放进度（0-100）
  getProgress () {
    if (!this.audio || !this.audio.duration) return 0
    return (this.audio.currentTime / this.audio.duration) * 100
  }
}

export default player
