// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/sysmgr/table",
        name: "/sysmgr/table",
        meta: {
            parentTitle: '系统管理',
            title: '表格'
        },
        component: () => import ("../../views/sysmgr/BaseTable.vue")
    }, {
        path: "/sysmgr/menu",
        name: "/sysmgr/menu",
        meta: {
            parentTitle: '系统管理',
            title: '表单'
        },
        component: () => import ("../../views/sysmgr/Menu.vue")
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
