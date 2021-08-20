<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="prometheus">
                <el-select v-model="queryForm.prometheusId" placeholder="请选择">
                    <el-option
                            v-for="item in prometheusQueryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="exporter">
                <el-select v-model="queryForm.exporter" placeholder="请选择" @change="exporterQueryChange">
                    <el-option
                            v-for="item in exporterQueryList"
                            :key="item.exporter"
                            :label="item.exporter"
                            :value="item.exporter">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="告警指标">
                <el-select v-model="queryForm.alertingMetricId" placeholder="请选择">
                    <el-option
                            v-for="item in alertingMetricQueryList"
                            :key="item.id"
                            :label="item.summary"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="指标">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入指标编码、名称"></el-input>
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
                    min-width="130"
                    label="Prometheus">
                <template #default="scope">
                    <div v-for="(item,index) in scope.row.prometheusList" :key="index">
                        <span>{{ item.prometheusName }}</span>
                        <br>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    min-width="130"
                    prop="exporter"
                    label="exporter">
            </el-table-column>
            <el-table-column
                    min-width="130"
                    label="指标">
                <template #default="scope">
                    <span>编码: {{ scope.row.code }}</span>
                    <br>
                    <span>标题: {{ scope.row.summary }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    min-width="200"
                    label="表达式">
                <template #default="scope">
                    <span>{{ scope.row.metric }} {{ scope.row.operator }} {{ scope.row.thresholdValue }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="description"
                    label="告警描述">
            </el-table-column>
            <el-table-column
                    prop="severity"
                    label="告警级别">
                <template #default="scope">
                    <span v-if="scope.row.severity === 'critical'">紧急</span>
                    <span v-else-if="scope.row.severity === 'major'">主要</span>
                    <span v-else-if="scope.row.severity === 'minor'">次要</span>
                    <span v-else-if="scope.row.severity === 'warning'">警告</span>
                    <span v-else>unknown</span>
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
                <el-form-item label="prometheus" prop="prometheusIds">
                    <el-select v-model="dialogForm.prometheusIds" multiple placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in prometheusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="exporter" prop="exporter">
                    <el-select v-model="dialogForm.exporter" placeholder="请选择" style="width: 100%;" @change="exporterChange">
                        <el-option
                                v-for="item in exporterList"
                                :key="item.exporter"
                                :label="item.exporter"
                                :value="item.exporter">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="alertingMetricId" prop="alertingMetricId">
                    <el-select v-model="dialogForm.alertingMetricId" placeholder="请选择" style="width: 100%;" @change="alertingMetricChange">
                        <el-option
                                v-for="item in alertingMetricList"
                                :key="item.id"
                                :label="item.summary"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指标编码">
                    <el-input v-model="dialogForm.code" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="告警指标">
                    <el-input v-model="dialogForm.metric" :disabled="true" style="width: 70%;"></el-input>
                    <el-select v-model="dialogForm.operator" placeholder="请选择计算符" style="width: 15%;">
                        <el-option
                                v-for="item in operatorList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                    <el-input-number v-model="dialogForm.thresholdValue" style="width: 15%;"></el-input-number>
                </el-form-item>
                <el-form-item label="告警标题">
                    <el-input v-model="dialogForm.summary" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="告警描述">
                    <el-input v-model="dialogForm.description" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="告警级别">
                    <el-select v-model="dialogForm.severity" placeholder="请选择告警级别" style="width: 100%;">
                        <el-option
                                v-for="item in severityList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Alerting For">
                    <el-select v-model="dialogForm.alertingFor" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in alertingForList"
                                :key="item"
                                :label="item"
                                :value="item">
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
    import {getAlertingMetricList, getAlertingMetricDetail} from "../../api/alarm/alerting-metric";
    import {getAlertingRulePage, addAlertingRule, editAlertingRule, deleteAlertingRule} from "../../api/alarm/alerting-rule";

    import {getExporterList} from "../../api/monitor/exporter";
    import {getPrometheusList} from "../../api/monitor/prometheus";

    export default {
        name: 'AlertingRule',
        data() {
            return {
                queryForm: {
                    prometheusId: 0,
                    exporter: "全部",
                    alertingMetricId: 0,
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                prometheusList: [],
                prometheusQueryList: [],
                exporterList: [],
                exporterQueryList: [],
                alertingMetricList: [],
                alertingMetricQueryList: [],
                operatorList: ["=",">",">=","<","<=","!="],
                alertingForList: ["1m","2m","3m","4m","5m","6m","7m","8m","9m","10m"],
                severityList: [
                    {key: "critical", value: "紧急"},
                    {key: "major", value: "主要"},
                    {key: "minor", value: "次要"},
                    {key: "warning", value: "警告"},
                ],
                dialogFormRules: {
                    prometheusId: [
                        {required: true, message: '请选择prometheus', trigger: 'blur'},
                    ],
                    exporter: [
                        {required: true, message: '请选择exporter', trigger: 'blur'},
                    ],
                    alertingMetricId: [
                        {required: true, message: '请选择指标', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
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
                    operator: [
                        {required: true, message: '请选择计算符', trigger: 'blur'},
                    ],
                    thresholdValue: [
                        {required: true, message: '请输入告警阈值', trigger: 'blur'},
                    ],
                    severity: [
                        {required: true, message: '请选择告警级别', trigger: 'blur'},
                    ],
                    alertingFor: [
                        {required: true, message: '请选择alerting for', trigger: 'blur'},
                    ]
                },
                dialogTitle: "",
                dialogVisible: false,
            };
        },
        created() {
            this.page()
            this.prometheusList = []
            this.prometheusQueryList = [{id: 0, name: "全部"}]
            getPrometheusList().then(data => {
                this.prometheusList.push(...data)
                this.prometheusQueryList.push(...data)
            });
            this.exporterList = []
            this.exporterQueryList = [{exporter: "全部"}]
            getExporterList().then(data => {
                this.exporterList.push(...data)
                this.exporterQueryList.push(...data)
            });
            this.alertingMetricList = []
            this.alertingMetricQueryList = [{id: 0, summary: "全部"}]
        },
        methods: {
            async page() {
                let queryParams = {...this.queryForm}
                if(this.queryForm.exporter === "全部"){
                    queryParams["exporter"] = ""
                }
                getAlertingRulePage(queryParams).then(data => {
                    this.tableData = data
                });
            },
            exporterQueryChange(val){
                this.queryForm.alertingMetricId = 0
                this.alertingMetricQueryList = [{id: 0, summary: "全部"}]
                let params = {exporter: val}
                getAlertingMetricList(params).then(data => {
                    this.alertingMetricQueryList.push(...data)
                });
            },
            exporterChange(val){
                this.dialogForm.alertingMetricId = null
                this.alertingMetricList = []
                let params = {exporter: val}
                getAlertingMetricList(params).then(data => {
                    this.alertingMetricList.push(...data)
                });
            },
            alertingMetricChange(val){
                let params = {exporter: val}
                getAlertingMetricDetail(val,null).then(data => {
                    this.dialogForm.code = data["code"]
                    this.dialogForm.metric = data["metric"]
                    this.dialogForm.summary = data["summary"]
                    this.dialogForm.description = data["description"]
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
                    prometheusIds: [],
                    exporter: "",
                    alertingMetricId: null,
                    id: 0,
                    code: "",
                    metric: "",
                    summary: "",
                    description: "",
                    operator: null,
                    thresholdValue: "",
                    severity: null,
                    alertingFor: null,
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
                    await deleteAlertingRule(row.id)
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
                            addAlertingRule(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        } else {
                            editAlertingRule(this.dialogForm.id, this.dialogForm).then(data => {
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
