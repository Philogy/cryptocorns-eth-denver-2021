import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home'
import Manage from '../views/Manage'
import manageSubRoutes from '../views/Manage/sub-routes'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/manage', component: Manage, children: manageSubRoutes }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, { hash }, savedPosition) => {
    if (hash) return { selector: hash, behavior: 'smooth' }
    return savedPosition || { x: 0, y: 0 }
  }
})

export default router
