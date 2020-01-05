<template>
  <div>
    <header class="max-w-xl">
      <h1>Diary</h1>
      <div class="line" />
      <router-link
        to="/diary/new"
        tag="button"
      >
        <font-awesome-icon icon="plus" />
      </router-link>
    </header>

    <!-- diary entries -->
    <section class="max-w-xl">
      <div v-if="entries.length > 0">
        <diary-preview
          v-for="diary in entries"
          :key="diary.id"
          :diary-id="diary.id"
        />
      </div>
      <div v-else>
        <p class="italic small">
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
    entries: []
  }),
  async beforeMount () {
    const { data: entries } = await this.axios.get('diary')
    this.entries = entries
  }
}
</script>
