import Vue from 'vue'
import config from '../config'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      firstName: '',
      lastName: '',
      properties: []
    }
  },
  mutations: {
    // people
    setPeople (state, peopleArray) {
      state.available = peopleArray
    },
    addPerson (state, person) {
      state.available.push(person)
    },
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
    async store ({ state }) {
      return new Promise(async resolve => {
        console.log('storing person: ', state.new)
        const result = await Vue.axios.post(new URL('/people', config.api), state.new)
        resolve(result.body)
      })
    }
  }
}
