import Vue from 'vue'
import Vuex from 'vuex'

import people from './modules/people'

// property stuff
import properties from './modules/properties'
import propertyTypes from './modules/propertyTypes'
import propertyDataTypes from './modules/propertyDataTypes'
import propertyCategories from './modules/propertyCategories'

// relation stuff
import relatedTo from './modules/relatedTo'
import relationTypes from './modules/relationTypes'
import relationCategories from './modules/relationCategories'

// note
import note from './modules/note'

// diary stuff
import diary from './modules/diary'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { people, properties, propertyTypes, propertyDataTypes, propertyCategories, relatedTo, relationTypes, relationCategories, note, diary }
})
