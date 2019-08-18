<template>
  <div>
    <h1 class="header">{{ person.lastName }}, {{ person.firstName }}</h1>

    <!-- actions -->
    <div class="actions mb-8">
      <button @click="addingProperty = true"><font-awesome-icon icon="plus" /> Add Property</button>
      <button @click="addingRelation = true"><font-awesome-icon icon="arrows-alt-h" /> Add Relation</button>
    </div>

    <!-- add property -->
    <div v-if="addingProperty">
      <add-property @add="addProperty" />
    </div>

    <!-- add relation -->
    <div v-if="addingRelation">
      <add-relation @add="addRelation" />
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

    <!-- relations -->
    <h5>Relations</h5>
    <ul class="relations-list" v-if="person.relations.length > 0">
      <li
        v-for="relation in person.relations"
        :key="`relation-${relation.id}`"
      >
        <b>{{ getPerson(relation.secondPersonId).lastName }}, {{ getPerson(relation.secondPersonId).firstName }}</b>: {{ relation.name }} ({{ relation.value }})
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import AddProperty from '@/components/AddProperty.vue'
import AddRelation from '@/components/AddRelation.vue'

export default {
  components: { AddProperty, AddRelation },
  data: () => ({
    addingProperty: false,
    addingRelation: false
  }),
  async beforeMount () {
    try {
      await this.$store.dispatch('people/loadInstance', this.$route.params.id)
    } catch (error) {
      console.error('error: ', error.status)
    }
  },
  computed: {
    ...mapState('people', {
      person: state => state.active
    }),
    ...mapGetters({
      getPerson: 'people/getPerson'
    })
  },
  methods: {
    async addProperty () {
      // set person of new property
      this.$store.commit('properties/setPerson', this.$route.params.id)

      // store property
      await this.$store.dispatch('properties/store')

      this.addingProperty = false
    },
    async addRelation () {
      // set person of new relation
      this.$store.commit('relatedTo/setFirst', this.$route.params.id)

      // store relation
      await this.$store.dispatch('relatedTo/store')

      this.addingRelation = false
    }
  }
}
</script>
