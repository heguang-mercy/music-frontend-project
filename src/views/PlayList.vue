<template>
  <!-- 👇 外层容器类名改成和 LocalSongs 一致，继承主页面样式 -->
  <div class="local-songs-page">
    <h1 class="page-title">我的歌单</h1>

    <!-- 新增歌单按钮（原有功能不变） -->
    <button class="btn-operation btn-create" @click="showAddModal = true">+ 创建歌单</button>

    <!-- 歌单列表（原有功能不变） -->
    <div class="playlist-list">
      <div v-if="playlists.length === 0" class="empty-state">
        暂无歌单，点击"创建歌单"开始添加吧~
      </div>

      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item">
        <span class="playlist-name">{{ playlist.name }}</span>
        <div class="playlist-actions">
          <button class="btn-operation" @click="enterPlaylist(playlist.id)">进入</button>
          <button class="btn-operation btn-danger" @click="deletePlaylist(playlist.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 新增歌单模态框（原有功能不变） -->
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
// 👇 原有核心逻辑完全保留，一行不动！
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

      // 👇 1. ID 唯一性校验：支持任意类型 ID（中文/数字/英文）
      const isDuplicate = this.playlists.some(p => String(p.id) === String(name))

      if (isDuplicate) {
        this.$message.warning('该歌单 ID 已存在，请换一个名称吧~')
        return
      }

      // 👇 2. 生成 ID：支持 2 种方式（选一种或都保留）
      const newPlaylist = {
        // 方式1：用歌单名称当 ID（中文/英文/数字都可以，比如“我的收藏”“pop123”）
        id: name,
        // 方式2：自动生成数字 ID（转成字符串，比如“1730500000000”）
        // id: String(Date.now()),
        name,
        songIds: [],
        createTime: new Date().toISOString()
      }

      const updatedPlaylists = [...this.playlists, newPlaylist]
      storage.set('playlists', updatedPlaylists) // 自动存储为字符串 ID
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
      // id 可以是中文、数字、英文（比如“我的收藏”“1730500000000”“pop-songs”）
      console.log('要跳转的歌单ID（原类型）：', id)
      // 👇 直接传递原 ID，浏览器会自动编码中文/特殊字符（无需手动处理）
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
/* 👇 外层样式复用 LocalSongs 的，确保和歌曲页面布局一致 */
.local-songs-page {
  padding: 20px; /* 和 LocalSongs 保持相同内边距 */
}

/* 👇 保留你原有歌单样式，仅新增/调整以下2点 */
.page-title {
  color: #333;
  margin: 0 0 24px;
  font-weight: 600;
  animation: fadeIn 0.5s ease; /* 继承主页面切换动画，和歌曲页面一致 */
}

/* 👇 以下原有样式完全保留，不修改！ */
.btn-primary {
  background-color: #42b983 !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  white-space: nowrap !important;
  min-width: 80px !important;
}
.btn-primary:hover {
  background-color: #359e75;
}
.btn-secondary {
  background-color: #f5f5f5;
  color: #666; border: 1px solid #e0e0e0;
  padding: 7px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background-color: #eee;
}
.playlist-list {
  margin-top: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
}
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  background-color: #fafafa;
}
.playlist-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid #f0f0f0; transition: background-color 0.2s; }
.playlist-item:last-child { border-bottom: none; }
.playlist-item:hover { background-color: #f9f9f9; }
.playlist-name { font-size: 16px; color: #333; }
.playlist-actions { display: flex; gap: 8px; }
.btn-operation {
  padding: 4px 10px !important;
  border-radius: 3px !important;
  font-size: 13px !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  border: 1px solid #e0e0e0 !important;
  background-color: #fff !important;
  color: #333 !important;
  min-width: 70px !important;
  text-align: center !important;
  display: inline-block !important;
}
.btn-operation:hover {
  background-color: #f5f5f5;
}
.btn-danger {
  color: #243561 !important;
  border-color: #ffccc7 !important;
  background-color: #fff5f5 !important;
  min-width: 70px !important;
}
.btn-danger:hover {
  background-color: #fff5f5;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #4d6bff;
  padding: 24px;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 4px 12px rgba(19, 20, 73, 0.15);
}
.modal-title { margin: 0 0 16px; color: #333; font-size: 18px; font-weight: 500; }
.modal-input { width: 100%; padding: 10px 12px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px; box-sizing: border-box; margin-bottom: 20px; }
.modal-input:focus { outline: none; border-color: #4256b9; box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2); }
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; }
.btn-create { margin-bottom: 24px; }
@media (max-width: 768px) { .btn-operation { padding: 3px 8px; font-size: 12px; } .playlist-page { padding: 20px 15px; } .btn-create { margin-bottom: 16px; } }
@media (max-width: 480px) { .btn-operation { padding: 2px 6px; font-size: 11px; } .playlist-item { padding: 10px 12px; } .playlist-name { font-size: 14px; } }
</style>
