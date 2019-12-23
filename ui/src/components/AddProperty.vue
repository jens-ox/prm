<template>
  <div class="fields">
    <div
      v-on-clickaway="blurSearchPropertyType"
      class="field dropdown"
    >
      <input
        v-model="searchPropertyType"
        type="text"
        placeholder="Property"
        @focus="searchingPropertyType = true"
      >
      <ul
        v-if="searchingPropertyType"
        class="dropdown-list"
      >
        <!-- available property types -->
        <li
          v-for="type in filteredPropertyTypes"
          :key="`propertyType-${type.id}`"
          @click="setPropertyType(type)"
        >
          {{ type.name }} <span class="ml-4 text-xs text-gray-500 italic">{{ type.categoryName }}</span>
        </li>

        <!-- note: no property types exist -->
        <li
          v-if="noPropertyYet"
          class="no-select"
        >
          <span class="italic text-gray-500">no property type available, yet.</span>
        </li>

        <!-- note: create property type -->
        <li
          v-if="!propertyExists"
          @click="createNewPropertyType"
        >
          Create property "{{ searchPropertyType }}"
        </li>
      </ul>
    </div>
    <div class="field flex">
      <input
        v-if="selectedPropertyType.dataType === 'date'"
        v-model="propertyValue"
        type="date"
      >
      <input
        v-else
        v-model="propertyValue"
        type="text"
        placeholder="Value"
      >
      <button
        class="primary ml-4 px-4"
        @click="save"
      >
        <font-awesome-icon icon="save" />
      </button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import { directive as OnClickaway } from 'vue-clickaway'

export default {
  directives: { OnClickaway },
  data: () => ({
    searchingPropertyType: false,
    searchPropertyType: '',
    selectedPropertyType: {
      dataType: ''
    },
    propertyTypeSearch: {
      search: () => []
    }
  }),
  async beforeMount () {
    await this.$store.dispatch('propertyTypes/loadAvailable')
    this.propertyTypeSearch = new Fuse(this.availablePropertyTypes, {
      keys: ['name']
    })
  },
  computed: {
    ...mapState('propertyTypes', {
      availablePropertyTypes: state => state.available
    }),
    propertyValue: {
      get () { return this.$store.state.properties.new.value },
      set (value) { this.$store.commit('properties/setValue', value) }
    },
    filteredPropertyTypes () {
      return this.searchPropertyType === ''
        ? this.availablePropertyTypes
        : this.propertyTypeSearch.search(this.searchPropertyType)
    },
    propertyExists () {
      if (this.searchPropertyType === '') return true
      return this.availablePropertyTypes.map(propertyType => propertyType.name).includes(this.searchPropertyType)
    },
    noPropertyYet () {
      return this.availablePropertyTypes.length === 0 && this.searchPropertyType === ''
    }
  },
  methods: {
    createNewPropertyType () {
      console.log('creating new property type')
      this.searchingPropertyType = false
      this.$store.commit('propertyTypes/setNewName', this.searchPropertyType)
      this.$router.push('/add-property')
    },
    blurSearchPropertyType () {
      this.searchingPropertyType = false
    },
    setPropertyType (type) {
      console.log('selecting prop type: ', type)
      this.$store.commit('properties/setPropertyType', type.id)
      this.selectedPropertyType = type

      // close search
      this.searchingPropertyType = false

      // for the user: fix text
      this.searchPropertyType = type.name
    },
    save () {
      this.searchingPropertyType = false
      this.searchPropertyType = ''
      this.selectedPropertyType.dataType = ''
      this.$emit('add')
    }
  }
}
</script>
