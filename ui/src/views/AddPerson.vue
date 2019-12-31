<template>
  <div>
    <h1 class="mb-8">
      Add Person
    </h1>

    <h3>Base Information</h3>
    <div class="fields">
      <div class="field">
        <input
          v-model="firstName"
          type="text"
          placeholder="First Name"
        >
      </div>
      <div class="field">
        <input
          v-model="lastName"
          type="text"
          placeholder="Last Name"
        >
      </div>
    </div>

    <!-- save -->
    <div class="bar-buttons mt-8">
      <button
        class="primary large"
        :class="{ disabled: !saveable }"
        @click="storePerson(false)"
      >
        Save Person
      </button>
      <button
        class="large"
        :class="{ disabled: !saveable }"
        @click="storePerson(true)"
      >
        Save Person and repeat
      </button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    addingProperty: false,
    addingRelation: false
  }),
  computed: {
    ...mapGetters({
      getPerson: 'people/getPerson'
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
    async storePerson (repeat = false) {
      if (!this.saveable) return
      const { id } = await this.$store.dispatch('people/store')
      if (!repeat) {
        // redirect
        this.$router.push(`/person/${id}`)
      }
    }
  }
}
</script>
