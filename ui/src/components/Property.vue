<template>
  <div class="mb-4 px-4 py-2 rounded border-gray-300 border bg-white relative">

    <!-- delete button -->
    <button @click="remove" class="icon absolute top-0 right-0 mr-2 mt-1 text-sm text-gray-500"><font-awesome-icon icon="trash-alt" /></button>

    <!-- content -->
    <b>{{ property.name }}</b>
    <br>
    <p v-if="property.type === 'link'">
      <a :href="property.value" target="_blank">{{ property.value }}</a>
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
