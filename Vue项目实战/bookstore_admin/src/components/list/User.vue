<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="headerSearch">
      <el-input type="text" placeholder="用户名/用户id" v-model="searchContent"
                size="medium" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="body">
      <el-card class="box-card">
        <el-table :data="userlist" style="width: 100%" :row-style="{height: '50px'}"
                  :cell-style="{padding: '0px', 'text-align':'center'}"
                  :header-cell-style="{'text-align':'center'}" stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="地址(省市区)">
                  <span>{{ scope.row.address }}</span>
                </el-form-item>
                <el-form-item label="详细地址">
                  <span>{{ scope.row.details }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column label="用户名" prop="username" width="150"></el-table-column>
          <el-table-column label="电话" prop="phone" width="180"></el-table-column>
          <el-table-column label="邮件" prop="email" width="180"></el-table-column>
          <el-table-column label="状态" width="100">
            <!-- 定义了一个作用域插槽，通过slot-scope接收到了作用域中的
            数据, 通过scope.row获得这一行的数据-->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" active-color="#13ce66"
                         inactive-color="#ff4949" @change="updateState($event, scope.row.userId)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small">编辑用户</el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteUser(scope.row.userId)">删除用户</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'User',
  created () {
    this.getUserList()
  },
  data () {
    return {
      searchContent: '',
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数可以为空
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前页数中有多少条记录
      },
      // 保存用户列表
      userlist: [],
      // 保存用户页面的总数
      total: 0,
      // 控制添加用户的对话框的显示与否
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 添加用户表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户姓名!', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10字符之间!', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在6~10个字符之间!', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱!', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            message: '请输入格式正确的邮箱',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号!', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入格式正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框的显示与否
      editDialogVisible: false,
      // 修改用户的表单数据
      editForm: {
        username: '',
        email: '',
        phone: ''
      },
      // 修改用户表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱!', trigger: 'blur' },
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            message: '请输入格式正确的邮箱',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号!', trigger: 'blur' },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入格式正确的手机号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('user/info/' + this.queryInfo.pagenum + '/' + this.queryInfo.pagesize)
      if (res.code !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.userlist
      this.total = res.data.total
    },
    async updateState (val, userId) {
      const { data: res } = await this.$http.put('user/' + userId + '/' + val)
      if (res.code !== 202) return this.$message.error('更新用户状态失败！')
      this.$message.success('更新用户状态成功！')
    },
    async deleteUser (userId) {
      this.$confirm('此操作将永久删除用户，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确认按钮后就会向后台发起请求通过用户id删除数据
        const { data: res } = await this.$http.delete('user/' + userId)
        if (res.code !== 203) return this.$message.error('删除用户失败!')
        // 提示删除用户成功
        this.$message.success('删除用户成功!')
        // 更新用户列表
        await this.getUserList()
      }).catch(() => {
        // 取消后提示信息
        this.$message.info('取消删除成功!')
      })
    },
    // 监听pagesize改变的事件, 也就是一个页面显示多少条数据
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值发生了变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.headerSearch {
  display: flex;
  justify-content: left;
  margin-bottom: 18px;

  > .el-input {
    width: 300px;
  }

  .newAdd {
    margin-left: 40px;
  }
}

.body {
  .box-card {
    .demo-table-expand {
      font-size: 0;
    }

    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
      width: 100%;
      margin-left: 10px;
      margin-bottom: 0;
      color: #99a9bf;
    }
  }
}

</style>
