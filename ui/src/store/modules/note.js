import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    active: {
      id: 0,
      personId: 0,
      timestamp: 0,
      text: ''
    },
    available: []
  },
  mutations: {
    setPerson (state, personId) { state.active.personId = personId },
    setText (state, text) { state.active.text = text },
    setTimestamp (state, timestamp) { state.active.timestamp = timestamp },
    resetActive (state) {
      state.active.id = 0
      state.active.personId = 0
      state.active.timestamp = 0
      state.active.text = ''
    },
    add (state, note) {
      const exists = state.available.find(d => d.id === note.id)
      if (!exists) state.available.push(note)
    }
  },
  getters: {
    byId: state => id => state.available.find(d => d.id === id),
    byPersonId: state => personId => state.available.filter(d => d.personId === personId)
  },
  actions: {
    async store ({ state, commit }) {
      const { id, ...newNote } = state.active
      const { data } = await Vue.axios.post('/notes', newNote)
      commit('add', data)
      commit('resetActive')
      return data
    },
    async get ({ commit, getters }, id) {
      const note = getters.byId(id)
      if (note) return note

      // load if unavailable, push to state and return
      const { data } = await Vue.axios.get(`notes/${id}`)
      commit('add', data)
      return data
    },
    async loadForPerson ({ commit }, personId) {
      const { data } = await Vue.axios.get(`notes/by-person/${personId}`)
      data.forEach(d => commit('add', d))
    },
    async update ({ commit }, note) {
      console.log('updating note: ', note)
      await Vue.axios.put(`notes/${note.id}`, note)

      // update local
      commit('people/updateActiveNote', note, { root: true })
    },
    async remove ({ commit }, id) {
      return new Promise(async resolve => {
        const result = await Vue.axios.delete(`notes/${id}`)

        // remove local
        commit('people/removeActiveNote', id, { root: true })

        resolve(result.data)
      })
    }
  }
}
