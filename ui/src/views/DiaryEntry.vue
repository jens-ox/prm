<template>
  <div class="container">
    <h1>Diary Entry</h1>
    <div class="max-w-xl field mb-4">
      <label for="date">Date:</label>
      <input
        id="date"
        v-model="newEntry.date"
        type="date"
        placeholder="Enter a date"
        class="text-lg border-0 border-b w-full rounded-none"
      >
    </div>
    <div class="editor mb-4">
      <label>Entry:</label>
      <editor-content
        class="container p-2"
        :editor="editor"
      />
    </div>
    <div>
      <label>Tags:</label>
      <vue-tags-input
        v-model="tag"
        :autocomplete-items="availableTags"
        :tags="tags"
        @tags-changed="updateTags"
      />
    </div>

    <div
      v-show="showSuggestions"
      ref="suggestions"
      class="suggestion-list"
    >
      <template v-if="hasResults">
        <div
          v-for="(user, index) in filteredUsers"
          :key="user.id"
          class="suggestion-list__item"
          :class="{ 'is-selected': navigatedUserIndex === index }"
          @click="selectUser(user)"
        >
          {{ user.firstName }} {{ user.lastName }}
        </div>
      </template>
      <div
        v-else
        class="suggestion-list__item is-empty"
      >
        No users found
      </div>
    </div>

    <div class="bar-buttons mt-4">
      <button
        class="primary large font-bold"
        @click="save"
      >
        <span v-if="!diaryId">Save</span>
        <span v-else>Update</span>
      </button>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import tippy, { roundArrow } from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/svg-arrow.css'
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Mention,
  Code,
  Bold,
  Italic
} from 'tiptap-extensions'
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  components: { EditorContent, VueTagsInput },
  data () {
    return {
      newEntry: {
        id: 0,
        text: '',
        date: ''
      },
      tag: '',
      availableTags: [],
      tags: [],
      people: [],
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {},
      observer: null,
      editor: new Editor({
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Mention({
            // a list of all suggested items
            items: () => this.people,
            // is called when a suggestion starts
            onEnter: ({
              items, query, range, decorationNode, command
            }) => {
              this.query = query
              this.filteredUsers = items
              this.suggestionRange = range
              this.renderPopup(decorationNode)
              // we save the command for inserting a selected mention
              // this allows us to call it inside of our custom popup
              // via keyboard navigation and on click
              this.insertMention = command
            },
            // is called when a suggestion has changed
            onChange: ({
              items, query, range, decorationNode
            }) => {
              this.query = query
              this.filteredUsers = items
              this.suggestionRange = range
              this.navigatedUserIndex = 0
              this.renderPopup(decorationNode)
            },
            // is called when a suggestion is cancelled
            onExit: () => {
              // reset all saved values
              this.query = null
              this.filteredUsers = []
              this.suggestionRange = null
              this.navigatedUserIndex = 0
              this.destroyPopup()
            },
            // is called on every keyDown event while a suggestion is active
            onKeyDown: ({ event }) => {
              // pressing up arrow
              if (event.keyCode === 38) {
                this.upHandler()
                return true
              }
              // pressing down arrow
              if (event.keyCode === 40) {
                this.downHandler()
                return true
              }
              // pressing enter
              if (event.keyCode === 13 || event.keyCode === 9) {
                this.enterHandler()
                return true
              }

              return false
            },
            // is called when a suggestion has changed
            // this function is optional because there is basic filtering built-in
            // you can overwrite it if you prefer your own filtering
            // in this example we use fuse.js with support for fuzzy search
            onFilter: (items, query) => {
              if (!query) {
                return items
              }

              const fuse = new Fuse(items, {
                threshold: 0.2,
                keys: ['firstName', 'lastName']
              })

              return fuse.search(query)
            }
          }),
          new Code(),
          new Bold(),
          new Italic()
        ],
        onUpdate: ({ getJSON }) => {
          this.newEntry.text = getJSON()
        }
      })
    }
  },

  computed: {
    hasResults () { return this.filteredUsers.length },
    showSuggestions () { return this.query || this.hasResults },
    diaryId () { return this.$route.params.id }
  },
  async beforeMount () {
    const { data: people } = await this.axios.get('people')
    const { data: tags } = await this.axios.get('tags')
    this.people = people
    this.availableTags = tags

    // check if content is pre-set
    if (this.diaryId) {
      // load content
      const { data: entry } = await this.axios.get(`diary/${this.diaryId}`)
      console.log('pre-loaded entry: ', entry)
      this.newEntry = entry

      // load tags
      const { data: tags } = await this.axios.get(`views/diary-entry/${this.diaryId}/tags`)
      this.tags = tags

      // pre-set content
      this.editor.setContent(JSON.parse(this.newEntry.text))
    }
  },

  methods: {
    async updateTags (newTags) {
      // loopback: set tags for tag view
      this.tags = newTags.map(({ id, text }) => ({ id, text }))
    },
    async addOrUpdateTags (diaryId) {
      console.log('adding or updating tags: ', diaryId, this.tags)

      // first, delete existing tags if any
      await this.axios.delete(`views/diary-entry/${diaryId}/tags`)

      // second, create tags that don't have any id and associate all to diary entry
      this.tags.map(async tag => {
        if (typeof tag.id === 'undefined') {
          const { data: newTag } = await this.axios.post('tags', { text: tag.text })
          tag.id = newTag.id
        }
        await this.axios.post(`views/diary-entry/${diaryId}/add-tag`, { id: tag.id })
      })
    },
    async save () {
      let id = this.diaryId

      // case 1: new entry
      if (!this.diaryId) {
        const { data: diary } = await this.axios.post('/diary', this.newEntry)
        id = diary.id

      // case 2: update existing entry
      } else await this.axios.put(`/diary/${this.diaryId}`, this.newEntry)

      // set tags
      this.addOrUpdateTags(id)

      this.$success('Successfully stored diary entry.')
    },
    upHandler () {
      this.navigatedUserIndex = ((this.navigatedUserIndex + this.filteredUsers.length) - 1) % this.filteredUsers.length
    },
    downHandler () {
      this.navigatedUserIndex = (this.navigatedUserIndex + 1) % this.filteredUsers.length
    },

    enterHandler () {
      const user = this.filteredUsers[this.navigatedUserIndex]
      if (user) this.selectUser(user)
    },
    selectUser (user) {
      this.insertMention({
        range: this.suggestionRange,
        attrs: {
          id: user.id,
          label: `${user.firstName} ${user.lastName}`
        }
      })
      this.editor.focus()
    },

    // renders a popup with suggestions
    renderPopup (decorationNode) {
      if (this.popup) return

      this.popup = tippy(decorationNode, {
        lazy: false,
        content: this.$refs.suggestions,
        trigger: 'mouseenter',
        placement: 'top-start',
        inertia: true,
        popperOptions: {
          positionFixed: true,
          inlinePositioning: true
        },
        duration: [400, 200],
        showOnCreate: true,
        arrow: roundArrow
      })
    },

    destroyPopup () {
      if (this.popup) {
        this.popup.destroy()
        this.popup = null
      }
    }
  }
}
</script>
