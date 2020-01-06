<template>
  <div>
    <h1 class="mb-4">
      Add Relation Type
    </h1>
    <div class="fields">
      <div class="field">
        <label for="relation-name">Relation Name</label>
        <input
          id="relation-name"
          v-model="newRelationType.name"
          type="text"
          placeholder="Relation Name"
        >
      </div>
      <div
        v-on-clickaway="blurSearchRelationCategory"
        class="field dropdown"
      >
        <label for="relation-category">Category</label>
        <input
          id="relation-category"
          v-model="searchRelationCategory"
          type="text"
          placeholder="Relation Category"
          @focus="searchingRelationCategory = true"
        >
        <ul
          v-if="searchingRelationCategory"
          class="dropdown-list"
        >
          <!-- available relation categories -->
          <li
            v-for="category in filteredRelationCategories"
            :key="`relationCategory-${category.id}`"
            @click="setRelationCategory(category)"
          >
            {{ category.name }}
          </li>

          <!-- note: create relation category -->
          <li
            v-if="!categoryExists"
            @click="createNewRelationCategory"
          >
            Create category "{{ searchRelationCategory }}"
          </li>

          <!-- note: no category available yet -->
          <li
            v-if="relationCategories.length === 0 && searchRelationCategory === ''"
            class="no-select"
          >
            <span class="italic text-gray-500">no relation category available, yet.</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fields">
      <div class="field flex flex-row items-center">
        <input
          id="is-bidirectional"
          v-model="newRelationType.isBidirectional"
          type="checkbox"
        >
        <label for="is-bidirectional">Bidirectional</label>
      </div>
      <div
        class="field"
        :style="{
          visibility: !newRelationType.isBidirectional ? 'visible' : 'hidden'
        }"
      >
        <input
          v-model="newRelationType.reverseName"
          type="text"
          placeholder="Reverse Name"
        >
      </div>
    </div>
    <div class="bar-buttons">
      <button
        class="primary large"
        :class="{ disabled: !saveable }"
        @click="storeRelation"
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
    relationCategories: [],
    newRelationType: {
      name: '',
      isBidirectional: false,
      reverseName: '',
      relationCategoryId: 0
    },
    searchingRelationDataType: false,
    searchingRelationCategory: false,
    searchRelationCategory: '',
    relationCategorySearch: {
      search: () => []
    }
  }),
  computed: {
    filteredRelationCategories () {
      return this.searchRelationCategory === ''
        ? this.relationCategories
        : this.relationCategorySearch.search(this.searchRelationCategory)
    },
    categoryExists () {
      if (this.searchRelationCategory === '') return true
      return this.relationCategories.map(relationCategory => relationCategory.name).includes(this.searchingRelationCategory)
    },
    saveable () {
      return this.newRelationType.name !== '' &&
        this.newRelationType.relationCategoryId !== 0
    }
  },
  async beforeMount () {
    // pre-set name if possible
    const { name } = this.$route.query
    if (name) this.newRelationType.name = name

    // set up categories
    const { data: categories } = await this.axios.get('relation-categories')
    this.relationCategories = categories
    this.relationCategorySearch = new Fuse(this.relationCategories, {
      keys: ['name']
    })
  },
  methods: {
    async createNewRelationCategory () {
      this.searchingRelationCategory = false

      // add remote
      const { data } = await this.axios.post('relation-categories', { name: this.searchRelationCategory })

      // add local
      this.relationCategories.push(data)

      // set active
      this.newRelationType.relationCategoryId = data.id
    },
    blurSearchRelationCategory () {
      this.searchingRelationCategory = false
    },
    setRelationCategory (category) {
      this.newRelationType.relationCategoryId = category.id
      this.searchRelationCategory = category.name
      this.searchingRelationCategory = false
    },
    async storeRelation () {
      if (!this.saveable) return

      // add remote
      await this.axios.post('relation-types', this.newRelationType)

      // return to active if possible
      const id = this.$route.query.personId
      if (id !== 0) {
        this.$router.push(`/person/${id}`)
      } else {
        this.$router.push('/add-person')
      }

      // notify user
      this.$success(`Created relation type ${this.newRelationType.name}`)
    }
  }
}
</script>
