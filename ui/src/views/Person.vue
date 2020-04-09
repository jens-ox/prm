<template>
  <div>
    <div class="mb-8 flex items-center">
      <h1 class="inline-block pr-4">
        {{ person.lastName }}, {{ person.firstName }}
      </h1>
      <div class="bar-buttons text-gray-600">
        <router-link
          :to="`/edit-person/${id}`"
          tag="button"
          class="secondary"
        >
          <font-awesome-icon icon="edit" />
        </router-link>
        <button
          class="secondary"
          @click.stop="showModal = true"
        >
          <font-awesome-icon icon="trash-alt" />
        </button>
      </div>
    </div>

    <!-- calendar -->
    <section>
      <calendar-heatmap
        :values="values"
        :end-date="currentDate"
        @day-click="clickedDay"
      />
    </section>

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
        <add-property
          :person-id="id"
          @add="addProperty"
        />
      </div>
      <div
        v-if="person.properties.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <property
          v-for="propertyId in person.properties"
          :key="`property-${propertyId}`"
          :property-id="propertyId"
          @remove="removeProperty(propertyId)"
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
        <add-relation
          :person-id="id"
          @add="addRelation"
        />
      </div>
      <div
        v-if="person.relations.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <relation
          v-for="relationId in person.relations"
          :key="`relation-${relationId}`"
          :relation-id="relationId"
          :person-id="id"
          @remove="removeRelation(relationId)"
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
        <add-note
          :person-id="id"
          @add="addNote"
        />
      </div>
      <div
        v-if="person.notes.length > 0"
        class="flex flex-col max-w-xl mt-2"
      >
        <note
          v-for="noteId in person.notes"
          :key="`note-${noteId}`"
          :note-id="noteId"
          @remove="removeNote(noteId)"
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
      <h3>Diary Entries <span v-if="date !== ''">({{ date }})</span></h3>
    </header>
    <section class="max-w-xl">
      <div v-if="person.diaries.length > 0">
        <diary-preview
          v-for="diaryId in person.diaries"
          :key="diaryId"
          :diary-id="diaryId"
        />
      </div>
      <p
        v-else
        class="text-sm italic"
      >
        no diary entries, yet.
      </p>
    </section>

    <!-- deletion modal -->
    <div
      v-show="showModal"
      class="modal cursor-default"
    >
      <header>
        <h3>Delete Person</h3>
      </header>
      <section>
        <p>
          Are you sure you want to remove this person?
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
      @click.stop="showModal = false"
    />
  </div>
</template>
<script>
import AddProperty from '@/components/AddProperty.vue'
import AddRelation from '@/components/AddRelation.vue'
import AddNote from '@/components/AddNote.vue'
import Note from '@/components/Note.vue'
import Relation from '@/components/Relation.vue'
import Property from '@/components/Property.vue'
import DiaryPreview from '@/components/DiaryPreview.vue'
import { CalendarHeatmap } from 'vue-calendar-heatmap'

export default {
  components: { AddProperty, AddRelation, AddNote, Note, Relation, Property, DiaryPreview, CalendarHeatmap },
  data: () => ({
    addingProperty: false,
    addingRelation: false,
    addingNote: false,
    values: [],
    date: '',
    showModal: false,
    person: {
      id: 0,
      firstName: '',
      lastName: '',
      properties: [],
      relations: [],
      notes: [],
      diaries: []
    }
  }),
  computed: {
    id () { return parseInt(this.$route.params.id) },
    currentDate () { return new Date().toISOString().split('T')[0] }
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
    async remove () {
      // remote
      await this.axios.delete(`people/${this.id}`)
      // close modal
      this.showModal = false
      // notify user
      this.$success('Removed person')
      // redirect
      this.$router.push('/')
    },
    async clickedDay ({ date }) {
      // TODO this mitigates weirdness in vue-calendar-heatmap and needs to be removed
      const localDate = new Date(date)
      localDate.setDate(localDate.getDate() + 1)
      this.date = localDate.toISOString().split('T')[0]

      // load entries for this date
      const { data: entries } = await this.axios.get(`views/person/${this.id}/by-date/${this.date}`)
      this.person.diaries = entries
    },
    async loadPerson () {
      const { data: { person, values } } = await this.axios.get(`views/person/${this.id}`)
      this.person = person
      this.values = values
    },

    // properties
    addProperty (id) {
      this.person.properties.push(id)
      // close adding
      this.addingProperty = false
    },
    removeProperty (id) {
      this.person.properties = this.person.properties.filter(prop => prop !== id)
    },

    // relations
    addRelation (id) {
      this.person.relations.push(id)
      this.addingRelation = false
    },
    removeRelation (id) {
      this.person.relations = this.person.relations.filter(relation => relation !== id)
    },

    // notes
    addNote (id) {
      this.person.notes.push(id)
      this.addingNote = false
    },
    removeNote (id) {
      this.person.notes = this.person.notes.filter(note => note !== id)
    }
  }
}
</script>
