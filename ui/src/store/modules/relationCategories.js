import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    available: [],
    new: {
      name: ''
    }
  },
  mutations: {
    addRelationCategory (state, category) { state.available.push(category) },
    setRelationCategories (state, relationCategoryArray) { state.available = relationCategoryArray },
    setNewName (state, name) { state.new.name = name },
    resetNew (state) {
      state.new.name = ''
    }
  },
  getters: {
    getCategory: state => id => state.available.find(available => available.id === id)
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available relation categories')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get('/relation-categories')
        commit('setRelationCategories', result.data)
        resolve()
      })
    },
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        console.log('storing relation category: ', state.new)
        const { data } = await Vue.axios.post('/relation-categories', state.new)

        console.log('new prop category: ', data)

        // store local
        commit('addRelationCategory', data)

        // reset new
        commit('resetNew')

        // resolve
        resolve(data)
      })
    }
  }
}
