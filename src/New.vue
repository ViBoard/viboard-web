<template>
  <Navigation>
    <Category title="Новое"
              gridClass="grid-small"
              :nVideos="33"
              :isPreview="true"
              :custom_player="false"
              method="new"
    />
  </Navigation>
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
        created: function () {
            document.title = 'Новое'
        },
    }

</script>

<style>
</style>
