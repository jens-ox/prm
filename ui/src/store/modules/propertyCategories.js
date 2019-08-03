import Vue from 'vue'
import config from '../config'

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
    resetNew (state) {
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

        const result = await Vue.axios.get(new URL('/property-categories', config.api))
        commit('setPropertyCategories', result.data)
        resolve()
      })
    },
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        console.log('storing property category: ', state.new)
        const result = await Vue.axios.post(new URL('/property-categories', config.api), state.new)

        console.log('new prop category: ', result.data)

        // store local
        commit('addPropertyCategory', {
          ...state.new,
          id: result.data
        })

        // reset new
        commit('resetNew')

        // resolve
        resolve(result.data)
      })
    }
  }
}
