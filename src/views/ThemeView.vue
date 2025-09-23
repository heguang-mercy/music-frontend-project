<template>
  <div class="theme-page">
    <h1 class="page-title">This is a theme page</h1>
    <div class="button-group">
      <btn  class="theme-btn" @click="handleLightClick">亮色模式</btn>
      <btn class="theme-btn" @click="handleDarkClick">深色模式</btn>
    </div>
  </div>
</template>

<script>
// 1. 从themeManager.js导入需要的方法（关键步骤！）
import {
  switchToLightTheme,
  switchToDarkTheme,
  getCurrentTheme
} from '@/utils/themeManager.js'

export default {
  name: 'SettingPage',
  data () {
    return {
      // 2. 获取当前主题，用于页面显示
      currentTheme: getCurrentTheme()
    }
  },
  methods: {
    // 3. 亮色按钮点击事件：调用导入的switchToLightTheme
    handleLightClick () {
      switchToLightTheme()
      // 更新页面显示的当前主题
      this.currentTheme = 'theme-light'
    },
    // 4. 暗色按钮点击事件：调用导入的switchToDarkTheme
    handleDarkClick () {
      switchToDarkTheme()
      this.currentTheme = 'theme-dark'
    }
  },
  // 5. 监听主题变化（可选：如果其他页面也能改主题，这里要同步显示）
  mounted () {
    // 页面加载时，再更一次当前主题（防止其他页面修改后这里没同步）
    this.currentTheme = getCurrentTheme()
  }
}
</script>

<style scoped>
  /* 设置页面的基础样式 */
.setting-page {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.theme-switch-section {
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  background-color: var(--color-bg); /* 用主题变量，和全局样式统一 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.theme-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: var(--color-btn); /* 用主题变量 */
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-right: 15px;
  transition: opacity 0.2s;
}

.theme-btn:hover {
  opacity: 0.9;
}

.current-theme {
  margin-top: 15px;
  color: var(--color-text); /* 用主题变量 */
  font-size: 14px;
}

  .page-title {
    font-size: 50px;
    height: 90px;
    font-weight: 600; /* 半粗，突出标题 */
    line-height: 1.2;
    word-spacing: 2px;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
  }

  /* 按钮文字：轻微阴影，突出点击感 */
  .theme-btn {
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  }
</style>
