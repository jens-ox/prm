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

        const result = await Vue.axios.get(new URL('/relation-categories', config.api))
        commit('setRelationCategories', result.data)
        resolve()
      })
    },
    async store ({ state, commit }) {
      return new Promise(async resolve => {
        // store remove
        console.log('storing relation category: ', state.new)
        const result = await Vue.axios.post(new URL('/relation-categories', config.api), state.new)

        console.log('new prop category: ', result.data)

        // store local
        commit('addRelationCategory', {
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
