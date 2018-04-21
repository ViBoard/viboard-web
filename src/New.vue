<template>
  <div id="app">
    <Navigation/>
    <AppInner>
      <Category title="Новое"
                gridClass="grid-small"
                :nVideos="36"
                :isPreview="true"
                :custom_player="false"
                method="new"
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
    }
  }

</script>

<style>
</style>
