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
      lastName: '',
      properties: [],
      relations: [],
      notes: [],
      diaries: []
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
    addActiveProperty (state, property) { state.active.properties.push(property) },
    addActiveRelation (state, relation) { state.active.relations.push(relation) },
    addActiveNote (state, note) { state.active.notes.push(note) },

    removeActiveProperty (state, id) { state.active.properties = state.active.properties.filter(property => property.id !== id) },
    removeActiveRelation (state, id) { state.active.relations = state.active.relations.filter(relation => relation.id !== id) },
    removeActiveNote (state, id) { state.active.notes = state.active.notes.filter(note => note.id !== id) },

    // new
    setFirstName (state, firstName) { state.new.firstName = firstName },
    setLastName (state, lastName) { state.new.lastName = lastName },
    resetNew (state) {
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
        commit('resetNew')

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
