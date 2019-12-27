import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from 'vue-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes, faBold, faItalic, faStrikethrough, faUnderline, faCode, faParagraph, faListUl, faListOl, faQuoteLeft, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import store from '@/store'
import './registerServiceWorker'

import './assets/style/main.sass'

// set axios base url
axios.defaults.baseURL = 'http://localhost:3000'

Vue.use(VueAxios, axios)
Vue.use(Notifications)
library.add(faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes, faBold, faItalic, faStrikethrough, faUnderline, faCode, faParagraph, faListUl, faListOl, faQuoteLeft, faUndo, faRedo)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
