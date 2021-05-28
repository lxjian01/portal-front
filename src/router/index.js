import defaultSettings from '../settings'
import {createRouter, createWebHistory} from "vue-router";
import Index from "../views/Index.vue";
import sysmgr from "./modules/sysmgr";
import monitor from "./modules/monitor";
import alarm from "./modules/alarm";
import error from "./modules/error";

const routes = [
    {
        path: "/login",
        name: "/login",
        meta: {
            title: '登录'
        },
        component: () => import ("../views/Login.vue")
    }, {
        path: "/",
        name: "/",
        redirect: '/dashboard',
        component: Index,
        children: [
            ...sysmgr,
            ...monitor,
            ...alarm,
            ...error,
            {
                path: "/dashboard",
                name: "/dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ("../views/Dashboard.vue")
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | ${defaultSettings.title}`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/error/403');
    } else {
        next();
    }
});

export default router;