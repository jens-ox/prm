<template>
  <div>
    <div class="fields">
      <textarea
        v-model="newNote.text"
        placeholder="Note"
        class="w-full h-32 mx-0"
      />
    </div>
    <div class="fields">
      <div class="field flex">
        <input
          v-model="time"
          type="datetime-local"
          placeholder="Custom time (opt.)"
        >
        <button
          class="primary ml-4 px-4"
          @click="save"
        >
          <font-awesome-icon icon="save" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    personId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    time: '',
    newNote: {
      text: '',
      timestamp: '',
      personId: ''
    }
  }),
  beforeMount () {
    // set person id
    this.newNote.personId = this.personId
  },
  methods: {
    async save () {
      // set time if necessary
      if (this.time !== '') this.newNote.timestamp = new Date(this.time).getTime()
      else this.newNote.timestamp = new Date().getTime()

      // store
      const { data } = await this.axios.post('notes', this.newNote)

      // emit
      this.$emit('add', data.id)

      // notify user
      this.$notify({
        type: 'success',
        text: 'Added note'
      })
    }
  }
}
</script>
