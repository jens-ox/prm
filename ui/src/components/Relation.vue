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
    <router-link :to="`/person/${relatedPerson.id}`">
      {{ relatedPerson.lastName }}, {{ relatedPerson.firstName }}
    </router-link>: {{ relationName }} <br>
    <p
      v-if="relation.relationValue !== ''"
      class="text-sm mb-0 italic"
    >
      {{ relation.relationValue }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    relation: {
      type: Object,
      required: true
    }
  },
  computed: {
    activePersonId () {
      return parseInt(this.$route.params.id || this.$store.state.people.active.id)
    },
    relatedPerson () {
      if (this.activePersonId === this.relation.firstPersonId) {
        return {
          firstName: this.relation.secondPersonFirstName,
          lastName: this.relation.secondPersonLastName,
          id: this.relation.secondPersonId
        }
      } else {
        return {
          firstName: this.relation.firstPersonFirstName,
          lastName: this.relation.firstPersonLastName,
          id: this.relation.firstPersonId
        }
      }
    },
    relationName () {
      // base case bidirectional: return relationTypeName
      if (this.relation.relationTypeBidirectional) return this.relation.relationTypeName

      // depends on whether active person is firstPerson
      if (this.activePersonId === this.relation.firstPersonId) {
        return this.relation.relationTypeName
      } else {
        return this.relation.relationTypeReverseName
      }
    }
  },
  methods: {
    async remove () {
      console.log('removing relation: ', this.relation)
      await this.$store.dispatch('relatedTo/remove', this.relation.id)
    }
  }
}
</script>
