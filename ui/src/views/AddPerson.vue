<template>
  <div>
    <h1 class="mb-8">
      {{ newPerson.id !== -1 ? 'Edit' : 'Add' }} Person
    </h1>

    <h3>Base Information</h3>
    <div class="fields">
      <div class="field">
        <input
          v-model="newPerson.firstName"
          type="text"
          placeholder="First Name"
        >
      </div>
      <div class="field">
        <input
          v-model="newPerson.lastName"
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
        v-if="newPerson.id === -1"
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
      id: -1,
      firstName: '',
      lastName: ''
    }
  }),
  computed: {
    saveable () { return this.newPerson.lastName !== '' && this.newPerson.firstName !== '' }
  },
  async beforeMount () {
    if (this.$route.params.id) {
      this.newPerson = (await this.axios.get(`views/edit-person/${this.$route.params.id}`)).data
    }
  },
  methods: {
    async storePerson (repeat = false) {
      if (!this.saveable) return
      const id = this.newPerson.id
      const { data } = id === -1
        ? await this.axios.post('people', this.newPerson)
        : await this.axios.put(`views/edit-person/${id}`, this.newPerson)

      // notify user
      this.$success(`${id === -1 ? 'Created' : 'Updated'} person ${this.newPerson.lastName}, ${this.newPerson.firstName}`)

      if (!repeat) {
        // redirect
        this.$router.push(`/person/${data.id}`)
      } else {
        // clear input
        this.newPerson.id = -1
        this.newPerson.firstName = ''
        this.newPerson.lastName = ''
      }
    }
  }
}
</script>
