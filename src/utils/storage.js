// storage.js：封装本地存储工具函数
export default {
  // 存数据
  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  // 取数据（默认返回空对象/数组，避免报错）
  get (key) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : (key === 'songs' || key === 'playlists' ? [] : {})
  },
  // 删数据
  remove (key) {
    localStorage.removeItem(key)
  }
}
