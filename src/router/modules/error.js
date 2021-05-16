// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/error/permission",
        name: "/error/permission",
        meta: {
            title: '权限管理',
            permission: true
        },
        component: () => import ("../../views/Permission.vue")
    }, {
        path: '/error/403',
        name: '/error/403',
        meta: {
            title: '没有权限'
        },
        component: () => import ("../../views/403.vue")
    }, {
        path: '/error/404',
        name: '/error/404',
        meta: {
            title: '找不到页面'
        },
        component: () => import ("../../views/404.vue")
    }
];
