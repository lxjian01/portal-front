<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="activeMenu"
            :default-openeds="openedMenus"
            :collapse="collapse"
            @select="handleSelect"
            @open="handleOpen"
            @close="handleClose"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu
                            :index="item.index"
                            :path="item.path"
                            :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :path="subItem.path"
                                :key="subItem.index"
                            >
                                <template #title>{{ subItem.title }}</template>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :path="subItem.path"
                                :key="subItem.index"
                            >
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item
                            :index="item.index"
                            :path="item.path"
                            :key="item.index"
                    >
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
// import bus from "../common/bus";
export default {
    data() {
        return {
            items: [
                {
                    icon: "el-icon-lx-home",
                    index: "/dashboard",
                    path: "/dashboard",
                    title: "系统首页"
                },
                {
                    icon: "el-icon-lx-calendar",
                    index: "/demo",
                    path: "/demo",
                    title: "表单相关",
                    subs: [
                        {
                            index: "/form",
                            path: "/form",
                            title: "基本表单"
                        },
                        {
                            index: "/upload",
                            path: "/upload",
                            title: "文件上传"
                        },
                        {
                            icon: "el-icon-lx-cascades",
                            index: "/table",
                            path: "/table",
                            title: "基础表格"
                        },
                    ]
                },
                {
                    icon: "el-icon-lx-warn",
                    index: "/error",
                    path: "/error",
                    title: "错误处理",
                    subs: [
                        {
                            index: "/permission",
                            path: "/permission",
                            title: "权限测试"
                        },
                        {
                            index: "/403",
                            path: "/403",
                            title: "403页面"
                        },
                        {
                            index: "/404",
                            path: "/404",
                            title: "404页面"
                        },
                    ]
                }
            ]
        };
    },
    computed: {
        activeMenu(){
            let activeMenu = this.$store.getters.activeMenu
            let path = activeMenu.join('')
            return path
        },
        openedMenus(){
            let openedMenus = this.$store.getters.activeMenu[0]
            return [openedMenus]
        },
        collapse(){
            return this.$store.state.collapse
        }
    },
    methods: {
        handleSelect(index, indexPath) {
            this.$store.commit("setActiveMenu", indexPath);
            let path = indexPath.join('')
            this.$router.push({ path: path })
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
