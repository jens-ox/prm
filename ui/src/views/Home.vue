<template>
  <div class="home">
    <div class="header">
      <h1 class="mr-8">People</h1>
      <button @click="$router.push('/add-person')"><font-awesome-icon icon="plus" /></button>
    </div>

    <!-- content -->
    <input
      type="text"
      placeholder="Find someone"
      v-model="searchPeople"
      class="ml-0"
      v-if="availablePeople.length > 0"
    >
    <ul class="list-people" v-if="availablePeople.length > 0">
      <li
        v-for="person in filteredPeople"
        :key="person.id"
      ><router-link :to="`/person/${person.id}`">{{ person.lastName }}, {{ person.firstName }}</router-link></li>
    </ul>
    <p v-else class="italic">No people available. <router-link to="/add-person">Add someone!</router-link></p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'

export default {
  name: 'home',
  data: () => ({
    searchPeople: '',
    peopleSearch: {
      search: () => []
    }
  }),
  async beforeMount () {
    // load available
    await this.$store.dispatch('people/loadAvailable')
    this.peopleSearch = new Fuse(this.availablePeople, {
      keys: ['firstName', 'lastName']
    })
  },
  computed: {
    ...mapState('people', {
      availablePeople: state => state.available
    }),
    filteredPeople () {
      return this.searchPeople === ''
        ? this.availablePeople
        : this.peopleSearch.search(this.searchPeople)
    }
  }
}
</script>
<style lang="sass">
.text
  @apply max-w-xl text-justify

.header
  @apply flex flex-row items-center
</style>
