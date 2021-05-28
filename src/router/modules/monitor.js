// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/monitor/cluster",
        name: "/monitor/cluster",
        meta: {
            parentTitle: '监控配置',
            title: '集群管理'
        },
        component: () => import ("../../views/monitor/Cluster")
    }, {
        path: "/monitor/component",
        name: "/monitor/component",
        meta: {
            parentTitle: '监控配置',
            title: '监控组件'
        },
        component: () => import ("../../views/monitor/Component")
    }, {
        path: "/monitor/target",
        name: "/monitor/target",
        meta: {
            parentTitle: '监控配置',
            title: '监控目标'
        },
        component: () => import ("../../views/monitor/Target")
    }
];
