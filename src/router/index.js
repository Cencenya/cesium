import Vue from 'vue'
import Router from 'vue-router'
import routes from "./routers"

Vue.use(Router)

export const constantRouterMap = [{
        path: '/',
        redirect: "/home",
    },
    {
        path: '/home',
        name: "home",
        component: () =>
            import ('@/views/Home'),
    },
    ...routes
]

export default new Router({
    mode: "history",
    routes: constantRouterMap
})