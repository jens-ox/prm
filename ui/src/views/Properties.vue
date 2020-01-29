<template>
  <div>
    <header class="max-w-xl">
      <h1>Properties</h1>
      <div class="line" />
      <input
        v-model="searchProperty"
        type="text"
        placeholder="Find property"
        class="text-sm mr-2 py-1"
      >
    </header>

    <!-- properties -->
    <section class="max-w-xl">
      <ul
        v-if="properties.length > 0"
        class="list-disc"
      >
        <li
          v-for="property in filteredProperties"
          :key="property.id"
        >
          <router-link :to="`/property/${property.id}`">
            {{ property.name }}
          </router-link>
        </li>
      </ul>
      <div v-else>
        <p class="italic small">
          no properties available, yet.
        </p>
      </div>
    </section>
  </div>
</template>
<script>
import Fuse from 'fuse.js'

export default {
  data: () => ({
    searchProperty: '',
    properties: [],
    propertySearch: {
      search: () => {}
    }
  }),
  computed: {
    filteredProperties () {
      return this.searchProperty === '' ? this.properties : this.propertySearch.search(this.searchProperty)
    }
  },
  async beforeMount () {
    await this.load()
  },
  methods: {
    async load () {
      const { data: properties } = await this.axios.get('properties')
      this.properties = properties

      this.propertySearch = new Fuse(this.properties, {
        keys: ['name', 'reverseName']
      })
    }
  }
}
</script>
