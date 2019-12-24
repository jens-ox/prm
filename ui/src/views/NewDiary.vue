<template>
  <div>
    <div class="editor">
      <editor-content
        class="container p-2 border border-gray-500"
        :editor="editor"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
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

export default {
  components: { EditorContent },
  data () {
    return {
      editor: new Editor({
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Mention({
            // a list of all suggested items
            items: () => this.availablePeople,
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
        ]
      }),
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      insertMention: () => {},
      observer: null
    }
  },

  computed: {
    ...mapState('people', {
      availablePeople: state => state.available
    }),
    hasResults () { return this.filteredUsers.length },
    showSuggestions () { return this.query || this.hasResults }
  },
  async beforeMount () {
    await this.$store.dispatch('people/loadAvailable')
  },

  methods: {
    // navigate to the previous item
    // if it's the first item, navigate to the last one
    upHandler () {
      this.navigatedUserIndex = ((this.navigatedUserIndex + this.filteredUsers.length) - 1) % this.filteredUsers.length
    },

    // navigate to the next item
    // if it's the last item, navigate to the first one
    downHandler () {
      this.navigatedUserIndex = (this.navigatedUserIndex + 1) % this.filteredUsers.length
    },

    enterHandler () {
      const user = this.filteredUsers[this.navigatedUserIndex]

      if (user) {
        this.selectUser(user)
      }
    },

    // we have to replace our suggestion text with a mention
    // so it's important to pass also the position of your suggestion text
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

<style lang="sass">

.mention
  @apply bg-gray-600 text-sm font-semibold rounded p-1 whitespace-no-wrap

.suggestion-list
  @apply text-sm rounded

  &__no-results
    padding: 0.2rem 0.5rem

  &__item
    border-radius: 5px
    padding: 0.2rem 0.5rem
    margin-bottom: 0.2rem
    cursor: pointer

    &:last-child
      margin-bottom: 0

    &.is-selected,
    &:hover
      background-color: rgba(#fff, 0.2)

    &.is-empty
      opacity: 0.5

.tippy-tooltip.dark-theme
  background-color: #000
  padding: 0
  font-size: 1rem
  text-align: inherit
  color: #fff
  border-radius: 5px

  .tippy-backdrop
    display: none

  .tippy-roundarrow
    fill: #000

  .tippy-popper[x-placement^=top] & .tippy-arrow
    border-top-color: #000

  .tippy-popper[x-placement^=bottom] & .tippy-arrow
    border-bottom-color: #000

  .tippy-popper[x-placement^=left] & .tippy-arrow
    border-left-color: #000

  .tippy-popper[x-placement^=right] & .tippy-arrow
    border-right-color: #000

.ProseMirror
  @apply outline-none
</style>
