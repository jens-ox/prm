<template>
  <div>
    <h1 class="header">{{ person.lastName }}, {{ person.firstName }}</h1>
    <div class="actions">
      <button><font-awesome-icon icon="plus" /> Add Property</button>
      <button><font-awesome-icon icon="arrows-alt-h" /> Add Relation</button>
    </div>
    <ul class="property-list">
      <li
        v-for="property in person.properties"
        :key="`property-${property.id}`"
      ><b>{{ property.name }}:</b> {{ property.value }}</li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  async beforeMount () {
    await this.$store.dispatch('people/loadInstance', this.$route.params.id)
  },
  computed: {
    ...mapState('people', {
      person: state => state.active
    })
  }
}
</script>
