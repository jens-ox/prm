import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    active: {
      id: 0,
      value: '',
      personId: 0,
      propertyTypeId: 0
    },
    available: []
  },
  mutations: {
    setValue (state, value) { state.active.value = value },
    setPerson (state, personId) { state.active.personId = personId },
    setPropertyType (state, propertyTypeId) { state.active.propertyTypeId = propertyTypeId },
    resetActive (state) {
      state.active.value = ''
      state.active.id = 0
      state.active.personId = 0
      state.active.propertyTypeId = 0
    },
    add (state, property) {
      const exists = state.available.find(d => d.id === property.id)
      if (!exists) state.available.push(property)
    }
  },
  getters: {
    byId: state => id => state.available.find(d => d.id === id),
    byPersonId: state => personId => state.available.filter(d => d.personId === personId)
  },
  actions: {
    async store ({ state, commit }) {
      const { id, ...newProperty } = state.active
      const { data } = await Vue.axios.post('/properties', newProperty)
      commit('add', data)
      commit('resetActive')
      return data
    },
    async get ({ commit, getters }, id) {
      const property = getters.byId(id)
      if (property) return property

      // load if unavailable, push to state and return
      const { data } = await Vue.axios.get(`properties/${id}`)
      commit('add', data)
      return data
    },
    async loadForPerson ({ commit }, personId) {
      const { data } = await Vue.axios.get(`relations/by-person/${personId}`)
      data.forEach(d => commit('add', d))
    },
    async remove ({ commit }, id) {
      const { data } = await Vue.axios.delete(`properties/${id}`)

      // remove local
      commit('people/removeActiveProperty', id, { root: true })

      return data
    }
  }
}
