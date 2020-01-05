<template>
  <div v-if="people.length > 0">
    <div class="fields">
      <!-- relation type -->
      <div
        v-on-clickaway="blurRelationType"
        class="field dropdown"
      >
        <input
          v-model="searchRelationType"
          type="text"
          placeholder="Relation"
          @focus="searchingRelationType = true"
        >
        <ul
          v-if="searchingRelationType"
          class="dropdown-list"
        >
          <!-- available relation types -->
          <li
            v-for="type in filteredRelationTypes"
            :key="`relationType-${type.id}`"
            @click="setRelationType(type)"
          >
            {{ type.name }} <span class="ml-4 text-xs text-gray-500 italic">{{ type.categoryName }}</span>
          </li>

          <!-- note: no relation types exist -->
          <li
            v-if="noRelationYet"
            class="no-select"
          >
            <span class="italic text-gray-500">no relation type available, yet.</span>
          </li>

          <!-- note: create relation type -->
          <li
            v-if="!relationExists"
            @click="createNewRelationType"
          >
            Create relation "{{ searchRelationType }}"
          </li>
        </ul>
      </div>

      <!-- second person -->
      <div
        v-on-clickaway="blurPerson"
        class="field dropdown"
      >
        <input
          v-model="searchPersonName"
          type="text"
          placeholder="Second Person"
          @focus="searchingPersonName = true"
        >
        <ul
          v-if="searchingPersonName"
          class="dropdown-list"
        >
          <!-- available relation types -->
          <li
            v-for="person in filteredPeople"
            :key="person.id"
            @click="setPerson(person)"
          >
            {{ person.lastName }}, {{ person.firstName }}
          </li>

          <!-- note: no relation types exist -->
          <li
            v-if="noOtherPersonYet"
            class="no-select"
          >
            <span class="italic text-gray-500">no other people available, yet.</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="fields">
      <!-- extra info + save -->
      <div class="field flex">
        <input
          v-model="newRelation.value"
          type="text"
          placeholder="Additional Info"
        >
        <button
          class="primary large ml-4"
          :class="{
            disabled: newRelation.relationTypeId === 0 || newRelation.secondPersonId === 0
          }"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="italic text-sm">
      At least one existing person is necessary to create a relation.
    </p>
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
    newRelation: {
      firstPersonId: 0,
      secondPersonId: 0,
      value: '',
      relationTypeId: 0
    },
    relationTypes: [],
    people: [],
    searchPersonName: '',
    searchingRelationType: false,
    searchingPersonName: false,
    searchRelationType: '',
    relationTypeSearch: {
      search: () => []
    },
    peopleSearch: {
      search: () => []
    }
  }),
  computed: {
    selectedRelationType () {
      return this.relationTypes.find(rType => rType.id === this.newRelation.relationTypeId)
    },
    filteredPeople () {
      return this.searchPersonName === ''
        ? this.people
        : this.peopleSearch.search(this.searchPersonName)
    },
    filteredRelationTypes () {
      return this.searchRelationType === ''
        ? this.relationTypes
        : this.relationTypeSearch.search(this.searchRelationType)
    },
    relationExists () {
      if (this.searchRelationType === '') return true
      return this.relationTypes.map(relationType => relationType.name).includes(this.searchRelationType)
    },
    noRelationYet () {
      return this.relationTypes.length === 0 && this.searchRelationType === ''
    },
    noOtherPersonYet () {
      return this.people.length === 0 && this.searchPersonName === ''
    }
  },
  async beforeMount () {
    // pre-set first person
    this.newRelation.firstPersonId = this.personId

    // load data
    const { data: relationTypes } = await this.axios.get('components/add-relation/relation-types')
    const { data: people } = await this.axios.get('people')

    // store locally
    this.relationTypes = relationTypes
    this.people = people

    // set up search functions
    this.relationTypeSearch = new Fuse(this.relationTypes, {
      keys: ['name']
    })
    this.peopleSearch = new Fuse(this.people, {
      keys: ['firstName', 'lastName']
    })
  },
  methods: {
    setPerson (person) {
      this.newRelation.secondPersonId = person.id
      this.searchPersonName = `${person.lastName}, ${person.firstName}`
      this.searchingPersonName = false
    },
    createNewRelationType () {
      this.$router.push(`/add-relation?name=${this.searchRelationType}&personId=${this.personId}`)
    },
    blurRelationType () {
      this.searchingRelationType = false
    },
    blurPerson () {
      this.searchingPersonName = false
    },
    setRelationType (type) {
      this.newRelation.relationTypeId = type.id
      this.searchRelationType = type.name
      this.searchingRelationType = false
    },
    async save () {
      // add remote
      const { data } = await this.axios.post('relations', this.newRelation)

      // emit to add local
      this.$emit('add', data.id)

      // notify user
      this.$success(`Added relation ${this.selectedRelationType.name}`)
    }
  }
}
</script>
