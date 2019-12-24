<template>
  <div class="home">
    <header class="max-w-xl">
      <h1>People</h1>
      <div class="line" />
      <input
        v-if="availablePeople.length > 0"
        v-model="searchPeople"
        type="text"
        placeholder="Find someone"
        class="text-sm mr-2 py-1"
      >
      <button @click="$router.push('/add-person')">
        <font-awesome-icon icon="plus" />
      </button>
    </header>

    <!-- content -->
    <ul
      v-if="availablePeople.length > 0"
      class="list-people"
    >
      <li
        v-for="person in filteredPeople"
        :key="person.id"
      >
        <router-link :to="`/person/${person.id}`">
          {{ person.lastName }}, {{ person.firstName }}
        </router-link>
      </li>
    </ul>
    <p
      v-else
      class="italic"
    >
      No people available. <router-link to="/add-person">
        Add someone!
      </router-link>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Fuse from 'fuse.js'

export default {
  name: 'Home',
  data: () => ({
    searchPeople: '',
    peopleSearch: {
      search: () => []
    }
  }),
  computed: {
    ...mapState('people', {
      availablePeople: state => state.available
    }),
    filteredPeople () {
      return this.searchPeople === ''
        ? this.availablePeople
        : this.peopleSearch.search(this.searchPeople)
    }
  },
  async beforeMount () {
    // load available
    await this.$store.dispatch('people/loadAvailable')
    this.peopleSearch = new Fuse(this.availablePeople, {
      keys: ['firstName', 'lastName']
    })
  }
}
</script>
<style lang="sass">
.text
  @apply max-w-xl text-justify

.header
  @apply flex flex-row items-center
</style>
