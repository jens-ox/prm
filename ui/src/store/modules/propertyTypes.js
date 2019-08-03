import Vue from 'vue'
import config from '../config'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      name: '',
      propertyDataTypeId: 0,
      propertyCategoryId: 0
    },
    newInstance: {
      id: 0,
      value: ''
    }
  },
  mutations: {
    setPropertyTypes (state, propertyTypeArray) { state.available = propertyTypeArray },
    addPropertyType (state, propertyType) { state.available.push(propertyType) },
    setNewName (state, name) { state.new.name = name },
    setNewDataType (state, id) { state.new.propertyDataTypeId = id },
    setNewCategory (state, id) { state.new.propertyCategoryId = id },
    resetNew (state) {
      state.new.name = ''
      state.new.propertyDataTypeId = 0
      state.new.propertyCategoryId = 0
    }
  },
  getters: {
    getProperty: state => id => state.available.find(available => available.id === id)
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available property types')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get(new URL('/property-types', config.api))
        commit('setPropertyTypes', result.data)
        resolve()
      })
    },

    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        console.log('storing property type: ', state.new)
        const result = await Vue.axios.post(new URL('/property-types', config.api), state.new)

        // store local
        commit('addPropertyType', {
          ...state.new,
          id: result.body
        })

        // reset new
        commit('resetNew')

        // resolve
        resolve(result.body)
      })
    }
  }
}
