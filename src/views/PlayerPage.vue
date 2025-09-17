<template>
  <div class="playlist-page">
    <h1 class="page-title">我的歌单</h1>

    <!-- 新增歌单按钮 -->
    <button class="btn-primary" @click="showAddModal = true">+ 创建歌单</button>

    <!-- 歌单列表 -->
    <div class="playlist-list">
      <div v-for="playlist in playlists" :key="playlist.id" class="playlist-item">
        <span class="component-title">{{ playlist.name }}</span>
        <button class="btn-secondary" @click="deletePlaylist(playlist.id)">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
export default {
  name: 'PlayerPage',
  data () {
    return {
      playlists: storage.get('playlists'), // 从localStorage取歌单
      showAddModal: false,
      newPlaylistName: ''
    }
  },
  methods: {
    // 新增歌单
    addPlaylist () {
      if (!this.newPlaylistName) return
      const newPlaylist = {
        id: Date.now(),
        name: this.newPlaylistName,
        songIds: [] // 初始为空
      }
      const updatedPlaylists = [...this.playlists, newPlaylist]
      storage.set('playlists', updatedPlaylists) // 存回localStorage
      this.playlists = updatedPlaylists // 更新页面显示
      this.showAddModal = false
      this.newPlaylistName = ''
    },
    // 删除歌单
    deletePlaylist (id) {
      const updatedPlaylists = this.playlists.filter(p => p.id !== id)
      storage.set('playlists', updatedPlaylists)
      this.playlists = updatedPlaylists
    }
  }
}
</script>
