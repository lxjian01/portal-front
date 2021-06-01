<template>
  <div class="container">
    <el-form :inline="true" :model="queryForm" class="demo-form-inline" size="medium">
      <el-form-item label="集群" prop="monitorClusterId">
        <el-select v-model="queryForm.monitorClusterId" placeholder="请选择">
          <el-option
            v-for="item in monitorClusterQueryList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件" prop="monitorComponentId">
        <el-select v-model="queryForm.monitorComponentId" placeholder="请选择">
          <el-option
            v-for="item in monitorComponentQueryList"
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
        label="集群">
        <template #default="scope">
          <span>名称：{{ scope.row.monitorClusterCode }}</span>
          <br>
          <span>编码：{{ scope.row.monitorClusterName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="组件">
        <template #default="scope">
          <span>名称：{{ scope.row.monitorComponentName }}</span>
          <br>
          <span>编码：{{ scope.row.monitorComponentCode }}</span>
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
      :total="tableData.total">
    </el-pagination>
    <el-dialog
      title="提示"
      v-model="dialogVisible"
      @open="openDialog"
      width="60%">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogFormRules" label-width="130px" size="medium">
        <el-form-item label="集群" prop="monitorClusterId">
          <el-select v-model="dialogForm.monitorClusterId" placeholder="请选择">
            <el-option
              v-for="item in monitorClusterList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组件" prop="monitorComponentId">
          <el-select v-model="dialogForm.monitorComponentId" placeholder="请选择">
            <el-option
              v-for="item in monitorComponentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警组" prop="alarmGroupIds">
          <el-select v-model="dialogForm.alarmGroupIds" multiple placeholder="请选择">
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
        <el-form-item label="频率" prop="interval">
          <el-select v-model="dialogForm.interval" placeholder="请选择">
            <el-option
              v-for="item in intervalList"
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
    import { getTargetPage, addTarget, editTarget, deleteTarget } from "../../api/monitor/target";
    import { getClusterList } from "../../api/monitor/cluster";
    import { getComponentList } from "../../api/monitor/component";
    import { getGroupList } from "../../api/alarm/group";
    export default {
        name: 'Target',
        data() {
            return {
                queryForm: {
                    monitorClusterId: 0,
                    monitorComponentId: 0,
                    keyworkds: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: {},
                dialogForm: {},
                intervalList: ["5s","30s","1m","2m","3m","4m","5m"],
                monitorClusterList:[],
                monitorClusterQueryList: [],
                monitorComponentList:[],
                monitorComponentQueryList:[],
                alarmGroupList: [],
                dialogFormRules: {
                    monitorClusterId: [
                        {required: true, message: '请选择集群', trigger: 'blur'},
                    ],
                    monitorComponentId: [
                        {required: true, message: '请选择组件', trigger: 'blur'},
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                    url: [
                        {required: true, message: '请输入url', trigger: 'blur'},
                    ],
                    interval: [
                        {required: true, message: '请选择频率', trigger: 'blur'},
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
                this.monitorClusterList = []
                this.monitorClusterQueryList = [{id: 0, name: "全部"}]
                getClusterList().then(data => {
                    this.monitorClusterList.push(...data)
                    this.monitorClusterQueryList.push(...data)
                });
                this.monitorComponentList = []
                this.monitorComponentQueryList = [{id: 0, name: "全部"}]
                getComponentList().then(data => {
                    this.monitorComponentList.push(...data)
                    this.monitorComponentQueryList.push(...data)
                });
                this.alarmGroupList = []
                getGroupList().then(data => {
                    this.alarmGroupList.push(...data)
                });
                getTargetPage(this.queryForm).then(data => {
                    this.tableData = data
                });
            },
            dialogFormReset(){
                this.dialogForm = {
                    id: 0,
                    alarmGroupIds: [],
                    monitorClusterId: null,
                    monitorComponentId: null,
                    name: "",
                    url: "",
                    interval: "",
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
                this.dialogForm.alarmGroupIds = []
                row.alarmGroupList.forEach((item,index) => {
                  this.dialogForm.alarmGroupIds.push(item.alarmGroupId)
                })
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