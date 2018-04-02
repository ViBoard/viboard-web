<template>
  <div id="app">
    <FixedElements/>
    <video title="Новое"
              gridClass="grid-small"
              :nVideos="16"
              />

  </div>
</template>

<script>
  import FixedElements from './FixedElements.vue'
  import Category from './Category.vue'
  export default {
    name: 'app',
    components: {
      FixedElements,
      Category,
    }
  }

</script>

<style>
#app {
  padding-top: 4em;
}
</style>
