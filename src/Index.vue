<template>
  <Navigation>
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
  </Navigation>
</template>

<script>
    import Category from './Category.vue'
    import Navigation from './Navigation.vue'
    
    export default {
        name: 'app',
        components: {
            Category,
            Navigation,
        },
        
        created: function () {
            document.title = 'Главная'
        },
    }

</script>

<style>
</style>
