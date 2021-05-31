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
                    prop="name"
                    label="告警组名">
            </el-table-column>
            <el-table-column
                    label="告警组成员"
                    width="180">
                <template #default="scope">
                    <span style="margin-left: 6px" v-for="item in scope.row.users" :key="item">{{ item }}</span>
                </template>
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
            <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-width="100px" size="medium">
                <el-form-item label="告警组名" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="告警组成员">
                    <el-transfer
                            v-model="dialogForm.users"
                            filterable
                            :filter-method="filterMethod"
                            filter-placeholder="请输入联系人姓名"
                            :titles="transferTitles"
                            :data="transferData"/>
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
    import { getGroupPage, addGroup, editGroup, deleteGroup, getGroupDetail } from "../../api/alarm/group";
    import { getUserList } from "../../api/alarm/user";

    export default {
        name: 'Group',
        data() {
            const dialogFormData = _ => {
                const data = [];
                for (let i = 1; i <= 15; i++) {
                    data.push({
                        key: i,
                        label: `备选项 ${ i }`,
                        disabled: i % 4 === 0
                    });
                }
                return data;
            };
            return {
                transferData: [],
                transferTitles: ["联系人","已选联系人"],
                queryForm: {
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: dialogFormData,
                dialogFormRules: {
                    name: [
                        {required: true, message: '请输入告警组名', trigger: 'blur'},
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
                getGroupPage(this.queryForm).then(data => {
                    this.tableData = data
                });
                this.transferData = []
                getUserList().then(data => {
                    data.forEach((user, index) => {
                        this.transferData.push({key: user.id, label: user.userName});
                    });
                });
            },
            dialogFormReset(){
                this.dialogForm = {
                    id: 0,
                    name: "",
                    users: [],
                }
            },
            filterMethod(query, item) {
                return item.label.indexOf(query) > -1;
            },
            handleAdd(){
                this.dialogFormReset()
                this.dialogVisible = true
                this.dialogTitle = "添加角色"
            },
            handleSearch() {
                this.page()
            },
            handleEdit(index, row) {
                this.dialogTitle = "编辑角色"
                this.dialogFormReset()
                getGroupDetail(row.id).then(data => {
                    if(data.users === null){
                        data.users = []
                    }
                    this.dialogForm = data
                });
                this.dialogVisible = true
            },
            openDialog(){

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteGroup(row.id)
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
                            addGroup(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            editGroup(this.dialogForm.id, this.dialogForm).then(data => {
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