// 1. 定义默认主题和存储键名（方便后续修改）
const DEFAULT_THEME = 'theme-light' // 默认亮色主题
const STORAGE_KEY = 'app_theme' // 存localStorage的键名

// 2. 获取当前主题（优先读localStorage，没有则用默认）
export function getCurrentTheme () {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME
}

// 3. 切换到亮色主题的方法
export function switchToLightTheme () {
  const lightTheme = 'theme-light'
  // 把主题存到localStorage
  localStorage.setItem(STORAGE_KEY, lightTheme)
  // 更新html标签的类名（让全局样式生效）
  updateHtmlThemeClass(lightTheme)
}

// 4. 切换到暗色主题的方法
export function switchToDarkTheme () {
  const darkTheme = 'theme-dark'
  localStorage.setItem(STORAGE_KEY, darkTheme)
  updateHtmlThemeClass(darkTheme)
}

// 5. 切换到紫色主题的方法
export function switchToPurpleTheme () {
  const purpleTheme = 'theme-purple'
  localStorage.setItem(STORAGE_KEY, purpleTheme)
  updateHtmlThemeClass(purpleTheme)
}

// 6. 切换到蓝色主题的方法
export function switchToBlueTheme () {
  const blueTheme = 'theme-blue'
  localStorage.setItem(STORAGE_KEY, blueTheme)
  updateHtmlThemeClass(blueTheme)
}

// 7. 私有方法：更新html标签的主题类名（内部用，不导出）
function updateHtmlThemeClass (theme) {
  // 先移除旧的主题类名（避免多个类名冲突）
  document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-purple', 'theme-blue')
  // 添加新的主题类名
  document.documentElement.classList.add(theme)
}

// 8. 初始化主题（页面加载时调用，确保样式一开始就生效）
export function initTheme () {
  const currentTheme = getCurrentTheme()
  updateHtmlThemeClass(currentTheme)
}
