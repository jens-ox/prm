import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    new: {
      personId: 0,
      timestamp: 0,
      text: ''
    }
  },
  mutations: {
    setPerson (state, personId) { state.new.personId = personId },
    setText (state, text) { state.new.text = text },
    setTimestamp (state, timestamp) { state.new.timestamp = timestamp },
    resetNew (state) {
      state.new.personId = 0
      state.new.timestamp = 0
      state.new.text = ''
    }
  },
  actions: {
    async store ({ state, commit, rootGetters }) {
      return new Promise(async resolve => {
        console.log('storing note: ', state.new)

        // store remote
        const { data } = await Vue.axios.post('/notes', state.new)

        // store local
        console.log('storing local note: ', data)
        commit('people/addActiveNote', data, { root: true })

        // reset new
        commit('resetNew')

        resolve(data)
      })
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
