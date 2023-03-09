<template>
  <el-container class="home-container">
    <!-- 头部区域, 放图标和退出按钮 -->
    <el-header>
      <span>成绩管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744" text-color="#fff"
                 active-text-color="#409bff" :unique-opend="true"
                 :collapse="isCollapse"
                 router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- index要改，不然的话点击菜单后就全部下来了 -->
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span style="margin-left: 10px;">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span style="margin-left: 10px;">{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体部分,这一部分使用路由占位符 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单的数据
      menuList: [],
      // 一级菜单栏的头像设置
      iconObj: {
        100: 'iconfont icon-guanliyuan',
        101: 'iconfont icon-xueshengdangan',
        102: 'iconfont icon-xueshengchengji',
        103: 'iconfont icon-xiaoshouzongheqingkuangtongjibiao'
      },
      // isCollapse属性通过bool值控制侧边栏的宽度u
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  // Home组件一旦被创建就获取我们的菜单列表
  created () {
    this.getMenuList();
    // 下面这个是在页面刷新的时候可以继续展开上次的菜单，刷新的时候data数据全部清空
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    // 首先给我们的退出按钮绑定事件，直接跳到/login
    async logout() {
      const { data: res } = await this.$http.get('/logout');
      if (res.code !== 200)  return this.$message.error('登出错误');
      this.$message.success(res.msg);
      window.sessionStorage.clear();
      await this.$router.push('/login');
    },
    // 给我们的侧边栏展开绑定事件
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('/MenuServlet');
      console.log(res);
      // if (res.meta.status !== 200)  return this.$message.error(res.meta.msg);
      // this.menuList = res.data;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  // height: 100%的属性是可以被el-header和el-aside和el-main继承的
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // 这个时候发现文字和左边补不贴，这是内边距导致的
  padding-left: 15px;
}

.el-aside {
  background-color: #333744;
  .el-menu {
    // 你会惊奇的发现左边的一级导航栏和aside右边明显有不重合的地方，不妨打开元素审查
    // 看一看是什原因
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

// 设置我们的展开按钮
.toggle-button {
  // 注意这里的宽度不需要设置，自动的和我们的el-aside是对齐的宽度
  background-color: #4a5064;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  border-right: none;
}
</style>
