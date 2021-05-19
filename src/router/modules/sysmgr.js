// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/sysmgr/table",
        name: "/demo/table",
        meta: {
            title: '表格'
        },
        component: () => import ("../../views/sysmgr/BaseTable.vue")
    }, {
        path: "/sysmgr/form",
        name: "/demo/form",
        meta: {
            title: '表单'
        },
        component: () => import ("../../views/sysmgr/BaseForm.vue")
    }, {
        path: "/sysmgr/upload",
        name: "/demo/upload",
        meta: {
            title: '上传插件'
        },
        component: () => import ("../../views/sysmgr/Upload.vue")
    },
];
