<template>
  <div>
    <header class="max-w-xl">
      <h1>Diary</h1>
      <div class="line" />
      <input
        v-if="entries.length > 0"
        v-model="searchEntry"
        type="text"
        placeholder="Find entry"
        class="text-sm mr-2 py-1"
        @change="search"
      >
      <router-link
        v-if="!hasSearched"
        to="/diary/new"
        tag="button"
      >
        <font-awesome-icon icon="plus" />
      </router-link>
      <button
        v-else
        @click="closeSearch"
      >
        <font-awesome-icon icon="times" />
      </button>
    </header>

    <!-- diary entries -->
    <section class="max-w-xl">
      <span
        v-if="hasSearched"
        class="small italic mb-4 block"
      >found {{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}</span>
      <div v-if="entries.length > 0">
        <diary-preview
          v-for="diary in entries"
          :key="diary.id"
          :diary-id="diary.id"
        />
      </div>
      <div v-else>
        <p
          v-if="!hasSearched"
          class="italic small"
        >
          no entries available, yet.
        </p>
      </div>
    </section>
  </div>
</template>
<script>
import DiaryPreview from '../components/DiaryPreview'

export default {
  components: { DiaryPreview },
  data: () => ({
    searchEntry: '',
    hasSearched: false,
    entries: []
  }),
  async beforeMount () {
    await this.load()
  },
  methods: {
    async load () {
      const { data: entries } = await this.axios.get('diary')
      this.entries = entries
    },
    async search () {
      if (this.searchEntry === '') return
      const { data: entries } = await this.axios.get(`diary/search/${this.searchEntry}`)
      this.entries = entries
      this.hasSearched = true
    },
    async closeSearch () {
      this.searchEntry = ''
      this.hasSearched = false
      await this.load()
    }
  }
}
</script>
