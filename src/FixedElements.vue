<template>
  <div>
    <HeaderComponent/>
    <Sidebar :links-list="LinksList"/>
  </div>
</template>

<script>
import HeaderComponent from './HeaderComponent.vue'
import Sidebar from './Sidebar.vue'

export default {
  name: 'FixedElements',

  components: {
    Sidebar,
    HeaderComponent,
  },

  data: function() {
    return {
      LinksList: [
        { id: 0, text: 'Главное', href: '/', icon: 'home.png' },
        { id: 1, text: 'Новое', href: 'new', icon: 'new.png' },
        { id: 2, text: 'Выбор редакции', href: '#', icon: 'video.png' },
      ],
    }
  }
}
</script>

<style>
</style>
