<template>
  <div>
    <h1 class="mb-4">
      Add Property
    </h1>
    <div class="max-w-lg">
      <div class="field">
        <label for="property-name">Property Name</label>
        <input
          id="property-name"
          v-model="newPropertyType.name"
          type="text"
          placeholder="Property Name"
          class="w-full"
        >
      </div>
      <div
        v-on-clickaway="blurSearchPropertyDataType"
        class="field dropdown"
      >
        <label for="data-type">Data Type</label>
        <input
          id="data-type"
          v-model="searchPropertyDataType"
          type="text"
          placeholder="Data Type"
          class="w-full"
          @focus="searchingPropertyDataType = true"
        >
        <ul
          v-if="searchingPropertyDataType"
          class="dropdown-list"
        >
          <!-- available property data types -->
          <li
            v-for="dataType in filteredPropertyDataTypes"
            :key="`propertyDataType-${dataType.id}`"
            @click="setPropertyDataType(dataType.id)"
          >
            {{ dataType.name }}
          </li>
        </ul>
      </div>
      <div
        v-on-clickaway="blurSearchPropertyCategory"
        class="field dropdown"
      >
        <label for="property-category">Category</label>
        <input
          id="property-category"
          v-model="searchPropertyCategory"
          type="text"
          placeholder="Property Category"
          class="w-full"
          @focus="searchingPropertyCategory = true"
        >
        <ul
          v-if="searchingPropertyCategory"
          class="dropdown-list"
        >
          <!-- available property data types -->
          <li
            v-for="category in filteredPropertyCategories"
            :key="`propertyCategory-${category.id}`"
            @click="setPropertyCategory(category.id)"
          >
            {{ category.name }}
          </li>

          <!-- note: create property category -->
          <li
            v-if="!categoryExists"
            @click="createNewPropertyCategory"
          >
            Create category "{{ searchPropertyCategory }}"
          </li>
        </ul>
      </div>
    </div>
    <div class="bar-buttons">
      <button
        class="primary large"
        :class="{ disabled: !saveable }"
        @click="storeProperty"
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
  data: () => ({
    personId: 0,
    propertyDataTypes: [],
    propertyCategories: [],
    propertyTypes: [],
    searchingPropertyDataType: false,
    searchingPropertyCategory: false,
    searchPropertyDataType: '',
    searchPropertyCategory: '',
    propertyDataTypeSearch: {
      search: () => []
    },
    propertyCategorySearch: {
      search: () => []
    },
    newPropertyType: {
      name: '',
      propertyCategoryId: 0,
      propertyDataTypeId: 0
    }
  }),
  computed: {
    selectedCategory () { return this.propertyCategories.find(cat => cat.id === this.newPropertyType.propertyCategoryId) },
    selectedDataType () { return this.propertyDataTypes.find(dt => dt.id === this.newPropertyType.propertyDataTypeId) },
    filteredPropertyDataTypes () {
      return this.searchPropertyDataType === ''
        ? this.propertyDataTypes
        : this.propertyDataTypeSearch.search(this.searchPropertyDataType)
    },
    filteredPropertyCategories () {
      return this.searchPropertyCategory === ''
        ? this.propertyCategories
        : this.propertyCategorySearch.search(this.searchPropertyCategory)
    },
    categoryExists () {
      if (this.searchPropertyCategory === '') return true
      return this.propertyCategories.map(propertyCategory => propertyCategory.name).includes(this.searchingPropertyCategory)
    },
    saveable () {
      return this.newPropertyType.name !== '' &&
        this.newPropertyType.propertyDataTypeId !== 0 &&
        this.newPropertyType.propertyCategory !== 0
    }
  },
  async beforeMount () {
    // pre-set name if available
    if (this.$route.query.name) this.newPropertyType.name = this.$route.query.name

    // pre-set person if possible
    if (this.$route.query.personId) this.personId = this.$route.query.personId

    // set up data types
    const { data: dataTypes } = await this.axios.get('property-data-types')
    this.propertyDataTypes = dataTypes
    this.propertyDataTypeSearch = new Fuse(this.propertyDataTypes, {
      keys: ['name']
    })

    // set up categories
    const { data: categories } = await this.axios.get('property-categories')
    this.propertyCategories = categories
    this.propertyCategorySearch = new Fuse(this.propertyCategories, {
      keys: ['name']
    })
  },
  methods: {
    async createNewPropertyCategory () {
      this.searchingPropertyCategory = false

      // add remote
      const { data } = this.axios.post('property-categories', { name: this.searchPropertyCategory })

      // add local
      this.propertyCategories.push(data)

      // set active
      this.newPropertyType.propertyCategoryId = data.id
    },
    blurSearchPropertyDataType () { this.searchingPropertyDataType = false },
    blurSearchPropertyCategory () { this.searchingPropertyCategory = false },

    setPropertyDataType (id) {
      this.searchingPropertyDataType = false
      this.newPropertyType.propertyDataTypeId = id

      // for the user: fix text
      this.searchPropertyDataType = this.selectedDataType.name
    },
    setPropertyCategory (id) {
      this.searchingPropertyCategory = false
      this.newPropertyType.propertyCategoryId = id

      // for the user: fix text
      this.searchPropertyCategory = this.selectedCategory.name
    },
    async storeProperty () {
      if (!this.saveable) return

      // add remote
      await this.axios.post('property-types', this.newPropertyType)

      // return to active if possible
      const id = this.$route.query.personId
      if (id !== 0) {
        this.$router.push(`/person/${id}`)
      } else {
        this.$router.push('/add-person')
      }

      // dispatch notification
      this.$notify({
        type: 'success',
        text: `Added property type ${this.newPropertyType.name}`
      })
    }
  }
}
</script>
