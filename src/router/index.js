import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home';

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '',
            name: 'home',
            component: home,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/dashboard')
                },
                {
                    path: '/nodes',
                    name: 'nodes',
                    component: () => import('@/views/nodes')
                },
                {
                    path: '/links',
                    name: 'links',
                    component: () => import('@/views/links')
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/users')
                },
                {
                    path: '/alert',
                    name: 'alert',
                    component: () => import('@/views/alert')
                },
            ]
        }
    ]
})
export default router
