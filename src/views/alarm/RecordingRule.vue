<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入名称、record、expr"></el-input>
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
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="record"
                    label="编码">
            </el-table-column>
            <el-table-column
                    prop="expr"
                    label="表达式">
            </el-table-column>
            <el-table-column
                    label="Prometheus">
                <template #default="scope">
                    <div v-for="(item,index) in scope.row.prometheusList" :key="index">
                        <span>{{ item.prometheusName }}</span>
                        <br>
                    </div>
                </template>
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
                <el-form-item label="告警组" prop="prometheusIds">
                    <el-select v-model="dialogForm.prometheusIds" multiple placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in prometheusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="record">
                    <el-input v-model="dialogForm.record" :disabled="disableRecord"></el-input>
                </el-form-item>
                <el-form-item label="表达式" prop="expr">
                    <el-input v-model="dialogForm.expr"></el-input>
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
    import {getRecordingRulePage, addRecordingRule, editRecordingRule, deleteRecordingRule} from "../../api/alarm/recording-rule";
    import {getPrometheusList} from "../../api/monitor/prometheus";

    export default {
        name: 'RecordingRule',
        data() {
            return {
                queryForm: {
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                disableRecord: false,
                tableData: {},
                dialogForm: {},
                prometheusList: [],
                dialogFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    record: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                    ],
                    expr: [
                        {required: true, message: '请输入表达式', trigger: 'blur'},
                    ],
                },
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
            this.prometheusList = []
            getPrometheusList().then(data => {
                this.prometheusList.push(...data)
            });
        },
        methods: {
            async page() {
                getRecordingRulePage(this.queryForm).then(data => {
                    console.info(data)
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
                    prometheusIds: [],
                    name: "",
                    record: "",
                    expr: "",
                }
            },
            handleAdd() {
                this.dialogTitle = "Prometheus - 添加"
                this.dialogFormReset()
                this.disableRecord = false
                this.dialogVisible = true
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "Prometheus - 编辑"
                this.dialogFormReset()
                this.disableRecord = true
                this.dialogForm = {...row}
                this.dialogForm.prometheusIds = []
                row.prometheusList.forEach((item) => {
                    this.dialogForm.prometheusIds.push(item.prometheusId)
                });
                this.dialogVisible = true
            },
            openDialog() {

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteRecordingRule(row.id)
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
                            addRecordingRule(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        } else {
                            editRecordingRule(this.dialogForm.id, this.dialogForm).then(data => {
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
