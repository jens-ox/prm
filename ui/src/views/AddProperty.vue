<template>
  <div>
    <h1 class="header">
      Add Property
    </h1>
    <div class="fields">
      <div class="field">
        <label for="property-name">Property Name</label>
        <input
          id="property-name"
          v-model="propertyName"
          type="text"
          placeholder="Property Name"
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
            @click="setPropertyDataType(dataType)"
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
            @click="setPropertyCategory(category)"
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
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import { directive as OnClickaway } from 'vue-clickaway'

export default {
  directives: { OnClickaway },
  data: () => ({
    searchingPropertyDataType: false,
    searchingPropertyCategory: false,
    searchPropertyDataType: '',
    searchPropertyCategory: '',
    propertyDataTypeSearch: {
      search: () => []
    },
    propertyCategorySearch: {
      search: () => []
    }
  }),
  computed: {
    ...mapState('propertyDataTypes', {
      availablePropertyDataTypes: state => state.available
    }),
    ...mapState('propertyCategories', {
      availablePropertyCategories: state => state.available
    }),
    ...mapState('propertyTypes', {
      newProperty: state => state.new
    }),
    propertyName: {
      get () { return this.$store.state.propertyTypes.new.name },
      set (name) { this.$store.commit('propertyTypes/setNewName', name) }
    },
    filteredPropertyDataTypes () {
      return this.searchPropertyDataType === ''
        ? this.availablePropertyDataTypes
        : this.propertyDataTypeSearch.search(this.searchPropertyDataType)
    },
    filteredPropertyCategories () {
      return this.searchPropertyCategory === ''
        ? this.availablePropertyCategories
        : this.propertyCategorySearch.search(this.searchPropertyCategory)
    },
    categoryExists () {
      if (this.searchPropertyCategory === '') return true
      return this.availablePropertyCategories.map(propertyCategory => propertyCategory.name).includes(this.searchingPropertyCategory)
    },
    saveable () {
      return this.newProperty.name !== '' &&
        this.newProperty.propertyDataTypeId !== 0 &&
        this.newProperty.propertyCategory !== 0
    }
  },
  async beforeMount () {
    // set up data types
    await this.$store.dispatch('propertyDataTypes/loadAvailable')
    this.propertyDataTypeSearch = new Fuse(this.availablePropertyDataTypes, {
      keys: ['name']
    })

    // set up categories
    await this.$store.dispatch('propertyCategories/loadAvailable')
    this.propertyCategorySearch = new Fuse(this.availablePropertyCategories, {
      keys: ['name']
    })
  },
  methods: {
    async createNewPropertyCategory () {
      console.log('creating new property category')
      this.searchingPropertyCategory = false
      this.$store.commit('propertyCategories/setNewName', this.searchPropertyCategory)
      const categoryId = await this.$store.dispatch('propertyCategories/store')
      console.log('new category id: ', categoryId)

      // set category id
      this.$store.commit('propertyTypes/setNewCategory', categoryId)
    },
    blurSearchPropertyDataType () {
      this.searchingPropertyDataType = false
    },
    blurSearchPropertyCategory () {
      this.searchingPropertyCategory = false
    },
    setPropertyDataType (dataType) {
      console.log('selecting prop data type: ', dataType)
      this.$store.commit('propertyTypes/setNewDataType', dataType.id)

      // close search
      this.searchingPropertyDataType = false

      // for the user: fix text
      this.searchPropertyDataType = dataType.name
    },
    setPropertyCategory (category) {
      console.log('selecting prop data category: ', category)
      this.$store.commit('propertyTypes/setNewCategory', category.id)

      // close search
      this.searchingPropertyCategory = false

      // for the user: fix text
      this.searchPropertyCategory = category.name
    },
    async storeProperty () {
      if (!this.saveable) return
      await this.$store.dispatch('propertyTypes/store')

      // return to active if possible
      const id = this.$store.state.people.active.id
      if (id !== 0) {
        this.$router.push(`/person/${id}`)
      } else {
        this.$router.push('/add-person')
      }
    }
  }
}
</script>
