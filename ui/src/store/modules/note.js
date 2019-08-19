import Vue from 'vue'
import config from '../config'

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
        const result = await Vue.axios.post(new URL('/notes', config.api), state.new)

        // store local
        const payload = { ...state.new, name, noteId: result.data }
        console.log('storing local note: ', payload)
        commit('people/addActiveNote', payload, { root: true })

        // reset new
        commit('resetNew')

        resolve(result.data)
      })
    }
  }
}
