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
    <b>{{ property.name }}</b>
    <br>
    <p v-if="property.type === 'link'">
      <a
        :href="property.value"
        target="_blank"
      >{{ property.value }}</a>
    </p>
    <p v-else>
      {{ property.value }}
    </p>

    <!-- modal and backdrop -->
    <div
      v-if="showModal"
      class="modal"
    >
      <header>
        <h3>Remove Property</h3>
      </header>
      <section>
        <p>
          Are you sure you want to remove the property {{ property.name }}?
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
    propertyId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    showModal: false
  }),
  methods: {
    async remove () {
      console.log('removing property: ', this.property.id)
      await this.$store.dispatch('properties/remove', this.property.id)
    }
  }
}
</script>
