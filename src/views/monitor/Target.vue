<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keyworkds" style="width: 300px;" placeholder="请输入编码、名称、prometheus url"></el-input>
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
                    label="集群">
                <template #default="scope">
                    <span>编码：{{ scope.row.monitorClusterName}}</span>
                    <br>
                    <span>名称：{{ scope.row.monitorClusterCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="组件">
                <template #default="scope">
                    <span>编码：{{ scope.row.monitorComponentName}}</span>
                    <br>
                    <span>名称：{{ scope.row.monitorComponentCode}}</span>
                    <br>
                    <span>exporter：{{ scope.row.exporter}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="目标地址">
            </el-table-column>
            <el-table-column
                    prop="interval"
                    label="频率">
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
            <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-width="130px" size="medium">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input v-model="dialogForm.code"></el-input>
                </el-form-item>
                <el-form-item label="prometheus url" prop="prometheusUrl">
                    <el-input v-model="dialogForm.prometheusUrl"></el-input>
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
    import { getTargetPage, addTarget, deleteTarget } from "../../api/monitor/target";

    export default {
        name: 'Target',
        data() {
            return {
                queryForm: {
                    keyworkds: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                dialogFormRules: {
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    prometheusUrl: [
                        {required: true, message: '请输入prometheus url', trigger: 'blur'},
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
                getTargetPage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            dialogFormReset(){
                this.dialogForm = {
                    id: 0,
                    code: "",
                    name: "",
                    prometheusUrl: "",
                }
            },
            handleAdd(){
                this.dialogFormReset()
                this.dialogVisible = true
                this.dialogTitle = "添加集群"
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "编辑集群"
                this.dialogForm = row
                this.dialogVisible = true
            },
            openDialog(){

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteTarget(row.id)
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
                            addTarget(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            this.successFn(data)
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