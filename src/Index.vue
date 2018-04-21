<template>
  <div id="app">
    <Navigation/>
    <AppInner>
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
    </AppInner>
  </div>
</template>

<script>
  import Navigation from './Navigation.vue'
  import Category from './Category.vue'
  import AppInner from './AppInner.vue'

  export default {
    name: 'app',
    components: {
      Navigation,
      Category,
      AppInner,
    },
  }

</script>

<style>
</style>
