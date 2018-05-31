<template>
  <Navigation>
    <Category title="Лента"
              gridClass="grid-medium"
              :nVideos="3"
              :ap="false"
              method="lenta"
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
            document.title = 'Лента'
        },
    }

</script>

<style>
</style>
