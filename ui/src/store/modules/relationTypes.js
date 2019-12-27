import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      name: '',
      reverseName: '',
      isBidirectional: false,
      relationCategoryId: 0
    }
  },
  mutations: {
    setRelationTypes (state, relationTypeArray) { state.available = relationTypeArray },
    addRelationType (state, relationType) { state.available.push(relationType) },
    setNewName (state, name) { state.new.name = name },
    setNewReverseName (state, name) { state.new.reverseName = name },
    setNewCategory (state, categoryId) { state.new.relationCategoryId = categoryId },
    setNewBidirectional (state, isBidirectional) { state.new.isBidirectional = isBidirectional },
    resetNew (state) {
      state.new.name = ''
      state.new.reverseName = ''
      state.new.isBidirectional = false
      state.new.relationCategoryId = 0
    }
  },
  getters: {
    getRelation: state => id => state.available.find(available => available.id === id)
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available relation types')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get('/relation-types')
        commit('setRelationTypes', result.data)
        resolve()
      })
    },

    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        console.log('storing relation type: ', state.new)
        const { data } = await Vue.axios.post('/relation-types', state.new)

        // store local
        commit('addRelationType', data)

        // reset new
        commit('resetNew')

        // resolve
        resolve(data)
      })
    }
  }
}
