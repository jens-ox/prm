<template>
  <div class="card">
    <!-- delete button -->
    <button
      class="icon absolute top-0 right-0 mr-2 mt-1 text-sm bg-transparent"
      @click="remove"
    >
      <font-awesome-icon icon="trash-alt" />
    </button>

    <!-- content -->
    <b>{{ new Date(note.timestamp).toLocaleString() }}</b>
    <br>
    <p>
      {{ note.text }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    note: {
      type: Object,
      required: true
    }
  },
  methods: {
    async remove () {
      console.log('removing note: ', this.note.id)
      await this.$store.dispatch('note/remove', this.note.id)
    }
  }
}
</script>
