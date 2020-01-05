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
export default {
  data: () => ({
    addingProperty: false,
    addingRelation: false,
    newPerson: {
      firstName: '',
      lastName: ''
    }
  }),
  computed: {
    saveable () { return this.lastName !== '' && this.firstName !== '' }
  },
  methods: {
    async storePerson (repeat = false) {
      if (!this.saveable) return
      const { data } = await this.axios.post('people', this.newPerson)
      if (!repeat) {
        // redirect
        this.$router.push(`/person/${data.id}`)
      }
    }
  }
}
</script>
