<template>
  <div id="sidebar">
    <nav>
      <sidebar-link
        v-for="item in LinksList"
        v-bind:link="item"
        v-bind:key="item.id">
      </sidebar-link>
    </nav>
  </div>
</template>

<script>
import SidebarLink from './SidebarLink.vue'

export default {
  name: 'Sidebar',

  data: function() {
    return {
      LinksList: [
        { id: 0, text: 'Главное', href: '/', icon: 'home.png' },
        { id: 1, text: 'Новое', href: 'new', icon: 'new.png' },
        { id: 2, text: 'Выбор редакции', href: '#', icon: 'video.png' },
      ],
    }
  },

  components: {
    SidebarLink,
  },

}
</script>

<style>
#sidebar a, #sidebar div {
  padding-left: 1em;
  margin-top: 1em;
  padding-right: 3em;
  display: block;
}

nav {
  padding-top: 5em;
  position:fixed;
  /* background-color: #f5f5f5; */
}
</style>
