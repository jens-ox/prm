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
    </router-link>: {{ relation.relationType.name }} <br>
    <p
      v-if="relation.value !== ''"
      class="text-sm mb-0 italic"
    >
      {{ relation.value }}
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
          Are you sure you want to remove the relation {{ relation.relationType.name }}?
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
    },
    personId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    relation: {
      id: 0,
      value: '',
      firstPerson: {
        id: 0,
        firstName: '',
        lastName: ''
      },
      secondPerson: {
        id: 0,
        firstName: '',
        lastName: ''
      },
      relationType: {
        name: '',
        isBidirectional: false,
        reverseName: '',
        category: ''
      }
    },
    showModal: false
  }),
  computed: {
    relatedPerson () {
      if (this.personId === this.relation.firstPerson.id) return this.relation.secondPerson
      else return this.relation.firstPerson
    }
  },
  async beforeMount () {
    const { data } = await this.axios.get(`components/relation/${this.relationId}`)
    console.log('loaded relation: ', data)
    this.relation = data
  },
  methods: {
    async remove () {
      // remote
      await this.axios.delete(`relations/${this.relationId}`)
      // local
      this.$emit('remove')

      // notify user
      this.$success(`Removed relation ${this.relation.relationType.name}`)
    }
  }
}
</script>
