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
            <!-- 搜索与添加区域 -->
            <!-- :gutter属性指定了col之间的间隔 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加区域 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query"
                              clearable @clear="getUserList">
                        <el-button slot="append"
                                   icon="el-icon-search"
                                   @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">+添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <!-- 向el-table注入data元素以后，在column中用prop属性指定
            数组中对象的属性名即可全部渲染上去, label指定列名, width指定宽,
            border给表格加边框, stripe实现隔行变色的效果 -->
            <el-table :data="userlist" :border="true" :stripe="true">
                <!-- label标签指定了列名，prop指定了渲染到这一列上的数据 -->
                <!-- 指定type=index就可以设置索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色名" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 定义了一个作用域插槽，通过slot-scope接收到了作用域中的
                    数据, 通过scope.row获得这一行的数据-->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <!-- 即使按钮设置为最小化以后，发现还是放不下，这个时候直接指定
                el-table-column的宽度，其它的就交给内部去自己实现吧 -->
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip class="item" effect="dark"
                                    content="修改用户" placement="top"
                                    :enterable="false"> <!-- enterable表示鼠标是否可以进入提示信息栏 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark"
                                    content="删除用户" placement="top"
                                    :enterable="false"> <!-- enterable表示鼠标是否可以进入提示信息栏 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark"
                                    content="分配角色" placement="top"
                                    :enterable="false"> <!-- enterable表示鼠标是否可以进入提示信息栏 -->
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

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

            <!-- 添加用户的对话框 -->
            <el-dialog title="添加用户"
                       :visible.sync="addDialogVisible"
                       width="50%" @close="addDialogClosed">
                <!-- 内容主体区 -->
                <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改用户的对话框 -->
            <el-dialog title="修改用户"
                       :visible.sync="editDialogVisible"
                       width="50%" @close="editDialogClosed">
                <!-- 内容主体区 -->
                <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "users",
    data() {
        // 自定义验证邮箱的规则
        // 什么是回调函数，这里需要再复习一下
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            // 如果不合法的话我们就给回调函数传入一个Error对象
            cb(new Error("请输入合法的邮箱!"))
        }

        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error("请输入合法的手机号!"))
        }

        return {
            // 获取用户列表的参数对象
            queryInfo: {
                query: "",  // 查询参数可以为空
                pagenum: 1,  // 当前页数
                pagesize: 2  // 当前页数中有多少条记录
            },
            // 保存用户列表
            userlist: [],
            // 保存用户页面的总数
            total: 0,
            // 控制添加用户的对话框的显示与否
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: "",
                password: "",
                email: "",
                mobile: ""
            },
            // 添加用户表单的验证规则
            addFormRules: {
                username: [
                    { required: true, message: "请输入用户姓名!", trigger: "blur" },
                    { min: 3, max: 10, message: "用户名的长度在3~10字符之间!", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码!", trigger: "blur" },
                    { min: 6, max: 15, message: "密码长度在6~10个字符之间!", trigger: "blur" }
                ],
                email: [
                    { required: true, message: "请输入邮箱!", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" }
                ],
                mobile: [
                    { required: true, message: "请输入手机号!", trigger: "blur" },
                    { validator: checkMobile, trigger: "blur" }
                ]
            },
            // 控制修改用户对话框的显示与否
            editDialogVisible: false,
            // 修改用户的表单数据
            editForm: {
                username: "",
                email: "",
                mobile: ""
            },
            // 修改用户表单的验证规则
            editFormRules: {
                email: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" }
                ],
                mobile: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    { validator: checkMobile, trigger: "blur" }
                ]
            }
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 每次创建users页面的时候都会自动执行这个方法，返回的是promise
        // 可以在方法名前面加上async，在请求前面加上await，这样可以将promise
        // 转化成数据对象
        async getUserList() {
            const { data: res } = await this.$http.get("users",
                { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error("获取用户列表失败")
            this.userlist = res.data.users
            this.total = res.data.total
            console.log("获取用户列表:")
            console.log(res)
        },
        // 监听pagesize改变的事件, 也就是一个页面显示多少条数据
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码值发生了变化
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听switch开关的状态的变化
        async userStateChanged(userinfo) {
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                // 这里有一个问题就是如果请求失败了，前台的页面中的按钮状态也应该回退到之前
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error("更新用户状态失败!")
            } else {
                console.log("用户的状态为:")
                if (userinfo.mg_state === true) {
                    console.log(`${userinfo.username}用户有权限。`)
                } else {
                    console.log(`${userinfo.username}用户没有权限!`)
                }
                return this.$message.success("更新用户状态成功!")
            }
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加新用户
        addUser() {
            // 首先是预验证的功能的实现
            this.$refs.addFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error("输入的数据不合法!")
                // 如果预验证通过的话，就开始向后台发起请求
                // 注意下post和get请求中关于参数params参数的区别
                const { data: res } = await this.$http.post("users", this.addForm)
                if (res.meta.status !== 201) return this.$message.error("添加用户失败!")
                // 否则的话就是添加成功了
                this.$message.success("添加用户成功!")
                // 添加成功以后就要隐藏添加用户消息对话框，注意访问组件中的内容要用this关键字修饰
                this.addDialogVisible = false
                // 添加成功了不要忘记了更新下用户列表
                await this.getUserList()
            })
        },
        // 展示编辑用户的对话框,同时通过用户的id获取到用户的数据然后自动添加到修改用户的对话框里面
        async showEditDialog(id) {
            const { data: res } = await this.$http.get("users/" + id)
            if (res.meta.status !== 200) return this.$message.error("查询用户失败!")
            this.editForm = res.data
            // 本来可以在修改按钮的click单击事件中直接修改这个属性值的
            // 但是现在我们不仅需要展示修改用户的对话框，还要根据用户的id向后台发起请求
            // 然后获取到用户的信息自动填写到表格中去，所以我们直接放到了这个方法中来
            this.editDialogVisible = true
        },
        // 给close事件注册editDialogClosed方法，关闭修改用户对话框的时候通过表单的引用
        // 以及resetFields()方法清除表单的数据
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 添加用户对话框表单内容的提交
        editUserInfo() {
            // 在提交表单前需要对表单进行预验证
            this.$refs.editFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error("请按照正确的格式修改用户的数据!")
                // 预验证通过才向我们的后台发起请求，减少后台服务器的压力
                // put里面的第二个参数也可以这样写: {email: this.editForm.email, mobile: this.editForm.mobile }
                const { data: res } = await this.$http.put("users/" + this.editForm.id, this.editForm)
                if (res.meta.status !== 200) return this.$message.error("编辑用户失败!")
                // 否则的话就是添加用户成功了
                this.$message.success("编辑用户成功!")
                // 最后编辑用户成功了以后别忘了关闭编辑用户的对话框
                this.editDialogVisible = false
                // 当然我们还可以刷新一下用户列表
                await this.getUserList()
            })
        },
        // 删除用户信息并提交
        removeUserById(id) {
            this.$confirm("此操作将永久删除用户，是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                // 点击了确认按钮后就会向后台发起请求通过用户id删除数据
                const { data: res } = await this.$http.delete("users/" + id)
                if (res.meta.status !== 200) return this.$message.error("删除用户失败!")
                // 否则的话就删除用户成功了，我们给个提示信息
                this.$message.success("删除用户成功!")
                // 然后我们在更新一下用户列表
                await this.getUserList()
            }).catch(() => {
                // 点击了取消按钮后会执行的
                this.$message.info("取消删除成功!")
            })
        }
    }
}
</script>

<style lang="less" scoped>

</style>
