<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索与添加区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">+添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 接下来就就是使用table表格展示管理员用户数据 -->
      <el-table :data="userlist" :border="true" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!-- 然后就是操作列，有增删改三个操作 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" @click="removeUserById(scope.row.id)" size="mini">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="info" @click="showEditDialog(scope.row.id)" size="mini">修改</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 接下来就是分页 -->
      <!--
        1. handleSizeChange()方法监听修改一页显示的条数事件，也就是左边XX条页
        2. handleCurrentChange()方法监听当前页数发生变化
        3. current-page.sync双向绑定当前页数
        4. page-sizes双向绑定左边的下拉框，也就是一页显示多少条数据
        5. page-size双向绑定当前一页多少条数据
        6. layout。。。
        7. total双向绑定总数据量
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="sizes, prev, pager, next"
        :total="total" background>
      </el-pagination>


      <!-- 添加用户的对话框 -->
      <!--
        1. title是对话框的名称
        2. visible.sync双向绑定显示对话框与否
        3. width指定对话框的宽度
        4. addDialogClosed方法监听添加对话框关闭事件
      -->
      <el-dialog title="添加用户"
                 :visible.sync="addDialogVisible"
                 width="40%" @close="addDialogClosed">
        <el-form ref="addDialogRef" :model="addUserForm" :rules="addUserFormRules">
          <el-form-item prop="username">
            <el-input v-model="addUserForm.username" prefix-icon="iconfont icon-yonghu"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="addUserForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="addUserForm.phone" prefix-icon="iconfont icon-dianhua"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="addUserForm.email" prefix-icon="iconfont icon-youxiang"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户"
                 :visible.sync="editDialogVisible"
                 width="40%" @close="editDialogClosed">
        <el-form ref="editDialogRef" :model="editUserForm" :rules="editUserFormRules">
          <el-form-item prop="username">
            <el-input v-model="editUserForm.username" prefix-icon="iconfont icon-yonghu" disabled></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="editUserForm.phone" prefix-icon="iconfont icon-dianhua"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="editUserForm.email" prefix-icon="iconfont icon-youxiang"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      // 获取用户列表的参数对象，分页器中的内容会双向绑定到这个位置
      queryInfo: {
        query: '',  // 查询参数可以为空
        pagenum: 1,  // 当前页数
        pagesize: 1  // 当前页数中有多少条记录
      },
      // 保存总页面数
      total: 0,
      // 保存用户列表
      userlist: [],
      // 控制添加用户对话框的显示与否
      addDialogVisible: false,
      // 添加用户表单绑定对象
      addUserForm: {
        username: '',
        password: '',
        phone: '',
        email: ''
      },
      // 添加用户表单验证规则
      addUserFormRules: {
        username: [
          // 用户名不能为空
          { require: true, message: '请输入用户名', trigger: 'blur' },
          // 用户名长度在3 ~ 10个字符之间
          { min: 3, max: 10, message: '用户名的长度应该在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          // 密码不能为空
          { require: true, message: '请输入密码', trigger: 'blur' },
          // 密码的长度至少为8个字符
          { min: 8, message: '密码长度不小于八位', trigger: 'blur' },
          // 密码至少包含一个数字，字母和特殊字符
          {
            pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$',
            message: '密码至少包含一个数字、字母和特殊字符',
            trigger: 'blur'
          }
        ],
        phone: [
          // 电话号码不能为空
          { require: true, message: '请输入电话', trigger: 'blur' },
          // 电话号码的验证规则
          { pattern: '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', message: '电话号码格式不正确', trigger: 'blur' }
        ],
        email: [
          // 邮箱不能为空
          { require: true, message: '请输入邮箱', trigger: 'blur' },
          // 邮箱验证规则
          {
            pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$',
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户对话框的显示与否
      editDialogVisible: false,
      // 编辑用户表单的绑定对象
      editUserForm: {
        id: '',
        username: '',
        phone: '',
        email: ''
      },
      // 编辑用户表单的验证规则
      editUserFormRules: {
        phone: [
          // 电话号码不能为空
          { require: true, message: '请输入电话', trigger: 'blur' },
          // 电话号码的验证规则
          { pattern: '^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', message: '电话号码格式不正确', trigger: 'blur' }
        ],
        email: [
          // 邮箱不能为空
          { require: true, message: '请输入邮箱', trigger: 'blur' },
          // 邮箱验证规则
          {
            pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$',
            message: '邮箱格式错误',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 首先是获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.post('/GetManagerListServlet', this.queryInfo)
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听添加用户对话框的关闭事件，对话框一关闭我们就清空表单
    addDialogClosed() {
      this.$refs.addDialogRef.resetFields()
    },
    // 监听添加用户对话框提交事件
    addUserConfirm() {
      // 记得一定要预验证
      this.$refs.addDialogRef.validate(async (valid) => {
        // 如果预验证不能通过的话就直接返回
        if (!valid) return
        // 只有预验证通过了才可以向后台发起请求
        const { data: res } = await this.$http.post('/AddManagerServlet', this.addUserForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        else this.$message.success(res.meta.msg)
        // 添加完成关闭对话框
        this.addDialogVisible = false
        // 再更新一下列表
        await this.getUserList()
      })
    },
    // 监听修改按钮的点击事件
    async showEditDialog(id) {
      // 首先说明一下，实际上可以直接指定editDialogVisible=true，为什么这里还要定义一个方法
      // 这是因为我们需要在表单展开的同时将用户名，电话，邮箱自动填充上去，然后用户名不允许
      // 修改，可以允许修改电话和邮箱
      const { data: res } = await this.$http.get('/GetEditManagerServlet?id=' + id)
      if (res.meta.status !== 200) this.$message.error(res.meta.msg)
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件，对话框一关闭我们就清空表单
    editDialogClosed() {
      this.$refs.editDialogRef.resetFields()
    },
    // 监听修改用户对话框的确认事件
    editUserConfirm() {
      this.$refs.editDialogRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/EditManagerServlet', this.editUserForm)
        if (res.meta.status !== 200) this.$message.error(res.meta.msg)
        else this.$message.success(res.meta.msg)
        // 关闭修改对话框
        this.editDialogVisible = false
        // 再刷新一下我们的修改用户对话框
        await this.getUserList()
      })
    },
    // 监听删除按钮的点击事件
    removeUserById(id) {
      this.$confirm('此操作将用户删除用户，是否继续？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(async () => {
        // 点击确认按钮后向后台发起请求
        const { data: res } = await this.$http.get('/DeleteManagerServlet?id=' + id)
        if (res.meta.status !== '200') this.$message.success(res.meta.msg)
        else this.$message.error(res.meta.msg)
        // 如果删除的是当前页面中的最后一个，想办法让它刷新到前一个界面去
        // 第一个问题就是如何判断删除后是否是页面中的最后一个
        // 我们可以采用(pagenum - 1) * pagesize和total - 1的大小来进进行判断
        // 这里的采用total减一是为了避免二次刷新，如果他们相等，直接让pagenum - 1
        if ((this.queryInfo.pagenum - 1) * this.queryInfo.pagesize === this.total - 1) {
          if (this.queryInfo.pagenum === 1) {
            await this.getUserList()
            return
          }
          this.queryInfo.pagenum = this.queryInfo.pagenum - 1
        }
        // 然后我们再去刷新列表
        await this.getUserList()
      }).catch(() => {
        this.$message.info('取消删除！')
      })
    },
    // 监听pageSize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码发生改变
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    }
  }
}
</script>

<style scoped>

</style>
