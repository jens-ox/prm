<template>
  <div>
    <header class="max-w-xl">
      <h1>{{ text }}</h1>
      <div class="line" />
    </header>

    <!-- content -->
    <section>
      <calendar-heatmap
        :values="values"
        :end-date="currentDate"
        @day-click="clickedDay"
      />
    </section>

    <!-- diary entries -->
    <section
      v-if="date !== '' && diaryEntries.length"
      class="max-w-xl"
    >
      <h3 class="mb-4">
        Diary entries for {{ date }}
      </h3>
      <diary-preview
        v-for="diary in diaryEntries"
        :key="diary.id"
        :diary-id="diary.id"
      />
    </section>
  </div>
</template>
<script>
import { CalendarHeatmap } from 'vue-calendar-heatmap'
import DiaryPreview from '../components/DiaryPreview'

export default {
  components: { CalendarHeatmap, DiaryPreview },
  data: () => ({
    text: '',
    values: [],
    date: '',
    diaryEntries: [],
    hasFiltered: false
  }),
  computed: {
    id () { return parseInt(this.$route.params.id) },
    currentDate () { return new Date().toISOString().split('T')[0] }
  },
  async beforeMount () {
    await this.load()
  },
  methods: {
    async load () {
      const { data: { text, values } } = await this.axios.get(`views/tag/${this.id}`)
      this.text = text
      this.values = values
    },
    async clickedDay ({ date }) {
      // TODO this mitigates weirdness in vue-calendar-heatmap and needs to be removed
      date.setDate(date.getDate() + 1)
      this.date = date.toISOString().split('T')[0]

      // load entries for this date
      const { data: entries } = await this.axios.get(`views/tag/by-date/${this.date}`)
      this.diaryEntries = entries
    }
  }
}
</script>
