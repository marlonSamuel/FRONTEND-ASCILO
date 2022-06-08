import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

// Vue Router
import router from './router'
// Vuex: for services, shared components, etc
import store from './store/index'

import _ from 'lodash'

//use coockies
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// MomentJs for Vue
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'

window.toastr = require('toastr')

Vue.use(VueToastr2)
require('moment/locale/es')
const moment = require('moment')
Vue.use(require('vue-moment'), {
    moment
})

// set default config
VueCookies.config('7d')

store.dispatch('autoLogin')

import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)


Vue.config.productionTip = false
new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')