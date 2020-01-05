export default {
  namespaced: true,
  state: {
    active: {
      id: 0,
      value: '',
      personId: 0,
      propertyTypeId: 0
    },
    available: []
  },
  mutations: {
    setValue (state, value) { state.active.value = value },
    setPerson (state, personId) { state.active.personId = personId },
    setPropertyType (state, propertyTypeId) { state.active.propertyTypeId = propertyTypeId },
    resetActive (state) {
      state.active.value = ''
      state.active.id = 0
      state.active.personId = 0
      state.active.propertyTypeId = 0
    },
    add (state, property) {
      const exists = state.available.find(d => d.id === property.id)
      if (!exists) state.available.push(property)
    }
  },
  getters: {
    byId: state => id => state.available.find(d => d.id === id),
    byPersonId: state => personId => state.available.filter(d => d.personId === personId)
  }
}
