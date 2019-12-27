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
      <div v-if="availableEntries.length > 0">
        <diary-preview
          v-for="diary in availableEntries"
          :key="diary.id"
          :entry="diary"
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

import { mapState } from 'vuex'
export default {
  components: { DiaryPreview },
  computed: {
    ...mapState('diary', {
      availableEntries: state => state.available
    })
  },
  async beforeMount () {
    await this.$store.dispatch('diary/loadAvailable')
  }
}
</script>
