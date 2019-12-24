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
  </div>
</template>
<script>
export default {
  props: {
    property: {
      type: Object,
      required: true
    }
  },
  methods: {
    async remove () {
      console.log('removing property: ', this.property.id)
      await this.$store.dispatch('properties/remove', this.property.id)
    }
  }
}
</script>
