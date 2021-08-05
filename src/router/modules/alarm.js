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
    },
];
