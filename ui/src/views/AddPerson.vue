<template>
  <div>
    <h1 class="header">Add Person</h1>
    <h5>Base Information</h5>
    <div class="fields">
      <div class="field">
        <input type="text" placeholder="First Name" v-model="firstName">
      </div>
      <div class="field">
        <input type="text" placeholder="Last Name" v-model="lastName">
      </div>
    </div>
    <h5 class="mb-2">Properties</h5>
    <div class="mb-2">
      <ul class="property-list">
        <li
          v-for="(property, i) in existingProperties"
          :key="`existing-property-${i}`"
        ><b>{{ $store.getters['propertyTypes/getProperty'](property.propertyTypeId).name }}:</b> {{ property.value }}</li>
      </ul>
    </div>
    <button class="secondary" v-if="!addingProperty" @click="addingProperty = true">
      <font-awesome-icon icon="plus" class="mr-2" /> Add Property
    </button>
    <add-property
      v-if="addingProperty"
      @add="addProperty"
    />
    <div class="bar-buttons mt-8">
      <button
        class="primary large"
        :class="{ disabled: !saveable }"
        @click="storePerson(false)"
      >Save Person</button>
      <button
        class="large"
        :class="{ disabled: !saveable }"
        @click="storePerson(true)"
      >Save Person and repeat</button>
    </div>
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
  computed: {
    ...mapState('people', {
      existingProperties: state => state.new.properties
    }),
    firstName: {
      get () { return this.$store.state.people.new.firstName },
      set (firstName) { this.$store.commit('people/setFirstName', firstName) }
    },
    lastName: {
      get () { return this.$store.state.people.new.lastName },
      set (lastName) { this.$store.commit('people/setLastName', lastName) }
    },
    saveable () { return this.lastName !== '' && this.firstName !== '' }
  },
  methods: {
    addProperty () {
      // take newly created property, push it to the new user, and clean new property
      this.$store.commit('people/addProperty', {
        ...this.$store.state.properties.new,
        personId: undefined
      })
      this.$store.commit('properties/resetNew')
      this.addingProperty = false
    },
    async storePerson (repeat = false) {
      if (!this.saveable) return
      const newPersonId = await this.$store.dispatch('people/store')
      if (!repeat) {
        // redirect
        this.$router.push(`/person/${newPersonId}`)
      }
    }
  }
}
</script>
