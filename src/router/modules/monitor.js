// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/monitor/cluster",
        name: "/monitor/cluster",
        meta: {
            parentTitle: '监控管理',
            title: '集群管理'
        },
        component: () => import ("../../views/monitor/Cluster")
    }
];
