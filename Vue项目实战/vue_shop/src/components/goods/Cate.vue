<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col><el-button type="primary" @click="showAddCateDialog">+ 添加分类</el-button></el-col>
            </el-row>

            <!-- 表格 -->
            <!-- 关于参数的说明:
            1. :data属性表示动态绑定的数据, :columns动态绑定columns
            2. columns是一个数组，里面元素是对象，然后label指定列名,prop指定渲染到当前列的属性名是什么
            3. selection-type表示是否显示复选框-->
            <tree-table class="treetable" :data="catelist" :columns="columns" :selection-type="false"
                        :expand-type="false" :show-index="true" index-text="#"
                        :border="true" :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else-if="scope.row.cat_deleted === true" style="color: red"></i>
                </template>

                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <!-- Vue中按需渲染我们使用的是v-if，这样的话就只有满足要求的标签可以被渲染到页面上 -->
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 2">三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页操作 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]"
                           :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total" background>
            </el-pagination>

            <!-- 添加分类的对话框 -->
            <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
                <!-- 添加分页的表单 -->
                <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <!-- options属性用于指定数据源, props用于指定配置对象 -->
                        <el-cascader  :options="parentCateList" :props="cascaderProps"
                                      v-model="selectedKeys" @change="parentCateChanged" clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'Cate',
    data() {
        return {
            // 查询数据
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表
            catelist: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [
                { label: '分类名称', prop: 'cat_name' },
                { label: '是否有效', type: 'template', template: 'isok' },  // type表示将当前列定义为模板列， template表示这一列使用的模板的名称
                { label: '排序', type: 'template', template: 'order' },
                { label: '操作', type: 'template', template: 'opt' }
            ],
            // 控制添加分类的对话框的显示与否
            addCateDialogVisible: false,
            // 添加分类表单数据对象
            addCateForm: {},
            // 添加分类表单验证规则
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入父类名称', trigger: 'blur' }
                ]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                // expandTrigger:hover表示鼠标经过的时候触发展开
                expandTrigger: 'hover',
                // 表示支持选择多层的数据
                checkStrictly: true
            },
            // 选中父级分类的id数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {  params: this.queryInfo });
            if (res.meta.status !== 200) return this.$message.error('获取商品列表失败!');
            // 把数据列表赋值给catelist
            this.catelist = res.data.result;
            // 为我们的数据条数赋值
            this.total = res.data.total;
        },
        // 监听一页中显示的条数pageSize改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            // 监听并获取到条数发生变化以后立即向后台发起请求更新一下
            this.getCateList();
        },
        // 监听页码pagenum改变
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum;
            this.getCateList();
        },
        // 点击按钮，展示添加分类的对话框
        showAddCateDialog() {
            // 在展示添加分类的对话框之前先获取父级分类的列表
            this.getParentCateList();
            // 获取完父级分类的列表后，再展示对话框
            this.addCateDialogVisible = true;
        },
        // 监听对话框关闭事件
        addCateDialogClosed() {
            // 调用引用清空表单
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
            if (res.meta.status !== 200) return this.$message.error('获取父级分类失败!');
            this.parentCateList = res.data;
            console.log(this.parentCateList);
        },
        // 选择项发生变化触发这个函数
        parentCateChanged() {
            // 如果selectedKeys数组汇总的length>0，证明选中的父级分类
            // 反之说明没有选中任何父级分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                // 为当前分类等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length;
            } else {
                // 父级分类的id
                this.addCateForm.cat_pid = 0;
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0;
            }
        },
        // 点击按钮添加新的事件
        addCate() {
            this.$refs.addCateFormRef.validate(async (valid) => {
                if (!valid) return this.$message.error('请按照格式输入');
                const { data: res } = await this.$http.post('categories', this.addCateForm);
                if (res.meta.status !== 201) return this.$message.error('添加分类失败!');
                this.$message.success('添加分类成功!');
                await this.getCateList();
                this.addCateDialogVisible = false;
            })
        }
    }
}
</script>

<style lang="less" scoped>
.treetable {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}
</style>
