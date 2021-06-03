<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="集群">
                <el-select v-model="queryForm.monitorClusterId" placeholder="请选择">
                    <el-option
                            v-for="item in monitorClusterQueryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
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
                    width="180"
                    label="集群">
                <template #default="scope">
                    <span>名称：{{ scope.row.monitorClusterCode }}</span>
                    <br>
                    <span>编码：{{ scope.row.monitorClusterName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="prometheusUrl"
                    label="prometheus url">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
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
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryForm.pageIndex"
                :page-size="queryForm.pageSize"
                :page-sizes="[10, 20, 30, 40, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
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
                <el-form-item label="prometheus url" prop="prometheusUrl">
                    <el-input v-model="dialogForm.prometheusUrl"></el-input>
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
    import { getPrometheusPage, addPrometheus, editPrometheus, deletePrometheus } from "../../api/monitor/prometheus";
    import {getClusterList} from "../../api/monitor/cluster";

    export default {
        name: 'Prometheus',
        data() {
            return {
                queryForm: {
                    monitorClusterId: 0,
                    keyworkds: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                monitorClusterList:[],
                monitorClusterQueryList: [],
                tableData: {},
                dialogForm: {},
                dialogFormRules: {
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
            this.monitorClusterList = []
            this.monitorClusterQueryList = [{id: 0, name: "全部"}]
            getClusterList().then(data => {
                this.monitorClusterList.push(...data)
                this.monitorClusterQueryList.push(...data)
            });
        },
        methods: {
            async page() {
                getPrometheusPage(this.queryForm).then(data => {
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
            dialogFormReset(){
                this.dialogForm = {
                    id: 0,
                    name: "",
                    prometheusUrl: "",
                    remark: "",
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
                    await deletePrometheus(row.id)
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
                            addPrometheus(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
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