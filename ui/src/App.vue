<template>
  <div id="app" class="min-h-sc min-h-screen leading-normal flex flex-row flex-wrap">
    <div id="nav" class="bg-gray-200 px-2 pt-8 w-64 flex-shrink inline-block">
      <ul class="list-nav">
        <li><router-link to="/">People</router-link></li>
        <li><router-link to="/properties">Properties</router-link></li>
        <li><router-link to="/relations">Relations</router-link></li>
      </ul>
    </div>
    <router-view class="router-view" />
  </div>
</template>
<style lang="sass">
.list-nav
  @apply list-none font-bold

  li
    @apply block mb-2

  a
    @apply relative text-black mr-8

    &:hover
      @apply bg-transparent

    &:before
      @apply absolute bg-blue-400 rounded-full inline-block opacity-0 h-2 w-2
      transition: opacity 200ms ease
      content: ''
      left: -16px
      top: 6px

    &:hover:before
      @apply opacity-75

    &.router-link-exact-active:before
      @apply opacity-100

.router-view
  @apply p-8 flex-grow
</style>
