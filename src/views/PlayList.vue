<template>
  <div class="local-songs-page">
    <h1 class="page-title">我的歌单</h1>

    <button class="btn-operation btn-create" @click="showAddModal = true">+ 创建歌单</button>

    <div class="playlist-list">
      <div v-if="playlists.length === 0" class="empty-state">
        暂无歌单，点击"创建歌单"开始添加吧~
      </div>

      <!-- 核心修改：添加双击事件 @dblclick，按钮添加 @click.stop 阻止冒泡 -->
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item" @dblclick="enterPlaylist(playlist.id)">
        <span class="playlist-name">{{ playlist.name }}</span>
        <div class="playlist-actions">
          <button class="btn-operation" @click.stop="enterPlaylist(playlist.id)">进入</button>
          <button class="btn-operation btn-danger" @click.stop="deletePlaylist(playlist.id)">删除</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">创建新歌单</h3>
        <input
          type="text"
          v-model.trim="newPlaylistName"
          placeholder="请输入歌单名称"
          class="modal-input"
          @keyup.enter="addPlaylist"
        >
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">取消</button>
          <button class="btn-primary" @click="addPlaylist">确认创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
export default {
  name: 'PlayList',
  data () {
    return {
      playlists: storage.get('playlists') || [],
      showAddModal: false,
      newPlaylistName: ''
    }
  },

  methods: {
    addPlaylist () {
      const name = this.newPlaylistName.trim()
      if (!name) {
        this.$message.warning('歌单名称不能为空哦~')
        return
      }
      if (name.length > 20) {
        this.$message.warning('歌单名称不能超过20个字符')
        return
      }

      const isDuplicate = this.playlists.some(p => String(p.id) === String(name))

      if (isDuplicate) {
        this.$message.warning('该歌单 ID 已存在，请换一个名称吧~')
        return
      }

      const newPlaylist = {
        id: name,
        name,
        songIds: [],
        createTime: new Date().toISOString()
      }

      const updatedPlaylists = [...this.playlists, newPlaylist]
      storage.set('playlists', updatedPlaylists)
      this.playlists = updatedPlaylists
      this.closeModal()
      this.$message.success(`歌单《${name}》创建成功！`)
    },
    deletePlaylist (id) {
      const playlist = this.playlists.find(p => p.id === id)
      if (!confirm(`确定要删除歌单《${playlist.name}》吗？`)) return
      const updatedPlaylists = this.playlists.filter(p => p.id !== id)
      storage.set('playlists', updatedPlaylists)
      this.playlists = updatedPlaylists
      this.$message.success('歌单已删除')
    },
    enterPlaylist (id) {
      console.log('要跳转的歌单ID（原类型）：', id)
      this.$router.push(`/PlayListPage/PlaylistDetail/${id}`)
    },
    closeModal () {
      this.showAddModal = false
      this.newPlaylistName = ''
    }
  }
}
</script>

<style scoped>
.local-songs-page {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #2c3e50;
  margin: 0 0 30px;
  font-weight: 700;
  font-size: 28px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.btn-primary {
  background-color: #42b983 !important;
  color: white !important;
  border: none !important;
  padding: 10px 20px !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
  min-width: 100px !important;
  box-shadow: 0 2px 6px rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #359e75 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.4);
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.playlist-list {
  margin-top: 30px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: #6c757d;
  background-color: #f8f9fa;
  font-size: 18px;
  font-weight: 500;
}

/* 核心修改：新增 cursor: pointer 提示可交互 */
.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.2s;
  cursor: pointer;
}

.playlist-item:last-child {
  border-bottom: none;
}

.playlist-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.playlist-name {
  font-size: 18px;
  font-weight: 600;
  color: #212529;
}

.playlist-actions {
  display: flex;
  gap: 12px;
}

.btn-operation {
  padding: 8px 16px !important;
  border-radius: 6px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  border: 1px solid #e9ecef !important;
  background-color: #fff !important;
  color: #495057 !important;
  min-width: 80px !important;
  text-align: center !important;
  display: inline-block !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-operation:hover {
  background-color: #f8f9fa !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-danger {
  color: #dc3545 !important;
  border-color: #f5c6cb !important;
  background-color: #fff !important;
  font-weight: 600 !important;
}

.btn-danger:hover {
  background-color: #f8d7da !important;
}

.btn-create {
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 20px;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
}

.modal-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  margin-bottom: 25px;
  transition: border-color 0.3s;
}

.modal-input:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

@media (max-width: 768px) {
  .local-songs-page {
    padding: 20px 15px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .btn-operation {
    padding: 6px 12px !important;
    font-size: 14px !important;
  }

  .playlist-item {
    padding: 12px 16px;
  }

  .playlist-name {
    font-size: 16px;
  }

  .btn-create {
    margin-bottom: 20px;
    padding: 10px 20px !important;
  }

  .modal-content {
    width: 90%;
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .local-songs-page {
    padding: 15px 10px;
  }

  .page-title {
    font-size: 22px;
  }

  .btn-operation {
    padding: 5px 10px !important;
    font-size: 13px !important;
    min-width: 60px !important;
  }

  .playlist-item {
    padding: 10px 12px;
  }

  .playlist-name {
    font-size: 15px;
  }

  .modal-content {
    padding: 15px;
  }

  .modal-input {
    padding: 12px 14px;
    font-size: 15px;
  }
}
</style>
