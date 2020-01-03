import Vue from 'vue'

const baseState = () => ({
  available: [],
  active: {
    id: 0,
    text: '',
    date: null
  }
})

export default {
  namespaced: true,
  state: baseState(),
  mutations: {
    addAvailable (state, entry) { state.available.push(entry) },
    setAvailable (state, available) { state.available = available },
    setActive (state, { id, text, date }) {
      if (id) state.active.id = id
      if (text) state.active.text = typeof text === 'string' ? JSON.parse(text) : text
      if (date) state.active.date = date
    },
    update (state, { id, text, date }) {
      const index = state.available.findIndex(diary => diary.id === id)
      if (index < 0) return
      state.available[index] = { id, text, date }
    }
  },
  getters: {
    byId: state => id => state.available.find(d => d.id === id),
    byPersonId: state => personId => state.available.filter(d => d.personId === personId)
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
    async loadInstance ({ commit }, id) {
      return new Promise(async resolve => {
        const { data } = await Vue.axios.get(`diary/${id}`)
        console.log('got instance: ', data)
        commit('setActive', data)
        return resolve(data)
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
