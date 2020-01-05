<template>
  <div
    class="card cursor-pointer"
    @click="showProperty = true"
  >
    <!-- delete button -->
    <button
      class="icon absolute top-0 right-0 mr-2 mt-1 text-sm bg-transparent"
      @click.stop="showModal = true"
    >
      <font-awesome-icon icon="trash-alt" />
    </button>

    <!-- content -->
    <b>{{ property.name }}</b>
    <br>
    <p v-if="property.type === 'link'">
      <a
        :href="property.value"
        target="_blank"
      >{{ property.value }}</a>
    </p>
    <p v-else>
      {{ property.value }}
    </p>

    <!-- modal and backdrop -->
    <div
      v-if="showModal"
      class="modal"
    >
      <header>
        <h3>Remove Property</h3>
      </header>
      <section>
        <p>
          Are you sure you want to remove the property {{ property.name }}?
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

    <!-- view and edit property modal -->
    <div
      v-show="showProperty"
      class="modal cursor-default"
    >
      <header>
        <h3>Property</h3>
      </header>
      <section>
        <add-property
          :property="property"
          @update="update"
        />
      </section>
      <div class="actions flex justify-between">
        <button
          class="large"
          @click.stop="showProperty = false"
        >
          Cancel
        </button>
      </div>
    </div>
    <div
      v-if="showModal || showProperty"
      class="backdrop"
      @click.stop="showModal = false; showProperty = false"
    />
  </div>
</template>
<script>
import AddProperty from './AddProperty'
export default {
  components: { AddProperty },
  props: {
    propertyId: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    property: {
      name: '',
      type: '',
      value: ''
    },
    showModal: false,
    showProperty: false
  }),
  async beforeMount () {
    await this.load()
  },
  methods: {
    async load () {
      const { data } = await this.axios.get(`components/property/${this.propertyId}`)
      console.log('loaded property: ', data)
      this.property = data
    },
    async remove () {
      // remote
      await this.axios.delete(`properties/${this.propertyId}`)
      // local
      this.$emit('remove', this.propertyId)
      // close modal
      this.showModal = false
      // notify user
      this.$success(`Removed property ${this.property.name}`)
    },
    async update () {
      this.showProperty = false
      await this.load()
    }
  }
}
</script>
