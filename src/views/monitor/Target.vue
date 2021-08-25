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
            <el-form-item label="资源">
                <el-select v-model="queryForm.monitorResourceId" placeholder="请选择">
                    <el-option
                            v-for="item in monitorResourceQueryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入名称、目标地址"></el-input>
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
                    label="prometheus">
                <template #default="scope">
                    <span>名称：{{ scope.row.prometheusName }}</span>
                    <br>
                    <span>地址：{{ scope.row.prometheusUrl }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="资源">
                <template #default="scope">
                    <span>名称：{{ scope.row.monitorResourceName }}</span>
                    <br>
                    <span>编码：{{ scope.row.monitorResourceCode }}</span>
                    <br>
                    <span>exporter：{{ scope.row.exporter }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="90"
                    label="告警组">
                <template #default="scope">
                    <div v-for="(item,index) in scope.row.alarmGroupList" :key="index">
                        <span>{{ item.alarmGroupName }}</span>
                        <br>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    width="90"
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    width="160"
                    prop="url"
                    label="目标地址">
            </el-table-column>
            <el-table-column
                    width="60"
                    prop="scrapeInterval"
                    label="频率">
            </el-table-column>
            <el-table-column
                    width="130"
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
                <el-form-item label="prometheus" prop="prometheusId">
                    <el-select v-model="dialogForm.prometheusId" placeholder="请选择">
                        <el-option
                                v-for="item in prometheusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源" prop="monitorResourceId">
                    <el-select v-model="dialogForm.monitorResourceId" placeholder="请选择">
                        <el-option
                                v-for="item in monitorResourceList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="告警组" prop="alarmGroupIds">
                    <el-select v-model="dialogForm.alarmGroupIds" multiple placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in alarmGroupList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialogForm.name"></el-input>
                </el-form-item>
                <el-form-item label="URL" prop="url">
                    <el-input v-model="dialogForm.url"></el-input>
                </el-form-item>
                <el-form-item label="频率" prop="scrapeInterval">
                    <el-select v-model="dialogForm.scrapeInterval" placeholder="请选择">
                        <el-option
                                v-for="item in scrapeIntervalList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="dialogForm.remark"></el-input>
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
    import {getTargetPage, addTarget, editTarget, deleteTarget} from "../../api/monitor/target";
    import {getPrometheusList} from "../../api/monitor/prometheus";
    import {getResourceList} from "../../api/monitor/resource";
    import {getGroupList} from "../../api/alarm/group";

    export default {
        name: 'Target',
        data() {
            return {
                queryForm: {
                    prometheusId: 0,
                    monitorResourceId: 0,
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                scrapeIntervalList: ["30s","1m", "2m", "3m", "4m", "5m"],
                prometheusList: [],
                prometheusQueryList: [],
                monitorResourceList: [],
                monitorResourceQueryList: [],
                alarmGroupList: [],
                dialogFormRules: {
                    prometheusId: [
                        {required: true, message: '请选择prometheus', trigger: 'blur'},
                    ],
                    monitorResourceId: [
                        {required: true, message: '请选择资源', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'},
                    ],
                    scrapeInterval: [
                        {required: true, message: '请选择频率', trigger: 'blur'},
                    ],
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
            this.monitorResourceList = []
            this.monitorResourceQueryList = [{id: 0, name: "全部"}]
            getResourceList().then(data => {
                this.monitorResourceList.push(...data)
                this.monitorResourceQueryList.push(...data)
            });
            this.alarmGroupList = []
            getGroupList().then(data => {
                this.alarmGroupList.push(...data)
            });
        },
        methods: {
            async page() {
                getTargetPage(this.queryForm).then(data => {
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
                    alarmGroupIds: [],
                    prometheusId: null,
                    monitorResourceId: null,
                    name: "",
                    url: "",
                    scrapeInterval: "",
                }
            },
            handleAdd() {
                this.dialogTitle = "监控目标 - 添加"
                this.dialogFormReset()
                this.dialogVisible = true
            },
            handleSearch() {
                this.page()
            },
            async handleEdit(index, row) {
                this.dialogTitle = "监控目标 - 编辑"
                this.dialogFormReset()
                this.dialogForm = {...row}
                this.dialogForm.alarmGroupIds = []
                row.alarmGroupList.forEach((item, index) => {
                    this.dialogForm.alarmGroupIds.push(item.alarmGroupId)
                })
                this.dialogVisible = true
            },
            openDialog() {

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteTarget(row.id)
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
                            addTarget(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        } else {
                            editTarget(this.dialogForm.id, this.dialogForm).then(data => {
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
