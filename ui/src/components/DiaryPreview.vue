<template>
  <div class="card pt-8">
    <span class="text-sm text-gray-600">{{ entry.date }}</span>
    <editor-content
      class="editor__content"
      :editor="editor"
    />
  </div>
</template>
<script>
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  Bold,
  Code,
  Italic,
  Link,
  Mention
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent
  },
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editor: new Editor({
        editable: false,
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Mention()
        ],
        content: JSON.parse(this.entry.text).content[0]
      })
    }
  },
  beforeMount () {
    console.log(this.entry)
  },
  beforeDestroy () {
    this.editor.destroy()
  }
}
</script>
