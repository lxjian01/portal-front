<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="标题">
                <el-input v-model="queryForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData.data"
                border
                style="width: 100%">
            <el-table-column
                    prop="ptitle"
                    label="父级菜单"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="icon"
                    label="图标">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="sort"
                    label="排序">
            </el-table-column>
            <el-table-column
                    width="90"
                    prop="updateUser"
                    label="编辑人">
            </el-table-column>
            <el-table-column
                    width="160"
                    prop="updateTime"
                    label="编辑时间">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total=tableData.total>
        </el-pagination>
        <el-dialog
                title="提示"
                v-model="dialogVisible"
                @open="openDialog"
                width="60%">
            <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-width="80px" size="medium">
                <el-form-item label="父级菜单" prop="pid">
                    <el-select v-model="dialogForm.pid" placeholder="请选择">
                        <el-option
                                v-for="item in parentMenu"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="dialogForm.title"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="path">
                    <el-input v-model="dialogForm.path"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="dialogForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="dialogForm.sort" :min="1" :max="100"></el-input-number>
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import { getMenuPage, getParentMenuList, addMenu, editMenu, deleteMenu } from "../../api/sysmgr/menu";

    export default {
        name: 'Menu',
        data() {
            return {
                queryForm: {
                    title: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                dialogFormRules: {
                    title: [
                        {required: true, message: '请输入菜单标题', trigger: 'blur'},
                    ],
                    pid: [
                        {required: true, message: '请选择父级菜单', trigger: 'blur'},
                    ],
                    path: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'},
                    ],
                },
                parentMenu: [{
                    "id": 0,
                    "title": "顶级菜单",
                }],
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
        },
        methods: {
            async page() {
                getMenuPage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            handleAdd(){
                this.dialogForm = {
                    id: 0,
                    pid: 0,
                    title: "",
                    path: "",
                    icon: "",
                    sort: "",
                }
                this.dialogVisible = true
                this.dialogTitle = "添加菜单"
            },
            handleSearch() {
                this.page()
            },
            handleEdit(index, row) {
                this.dialogTitle = "编辑菜单"
                this.dialogForm = row
                this.dialogVisible = true
            },
            openDialog(){
                this.parentMenu = []
                getParentMenuList().then(data => {
                    this.parentMenu.push(...data)
                });
            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteMenu(row.id)
                    this.successFn(null)
                }
                this.$delConfirm(fn)
            },
            successFn(data){
                this.page()
                this.$message.success('操作成功')
                this.dialogVisible = false
            },
            onSubmit() {
                this.$refs["dialogForm"].validate((valid) => {
                    if (valid) {
                        if(this.dialogForm.id === 0){
                            addMenu(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            editMenu(this.dialogForm.id, this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    };
</script>