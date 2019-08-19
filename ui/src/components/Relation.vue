<template>
  <div class="mb-4 px-4 py-2 rounded border-gray-300 border bg-white relative">
    <router-link :to="`/person/${relatedPerson.id}`">{{ relatedPerson.lastName }}, {{ relatedPerson.firstName }}</router-link>: {{ relationName }} <br>
    <p class="text-sm mb-0 italic" v-if="relation.relationValue !== ''">
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
      console.log('active: ', this.activePersonId)
      console.log('first: ', this.relation.firstPersonId)
      console.log('second: ', this.relation.secondPersonId)
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
  }
}
</script>
