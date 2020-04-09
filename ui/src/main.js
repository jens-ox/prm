import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from 'vue-notification'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes, faBold, faItalic, faStrikethrough, faUnderline, faCode, faParagraph, faListUl, faListOl, faQuoteLeft, faUndo, faRedo, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'

import './assets/style/main.sass'

Vue.use(Notifications)

// set axios base url
axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? '/api' : 'http://localhost:3000'

// axios error handling
axios.interceptors.response.use(
  function (response) { return response },
  function (error) {
    // handle error
    if (error.response) {
      Vue.notify({
        type: 'error',
        text: error.response.data.message
      })
    }
  })

Vue.use(VueAxios, axios)
library.add(faPlus, faSave, faArrowsAltH, faAlignJustify, faTrashAlt, faTimes, faBold, faItalic, faStrikethrough, faUnderline, faCode, faParagraph, faListUl, faListOl, faQuoteLeft, faUndo, faRedo, faSearch)

Vue.config.productionTip = false
Vue.component('font-awesome-icon', FontAwesomeIcon)

// set up notification shortcuts
Vue.prototype.$success = text => Vue.notify({
  type: 'success',
  text
})
Vue.prototype.$error = text => Vue.notify({
  type: 'error',
  text
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
