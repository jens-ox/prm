<template>
  <div class="mb-4 px-4 py-2 rounded border-gray-300 border bg-white relative">

    <!-- delete button -->
    <button @click="remove" class="icon absolute top-0 right-0 mr-2 mt-1 text-sm text-gray-500"><font-awesome-icon icon="trash-alt" /></button>

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
