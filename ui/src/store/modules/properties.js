export default {
  namespaced: true,
  state: {
    new: {
      value: '',
      personId: 0,
      propertyTypeId: 0
    }
  },
  mutations: {
    setValue (state, value) { state.new.value = value },
    setPerson (state, personId) { state.new.personId = personId },
    setPropertyType (state, propertyTypeId) { state.new.propertyTypeId = propertyTypeId },
    reset (state) {
      state.new.value = ''
      state.new.personId = 0
      state.new.propertyTypeId = 0
    }
  },
  actions: {}
}
