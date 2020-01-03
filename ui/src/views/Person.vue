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
        v-if="properties.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <property
          v-for="property in properties"
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
        v-if="relations.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <relation
          v-for="relation in relations"
          :key="`relation-${relation.id}`"
          :relation-id="relation.id"
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
        v-if="notes.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <note
          v-for="note in notes"
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

    <!-- diary entries -->
    <header>
      <h3>Diary Entries</h3>
    </header>
    <section class="max-w-xl">
      <div v-if="diaries.length > 0">
        <diary-preview
          v-for="diary in diaries"
          :key="diary.id"
          :entry="diary"
        />
      </div>
      <p
        v-else
        class="text-sm italic"
      >
        no diary entries, yet.
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
import DiaryPreview from '@/components/DiaryPreview.vue'

export default {
  components: { AddProperty, AddRelation, AddNote, Note, Relation, Property, DiaryPreview },
  data: () => ({
    addingProperty: false,
    addingRelation: false,
    addingNote: false
  }),
  computed: {
    id () { return this.$route.params.id },
    ...mapState('people', {
      person: state => state.active
    }),
    ...mapGetters({
      getPerson: 'people/getPerson'
    }),
    relations () {
      return this.$store.getters['relatedTo/byPersonId'](this.id)
    },
    properties () {
      return this.$store.getters['properties/byPersonId'](this.id)
    },
    notes () {
      return this.$store.getters['note/byPersonId'](this.id)
    },
    diaries () {
      return this.$store.getters['diary/byPersonId'](this.id)
    }
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
      await this.$store.dispatch('people/loadInstance', this.id)
      await this.$store.dispatch('relatedTo/loadForPerson', this.id)
      await this.$store.dispatch('properties/loadForPerson', this.id)
      await this.$store.dispatch('note/loadForPerson', this.id)
    },
    async addProperty () {
      // set person of new property
      this.$store.commit('properties/setPerson', this.id)

      // store property
      await this.$store.dispatch('properties/store')

      this.addingProperty = false
    },
    async addRelation () {
      // set person of new relation
      this.$store.commit('relatedTo/setFirst', this.id)

      // store relation
      await this.$store.dispatch('relatedTo/store')

      this.addingRelation = false
    },
    async addNote () {
      // set person of new note
      this.$store.commit('note/setPerson', this.id)

      // store note
      await this.$store.dispatch('note/store')

      this.addingNote = false
    }
  }
}
</script>
