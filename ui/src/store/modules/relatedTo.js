import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    new: {
      value: '',
      firstPersonId: 0,
      secondPersonId: 0,
      relationTypeId: 0
    }
  },
  mutations: {
    setValue (state, value) { state.new.value = value },
    setFirst (state, personId) { state.new.firstPersonId = personId },
    setSecond (state, personId) { state.new.secondPersonId = personId },
    setRelationType (state, relationTypeId) { state.new.relationTypeId = relationTypeId },
    resetNew (state) {
      state.new.value = ''
      state.new.firstPersonId = 0
      state.new.secondPersonId = 0
      state.new.relationTypeId = 0
    }
  },
  actions: {
    async store ({ state, commit, rootGetters }) {
      return new Promise(async resolve => {
        console.log('storing relation: ', state.new)

        // store remote
        const { data } = await Vue.axios.post('/relations', state.new)

        // store local
        console.log('storing local relation: ', data)
        commit('people/addActiveRelation', data, { root: true })

        // reset new
        commit('resetNew')

        resolve(data)
      })
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
