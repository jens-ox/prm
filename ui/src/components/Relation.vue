<template>
  <div class="card">
    <!-- delete button -->
    <button
      class="icon absolute top-0 right-0 mr-2 mt-1 text-sm bg-transparent"
      @click="showModal = true"
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

    <!-- modal and backdrop -->
    <div
      v-if="showModal"
      class="modal"
    >
      <header>
        <h3>Remove Relation</h3>
      </header>
      <section>
        <p>
          Are you sure you want to remove the relation {{ relationName }}?
        </p>
      </section>
      <div class="actions flex justify-between">
        <button
          class="large"
          @click="showModal = false"
        >
          Cancel
        </button>
        <button
          class="primary large danger"
          @click="remove"
        >
          Delete
        </button>
      </div>
    </div>
    <div
      v-if="showModal"
      class="backdrop"
      @click="showModal = false"
    />
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
  data: () => ({
    showModal: false
  }),
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
