<template>
  <div class="login-wrapper">
    <img src="/images/login2.png" class="bg-img" alt="背景" />
    <div class="login-container">
      <div class="form-background">
        <img src="/images/login1.png" alt="Form Background" class="form-bg-img" />
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <input type="text" v-model="username" required placeholder="用户名">
        </div>
        <div class="form-group">
          <input type="password" v-model="password" required placeholder="密码">
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin () {
      if (!this.username || !this.password) {
        alert('用户名和密码不能为空')
        return
      }
      console.log('登录中...', this.username, this.password)
      this.$router.push('/PlayListPage')
    }
  }
}
</script>

<style scoped>
/* 全屏背景 */
.login-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* 表单容器 */
.login-container {
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* 确保背景图片不会溢出圆角 */
  height: 550px; /* 增加表单容器的高度 */
}

/* 表单背景图片 */
.form-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 放在表单内容后面 */
  border-radius: 12px; /* 与容器相同的圆角 */
  overflow: hidden; /* 确保图片不会溢出圆角 */
}

.form-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个表单区域 */
}

.login-form {
  text-align: center;
  position: relative; /* 确保在背景之上 */
  z-index: 1;
  height: 100%; /* 让表单填充整个容器高度 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中表单内容 */
  align-items: center; /* 水平居中表单内容 */
}

.form-group {
  width: 80%;
  margin-bottom: 25px; /* 增加表单项之间的间距 */
}

.form-group input {
  width: 100%; /* 输入框宽度为父容器的100% */
  padding: 12px; /* 增加输入框内边距 */
  border: none;
  border-bottom: 2px solid #d9d8e8;
  background: transparent;
  outline: none;
  position: relative; /* 确保在背景之上 */
  z-index: 1;
  font-size: 16px; /* 增加字体大小 */
  text-align: center; /* 文本居中 */
}

.login-button {
  margin-top: 10px; /* 调整按钮上边距 */
  padding: 12px 40px; /* 增加按钮内边距 */
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  position: relative; /* 确保在背景之上 */
  z-index: 1;
}

.login-button:hover {
  background: #0056b3;
}
</style>
