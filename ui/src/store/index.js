import Vue from 'vue'
import Vuex from 'vuex'

import people from './modules/people'
import properties from './modules/properties'
import propertyTypes from './modules/propertyTypes'
import propertyDataTypes from './modules/propertyDataTypes'
import propertyCategories from './modules/propertyCategories'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { people, properties, propertyTypes, propertyDataTypes, propertyCategories }
})
