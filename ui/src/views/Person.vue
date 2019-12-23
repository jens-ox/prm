<template>
  <div>
    <h1 class="mb-8">
      {{ person.lastName }}, {{ person.firstName }}
    </h1>

    <!-- properties -->
    <header class="max-w-xl">
      <h3>Properties</h3>
      <div class="line" />
      <button @click="addingProperty = !addingProperty">
        <font-awesome-icon :icon="!addingProperty ? 'plus' : 'times'" />
      </button>
    </header>
    <section>
      <div
        v-if="addingProperty"
        class="max-w-xl"
      >
        <add-property @add="addProperty" />
      </div>
      <div
        v-if="person.properties.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <property
          v-for="property in person.properties"
          :key="`property-${property.id}`"
          :property="property"
        />
      </div>
      <p
        v-else
        class="text-sm italic"
      >
        no properties, yet.
      </p>
    </section>

    <!-- relations -->
    <header class="max-w-xl">
      <h3>Relations</h3>
      <div class="line" />
      <button @click="addingRelation = !addingRelation">
        <font-awesome-icon :icon="!addingRelation ? 'plus' : 'times'" />
      </button>
    </header>
    <section>
      <div
        v-if="addingRelation"
        class="max-w-xl"
      >
        <add-relation @add="addRelation" />
      </div>
      <div
        v-if="person.relations.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <relation
          v-for="relation in person.relations"
          :key="`relation-${relation.id}`"
          :relation="relation"
        />
      </div>
      <p
        v-else
        class="text-sm italic"
      >
        no relations, yet.
      </p>
    </section>

    <!-- notes -->
    <header class="max-w-xl">
      <h3>Notes</h3>
      <div class="line" />
      <button @click="addingNote = !addingNote">
        <font-awesome-icon :icon="!addingNote ? 'plus' : 'times'" />
      </button>
    </header>
    <section>
      <div
        v-if="addingNote"
        class="max-w-xl"
      >
        <add-note @add="addNote" />
      </div>
      <div
        v-if="person.notes.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <note
          v-for="note in person.notes"
          :key="`note-${note.id}`"
          :note="note"
        />
      </div>
      <p
        v-else
        class="text-sm italic"
      >
        no notes, yet.
      </p>
    </section>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import AddProperty from '@/components/AddProperty.vue'
import AddRelation from '@/components/AddRelation.vue'
import AddNote from '@/components/AddNote.vue'
import Note from '@/components/Note.vue'
import Relation from '@/components/Relation.vue'
import Property from '@/components/Property.vue'

export default {
  components: { AddProperty, AddRelation, AddNote, Note, Relation, Property },
  data: () => ({
    addingProperty: false,
    addingRelation: false,
    addingNote: false
  }),
  computed: {
    ...mapState('people', {
      person: state => state.active
    }),
    ...mapGetters({
      getPerson: 'people/getPerson'
    })
  },
  watch: {
    $route (to, from) {
      this.loadPerson()
    }
  },
  beforeMount () {
    this.loadPerson()
  },
  methods: {
    async loadPerson () {
      await this.$store.dispatch('people/loadInstance', this.$route.params.id)
    },
    async addProperty () {
      // set person of new property
      this.$store.commit('properties/setPerson', this.$route.params.id)

      // store property
      await this.$store.dispatch('properties/store')

      this.addingProperty = false
    },
    async addRelation () {
      // set person of new relation
      this.$store.commit('relatedTo/setFirst', this.$route.params.id)

      // store relation
      await this.$store.dispatch('relatedTo/store')

      this.addingRelation = false
    },
    async addNote () {
      // set person of new note
      this.$store.commit('note/setPerson', this.$route.params.id)

      // store note
      await this.$store.dispatch('note/store')

      this.addingNote = false
    }
  }
}
</script>
