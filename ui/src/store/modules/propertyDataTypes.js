import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    available: []
  },
  mutations: {
    setPropertyDataTypes (state, propertyDataTypeArray) { state.available = propertyDataTypeArray }
  },
  getters: {
    getDataType: state => id => state.available.find(available => available.id === id)
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available property data types')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get('/property-data-types')
        commit('setPropertyDataTypes', result.data)
        resolve()
      })
    }
  }
}
