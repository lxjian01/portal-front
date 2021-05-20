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
            <template v-for="item in menuList">
                <template v-if="item.children">
                    <el-submenu
                            :index="item.path"
                            :path="item.path"
                            :key="item.path">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu
                                v-if="subItem.children"
                                :index="subItem.path"
                                :path="subItem.path"
                                :key="subItem.path"
                            >
                                <template #title>{{ subItem.title }}</template>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.path"
                                :path="subItem.path"
                                :key="subItem.path"
                            >
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item
                            :index="item.path"
                            :path="item.path"
                            :key="item.path"
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
import { getMenuList } from "../api/sysmgr/menu";
import { getTree } from "../utils/menu";

export default {
    data() {
        return {
            menuList: [{
                icon: "el-icon-lx-home",
                path: "/dashboard",
                title: "系统首页",
            }]
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
    created() {
        this.queryMenuList()
    },
    methods: {
        async queryMenuList(){
            getMenuList().then(data => {
                let treeData = getTree(data,0,null,null)
                this.menuList.push(...treeData)
            });
        },
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
    top: 50px;
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
