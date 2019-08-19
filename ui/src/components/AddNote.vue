<template>
  <div>
    <div class="fields">
      <textarea placeholder="Note" v-model="text" class="w-full h-32 mx-0" />
    </div>
    <div class="fields">
      <div class="field flex">
        <input
          type="datetime-local"
          placeholder="Custom time (opt.)"
          v-model="time"
        >
        <button class="primary ml-4" @click="save">
          <font-awesome-icon icon="save" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    time: ''
  }),
  computed: {
    text: {
      get () { return this.$store.state.note.new.text },
      set (text) { this.$store.commit('note/setText', text) }
    }
  },
  methods: {
    save () {
      // set time if necessary
      if (this.time !== '') this.$store.commit('note/setTimestamp', new Date(this.time).getTime())

      // emit
      this.$emit('add')
    }
  }
}
</script>
