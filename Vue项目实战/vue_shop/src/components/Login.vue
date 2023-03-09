<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="" />
            </div>
            <!-- 登录表单区域 -->
            <!-- ref是一个引用，可以表示表单这个控件 -->
            <el-form ref="loginFormRef" status-icon :model="loginForm" :rules="loginFormRules" label-width="0"
                     class="login_form">
                <!-- 用户名 -->
                <!-- prop是需要校验的字段名，要传入Form组件中的model字段 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"
                              type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item>
                    <div>
                        <el-button type="primary" @click="login" class="btn1">登录</el-button>
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
    name: "Login",
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: "admin",
                password: "123456"
            },
            loginFormRules: {
                // 验证用户名是否合法
                // 这个校验名和绑定的数据名注意要一一对应
                username: [
                    // input控件中需要内容，一但鼠标失焦，检测到没有输入用户名，就会显示提示信息
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    // 不满足指定的长度要求时，一但鼠标失焦，就会显示报错
                    { min: 3, max: 10, message: "长度在3~10个字符", trigger: "blur" }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    // 不满足指定的长度要求时，一但鼠标失焦，就会显示报错
                    { min: 6, max: 15, message: "长度在6~15个字符", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        // 表单预验证，不然什么阿猫阿狗数据往里面输入都向后台发起验证，服务器不得累死
        // 所以在发起请求之前我们先通过已经指定的表单规则进行预验证，只有满足预验证的
        // 用户名和密码才有资格发送到后台进行验证
        login() {
            // 什么是async，什么是await，什么是解构???
            // 注意这个表单验证是根据我们已经设置过的表单验证规则进行验证的
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return
                const { data: res } = await this.$http.post("login", this.loginForm)
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)

                // 登录成功以后我们还要干什么，当然就是报错token令牌了
                // 我们要将登录成功后的token保存到客户端的sessionStorage中
                // 为什么不保存在localStorage中呢，因为我们只需要会话的时候生效就可以了
                // 项目中除了登录API接口以外，其它的API接口都要登录后才能访问
                // token只应当在当前网站打开期间生效，所以保存在sessionStorage中
                window.sessionStorage.setItem("token", res.data.token)

                // 登录完成以后，还要通过编程式的导航跳转到后台主页，路由地址是/home
                // 当然这一步是要经过路由导航守卫进行检查的,登录后肯定是有token的
                // 所有通过编程式导航是可以直接跳转到/home下
                await this.$router.push("home")
            })
        }
    }
}
</script>


<style lang="less" scoped>
/* 加上scoped以后，当前样式只在当前vue组件生效，否则就是全局生效*/
.login_container {
    background-color: #2b4b6b;
    height: 100%
}


.login_box {
    width: 500px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    // 想在页面中间进行定位的话，我们其实可以使用margin: 0 auto，但是这只能是左右居中
    // 想要上下居中的话，我们还得单独指定margin-top的值，而且盒子的高也不知道，所以采用
    // 绝对定位的方式，首先指定top：50%和left：50%，然后在自身盒子长宽不知道的情况下
    // 利用css3中的新特性transform: translate(-50%, -50%)向左向上移动50%
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_form {
        // absolute会隐式的将我们的表单的display属性转化成为行内块元素，这时候默认就不是
        // 父盒子的宽度了
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 40px;
        // box-sizing: border-box就是在指定的宽度和高度内设置内边距和外边距，不会扩大盒子
        box-sizing: border-box;
    }

    .btn1 {
        float: left;
        margin-left: 20%;
    }

    .btn2 {
        float: right;
        margin-right: 20%;
    }
}
</style>
