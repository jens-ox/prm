export default {
  namespaced: true,
  state: {
    available: []
  },
  mutations: {
    setPropertyDataTypes (state, propertyDataTypeArray) { state.available = propertyDataTypeArray }
  },
  getters: {
    getDataType: state => id => state.available.find(available => available.id === id)
  }
}
