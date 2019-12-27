<template>
  <div class="card">
    <!-- delete button -->
    <button
      class="icon absolute top-0 right-0 mr-2 mt-1 text-sm bg-transparent"
      @click="showModal = true"
    >
      <font-awesome-icon icon="trash-alt" />
    </button>

    <!-- content -->
    <b>{{ new Date(note.timestamp).toLocaleString() }}</b>
    <br>
    <p>
      {{ note.text }}
    </p>

    <!-- modal and backdrop -->
    <div
      v-if="showModal"
      class="modal"
    >
      <header>
        <h3>Remove Note</h3>
      </header>
      <section>
        <p>
          Are you sure you want to remove the note?
        </p>
      </section>
      <div class="actions flex justify-between">
        <button
          class="large"
          @click="showModal = false"
        >
          Cancel
        </button>
        <button
          class="primary large danger"
          @click="remove"
        >
          Delete
        </button>
      </div>
    </div>
    <div
      v-if="showModal"
      class="backdrop"
      @click="showModal = false"
    />
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
  data: () => ({
    showModal: false
  }),
  methods: {
    async remove () {
      console.log('removing note: ', this.note.id)
      await this.$store.dispatch('note/remove', this.note.id)
    }
  }
}
</script>
