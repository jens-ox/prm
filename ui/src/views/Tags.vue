<template>
  <div>
    <header class="max-w-xl">
      <h1>Tags</h1>
      <div class="line" />
      <input
        v-model="searchTag"
        type="text"
        placeholder="Find tag"
        class="text-sm mr-2 py-1"
      >
    </header>

    <!-- tags -->
    <section class="max-w-xl">
      <ul
        v-if="tags.length > 0"
        class="list-disc"
      >
        <li
          v-for="tag in filteredTags"
          :key="tag.id"
        >
          <router-link :to="`/tag/${tag.id}`">
            {{ tag.text }}
          </router-link>
        </li>
      </ul>
      <div v-else>
        <p class="italic small">
          no tags available, yet.
        </p>
      </div>
    </section>
  </div>
</template>
<script>
import Fuse from 'fuse.js'

export default {
  data: () => ({
    searchTag: '',
    tags: [],
    tagSearch: {
      search: () => {}
    }
  }),
  computed: {
    filteredTags () {
      return this.searchTag === '' ? this.tags : this.tagSearch.search(this.searchTag)
    }
  },
  async beforeMount () {
    await this.load()
  },
  methods: {
    async load () {
      const { data: tags } = await this.axios.get('tags')
      this.tags = tags

      this.tagSearch = new Fuse(this.tags, {
        keys: ['text']
      })
    }
  }
}
</script>
