<template>
    <div class="container">
        <el-form :inline="true" :model="query" class="demo-form-inline" size="small">
            <el-form-item label="标题">
                <el-input v-model="query.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="handleSearch">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData.data"
                border
                style="width: 100%">
            <el-table-column
                    prop="title"
                    label="名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="地址">
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :total=tableData.total>
        </el-pagination>
    </div>
</template>

<script>
    import { getMenuPage } from "../../api/sysmgr";
export default {
    name: 'Menu',
    data() {
        return {
            query: {
                title: "",
                pageIndex: 1,
                pageSize: 10
            },
            tableData: {},
        };
    },
    created() {
        this.page()
    },
    methods: {
        page(){
            getMenuPage(this.query).then(data => {
                this.tableData = data
            });
        },
        delAllSelection() {

        },
        handleSearch() {
            this.page()
        },
        onSubmit() {
            this.$message.success('提交成功！');
        }
    }
};
</script>