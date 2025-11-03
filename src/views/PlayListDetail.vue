<template>
  <div class="local-songs-page">
    <!-- 歌单标题 + 返回按钮 + 添加歌曲按钮 -->
    <div class="playlist-header d-flex justify-content-between align-items-center mb-3">
      <h1 class="page-title">{{ currentPlaylist.name || '歌单详情' }}</h1>
      <div>
        <!-- 新增：添加歌曲按钮 -->
        <button class="btn-operation btn-primary mr-2" @click="showAddSongModal = true">
          <span>+ 添加歌曲</span>
        </button>
        <!-- 返回按钮 -->
        <button class="btn-operation" @click="$router.push('/PlayListPage/PlayList')">
          返回歌单列表
        </button>
      </div>
    </div>

    <!-- 歌单已添加歌曲列表 -->
    <div class="songs-list">
      <div v-if="playlistSongs.length === 0" class="empty-state">
        该歌单暂无歌曲，点击"添加歌曲"按钮开始添加吧~
      </div>

      <div
        v-for="song in playlistSongs"
        :key="song.id"
        class="song-item card"
        @click="handleSongSelect(song)"
        @dblclick="playSong(song)"
      >
        <img :src="song.cover" :alt="song.name" class="song-cover" @error="handleImageError">
        <div class="song-info">
          <div class="song-name component-title">{{ song.name }}</div>
          <div class="song-singer main-text">{{ song.singer }}</div>
        </div>
        <!-- 删除歌曲按钮 -->
        <button class="btn-operation btn-danger btn-sm" @click.stop="removeSongFromPlaylist(song.id)">
          移除
        </button>
        <!-- 移动端播放按钮 -->
        <div class="play-button-mobile" @click.stop="playSong(song)">
          <ion-icon name="play-circle-outline" size="large"></ion-icon>
        </div>
      </div>
    </div>

    <!-- 👇 新增：添加歌曲的模态框（显示所有本地歌曲） -->
    <div v-if="showAddSongModal" class="modal-overlay" @click="showAddSongModal = false">
      <div class="modal-content" @click.stop style="width: 480px; max-height: 80vh; overflow-y: auto;">
        <h3 class="modal-title">选择本地歌曲添加</h3>

        <!-- 所有本地歌曲列表 -->
        <div class="all-songs-list">
          <div
            v-for="song in allSongs"
            :key="song.id"
            class="all-song-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <img :src="song.cover" :alt="song.name" class="small-cover" @error="handleImageError">
              <div class="song-info-small">
                <div class="song-name-small">{{ song.name }}</div>
                <div class="song-singer-small">{{ song.singer }}</div>
              </div>
            </div>
            <!-- 按钮：已添加则禁用，未添加则可选择 -->
            <button
              class="btn-operation btn-sm"
              :class="{ 'btn-disabled': isSongAdded(song.id), 'btn-primary': !isSongAdded(song.id) }"
              @click.stop="addSongToPlaylist(song.id)"
              :disabled="isSongAdded(song.id)"
            >
              {{ isSongAdded(song.id) ? '已添加' : '添加' }}
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="showAddSongModal = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
import songsData from '@/assets/data/songs.json' // 导入所有本地歌曲（核心：不依赖 LocalSongs 页面）
import player from '@/utils/player'

export default {
  name: 'PlaylistDetail',
  data () {
    return {
      currentPlaylist: {}, // 当前歌单
      playlistSongs: [], // 歌单中已添加的歌曲
      allSongs: songsData, // 所有本地歌曲（直接从 json 读取，不碰 LocalSongs）
      showAddSongModal: false // 添加歌曲模态框显示状态
    }
  },
  mounted () {
    // 初始化：获取当前歌单 + 匹配已添加歌曲
    this.initCurrentPlaylist()
  },
  methods: {
    // 初始化当前歌单数据
    initCurrentPlaylist () {
      // 👇 1. 获取路由参数（自动解码中文 ID，原类型是字符串）
      const playlistId = this.$route.params.id
      console.log('详情页获取的 ID（字符串）：', playlistId)

      const allPlaylists = storage.get('playlists') || []
      // 👇 2. 统一转字符串对比（兼容歌单 ID 是数字/中文/英文）
      this.currentPlaylist = allPlaylists.find(p => String(p.id) === playlistId) || {}

      if (Object.keys(this.currentPlaylist).length === 0) {
        this.$message.warning('未找到该歌单！')
        this.$router.push('/PlayListPage/PlayList')
        return
      }
      this.matchPlaylistSongs() // 匹配歌曲（同样适配任意类型歌曲 ID）
    },

    // 匹配歌单中已添加的歌曲（通过 songIds 筛选）
    matchPlaylistSongs () {
      // 👇 3. 歌曲 ID 也统一转字符串对比（兼容歌曲 ID 是中文/数字/英文）
      const songIds = this.currentPlaylist.songIds?.map(id => String(id)) || []
      this.playlistSongs = this.allSongs.filter(song => songIds.includes(String(song.id)))
    },

    // 👇 4. 新增歌曲时也适配任意类型 ID
    isSongAdded (songId) {
      return this.currentPlaylist.songIds?.map(id => String(id)).includes(String(songId)) || false
    },

    addSongToPlaylist (songId) {
      if (this.isSongAdded(songId)) {
        this.$message.warning('该歌曲已在歌单中！')
        return
      }
      // 转字符串存储歌曲 ID
      const newSongIds = [...(this.currentPlaylist.songIds || []), String(songId)]
      this.currentPlaylist.songIds = newSongIds

      // 同步更新本地存储
      const allPlaylists = storage.get('playlists') || []
      const updatedPlaylists = allPlaylists.map(p => {
        if (String(p.id) === String(this.currentPlaylist.id)) {
          return { ...p, songIds: newSongIds }
        }
        return p
      })
      storage.set('playlists', updatedPlaylists)
      this.matchPlaylistSongs()
      this.$message.success('歌曲添加成功！')
    },
    // 从歌单移除歌曲（原有方法不变）
    removeSongFromPlaylist (songId) {
      // 👇 关键修复：将存储的 songIds 转成字符串，再与字符串类型的 songId 对比
      const newSongIds = this.currentPlaylist.songIds
        ?.map(id => String(id)) // 所有存储的 ID 转字符串
        .filter(id => id !== String(songId)) || [] // 与字符串类型的 songId 对比

      this.currentPlaylist.songIds = newSongIds

      // 👇 同步修复：更新本地存储时，也用字符串 ID 对比歌单 ID
      const allPlaylists = storage.get('playlists') || []
      const updatedPlaylists = allPlaylists.map(p => {
        if (String(p.id) === String(this.currentPlaylist.id)) { // 统一转字符串对比
          return { ...p, songIds: newSongIds }
        }
        return p
      })
      storage.set('playlists', updatedPlaylists)

      this.matchPlaylistSongs() // 刷新歌单歌曲列表
      this.$message.success('歌曲已移除')
    },
    // 播放歌曲（原有方法不变，适配你的 audio 字段）
    playSong (song) {
      // 直接使用 song.audio（你的 songs.json 中是 audio 字段，无需拼接）
      const currentSong = player.playSong(song)
      this.$bus.$emit('songChanged', currentSong)
    },

    // 辅助方法：处理图片错误
    handleSongSelect (song) {},
    handleImageError (event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
/* 原有样式不变，新增以下模态框相关样式 */
/* 布局辅助类（flex） */
.d-flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
.mr-2 { margin-right: 8px; }

/* 添加歌曲模态框样式 */
.all-songs-list { margin: 16px 0; }
.all-song-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}
.all-song-item:hover { background-color: #f5f5f5; }
.small-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}
.song-info-small {
  min-width: 0; /* 解决文字溢出 */
}
.song-name-small {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-singer-small {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-disabled {
  background-color: #f5f5f5 !important;
  color: #999 !important; /* 强制灰色文字 */
  border: 1px solid #e0e0e0 !important;
  cursor: not-allowed !important;
  min-width: 70px !important;
  text-align: center !important;
}
/* 原有样式保留 */
.local-songs-page { padding: 20px; }
.playlist-header { margin-bottom: 20px; }
.songs-list { margin-top: 20px; }
.song-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}
.song-item:hover {
  background-color: var(--color-hover);
  transform: translateX(5px);
}
.song-cover {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 15px;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}
.song-item:hover .song-cover { transform: scale(1.05); }
.song-info { flex: 1; }
.song-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  line-height: 1.2;
}
.song-singer {
  font-size: 16px;
  color: var(--color-nav-text);
  line-height: 1.2;
}
.play-button-mobile { display: none; color: var(--color-btn); }
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  background-color: #fafafa;
  border-radius: 6px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.modal-title {
  margin: 0 0 16px;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.btn-primary {
  background-color: #4299b9 !important;
  color: white !important; /* 强制白色文字，与绿色背景对比 */
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  white-space: nowrap !important;
  min-width: 80px !important;
}
.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 7px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-operation {
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 13px !important; /* 强制字体大小 */
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  color: #333 !important; /* 强制文字颜色（默认黑色） */
  min-width: 70px !important; /* 确保宽度足够容纳文字 */
  text-align: center !important; /* 文字居中 */
  display: inline-block !important; /* 确保文字不被隐藏 */
}
.btn-danger {
  color: #594dff !important; /* 强制红色文字 */
  border-color: #ffccc7 !important;
  background-color: #fff5f5 !important;
  min-width: 70px !important;
  text-align: center !important;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .local-songs-page { padding: 15px; }
  .song-item { padding: 12px; }
  .song-cover { width: 50px; height: 50px; margin-right: 12px; }
  .song-name { font-size: 16px; }
  .song-singer { font-size: 14px; }
  .play-button-mobile { display: block; }
  .modal-content { width: 90vw !important; }
}
</style>
