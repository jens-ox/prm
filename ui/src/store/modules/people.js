import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      firstName: '',
      lastName: ''
    },
    active: {
      id: 0,
      firstName: '',
      lastName: ''
    }
  },
  getters: {
    getPerson: state => id => state.available.find(person => person.id === id)
  },
  mutations: {
    // available
    setPeople (state, peopleArray) { state.available = peopleArray },
    addPerson (state, person) { state.available.push(person) },

    // active
    setActive (state, payload) { state.active = payload },

    // new
    setFirstName (state, firstName) { state.new.firstName = firstName },
    setLastName (state, lastName) { state.new.lastName = lastName },
    resetActive (state) {
      state.new.firstName = ''
      state.new.lastName = ''
    }
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available people')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get('/people')
        commit('setPeople', result.data)
        resolve()
      })
    },
    async loadInstance ({ commit }, id) {
      console.log('loading person: ', id)

      return new Promise(async resolve => {
        const result = await Vue.axios.get(`/people/by-id/${id}`)
        console.log('result: ', result.data)
        commit('setActive', {
          ...result.data,
          id
        })
        resolve()
      })
    },
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        console.log('storing person: ', state.new)

        // store remote
        const { data } = await Vue.axios.post('/people', state.new)

        // store local
        commit('addPerson', data)

        // reset new
        commit('resetActive')

        resolve(data)
      })
    },
    async loadPerson ({ getters, actions }, personId) {
      // check if person is available in state
      let person = getters.getPerson(personId)

      // load people if necessary
      if (!person) await actions.loadAvailable()
      person = getters.getPerson(personId)

      // return person -- if undefined, the person doesn't exist
      return person
    }
  }
}
