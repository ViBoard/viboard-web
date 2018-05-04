<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <Category title="Лента"
                gridClass="grid-medium"
                :nVideos="3"
                :ap="false"
                method="lenta"
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
