<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <Category title="Новое"
              gridClass="grid-small"
              :nVideos="36"
              :isPreview="true"
              method="new"
              />

  </div>
</template>

<script>
  import FixedElements from './FixedElements.vue'
  import Sidebar from './Sidebar.vue'
  import Category from './Category.vue'
  export default {
    name: 'app',
    components: {
      FixedElements,
      Sidebar,
      Category,
    }
  }

</script>

<style>
#app {
  padding-top: 4em;
}
</style>
