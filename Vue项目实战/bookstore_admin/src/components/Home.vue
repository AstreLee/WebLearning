<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        书城管理系统
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- router属性表示激活菜单中以index作为path进行跳转 -->
        <el-menu background-color="#333744" text-color="#fff"
                 active-text-color="#409bff" :unique-opened="true"
                 :collapse="isCollapse" :collapse-transition="false"
                 router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- index要改，不然的话一点就全部下来了,而且注意静态绑定直接index
           动态的话要用v-bind:index了，v-bind可以省略 -->
          <!-- 然后还要注意的就是:index绑定只能接受字符串类型，所以要加上''-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 注意路由必须以'/'开头 -->
            <el-menu-item :index="'/' + subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/' + subItem.path)">
              <!-- 二级级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体部分 -->
      <el-main>
        <transition
          mode="out-in"
          enter-active-class="animate__animated animate__fadeIn animate__faster"
          leave-active-class="animate__animated animate__fadeOut animate__faster">
          <keep-alive>
        <router-view></router-view>
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import store from '@/store/index.js'

export default {
  name: 'Home',
  store,
  // 组件中的私有数据全部是保存在data中的
  data () {
    return {
      // 左侧菜单的数据
      menulist: this.$store.state.menulist,
      iconObj: this.$store.state.iconObj,
      // 左侧菜单栏是否折叠
      isCollapse: false,
      // 被激活的链接的地址
      activePath: ''
    }
  },
  // Home组件被创建的时候一定会执行created声明周期钩子函数
  // 而我们的default-active高亮显示需要在Home组件一被创建时候就从sessionStorage中
  // 取值，所以放在created()方法中，放在saveNavState里面的话等到我们去点击就晚了
  created () {
    this.getMenuList() // 菜单栏一加载就要获取权限
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 首先清除token令牌，这样下次需要访问的时候就需要获取新的token令牌
      window.sessionStorage.clear()
      // 然后跳转到登录页面，路由守护检测到这是登录页面，直接放行
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      // const { data: res } = await this.$http.get('menus')
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.menulist = res.data
    },
    // 点击按钮，实现菜单的折叠与展开
    toggleCollapse () {
      // 会发现折叠动画是真的丑，所以我们不开启折叠动画
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 下面这行代码是不正确的，因为刷新页面的时候data里面的私有数据
      // 全部更新，这个时候虽然sessionStorage中已经存储了activePath值
      // 但是这个点击事件无法触发，所以说activePath是空值(注意每次更新的时候
      // data里面的数据都会清空 )，但是嘞如果又触发了这个点击事件没有刷新的
      // 条件下，同样也要更新我们的activePath，所以下面的代码还是需要的
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  // 然后还会发现我们的按钮是紧贴上下边的，同样可以通过align-items: center指定
  // 在非主轴方向上的对齐方式
  align-items: center;
  // 接下来设置文本的内容，可以通过继承的方式实现
  color: #fff;
  font-size: 20px;

  > .el-button {
    margin-right: 20px;
  }

  > div {
    margin-left: 35px;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    // 左边的一级导航栏和aside右边明显有不重合的地方
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

// 想让我们的图标和字体之间有间隔?很简单，直接设置iconfont的右边距就行了
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // letter-spacing是用来分隔单词中间的字符的
  letter-spacing: 0.2em;
  cursor: pointer;
  border-right: none;
}
</style>
