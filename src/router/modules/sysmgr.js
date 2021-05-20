// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/sysmgr/menu",
        name: "/sysmgr/menu",
        meta: {
            parentTitle: '系统管理',
            title: '菜单管理'
        },
        component: () => import ("../../views/sysmgr/Menu.vue")
    }, {
        path: "/sysmgr/user",
        name: "/sysmgr/user",
        meta: {
            parentTitle: '系统管理',
            title: '用户管理'
        },
        component: () => import ("../../views/sysmgr/User.vue")
    }, {
        path: "/sysmgr/upload",
        name: "/sysmgr/upload",
        meta: {
            parentTitle: '系统管理',
            title: '上传插件'
        },
        component: () => import ("../../views/sysmgr/Upload.vue")
    },
];
