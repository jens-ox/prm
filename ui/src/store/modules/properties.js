import Vue from 'vue'
import config from '../config'

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
        const result = await Vue.axios.post(new URL('/properties', config.api), state.new)

        // load property name for local
        const name = rootGetters['propertyTypes/getProperty'](state.new.propertyTypeId).name

        // store local
        const payload = { ...state.new, name, personId: result.data }
        console.log('storing local property: ', payload)
        commit('people/addActiveProperty', payload, { root: true })

        // reset new
        commit('resetNew')

        resolve(result.data)
      })
    },
    async remove ({ commit }, id) {
      return new Promise(async resolve => {
        const result = await Vue.axios.delete(new URL(`properties/${id}`, config.api))

        // remove local
        commit('people/removeActiveProperty', id, { root: true })

        resolve(result.data)
      })
    }
  }
}
