import Vue from 'vue'
import config from '../config'

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
        const result = await Vue.axios.post(new URL('/relations', config.api), state.new)

        // load relation name for local
        const name = rootGetters['relationTypes/getRelation'](state.new.relationTypeId).name

        // store local
        const payload = { ...state.new, name }
        console.log('storing local relation: ', payload)
        commit('people/addActiveRelation', payload, { root: true })

        // reset new
        commit('resetNew')

        resolve(result.data)
      })
    }
  }
}
