<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" placeholder="请输入角色名或角色编码"></el-input>
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
                    prop="roleCode"
                    label="角色编码">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名">
            </el-table-column>
            <el-table-column
                    prop="updateUser"
                    label="编辑人">
            </el-table-column>
            <el-table-column
                    prop="updateTime"
                    label="编辑时间">
            </el-table-column>
            <el-table-column label="操作">
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
                <el-form-item label="角色编码" prop="roleCode">
                    <el-input v-model="dialogForm.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色名" prop="roleName">
                    <el-input v-model="dialogForm.roleName"></el-input>
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
    import { getRolePage, addRole, editRole, deleteRole } from "../../api/sysmgr/role";

    export default {
        name: 'Role',
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
                    roleCode: [
                        {required: true, message: '请输入角色编码', trigger: 'blur'},
                    ],
                    roleName: [
                        {required: true, message: '请输入角色名', trigger: 'blur'},
                    ],
                },
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
        },
        methods: {
            async page() {
                getRolePage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            handleAdd(){
                this.dialogForm = {
                    id: 0,
                    roleCode: "",
                    roleName: "",
                }
                this.dialogVisible = true
                this.dialogTitle = "添加角色"
            },
            handleSearch() {
                this.page()
            },
            handleEdit(index, row) {
                this.dialogTitle = "编辑角色"
                this.dialogForm = row
                this.dialogVisible = true
            },
            openDialog(){

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteRole(row.id)
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
                            addRole(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            editRole(this.dialogForm.id, this.dialogForm).then(data => {
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