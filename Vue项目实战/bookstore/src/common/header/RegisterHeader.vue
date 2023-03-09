<template>
  <div class="header">
    <div class="logo">
      <img src="../../assets/logo.png" alt=""/>
      <span>欢迎注册</span>
    </div>
    <div class="isLogin">
      <span style="margin-right: 10px;">已有账号？</span>
      <router-link to="/login">请登录 ></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterHeader'
}
</script>

<style scoped>
.header {
  position: relative;
  height: 110px;
  box-shadow: 0 2px 15px 2px gray;
}

.header .logo {
  display: flex;
  align-items: center;
  float: left;
  width: 250px;
  height: 110px;
  margin-left: 100px;
}

.header .logo img {
  width: 140px;
  height: 110px;
}

.header .logo span {
  font-size: 25px;
}

.header .isLogin {
  position: absolute;
  right: 5%;
  bottom: 20%;
}

.header .isLogin a {
  color: red;
}

.header .isLogin a:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
