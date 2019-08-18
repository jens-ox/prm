<template>
  <div v-if="availablePeopleWithoutFocused.length > 0">
    <div class="fields">

      <!-- relation type -->
      <div class="field dropdown" v-on-clickaway="blurRelationType">
        <input
          type="text"
          placeholder="Relation"
          v-model="searchRelationType"
          @focus="searchingRelationType = true"
        >
        <ul class="dropdown-list" v-if="searchingRelationType">
          <!-- available relation types -->
          <li
            v-for="type in filteredRelationTypes"
            :key="`relationType-${type.id}`"
            @click="setRelationType(type)"
          >{{ type.name }} <span class="ml-4 text-xs text-gray-500 italic">{{ type.categoryName }}</span></li>

          <!-- note: no relation types exist -->
          <li v-if="noRelationYet" class="no-select">
            <span class="italic text-gray-500">no relation type available, yet.</span>
          </li>

          <!-- note: create relation type -->
          <li v-if="!relationExists" @click="createNewRelationType">
            Create relation "{{ searchRelationType }}"
          </li>
        </ul>
      </div>

      <!-- second person -->
      <div class="field dropdown" v-on-clickaway="blurPerson">
        <input
          type="text"
          placeholder="Second Person"
          v-model="searchPersonName"
          @focus="searchingPersonName = true"
        >
        <ul class="dropdown-list" v-if="searchingPersonName">
          <!-- available relation types -->
          <li
            v-for="person in filteredPeople"
            :key="person.id"
            @click="setPerson(person)"
          >{{ person.lastName }}, {{ person.firstName }}</li>

          <!-- note: no relation types exist -->
          <li v-if="noOtherPersonYet" class="no-select">
            <span class="italic text-gray-500">no other people available, yet.</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fields">
      <!-- extra info + save -->
      <div class="field flex">
        <input
          type="text"
          placeholder="Additional Info"
          v-model="additionalInfo"
        >
        <button class="primary ml-4" @click="save">
          <font-awesome-icon icon="save" />
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="italic text-sm">At least one existing person is necessary to create a relation.</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'
import { directive as OnClickaway } from 'vue-clickaway'

export default {
  directives: { OnClickaway },
  data: () => ({
    searchPersonName: '',
    searchingRelationType: false,
    searchingPersonName: false,
    searchRelationType: '',
    selectedRelationType: {},
    relationTypeSearch: {
      search: () => []
    },
    peopleSearch: {
      search: () => []
    }
  }),
  async beforeMount () {
    await this.$store.dispatch('relationTypes/loadAvailable')
    await this.$store.dispatch('people/loadAvailable')
    this.relationTypeSearch = new Fuse(this.availableRelationTypes, {
      keys: ['name']
    })
    this.peopleSearch = new Fuse(this.availablePeopleWithoutFocused, {
      keys: ['firstName', 'lastName']
    })
  },
  computed: {
    ...mapState('relationTypes', {
      availableRelationTypes: state => state.available
    }),
    ...mapState('people', {
      availablePeople: state => state.available
    }),
    availablePeopleWithoutFocused  () {
      const focused = this.$store.state.people.active.id
      return this.availablePeople.filter(person => person.id !== focused)
    },
    additionalInfo: {
      get () { return this.$store.state.relatedTo.value },
      set (value) { this.$store.commit('relatedTo/setValue', value) }
    },
    filteredPeople () {
      return this.searchPersonName === ''
        ? this.availablePeopleWithoutFocused
        : this.peopleSearch.search(this.searchPersonName)
    },
    filteredRelationTypes () {
      return this.searchRelationType === ''
        ? this.availableRelationTypes
        : this.relationTypeSearch.search(this.searchRelationType)
    },
    relationExists () {
      if (this.searchRelationType === '') return true
      return this.availableRelationTypes.map(relationType => relationType.name).includes(this.searchRelationType)
    },
    noRelationYet () {
      return this.availableRelationTypes.length === 0 && this.searchRelationType === ''
    },
    noOtherPersonYet () {
      return this.availablePeopleWithoutFocused.length === 0 && this.searchPersonName === ''
    }
  },
  methods: {
    setPerson (person) {
      console.log('setting second person ', person)
      this.$store.commit('relatedTo/setSecond', person.id)

      // for the user: fix text
      this.searchPersonName = `${person.lastName}, ${person.firstName}`

      // close search
      this.searchingPersonName = false
    },
    createNewRelationType () {
      console.log('creating new relation type')
      this.searchingRelationType = false
      this.$store.commit('relationTypes/setNewName', this.searchRelationType)
      this.$router.push('/add-relation')
    },
    blurRelationType () {
      console.log('blurring relation type search')
      this.searchingRelationType = false
    },
    blurPerson () {
      console.log('blurring person search')
      this.searchingPersonName = false
    },
    setRelationType (type) {
      console.log('selecting relation type: ', type)
      this.$store.commit('relatedTo/setRelationType', type.id)
      this.selectedRelationType = type

      // close search
      this.searchingRelationType = false

      // for the user: fix text
      this.searchRelationType = type.name
    },
    save () {
      this.searchingRelationType = false
      this.searchRelationType = ''
      this.$emit('add')
    }
  }
}
</script>
