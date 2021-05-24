<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" placeholder="请输入账号或姓名"></el-input>
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
                    prop="userCode"
                    label="账号">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    label="角色"
                    width="180">
                <template #default="scope">
                    <span style="margin-left: 6px" v-for="item in scope.row.roles" :key="item">{{ item }}</span>
                </template>
            </el-table-column>
            <el-table-column
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
                <el-form-item label="账号" prop="userCode">
                    <el-input v-model="dialogForm.userCode"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="userName">
                    <el-input v-model="dialogForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="dialogForm.roles" style="width: 100%;" multiple placeholder="请选择角色">
                        <el-option
                                v-for="item in roleOptions"
                                :key="item.roleCode"
                                :label="item.roleName"
                                :value="item.roleCode">
                        </el-option>
                    </el-select>
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
    import { getUserPage, addUser, editUser, deleteUser, getUserDetail } from "../../api/sysmgr/user";
    import { getRoleList } from "../../api/sysmgr/role";

    export default {
        name: 'User',
        data() {
            return {
                queryForm: {
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                dialogFormRules: {
                    userCode: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    userName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                    ],
                },
                roleOptions: [],
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
        },
        methods: {
            async page() {
                getUserPage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            handleAdd(){
                this.dialogForm = {
                    id: 0,
                    userCode: "",
                    userName: "",
                    roles: [],
                }
                this.dialogVisible = true
                this.dialogTitle = "添加用户"
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "编辑用户"
                getUserDetail(row.id).then(data => {
                    this.dialogForm = data
                });
                this.dialogVisible = true
            },
            openDialog(){
                this.roleOptions = []
                getRoleList().then(data => {
                    this.roleOptions.push(...data)
                });
            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteUser(row.id)
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
                            addUser(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            editUser(this.dialogForm.id, this.dialogForm).then(data => {
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