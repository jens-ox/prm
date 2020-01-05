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
        :class="{
          disabled: newProperty.propertyTypeId === 0
        }"
        @click="save"
      >
        {{ newProperty.id ? 'Update' : 'Save' }}
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
      default: null
    },
    property: {
      type: Object,
      default: null
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
    const { data } = await this.axios.get('components/add-property/property-types')
    this.propertyTypes = data
    this.propertyTypeSearch = new Fuse(this.propertyTypes, {
      keys: ['name']
    })

    // pre-set property if updating -- else, only set personId
    if (this.property) {
      this.newProperty = this.property
      this.searchPropertyType = this.selectedPropertyType.name
    } else this.newProperty.personId = this.personId
  },
  methods: {
    setPropertyType (type) {
      this.newProperty.propertyTypeId = type.id
      this.searchPropertyType = type.name
      this.searchingPropertyType = false
    },
    createNewPropertyType () {
      this.$router.push(`/add-property?name=${this.searchPropertyType}&personId=${this.personId}`)
    },
    blurSearchPropertyType () {
      this.searchingPropertyType = false
    },
    async save () {
      // check if updating
      if (this.newProperty.id) {
        await this.axios.put(`properties/${this.newProperty.id}`, this.newProperty)

        // emit to update local
        this.$emit('update', this.newProperty)

        // notify user
        this.$success(`Updated property ${this.selectedPropertyType.name}`)
      } else {
        // add remote
        const { data } = await this.axios.post(`properties`, this.newProperty)

        // emit to add local
        this.$emit('add', data.id)

        // notify user
        this.$success(`Added property ${this.selectedPropertyType.name}`)
      }
    }
  }
}
</script>
