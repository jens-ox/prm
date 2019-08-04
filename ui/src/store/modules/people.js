import Vue from 'vue'
import config from '../config'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      firstName: '',
      lastName: '',
      properties: [],
      relations: []
    },
    active: {
      firstName: '',
      lastName: '',
      properties: [],
      relations: []
    }
  },
  mutations: {
    // available
    setPeople (state, peopleArray) { state.available = peopleArray },
    addPerson (state, person) { state.available.push(person) },

    // active
    setActive (state, payload) { state.active = payload },
    addActiveProperty (state, property) { state.active.properties.push(property) },

    // new
    setFirstName (state, firstName) { state.new.firstName = firstName },
    setLastName (state, lastName) { state.new.lastName = lastName },
    addProperty (state, property) { state.new.properties.push(property) },
    removeProperty (state, property) {
      const index = state.new.properties.findIndex(existingProperty =>
        existingProperty.value === property.value && existingProperty.propertyTypeId === property.propertyTypeId)
      if (index === -1) return
      state.new.properties.splice(index, 1)
    },
    resetNew (state) {
      state.new.firstName = ''
      state.new.lastName = ''
      state.new.properties = []
    }
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available people')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get(new URL('/people', config.api))
        commit('setPeople', result.data)
        resolve()
      })
    },
    async loadInstance ({ commit }, id) {
      console.log('loading person: ', id)

      return new Promise(async resolve => {
        const result = await Vue.axios.get(new URL(`/people/by-id/${id}`, config.api))
        console.log('result: ', result.data)
        commit('setActive', result.data)
        resolve()
      })
    },
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        console.log('storing person: ', state.new)

        // store remote
        const result = await Vue.axios.post(new URL('/people', config.api), state.new)

        // store local
        commit('addPerson', {
          ...state.new,
          id: result.data
        })

        // reset new
        commit('resetNew')

        resolve(result.data)
      })
    }
  }
}
