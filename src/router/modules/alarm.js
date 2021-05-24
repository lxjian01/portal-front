// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/alarm/user",
        name: "/alarm/user",
        meta: {
            parentTitle: '系统管理',
            title: '菜单管理'
        },
        component: () => import ("../../views/alarm/User.vue")
    }
];
