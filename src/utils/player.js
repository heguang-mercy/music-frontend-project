// 播放控制工具（全局唯一，所有组件共用这一个实例）
const player = {
  audio: null, // 音频对象（HTML5的Audio）
  currentSong: null, // 当前播放的歌曲信息

  // 初始化（只需要执行一次）
  init () {
    this.audio = new Audio() // 创建音频实例
  },

  // 播放指定歌曲
  playSong (song) {
    if (!this.audio) this.init() // 没初始化就先初始化

    // 如果点击的是新歌曲，重新设置音频源
    if (this.currentSong?.id !== song.id) {
      this.currentSong = song
      this.audio.src = song.audio // 音频路径（对应songs.json里的audio字段）
    }

    this.audio.play() // 开始播放
    return song // 返回当前歌曲，方便更新UI
  },

  // 暂停/继续播放
  togglePause () {
    if (this.audio.paused) {
      this.audio.play()
    } else {
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
