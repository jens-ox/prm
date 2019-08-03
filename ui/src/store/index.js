import Vue from 'vue'
import Vuex from 'vuex'

import people from './modules/people'
import properties from './modules/properties'
import propertyTypes from './modules/propertyTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { people, properties, propertyTypes }
})
