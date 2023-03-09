<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/sun.jpg" alt="" />
      </div>
      <el-form ref="loginFormRef" status-icon :model="loginForm" :rules="loginFormRules" label-width="0" class="login_form">
        <!-- 首先是表单项, prop='username'要与验证规则名匹配 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 然后是密码项, prop='password'要与验证规则进行匹配 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 接下来是两个按钮 -->
        <el-form-item>
          <div>
            <el-button type="primary" @click="loginFormSubmit" class="btn1">登录</el-button>
          </div>
          <div>
            <el-button type="info" @click="resetLoginForm" class="btn2">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登录表单绑定的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是登录表单的验证规则
      loginFormRules: {
        // 检验用户名是否合法
        // 这个检验名要和绑定的数据名一致
        username: [
          // 首先是输入框中必须要有值，一但光标聚焦，就会检测，如果没有的话就会显示对应的信息
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // 然后就是用户名的长度必须在3 ~ 10个长度范围之内
          { min: 1, max: 10, message: '用户名长度必须在3 ~ 10个字符之内', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度至少为6位' }
          // 然后用我们已经定义好的正则表达式来进行验证
          // { pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$', message: '至少一位数字，字母和特殊字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮清空表单域
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 点击提交按钮提交表单进行数据库验证
    loginFormSubmit() {
      // 首先进行表单预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid会根据我们设定的规则进行预验证，如果不符合要求的话直接返回
        if (!valid)  return;
        const { data: res } = await this.$http.post('/LoginServlet', this.loginForm);
        console.log(res);
        if (res.code !== 200)  return this.$message.error(res.msg);
        this.$message.success(res.msg);
        window.sessionStorage.setItem('token', res.token);
        // 登录完成以后，还要通过编程式的导航跳转到后台主页，路由地址是/home
        // 当然这一步是要经过路由导航守卫进行检查的,登录后肯定是有token的
        // 所有通过编程式导航是可以直接跳转到/home下
        await this.$router.push('/home');
      })
    }
  }
}
</script>

<style lang='less' scoped>
/* 关于这里为什么要加上scoped，如果不加scoped的话这里的样式就会全局生效, 加上后只在当前组件有效 */
.login_container {
  background-color: #2b4b6b;
  // 关于下面的height，如果只是在这个Login.vue组件中使用是不会生效的
  // height: 100%生效的只有下面两种情况
  // 1. 从html >> body >> ... >> 父级 >> 对应元素全部设置了height: 100%
  // 2. 父盒子设定了高度(或者是更高的级别，实际上道理是一样的)
  height: 100%;
}

.login_box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  // 接下来就是让我们的登录盒子居中，采用绝对定位的方式
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // 接下来就是设置头像的样式了
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    // 然后把它移动到中间来，由于父元素已经设置过了定位，所以以父级元素为标准
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    // 下面这个背景是必须要设置的，不设置的话会被外面遮住的
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  // 然后甚至form表单
  .login_form {
    position: absolute;
    bottom: 10px;
    width: 100%;
    padding: 0 60px;
    // box-sizing: border-box就是在指定的宽度和高度内设置内边距和外边距，不会扩大盒子
    box-sizing: border-box;
  }

  // 然后设置两个按钮的样式
  .btn1 {
    float: left;
    margin-left: 20px;
  }

  .btn2 {
    float: right;
    margin-right: 20px;
  }
}
</style>
