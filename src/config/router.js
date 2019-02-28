import Vue from "vue"
import VueRouter from "vue-router"

import Home from "@/components/home/home"
import AdminPages from "@/components/admin/adminPages"
import ArticlesByCategory from "@/components/article/articlesByCategory"
import ArticleById from "@/components/article/articleById"
import Auth from "@/components/auth/auth"

import {userKey} from "@/global"

Vue.use(VueRouter)

const routes = [{
    name: "home",
    path: "/",
    component: Home
}, {
    name: "adminPages",
    path: "/Admin",
    component: AdminPages,
    meta: {requiresAdmin: true}
}, {
    name: "articleByCategory",
    path: "/categories/:id/articles",
    component: ArticlesByCategory
}, {
    name: "articleById",
    path: "/articles/:id",
    component: ArticleById
}, {
    name: "auth",
    path: "/auth",
    component: Auth
}]

const router = new VueRouter({
    mode: "history",
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)
    if (to.matched.some(record => record.meta.requiresAdmin)){
        const user = JSON.parse(json)
        user && user.admin ? next() : next({path: "/"})
    } else {
        next()
    }
})

export default router