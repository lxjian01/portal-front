<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入名称、url"></el-input>
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
                    prop="code"
                    label="编码">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
            </el-table-column>
            <el-table-column
                    width="80"
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
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryForm.pageIndex"
                :page-size="queryForm.pageSize"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
        </el-pagination>
        <el-dialog
                :title="this.dialogTitle"
                v-model="dialogVisible"
                @open="openDialog"
                width="60%">
            <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-width="130px" size="medium">
                <el-form-item label="编码" prop="code">
                    <el-input v-model="dialogForm.code"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="url">
                    <el-input v-model="dialogForm.url"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="dialogForm.remark"></el-input>
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
    import {getPrometheusPage, addPrometheus, editPrometheus, deletePrometheus} from "../../api/monitor/prometheus";
    export default {
        name: 'Prometheus',
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
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    url: [
                        {required: true, message: '请输入地址', trigger: 'blur'},
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
                getPrometheusPage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            handleSizeChange(val) {
                this.queryForm.pageSize = val
                this.page()
            },
            handleCurrentChange(val) {
                this.queryForm.pageIndex = val
                this.page()
            },
            dialogFormReset() {
                this.dialogForm = {
                    id: 0,
                    code: "",
                    name: "",
                    url: "",
                    remark: "",
                }
            },
            handleAdd() {
                this.dialogTitle = "Prometheus - 添加"
                this.dialogFormReset()
                this.dialogVisible = true
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "Prometheus - 编辑"
                this.dialogFormReset()
                this.dialogForm = {...row}
                this.dialogVisible = true
            },
            openDialog() {

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deletePrometheus(row.id)
                    this.successFn(null)
                }
                this.$delConfirm(fn)
            },
            successFn(data) {
                this.page()
                this.$message.success('操作成功')
                this.dialogVisible = false
            },
            onSubmit() {
                this.$refs["dialogForm"].validate((valid) => {
                    if (valid) {
                        if (this.dialogForm.id === 0) {
                            addPrometheus(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        } else {
                            editPrometheus(this.dialogForm.id, this.dialogForm).then(data => {
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
