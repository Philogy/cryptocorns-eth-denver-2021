import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'
import router from './router'
import store from './store'

import { capitalize } from './utils/misc'
import WalletIcon from '@/components/icons/WalletIcon'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.filter('capitalize', capitalize)
Vue.filter('fullNumber', num => {
  console.log('num: ', num)
  return typeof num === 'number'
    ? Intl.NumberFormat('en-us', { maximumFractionDigits: 3 }).format(num)
    : num
})

Vue.component('wallet-icon', WalletIcon)

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
