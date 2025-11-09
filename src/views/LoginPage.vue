<template>
  <div class="login-container">
    <img src="/images/login1.png" alt="Background" class="login-background" />
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group" style="margin-top: 200px;">
        <label for="username"></label>
        <input type="text"  id="username" v-model="username" required placeholder="用户名">
      </div>
      <div class="form-group" style="margin-top: 20px;">
        <label for="password"></label>
        <input type="password" id="password" v-model="password" required placeholder="密码" style="width: 80%;">
      </div>
      <button type="submit" class="login-button">登录</button>
    </form>
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
body {
  background-image: url('../../public/images/login2.png');
  background-size: cover;
  background-position: center;
  margin: 0;
}

.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  position: relative;
}

.login-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1; /* 确保背景在表单之下 */
}

.login-form {
  position: relative;
  z-index: 1; /* 确保表单在背景之上 */
  margin-top: 20px;
  height: 500px; /* 拉长表单 */
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-group:last-child {
  margin-bottom: 30px;
}

input {
  flex: 0.75;
  padding: 5px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid #d9d8e8ff;
}

.login-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.login-button:hover {
  background-color: #0056b3;
}
</style>
