<template>
  <div>
    <h1 class="header">{{ person.lastName }}, {{ person.firstName }}</h1>

    <!-- actions -->
    <div class="actions mb-8">
      <button @click="addingProperty = true"><font-awesome-icon icon="plus" /> Add Property</button>
      <button><font-awesome-icon icon="arrows-alt-h" /> Add Relation</button>
    </div>

    <!-- add property -->
    <div v-if="addingProperty">
      <add-property @add="addProperty" />
    </div>

    <!-- properties -->
    <h5>Properties</h5>
    <ul class="property-list" v-if="person.properties.length > 0">
      <li
        v-for="property in person.properties"
        :key="`property-${property.id}`"
      ><b>{{ property.name }}:</b> {{ property.value }}</li>
    </ul>
    <p class="text-sm italic" v-else>no properties, yet.</p>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import AddProperty from '@/components/AddProperty.vue'

export default {
  components: { AddProperty },
  data: () => ({
    addingProperty: false
  }),
  async beforeMount () {
    await this.$store.dispatch('people/loadInstance', this.$route.params.id)
  },
  computed: {
    ...mapState('people', {
      person: state => state.active
    })
  },
  methods: {
    async addProperty () {
      // set person of new property
      this.$store.commit('properties/setPerson', this.$route.params.id)

      // store property
      await this.$store.dispatch('properties/store')

      this.addingProperty = false
    }
  }
}
</script>
