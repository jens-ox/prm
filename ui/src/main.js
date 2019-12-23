import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './registerServiceWorker'

import './assets/style/main.sass'

Vue.use(VueAxios, axios)
library.add(faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

// register API globally
Vue.prototype.$api = 'http://localhost:3000'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
