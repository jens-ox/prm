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
    addPropertyCategory (state, category) { state.available.push(category) },
    setPropertyCategories (state, propertyCategoryArray) { state.available = propertyCategoryArray },
    setNewName (state, name) { state.new.name = name },
    resetActive (state) {
      state.new.name = ''
    }
  },
  getters: {
    getCategory: state => id => state.available.find(available => available.id === id)
  },
  actions: {
    async loadAvailable ({ state, commit }) {
      console.log('loading available property categories')

      return new Promise(async resolve => {
        // only load if not loaded yet
        if (state.available.length > 0) return resolve()

        const result = await Vue.axios.get('/property-categories')
        commit('setPropertyCategories', result.data)
        resolve()
      })
    }
  }
}
