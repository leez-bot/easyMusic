import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/index/index_new')
    },
]

const router = new VueRouter({
    routes,
    // mode: 'history'
})

export default router