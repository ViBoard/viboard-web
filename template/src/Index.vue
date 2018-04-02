<template>
  <div id="app">
    <FixedElements/>
    <Category title="Популярное"
              gridClass="grid-big"
              :nVideos="3"
              :ap="true"
              />
    <Category title="Актуальное"
              gridClass="grid-medium"
              :nVideos="3"
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
