<template>
    <div class="container">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
            <el-form-item label="prometheus">
                <el-select v-model="queryForm.prometheusCode" placeholder="请选择" style="width: 130px;">
                    <el-option
                            v-for="item in prometheusQueryList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="告警级别">
                <el-select v-model="queryForm.severity" placeholder="请选择" style="width: 130px;">
                    <el-option
                            v-for="item in severityList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="告警状态">
                <el-select v-model="queryForm.status" placeholder="请选择" style="width: 130px;">
                    <el-option
                            v-for="item in statusList"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="queryForm.keywords" style="width: 300px;" placeholder="请输入名称、目标地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData.data"
                border
                style="width: 100%">
            <el-table-column
                    width="130"
                    label="prometheus">
                <template #default="scope">
                    <span>名称：{{ scope.row.prometheusName }}</span>
                    <br>
                    <span>编码：{{ scope.row.prometheusCode }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="alertName"
                    label="告警名称">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="instance"
                    label="目标">
            </el-table-column>
            <el-table-column
                    width="90"
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
                    min-width="130"
                    prop="summary"
                    label="概要">
            </el-table-column>
            <el-table-column
                    min-width="230"
                    prop="description"
                    label="详情">
            </el-table-column>
            <el-table-column
                    width="90"
                    prop="status"
                    label="告警状态">
                <template #default="scope">
                    <span v-if="scope.row.status === 'firing'">未解决</span>
                    <span v-else-if="scope.row.status === 'resolved'">已解决</span>
                    <span v-else>unknown</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="220"
                    label="标签">
                <template #default="scope">
                    <div v-for = "(value,key) in scope.row.labels" :key="key">{{ key }}： {{ value }}</div>
                </template>
            </el-table-column>
            <el-table-column
                    width="160"
                    prop="startAt"
                    label="开始时间">
            </el-table-column>
            <el-table-column
                    width="160"
                    prop="endAt"
                    label="结束时间">
            </el-table-column>
            <el-table-column
                    width="90"
                    prop="alarmNumber"
                    label="告警次数">
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
    </div>
</template>

<script>
    import {getAlarmNoticePage} from "../../api/alarm/notice";
    import {getPrometheusList} from "../../api/monitor/prometheus";

    export default {
        name: 'Notice',
        data() {
            return {
                queryForm: {
                    prometheusCode: "",
                    severity: "",
                    srarus: "",
                    keywords: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                severityList: [
                    {code: "", name: "全部"},
                    {code: "critical", name: "紧急"},
                    {code: "major", name: "主要"},
                    {code: "minor", name: "次要"},
                    {code: "warning", name: "警告"}
                    ],
                statusList: [
                    {code: "", name: "全部"},
                    {code: "firing", name: "未解决"},
                    {code: "resolved", name: "已解决"}
                ],
                intervalList: ["5s", "30s", "1m", "2m", "3m", "4m", "5m"],
                prometheusQueryList: [],
            };
        },
        created() {
            this.page()
            this.prometheusQueryList = [{code: "", name: "全部"}]
            getPrometheusList().then(data => {
                this.prometheusQueryList.push(...data)
            });
        },
        methods: {
            async page() {
                getAlarmNoticePage(this.queryForm).then(data => {
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
            handleSearch() {
                this.page()
            },
        }
    };
</script>
