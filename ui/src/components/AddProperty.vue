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
        v-if="selectedPropertyType && selectedPropertyType.dataType === 'date'"
        v-model="newProperty.value"
        type="date"
      >
      <input
        v-else
        v-model="newProperty.value"
        type="text"
        placeholder="Value"
      >
      <button
        class="primary large ml-4"
        @click="save"
      >
        Save
      </button>
    </div>
  </div>
</template>
<script>
import Fuse from 'fuse.js'
import { directive as OnClickaway } from 'vue-clickaway'

export default {
  directives: { OnClickaway },
  props: {
    personId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    propertyTypes: [],
    searchingPropertyType: false,
    searchPropertyType: '',
    newProperty: {
      value: '',
      personId: 0,
      propertyTypeId: 0
    },
    propertyTypeSearch: {
      search: () => []
    }
  }),
  computed: {
    selectedPropertyType () {
      return this.propertyTypes.find(pType => pType.id === this.newProperty.propertyTypeId)
    },
    filteredPropertyTypes () {
      return this.searchPropertyType === ''
        ? this.propertyTypes
        : this.propertyTypeSearch.search(this.searchPropertyType)
    },
    propertyExists () {
      if (this.searchPropertyType === '') return true
      return this.propertyTypes.map(propertyType => propertyType.name).includes(this.searchPropertyType)
    },
    noPropertyYet () {
      return this.propertyTypes.length === 0 && this.searchPropertyType === ''
    }
  },
  async beforeMount () {
    const { data } = await this.axios.get('/components/add-property/property-types')
    this.propertyTypes = data
    this.propertyTypeSearch = new Fuse(this.propertyTypes, {
      keys: ['name']
    })
    this.newProperty.personId = this.personId
  },
  methods: {
    setPropertyType (type) {
      // select property type
      this.newProperty.propertyTypeId = type.id

      // set search text for user to property type
      this.searchPropertyType = type.name

      // close search
      this.searchingPropertyType = false
    },
    createNewPropertyType () {
      console.log('creating new property type')
      this.searchingPropertyType = false
      this.$router.push(`/add-property?name=${this.searchPropertyType}`)
    },
    blurSearchPropertyType () {
      this.searchingPropertyType = false
    },
    async save () {
      // close search
      this.searchingPropertyType = false
      this.searchPropertyType = ''

      // add remote
      const { data } = await this.axios.post(`properties`, this.newProperty)

      // emit to add local
      this.$emit('add', data.id)

      // notify user
      this.$notify({
        type: 'success',
        text: `Added property ${this.selectedPropertyType.name}`
      })
    }
  }
}
</script>
