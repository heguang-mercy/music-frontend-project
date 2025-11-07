<template>
  <div class="local-songs-page">
    <!-- 歌单标题 + 返回按钮 + 添加歌曲按钮 -->
    <div class="playlist-header d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">{{ currentPlaylist.name || '歌单详情' }}</h1>
      <div class="header-actions">
        <!-- 新增：添加歌曲按钮 -->
        <button class="btn-operation btn-primary mr-3" @click="showAddSongModal = true">
          <span>+ 添加歌曲</span>
        </button>
        <!-- 返回按钮 -->
        <button class="btn-operation btn-secondary" @click="$router.push('/PlayListPage/PlayList')">
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
      <div class="modal-content" @click.stop>
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
              class="btn-operation btn-sm add-song-btn"
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
import songsData from '@/assets/data/songs.json'
import player from '@/utils/player'

export default {
  name: 'PlaylistDetail',
  data () {
    return {
      currentPlaylist: {},
      playlistSongs: [],
      allSongs: songsData,
      showAddSongModal: false
    }
  },
  mounted () {
    this.initCurrentPlaylist()
  },
  methods: {
    initCurrentPlaylist () {
      const playlistId = this.$route.params.id
      console.log('详情页获取的 ID（字符串）：', playlistId)

      const allPlaylists = storage.get('playlists') || []
      this.currentPlaylist = allPlaylists.find(p => String(p.id) === playlistId) || {}

      if (Object.keys(this.currentPlaylist).length === 0) {
        this.$message.warning('未找到该歌单！')
        this.$router.push('/PlayListPage/PlayList')
        return
      }
      this.matchPlaylistSongs()
    },

    matchPlaylistSongs () {
      const songIds = this.currentPlaylist.songIds?.map(id => String(id)) || []
      this.playlistSongs = this.allSongs.filter(song => songIds.includes(String(song.id)))
    },

    isSongAdded (songId) {
      return this.currentPlaylist.songIds?.map(id => String(id)).includes(String(songId)) || false
    },

    addSongToPlaylist (songId) {
      if (this.isSongAdded(songId)) {
        this.$message.warning('该歌曲已在歌单中！')
        return
      }
      const newSongIds = [...(this.currentPlaylist.songIds || []), String(songId)]
      this.currentPlaylist.songIds = newSongIds

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

    removeSongFromPlaylist (songId) {
      const newSongIds = this.currentPlaylist.songIds
        ?.map(id => String(id))
        .filter(id => id !== String(songId)) || []

      this.currentPlaylist.songIds = newSongIds

      const allPlaylists = storage.get('playlists') || []
      const updatedPlaylists = allPlaylists.map(p => {
        if (String(p.id) === String(this.currentPlaylist.id)) {
          return { ...p, songIds: newSongIds }
        }
        return p
      })
      storage.set('playlists', updatedPlaylists)

      this.matchPlaylistSongs()
      this.$message.success('歌曲已移除')
    },

    playSong (song) {
      const currentSong = player.playSong(song)
      this.$bus.$emit('songChanged', currentSong)
    },

    handleSongSelect (song) {},
    handleImageError (event) {
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --secondary-bg: #f8f9fa;
  --border-color: #e1e8ed;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --danger-color: #e74c3c;
  --danger-hover: #c0392b;
  --success-color: #27ae60;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --hover-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
/* 布局辅助类 */
.d-flex { display: flex; }
.justify-content-between { justify-content: space-between; }
.align-items-center { align-items: center; }
.mr-3 { margin-right: 16px; }

/* 页面主容器 */
.local-songs-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题 */
.page-title {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 0 10px;
  animation: fadeIn 0.5s ease;
}

/* 头部操作区域 */
.header-actions {
  display: flex;
  gap: 12px;
}

/* 歌曲列表容器 */
.songs-list {
  margin-top: 30px;
}

/* 空状态提示 */
.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--text-secondary);
  background-color: var(--secondary-bg);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: var(--card-shadow);
}

/* 歌曲项卡片 */
.song-item {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: var(--card-shadow);
}

.song-item:hover {
  background-color: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

/* 歌曲封面 */
.song-cover {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-right: 20px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.song-item:hover .song-cover {
  transform: scale(1.05);
}

/* 歌曲信息 */
.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.3;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-singer {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 操作按钮 */
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

.btn-operation:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 主要按钮 */
.btn-primary {
  background-color: #42b983 !important;
  color: white !important; /* 强制白色文字，与绿色背景对比 */
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  white-space: nowrap !important;
  min-width: 80px !important;
}

.btn-primary:hover {
  background-color: var(--primary-hover) !important;
  box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4);
}

/* 次要按钮 */
.btn-secondary {
  background-color: var(--secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 120px; /* 增加最小宽度 */
}

.btn-secondary:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 危险操作按钮 */
.btn-danger {
  color: #ff4d4f !important; /* 强制红色文字 */
  border-color: #ffccc7 !important;
  background-color: #fff5f5 !important;
  min-width: 70px !important;
  text-align: center !important;
}

.btn-danger:hover {
  background-color: #fdf2f2 !important;
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

/* 添加歌曲按钮特殊样式 */
.add-song-btn {
  min-width: 80px; /* 确保添加按钮有足够的宽度 */
}

/* 禁用按钮 */
.btn-disabled {
  background-color: #f5f5f5 !important;
  color: #999 !important; /* 强制灰色文字 */
  border: 1px solid #e0e0e0 !important;
  cursor: not-allowed !important;
  min-width: 70px !important;
  text-align: center !important;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 24px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

/* 所有歌曲列表 */
.all-songs-list {
  margin: 20px 0;
}

.all-song-item {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
  border-radius: 6px;
  margin-bottom: 8px;
}

.all-song-item:hover {
  background-color: var(--secondary-bg);
}

.small-cover {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-right: 16px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.song-info-small {
  min-width: 0;
  flex: 1;
}

.song-name-small {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.song-singer-small {
  font-size: 14px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 模态框底部 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

/* 移动端播放按钮 */
.play-button-mobile {
  display: none;
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .local-songs-page {
    padding: 20px 15px;
  }

  .page-title {
    font-size: 24px;
  }

  .header-actions {
    gap: 8px;
  }

  .btn-operation {
    padding: 8px 16px;
    font-size: 14px;
    min-width: 85px; /* 调整移动端最小宽度 */
  }

  .song-item {
    padding: 16px;
    margin-bottom: 8px;
  }

  .song-cover {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }

  .song-name {
    font-size: 18px;
  }

  .song-singer {
    font-size: 15px;
  }

  .modal-content {
    width: 90vw;
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .play-button-mobile {
    display: block;
    margin-left: 15px;
  }
}

@media (max-width: 480px) {
  .local-songs-page {
    padding: 15px 10px;
  }

  .page-title {
    font-size: 22px;
  }

  .header-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-operation {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 80px; /* 调整移动端最小宽度 */
  }

  .btn-secondary {
    min-width: 100px; /* 调整返回按钮宽度 */
  }

  .song-item {
    padding: 12px;
  }

  .song-cover {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }

  .song-name {
    font-size: 16px;
  }

  .song-singer {
    font-size: 14px;
  }

  .modal-content {
    padding: 15px;
  }

  .modal-title {
    font-size: 18px;
  }

  .all-song-item {
    padding: 12px;
  }

  .small-cover {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .song-name-small {
    font-size: 15px;
  }

  .song-singer-small {
    font-size: 13px;
  }

  .add-song-btn {
    min-width: 70px; /* 移动端添加按钮最小宽度 */
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
