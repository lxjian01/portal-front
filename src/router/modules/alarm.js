// 系统内置页面，正式使用时也不应该被删除
export default [
    {
        path: "/alarm/group",
        name: "/alarm/group",
        meta: {
            parentTitle: '告警配置',
            title: '告警组'
        },
        component: () => import ("../../views/alarm/Group.vue")
    }, {
        path: "/alarm/user",
        name: "/alarm/user",
        meta: {
            parentTitle: '告警配置',
            title: '告警联系人'
        },
        component: () => import ("../../views/alarm/User.vue")
    }, {
        path: "/alarm/recording-rule",
        name: "/alarm/recording-rule",
        meta: {
            parentTitle: '告警配置',
            title: 'Recording Rule'
        },
        component: () => import ("../../views/alarm/RecordingRule.vue")
    }, {
        path: "/alarm/alerting-metric",
        name: "/alarm/alerting-metric",
        meta: {
            parentTitle: '告警配置',
            title: '告警指标'
        },
        component: () => import ("../../views/alarm/AlertingMetric.vue")
    }, {
        path: "/alarm/alerting-rule",
        name: "/alarm/alerting-rule",
        meta: {
            parentTitle: '告警配置',
            title: 'Alerting Rule'
        },
        component: () => import ("../../views/alarm/AlertingRule.vue")
    }, {
        path: "/alarm/notice",
        name: "/alarm/notice",
        meta: {
            parentTitle: '告警配置',
            title: '告警记录'
        },
        component: () => import ("../../views/alarm/Notice.vue")
    }
];
