import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: Home }
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
