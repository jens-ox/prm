import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      name: '',
      propertyDataTypeId: 0,
      propertyCategoryId: 0
    }
  },
  mutations: {
    setPropertyTypes (state, propertyTypeArray) { state.available = propertyTypeArray },
    addPropertyType (state, propertyType) { state.available.push(propertyType) },
    setNewName (state, name) { state.new.name = name },
    setNewDataType (state, id) { state.new.propertyDataTypeId = id },
    setNewCategory (state, id) { state.new.propertyCategoryId = id },
    resetActive (state) {
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

        const result = await Vue.axios.get('/property-types')
        commit('setPropertyTypes', result.data)
        resolve()
      })
    },

    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        const { data } = await Vue.axios.post('/property-types', { ...state.new })

        // store local
        commit('addPropertyType', data)

        // reset new
        commit('resetActive')

        // resolve
        resolve(data)
      })
    }
  }
}
