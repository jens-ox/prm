import Vue from 'vue'
import config from '../config'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      name: ''
    },
    newInstance: {
      id: 0,
      value: ''
    }
  },
  mutations: {
    setPropertyTypes (state, propertyTypeArray) {
      state.available = propertyTypeArray
    },
    addPropertyType (state, propertyType) {
      state.available.push(propertyType)
    },
    setNewName (state, name) { state.new.name = name }
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
    }
  }
}
