<template>
  <div>
    <h1 class="header">{{ person.lastName }}, {{ person.firstName }}</h1>

    <!-- actions -->
    <div class="actions mb-8">
      <button @click="addingProperty = true; addingRelation = false; addingNote = false"><font-awesome-icon icon="plus" /> Add Property</button>
      <button @click="addingRelation = true; addingProperty = false; addingNote = false"><font-awesome-icon icon="arrows-alt-h" /> Add Relation</button>
      <button @click="addingNote = true; addingProperty = false; addingRelation = false"><font-awesome-icon icon="align-justify" /> Add Note</button>
    </div>

    <!-- add property -->
    <div v-if="addingProperty">
      <add-property @add="addProperty" />
    </div>

    <!-- add relation -->
    <div v-if="addingRelation">
      <add-relation @add="addRelation" />
    </div>

    <!-- add note -->
    <div v-if="addingNote">
      <add-note @add="addNote" />
    </div>

    <!-- properties -->
    <h5>Properties</h5>
    <ul class="property-list" v-if="person.properties.length > 0">
      <li
        v-for="property in person.properties"
        :key="`property-${property.id}`"
      ><b>{{ property.name }}:</b> {{ property.value }}</li>
    </ul>
    <p class="text-sm italic" v-else>no properties, yet.</p>

    <!-- relations -->
    <h5>Relations</h5>
    <ul class="relations-list" v-if="person.relations.length > 0">
      <li
        v-for="relation in person.relations"
        :key="`relation-${relation.id}`"
      >
        <small><pre>{{ relation }}</pre></small>
      </li>
    </ul>
    <p class="text-sm italic" v-else>no relations, yet.</p>

    <!-- notes -->
    <h5>Notes</h5>
    <div v-if="person.notes.length > 0" class="flex flex-col max-w-xl mt-2">
      <note
        v-for="note in person.notes"
        :key="`note-${note.id}`"
        :note="note"
      />
    </div>
    <p class="text-sm italic" v-else>no notes, yet.</p>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import AddProperty from '@/components/AddProperty.vue'
import AddRelation from '@/components/AddRelation.vue'
import AddNote from '@/components/AddNote.vue'
import Note from '@/components/Note.vue'

export default {
  components: { AddProperty, AddRelation, AddNote, Note },
  data: () => ({
    addingProperty: false,
    addingRelation: false,
    addingNote: false
  }),
  async beforeMount () {
    try {
      await this.$store.dispatch('people/loadInstance', this.$route.params.id)
    } catch (error) {
      console.error('error: ', error.status)
    }
  },
  computed: {
    ...mapState('people', {
      person: state => state.active
    }),
    ...mapGetters({
      getPerson: 'people/getPerson'
    })
  },
  methods: {
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
