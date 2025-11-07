<template>
  <div class="theme-page">
    <div class="title-part">
      <h1 class="page-title">主题设置</h1>
      <h5 class="page-subtitle">选择您喜欢的主题颜色</h5>
    </div>
    <div class="theme-grid">
      <div
        class="theme-card"
        :class="{ 'active': currentTheme === 'theme-light' }"
        @click="handleLightClick"
      >
        <div class="theme-preview theme-light-preview">
          <div class="preview-nav"></div>
          <div class="preview-content"></div>
          <div class="preview-player"></div>
        </div>
        <div class="theme-name">暖黄</div>
      </div>

      <div
        class="theme-card"
        :class="{ 'active': currentTheme === 'theme-dark' }"
        @click="handleDarkClick"
      >
        <div class="theme-preview theme-dark-preview">
          <div class="preview-nav"></div>
          <div class="preview-content"></div>
          <div class="preview-player"></div>
        </div>
        <div class="theme-name">暗夜</div>
      </div>

      <div
        class="theme-card"
        :class="{ 'active': currentTheme === 'theme-purple' }"
        @click="handlePurpleClick"
      >
        <div class="theme-preview theme-purple-preview">
          <div class="preview-nav"></div>
          <div class="preview-content"></div>
          <div class="preview-player"></div>
        </div>
        <div class="theme-name">薰衣草</div>
      </div>

      <div
        class="theme-card"
        :class="{ 'active': currentTheme === 'theme-blue' }"
        @click="handleBlueClick"
      >
        <div class="theme-preview theme-blue-preview">
          <div class="preview-nav"></div>
          <div class="preview-content"></div>
          <div class="preview-player"></div>
        </div>
        <div class="theme-name">蓝天</div>
      </div>
    </div>
  </div>
</template>

<script>
// 从themeManager.js导入需要的方法（关键步骤！）
import {
  switchToLightTheme,
  switchToDarkTheme,
  switchToPurpleTheme,
  switchToBlueTheme,
  getCurrentTheme
} from '@/utils/themeManager.js'

export default {
  name: 'ThemeView',
  data () {
    return {
      // 获取当前主题，用于页面显示
      currentTheme: getCurrentTheme()
    }
  },
  methods: {
    // 亮色按钮点击事件：调用导入的switchToLightTheme
    handleLightClick () {
      switchToLightTheme()
      // 更新页面显示的当前主题
      this.currentTheme = 'theme-light'
    },
    // 暗色按钮点击事件：调用导入的switchToDarkTheme
    handleDarkClick () {
      switchToDarkTheme()
      this.currentTheme = 'theme-dark'
    },
    // 紫色按钮点击事件：调用导入的switchToPurpleTheme
    handlePurpleClick () {
      switchToPurpleTheme()
      this.currentTheme = 'theme-purple'
    },
    // 蓝色按钮点击事件：调用导入的switchToBlueTheme
    handleBlueClick () {
      switchToBlueTheme()
      this.currentTheme = 'theme-blue'
    }
  },
  // 监听主题变化（可选：如果其他页面也能改主题，这里要同步显示）
  mounted () {
    // 页面加载时，再更一次当前主题（防止其他页面修改后这里没同步）
    this.currentTheme = getCurrentTheme()
  }
}
</script>

<style scoped>
.theme-page {
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.title-part {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--color-text);
}

.page-subtitle {
  font-size: 18px;
  color: var(--color-nav-text);
  opacity: 0.8;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.theme-card {
  background-color: var(--color-card);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.theme-card.active {
  border-color: var(--color-btn);
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.theme-preview {
  height: 120px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-light-preview .preview-nav {
  background-color: rgb(241, 231, 173);
}

.theme-dark-preview .preview-nav {
  background-color: #1f3a5e;
}

.theme-purple-preview .preview-nav {
  background-color: #d8b9ff;
}

.theme-blue-preview .preview-nav {
  background-color: #90caf9;
}

.preview-nav {
  height: 30%;
}

.preview-content {
  height: 50%;
  background-color: var(--color-card);
}

.theme-light-preview .preview-player {
  background-color: #fdd098;
}

.theme-dark-preview .preview-player {
  background-color: #4c638c;
}

.theme-purple-preview .preview-player {
  background-color: #c4a7e6;
}

.theme-blue-preview .preview-player {
  background-color: #64b5f6;
}

.preview-player {
  height: 20%;
}

.theme-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--color-text);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .theme-grid {
    grid-template-columns: 1fr;
  }

  .theme-card {
    padding: 15px;
  }

  .theme-preview {
    height: 100px;
  }
}
</style>
