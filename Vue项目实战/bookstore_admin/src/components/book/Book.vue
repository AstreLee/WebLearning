<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>图书管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 顶部搜索区域-->
    <div class="headerSearch">
      <el-input type="text" placeholder="图书名/图书ID" v-model="searchContent"
                size="medium" clearable>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" class="newAdd" size="medium" @click="addDialogVisible = true">+ 新增图书</el-button>
    </div>

  <!-- 主体区域 -->
  <div class="body">
    <el-card class="box-card">
      <el-table :data="bookList" style="width: 100%" :row-style="{height: '50px'}"
                :cell-style="{padding: '0px', 'text-align':'center'}"
                :header-cell-style="{'text-align':'center'}" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="分类">
                <span>{{ scope.row.category }}</span>
              </el-form-item>
              <el-form-item label="详细介绍">
                <span>{{ scope.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <img :src="$hostImg + scope.row.imgUrl" alt="" style="width: 60px; height: 60px">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="150"></el-table-column>
        <el-table-column prop="price" label="单价" width="120"></el-table-column>
        <el-table-column prop="num" label="库存" width="120"></el-table-column>
        <el-table-column prop="publisher" label="出版社"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑图书" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.bookId)">
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip class="item" effect="dark" content="删除图书" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeBookById(scope.row.bookId)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

    <!-- 添加图书对话框 -->
    <el-dialog title="添加图书"
               :visible.sync="addDialogVisible"
               width="40%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="图书名称" prop="product">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="图书描述" prop="description">
          <el-input v-model="addForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="addForm.num"></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="addForm.publisher"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="addForm.categoryId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            class="upload-demo"
            :action="$hostImg + '/book/upload'"
            :on-success="handleAvatarSuccess"
            :file-list="fileList"
            :headers="headers"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">上传.jpg/.png文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addBook">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改图书对话框 -->
    <el-dialog title="修改图书"
               :visible.sync="editDialogVisible"
               width="40%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="图书名称" prop="product">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="图书描述" prop="description">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="editForm.num"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editBookInfo">确 定</el-button>
          </span>
    </el-dialog>
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
  name: 'Book',
  created () {
    this.getToken()
    this.getAllCategory()
    this.getBookList()
  },
  data () {
    return {
      headers: {},
      options: [],
      fileList: [],
      searchContent: '',
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数可以为空
        pagenum: 1, // 当前页数
        pagesize: 2 // 当前页数中有多少条记录
      },
      // 保存图书列表
      bookList: [],
      // 保存图书页面的总数
      total: 0,
      // 控制添加图书的对话框的显示与否
      addDialogVisible: false,
      // 添加图书的表单数据
      addForm: {
        name: '',
        desc: '',
        price: '',
        num: '',
        publisher: '',
        categoryId: '',
        imgUrl: ''
      },
      // 添加用户表单的验证规则
      addFormRules: {},
      // 控制修改图书对话框的显示与否
      editDialogVisible: false,
      // 修改图书的表单数据
      editForm: {
        name: '',
        desc: '',
        price: '',
        num: ''
      },
      // 修改图书表单的验证规则
      editFormRules: {}
    }
  },
  methods: {
    // 获取所有分类
    async getAllCategory () {
      const { data: res } = await this.$http.get('book/category')
      if (res.code !== 200) return this.$message.error('获取分类信息失败！')
      this.options = res.data
    },
    // 获取token
    getToken () {
      this.headers.Authorization = window.sessionStorage.getItem('token')
    },
    // 监听pagesize改变的事件, 也就是一个页面显示多少条数据
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getBookList()
    },
    // 监听页码值发生了变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getBookList()
    },
    // 上传图片
    handleAvatarSuccess (res) {
      this.fileList = res.fileList
      this.addForm.imgUrl = res.url
    },
    // 获取图书列表
    async getBookList () {
      const { data: res } = await this.$http.get('book/info')
      if (res.code !== 200) return this.$message.error('获取图书信息失败！')
      this.bookList = res.data
    },
    // 监听添加图书对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加图书
    async addBook () {
      // 首先是预验证的功能的实现
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('输入的数据不合法!')
        const { data: res } = await this.$http.post('book', this.addForm)
        if (res.code !== 201) return this.$message.error('添加书籍失败！')
        this.$message.success('添加书籍成功')
        this.addDialogVisible = false
        await this.getBookList()
      })
    },
    // 展示编辑用户的对话框,同时通过用户的id获取到用户的数据然后自动添加到修改用户的对话框里面
    async showEditDialog (bookId) {
      const { data: res } = await this.$http.get('book/' + bookId)
      if (res.code !== 200) return this.$message.error('获取图书信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 给close事件注册editDialogClosed方法，关闭修改用户对话框的时候通过表单的引用
    // 以及resetFields()方法清除表单的数据
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户对话框表单内容的提交
    editBookInfo () {
      // 在提交表单前需要对表单进行预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('格式错误')
        // 预验证通过才向我们的后台发起请求，减少后台服务器的压力
        // put里面的第二个参数也可以这样写: {email: this.editForm.email, mobile: this.editForm.mobile }
        const { data: res } = await this.$http.put('book', this.editForm)
        if (res.code !== 202) return this.$message.error('编辑图书失败!')
        // 否则的话就是添加用户成功了
        this.$message.success('编辑图书成功!')
        // 最后编辑用户成功了以后别忘了关闭编辑用户的对话框
        this.editDialogVisible = false
        // 当然我们还可以刷新一下用户列表
        await this.getBookList()
      })
    },
    // 删除用户信息并提交
    removeBookById (id) {
      this.$confirm('此操作将永久删除书籍，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确认按钮后就会向后台发起请求通过用户id删除数据
        const { data: res } = await this.$http.delete('book/' + id)
        if (res.code !== 203) return this.$message.error('删除书籍失败!')
        // 否则的话就删除用户成功了，我们给个提示信息
        this.$message.success('删除书籍成功!')
        // 然后我们在更新一下用户列表
        await this.getBookList()
      }).catch(() => {
        // 点击了取消按钮后会执行的
        this.$message.info('取消删除成功!')
      })
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

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
}

.demo-table-expand .el-form-item {
  width: 100%;
  margin-left: 10px;
  margin-bottom: 0;
  color: #99a9bf;
}
</style>
