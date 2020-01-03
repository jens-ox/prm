import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    new: {
      value: '',
      firstPersonId: 0,
      secondPersonId: 0,
      relationTypeId: 0
    },
    available: []
  },
  mutations: {
    setValue (state, value) { state.new.value = value },
    setFirst (state, personId) { state.new.firstPersonId = personId },
    setSecond (state, personId) { state.new.secondPersonId = personId },
    setRelationType (state, relationTypeId) { state.new.relationTypeId = relationTypeId },
    resetActive (state) {
      state.new.value = ''
      state.new.firstPersonId = 0
      state.new.secondPersonId = 0
      state.new.relationTypeId = 0
    },
    add (state, relatedTo) {
      // check if exists
      const exists = state.available.some(d => d.id === relatedTo.id)
      if (!exists) state.available.push(relatedTo)
    }
  },
  getters: {
    byId: state => id => state.available.find(relatedTo => relatedTo.id === id),
    byPersonId: state => personId => state.available.filter(d => d.firstPersonId === personId || d.secondPersonId === personId)
  },
  actions: {
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        console.log('storing relation: ', state.new)

        // store remote
        const { data } = await Vue.axios.post('/relations', state.new)

        // store local
        console.log('storing local relation: ', data)
        commit('people/addActiveRelation', data, { root: true })

        // reset new
        commit('resetActive')

        resolve(data)
      })
    },
    async loadForPerson ({ commit }, personId) {
      console.log('getting relations for person: ', personId)
      const { data } = await Vue.axios.get(`relations/by-person/${personId}`)
      data.forEach(relation => commit('add', relation))
    },
    async get ({ commit, getters }, id) {
      console.log('getting relatedTo id: ', id)
      const relatedTo = getters.byId(id)
      if (relatedTo) {
        console.log('found relation in store: ', relatedTo)
        return relatedTo
      }

      // load if unavailable, push to state and return
      const { data } = await Vue.axios.get(`relations/${id}`)
      commit('add', data)
      console.log('loaded relatedTo from backend: ', data)
      return data
    },
    async remove ({ commit }, id) {
      return new Promise(async resolve => {
        const result = await Vue.axios.delete(`relations/${id}`)

        // remove local
        commit('people/removeActiveRelation', id, { root: true })

        resolve(result.data)
      })
    }
  }
}
