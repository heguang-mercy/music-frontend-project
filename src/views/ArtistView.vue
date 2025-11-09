<template>
  <div class="artist-page">
    <h1 class="page-title">歌手</h1>

    <div class="singers-list">
      <!-- 按歌单行样式展示固定三位歌手 -->
      <div
        v-for="singer in singers"
        :key="singer.name"
        class="singer-item card"
        @click="selectSinger(singer.name)">
        <img :src="getAvatar(singer.name)" class="singer-avatar" :alt="singer.name" @error="onAvatarError($event)">
        <div class="singer-meta">
          <div class="singer-title">{{ singer.name }}</div>
          <div class="singer-sub">{{ countSongs(singer.name) }} 首歌曲</div>
        </div>
        <div class="singer-action">
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </div>
      </div>
    </div>

    <!-- 选择歌手后跳转至单曲页面显示歌曲（不在此处直接显示） -->
  </div>
</template>

<script>
import songsData from '@/assets/data/songs.json'
import player from '@/utils/player'
import Vue from 'vue'

export default {
  name: 'ArtistView',
  data () {
    return {
      // 固定三位歌手，顺序可调整
      singers: [
        { name: '单依纯', avatar: '/images/单依纯.webp' },
        { name: '周深', avatar: '/images/周深.jpg' },
        { name: 'LE SSERAFIM', avatar: '/images/LE SSERAFIM.webp' }
      ],
      songs: [],
      selectedSinger: null,
      selectedSong: null
    }
  },
  computed: {
    filteredSongs () {
      if (!this.selectedSinger) return []
      return this.songs.filter(s => s.singer === this.selectedSinger)
    }
  },
  methods: {
    getAvatar (name) {
      const item = this.singers.find(s => s.name === name)
      // 回退到现有图片之一（如果没有默认图片）
      return item ? item.avatar : '/images/LE SSERAFIM.webp'
    },
    onAvatarError (e) {
      e.target.src = '/images/LE SSERAFIM.webp'
    },
    countSongs (name) {
      return this.songs.filter(s => s.singer === name).length
    },
    selectSinger (name) {
      // 使用绝对 path 跳转到父路由下的 LocalSongs，避免命名路由解析问题
      this.$router.push({ path: '/PlayListPage/LocalSongs', query: { singer: name } })
    },
    selectSong (song) {
      this.selectedSong = song
    },
    playSong (song) {
      const currentSong = player.playSong(song)
      Vue.prototype.$bus.$emit('songChanged', currentSong)
    },
    handleImageError (event) {
      event.target.style.display = 'none'
    }
  },
  mounted () {
    this.songs = songsData
  }
}
</script>

<style scoped>
.artist-page { padding: 20px }
.singers-list { display: flex; flex-direction: column; gap: 10px }
.singer-item { display:flex; align-items:center; padding:12px; cursor:pointer }
.singer-avatar { width:56px; height:56px; border-radius:6px; object-fit:cover; margin-right:12px }
.singer-meta { flex:1 }
.singer-title { font-weight:700; font-size:16px }
.singer-sub { color:var(--color-nav-text); margin-top:4px }
.singer-action { color:var(--color-nav-text) }
.subtitle { margin-top:18px; margin-bottom:10px; font-size:18px }
.songs-list { display:block }
.song-item { display:flex; align-items:center; padding:10px; border-bottom:1px solid var(--color-border); cursor:pointer }
.song-cover { width:54px; height:54px; border-radius:6px; margin-right:12px; object-fit:cover }
.song-info { flex:1 }
.song-name { font-weight:600 }
.song-singer { color:var(--color-nav-text); margin-top:4px }
.empty { color:var(--color-nav-text); padding:12px }
</style>
