import Vue from 'vue'

const baseState = () => ({
  available: []
})

export default {
  namespaced: true,
  state: baseState(),
  mutations: {
    addAvailable (state, entry) { state.available.push(entry) },
    setAvailable (state, available) { state.available = available }
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available diary entries')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const { data } = await Vue.axios.get('/diary')
        console.log('got diary entries: ', data)
        commit('setAvailable', data)
        resolve()
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
