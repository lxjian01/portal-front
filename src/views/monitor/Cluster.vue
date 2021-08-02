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
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="code"
        label="编码">
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
      title="集群管理"
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
    import { getClusterPage, addCluster, editCluster, deleteCluster } from "../../api/monitor/cluster";

    export default {
        name: 'Cluster',
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
                getClusterPage(this.queryForm).then(data => {
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
                    code: "",
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
              this.dialogForm = {...row}
                this.dialogVisible = true
            },
            openDialog(){

            },
            async handleDelete(_, row) {
                const fn = async () => {
                    await deleteCluster(row.id)
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
                            addCluster(this.dialogForm).then(data => {
                                this.successFn(data)
                            });
                        }else{
                            editCluster(this.dialogForm.id, this.dialogForm).then(data => {
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
