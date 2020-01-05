<template>
  <div class="home">
    <header class="max-w-xl">
      <h1>People</h1>
      <div class="line" />
      <input
        v-if="people.length > 0"
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
      v-if="filteredPeople.length > 0"
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
      v-else-if="people.length === 0"
      class="italic"
    >
      No people available. <router-link to="/add-person">
        Add someone!
      </router-link>
    </p>
    <p
      v-else
      class="italic"
    >
      Nobody found with that name.
    </p>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
  name: 'Home',
  data: () => ({
    people: [],
    searchPeople: '',
    peopleSearch: {
      search: () => []
    }
  }),
  computed: {
    filteredPeople () {
      return this.searchPeople === ''
        ? this.people
        : this.peopleSearch.search(this.searchPeople)
    }
  },
  async beforeMount () {
    const { data: people } = await this.axios.get('people')
    this.people = people

    // set up search
    this.peopleSearch = new Fuse(this.people, {
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
