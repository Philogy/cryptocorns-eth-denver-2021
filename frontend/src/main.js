import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

import { capitalize } from './utils/general'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.filter('capitalize', capitalize)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
