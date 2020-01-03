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
    relationId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    showModal: false
  }),
  computed: {
    relation () {
      return this.$store.getters['relatedTo/byId'](this.relationId)
    }
  },
  async beforeMount () {
    await this.$store.dispatch('relatedTo/get', this.relationId)
  },
  methods: {
    async remove () {
      console.log('removing relation: ', this.relation)
      await this.$store.dispatch('relatedTo/remove', this.relation.id)
    }
  }
}
</script>
