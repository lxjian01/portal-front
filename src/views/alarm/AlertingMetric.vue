<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="exporter">
                <el-select v-model="queryForm.exporter" placeholder="请选择">
                    <el-option
                            v-for="item in exporterQueryList"
                            :key="item.exporter"
                            :label="item.exporter"
                            :value="item.exporter">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指标">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入指标编码、告警标题"></el-input>
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
                    prop="exporter"
                    label="exporter">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="指标编码">
            </el-table-column>
            <el-table-column
                    prop="metric"
                    label="告警指标">
            </el-table-column>
            <el-table-column
                    prop="summary"
                    label="告警标题">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="告警描述">
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
                <el-form-item label="指标编码" prop="code">
                    <el-input v-model="dialogForm.code" placeholder="eg: HostOutOfMemory、HostMemoryUnderMemoryPressure、HostUnusualDiskReadRate"></el-input>
                </el-form-item>
                <el-form-item label="exporter" prop="exporter">
                    <el-select v-model="dialogForm.exporter" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in exporterList"
                                :key="item.exporter"
                                :label="item.exporter"
                                :value="item.exporter">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警指标" prop="metric">
                    <el-input v-model="dialogForm.metric" placeholder="eg: node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100"></el-input>
                </el-form-item>
                <el-form-item label="告警标题" prop="summary">
                    <el-input v-model="dialogForm.summary" placeholder="eg: Host out of memory (instance {{ $labels.instance }})"></el-input>
                </el-form-item>
                <el-form-item label="告警描述" prop="description">
                    <el-input v-model="dialogForm.description" placeholder="eg: Node memory is filling up (< 10% left)\n  VALUE = {{ $value }}\n  LABELS = {{ $labels }}"></el-input>
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
    import {getAlertingMetricPage, addAlertingMetric, editAlertingMetric, deleteAlertingMetric} from "../../api/alarm/alerting-metric";
    import {getExporterList} from "../../api/monitor/exporter";

    export default {
        name: 'AlertingMetric',
        data() {
            return {
                queryForm: {
                    exporter: "",
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                exporterList: [],
                exporterQueryList: [],
                dialogFormRules: {
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                    ],
                    exporter: [
                        {required: true, message: '请输入exporter名称', trigger: 'blur'},
                    ],
                    metric: [
                        {required: true, message: '请输入告警指标', trigger: 'blur'},
                    ],
                    summary: [
                        {required: true, message: '请输入告警标题', trigger: 'blur'},
                    ],
                    description: [
                        {required: true, message: '请输入告警描述', trigger: 'blur'},
                    ],
                },
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
            this.exporterList = []
            this.exporterQueryList = [{exporter: "全部"}]
            getExporterList().then(data => {
                this.exporterList.push(...data)
                this.exporterQueryList.push(...data)
            });
        },
        methods: {
            async page() {
                let queryParams = {...this.queryForm}
                if(this.queryForm.exporter === "全部"){
                    queryParams["exporter"] = ""
                }
                getAlertingMetricPage(queryParams).then(data => {
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
                    exporter: "",
                    metric: "",
                    summary: "",
                    description: "",
                    remark: "",
                }
            },
            handleAdd() {
                this.dialogTitle = "告警指标 - 添加"
                this.dialogFormReset()
                this.dialogVisible = true
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "告警指标 - 编辑"
                this.dialogFormReset()
                this.dialogForm = {...row}
                this.dialogVisible = true
            },
            openDialog() {

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteAlertingMetric(row.id)
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
                            addAlertingMetric(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        } else {
                            editAlertingMetric(this.dialogForm.id, this.dialogForm).then(data => {
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
