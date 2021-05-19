<template>
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <div class="content">
                <div class="crumbs">
                    <el-breadcrumb separator="/" v-if="parentTitle">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-calendar"></i> {{ parentTitle }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item v-if="parentTitle">
                            {{ title }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-breadcrumb separator="/" v-else>
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-calendar"></i> {{ title }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import vHeader from "../components/Header";
import vSidebar from "../components/Sidebar";
import "../utils/menu";

export default {
    data() {
        return {
            parentTitle: '',
            title: '系统首页',
        }
    },
    components: {
        vHeader,
        vSidebar,
    },
    computed: {
        collapse() {
            return this.$store.state.collapse;
        }
    },
    watch:{
        $route:{
            handler(val){
                this.parentTitle = val.meta.parentTitle
                this.title = val.meta.title
            },
            // 深度观察监听
            deep: true
        }
    },
    methods: {
        init() {

        }
    }
};
</script>
