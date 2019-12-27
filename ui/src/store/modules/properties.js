import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    new: {
      value: '',
      personId: 0,
      propertyTypeId: 0
    }
  },
  mutations: {
    setValue (state, value) { state.new.value = value },
    setPerson (state, personId) { state.new.personId = personId },
    setPropertyType (state, propertyTypeId) { state.new.propertyTypeId = propertyTypeId },
    resetNew (state) {
      state.new.value = ''
      state.new.personId = 0
      state.new.propertyTypeId = 0
    }
  },
  actions: {
    async store ({ state, commit, rootGetters }) {
      return new Promise(async resolve => {
        console.log('storing property: ', state.new)

        // store remote
        const { data } = await Vue.axios.post('/properties', state.new)

        // store local
        console.log('storing local property: ', data)
        commit('people/addActiveProperty', data, { root: true })

        // reset new
        commit('resetNew')

        resolve(data)
      })
    },
    async remove ({ commit }, id) {
      return new Promise(async resolve => {
        const result = await Vue.axios.delete(`properties/${id}`)

        // remove local
        commit('people/removeActiveProperty', id, { root: true })

        resolve(result.data)
      })
    }
  }
}
