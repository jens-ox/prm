<template>
  <div>
    <h1 class="header">Add Relation</h1>
    <div class="fields">
      <div class="field">
        <label for="relation-name">Relation Name</label>
        <input type="text" id="relation-name" placeholder="Relation Name" v-model="relationName">
      </div>
      <div class="field dropdown" v-on-clickaway="blurSearchRelationCategory">
        <label for="relation-category">Category</label>
        <input
          type="text"
          id="relation-category"
          placeholder="Relation Category"
          v-model="searchRelationCategory"
          @focus="searchingRelationCategory = true"
        >
        <ul class="dropdown-list" v-if="searchingRelationCategory">
          <!-- available relation categories -->
          <li
            v-for="category in filteredRelationCategories"
            :key="`relationCategory-${category.id}`"
            @click="setRelationCategory(category)"
          >{{ category.name }}</li>

          <!-- note: create relation category -->
          <li v-if="!categoryExists" @click="createNewRelationCategory">
            Create category "{{ searchRelationCategory }}"
          </li>

          <!-- note: no category available yet -->
          <li v-if="availableRelationCategories.length === 0 && searchRelationCategory === ''" class="no-select">
            <span class="italic text-gray-500">no relation category available, yet.</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fields">
      <div class="field">
        <input type="checkbox" v-model="isBidirectional" id="is-bidirectional">
        <label for="is-bidirectional">Bidirectional</label>
      </div>
      <div class="field" :style="{
        visibility: !isBidirectional ? 'visible' : 'hidden'
      }">
        <input
          type="text"
          placeholder="Reverse Name"
          v-model="reverseName"
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
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import { directive as OnClickaway } from 'vue-clickaway'

export default {
  directives: { OnClickaway },
  data: () => ({
    searchingRelationDataType: false,
    searchingRelationCategory: false,
    searchRelationCategory: '',
    relationCategorySearch: {
      search: () => []
    }
  }),
  async beforeMount () {
    // set up categories
    await this.$store.dispatch('relationCategories/loadAvailable')
    this.relationCategorySearch = new Fuse(this.availableRelationCategories, {
      keys: ['name']
    })
  },
  computed: {
    ...mapState('relationCategories', {
      availableRelationCategories: state => state.available
    }),
    ...mapState('relationTypes', {
      newRelation: state => state.new
    }),
    isBidirectional: {
      get () { return this.$store.state.relationTypes.new.isBidirectional },
      set (value) { this.$store.commit('relationTypes/setNewBidirectional', value) }
    },
    relationName: {
      get () { return this.$store.state.relationTypes.new.name },
      set (name) { this.$store.commit('relationTypes/setNewName', name) }
    },
    reverseName: {
      get () { return this.$store.state.relationTypes.new.reverseName },
      set (name) { this.$store.commit('relationTypes/setNewReverseName', name) }
    },
    filteredRelationCategories () {
      return this.searchRelationCategory === ''
        ? this.availableRelationCategories
        : this.relationCategorySearch.search(this.searchRelationCategory)
    },
    categoryExists () {
      if (this.searchRelationCategory === '') return true
      return this.availableRelationCategories.map(relationCategory => relationCategory.name).includes(this.searchingRelationCategory)
    },
    saveable () {
      return this.newRelation.name !== '' &&
        this.newRelation.relationCategory !== 0
    }
  },
  methods: {
    async createNewRelationCategory () {
      console.log('creating new relation category')
      this.searchingRelationCategory = false
      this.$store.commit('relationCategories/setNewName', this.searchRelationCategory)
      const categoryId = await this.$store.dispatch('relationCategories/store')
      console.log('new category id: ', categoryId)

      // set category id
      this.$store.commit('relationTypes/setNewCategory', categoryId)
    },
    blurSearchRelationCategory () {
      this.searchingRelationCategory = false
    },
    setRelationCategory (category) {
      console.log('selecting relation data category: ', category)
      this.$store.commit('relationTypes/setNewCategory', category.id)

      // for the user: fix text
      this.searchRelationCategory = category.name

      // close dropdown
      this.searchingRelationCategory = false
    },
    async storeRelation () {
      if (!this.saveable) return
      await this.$store.dispatch('relationTypes/store')

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
