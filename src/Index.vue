<template>
  <div id="app">
    <FixedElements/>
    <Sidebar/>
    <Category title="Популярное"
              gridClass="grid-big"
              :nVideos="3"
              :ap="true"
              method="hot"
              />
    <Category title="Актуальное"
              gridClass="grid-medium"
              :nVideos="3"
              :isPreview="true"
              method="trending"
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
    },
  }

</script>

<style>
#app {
  padding-top: 4em;
}
</style>
