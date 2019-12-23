<template>
  <div
    id="app"
    class="min-h-screen leading-normal flex flex-col flex-wrap"
  >
    <div
      id="nav"
      class="bg-gray-600 flex-shrink"
    >
      <ul class="list-nav">
        <li>
          <router-link
            to="/"
            class="link-nav"
          >
            People
          </router-link>
        </li>
        <li>
          <router-link
            to="/relations"
            class="link-nav"
          >
            Relations
          </router-link>
        </li>
      </ul>
    </div>
    <router-view class="router-view" />
  </div>
</template>
<style lang="sass">
.list-nav
  @apply list-none font-bold py-4

  li
    @apply inline-block mr-8

.router-view
  @apply p-8 flex-grow
</style>
