// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/table",
        name: "table",
        meta: {
            title: '表格'
        },
        component: () => import ("../../views/demo/BaseTable.vue")
    }, {
        path: "/form",
        name: "form",
        meta: {
            title: '表单'
        },
        component: () => import ("../../views/demo/BaseForm.vue")
    }, {
        path: "/upload",
        name: "upload",
        meta: {
            title: '上传插件'
        },
        component: () => import ("../../views/demo/Upload.vue")
    },
];
